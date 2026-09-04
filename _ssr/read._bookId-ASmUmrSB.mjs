import { i as __toESM } from "../_runtime.mjs";
import { r as cn } from "./utils-DZ4IgiFc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { f as Highlighter, g as Bookmark, m as ChevronLeft, p as ChevronRight, r as StickyNote, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { B as saveNote, J as useBook, N as markTopicEvent, S as addRevision, W as updateBook, Y as useBookmarks, Z as useChapters, b as addBookmark, f as Textarea, mt as useTopics, nt as useHighlights, o as Route$5, p as Button, x as addHighlight } from "./router-Cbj4RZlk.mjs";
import { n as loadBookBytes } from "./pdf-BTrB7Hs0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/read._bookId-ASmUmrSB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReaderPage({ bookId, initialPage }) {
	const book = useBook(bookId);
	const chapters = useChapters(bookId);
	const topics = useTopics({ bookId });
	const highlights = useHighlights(bookId);
	const bookmarks = useBookmarks(bookId);
	const navigate = useNavigate();
	const canvasRef = (0, import_react.useRef)(null);
	const bytesRef = (0, import_react.useRef)(null);
	const [page, setPage] = (0, import_react.useState)(initialPage || book?.lastPage || 1);
	const [busy, setBusy] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)("");
	const [drawer, setDrawer] = (0, import_react.useState)(false);
	const [hlText, setHlText] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (initialPage) setPage(initialPage);
	}, [initialPage]);
	const paint = (0, import_react.useCallback)(async (n) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		setBusy(true);
		try {
			if (!bytesRef.current) bytesRef.current = await loadBookBytes(bookId);
			if (!bytesRef.current) {
				setError("Original file is missing from local storage.");
				return;
			}
			const { renderPageToCanvas } = await import("./pdf-BTrB7Hs0.mjs").then((n) => n.r).then((n) => n.r);
			const width = Math.min(window.innerWidth - 16, 720);
			const scale = Math.max(.9, width / 520);
			await renderPageToCanvas(bytesRef.current, n, canvas, scale);
			setError(null);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not render this page.");
		} finally {
			setBusy(false);
		}
	}, [bookId]);
	(0, import_react.useEffect)(() => {
		paint(page);
	}, [page, paint]);
	(0, import_react.useEffect)(() => {
		if (!book) return;
		const progress = book.pageCount ? page / book.pageCount : 0;
		updateBook(bookId, {
			lastPage: page,
			lastOpenedAt: Date.now(),
			readingProgress: progress,
			completionStatus: progress >= .98 ? "complete" : "reading"
		});
	}, [
		page,
		bookId,
		book?.pageCount
	]);
	const chapter = chapters.find((c) => page >= c.pageStart && page <= c.pageEnd);
	const topic = topics.find((t) => t.chapterId === chapter?.id);
	const go = (n) => {
		if (!book) return;
		setPage(Math.min(book.pageCount || n, Math.max(1, n)));
	};
	if (!book) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "Book not found."
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-12 items-center justify-between gap-2 border-b border-border px-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-11 items-center justify-center",
						onClick: () => navigate({
							to: "/library/$bookId",
							params: { bookId }
						}),
						"aria-label": "Close reader",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: book.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-[11px] text-muted",
							children: [
								chapter?.title ?? "Document",
								" · ",
								page,
								"/",
								book.pageCount || "?"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-11 items-center justify-center text-sm",
						onClick: () => setDrawer(true),
						children: "Ch"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 justify-center overflow-auto bg-surface-2 p-2",
				children: error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "m-6 max-w-sm text-center text-sm text-muted",
					children: error
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: cn("max-w-full shadow-[var(--shadow-border)]", busy && "opacity-60")
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border bg-bg px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto flex max-w-lg items-center justify-between gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => go(page - 1),
								disabled: page <= 1,
								"aria-label": "Previous page",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "flex items-center gap-1 text-sm",
								onSubmit: (e) => {
									e.preventDefault();
									const fd = new FormData(e.currentTarget);
									go(Number(fd.get("p")));
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "p",
									defaultValue: page,
									className: "h-10 w-14 rounded-md bg-surface-2 text-center tabular",
									inputMode: "numeric"
								}, page), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-subtle",
									children: ["/ ", book.pageCount || "—"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => go(page + 1),
								disabled: book.pageCount ? page >= book.pageCount : false,
								"aria-label": "Next page",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto mt-2 grid max-w-lg grid-cols-4 gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: async () => {
									if (topic) await markTopicEvent(topic.id, "read");
									toast.success("Marked as studied.");
								},
								children: "Studied"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "secondary",
								onClick: async () => {
									if (!topic) {
										toast.error("No topic on this page to schedule.");
										return;
									}
									await addRevision({
										kind: "topic",
										refId: topic.id,
										prompt: `Recall: ${topic.title}`,
										answer: `From ${book.name}, ${chapter?.title ?? ""}.`,
										examId: book.examId,
										topicId: topic.id
									});
									toast.success("Added to revision.");
								},
								children: "Revise"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: async () => {
									await addBookmark({
										bookId,
										page,
										title: chapter?.title ?? `Page ${page}`
									});
									toast.success("Bookmark saved.");
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: async () => {
									const text = window.getSelection()?.toString().trim() || hlText || prompt("Highlight text") || "";
									if (!text) return;
									await addHighlight({
										bookId,
										page,
										text,
										color: "ink",
										note: ""
									});
									setHlText("");
									toast.success("Highlight stored locally.");
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Highlighter, { className: "size-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mx-auto mt-2 flex max-w-lg gap-2",
						onSubmit: async (e) => {
							e.preventDefault();
							if (!note.trim()) return;
							await saveNote({
								type: "book",
								title: `${book.name} p.${page}`,
								body: note.trim(),
								bookId,
								chapterId: chapter?.id ?? null,
								topicId: topic?.id ?? null,
								examId: book.examId
							});
							setNote("");
							toast.success("Note saved.");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "min-h-11 h-11 py-2.5",
							placeholder: "Page note",
							value: note,
							onChange: (e) => setNote(e.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "icon",
							variant: "secondary",
							"aria-label": "Save note",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StickyNote, { className: "size-4" })
						})]
					})
				]
			}),
			drawer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 bg-ink/40",
				onClick: () => setDrawer(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute right-0 bottom-0 left-0 max-h-[70dvh] overflow-y-auto rounded-t-2xl bg-surface p-4",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 font-display text-lg",
							children: "Chapters"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1",
							children: chapters.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex min-h-11 w-full items-center justify-between rounded-xl px-3 text-left text-sm hover:bg-surface-2",
								onClick: () => {
									go(c.pageStart);
									setDrawer(false);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-subtle",
									children: c.pageStart
								})]
							}) }, c.id))
						}),
						bookmarks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 mb-2 text-xs tracking-wide text-subtle uppercase",
							children: "Bookmarks"
						}), bookmarks.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "block min-h-10 w-full rounded-lg px-3 text-left text-sm",
							onClick: () => {
								go(b.page);
								setDrawer(false);
							},
							children: [
								"p.",
								b.page,
								" · ",
								b.title
							]
						}, b.id))] }) : null,
						highlights.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 mb-2 text-xs tracking-wide text-subtle uppercase",
							children: "Highlights"
						}), highlights.slice(0, 12).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "px-3 py-1 text-xs text-muted",
							children: [
								"p.",
								h.page,
								" — ",
								h.text.slice(0, 80)
							]
						}, h.id))] }) : null
					]
				})
			}) : null
		]
	});
}
function Page() {
	const { bookId } = Route$5.useParams();
	const { page } = Route$5.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReaderPage, {
		bookId,
		initialPage: page
	});
}
//#endregion
export { Page as component };
