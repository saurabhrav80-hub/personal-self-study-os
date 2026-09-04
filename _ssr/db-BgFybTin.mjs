import { t as Dexie } from "../_libs/dexie.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db-BgFybTin.js
var StudyDB = class extends Dexie {
	exams;
	subjects;
	books;
	bookFiles;
	chapters;
	topics;
	concepts;
	conceptLinks;
	notes;
	formulas;
	questions;
	attempts;
	mistakes;
	revisionItems;
	studySessions;
	mocks;
	mockResults;
	highlights;
	bookmarks;
	pageTexts;
	settings;
	constructor() {
		super("personal-self-study-os");
		this.version(1).stores({
			exams: "id, name, date, priority, active",
			subjects: "id, examId, name",
			books: "id, examId, subjectId, name, lastOpenedAt, createdAt",
			bookFiles: "bookId",
			chapters: "id, bookId, order",
			topics: "id, chapterId, bookId, examId, subjectId, nextRevisionAt, status",
			concepts: "id, name",
			conceptLinks: "id, fromId, toId",
			notes: "id, type, examId, bookId, topicId, questionId, updatedAt",
			formulas: "id, name, category",
			questions: "id, examId, topicId, subjectId, difficulty, type, source, createdAt",
			attempts: "id, questionId, sessionId, mockResultId, createdAt, correct",
			mistakes: "id, questionId, category, topicId, examId, createdAt",
			revisionItems: "id, kind, refId, examId, topicId, dueAt",
			studySessions: "id, examId, topicId, startedAt",
			mocks: "id, examId, kind, createdAt",
			mockResults: "id, mockId, submittedAt",
			highlights: "id, bookId, page",
			bookmarks: "id, bookId, page",
			pageTexts: "[bookId+page], bookId, page",
			settings: "id"
		});
	}
};
var instance = null;
function getDb() {
	if (typeof indexedDB === "undefined") return null;
	if (!instance) instance = new StudyDB();
	return instance;
}
function requireDb() {
	const db = getDb();
	if (!db) throw new Error("Local database is only available in the browser.");
	return db;
}
//#endregion
export { requireDb as n, getDb as t };
