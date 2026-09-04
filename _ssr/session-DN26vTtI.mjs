import { i as __toESM } from "../_runtime.mjs";
import { a as formatDuration } from "./utils-DZ4IgiFc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { H as startSession, M as endSession, d as NativeSelect, dt as useSessions, et as useExams, l as Field, mt as useTopics, p as Button, u as Input } from "./router-Cbj4RZlk.mjs";
import { t as Card } from "./card-DFaudOAO.mjs";
import { n as Screen } from "./empty-r3dgi-HO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-DN26vTtI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SessionPage() {
	const exams = useExams();
	const topics = useTopics();
	const sessions = useSessions();
	const active = sessions.find((s) => !s.endedAt);
	const [examId, setExamId] = (0, import_react.useState)(exams[0]?.id ?? "");
	const [topicId, setTopicId] = (0, import_react.useState)("");
	const [minutes, setMinutes] = (0, import_react.useState)(45);
	const [now, setNow] = (0, import_react.useState)(Date.now());
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => setNow(Date.now()), 1e3);
		return () => clearInterval(t);
	}, []);
	if (active) {
		const elapsed = now - active.startedAt;
		const planned = active.plannedMin * 6e4;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
			title: "Study session",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-4xl tabular",
					children: formatDuration(elapsed)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						"Planned ",
						active.plannedMin,
						" min · ",
						active.title
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-sm",
					children: [
						"Questions ",
						active.questionsSolved,
						active.questionsSolved ? ` · ${Math.round(active.correctCount / active.questionsSolved * 100)}% accuracy` : ""
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/practice/run",
						search: {
							mode: "topic",
							topicId: active.topicId ?? void 0,
							sessionId: active.id
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							children: "Practice in this session"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => endSession(active.id),
						children: "End session"
					})]
				}),
				elapsed > planned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs text-warn",
					children: "Past the planned duration."
				}) : null
			]
		});
	}
	const last = sessions[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: "Start session",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Exam",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
						value: examId,
						onChange: (e) => setExamId(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "None"
						}), exams.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: e.id,
							children: e.name
						}, e.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Topic",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
						value: topicId,
						onChange: (e) => setTopicId(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "General"
						}), topics.filter((t) => !examId || t.examId === examId).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: t.id,
							children: t.title
						}, t.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Duration (minutes)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "number",
						value: minutes,
						onChange: (e) => setMinutes(Number(e.target.value))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					size: "lg",
					onClick: async () => {
						const topic = topics.find((t) => t.id === topicId);
						const exam = exams.find((e) => e.id === examId);
						await startSession({
							examId: examId || null,
							topicId: topicId || null,
							title: [exam?.name, topic?.title ?? "Study"].filter(Boolean).join(" — "),
							plannedMin: minutes || 25
						});
					},
					children: "Start"
				})
			]
		}), last?.endedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-8 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle uppercase",
					children: "Last session"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-medium",
					children: last.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						formatDuration(last.endedAt - last.startedAt),
						" · ",
						last.questionsSolved,
						" questions",
						last.questionsSolved ? ` · ${Math.round(last.correctCount / last.questionsSolved * 100)}%` : ""
					]
				})
			]
		}) : null]
	});
}
var SplitComponent = SessionPage;
//#endregion
export { SplitComponent as component };
