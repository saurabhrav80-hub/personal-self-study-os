import { r as cn } from "./_ssr/utils-DZ4IgiFc.mjs";
import { d as useRouterState, m as Outlet, v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { _ as BookOpen, a as Settings, d as House, h as ChartLine, i as Sparkles, o as Search, s as RotateCcw, u as ListChecks } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-DuiZEEOR.js
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/",
		label: "Home",
		icon: House
	},
	{
		to: "/library",
		label: "Library",
		icon: BookOpen
	},
	{
		to: "/practice",
		label: "Practice",
		icon: ListChecks
	},
	{
		to: "/revision",
		label: "Review",
		icon: RotateCcw
	},
	{
		to: "/insights",
		label: "Insights",
		icon: ChartLine
	}
];
function AppShell() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-baseline gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg font-medium tracking-tight",
							children: "Study OS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-[11px] tracking-wide text-subtle sm:inline",
							children: "Self-study"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconLink, {
								to: "/search",
								label: "Search",
								current: pathname.startsWith("/search"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconLink, {
								to: "/ask",
								label: "Ask my books",
								current: pathname.startsWith("/ask"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconLink, {
								to: "/settings",
								label: "Settings",
								current: pathname.startsWith("/settings"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-5" })
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed right-0 bottom-0 left-0 z-40 border-t border-border bg-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm",
				"aria-label": "Primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid h-16 max-w-lg grid-cols-5",
					children: NAV.map((item) => {
						const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-11 flex-col items-center justify-center gap-0.5 text-[11px] font-medium", active ? "text-fg" : "text-subtle"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-5",
								strokeWidth: active ? 2.2 : 1.7
							}), item.label]
						}, item.to);
					})
				})
			})
		]
	});
}
function IconLink({ to, label, current, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		"aria-label": label,
		className: cn("flex size-11 items-center justify-center rounded-lg", current ? "text-fg" : "text-muted hover:bg-surface-2 hover:text-fg"),
		children
	});
}
var SplitComponent = AppShell;
//#endregion
export { SplitComponent as component };
