import { n as __exportAll } from "../_runtime.mjs";
import { c as nid } from "./utils-DZ4IgiFc.mjs";
import { n as requireDb } from "./db-BgFybTin.mjs";
import { h as __exportAll$1 } from "./router-Cbj4RZlk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pdf-BTrB7Hs0.js
var pdf_BTrB7Hs0_exports = /* @__PURE__ */ __exportAll({
	i: () => searchPages,
	n: () => loadBookBytes,
	r: () => pdf_exports,
	t: () => ingestPdfFile
});
var pdf_exports = /* @__PURE__ */ __exportAll$1({
	ingestPdfFile: () => ingestPdfFile,
	loadBookBytes: () => loadBookBytes,
	openPdf: () => openPdf,
	renderPageToCanvas: () => renderPageToCanvas,
	searchPages: () => searchPages
});
var pdfjsPromise = null;
async function pdfjs() {
	if (!pdfjsPromise) pdfjsPromise = (async () => {
		const mod = await import("../_libs/pdfjs-dist.mjs").then((n) => n.t);
		const worker = await import("./pdf.worker.min-CA4SejP6.mjs");
		mod.GlobalWorkerOptions.workerSrc = worker.default;
		return mod;
	})();
	return pdfjsPromise;
}
async function openPdf(data) {
	const mod = await pdfjs();
	const copy = (data instanceof Uint8Array ? data : new Uint8Array(data)).slice();
	return mod.getDocument({ data: copy }).promise;
}
async function renderPageToCanvas(data, pageNumber, canvas, scale = 1.2) {
	const pdf = await openPdf(data);
	try {
		const page = await pdf.getPage(pageNumber);
		const viewport = page.getViewport({ scale });
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Canvas is unavailable.");
		canvas.width = viewport.width;
		canvas.height = viewport.height;
		await page.render({
			canvas,
			canvasContext: ctx,
			viewport
		}).promise;
		return {
			width: viewport.width,
			height: viewport.height,
			pageCount: pdf.numPages
		};
	} finally {
		await pdf.destroy();
	}
}
function headingLike(line) {
	const t = line.trim();
	if (t.length < 3 || t.length > 90) return false;
	if (/^(\d+(\.\d+){0,3})[\s.).:-]+.+/.test(t)) return true;
	if (/^(chapter|part|unit|module|section)\s+\d+/i.test(t)) return true;
	const letters = t.replace(/[^A-Za-z]/g, "");
	if (letters.length >= 8 && letters === letters.toUpperCase()) return true;
	return false;
}
async function ingestPdfFile(file, meta, onProgress) {
	const db = requireDb();
	const dup = await db.books.filter((b) => b.fileName === file.name && b.size === file.size).first();
	if (dup) throw Object.assign(/* @__PURE__ */ new Error(`A book named “${file.name}” of the same size is already in the library.`), {
		code: "duplicate",
		bookId: dup.id
	});
	const book = {
		id: nid(),
		examId: meta.examId,
		subjectId: meta.subjectId,
		name: meta.name,
		author: meta.author,
		edition: meta.edition,
		fileName: file.name,
		mimeType: file.type || "application/pdf",
		size: file.size,
		pageCount: 0,
		lastPage: 1,
		lastOpenedAt: Date.now(),
		readingProgress: 0,
		completionStatus: "unread",
		extractionStatus: "running",
		extractionNote: "Reading file…",
		createdAt: Date.now()
	};
	await db.books.add(book);
	await db.bookFiles.put({
		bookId: book.id,
		blob: file,
		mimeType: book.mimeType
	});
	try {
		const pdf = await openPdf(await file.arrayBuffer());
		const pageCount = pdf.numPages;
		await db.books.update(book.id, {
			pageCount,
			extractionNote: `Extracting ${pageCount} pages…`
		});
		let outline = [];
		try {
			const raw = await pdf.getOutline();
			if (raw?.length) {
				const destPage = async (dest) => {
					try {
						let d = dest;
						if (typeof d === "string") d = await pdf.getDestination(d);
						if (Array.isArray(d) && d[0]) return await pdf.getPageIndex(d[0]) + 1;
					} catch {
						return null;
					}
					return null;
				};
				const walk = async (nodes, acc) => {
					for (const n of nodes) {
						const page = await destPage(n.dest);
						if (page && n.title) acc.push({
							title: n.title.trim(),
							page
						});
						if (n.items?.length) await walk(n.items, acc);
					}
				};
				await walk(raw, outline);
				outline.sort((a, b) => a.page - b.page);
			}
		} catch {
			outline = [];
		}
		const headingHits = [];
		const pageBatch = [];
		for (let p = 1; p <= pageCount; p++) {
			onProgress?.({
				page: p,
				total: pageCount,
				note: `Page ${p} of ${pageCount}`
			});
			try {
				const text = (await (await pdf.getPage(p)).getTextContent()).items.map((i) => i.str ?? "").join(" ").replace(/\s+/g, " ").trim();
				pageBatch.push({
					bookId: book.id,
					page: p,
					text
				});
				if (pageBatch.length >= 20) {
					await db.pageTexts.bulkPut(pageBatch);
					pageBatch.length = 0;
				}
				if (!outline.length) {
					const lines = text.split(/(?<=\.)\s+/).slice(0, 6);
					for (const line of lines) if (headingLike(line)) {
						headingHits.push({
							title: line.trim().slice(0, 80),
							page: p
						});
						break;
					}
				}
			} catch {
				pageBatch.push({
					bookId: book.id,
					page: p,
					text: ""
				});
			}
		}
		if (pageBatch.length) await db.pageTexts.bulkPut(pageBatch);
		await pdf.destroy();
		const detected = outline.length ? outline : headingHits;
		const unique = [];
		let lastPage = -1;
		for (const h of detected) {
			if (h.page === lastPage) continue;
			unique.push(h);
			lastPage = h.page;
		}
		let chapters = [];
		if (unique.length >= 2) chapters = unique.map((h, i) => ({
			id: nid(),
			bookId: book.id,
			title: h.title,
			pageStart: h.page,
			pageEnd: i + 1 < unique.length ? unique[i + 1].page - 1 : pageCount,
			order: i,
			status: "not_started"
		}));
		else chapters = [{
			id: nid(),
			bookId: book.id,
			title: "Full document",
			pageStart: 1,
			pageEnd: pageCount,
			order: 0,
			status: "not_started"
		}];
		const topics = chapters.map((ch, i) => ({
			id: nid(),
			chapterId: ch.id,
			bookId: book.id,
			examId: meta.examId,
			subjectId: meta.subjectId,
			title: ch.title,
			pageStart: ch.pageStart,
			pageEnd: ch.pageEnd,
			order: i,
			status: "not_started",
			importance: 3,
			lastStudiedAt: null,
			lastRevisedAt: null,
			nextRevisionAt: null,
			createdAt: Date.now()
		}));
		await db.chapters.bulkAdd(chapters);
		await db.topics.bulkAdd(topics);
		const scanned = await db.pageTexts.where("bookId").equals(book.id).filter((p) => !p.text).count() > pageCount * .7;
		const note = scanned ? "Little selectable text was found. This PDF may be scanned. Chapters were not invented — organize them manually. Original file is stored." : unique.length < 2 ? "No reliable chapter outline was found. A single document chapter was created. Edit the structure yourself — nothing was invented." : outline.length ? `Used the PDF’s own outline (${chapters.length} chapters).` : `Inferred ${chapters.length} headings from page text. Review and correct if needed.`;
		const patch = {
			pageCount,
			extractionStatus: scanned || unique.length < 2 ? "manual" : "ok",
			extractionNote: note
		};
		await db.books.update(book.id, patch);
		return {
			...book,
			...patch,
			pageCount
		};
	} catch (err) {
		const message = err instanceof Error && /password/i.test(err.message) ? "This PDF is password-protected and cannot be opened." : err instanceof Error ? `Could not parse this PDF (${err.message}). The original file is still stored — organize chapters manually.` : "Could not parse this PDF. The original file is still stored.";
		await db.books.update(book.id, {
			extractionStatus: "failed",
			extractionNote: message
		});
		throw Object.assign(new Error(message), { bookId: book.id });
	}
}
async function loadBookBytes(bookId) {
	const file = await requireDb().bookFiles.get(bookId);
	if (!file) return null;
	return file.blob.arrayBuffer();
}
async function searchPages(query, limit = 12) {
	const db = requireDb();
	const terms = query.toLowerCase().split(/\W+/).filter((t) => t.length > 2).slice(0, 6);
	if (!terms.length) return [];
	const books = await db.books.toArray();
	const bookName = new Map(books.map((b) => [b.id, b.name]));
	const chapters = await db.chapters.toArray();
	const hits = [];
	for (const book of books) {
		const pages = await db.pageTexts.where("bookId").equals(book.id).toArray();
		for (const p of pages) {
			if (!p.text) continue;
			const hay = p.text.toLowerCase();
			let score = 0;
			for (const t of terms) if (hay.includes(t)) score += 2;
			if (score < Math.min(2, terms.length)) continue;
			const idx = hay.indexOf(terms[0]);
			const start = Math.max(0, idx - 80);
			const snippet = p.text.slice(start, start + 280);
			const ch = chapters.find((c) => c.bookId === book.id && p.page >= c.pageStart && p.page <= c.pageEnd);
			hits.push({
				bookId: book.id,
				bookName: bookName.get(book.id) ?? "Book",
				chapterTitle: ch?.title ?? null,
				page: p.page,
				text: snippet,
				score: score + (hay.includes(query.toLowerCase()) ? 3 : 0)
			});
			if (hits.length > 80) break;
		}
	}
	return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
//#endregion
export { searchPages as i, loadBookBytes as n, pdf_BTrB7Hs0_exports as r, ingestPdfFile as t };
