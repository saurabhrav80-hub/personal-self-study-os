import { i as __toESM } from "../_runtime.mjs";
import { c as nid, l as numericalMatch } from "./utils-DZ4IgiFc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { F as recordAttempt, c as Route$7, ct as useQuestions, ot as useMocks, p as Button, z as saveMockResult } from "./router-Cbj4RZlk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mocks.run-BnGnt9IV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MockRunPage({ mockId }) {
	const mocks = useMocks();
	const questions = useQuestions();
	const mock = mocks.find((m) => m.id === mockId);
	const navigate = useNavigate();
	const paper = (0, import_react.useMemo)(() => {
		if (!mock) return [];
		const map = new Map(questions.map((q) => [q.id, q]));
		return mock.questionIds.map((id) => map.get(id)).filter((q) => !!q);
	}, [mock, questions]);
	const [idx, setIdx] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)({});
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	const [remaining, setRemaining] = (0, import_react.useState)((mock?.timeLimitMin ?? 20) * 60);
	const started = (0, import_react.useRef)(Date.now());
	const qStart = (0, import_react.useRef)(Date.now());
	const [section, setSection] = (0, import_react.useState)(0);
	const answersRef = (0, import_react.useRef)(answers);
	const paperRef = (0, import_react.useRef)(paper);
	const submitted = (0, import_react.useRef)(false);
	answersRef.current = answers;
	paperRef.current = paper;
	(0, import_react.useEffect)(() => {
		if (!mock) return;
		setRemaining(mock.timeLimitMin * 60);
		submitted.current = false;
	}, [mock?.id, mock?.timeLimitMin]);
	const finish = async (auto) => {
		if (!mock || submitted.current) return;
		submitted.current = true;
		const q = paperRef.current[idx];
		if (q) {
			const spent = Date.now() - qStart.current;
			const prev = answersRef.current;
			const cur = prev[q.id] ?? {
				questionId: q.id,
				answer: "",
				timeMs: 0,
				marked: false,
				skipped: true
			};
			answersRef.current = {
				...prev,
				[q.id]: {
					...cur,
					timeMs: cur.timeMs + spent
				}
			};
		}
		const resultId = nid();
		const rows = paperRef.current.map((item) => {
			const a = answersRef.current[item.id];
			return {
				questionId: item.id,
				answer: a?.answer ?? "",
				timeMs: a?.timeMs ?? 0,
				marked: a?.marked ?? false,
				skipped: !a?.answer
			};
		});
		let score = 0;
		let correctN = 0;
		let attempted = 0;
		for (const row of rows) {
			const item = paperRef.current.find((p) => p.id === row.questionId);
			if (!item || row.skipped) continue;
			attempted += 1;
			const ok = item.type === "numerical" || item.type === "short" ? numericalMatch(row.answer, item.correctAnswer) || row.answer.trim().toLowerCase() === item.correctAnswer.trim().toLowerCase() : row.answer === item.correctAnswer;
			if (ok) {
				score += mock.marksCorrect;
				correctN += 1;
			} else score -= mock.negativeMarking;
			await recordAttempt({
				question: item,
				answer: row.answer,
				correct: ok,
				confidence: null,
				timeMs: row.timeMs,
				mockResultId: resultId,
				mistakeCategory: ok ? null : "other"
			});
		}
		const maxScore = paperRef.current.length * mock.marksCorrect;
		const used = Date.now() - started.current;
		const allotted = mock.timeLimitMin * 6e4;
		await saveMockResult({
			id: resultId,
			mockId: mock.id,
			startedAt: started.current,
			submittedAt: Date.now(),
			answers: rows,
			score,
			maxScore,
			accuracy: attempted ? correctN / attempted * 100 : 0,
			attemptRate: paperRef.current.length ? attempted / paperRef.current.length * 100 : 0,
			timeEfficiency: allotted ? Math.min(100, used / allotted * 100) : 0
		});
		toast.success(auto ? "Time is up. Mock submitted." : "Mock submitted.");
		navigate({
			to: "/mocks/report/$resultId",
			params: { resultId }
		});
	};
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => {
			setRemaining((s) => {
				if (s <= 1) {
					clearInterval(t);
					finish(true);
					return 0;
				}
				return s - 1;
			});
		}, 1e3);
		return () => clearInterval(t);
	}, [mock?.id]);
	if (!mock) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center text-muted",
		children: "Mock not found."
	});
	const q = paper[idx];
	const mm = Math.floor(remaining / 60);
	const ss = String(remaining % 60).padStart(2, "0");
	const recordTime = (qid) => {
		const spent = Date.now() - qStart.current;
		setAnswers((prev) => {
			const cur = prev[qid] ?? {
				questionId: qid,
				answer: "",
				timeMs: 0,
				marked: false,
				skipped: true
			};
			return {
				...prev,
				[qid]: {
					...cur,
					timeMs: cur.timeMs + spent
				}
			};
		});
		qStart.current = Date.now();
	};
	const setAns = (qid, value) => {
		setAnswers((prev) => ({
			...prev,
			[qid]: {
				questionId: qid,
				answer: value,
				timeMs: prev[qid]?.timeMs ?? 0,
				marked: prev[qid]?.marked ?? false,
				skipped: !value
			}
		}));
	};
	const sections = mock.sections.length ? mock.sections : [{
		name: "All",
		questionIds: mock.questionIds,
		timeMin: mock.timeLimitMin
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-12 items-center justify-between border-b border-border px-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-medium",
					children: mock.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "tabular font-display text-lg",
					children: [
						mm,
						":",
						ss
					]
				})]
			}),
			sections.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-x-auto border-b border-border px-2 py-2",
				children: sections.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						if (q) recordTime(q.id);
						setSection(i);
						const first = paper.findIndex((p) => s.questionIds.includes(p.id));
						if (first >= 0) setIdx(first);
					},
					className: `h-9 shrink-0 rounded-full px-3 text-xs ${i === section ? "bg-ink text-paper" : "bg-surface-2"}`,
					children: s.name
				}, s.name))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto px-4 py-4",
				children: q ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							"Q",
							idx + 1,
							" of ",
							paper.length
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-xl leading-snug",
						children: q.stem
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-2",
						children: q.options.length ? q.options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setAns(q.id, o.id),
							className: `flex min-h-12 w-full items-center rounded-2xl px-4 text-left text-sm ${answers[q.id]?.answer === o.id ? "bg-ink text-paper" : "bg-surface shadow-[var(--shadow-border)]"}`,
							children: o.text
						}, o.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "h-12 w-full rounded-2xl bg-surface px-4 shadow-[var(--shadow-border)]",
							value: answers[q.id]?.answer ?? "",
							onChange: (e) => setAns(q.id, e.target.value),
							placeholder: "Answer"
						})
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "No questions on this paper."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 flex flex-wrap gap-1",
					children: paper.map((item, i) => {
						const a = answers[item.id];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								if (q) recordTime(q.id);
								setIdx(i);
							},
							className: `size-8 rounded-md text-xs ${i === idx ? "bg-ink text-paper" : a?.marked ? "bg-warn/30" : a?.answer ? "bg-good/25" : "bg-surface-2"}`,
							children: i + 1
						}, item.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "flex-1",
							onClick: () => {
								if (!q) return;
								setAnswers((p) => ({
									...p,
									[q.id]: {
										questionId: q.id,
										answer: p[q.id]?.answer ?? "",
										timeMs: p[q.id]?.timeMs ?? 0,
										marked: !p[q.id]?.marked,
										skipped: !p[q.id]?.answer
									}
								}));
							},
							children: "Mark"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							className: "flex-1",
							disabled: idx <= 0,
							onClick: () => {
								if (q) recordTime(q.id);
								setIdx(idx - 1);
							},
							children: "Prev"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							className: "flex-1",
							disabled: idx >= paper.length - 1,
							onClick: () => {
								if (q) recordTime(q.id);
								setIdx(idx + 1);
							},
							children: "Next"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "flex-1",
							onClick: () => {
								if (!confirm) setConfirm(true);
								else finish(false);
							},
							children: "Submit"
						})
					]
				})]
			}),
			confirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-2xl bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl",
							children: "Submit this mock?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-muted",
							children: [
								"Attempted ",
								Object.values(answers).filter((a) => a.answer).length,
								" of ",
								paper.length,
								". This cannot be undone."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "flex-1",
								onClick: () => setConfirm(false),
								children: "Continue"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "flex-1",
								onClick: () => finish(false),
								children: "Submit"
							})]
						})
					]
				})
			}) : null
		]
	});
}
function Page() {
	const { mockId } = Route$7.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MockRunPage, { mockId: mockId ?? "" });
}
//#endregion
export { Page as component };
