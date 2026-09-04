import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { I as reviewRevision, L as revisionBucket, S as addRevision, f as Textarea, p as Button, ut as useRevisions } from "./router-Cbj4RZlk.mjs";
import { t as Card } from "./card-DFaudOAO.mjs";
import { n as Screen, r as SectionLabel, t as EmptyState } from "./empty-r3dgi-HO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/revision-CmKdEeDg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RevisionPage() {
	const items = useRevisions();
	const [active, setActive] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [revealed, setRevealed] = (0, import_react.useState)(false);
	const now = Date.now();
	const groups = (0, import_react.useMemo)(() => {
		const today = [];
		const soon = [];
		const later = [];
		for (const i of items) {
			const b = revisionBucket(i.dueAt, now);
			if (b === "today") today.push(i);
			else if (b === "soon") soon.push(i);
			else later.push(i);
		}
		today.sort((a, b) => a.dueAt - b.dueAt);
		return {
			today,
			soon,
			later
		};
	}, [items, now]);
	const rate = async (r) => {
		if (!active) return;
		await reviewRevision(active.id, r);
		setActive(null);
		setDraft("");
		setRevealed(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: "Revision",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			variant: "outline",
			onClick: async () => {
				const prompt = window.prompt("What should you be able to recall?");
				if (!prompt?.trim()) return;
				const answer = window.prompt("Answer to reveal after recall") ?? "";
				await addRevision({
					kind: "note",
					refId: "manual",
					prompt: prompt.trim(),
					answer: answer.trim()
				});
			},
			children: "Add card"
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-5 text-sm text-muted",
				children: "Recall first. Do not reread notes until you have attempted an answer."
			}),
			active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mb-6 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-wide text-subtle uppercase",
						children: "Active recall"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-xl leading-snug",
						children: active.prompt
					}),
					!revealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-4",
						placeholder: "Write what you remember",
						value: draft,
						onChange: (e) => setDraft(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3 w-full",
						onClick: () => setRevealed(true),
						children: "Reveal"
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 rounded-xl bg-surface-2 p-3 text-sm",
						children: active.answer || "No stored answer."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => rate("knew"),
								children: "I knew it"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => rate("partial"),
								children: "Partial"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => rate("forgot"),
								children: "Forgot"
							})
						]
					})] })
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bucket, {
				title: "Due today",
				color: "bg-bad",
				items: groups.today,
				onPick: (i) => {
					setActive(i);
					setRevealed(false);
					setDraft("");
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bucket, {
				title: "Soon",
				color: "bg-warn",
				items: groups.soon,
				onPick: (i) => {
					setActive(i);
					setRevealed(false);
					setDraft("");
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bucket, {
				title: "Later",
				color: "bg-good",
				items: groups.later,
				onPick: (i) => {
					setActive(i);
					setRevealed(false);
					setDraft("");
				}
			}),
			items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Nothing scheduled",
				body: "Mark a topic for revision from the reader, or add a recall card."
			}) : null
		]
	});
}
function Bucket({ title, color, items, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionLabel, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mr-2 inline-block size-2 rounded-full ${color}` }),
			title,
			" · ",
			items.length
		] }), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "None."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-1.5",
			children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onPick(i),
				className: "flex min-h-12 w-full items-center rounded-2xl bg-surface px-4 text-left text-sm shadow-[var(--shadow-border)]",
				children: i.prompt
			}) }, i.id))
		})]
	});
}
var SplitComponent = RevisionPage;
//#endregion
export { SplitComponent as component };
