import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { B as saveNote, d as NativeSelect, et as useExams, f as Textarea, j as deleteNote, p as Button, r as Route$2, st as useNotes, u as Input } from "./router-Cbj4RZlk.mjs";
import { n as Screen } from "./empty-r3dgi-HO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notes._noteId-C0nxiECj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NoteEditorPage({ noteId }) {
	const notes = useNotes();
	const exams = useExams();
	const note = notes.find((n) => n.id === noteId);
	const [title, setTitle] = (0, import_react.useState)(note?.title ?? "");
	const [body, setBody] = (0, import_react.useState)(note?.body ?? "");
	const [type, setType] = (0, import_react.useState)(note?.type ?? "text");
	const [examId, setExamId] = (0, import_react.useState)(note?.examId ?? "");
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (note) {
			setTitle(note.title);
			setBody(note.body);
			setType(note.type);
			setExamId(note.examId ?? "");
		}
	}, [note?.id]);
	if (!note) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "Note",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Note not found."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Screen, {
		title: "Edit note",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
					value: type,
					onChange: (e) => setType(e.target.value),
					children: [
						"text",
						"concept",
						"question",
						"mistake",
						"book",
						"revision"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: t,
						children: t
					}, t))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: examId,
					onChange: (e) => setExamId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "No exam"
					}), exams.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: e.id,
						children: e.name
					}, e.id))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: title,
					onChange: (e) => setTitle(e.target.value),
					placeholder: "Title"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					className: "min-h-48",
					value: body,
					onChange: (e) => setBody(e.target.value),
					placeholder: "Body"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					onClick: async () => {
						await saveNote({
							id: note.id,
							title,
							body,
							type,
							examId: examId || null
						});
						navigate({ to: "/notes" });
					},
					children: "Save"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					className: "w-full",
					onClick: async () => {
						await deleteNote(note.id);
						navigate({ to: "/notes" });
					},
					children: "Delete"
				})
			]
		})
	});
}
function Page() {
	const { noteId } = Route$2.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteEditorPage, { noteId });
}
//#endregion
export { Page as component };
