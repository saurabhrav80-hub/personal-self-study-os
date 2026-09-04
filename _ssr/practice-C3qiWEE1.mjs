import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { U as topicAnalytics, ct as useQuestions, et as useExams, ft as useSettingsLive, it as useMistakes, mt as useTopics, p as Button, q as useAttempts, v as PATTERN_COPY } from "./router-Cbj4RZlk.mjs";
import { t as Card } from "./card-DFaudOAO.mjs";
import { n as Screen, r as SectionLabel, t as EmptyState } from "./empty-r3dgi-HO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/practice-C3qiWEE1.js
var import_jsx_runtime = require_jsx_runtime();
function PracticePage() {
	const exams = useExams();
	const questions = useQuestions();
	const attempts = useAttempts();
	const topics = useTopics();
	const mistakes = useMistakes();
	const settings = useSettingsLive();
	const analytics = topicAnalytics(topics, questions, attempts, settings?.targetTimes ?? {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: "Practice",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/questions/new",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				children: "Add question"
			})
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Modes" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 grid grid-cols-2 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mode, {
						search: { mode: "exam" },
						label: "By exam"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mode, {
						search: { mode: "topic" },
						label: "By topic"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mode, {
						search: { mode: "difficulty" },
						label: "By difficulty"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mode, {
						search: { mode: "weak" },
						label: "Weak areas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mode, {
						search: { mode: "random" },
						label: "Random"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mode, {
						search: {
							mode: "timed",
							timed: "1"
						},
						label: "Timed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mode, {
						search: { mode: "custom" },
						label: "Custom set"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/mocks",
						className: "flex min-h-14 items-center justify-center rounded-2xl bg-surface px-3 text-center text-sm font-medium shadow-[var(--shadow-border)]",
						children: "Mocks"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 grid grid-cols-3 gap-2 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						n: questions.length,
						l: "Questions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						n: attempts.length,
						l: "Attempts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						n: mistakes.length,
						l: "Mistakes"
					})
				]
			}),
			questions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Question bank is empty",
				body: "Add questions manually, keep the starter set, or generate from a chapter after uploading a book.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/questions/new",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Create a question" })
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Topic analyzer" }),
			analytics.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-6 text-sm text-muted",
				children: "Practice a few items to see accuracy, speed, and patterns."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mb-6 space-y-2",
				children: analytics.slice(0, 8).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/practice/run",
					search: {
						mode: "topic",
						topicId: a.topicId
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: a.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "tabular text-sm",
								children: [a.accuracy.toFixed(0), "%"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: [
								a.questions,
								" attempts · avg ",
								Math.round(a.avgTimeMs / 1e3),
								"s · ",
								PATTERN_COPY[a.pattern]
							]
						})]
					})
				}) }, a.topicId))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/mistakes",
					className: "rounded-xl bg-surface p-4 text-sm font-medium shadow-[var(--shadow-border)]",
					children: "Mistake intelligence"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/insights",
					className: "rounded-xl bg-surface p-4 text-sm font-medium shadow-[var(--shadow-border)]",
					children: "Speed lab"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Bank by exam" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: exams.map((e) => {
					const n = questions.filter((q) => q.examId === e.id).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/practice/run",
						search: {
							mode: "exam",
							examId: e.id
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "flex items-center justify-between p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: e.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm text-muted",
								children: [n, " questions"]
							})]
						})
					}) }, e.id);
				})
			})
		]
	});
}
function Mode({ search, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/practice/run",
		search,
		className: "flex min-h-14 items-center justify-center rounded-2xl bg-surface px-3 text-center text-sm font-medium shadow-[var(--shadow-border)]",
		children: label
	});
}
function Stat({ n, l }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-surface py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl tabular",
			children: n
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-subtle",
			children: l
		})]
	});
}
var SplitComponent = PracticePage;
//#endregion
export { SplitComponent as component };
