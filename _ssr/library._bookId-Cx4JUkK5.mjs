import { i as __toESM } from "../_runtime.mjs";
import { c as nid } from "./utils-DZ4IgiFc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as requireDb } from "./db-BgFybTin.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { A as deleteBook, J as useBook, R as saveChapters, V as setTopicStatus, Z as useChapters, d as NativeSelect, et as useExams, i as Route$3, k as createQuestion, l as Field, mt as useTopics, p as Button, rt as useKnowledgeMap } from "./router-Cbj4RZlk.mjs";
import { t as Card } from "./card-DFaudOAO.mjs";
import { n as Screen, t as EmptyState } from "./empty-r3dgi-HO.mjs";
import { r as StatusChip, t as KnowledgeBar } from "./status-chip-D6Vtg5N-.mjs";
import { r as generateChapterQuestions } from "./study-ai-C_RQQsJM.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-CoFLxguO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library._bookId-Cx4JUkK5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BookPage({ bookId }) {
	const book = useBook(bookId);
	const chapters = useChapters(bookId);
	const topics = useTopics({ bookId });
	const exams = useExams();
	const knowledge = useKnowledgeMap();
	const [aiOpen, setAiOpen] = (0, import_react.useState)(null);
	const navigate = useNavigate();
	if (!book) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "Book",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Book not found",
			body: "It may have been removed from this device."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: book.name,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/read/$bookId",
			params: { bookId },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				children: "Read"
			})
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-4 text-sm text-muted",
				children: [
					exams.find((e) => e.id === book.examId)?.name ?? "Unassigned",
					book.author ? ` · ${book.author}` : "",
					book.edition ? ` · ${book.edition}` : "",
					book.pageCount ? ` · ${book.pageCount} pages` : ""
				]
			}),
			book.extractionNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mb-4 p-4 text-sm text-muted",
				children: book.extractionNote
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/read/$bookId",
						params: { bookId },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Open reader" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => addChapter(bookId, chapters),
						children: "Add chapter"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: async () => {
							if (!confirm("Delete this book and its local file?")) return;
							await deleteBook(bookId);
							toast.success("Book removed from this device.");
							navigate({ to: "/library" });
						},
						children: "Delete"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: chapters.map((ch) => {
					const chTopics = topics.filter((t) => t.chapterId === ch.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: ch.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										"pp. ",
										ch.pageStart,
										"–",
										ch.pageEnd
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: ch.status })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 space-y-2",
								children: chTopics.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-surface-2 p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-1.5 flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium",
												children: t.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: t.status })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KnowledgeBar, { score: knowledge[t.id] ?? 0 }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex flex-wrap gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "ghost",
													onClick: () => setTopicStatus(t.id, "reading"),
													children: "Reading"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/read/$bookId",
													params: { bookId },
													search: { page: t.pageStart ?? ch.pageStart },
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "ghost",
														children: "Open"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
													to: "/practice/run",
													search: {
														mode: "topic",
														topicId: t.id
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "sm",
														variant: "ghost",
														children: "Practice"
													})
												})
											]
										})
									]
								}, t.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "mt-3",
								onClick: () => setAiOpen(ch.id),
								children: "Generate questions"
							})
						]
					}, ch.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!aiOpen,
				onOpenChange: (o) => !o && setAiOpen(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					title: "Generate questions",
					children: aiOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GenerateForm, {
						bookId,
						bookName: book.name,
						chapter: chapters.find((c) => c.id === aiOpen),
						examId: book.examId,
						onDone: () => setAiOpen(null)
					}) : null
				})
			})
		]
	});
}
async function addChapter(bookId, existing) {
	const title = prompt("Chapter title");
	if (!title?.trim()) return;
	const start = Number(prompt("Start page", "1") ?? "1");
	const end = Number(prompt("End page", String(start)) ?? start);
	const ch = {
		id: nid(),
		bookId,
		title: title.trim(),
		pageStart: start || 1,
		pageEnd: end || start || 1,
		order: existing.length,
		status: "not_started"
	};
	await saveChapters(bookId, [...existing, ch]);
}
function GenerateForm({ bookId, bookName, chapter, examId, onDone }) {
	const [diff, setDiff] = (0, import_react.useState)("mixed");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [drafts, setDrafts] = (0, import_react.useState)([]);
	const run = async () => {
		setBusy(true);
		try {
			const text = (await requireDb().pageTexts.where("bookId").equals(bookId).toArray()).filter((p) => p.page >= chapter.pageStart && p.page <= chapter.pageEnd).map((p) => p.text).join("\n");
			const res = await generateChapterQuestions({ data: {
				chapterTitle: chapter.title,
				bookName,
				difficulty: diff,
				text
			} });
			if (!res.ok) {
				toast.error(res.error);
				return;
			}
			const list = (JSON.parse(res.text.replace(/```json|```/g, "").trim()).questions ?? []).map((raw) => ({
				id: nid(),
				type: raw.type ?? "mcq",
				stem: raw.stem,
				options: raw.options ?? [],
				correctAnswer: raw.correctAnswer,
				explanation: raw.explanation,
				examId,
				subjectId: null,
				chapterId: chapter.id,
				topicId: null,
				bookId,
				page: chapter.pageStart,
				difficulty: raw.difficulty ?? "medium",
				source: "ai",
				tags: ["ai"],
				createdAt: Date.now()
			}));
			if (!list.length) {
				toast.error("No questions were returned. Nothing was added to the bank.");
				return;
			}
			setDrafts(list);
		} catch {
			toast.error("Could not parse generated questions. Nothing was saved.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "Generated by AI from extracted chapter text. Review before they enter the question bank."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Difficulty",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: diff,
					onChange: (e) => setDiff(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "easy",
							children: "Easy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "medium",
							children: "Medium"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "hard",
							children: "Hard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "mixed",
							children: "Mixed"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				disabled: busy,
				onClick: run,
				children: busy ? "Generating…" : "Generate from this chapter"
			}),
			drafts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: d.stem
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-[11px] text-subtle",
					children: ["Answer: ", d.correctAnswer]
				})]
			}, d.id)),
			drafts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				onClick: async () => {
					for (const d of drafts) {
						const { id: _id, createdAt: _c, ...rest } = d;
						await createQuestion(rest);
					}
					toast.success(`${drafts.length} saved.`);
					onDone();
				},
				children: "Save to question bank"
			}) : null
		]
	});
}
function BookDetail() {
	const { bookId } = Route$3.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookPage, { bookId });
}
//#endregion
export { BookDetail as component };
