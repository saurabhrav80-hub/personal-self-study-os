import { i as __toESM } from "../_runtime.mjs";
import { i as downloadBlob } from "./utils-DZ4IgiFc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as requireDb } from "./db-BgFybTin.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as createExam, G as updateExam, K as useAllExams, P as patchSettings, ft as useSettingsLive, l as Field, lt as useReadiness, m as removeStarterQuestions, p as Button, u as Input } from "./router-Cbj4RZlk.mjs";
import { t as Card } from "./card-DFaudOAO.mjs";
import { n as Screen, r as SectionLabel } from "./empty-r3dgi-HO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-D1ulNYTD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BACKUP_VERSION = 1;
async function exportBackup(includeFiles) {
	const db = requireDb();
	const [exams, subjects, books, chapters, topics, concepts, conceptLinks, notes, formulas, questions, attempts, mistakes, revisionItems, studySessions, mocks, mockResults, highlights, bookmarks, pageTexts, settings] = await Promise.all([
		db.exams.toArray(),
		db.subjects.toArray(),
		db.books.toArray(),
		db.chapters.toArray(),
		db.topics.toArray(),
		db.concepts.toArray(),
		db.conceptLinks.toArray(),
		db.notes.toArray(),
		db.formulas.toArray(),
		db.questions.toArray(),
		db.attempts.toArray(),
		db.mistakes.toArray(),
		db.revisionItems.toArray(),
		db.studySessions.toArray(),
		db.mocks.toArray(),
		db.mockResults.toArray(),
		db.highlights.toArray(),
		db.bookmarks.toArray(),
		db.pageTexts.toArray(),
		db.settings.toArray()
	]);
	const payload = {
		app: "personal-self-study-os",
		version: BACKUP_VERSION,
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		exams,
		subjects,
		books,
		chapters,
		topics,
		concepts,
		conceptLinks,
		notes,
		formulas,
		questions,
		attempts,
		mistakes,
		revisionItems,
		studySessions,
		mocks,
		mockResults,
		highlights,
		bookmarks,
		pageTexts,
		settings
	};
	if (includeFiles) {
		const files = await db.bookFiles.toArray();
		const encoded = [];
		for (const f of files) {
			const buf = await f.blob.arrayBuffer();
			encoded.push({
				bookId: f.bookId,
				mimeType: f.mimeType,
				data: arrayBufferToBase64(buf)
			});
		}
		payload.bookFiles = encoded;
	}
	const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
	const stamp = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	downloadBlob(blob, `study-os-backup-${stamp}.json`);
}
async function importBackup(file) {
	const text = await file.text();
	let data;
	try {
		data = JSON.parse(text);
	} catch {
		throw new Error("That file is not valid JSON.");
	}
	if (data.app !== "personal-self-study-os") throw new Error("This JSON is not a Personal Self-Study OS backup.");
	const db = requireDb();
	const restored = [];
	const load = async (key, table) => {
		const rows = data[key];
		if (!Array.isArray(rows) || !rows.length) return;
		await table.bulkPut(rows);
		restored.push(`${key} (${rows.length})`);
	};
	await db.transaction("rw", [
		db.exams,
		db.subjects,
		db.books,
		db.chapters,
		db.topics,
		db.concepts,
		db.conceptLinks,
		db.notes,
		db.formulas,
		db.questions,
		db.attempts,
		db.mistakes,
		db.revisionItems,
		db.studySessions,
		db.mocks,
		db.mockResults,
		db.highlights,
		db.bookmarks,
		db.pageTexts,
		db.settings,
		db.bookFiles
	], async () => {
		await load("exams", db.exams);
		await load("subjects", db.subjects);
		await load("books", db.books);
		await load("chapters", db.chapters);
		await load("topics", db.topics);
		await load("concepts", db.concepts);
		await load("conceptLinks", db.conceptLinks);
		await load("notes", db.notes);
		await load("formulas", db.formulas);
		await load("questions", db.questions);
		await load("attempts", db.attempts);
		await load("mistakes", db.mistakes);
		await load("revisionItems", db.revisionItems);
		await load("studySessions", db.studySessions);
		await load("mocks", db.mocks);
		await load("mockResults", db.mockResults);
		await load("highlights", db.highlights);
		await load("bookmarks", db.bookmarks);
		await load("pageTexts", db.pageTexts);
		await load("settings", db.settings);
	});
	const files = data.bookFiles;
	if (Array.isArray(files)) {
		for (const f of files) {
			if (!f?.bookId || !f.data) continue;
			const blob = new Blob([base64ToBytes(f.data)], { type: f.mimeType || "application/pdf" });
			await db.bookFiles.put({
				bookId: f.bookId,
				blob,
				mimeType: f.mimeType
			});
		}
		restored.push(`book files (${files.length})`);
	}
	return { restored };
}
function arrayBufferToBase64(buffer) {
	const bytes = new Uint8Array(buffer);
	const chunk = 32768;
	let binary = "";
	for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
	return btoa(binary);
}
function base64ToBytes(b64) {
	const binary = atob(b64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	return bytes.buffer;
}
function SettingsPage() {
	const settings = useSettingsLive();
	const exams = useAllExams();
	const readiness = useReadiness();
	const [newExam, setNewExam] = (0, import_react.useState)("");
	const [includeFiles, setIncludeFiles] = (0, import_react.useState)(false);
	if (!settings) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, { title: "Settings" });
	const weights = settings.readinessWeights;
	const wsum = Object.values(weights).reduce((s, n) => s + n, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: "Profile",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "You" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Display name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					defaultValue: settings.displayName,
					onBlur: (e) => patchSettings({ displayName: e.target.value })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Appearance" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 grid grid-cols-3 gap-2",
				children: [
					"light",
					"dark",
					"system"
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => patchSettings({ theme: t }),
					className: `h-11 rounded-xl capitalize ${settings.theme === t ? "bg-ink text-paper" : "bg-surface shadow-[var(--shadow-border)]"}`,
					children: t
				}, t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Exams" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mb-4 space-y-2",
				children: exams.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "space-y-2 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "bg-transparent font-medium outline-none",
								defaultValue: e.name,
								onBlur: (ev) => updateExam(e.id, { name: ev.target.value })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-xs text-muted",
								children: ["Active", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: e.active,
									onChange: (ev) => updateExam(e.id, { active: ev.target.checked })
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Exam date",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										defaultValue: e.date ? new Date(e.date).toISOString().slice(0, 10) : "",
										onChange: (ev) => updateExam(e.id, { date: ev.target.value ? new Date(ev.target.value).getTime() : null })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Priority 1–5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										min: 1,
										max: 5,
										defaultValue: e.priority,
										onBlur: (ev) => updateExam(e.id, { priority: Number(ev.target.value) || 3 })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Target score",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										defaultValue: e.targetScore ?? "",
										onBlur: (ev) => updateExam(e.id, { targetScore: ev.target.value ? Number(ev.target.value) : null })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Target time / Q (sec)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										defaultValue: Math.round((settings.targetTimes[e.id] ?? 12e4) / 1e3),
										onBlur: (ev) => patchSettings({ targetTimes: {
											...settings.targetTimes,
											[e.id]: Number(ev.target.value) * 1e3
										} })
									})
								})
							]
						}),
						(() => {
							const r = readiness.find((x) => x.examId === e.id);
							if (!r) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-subtle",
								children: [
									"Components — knowledge ",
									dash(r.knowledge),
									", accuracy ",
									dash(r.accuracy),
									", speed ",
									dash(r.speed),
									", retention ",
									dash(r.retention),
									", mock ",
									dash(r.mock),
									", coverage ",
									dash(r.weak)
								]
							});
						})()
					]
				}) }, e.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Add exam (GMAT, FRM, …)",
					value: newExam,
					onChange: (e) => setNewExam(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: async () => {
						if (!newExam.trim()) return;
						await createExam({ name: newExam.trim() });
						setNewExam("");
					},
					children: "Add"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionLabel, { children: [
				"Readiness weights (must sum conceptually; currently ",
				wsum,
				")"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 grid grid-cols-2 gap-2",
				children: Object.keys(weights).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: k,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						defaultValue: weights[k],
						onBlur: (e) => patchSettings({ readinessWeights: {
							...weights,
							[k]: Number(e.target.value) || 0
						} })
					})
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Data" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mb-3 flex min-h-11 items-center gap-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: includeFiles,
					onChange: (e) => setIncludeFiles(e.target.checked)
				}), "Include PDF files in export (can be large)"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => exportBackup(includeFiles),
						children: "Export backup"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "inline-flex h-11 items-center rounded-lg bg-surface-2 px-4 text-sm font-medium",
						children: ["Import backup", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "application/json",
							className: "hidden",
							onChange: async (e) => {
								const f = e.target.files?.[0];
								if (!f) return;
								try {
									const r = await importBackup(f);
									toast.success(`Restored ${r.restored.join(", ") || "data"}.`);
								} catch (err) {
									toast.error(err instanceof Error ? err.message : "Import failed.");
								}
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: async () => {
							if (!confirm("Remove starter questions from the bank?")) return;
							await removeStarterQuestions(requireDb());
							toast.success("Starter questions removed.");
						},
						children: "Remove starter questions"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Privacy" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Core study data is stored in this browser (IndexedDB). No account is required. Uploaded books are not sent anywhere unless you explicitly run an AI action such as Ask My Books, which then sends only the matching excerpts you already searched locally."
			})
		]
	});
}
function dash(n) {
	return n == null ? "—" : `${n}%`;
}
var SplitComponent = SettingsPage;
//#endregion
export { SplitComponent as component };
