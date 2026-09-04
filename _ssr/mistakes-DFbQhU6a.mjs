import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { T as classifyMistake, _ as MISTAKE_LABEL, ct as useQuestions, d as NativeSelect, g as MISTAKE_CATEGORIES, ht as whyLosingMarks, it as useMistakes, mt as useTopics } from "./router-Cbj4RZlk.mjs";
import { n as Screen, r as SectionLabel, t as EmptyState } from "./empty-r3dgi-HO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mistakes-DFbQhU6a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MistakesPage() {
	const mistakes = useMistakes();
	const questions = useQuestions();
	const topics = useTopics();
	const [cat, setCat] = (0, import_react.useState)("all");
	const qmap = (0, import_react.useMemo)(() => new Map(questions.map((q) => [q.id, q])), [questions]);
	const tmap = (0, import_react.useMemo)(() => new Map(topics.map((t) => [t.id, t])), [topics]);
	const cats = whyLosingMarks(mistakes);
	const byTopic = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		for (const x of mistakes) {
			if (!x.topicId) continue;
			m.set(x.topicId, (m.get(x.topicId) ?? 0) + 1);
		}
		return [...m.entries()].sort((a, b) => b[1] - a[1]);
	}, [mistakes]);
	const shown = cat === "all" ? mistakes : mistakes.filter((m) => m.category === cat);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: "Mistakes",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-muted",
			children: "Why am I losing marks? — from your own classified errors, not a generic list."
		}), mistakes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No mistakes recorded",
			body: "Incorrect practice and mock answers appear here once you classify them."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Top leak categories" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mb-4 space-y-1",
				children: cats.slice(0, 6).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: MISTAKE_LABEL[c.category] ?? c.category }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular",
						children: c.count
					})]
				}, c.category))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Topics" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mb-4 space-y-1",
				children: byTopic.slice(0, 8).map(([id, n]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/practice/run",
					search: {
						mode: "topic",
						topicId: id
					},
					className: "flex justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tmap.get(id)?.title ?? "Topic" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular",
						children: n
					})]
				}) }, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
				className: "mb-3",
				value: cat,
				onChange: (e) => setCat(e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "all",
					children: "All categories"
				}), MISTAKE_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: c,
					children: MISTAKE_LABEL[c]
				}, c))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: shown.map((m) => {
					const q = qmap.get(m.questionId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: q?.stem ?? "Question removed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									"You: ",
									m.userAnswer,
									" · Correct: ",
									m.correctAnswer,
									" · ",
									Math.round(m.timeMs / 1e3),
									"s"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
								className: "mt-2",
								value: m.category,
								onChange: (e) => classifyMistake(m.id, e.target.value),
								children: MISTAKE_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c,
									children: MISTAKE_LABEL[c]
								}, c))
							})
						]
					}, m.id);
				})
			})
		] })]
	});
}
var SplitComponent = MistakesPage;
//#endregion
export { SplitComponent as component };
