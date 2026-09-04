import { r as cn } from "./utils-DZ4IgiFc.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { y as TOPIC_STATUS_LABEL } from "./router-Cbj4RZlk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-chip-D6Vtg5N-.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "muted", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", tone === "muted" && "bg-surface-2 text-muted", tone === "good" && "bg-good/15 text-good", tone === "warn" && "bg-warn/15 text-warn", tone === "bad" && "bg-bad/15 text-bad", tone === "ink" && "bg-ink text-paper", className),
		children
	});
}
function StatusChip({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone: status === "mastered" || status === "strong" ? "good" : status === "not_started" ? "muted" : status === "revised" || status === "practiced" ? "ink" : "warn",
		children: TOPIC_STATUS_LABEL[status]
	});
}
function KnowledgeBar({ score }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full bg-ink",
				style: { width: `${Math.max(0, Math.min(100, score))}%` }
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "tabular w-10 text-right text-xs text-muted",
			children: [Math.round(score), "%"]
		})]
	});
}
function ReadinessRing({ value, size = 56 }) {
	const r = 18;
	const c = 2 * Math.PI * r;
	const offset = c - (value ?? 0) / 100 * c;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		style: {
			width: size,
			height: size
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 44 44",
			className: "size-full -rotate-90",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "22",
				cy: "22",
				r,
				fill: "none",
				stroke: "currentColor",
				className: "text-surface-2",
				strokeWidth: "4"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "22",
				cy: "22",
				r,
				fill: "none",
				stroke: "currentColor",
				className: "text-ink",
				strokeWidth: "4",
				strokeDasharray: c,
				strokeDashoffset: value === null ? c : offset,
				strokeLinecap: "round"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute inset-0 flex items-center justify-center font-display text-sm tabular text-fg",
			children: value === null ? "—" : Math.round(value)
		})]
	});
}
//#endregion
export { ReadinessRing as n, StatusChip as r, KnowledgeBar as t };
