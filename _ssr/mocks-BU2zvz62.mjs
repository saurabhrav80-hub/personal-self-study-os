import { i as __toESM } from "../_runtime.mjs";
import { d as shuffle } from "./utils-DZ4IgiFc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { O as createMock, at as useMockResults, ct as useQuestions, d as NativeSelect, et as useExams, l as Field, mt as useTopics, ot as useMocks, p as Button, u as Input } from "./router-Cbj4RZlk.mjs";
import { t as Card } from "./card-DFaudOAO.mjs";
import { n as Screen, t as EmptyState } from "./empty-r3dgi-HO.mjs";
import { n as DialogContent, r as DialogTrigger, t as Dialog } from "./dialog-CoFLxguO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mocks-BU2zvz62.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MocksPage() {
	const mocks = useMocks();
	const results = useMockResults();
	useExams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "Mocks",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateMockButton, {}),
		children: mocks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No mock tests yet",
			body: "Build a full, sectional, topic, or custom mock from your local question bank. Timing and scoring stay on this device.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateMockButton, {})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: mocks.map((m) => {
				const last = results.find((r) => r.mockId === m.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: m.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									m.kind,
									" · ",
									m.questionIds.length,
									" questions · ",
									m.timeLimitMin,
									" min",
									m.negativeMarking ? ` · −${m.negativeMarking}` : ""
								]
							}),
							last ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted",
								children: [
									"Last: ",
									Math.round(last.accuracy),
									"% accuracy · ",
									last.score.toFixed(1),
									"/",
									last.maxScore
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-subtle",
								children: "Not attempted"
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/mocks/run",
							search: { mockId: m.id },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								children: "Start"
							})
						})]
					}), last ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/mocks/report/$resultId",
						params: { resultId: last.id },
						className: "mt-2 inline-block text-xs text-muted",
						children: "Open last report"
					}) : null]
				}) }, m.id);
			})
		})
	});
}
function CreateMockButton() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				children: "New mock"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			title: "Create mock",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateMockForm, { onDone: () => setOpen(false) })
		})]
	});
}
function CreateMockForm({ onDone }) {
	const exams = useExams();
	const questions = useQuestions();
	const topics = useTopics();
	const [name, setName] = (0, import_react.useState)("Mock");
	const [kind, setKind] = (0, import_react.useState)("full");
	const [examId, setExamId] = (0, import_react.useState)(exams[0]?.id ?? "");
	const [topicId, setTopicId] = (0, import_react.useState)("");
	const [count, setCount] = (0, import_react.useState)(10);
	const [minutes, setMinutes] = (0, import_react.useState)(20);
	const [neg, setNeg] = (0, import_react.useState)(.33);
	const [diff, setDiff] = (0, import_react.useState)("mixed");
	const submit = async () => {
		let pool = questions.filter((q) => !examId || q.examId === examId);
		if (kind === "topic" && topicId) pool = pool.filter((q) => q.topicId === topicId);
		if (diff !== "mixed") pool = pool.filter((q) => q.difficulty === diff);
		const picked = shuffle(pool).slice(0, count).map((q) => q.id);
		if (picked.length < 3) {
			toast.error("Need at least 3 matching questions in the bank.");
			return;
		}
		if (picked.length < count) toast.message(`Only ${picked.length} questions matched. Using those.`);
		const sections = kind === "sectional" && examId ? groupSections(picked, questions.filter((q) => picked.includes(q.id))) : [];
		await createMock({
			name: name.trim() || "Mock",
			kind,
			examId: examId || null,
			questionIds: picked,
			timeLimitMin: minutes,
			negativeMarking: neg,
			marksCorrect: 1,
			sections,
			difficulty: diff
		});
		toast.success("Mock saved locally.");
		onDone();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Type",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: kind,
					onChange: (e) => setKind(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "full",
							children: "Full mock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "sectional",
							children: "Sectional"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "topic",
							children: "Topic"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "custom",
							children: "Custom"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Exam",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: examId,
					onChange: (e) => setExamId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Any"
					}), exams.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: e.id,
						children: e.name
					}, e.id))]
				})
			}),
			kind === "topic" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Topic",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: topicId,
					onChange: (e) => setTopicId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Select"
					}), topics.filter((t) => !examId || t.examId === examId).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: t.id,
						children: t.title
					}, t.id))]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Questions",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value: count,
					onChange: (e) => setCount(Number(e.target.value))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Time (minutes)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value: minutes,
					onChange: (e) => setMinutes(Number(e.target.value))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Negative mark (per wrong)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					step: "0.01",
					value: neg,
					onChange: (e) => setNeg(Number(e.target.value))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Difficulty",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: diff,
					onChange: (e) => setDiff(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "mixed",
							children: "Mixed"
						}),
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
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				onClick: submit,
				children: "Create"
			})
		]
	});
}
function groupSections(ids, questions) {
	const map = /* @__PURE__ */ new Map();
	for (const id of ids) {
		const key = questions.find((x) => x.id === id)?.subjectId ?? "Section";
		const list = map.get(key) ?? [];
		list.push(id);
		map.set(key, list);
	}
	return [...map.entries()].map(([name, questionIds]) => ({
		name: name === "Section" ? "Main" : name,
		questionIds,
		timeMin: null
	}));
}
var SplitComponent = MocksPage;
//#endregion
export { SplitComponent as component };
