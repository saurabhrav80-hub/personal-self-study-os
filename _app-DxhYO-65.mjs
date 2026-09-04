import { s as greeting, u as relativeDay } from "./_ssr/utils-DZ4IgiFc.mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { l as Play, v as ArrowRight } from "./_libs/lucide-react.mjs";
import { X as useBooks, ct as useQuestions, et as useExams, ft as useSettingsLive, it as useMistakes, lt as useReadiness, mt as useTopics, p as Button, q as useAttempts, rt as useKnowledgeMap, ut as useRevisions, w as buildPriorities } from "./_ssr/router-Cbj4RZlk.mjs";
import { t as Card } from "./_ssr/card-DFaudOAO.mjs";
import { n as Screen, r as SectionLabel, t as EmptyState } from "./_ssr/empty-r3dgi-HO.mjs";
import { t as AppLink } from "./_ssr/app-link-DdPLkHlO.mjs";
import { n as ReadinessRing } from "./_ssr/status-chip-D6Vtg5N-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-DxhYO-65.js
var import_jsx_runtime = require_jsx_runtime();
function HomePage() {
	const exams = useExams();
	const books = useBooks();
	const topics = useTopics();
	const knowledge = useKnowledgeMap();
	const mistakes = useMistakes();
	const revisions = useRevisions();
	const questions = useQuestions();
	const attempts = useAttempts();
	const readiness = useReadiness();
	const settings = useSettingsLive();
	const priorities = buildPriorities({
		exams,
		topics,
		knowledgeByTopic: knowledge,
		mistakes,
		revisions,
		questions,
		attempts,
		booksCount: books.length
	});
	const hour = greeting();
	const name = settings?.displayName?.trim();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [hour, name ? `, ${name}` : ""]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl font-medium tracking-tight",
					children: "What should you study now?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Today's priorities" }),
			priorities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Nothing queued",
				body: "Add an exam, upload a book, or run a practice set and this list will fill from your actual data."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mb-8 space-y-2",
				children: priorities.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppLink, {
					href: p.href,
					className: "flex min-h-14 items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular w-6 font-display text-lg text-subtle",
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium text-fg",
								children: p.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-xs text-muted",
								children: [p.examName ? `${p.examName} · ` : "", p.reason]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 shrink-0 text-subtle" })
					]
				}) }, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/session",
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						size: "lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" }), "Start session"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/practice",
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						variant: "secondary",
						size: "lg",
						children: "Practice"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Exam readiness" }),
			exams.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No exams yet",
				body: "Add CFA, CAT, GRE, or any other exam in settings.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/settings",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Add exam" })
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: exams.map((exam) => {
					const r = readiness.find((x) => x.examId === exam.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xl font-medium",
									children: exam.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: exam.date ? `Exam ${relativeDay(exam.date)}` : "Date not set"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRing, { value: r?.overall ?? null })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Topics done",
										value: `${r?.topicsCompleted ?? 0}/${r?.topicsTotal ?? 0}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Weak",
										value: `${r?.topicsWeak ?? 0}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Revision due",
										value: `${r?.revisionDue ?? 0}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
										label: "Accuracy",
										value: r?.accuracy == null ? "—" : `${r.accuracy}%`
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-[11px] text-subtle",
								children: "Readiness is not syllabus completion. It weights knowledge, accuracy, speed, retention, mocks, and weak topics."
							})
						]
					}, exam.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniLink, {
						to: "/mocks",
						label: "Mocks"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniLink, {
						to: "/mistakes",
						label: "Mistakes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniLink, {
						to: "/formulas",
						label: "Formulas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniLink, {
						to: "/notes",
						label: "Notes"
					})
				]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-subtle",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "tabular font-medium text-fg",
		children: value
	})] });
}
function MiniLink({ to, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		className: "flex min-h-12 items-center justify-center rounded-xl bg-surface text-sm font-medium shadow-[var(--shadow-border)]",
		children: label
	});
}
var SplitComponent = HomePage;
//#endregion
export { SplitComponent as component };
