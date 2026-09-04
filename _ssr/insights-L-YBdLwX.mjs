import { i as __toESM } from "../_runtime.mjs";
import { a as formatDuration, o as formatMinutes } from "./utils-DZ4IgiFc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { U as topicAnalytics, _ as MISTAKE_LABEL, at as useMockResults, ct as useQuestions, dt as useSessions, ft as useSettingsLive, ht as whyLosingMarks, it as useMistakes, mt as useTopics, q as useAttempts, rt as useKnowledgeMap, v as PATTERN_COPY } from "./router-Cbj4RZlk.mjs";
import { t as Card } from "./card-DFaudOAO.mjs";
import { n as Screen, r as SectionLabel, t as EmptyState } from "./empty-r3dgi-HO.mjs";
import { a as Scatter, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as LineChart, o as Line, r as YAxis, s as CartesianGrid, t as ScatterChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights-L-YBdLwX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InsightsPage() {
	const attempts = useAttempts();
	const questions = useQuestions();
	const mistakes = useMistakes();
	const topics = useTopics();
	const sessions = useSessions();
	const mocks = useMockResults();
	const knowledge = useKnowledgeMap();
	const settings = useSettingsLive();
	const analytics = topicAnalytics(topics, questions, attempts, settings?.targetTimes ?? {});
	const hours = sessions.reduce((s, x) => {
		const end = x.endedAt ?? Date.now();
		return s + Math.max(0, end - x.startedAt) / 36e5;
	}, 0);
	const acc = attempts.length ? attempts.filter((a) => a.correct).length / attempts.length * 100 : null;
	const trend = (0, import_react.useMemo)(() => {
		const byDay = /* @__PURE__ */ new Map();
		for (const a of attempts) {
			const d = new Date(a.createdAt).toISOString().slice(0, 10);
			const row = byDay.get(d) ?? {
				n: 0,
				c: 0
			};
			row.n += 1;
			if (a.correct) row.c += 1;
			byDay.set(d, row);
		}
		return [...byDay.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-14).map(([day, v]) => ({
			day: day.slice(5),
			accuracy: Math.round(v.c / v.n * 100)
		}));
	}, [attempts]);
	const scatter = attempts.slice(0, 80).map((a) => ({
		time: Math.round(a.timeMs / 1e3),
		ok: a.correct ? 1 : 0
	}));
	const cats = whyLosingMarks(mistakes);
	const weak = analytics.filter((a) => a.pattern === "major" || a.accuracy < 55);
	const strong = analytics.filter((a) => a.pattern === "strong" || a.accuracy >= 85 && a.questions >= 4);
	const improved = topics.map((t) => ({
		t,
		k: knowledge[t.id] ?? 0
	})).filter((x) => x.k >= 70).sort((a, b) => b.k - a.k).slice(0, 5);
	const atRisk = topics.filter((t) => {
		const k = knowledge[t.id] ?? 0;
		const stale = t.lastRevisedAt ? Date.now() - t.lastRevisedAt > 12096e5 : t.status !== "not_started";
		return k > 20 && k < 55 && stale;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: "Insights",
		wide: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Study hours",
						value: hours ? formatMinutes(hours * 60) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Questions",
						value: `${attempts.length}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Accuracy",
						value: acc == null ? "—" : `${Math.round(acc)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metric, {
						label: "Mocks",
						value: `${mocks.length}`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Accuracy trend" }),
			trend.length < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-6 text-sm text-muted",
				children: "Not enough daily attempts to plot a trend."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mb-6 h-48 p-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: trend,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "var(--app-border)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "day",
								tick: {
									fontSize: 11,
									fill: "var(--app-muted)"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								domain: [0, 100],
								tick: {
									fontSize: 11,
									fill: "var(--app-muted)"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								type: "monotone",
								dataKey: "accuracy",
								stroke: "var(--app-ink)",
								strokeWidth: 2,
								dot: false
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Speed lab · accuracy vs time" }),
			scatter.length < 4 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-6 text-sm text-muted",
				children: "Timed attempts will appear here as a scatter of seconds vs correctness."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mb-6 h-48 p-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScatterChart, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { stroke: "var(--app-border)" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "time",
							name: "sec",
							tick: {
								fontSize: 11,
								fill: "var(--app-muted)"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							dataKey: "ok",
							ticks: [0, 1],
							tick: {
								fontSize: 11,
								fill: "var(--app-muted)"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scatter, {
							data: scatter,
							fill: "var(--app-ink)"
						})
					] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Why am I losing marks?" }),
			cats.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				className: "mb-6",
				title: "No mistakes recorded",
				body: "Incorrect answers can be classified after each question."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mb-6 space-y-1",
				children: cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between rounded-xl bg-surface px-4 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: MISTAKE_LABEL[c.category] ?? c.category }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular",
						children: c.count
					})]
				}, c.category))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Weak / at risk" }), weak.length === 0 && atRisk.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No weak pattern yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-1 text-sm",
					children: [weak.slice(0, 6).map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/practice/run",
						search: {
							mode: "topic",
							topicId: w.topicId
						},
						children: [
							w.title,
							" · ",
							Math.round(w.accuracy),
							"% · ",
							PATTERN_COPY[w.pattern]
						]
					}) }, w.topicId)), atRisk.slice(0, 4).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-muted",
						children: [
							t.title,
							" — knowledge ",
							Math.round(knowledge[t.id] ?? 0),
							"%, revision stale"
						]
					}, t.id))]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Strong / improved" }), strong.length === 0 && improved.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Keep practicing to surface strengths."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "space-y-1 text-sm",
					children: [strong.slice(0, 6).map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						w.title,
						" · ",
						Math.round(w.accuracy),
						"% · avg ",
						formatDuration(w.avgTimeMs)
					] }, w.topicId)), improved.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "text-muted",
						children: [
							x.t.title,
							" · knowledge ",
							Math.round(x.k),
							"%"
						]
					}, x.t.id))]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-xs text-subtle",
				children: "Target times are per exam in Settings. Patterns use your recorded times, not a universal clock."
			})
		]
	});
}
function Metric({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl tabular",
			children: value
		})]
	});
}
var SplitComponent = InsightsPage;
//#endregion
export { SplitComponent as component };
