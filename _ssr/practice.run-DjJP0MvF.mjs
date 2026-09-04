import { i as __toESM } from "../_runtime.mjs";
import { d as shuffle, l as numericalMatch } from "./utils-DZ4IgiFc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { F as recordAttempt, T as classifyMistake, _ as MISTAKE_LABEL, ct as useQuestions, d as NativeSelect, et as useExams, g as MISTAKE_CATEGORIES, it as useMistakes, mt as useTopics, p as Button, s as Route$6 } from "./router-Cbj4RZlk.mjs";
import { t as Card } from "./card-DFaudOAO.mjs";
import { n as explainQuestion } from "./study-ai-C_RQQsJM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/practice.run-DjJP0MvF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PracticeRunPage({ search }) {
	const all = useQuestions();
	const exams = useExams();
	const topics = useTopics();
	const mistakes = useMistakes();
	const navigate = useNavigate();
	const [setupDone, setSetupDone] = (0, import_react.useState)(!!search.questionId || search.mode === "random" || search.mode === "weak" || search.mode === "timed" || !!search.examId && search.mode === "exam" || !!search.topicId && search.mode === "topic");
	const [examId, setExamId] = (0, import_react.useState)(search.examId ?? exams[0]?.id ?? "");
	const [topicId, setTopicId] = (0, import_react.useState)(search.topicId ?? "");
	const [difficulty, setDifficulty] = (0, import_react.useState)(search.difficulty ?? "any");
	const [count, setCount] = (0, import_react.useState)(Number(search.count ?? 8));
	const [timed, setTimed] = (0, import_react.useState)(search.timed === "1" || search.mode === "timed");
	const [queue, setQueue] = (0, import_react.useState)([]);
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [answer, setAnswer] = (0, import_react.useState)("");
	const [confidence, setConfidence] = (0, import_react.useState)(null);
	const [revealed, setRevealed] = (0, import_react.useState)(false);
	const [correct, setCorrect] = (0, import_react.useState)(null);
	const [mistakeCat, setMistakeCat] = (0, import_react.useState)("concept_gap");
	const [lastMistakeId, setLastMistakeId] = (0, import_react.useState)(null);
	const [aiText, setAiText] = (0, import_react.useState)("");
	const started = (0, import_react.useRef)(Date.now());
	const weakTopicIds = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const m of mistakes) if (m.topicId) map.set(m.topicId, (map.get(m.topicId) ?? 0) + 1);
		return new Set([...map.entries()].filter(([, n]) => n >= 2).map(([id]) => id));
	}, [mistakes]);
	const buildQueue = () => {
		let pool = all.slice();
		if (search.questionId) pool = pool.filter((q) => q.id === search.questionId);
		else {
			if (examId) pool = pool.filter((q) => q.examId === examId);
			if (topicId) pool = pool.filter((q) => q.topicId === topicId);
			if (difficulty !== "any") pool = pool.filter((q) => q.difficulty === difficulty);
			if (search.mode === "weak") {
				const weak = pool.filter((q) => q.topicId && weakTopicIds.has(q.topicId));
				if (weak.length) pool = weak;
			}
		}
		const picked = shuffle(pool).slice(0, Math.max(1, count));
		if (!picked.length) {
			toast.error("No questions match those filters.");
			return;
		}
		setQueue(picked);
		setIdx(0);
		setSetupDone(true);
		started.current = Date.now();
		setAnswer("");
		setRevealed(false);
		setCorrect(null);
		setConfidence(null);
	};
	(0, import_react.useEffect)(() => {
		if (setupDone && !queue.length && all.length) buildQueue();
	}, [setupDone, all.length]);
	const q = queue[idx];
	const commit = async () => {
		if (!q) return;
		if (q.type === "mcq" || q.type === "tf") {
			if (!answer) {
				toast.error("Choose an answer first.");
				return;
			}
		} else if (!answer.trim()) {
			toast.error("Enter an answer first.");
			return;
		}
		const ok = q.type === "numerical" || q.type === "short" || q.type === "custom" ? numericalMatch(answer, q.correctAnswer) || answer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase() : answer === q.correctAnswer;
		const timeMs = Date.now() - started.current;
		const rec = await recordAttempt({
			question: q,
			answer,
			correct: ok,
			confidence,
			timeMs,
			sessionId: search.sessionId ?? null,
			mistakeCategory: ok ? null : mistakeCat
		});
		setCorrect(ok);
		setRevealed(true);
		setLastMistakeId(rec.mistake?.id ?? null);
	};
	const next = () => {
		if (idx + 1 >= queue.length) {
			navigate({ to: "/practice" });
			return;
		}
		setIdx(idx + 1);
		setAnswer("");
		setRevealed(false);
		setCorrect(null);
		setConfidence(null);
		setAiText("");
		started.current = Date.now();
	};
	if (!setupDone) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto min-h-dvh max-w-lg px-4 py-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl font-medium",
			children: "Practice setup"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: examId,
					onChange: (e) => setExamId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Any exam"
					}), exams.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: e.id,
						children: e.name
					}, e.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: topicId,
					onChange: (e) => setTopicId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Any topic"
					}), topics.filter((t) => !examId || t.examId === examId).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: t.id,
						children: t.title
					}, t.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: difficulty,
					onChange: (e) => setDifficulty(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "any",
							children: "Any difficulty"
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
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: timed,
						onChange: (e) => setTimed(e.target.checked)
					}), "Timed (recorded)"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm",
					children: ["Count", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "number",
						min: 1,
						max: 50,
						className: "mt-1 h-11 w-full rounded-lg bg-surface-2 px-3",
						value: count,
						onChange: (e) => setCount(Number(e.target.value))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					onClick: buildQueue,
					children: "Start"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "w-full",
					onClick: () => navigate({ to: "/practice" }),
					children: "Cancel"
				})
			]
		})]
	});
	if (!q) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center gap-3 px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "No questions in this set."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/practice",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Back" })
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh max-w-lg flex-col px-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between text-xs text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					idx + 1,
					" / ",
					queue.length
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "capitalize",
					children: [q.difficulty, timed ? " · timed" : ""]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl leading-snug",
				children: q.stem
			}),
			q.source === "ai" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[11px] text-subtle",
				children: "Generated by AI — verify before trusting."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-2",
				children: [(q.type === "mcq" || q.type === "tf") && q.options.map((o) => {
					const selected = answer === o.id;
					const showKey = revealed && (o.id === q.correctAnswer || selected);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: revealed,
						onClick: () => setAnswer(o.id),
						className: `flex min-h-12 w-full items-center rounded-2xl px-4 text-left text-sm shadow-[var(--shadow-border)] ${selected ? "bg-ink text-paper" : "bg-surface"} ${revealed && o.id === q.correctAnswer ? "ring-2 ring-good" : ""} ${revealed && selected && o.id !== q.correctAnswer ? "ring-2 ring-bad" : ""}`,
						children: [o.text, showKey && o.id === q.correctAnswer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-auto text-[11px]",
							children: "Correct"
						}) : null]
					}, o.id);
				}), (q.type === "numerical" || q.type === "short" || q.type === "custom") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "h-12 w-full rounded-2xl bg-surface px-4 shadow-[var(--shadow-border)]",
					placeholder: "Your answer",
					value: answer,
					disabled: revealed,
					onChange: (e) => setAnswer(e.target.value)
				})]
			}),
			!revealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs text-muted",
						children: "Confidence before you commit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: [
							1,
							2,
							3,
							4,
							5
						].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setConfidence(n),
							className: `h-11 flex-1 rounded-xl text-sm ${confidence === n ? "bg-ink text-paper" : "bg-surface-2"}`,
							children: n
						}, n))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4 w-full",
						size: "lg",
						onClick: commit,
						children: "Commit answer"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: correct ? "p-4" : "p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: correct ? "Correct" : "Incorrect"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: ["Answer: ", labelFor(q, q.correctAnswer)]
							}),
							q.explanation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm",
								children: q.explanation
							}) : null
						]
					}),
					!correct ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-1 text-xs text-muted",
						children: "Classify this mistake"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
						value: mistakeCat,
						onChange: async (e) => {
							const v = e.target.value;
							setMistakeCat(v);
							if (lastMistakeId) await classifyMistake(lastMistakeId, v);
						},
						children: MISTAKE_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c,
							children: MISTAKE_LABEL[c]
						}, c))
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiExplain, {
						question: q,
						onText: setAiText
					}),
					aiText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted whitespace-pre-wrap",
						children: aiText
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						onClick: next,
						children: idx + 1 >= queue.length ? "Finish" : "Next"
					})
				]
			})
		]
	});
}
function labelFor(q, id) {
	return q.options.find((o) => o.id === id)?.text ?? id;
}
function AiExplain({ question, onText }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const run = async (mode) => {
		setBusy(true);
		const res = await explainQuestion({ data: {
			mode,
			stem: question.stem,
			options: question.options.map((o) => `${o.id}: ${o.text}`).join("; "),
			correctAnswer: question.correctAnswer,
			explanation: question.explanation,
			excerpts: ""
		} });
		setBusy(false);
		if (!res.ok) toast.error(res.error);
		else onText((mode === "similar" ? "Generated by AI\n\n" : "Generated by AI\n\n") + res.text);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				disabled: busy,
				onClick: () => run("simple"),
				children: "Explain simply"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				disabled: busy,
				onClick: () => run("steps"),
				children: "Step-by-step"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				disabled: busy,
				onClick: () => run("trap"),
				children: "Common trap"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				disabled: busy,
				onClick: () => run("similar"),
				children: "Similar question"
			})
		]
	});
}
function Page() {
	const search = Route$6.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PracticeRunPage, { search });
}
//#endregion
export { Page as component };
