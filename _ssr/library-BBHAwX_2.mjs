import { i as __toESM } from "../_runtime.mjs";
import { f as stripExt } from "./utils-DZ4IgiFc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Plus } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { X as useBooks, d as NativeSelect, et as useExams, l as Field, p as Button, pt as useSubjects, u as Input } from "./router-Cbj4RZlk.mjs";
import { t as Card } from "./card-DFaudOAO.mjs";
import { n as Screen, t as EmptyState } from "./empty-r3dgi-HO.mjs";
import { t as ingestPdfFile } from "./pdf-BTrB7Hs0.mjs";
import { n as DialogContent, r as DialogTrigger, t as Dialog } from "./dialog-CoFLxguO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-BBHAwX_2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LibraryPage() {
	const books = useBooks();
	const exams = useExams();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const shown = books.filter((b) => {
		if (filter === "all") return true;
		if (filter === "other") return !b.examId || !exams.some((e) => e.id === b.examId);
		return b.examId === filter;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: "Library",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddBookButton, {}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex gap-1.5 overflow-x-auto pb-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					active: filter === "all",
					onClick: () => setFilter("all"),
					children: "All"
				}),
				exams.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					active: filter === e.id,
					onClick: () => setFilter(e.id),
					children: e.name
				}, e.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
					active: filter === "other",
					onClick: () => setFilter("other"),
					children: "Other"
				})
			]
		}), shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "Upload your first book",
			body: "PDFs are stored on this device. Text is extracted locally. Nothing is sent anywhere unless you later use Ask My Books with AI.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddBookButton, {})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: shown.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/library/$bookId",
				params: { bookId: b.id },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex items-center justify-between gap-3 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate font-medium",
								children: b.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 truncate text-xs text-muted",
								children: [
									exams.find((e) => e.id === b.examId)?.name ?? "Unassigned",
									b.author ? ` · ${b.author}` : "",
									b.pageCount ? ` · ${b.pageCount} pages` : ""
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-[11px] text-subtle",
								children: [
									Math.round(b.readingProgress * 100),
									"% read",
									b.extractionStatus === "failed" || b.extractionStatus === "manual" ? " · needs structure" : ""
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-10 w-10 shrink-0 rounded-full bg-surface-2 p-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-ink",
							style: { background: `conic-gradient(var(--app-ink) ${b.readingProgress * 360}deg, var(--app-surface-2) 0)` }
						})
					})]
				})
			}) }, b.id))
		})]
	});
}
function FilterChip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: `h-9 shrink-0 rounded-full px-3.5 text-sm font-medium ${active ? "bg-ink text-paper" : "bg-surface text-muted shadow-[var(--shadow-border)]"}`,
		children
	});
}
function AddBookButton() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add book"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			title: "Add book",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddBookForm, { onDone: () => setOpen(false) })
		})]
	});
}
function AddBookForm({ onDone }) {
	const exams = useExams();
	const subjects = useSubjects();
	const [file, setFile] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [examId, setExamId] = (0, import_react.useState)(exams[0]?.id ?? "");
	const [subjectId, setSubjectId] = (0, import_react.useState)("");
	const [author, setAuthor] = (0, import_react.useState)("");
	const [edition, setEdition] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)("");
	const filteredSubjects = subjects.filter((s) => s.examId === examId);
	const submit = async () => {
		if (!file) {
			toast.error("Choose a PDF.");
			return;
		}
		setBusy(true);
		try {
			await ingestPdfFile(file, {
				name: name || stripExt(file.name),
				examId: examId || null,
				subjectId: subjectId || null,
				author,
				edition
			}, (p) => setProgress(p.note));
			toast.success("Book stored locally.");
			onDone();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Import failed.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "PDF file",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: "application/pdf",
					className: "block w-full text-sm",
					onChange: (e) => {
						const f = e.target.files?.[0] ?? null;
						setFile(f);
						if (f && !name) setName(stripExt(f.name));
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Title",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Exam",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: examId,
					onChange: (e) => setExamId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Unassigned"
					}), exams.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: ex.id,
						children: ex.name
					}, ex.id))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Subject",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: subjectId,
					onChange: (e) => setSubjectId(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "None"
					}), filteredSubjects.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s.id,
						children: s.name
					}, s.id))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Author",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: author,
					onChange: (e) => setAuthor(e.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Edition",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: edition,
					onChange: (e) => setEdition(e.target.value)
				})
			}),
			progress ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: progress
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				disabled: busy,
				onClick: submit,
				children: busy ? "Processing…" : "Store book"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-subtle",
				children: "Original file is kept. Headings are detected when possible; missing structure is never invented."
			})
		]
	});
}
var SplitComponent = LibraryPage;
//#endregion
export { SplitComponent as component };
