import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { B as saveNote, p as Button, st as useNotes } from "./router-Cbj4RZlk.mjs";
import { n as Screen, t as EmptyState } from "./empty-r3dgi-HO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notes-Dh2LPhrS.js
var import_jsx_runtime = require_jsx_runtime();
function NotesListPage() {
	const notes = useNotes();
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "Notes",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			size: "sm",
			onClick: async () => {
				const n = await saveNote({
					title: "Untitled",
					body: "",
					type: "text"
				});
				navigate({
					to: "/notes/$noteId",
					params: { noteId: n.id }
				});
			},
			children: "New"
		}),
		children: notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No notes yet",
			body: "Capture concept, question, book, or revision notes. Everything is searchable."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/notes/$noteId",
				params: { noteId: n.id },
				className: "block rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-subtle uppercase",
						children: n.type
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: n.title || "Untitled"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "line-clamp-2 text-xs text-muted",
						children: n.body
					})
				]
			}) }, n.id))
		})
	});
}
var SplitComponent = NotesListPage;
//#endregion
export { SplitComponent as component };
