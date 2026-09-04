import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { $ as useConcepts, Q as useConceptLinks, ct as useQuestions, it as useMistakes, rt as useKnowledgeMap, u as Input, ut as useRevisions } from "./router-Cbj4RZlk.mjs";
import { t as Card } from "./card-DFaudOAO.mjs";
import { n as Screen, t as EmptyState } from "./empty-r3dgi-HO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/concepts-page-D54vPamc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ConceptsPage() {
	const concepts = useConcepts();
	const links = useConceptLinks();
	const navigate = useNavigate();
	const [q, setQ] = (0, import_react.useState)("");
	const shown = concepts.filter((c) => {
		const hay = `${c.name} ${c.aliases.join(" ")} ${c.summary}`.toLowerCase();
		return !q || hay.includes(q.toLowerCase());
	});
	const width = 320;
	const height = 280;
	const layout = (0, import_react.useMemo)(() => {
		return shown.slice(0, 16).map((c, i, arr) => {
			const angle = i / Math.max(arr.length, 1) * Math.PI * 2 - Math.PI / 2;
			const r = 110;
			return {
				...c,
				x: width / 2 + Math.cos(angle) * r,
				y: height / 2 + Math.sin(angle) * r
			};
		});
	}, [shown]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: "Concept map",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-muted",
				children: "Knowledge is linked across exams — percentage is not only CAT, duration is not only CFA."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search concepts",
				value: q,
				onChange: (e) => setQ(e.target.value)
			}),
			concepts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				className: "mt-6",
				title: "No concepts",
				body: "Starter concepts load on first launch."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-4 overflow-hidden p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: `0 0 ${width} ${height}`,
					className: "w-full",
					children: [links.map((l) => {
						const a = layout.find((n) => n.id === l.fromId);
						const b = layout.find((n) => n.id === l.toId);
						if (!a || !b) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: a.x,
							y1: a.y,
							x2: b.x,
							y2: b.y,
							stroke: "currentColor",
							className: "text-border"
						}, l.id);
					}), layout.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
						className: "cursor-pointer",
						onClick: () => navigate({
							to: "/concepts/$conceptId",
							params: { conceptId: n.id }
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: n.x,
							cy: n.y,
							r: "18",
							className: "fill-surface-2 stroke-ink"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
							x: n.x,
							y: n.y + 32,
							textAnchor: "middle",
							className: "fill-fg",
							fontSize: "9",
							children: n.name.split(" ")[0]
						})]
					}, n.id))]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: shown.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/concepts/$conceptId",
					params: { conceptId: c.id },
					className: "block rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: c.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: c.summary
					})]
				}) }, c.id))
			})] })
		]
	});
}
function ConceptDetailPage({ conceptId }) {
	const concepts = useConcepts();
	const links = useConceptLinks();
	const questions = useQuestions();
	const mistakes = useMistakes();
	const revisions = useRevisions();
	const knowledge = useKnowledgeMap();
	const c = concepts.find((x) => x.id === conceptId);
	if (!c) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "Concept",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Not found."
		})
	});
	const related = links.filter((l) => l.fromId === c.id || l.toId === c.id).map((l) => concepts.find((x) => x.id === (l.fromId === c.id ? l.toId : l.fromId))).filter(Boolean);
	const qs = questions.filter((q) => q.topicId && c.topicIds.includes(q.topicId));
	const ms = mistakes.filter((m) => m.topicId && c.topicIds.includes(m.topicId));
	const rs = revisions.filter((r) => r.topicId && c.topicIds.includes(r.topicId));
	const k = c.topicIds.length ? Math.round(c.topicIds.reduce((s, id) => s + (knowledge[id] ?? 0), 0) / c.topicIds.length) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: c.name,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: c.summary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						l: "Questions",
						n: qs.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						l: "Mistakes",
						n: ms.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						l: "Revision cards",
						n: rs.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						l: "Knowledge",
						n: `${k}%`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-xs tracking-wide text-subtle uppercase",
				children: "Related"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-1",
				children: related.map((r) => r ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/concepts/$conceptId",
					params: { conceptId: r.id },
					className: "text-sm",
					children: r.name
				}) }, r.id) : null)
			}),
			c.topicIds[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				className: "mt-6 inline-block text-sm",
				to: "/practice/run",
				search: {
					mode: "topic",
					topicId: c.topicIds[0]
				},
				children: "Practice this concept"
			}) : null
		]
	});
}
function Stat({ l, n }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] text-muted",
			children: l
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl tabular",
			children: n
		})]
	});
}
//#endregion
export { ConceptsPage as n, ConceptDetailPage as t };
