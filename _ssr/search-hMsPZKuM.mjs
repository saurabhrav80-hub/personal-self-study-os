import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as getDb } from "./db-BgFybTin.mjs";
import { u as Input } from "./router-Cbj4RZlk.mjs";
import { n as Screen, t as EmptyState } from "./empty-r3dgi-HO.mjs";
import { t as AppLink } from "./app-link-DdPLkHlO.mjs";
import { i as searchPages } from "./pdf-BTrB7Hs0.mjs";
import { t as MiniSearch } from "../_libs/minisearch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-hMsPZKuM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function globalSearch(query) {
	const q = query.trim();
	if (q.length < 2) return [];
	const db = getDb();
	if (!db) return [];
	const [books, chapters, topics, questions, mistakes, notes, formulas, concepts, mocks] = await Promise.all([
		db.books.toArray(),
		db.chapters.toArray(),
		db.topics.toArray(),
		db.questions.toArray(),
		db.mistakes.toArray(),
		db.notes.toArray(),
		db.formulas.toArray(),
		db.concepts.toArray(),
		db.mocks.toArray()
	]);
	const docs = [];
	for (const b of books) docs.push({
		id: `book:${b.id}`,
		kind: "book",
		title: b.name,
		snippet: [b.author, b.edition].filter(Boolean).join(" · "),
		href: `/library/${b.id}`,
		examId: b.examId,
		body: `${b.name} ${b.author} ${b.fileName} ${b.extractionNote}`
	});
	for (const c of chapters) docs.push({
		id: `ch:${c.id}`,
		kind: "chapter",
		title: c.title,
		snippet: `Pages ${c.pageStart}–${c.pageEnd}`,
		href: `/library/${c.bookId}`,
		examId: null,
		body: c.title
	});
	for (const t of topics) docs.push({
		id: `topic:${t.id}`,
		kind: "topic",
		title: t.title,
		snippet: t.status.replace("_", " "),
		href: t.bookId ? `/library/${t.bookId}` : "/practice",
		examId: t.examId,
		body: t.title
	});
	for (const qu of questions) docs.push({
		id: `q:${qu.id}`,
		kind: "question",
		title: qu.stem.slice(0, 110),
		snippet: `${qu.difficulty} · ${qu.type}`,
		href: `/practice/run?mode=id&questionId=${qu.id}`,
		examId: qu.examId,
		body: `${qu.stem} ${qu.explanation} ${qu.tags.join(" ")} ${qu.options.map((o) => o.text).join(" ")}`
	});
	const qmap = new Map(questions.map((x) => [x.id, x]));
	for (const m of mistakes) {
		const stem = qmap.get(m.questionId)?.stem ?? "Mistake";
		docs.push({
			id: `m:${m.id}`,
			kind: "mistake",
			title: stem.slice(0, 110),
			snippet: m.category.replace(/_/g, " "),
			href: "/mistakes",
			examId: m.examId,
			body: `${stem} ${m.userAnswer} ${m.notes} ${m.category}`
		});
	}
	for (const n of notes) docs.push({
		id: `note:${n.id}`,
		kind: "note",
		title: n.title || "Untitled note",
		snippet: n.body.slice(0, 120),
		href: `/notes/${n.id}`,
		examId: n.examId,
		body: `${n.title} ${n.body}`
	});
	for (const f of formulas) docs.push({
		id: `f:${f.id}`,
		kind: "formula",
		title: f.name,
		snippet: f.formula,
		href: "/formulas",
		examId: f.examIds[0] ?? null,
		body: `${f.name} ${f.formula} ${f.meaning} ${f.whenToUse} ${f.commonMistake} ${f.category}`
	});
	for (const c of concepts) docs.push({
		id: `c:${c.id}`,
		kind: "concept",
		title: c.name,
		snippet: c.summary.slice(0, 140),
		href: `/concepts/${c.id}`,
		examId: c.examIds[0] ?? null,
		body: `${c.name} ${c.aliases.join(" ")} ${c.summary}`
	});
	for (const m of mocks) docs.push({
		id: `mock:${m.id}`,
		kind: "mock",
		title: m.name,
		snippet: `${m.kind} · ${m.questionIds.length} questions`,
		href: `/mocks`,
		examId: m.examId,
		body: m.name
	});
	const mini = new MiniSearch({
		fields: [
			"title",
			"body",
			"snippet"
		],
		storeFields: [
			"kind",
			"title",
			"snippet",
			"href",
			"examId"
		],
		searchOptions: {
			prefix: true,
			fuzzy: .15
		}
	});
	mini.addAll(docs);
	const results = mini.search(q).slice(0, 24).map((h) => ({
		id: String(h.id),
		kind: h.kind,
		title: h.title,
		snippet: h.snippet,
		href: h.href,
		examId: h.examId
	}));
	try {
		const pages = await searchPages(q, 8);
		for (const p of pages) results.push({
			id: `page:${p.bookId}:${p.page}`,
			kind: "page",
			title: `${p.bookName} · p. ${p.page}`,
			snippet: p.text,
			href: `/read/${p.bookId}?page=${p.page}`,
			examId: books.find((b) => b.id === p.bookId)?.examId ?? null
		});
	} catch {}
	return results.slice(0, 30);
}
function SearchPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [hits, setHits] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(async () => {
			if (q.trim().length < 2) {
				setHits([]);
				return;
			}
			setBusy(true);
			try {
				setHits(await globalSearch(q));
			} finally {
				setBusy(false);
			}
		}, 180);
		return () => clearTimeout(t);
	}, [q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: "Search",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				autoFocus: true,
				placeholder: "Working capital, duration, inventory…",
				value: q,
				onChange: (e) => setQ(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-subtle",
				children: busy ? "Searching locally…" : "Books, questions, notes, formulas, mistakes, pages"
			}),
			q.trim().length >= 2 && !busy && hits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				className: "mt-6",
				title: "No matches",
				body: "Nothing in your local library matched that phrase."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: hits.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppLink, {
					href: h.href,
					className: "block rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] tracking-wide text-subtle uppercase",
							children: h.kind
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: h.title
						}),
						h.snippet ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-2 text-xs text-muted",
							children: h.snippet
						}) : null
					]
				}) }, h.id))
			})
		]
	});
}
var SplitComponent = SearchPage;
//#endregion
export { SplitComponent as component };
