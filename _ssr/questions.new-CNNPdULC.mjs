import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as NativeSelect, et as useExams, f as Textarea, k as createQuestion, l as Field, mt as useTopics, p as Button, u as Input } from "./router-Cbj4RZlk.mjs";
import { n as Screen } from "./empty-r3dgi-HO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/questions.new-CNNPdULC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuestionNewPage() {
	const exams = useExams();
	const topics = useTopics();
	const navigate = useNavigate();
	const [type, setType] = (0, import_react.useState)("mcq");
	const [stem, setStem] = (0, import_react.useState)("");
	const [a, setA] = (0, import_react.useState)("");
	const [b, setB] = (0, import_react.useState)("");
	const [c, setC] = (0, import_react.useState)("");
	const [d, setD] = (0, import_react.useState)("");
	const [correct, setCorrect] = (0, import_react.useState)("a");
	const [explanation, setExplanation] = (0, import_react.useState)("");
	const [examId, setExamId] = (0, import_react.useState)(exams[0]?.id ?? "");
	const [topicId, setTopicId] = (0, import_react.useState)("");
	const [difficulty, setDifficulty] = (0, import_react.useState)("medium");
	const [numerical, setNumerical] = (0, import_react.useState)("");
	const save = async () => {
		if (!stem.trim()) {
			toast.error("Question text is required.");
			return;
		}
		const options = type === "mcq" ? [
			{
				id: "a",
				text: a
			},
			{
				id: "b",
				text: b
			},
			{
				id: "c",
				text: c
			},
			{
				id: "d",
				text: d
			}
		] : type === "tf" ? [{
			id: "true",
			text: "True"
		}, {
			id: "false",
			text: "False"
		}] : [];
		await createQuestion({
			type,
			stem: stem.trim(),
			options,
			correctAnswer: type === "mcq" || type === "tf" ? correct : numerical.trim(),
			explanation,
			examId: examId || null,
			subjectId: null,
			chapterId: null,
			topicId: topicId || null,
			bookId: null,
			page: null,
			difficulty,
			source: "user",
			tags: []
		});
		toast.success("Saved to the question bank.");
		navigate({ to: "/practice" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "New question",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Type",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
						value: type,
						onChange: (e) => setType(e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "mcq",
								children: "MCQ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "numerical",
								children: "Numerical"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "tf",
								children: "True / False"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "short",
								children: "Short answer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "custom",
								children: "Custom"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Stem",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: stem,
						onChange: (e) => setStem(e.target.value)
					})
				}),
				type === "mcq" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "A",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: a,
							onChange: (e) => setA(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "B",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: b,
							onChange: (e) => setB(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "C",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: c,
							onChange: (e) => setC(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "D",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: d,
							onChange: (e) => setD(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Correct",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
							value: correct,
							onChange: (e) => setCorrect(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "a",
									children: "A"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "b",
									children: "B"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "c",
									children: "C"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "d",
									children: "D"
								})
							]
						})
					})
				] }) : type === "tf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Correct",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
						value: correct,
						onChange: (e) => setCorrect(e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "true",
							children: "True"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "false",
							children: "False"
						})]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Correct answer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: numerical,
						onChange: (e) => setNumerical(e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Explanation",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: explanation,
						onChange: (e) => setExplanation(e.target.value)
					})
				}),
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
							children: "None"
						}), topics.filter((t) => !examId || t.examId === examId).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: t.id,
							children: t.title
						}, t.id))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Difficulty",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
						value: difficulty,
						onChange: (e) => setDifficulty(e.target.value),
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
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					onClick: save,
					children: "Save to bank"
				})
			]
		})
	});
}
var SplitComponent = QuestionNewPage;
//#endregion
export { SplitComponent as component };
