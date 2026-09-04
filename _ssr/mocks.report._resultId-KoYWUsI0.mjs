import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as analyzeMock, _ as MISTAKE_LABEL, at as useMockResults, ct as useQuestions, ht as whyLosingMarks, it as useMistakes, n as Route, ot as useMocks } from "./router-Cbj4RZlk.mjs";
import { t as Card } from "./card-DFaudOAO.mjs";
import { n as Screen, r as SectionLabel, t as EmptyState } from "./empty-r3dgi-HO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mocks.report._resultId-KoYWUsI0.js
var import_jsx_runtime = require_jsx_runtime();
function MockReportPage({ resultId }) {
	const results = useMockResults();
	const mocks = useMocks();
	const questions = useQuestions();
	const mistakes = useMistakes();
	const result = results.find((r) => r.id === resultId);
	const mock = mocks.find((m) => m.id === result?.mockId);
	if (!result || !mock) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "Report",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Report not found",
			body: "This result is not on this device."
		})
	});
	const qset = questions.filter((q) => mock.questionIds.includes(q.id));
	const relatedMistakes = mistakes.filter((m) => result.answers.some((a) => a.questionId === m.questionId && m.createdAt >= result.startedAt && m.createdAt <= result.submittedAt + 5e3));
	const insight = analyzeMock({
		result,
		questions: qset,
		mistakes: relatedMistakes,
		timeLimitMin: mock.timeLimitMin,
		sections: mock.sections.length ? mock.sections : [{
			name: "Paper",
			questionIds: mock.questionIds
		}]
	});
	const cats = whyLosingMarks(relatedMistakes);
	const byDiff = {
		easy: {
			c: 0,
			n: 0
		},
		medium: {
			c: 0,
			n: 0
		},
		hard: {
			c: 0,
			n: 0
		}
	};
	for (const a of result.answers) {
		const q = qset.find((x) => x.id === a.questionId);
		if (!q || a.skipped) continue;
		const ok = a.answer === q.correctAnswer;
		byDiff[q.difficulty].n += 1;
		if (ok) byDiff[q.difficulty].c += 1;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: mock.name,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mb-4 text-sm text-muted",
				children: ["Submitted ", new Date(result.submittedAt).toLocaleString()]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 grid grid-cols-2 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Score",
						value: `${result.score.toFixed(1)}/${result.maxScore}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Accuracy",
						value: `${Math.round(result.accuracy)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Attempt rate",
						value: `${Math.round(result.attemptRate)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Time used",
						value: `${Math.round(result.timeEfficiency)}%`
					})
				]
			}),
			mock.sections.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Sections" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mb-5 space-y-2",
				children: mock.sections.map((s) => {
					const rows = result.answers.filter((a) => s.questionIds.includes(a.questionId) && a.answer);
					const correct = rows.filter((a) => {
						const q = qset.find((x) => x.id === a.questionId);
						return q && a.answer === q.correctAnswer;
					}).length;
					const acc = rows.length ? correct / rows.length * 100 : 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "flex items-center justify-between p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular text-sm",
							children: [
								Math.round(acc),
								"% · ",
								rows.length,
								" att."
							]
						})]
					}) }, s.name);
				})
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Difficulty" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 grid grid-cols-3 gap-2 text-center text-sm",
				children: [
					"easy",
					"medium",
					"hard"
				].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "capitalize text-muted",
						children: d
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "tabular font-display text-lg",
						children: byDiff[d].n ? `${Math.round(byDiff[d].c / byDiff[d].n * 100)}%` : "—"
					})]
				}, d))
			}),
			cats.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Why marks leaked" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mb-5 space-y-1",
				children: cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: MISTAKE_LABEL[c.category] ?? c.category }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular",
						children: c.count
					})]
				}, c.category))
			})] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "What went wrong" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
				items: insight.wentWrong,
				empty: "No negative pattern was strong enough to call from this sitting."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "What went well" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
				items: insight.wentWell,
				empty: "Not enough positive signal to highlight yet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Fix next" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
				items: insight.fixNext,
				empty: "Sit another mock after more topic practice."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/mocks",
				className: "mt-4 inline-block text-sm text-muted",
				children: "Back to mocks"
			})
		]
	});
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl tabular",
			children: value
		})]
	});
}
function List({ items, empty }) {
	if (!items.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mb-5 text-sm text-muted",
		children: empty
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mb-5 space-y-2",
		children: items.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "rounded-2xl bg-surface px-4 py-3 text-sm shadow-[var(--shadow-border)]",
			children: t
		}, t))
	});
}
function Page() {
	const { resultId } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MockReportPage, { resultId });
}
//#endregion
export { Page as component };
