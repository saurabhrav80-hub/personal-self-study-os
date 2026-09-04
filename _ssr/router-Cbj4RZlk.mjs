import { i as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { c as nid, n as clamp, r as cn, t as average } from "./utils-DZ4IgiFc.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { n as requireDb, t as getDb } from "./db-BgFybTin.mjs";
import { t as useLiveQuery } from "../_libs/dexie-react-hooks.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hooks-CEGs9wU7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var TOPIC_STATUS_LABEL = {
	not_started: "Not started",
	reading: "Reading",
	read: "Read",
	practiced: "Practiced",
	revised: "Revised",
	strong: "Strong",
	mastered: "Mastered"
};
var MISTAKE_LABEL = {
	concept_gap: "Concept gap",
	formula_error: "Formula error",
	calculation_error: "Calculation error",
	misread: "Misread question",
	careless: "Careless mistake",
	time_pressure: "Time pressure",
	wrong_approach: "Wrong approach",
	guess: "Guess",
	memory_failure: "Memory failure",
	other: "Other"
};
var MISTAKE_CATEGORIES = Object.keys(MISTAKE_LABEL);
var DEFAULT_WEIGHTS = {
	knowledge: 25,
	accuracy: 20,
	speed: 10,
	retention: 15,
	mock: 20,
	weak: 10
};
var STATUS_BASE = {
	not_started: 0,
	reading: 12,
	read: 28,
	practiced: 48,
	revised: 64,
	strong: 80,
	mastered: 92
};
var HALF_LIFE_DAYS = 18;
function decayRetention(lastRevisedAt, now = Date.now()) {
	if (!lastRevisedAt) return 40;
	const days = (now - lastRevisedAt) / 864e5;
	const retain = Math.pow(.5, days / HALF_LIFE_DAYS);
	return clamp(retain * 100, 8, 100);
}
function topicKnowledge(input) {
	const { topic, attempts, mistakes, revisions } = input;
	const now = input.now ?? Date.now();
	const status = STATUS_BASE[topic.status];
	const recent = attempts.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 25);
	const accuracy = recent.length ? recent.filter((a) => a.correct).length / recent.length * 100 : null;
	const recencyMistakes = mistakes.filter((m) => now - m.createdAt < 18144e5).length;
	const mistakePenalty = clamp(recencyMistakes * 7, 0, 55);
	const topicRevs = revisions.filter((r) => r.topicId === topic.id || r.kind === "topic" && r.refId === topic.id).sort((a, b) => (b.lastReviewedAt ?? 0) - (a.lastReviewedAt ?? 0));
	const lastRev = topicRevs[0];
	let recall = 55;
	if (lastRev?.lastResult === "knew") recall = 92;
	else if (lastRev?.lastResult === "partial") recall = 62;
	else if (lastRev?.lastResult === "forgot") recall = 28;
	const retention = lastRev?.lastReviewedAt ? decayRetention(lastRev.lastReviewedAt, now) * (recall / 100) * (100 / 70) : topic.lastRevisedAt ? decayRetention(topic.lastRevisedAt, now) : topic.lastStudiedAt ? decayRetention(topic.lastStudiedAt, now) * .7 : 35;
	if (accuracy === null && !topicRevs.length && topic.status === "not_started") return 0;
	if (accuracy === null) return clamp(status * .7 + retention * .3 - mistakePenalty * .15, 0, status);
	const raw = status * .28 + accuracy * .34 + clamp(retention, 0, 100) * .22 + (100 - mistakePenalty) * .16;
	return clamp(Math.round(raw), 0, 100);
}
function advanceStatus(current, event) {
	if (event === "read") {
		if (current === "not_started" || current === "reading") return "read";
		return current;
	}
	if (event === "practice") {
		if (STATUS_BASE[current] < STATUS_BASE.practiced) return "practiced";
		return current;
	}
	if (current === "not_started" || current === "reading" || current === "read" || current === "practiced") return "revised";
	return current;
}
function maybePromote(status, knowledge, accuracy) {
	if (accuracy !== null && accuracy >= 90 && knowledge >= 88) return "mastered";
	if (accuracy !== null && accuracy >= 80 && knowledge >= 75 && STATUS_BASE[status] >= STATUS_BASE.revised) return "strong";
	return status;
}
function classifySpeed(accuracy, avgTimeMs, targetMs) {
	if (!Number.isFinite(accuracy) || !Number.isFinite(avgTimeMs) || targetMs <= 0) return "neutral";
	const slow = avgTimeMs > targetMs * 1.25;
	const fast = avgTimeMs < targetMs * .75;
	const highAcc = accuracy >= 80;
	const lowAcc = accuracy < 60;
	if (highAcc && slow) return "speed";
	if (lowAcc && fast) return "concept";
	if (lowAcc && slow) return "major";
	if (highAcc && fast) return "strong";
	return "neutral";
}
var PATTERN_COPY = {
	speed: "High accuracy, slow pace — speed problem",
	concept: "Low accuracy, fast pace — concept problem",
	major: "Low accuracy, slow pace — major weakness",
	strong: "High accuracy, fast pace — strong area",
	neutral: "No dominant pattern yet"
};
function topicAnalytics(topics, questions, attempts, targetMsByExam, defaultTarget = 12e4) {
	const qByTopic = /* @__PURE__ */ new Map();
	for (const q of questions) {
		if (!q.topicId) continue;
		const list = qByTopic.get(q.topicId) ?? [];
		list.push(q);
		qByTopic.set(q.topicId, list);
	}
	const attemptsByQ = /* @__PURE__ */ new Map();
	for (const a of attempts) {
		const list = attemptsByQ.get(a.questionId) ?? [];
		list.push(a);
		attemptsByQ.set(a.questionId, list);
	}
	return topics.map((topic) => {
		const tq = qByTopic.get(topic.id) ?? [];
		const atts = [];
		const hard = [];
		const easy = [];
		for (const q of tq) {
			const qa = attemptsByQ.get(q.id) ?? [];
			atts.push(...qa);
			if (q.difficulty === "hard") hard.push(...qa);
			if (q.difficulty === "easy") easy.push(...qa);
		}
		const questionsN = atts.length;
		const correct = atts.filter((a) => a.correct).length;
		const accuracy = questionsN ? correct / questionsN * 100 : 0;
		const avgTimeMs = questionsN ? average(atts.map((a) => a.timeMs)) : 0;
		const hardAccuracy = hard.length ? hard.filter((a) => a.correct).length / hard.length * 100 : null;
		const easyAccuracy = easy.length ? easy.filter((a) => a.correct).length / easy.length * 100 : null;
		const target = topic.examId && targetMsByExam[topic.examId] || defaultTarget;
		return {
			topicId: topic.id,
			title: topic.title,
			examId: topic.examId,
			questions: questionsN,
			correct,
			accuracy,
			avgTimeMs,
			hardAccuracy,
			easyAccuracy,
			pattern: questionsN >= 4 ? classifySpeed(accuracy, avgTimeMs, target) : "neutral"
		};
	}).filter((t) => t.questions > 0).sort((a, b) => a.accuracy - b.accuracy);
}
function examReadiness(input) {
	const weights = input.weights ?? DEFAULT_WEIGHTS;
	const now = input.now ?? Date.now();
	const examTopics = input.topics.filter((t) => t.examId === input.exam.id);
	const examQuestionIds = new Set(input.questions.filter((q) => q.examId === input.exam.id).map((q) => q.id));
	const examAttempts = input.attempts.filter((a) => examQuestionIds.has(a.questionId));
	const examRevs = input.revisions.filter((r) => r.examId === input.exam.id);
	const knowVals = examTopics.map((t) => input.knowledgeByTopic[t.id] ?? 0);
	const knowledge = examTopics.length ? average(knowVals) : null;
	const recentAtt = examAttempts.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 80);
	const accuracy = recentAtt.length ? recentAtt.filter((a) => a.correct).length / recentAtt.length * 100 : null;
	const timed = recentAtt.filter((a) => a.timeMs > 0);
	const target = input.targetMs ?? 12e4;
	const speed = timed.length ? timed.filter((a) => a.timeMs <= target).length / timed.length * 100 : null;
	const due = examRevs.filter((r) => r.dueAt <= now).length;
	const reviewed = examRevs.filter((r) => r.lastReviewedAt && now - r.lastReviewedAt < 12096e5);
	const knew = reviewed.filter((r) => r.lastResult === "knew").length;
	const retention = examRevs.length === 0 ? knowledge === null ? null : clamp((knowledge ?? 0) * .6, 0, 100) : clamp((1 - due / Math.max(examRevs.length, 1)) * 55 + (reviewed.length ? knew / reviewed.length * 45 : 20), 0, 100);
	const examMocks = input.mockResults.filter((m) => {
		return true;
	}).slice().sort((a, b) => b.submittedAt - a.submittedAt).slice(0, 5);
	const mock = examMocks.length ? average(examMocks.map((m) => m.maxScore ? m.score / m.maxScore * 100 : m.accuracy)) : null;
	const topicsWeak = examTopics.filter((t) => (input.knowledgeByTopic[t.id] ?? 0) < 50).length;
	const weak = examTopics.length === 0 ? null : (1 - topicsWeak / examTopics.length) * 100;
	const topicsCompleted = examTopics.filter((t) => STATUS_BASE[t.status] >= STATUS_BASE.practiced).length;
	const available = [
		[knowledge, weights.knowledge],
		[accuracy, weights.accuracy],
		[speed, weights.speed],
		[retention, weights.retention],
		[mock, weights.mock],
		[weak, weights.weak]
	].filter((p) => p[0] !== null);
	const evidence = (knowledge !== null ? 1 : 0) + (accuracy !== null ? 1 : 0) + (mock !== null ? 1 : 0) + (examRevs.length ? 1 : 0);
	let overall = null;
	if (available.length && evidence >= 1 && (examAttempts.length >= 3 || examMocks.length || topicsCompleted)) {
		const wsum = available.reduce((s, p) => s + p[1], 0) || 1;
		overall = available.reduce((s, p) => s + p[0] * p[1], 0) / wsum;
	}
	return {
		examId: input.exam.id,
		overall: overall === null ? null : clamp(Math.round(overall), 0, 100),
		knowledge: knowledge === null ? null : Math.round(knowledge),
		accuracy: accuracy === null ? null : Math.round(accuracy),
		speed: speed === null ? null : Math.round(speed),
		retention: retention === null ? null : Math.round(retention),
		mock: mock === null ? null : Math.round(mock),
		weak: weak === null ? null : Math.round(weak),
		topicsTotal: examTopics.length,
		topicsCompleted,
		topicsWeak,
		revisionDue: due
	};
}
function nextInterval(item, result) {
	let { intervalDays, ease } = item;
	if (result === "forgot") {
		intervalDays = 1;
		ease = Math.max(1.3, ease - .2);
	} else if (result === "partial") {
		intervalDays = Math.max(1, Math.round(intervalDays * 1.2));
		ease = Math.max(1.3, ease - .05);
	} else {
		ease = Math.min(2.8, ease + .08);
		intervalDays = item.repetitions === 0 ? 1 : item.repetitions === 1 ? 3 : Math.round(intervalDays * ease);
	}
	return {
		intervalDays,
		ease,
		dueAt: Date.now() + intervalDays * 864e5
	};
}
function revisionBucket(dueAt, now = Date.now()) {
	const days = (dueAt - now) / 864e5;
	if (days <= .5) return "today";
	if (days <= 3) return "soon";
	return "later";
}
function whyLosingMarks(mistakes) {
	const map = /* @__PURE__ */ new Map();
	for (const m of mistakes) map.set(m.category, (map.get(m.category) ?? 0) + 1);
	return [...map.entries()].map(([category, count]) => ({
		category,
		count
	})).sort((a, b) => b.count - a.count);
}
function buildPriorities(input) {
	const now = input.now ?? Date.now();
	const items = [];
	const activeExams = input.exams.filter((e) => e.active);
	const examName = (id) => activeExams.find((e) => e.id === id)?.name ?? null;
	if (activeExams.length === 0) items.push({
		id: "setup-exam",
		title: "Add your first exam",
		reason: "CFA, CAT, GRE, or anything you are preparing for.",
		href: "/settings",
		examName: null,
		urgency: "now",
		score: 1e3
	});
	if (input.booksCount === 0) items.push({
		id: "upload-book",
		title: "Upload your first book",
		reason: "The OS is built around your own PDFs — start the library.",
		href: "/library",
		examName: null,
		urgency: "now",
		score: 900
	});
	if (input.attempts.length === 0 && input.questions.length > 0) items.push({
		id: "first-practice",
		title: "Answer a short practice set",
		reason: "Accuracy data is what turns reading into readiness.",
		href: "/practice",
		examName: null,
		urgency: "today",
		score: 850
	});
	for (const rev of input.revisions) {
		if (rev.dueAt > now) continue;
		const overdueDays = (now - rev.dueAt) / 864e5;
		items.push({
			id: `rev-${rev.id}`,
			title: rev.prompt.length > 72 ? `${rev.prompt.slice(0, 69)}…` : rev.prompt,
			reason: overdueDays > 1 ? `Revision overdue by ${Math.floor(overdueDays)}d` : "Revision due today",
			href: "/revision",
			examName: examName(rev.examId),
			urgency: "now",
			score: 700 + Math.min(80, overdueDays * 8) + (activeExams.find((e) => e.id === rev.examId)?.priority ?? 3) * 6
		});
	}
	const recentMistakes = input.mistakes.filter((m) => now - m.createdAt < 12096e5);
	const byTopic = /* @__PURE__ */ new Map();
	for (const m of recentMistakes) {
		if (!m.topicId) continue;
		byTopic.set(m.topicId, (byTopic.get(m.topicId) ?? 0) + 1);
	}
	for (const [topicId, count] of byTopic) {
		const topic = input.topics.find((t) => t.id === topicId);
		if (!topic) continue;
		items.push({
			id: `weak-${topicId}`,
			title: `${topic.title} — practice`,
			reason: `${count} recent mistake${count === 1 ? "" : "s"} on this topic`,
			href: `/practice/run?mode=topic&topicId=${topicId}`,
			examName: examName(topic.examId),
			urgency: count >= 4 ? "now" : "today",
			score: 520 + count * 18 + (activeExams.find((e) => e.id === topic.examId)?.priority ?? 3) * 8
		});
	}
	for (const topic of input.topics) {
		const k = input.knowledgeByTopic[topic.id] ?? 0;
		if (k > 0 && k < 45 && topic.status !== "not_started") items.push({
			id: `lowk-${topic.id}`,
			title: `Rebuild ${topic.title}`,
			reason: `Knowledge score ${Math.round(k)}% — below a safe floor`,
			href: `/practice/run?mode=topic&topicId=${topic.id}`,
			examName: examName(topic.examId),
			urgency: "today",
			score: 400 + (45 - k) + topic.importance * 10
		});
	}
	for (const exam of activeExams) {
		const unread = input.topics.find((t) => t.examId === exam.id && (t.status === "not_started" || t.status === "reading"));
		if (unread) {
			const days = exam.date ? Math.max(0, (exam.date - now) / 864e5) : 180;
			items.push({
				id: `read-${unread.id}`,
				title: `Read ${unread.title}`,
				reason: "Next unread topic in this exam",
				href: unread.bookId ? `/library/${unread.bookId}` : "/library",
				examName: exam.name,
				urgency: days < 30 ? "today" : "soon",
				score: 260 + exam.priority * 12 + (days < 60 ? 40 : 0)
			});
		}
	}
	const seen = /* @__PURE__ */ new Set();
	return items.sort((a, b) => b.score - a.score).filter((p) => {
		const key = p.title;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	}).slice(0, 5).map(({ score: _s, ...rest }) => rest);
}
function analyzeMock(input) {
	const { result, questions, mistakes, timeLimitMin, sections } = input;
	const qMap = new Map(questions.map((q) => [q.id, q]));
	const answered = result.answers.filter((a) => !a.skipped && a.answer);
	const unattempted = result.answers.filter((a) => a.skipped || !a.answer);
	const byCat = whyLosingMarks(mistakes);
	const wentWrong = [];
	const wentWell = [];
	const fixNext = [];
	const usedMs = result.answers.reduce((s, a) => s + a.timeMs, 0);
	const leftover = timeLimitMin * 6e4 - usedMs;
	if (unattempted.length && leftover > 9e4) {
		wentWrong.push(`Left ${unattempted.length} question${unattempted.length === 1 ? "" : "s"} unattempted with ${Math.round(leftover / 6e4)} min remaining — a selection issue, not a time shortage.`);
		fixNext.push("Decide skip rules before the next mock: cap time per item and move on.");
	} else if (unattempted.length && leftover <= 0) {
		wentWrong.push(`Time expired with ${unattempted.length} unattempted. Speed or over-investment in hard items is the constraint.`);
		fixNext.push("Run a timed sectional focusing on the slowest section.");
	}
	if (byCat[0] && byCat[0].count >= 2) {
		const label = byCat[0].category.replace(/_/g, " ");
		wentWrong.push(`${byCat[0].count} recorded mistakes classified as ${label} — that is the dominant leak.`);
		if (byCat[0].category === "careless" || byCat[0].category === "misread") fixNext.push("Add a 5-second stem re-read before marking any option on the next timed set.");
		else if (byCat[0].category === "concept_gap" || byCat[0].category === "wrong_approach") fixNext.push("Revisit the underlying topic with recall, then 10 mixed questions — do not re-read notes only.");
		else if (byCat[0].category === "time_pressure") fixNext.push("Practice the same difficulty with a tighter per-question cap.");
	}
	const sectionStats = sections.map((s) => {
		const ids = new Set(s.questionIds);
		const rows = result.answers.filter((a) => ids.has(a.questionId));
		const att = rows.filter((a) => a.answer && !a.skipped);
		const correct = att.filter((a) => {
			const q = qMap.get(a.questionId);
			return q ? a.answer === q.correctAnswer : false;
		}).length;
		const acc = att.length ? correct / att.length * 100 : 0;
		return {
			name: s.name,
			acc,
			n: att.length,
			total: rows.length
		};
	});
	if (sectionStats.length >= 2) {
		const best = [...sectionStats].sort((a, b) => b.acc - a.acc)[0];
		const worst = [...sectionStats].sort((a, b) => a.acc - b.acc)[0];
		if (best && best.n) wentWell.push(`${best.name} led with ${Math.round(best.acc)}% accuracy on ${best.n} attempts.`);
		if (worst && best && worst.name !== best.name && worst.n) {
			wentWrong.push(`${worst.name} lagged at ${Math.round(worst.acc)}% accuracy.`);
			fixNext.push(`Next session: sectional mock on ${worst.name} only.`);
		}
	}
	const easyWrong = answered.filter((a) => {
		const q = qMap.get(a.questionId);
		return q?.difficulty === "easy" && a.answer !== q.correctAnswer;
	}).length;
	if (easyWrong >= 2) wentWrong.push(`${easyWrong} easy items missed — those are recoverable marks.`);
	const hardRight = answered.filter((a) => {
		const q = qMap.get(a.questionId);
		return q?.difficulty === "hard" && a.answer === q.correctAnswer;
	}).length;
	if (hardRight >= 2) wentWell.push(`Converted ${hardRight} hard items. That is real skill, not luck on easy marks.`);
	if (result.accuracy >= 80 && answered.length) wentWell.push(`Accuracy ${Math.round(result.accuracy)}% on attempted items.`);
	if (result.attemptRate >= 85) wentWell.push(`Attempt rate ${Math.round(result.attemptRate)}% — coverage was not the problem.`);
	const topicMiss = /* @__PURE__ */ new Map();
	for (const a of answered) {
		const q = qMap.get(a.questionId);
		if (!q?.topicId) continue;
		if (a.answer !== q.correctAnswer) topicMiss.set(q.topicId, (topicMiss.get(q.topicId) ?? 0) + 1);
	}
	const topMiss = [...topicMiss.entries()].sort((a, b) => b[1] - a[1])[0];
	if (topMiss) {
		const label = questions.find((x) => x.topicId === topMiss[0])?.tags[0] ?? "the weakest topic in this mock";
		fixNext.push(`Drill ${label} tomorrow before opening a new mock.`);
	}
	return {
		wentWrong: wentWrong.slice(0, 5),
		wentWell: wentWell.slice(0, 5),
		fixNext: [...new Set(fixNext)].slice(0, 4)
	};
}
async function getSettings() {
	const db = requireDb();
	const row = await db.settings.get("settings");
	if (row) return row;
	const fresh = {
		id: "settings",
		theme: "system",
		displayName: "",
		onboardingComplete: false,
		seedVersion: 0,
		targetTimes: {
			"exam-cfa": 15e4,
			"exam-cat": 9e4,
			"exam-gre": 12e4
		},
		readinessWeights: { ...DEFAULT_WEIGHTS },
		includeStarterContent: true
	};
	await db.settings.put(fresh);
	return fresh;
}
async function patchSettings(patch) {
	const cur = await getSettings();
	await requireDb().settings.put({
		...cur,
		...patch,
		id: "settings"
	});
}
async function createExam(input) {
	const exam = {
		id: nid(),
		name: input.name.trim(),
		date: input.date ?? null,
		priority: input.priority ?? 3,
		targetScore: input.targetScore ?? null,
		active: true,
		createdAt: Date.now()
	};
	await requireDb().exams.add(exam);
	return exam;
}
async function updateExam(id, patch) {
	await requireDb().exams.update(id, patch);
}
async function setTopicStatus(id, status) {
	await requireDb().topics.update(id, {
		status,
		lastStudiedAt: Date.now()
	});
}
async function markTopicEvent(topicId, event) {
	const db = requireDb();
	const topic = await db.topics.get(topicId);
	if (!topic) return;
	const patch = {
		status: advanceStatus(topic.status, event),
		lastStudiedAt: Date.now()
	};
	if (event === "revise") {
		patch.lastRevisedAt = Date.now();
		patch.nextRevisionAt = Date.now() + 1728e5;
	}
	await db.topics.update(topicId, patch);
}
async function createQuestion(input) {
	const q = {
		...input,
		id: nid(),
		createdAt: Date.now()
	};
	await requireDb().questions.add(q);
	return q;
}
async function recordAttempt(input) {
	const db = requireDb();
	const attempt = {
		id: nid(),
		questionId: input.question.id,
		sessionId: input.sessionId ?? null,
		mockResultId: input.mockResultId ?? null,
		answer: input.answer,
		correct: input.correct,
		confidence: input.confidence,
		timeMs: input.timeMs,
		createdAt: Date.now()
	};
	await db.attempts.add(attempt);
	let mistake = null;
	if (!input.correct) {
		mistake = {
			id: nid(),
			questionId: input.question.id,
			attemptId: attempt.id,
			userAnswer: input.answer,
			correctAnswer: input.question.correctAnswer,
			category: input.mistakeCategory ?? "other",
			topicId: input.question.topicId,
			examId: input.question.examId,
			difficulty: input.question.difficulty,
			timeMs: input.timeMs,
			notes: input.mistakeNotes ?? "",
			createdAt: Date.now()
		};
		await db.mistakes.add(mistake);
	}
	if (input.question.topicId) {
		await markTopicEvent(input.question.topicId, "practice");
		const topic = await db.topics.get(input.question.topicId);
		if (topic) {
			const atts = await db.attempts.filter((a) => {
				return true;
			}).toArray();
			const qids = new Set((await db.questions.where("topicId").equals(input.question.topicId).toArray()).map((q) => q.id));
			const topicAtts = atts.filter((a) => qids.has(a.questionId));
			const k = topicKnowledge({
				topic,
				attempts: topicAtts,
				mistakes: await db.mistakes.where("topicId").equals(input.question.topicId).toArray(),
				revisions: await db.revisionItems.where("topicId").equals(input.question.topicId).toArray()
			});
			const acc = topicAtts.length ? topicAtts.filter((a) => a.correct).length / topicAtts.length * 100 : null;
			const promoted = maybePromote(topic.status, k, acc);
			if (promoted !== topic.status) await db.topics.update(topic.id, { status: promoted });
		}
	}
	if (input.sessionId) {
		const s = await db.studySessions.get(input.sessionId);
		if (s) await db.studySessions.update(s.id, {
			questionsSolved: s.questionsSolved + 1,
			correctCount: s.correctCount + (input.correct ? 1 : 0)
		});
	}
	return {
		attempt,
		mistake
	};
}
async function classifyMistake(id, category, notes) {
	await requireDb().mistakes.update(id, {
		category,
		notes: notes ?? ""
	});
}
async function addRevision(input) {
	const item = {
		id: nid(),
		kind: input.kind,
		refId: input.refId,
		examId: input.examId ?? null,
		topicId: input.topicId ?? null,
		prompt: input.prompt,
		answer: input.answer,
		dueAt: Date.now(),
		intervalDays: 1,
		ease: 2.5,
		repetitions: 0,
		lastResult: null,
		createdAt: Date.now(),
		lastReviewedAt: null
	};
	await requireDb().revisionItems.add(item);
	return item;
}
async function reviewRevision(id, result) {
	const db = requireDb();
	const item = await db.revisionItems.get(id);
	if (!item) return;
	const next = nextInterval(item, result);
	await db.revisionItems.update(id, {
		...next,
		lastResult: result,
		lastReviewedAt: Date.now(),
		repetitions: item.repetitions + 1
	});
	if (item.topicId) await markTopicEvent(item.topicId, "revise");
}
async function saveNote(input) {
	const db = requireDb();
	const now = Date.now();
	if (input.id) {
		const existing = await db.notes.get(input.id);
		if (existing) {
			const next = {
				...existing,
				title: input.title,
				body: input.body,
				type: input.type ?? existing.type,
				examId: input.examId ?? existing.examId,
				bookId: input.bookId ?? existing.bookId,
				chapterId: input.chapterId ?? existing.chapterId,
				topicId: input.topicId ?? existing.topicId,
				questionId: input.questionId ?? existing.questionId,
				conceptId: input.conceptId ?? existing.conceptId,
				updatedAt: now
			};
			await db.notes.put(next);
			return next;
		}
	}
	const note = {
		id: input.id ?? nid(),
		type: input.type ?? "text",
		title: input.title,
		body: input.body,
		examId: input.examId ?? null,
		bookId: input.bookId ?? null,
		chapterId: input.chapterId ?? null,
		topicId: input.topicId ?? null,
		questionId: input.questionId ?? null,
		conceptId: input.conceptId ?? null,
		createdAt: now,
		updatedAt: now
	};
	await db.notes.add(note);
	return note;
}
async function createFormula(input) {
	const f = {
		...input,
		id: nid(),
		createdAt: Date.now()
	};
	await requireDb().formulas.add(f);
	return f;
}
async function startSession(input) {
	const s = {
		id: nid(),
		examId: input.examId ?? null,
		topicId: input.topicId ?? null,
		bookId: input.bookId ?? null,
		title: input.title,
		startedAt: Date.now(),
		endedAt: null,
		plannedMin: input.plannedMin,
		questionsSolved: 0,
		correctCount: 0,
		notesCreated: 0,
		revisionsCreated: 0
	};
	await requireDb().studySessions.add(s);
	return s;
}
async function endSession(id) {
	await requireDb().studySessions.update(id, { endedAt: Date.now() });
}
async function createMock(input) {
	const m = {
		...input,
		id: nid(),
		createdAt: Date.now()
	};
	await requireDb().mocks.add(m);
	return m;
}
async function saveMockResult(r) {
	await requireDb().mockResults.put(r);
}
async function addHighlight(h) {
	const row = {
		...h,
		id: nid(),
		createdAt: Date.now()
	};
	await requireDb().highlights.add(row);
	return row;
}
async function addBookmark(b) {
	const row = {
		...b,
		id: nid(),
		createdAt: Date.now()
	};
	await requireDb().bookmarks.add(row);
	return row;
}
async function saveChapters(bookId, chapters) {
	const db = requireDb();
	await db.transaction("rw", db.chapters, async () => {
		await db.chapters.where("bookId").equals(bookId).delete();
		if (chapters.length) await db.chapters.bulkAdd(chapters);
	});
}
async function updateBook(id, patch) {
	await requireDb().books.update(id, patch);
}
async function deleteBook(id) {
	const db = requireDb();
	await db.transaction("rw", [
		db.books,
		db.bookFiles,
		db.chapters,
		db.topics,
		db.pageTexts,
		db.highlights,
		db.bookmarks,
		db.notes
	], async () => {
		await db.books.delete(id);
		await db.bookFiles.delete(id);
		await db.chapters.where("bookId").equals(id).delete();
		await db.topics.where("bookId").equals(id).delete();
		await db.pageTexts.where("bookId").equals(id).delete();
		await db.highlights.where("bookId").equals(id).delete();
		await db.bookmarks.where("bookId").equals(id).delete();
	});
}
async function deleteNote(id) {
	await requireDb().notes.delete(id);
}
function useExams() {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		return (await db.exams.toArray()).filter((e) => e.active).sort((a, b) => b.priority - a.priority || a.name.localeCompare(b.name));
	}, []) ?? [];
}
function useAllExams() {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		return db.exams.toArray();
	}, []) ?? [];
}
function useSubjects(examId) {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		const all = await db.subjects.toArray();
		return examId ? all.filter((s) => s.examId === examId) : all;
	}, [examId]) ?? [];
}
function useBooks() {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		return (await db.books.toArray()).sort((a, b) => (b.lastOpenedAt ?? b.createdAt) - (a.lastOpenedAt ?? a.createdAt));
	}, []) ?? [];
}
function useBook(id) {
	return useLiveQuery(async () => {
		if (!id) return void 0;
		return getDb()?.books.get(id);
	}, [id]);
}
function useChapters(bookId) {
	return useLiveQuery(async () => {
		if (!bookId) return [];
		const db = getDb();
		if (!db) return [];
		return db.chapters.where("bookId").equals(bookId).sortBy("order");
	}, [bookId]) ?? [];
}
function useTopics(filter) {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		let rows = await db.topics.toArray();
		if (filter?.bookId) rows = rows.filter((t) => t.bookId === filter.bookId);
		if (filter?.examId) rows = rows.filter((t) => t.examId === filter.examId);
		return rows.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
	}, [filter?.bookId, filter?.examId]) ?? [];
}
function useQuestions() {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		return db.questions.orderBy("createdAt").reverse().toArray();
	}, []) ?? [];
}
function useAttempts() {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		return db.attempts.orderBy("createdAt").reverse().toArray();
	}, []) ?? [];
}
function useMistakes() {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		return db.mistakes.orderBy("createdAt").reverse().toArray();
	}, []) ?? [];
}
function useRevisions() {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		return db.revisionItems.toArray();
	}, []) ?? [];
}
function useNotes() {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		return db.notes.orderBy("updatedAt").reverse().toArray();
	}, []) ?? [];
}
function useFormulas() {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		return db.formulas.toArray();
	}, []) ?? [];
}
function useConcepts() {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		return db.concepts.toArray();
	}, []) ?? [];
}
function useConceptLinks() {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		return db.conceptLinks.toArray();
	}, []) ?? [];
}
function useMocks() {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		return db.mocks.orderBy("createdAt").reverse().toArray();
	}, []) ?? [];
}
function useMockResults() {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		return db.mockResults.orderBy("submittedAt").reverse().toArray();
	}, []) ?? [];
}
function useSessions() {
	return useLiveQuery(async () => {
		const db = getDb();
		if (!db) return [];
		return db.studySessions.orderBy("startedAt").reverse().toArray();
	}, []) ?? [];
}
function useSettingsLive() {
	return useLiveQuery(async () => {
		if (!getDb()) return void 0;
		return getSettings();
	}, []);
}
function useHighlights(bookId) {
	return useLiveQuery(async () => {
		if (!bookId) return [];
		const db = getDb();
		if (!db) return [];
		return db.highlights.where("bookId").equals(bookId).toArray();
	}, [bookId]) ?? [];
}
function useBookmarks(bookId) {
	return useLiveQuery(async () => {
		if (!bookId) return [];
		const db = getDb();
		if (!db) return [];
		return db.bookmarks.where("bookId").equals(bookId).sortBy("page");
	}, [bookId]) ?? [];
}
function useKnowledgeMap() {
	const topics = useTopics();
	const attempts = useAttempts();
	const mistakes = useMistakes();
	const revisions = useRevisions();
	const questions = useQuestions();
	return (0, import_react.useMemo)(() => {
		const qByTopic = /* @__PURE__ */ new Map();
		for (const q of questions) {
			if (!q.topicId) continue;
			const set = qByTopic.get(q.topicId) ?? /* @__PURE__ */ new Set();
			set.add(q.id);
			qByTopic.set(q.topicId, set);
		}
		const map = {};
		for (const topic of topics) {
			const ids = qByTopic.get(topic.id);
			const atts = ids ? attempts.filter((a) => ids.has(a.questionId)) : [];
			const ms = mistakes.filter((m) => m.topicId === topic.id);
			const rs = revisions.filter((r) => r.topicId === topic.id || r.kind === "topic" && r.refId === topic.id);
			map[topic.id] = topicKnowledge({
				topic,
				attempts: atts,
				mistakes: ms,
				revisions: rs
			});
		}
		return map;
	}, [
		topics,
		attempts,
		mistakes,
		revisions,
		questions
	]);
}
function useReadiness() {
	const exams = useExams();
	const topics = useTopics();
	const knowledge = useKnowledgeMap();
	const attempts = useAttempts();
	const questions = useQuestions();
	const revisions = useRevisions();
	const mockResults = useMockResults();
	const mocks = useMocks();
	const settings = useSettingsLive();
	return (0, import_react.useMemo)(() => {
		const mockExam = new Map(mocks.map((m) => [m.id, m.examId]));
		return exams.map((exam) => {
			const examMockResults = mockResults.filter((r) => mockExam.get(r.mockId) === exam.id);
			return examReadiness({
				exam,
				topics,
				knowledgeByTopic: knowledge,
				attempts,
				questions,
				revisions,
				mockResults: examMockResults,
				weights: settings?.readinessWeights,
				targetMs: settings?.targetTimes[exam.id]
			});
		});
	}, [
		exams,
		topics,
		knowledge,
		attempts,
		questions,
		revisions,
		mockResults,
		mocks,
		settings
	]);
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/rolldown-runtime-D7D4PA-g.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-Cbj4RZlk.js
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var NOW = Date.now();
var EXAMS = [
	{
		id: "exam-cfa",
		name: "CFA",
		date: null,
		priority: 5,
		targetScore: null,
		active: true,
		createdAt: NOW
	},
	{
		id: "exam-cat",
		name: "CAT",
		date: null,
		priority: 5,
		targetScore: null,
		active: true,
		createdAt: NOW
	},
	{
		id: "exam-gre",
		name: "GRE",
		date: null,
		priority: 4,
		targetScore: null,
		active: true,
		createdAt: NOW
	}
];
var SUBJECTS = [
	{
		id: "sub-cfa-fra",
		examId: "exam-cfa",
		name: "Financial Reporting",
		weight: 20
	},
	{
		id: "sub-cfa-quant",
		examId: "exam-cfa",
		name: "Quantitative Methods",
		weight: 10
	},
	{
		id: "sub-cfa-fi",
		examId: "exam-cfa",
		name: "Fixed Income",
		weight: 12
	},
	{
		id: "sub-cfa-corp",
		examId: "exam-cfa",
		name: "Corporate Finance",
		weight: 10
	},
	{
		id: "sub-cat-quant",
		examId: "exam-cat",
		name: "Quantitative Ability",
		weight: 34
	},
	{
		id: "sub-cat-dilr",
		examId: "exam-cat",
		name: "DILR",
		weight: 32
	},
	{
		id: "sub-cat-varc",
		examId: "exam-cat",
		name: "VARC",
		weight: 34
	},
	{
		id: "sub-gre-quant",
		examId: "exam-gre",
		name: "Quantitative Reasoning",
		weight: 50
	},
	{
		id: "sub-gre-verbal",
		examId: "exam-gre",
		name: "Verbal Reasoning",
		weight: 50
	}
];
function topic(id, examId, subjectId, title, order) {
	return {
		id,
		chapterId: null,
		bookId: null,
		examId,
		subjectId,
		title,
		pageStart: null,
		pageEnd: null,
		order,
		status: "not_started",
		importance: 3,
		lastStudiedAt: null,
		lastRevisedAt: null,
		nextRevisionAt: null,
		createdAt: NOW
	};
}
var TOPICS = [
	topic("t-cfa-wc", "exam-cfa", "sub-cfa-fra", "Working capital", 1),
	topic("t-cfa-ratios", "exam-cfa", "sub-cfa-fra", "Financial ratios", 2),
	topic("t-cfa-inventory", "exam-cfa", "sub-cfa-fra", "Inventory", 3),
	topic("t-cfa-revenue", "exam-cfa", "sub-cfa-fra", "Revenue recognition", 4),
	topic("t-cfa-dupont", "exam-cfa", "sub-cfa-fra", "DuPont analysis", 5),
	topic("t-cfa-tvm", "exam-cfa", "sub-cfa-quant", "Time value of money", 6),
	topic("t-cfa-duration", "exam-cfa", "sub-cfa-fi", "Duration", 7),
	topic("t-cfa-wacc", "exam-cfa", "sub-cfa-corp", "Cost of capital", 8),
	topic("t-cat-pct", "exam-cat", "sub-cat-quant", "Percentages", 1),
	topic("t-cat-pl", "exam-cat", "sub-cat-quant", "Profit and loss", 2),
	topic("t-cat-tsd", "exam-cat", "sub-cat-quant", "Time, speed, distance", 3),
	topic("t-cat-prob", "exam-cat", "sub-cat-quant", "Probability", 4),
	topic("t-cat-ratio", "exam-cat", "sub-cat-quant", "Ratios and mixtures", 5),
	topic("t-cat-work", "exam-cat", "sub-cat-quant", "Time and work", 6),
	topic("t-cat-dilr", "exam-cat", "sub-cat-dilr", "Logical sets", 7),
	topic("t-gre-alg", "exam-gre", "sub-gre-quant", "Algebra", 1),
	topic("t-gre-geo", "exam-gre", "sub-gre-quant", "Geometry", 2),
	topic("t-gre-stats", "exam-gre", "sub-gre-quant", "Statistics", 3),
	topic("t-gre-qc", "exam-gre", "sub-gre-quant", "Quantitative comparison", 4),
	topic("t-gre-vocab", "exam-gre", "sub-gre-verbal", "Vocabulary in context", 5)
];
function f(partial) {
	return {
		...partial,
		createdAt: NOW
	};
}
var FORMULAS = [
	f({
		id: "f-wc",
		name: "Working capital",
		formula: "WC = Current assets − Current liabilities",
		meaning: "Short-term liquidity buffer after covering obligations due within a year.",
		variables: [{
			symbol: "CA",
			name: "Current assets"
		}, {
			symbol: "CL",
			name: "Current liabilities"
		}],
		example: "CA 80, CL 50 → WC = 30.",
		whenToUse: "Liquidity analysis, cash conversion discussions, CFA FRA.",
		commonMistake: "Including long-term debt in current liabilities, or mixing cash with net WC.",
		examIds: ["exam-cfa"],
		category: "Finance",
		relatedConceptIds: ["c-working-capital", "c-ratios"]
	}),
	f({
		id: "f-current",
		name: "Current ratio",
		formula: "Current ratio = CA / CL",
		meaning: "How many times current assets cover current liabilities.",
		variables: [{
			symbol: "CA",
			name: "Current assets"
		}, {
			symbol: "CL",
			name: "Current liabilities"
		}],
		example: "CA 120, CL 80 → 1.5.",
		whenToUse: "Quick liquidity screen. Compare to industry, not an absolute 2.0 rule.",
		commonMistake: "Treating a high ratio as always better — it can mean idle inventory or cash.",
		examIds: ["exam-cfa"],
		category: "Finance",
		relatedConceptIds: ["c-ratios"]
	}),
	f({
		id: "f-quick",
		name: "Quick ratio",
		formula: "Quick ratio = (Cash + Marketable securities + Receivables) / CL",
		meaning: "Liquidity without relying on inventory conversion.",
		variables: [{
			symbol: "CL",
			name: "Current liabilities"
		}],
		example: "Strip inventory from CA, then divide by CL.",
		whenToUse: "When inventory is slow-moving or of uncertain value.",
		commonMistake: "Forgetting to exclude prepaid expenses as well as inventory.",
		examIds: ["exam-cfa"],
		category: "Finance",
		relatedConceptIds: ["c-ratios", "c-inventory"]
	}),
	f({
		id: "f-roe",
		name: "Three-step DuPont ROE",
		formula: "ROE = NPM × Asset turnover × Equity multiplier",
		meaning: "Decomposes return on equity into profitability, efficiency, and leverage.",
		variables: [
			{
				symbol: "NPM",
				name: "Net profit margin"
			},
			{
				symbol: "AT",
				name: "Asset turnover"
			},
			{
				symbol: "EM",
				name: "Equity multiplier (A/E)"
			}
		],
		example: "5% × 1.2 × 2.0 = 12% ROE.",
		whenToUse: "Explaining why ROE moved — margin vs volume vs leverage.",
		commonMistake: "Mixing beginning and ending equity inconsistently across the three terms.",
		examIds: ["exam-cfa"],
		category: "Finance",
		relatedConceptIds: ["c-dupont", "c-ratios"]
	}),
	f({
		id: "f-wacc",
		name: "WACC",
		formula: "WACC = we·re + wd·rd·(1 − t) + wp·rp",
		meaning: "After-tax weighted average cost of the firm’s capital claims.",
		variables: [
			{
				symbol: "re",
				name: "Cost of equity"
			},
			{
				symbol: "rd",
				name: "Cost of debt"
			},
			{
				symbol: "t",
				name: "Tax rate"
			}
		],
		example: "60% equity at 10%, 40% debt at 6%, tax 25% → 0.6·10% + 0.4·6%·0.75 = 7.8%.",
		whenToUse: "Discount rate for projects with risk similar to the firm.",
		commonMistake: "Forgetting the tax shield on debt, or using book weights when market weights are required.",
		examIds: ["exam-cfa"],
		category: "Finance",
		relatedConceptIds: ["c-wacc"]
	}),
	f({
		id: "f-capm",
		name: "CAPM",
		formula: "re = rf + β (rm − rf)",
		meaning: "Required equity return given systematic risk.",
		variables: [
			{
				symbol: "rf",
				name: "Risk-free rate"
			},
			{
				symbol: "β",
				name: "Beta"
			},
			{
				symbol: "rm − rf",
				name: "Equity risk premium"
			}
		],
		example: "rf 3%, β 1.2, ERP 5% → 9%.",
		whenToUse: "Cost of equity when a beta is defensible.",
		commonMistake: "Using total volatility instead of beta, or a mismatched rf tenor.",
		examIds: ["exam-cfa"],
		category: "Finance",
		relatedConceptIds: ["c-wacc", "c-probability"]
	}),
	f({
		id: "f-macd",
		name: "Macaulay duration",
		formula: "MacD = Σ t · PVt / Price",
		meaning: "Present-value-weighted average time until cash flows are received.",
		variables: [{
			symbol: "t",
			name: "Time of cash flow"
		}, {
			symbol: "PVt",
			name: "PV of that cash flow"
		}],
		example: "A 1-year  coupon bond has MacD < maturity unless it is a zero.",
		whenToUse: "Interest-rate sensitivity intuition; convert to modified duration for price math.",
		commonMistake: "Treating duration as maturity, or applying MacD directly as a percentage price change.",
		examIds: ["exam-cfa"],
		category: "Finance",
		relatedConceptIds: ["c-duration"]
	}),
	f({
		id: "f-modd",
		name: "Modified duration",
		formula: "ModD = MacD / (1 + y/k)",
		meaning: "Approximate percentage price change for a yield change.",
		variables: [{
			symbol: "y",
			name: "Yield per year"
		}, {
			symbol: "k",
			name: "Compounding periods per year"
		}],
		example: "ΔP/P ≈ −ModD · Δy.",
		whenToUse: "Linear rate-risk estimate. Convexity for large moves.",
		commonMistake: "Using Δy in percent vs decimal inconsistently.",
		examIds: ["exam-cfa"],
		category: "Finance",
		relatedConceptIds: ["c-duration"]
	}),
	f({
		id: "f-npv",
		name: "NPV",
		formula: "NPV = Σ CFt / (1 + r)^t − CF0",
		meaning: "Value created after recovering the required return.",
		variables: [{
			symbol: "CFt",
			name: "Cash flow at t"
		}, {
			symbol: "r",
			name: "Discount rate"
		}],
		example: "Invest 100, receive 60 and 60 at 10% → NPV ≈ 4.1.",
		whenToUse: "Project accept/reject when cash flows and risk-adjusted r are known.",
		commonMistake: "Mixing nominal cash flows with a real rate.",
		examIds: ["exam-cfa"],
		category: "Finance",
		relatedConceptIds: ["c-tvm"]
	}),
	f({
		id: "f-cagr",
		name: "CAGR",
		formula: "CAGR = (Ending / Beginning)^(1/n) − 1",
		meaning: "Constant annual growth that takes a start value to an end value.",
		variables: [{
			symbol: "n",
			name: "Number of years"
		}],
		example: "100 → 121 in 2 years → 10%.",
		whenToUse: "Growth rates, GRE/CAT percentages, CFA revenue/EPS growth.",
		commonMistake: "Using n = number of observations instead of intervals.",
		examIds: [
			"exam-cfa",
			"exam-cat",
			"exam-gre"
		],
		category: "Mathematics",
		relatedConceptIds: ["c-percentage", "c-tvm"]
	}),
	f({
		id: "f-pct",
		name: "Percentage change",
		formula: "%Δ = (New − Old) / Old × 100",
		meaning: "Relative change versus a base.",
		variables: [],
		example: "80 → 100 is +25%, not +20%.",
		whenToUse: "Any relative comparison. Chain successive percentages multiplicatively.",
		commonMistake: "Adding successive percent changes, or using the wrong base.",
		examIds: [
			"exam-cat",
			"exam-gre",
			"exam-cfa"
		],
		category: "Mathematics",
		relatedConceptIds: ["c-percentage"]
	}),
	f({
		id: "f-ci",
		name: "Compound interest",
		formula: "A = P (1 + r/n)^(nt)",
		meaning: "Future value with intra-year compounding.",
		variables: [
			{
				symbol: "P",
				name: "Principal"
			},
			{
				symbol: "r",
				name: "Nominal annual rate"
			},
			{
				symbol: "n",
				name: "Compounds per year"
			},
			{
				symbol: "t",
				name: "Years"
			}
		],
		example: "P 1000, r 8%, n 2, t 1 → 1081.6.",
		whenToUse: "TVM, CAT CI, GRE word problems.",
		commonMistake: "Using simple interest, or confusing r with r/n.",
		examIds: [
			"exam-cat",
			"exam-gre",
			"exam-cfa"
		],
		category: "Mathematics",
		relatedConceptIds: ["c-tvm", "c-percentage"]
	}),
	f({
		id: "f-speed",
		name: "Speed",
		formula: "Speed = Distance / Time",
		meaning: "Average speed over an interval.",
		variables: [],
		example: "120 km in 2 h → 60 km/h.",
		whenToUse: "TSD problems. Harmonic mean when distances are equal at two speeds.",
		commonMistake: "Averaging two speeds arithmetically when times are unequal.",
		examIds: ["exam-cat", "exam-gre"],
		category: "Mathematics",
		relatedConceptIds: ["c-tsd"]
	}),
	f({
		id: "f-harmonic",
		name: "Average speed (equal distance)",
		formula: "2ab / (a + b)",
		meaning: "Harmonic mean of two speeds over the same distance.",
		variables: [{
			symbol: "a",
			name: "Speed out"
		}, {
			symbol: "b",
			name: "Speed back"
		}],
		example: "60 and 40 → 48, not 50.",
		whenToUse: "Out-and-back TSD.",
		commonMistake: "Using (a+b)/2.",
		examIds: ["exam-cat", "exam-gre"],
		category: "Mathematics",
		relatedConceptIds: ["c-tsd"]
	}),
	f({
		id: "f-perm",
		name: "Permutations",
		formula: "P(n, r) = n! / (n − r)!",
		meaning: "Ordered selections of r from n.",
		variables: [],
		example: "P(5,2) = 20.",
		whenToUse: "Arrangements, ranking, passwords without repetition.",
		commonMistake: "Using combinations when order matters.",
		examIds: ["exam-cat", "exam-gre"],
		category: "Mathematics",
		relatedConceptIds: ["c-probability"]
	}),
	f({
		id: "f-comb",
		name: "Combinations",
		formula: "C(n, r) = n! / (r! (n − r)!)",
		meaning: "Unordered selections of r from n.",
		variables: [],
		example: "C(5,2) = 10.",
		whenToUse: "Committees, cards, probability numerators.",
		commonMistake: "Forgetting to divide by r!.",
		examIds: ["exam-cat", "exam-gre"],
		category: "Mathematics",
		relatedConceptIds: ["c-probability"]
	}),
	f({
		id: "f-prob",
		name: "Classical probability",
		formula: "P(A) = |A| / |S|",
		meaning: "Equally likely outcomes.",
		variables: [],
		example: "Ace from 52 = 4/52 = 1/13.",
		whenToUse: "Fair coins, dice, cards, CAT/GRE counting.",
		commonMistake: "Unequal outcomes treated as equally likely.",
		examIds: [
			"exam-cat",
			"exam-gre",
			"exam-cfa"
		],
		category: "Statistics",
		relatedConceptIds: ["c-probability"]
	}),
	f({
		id: "f-ev",
		name: "Expected value",
		formula: "E[X] = Σ xi Pi",
		meaning: "Probability-weighted average of outcomes.",
		variables: [],
		example: "50% of 10 and 50% of −4 → 3.",
		whenToUse: "Decision trees, CFA quant, gambling-style CAT items.",
		commonMistake: "Averaging outcomes without weights.",
		examIds: [
			"exam-cfa",
			"exam-cat",
			"exam-gre"
		],
		category: "Statistics",
		relatedConceptIds: ["c-probability", "c-stats"]
	}),
	f({
		id: "f-z",
		name: "z-score",
		formula: "z = (x − μ) / σ",
		meaning: "How many standard deviations x sits from the mean.",
		variables: [{
			symbol: "μ",
			name: "Mean"
		}, {
			symbol: "σ",
			name: "Standard deviation"
		}],
		example: "x=130, μ=100, σ=15 → z=2.",
		whenToUse: "Normal models, GRE/CFA standardized scores.",
		commonMistake: "Using variance in the denominator instead of σ.",
		examIds: ["exam-gre", "exam-cfa"],
		category: "Statistics",
		relatedConceptIds: ["c-stats"]
	}),
	f({
		id: "f-pyth",
		name: "Pythagoras",
		formula: "a² + b² = c²",
		meaning: "Right-triangle side relation.",
		variables: [{
			symbol: "c",
			name: "Hypotenuse"
		}],
		example: "3-4-5 triangle.",
		whenToUse: "GRE geometry, CAT mensuration.",
		commonMistake: "Applying it to non-right triangles.",
		examIds: ["exam-gre", "exam-cat"],
		category: "Mathematics",
		relatedConceptIds: ["c-geometry"]
	}),
	f({
		id: "f-circle",
		name: "Circle area",
		formula: "A = π r²",
		meaning: "Area of a disk.",
		variables: [{
			symbol: "r",
			name: "Radius"
		}],
		example: "r=4 → 16π.",
		whenToUse: "GRE geometry.",
		commonMistake: "Using diameter in place of radius, or 2πr for area.",
		examIds: ["exam-gre", "exam-cat"],
		category: "Mathematics",
		relatedConceptIds: ["c-geometry"]
	}),
	f({
		id: "f-putcall",
		name: "Put-call parity",
		formula: "c + K e^{−rT} = p + S₀   (European, no dividends)",
		meaning: "No-arbitrage link between European calls and puts.",
		variables: [
			{
				symbol: "c",
				name: "Call price"
			},
			{
				symbol: "p",
				name: "Put price"
			},
			{
				symbol: "K",
				name: "Strike"
			},
			{
				symbol: "S₀",
				name: "Spot"
			}
		],
		example: "Rearrange to create synthetic positions.",
		whenToUse: "CFA derivatives. Adjust S for discrete dividends.",
		commonMistake: "Applying European parity to American options.",
		examIds: ["exam-cfa"],
		category: "Finance",
		relatedConceptIds: ["c-duration"]
	}),
	f({
		id: "f-gm",
		name: "Gross margin",
		formula: "Gross margin = (Revenue − COGS) / Revenue",
		meaning: "Production profitability before operating expenses.",
		variables: [],
		example: "Rev 200, COGS 120 → 40%.",
		whenToUse: "FRA common-size analysis, inventory method effects.",
		commonMistake: "Using EBIT in the numerator.",
		examIds: ["exam-cfa"],
		category: "Finance",
		relatedConceptIds: ["c-inventory", "c-ratios"]
	}),
	f({
		id: "f-turn",
		name: "Inventory turnover",
		formula: "Inventory turnover = COGS / Average inventory",
		meaning: "How many times inventory is sold through in a period.",
		variables: [],
		example: "COGS 400, avg inv 80 → 5×.",
		whenToUse: "Activity ratios; days inventory = 365 / turnover.",
		commonMistake: "Using sales instead of COGS in the numerator.",
		examIds: ["exam-cfa"],
		category: "Finance",
		relatedConceptIds: ["c-inventory", "c-ratios"]
	})
];
function q(partial) {
	return {
		options: [],
		createdAt: NOW,
		...partial
	};
}
var FORM = (id, text) => ({
	id,
	text
});
var QUESTIONS = [
	q({
		id: "q-cfa-01",
		type: "mcq",
		stem: "Working capital is best defined as:",
		options: [
			FORM("a", "Current assets minus current liabilities"),
			FORM("b", "Total assets minus total liabilities"),
			FORM("c", "Cash plus inventory"),
			FORM("d", "Equity minus long-term debt")
		],
		correctAnswer: "a",
		explanation: "Working capital is the short-term liquidity buffer: current assets minus current liabilities. Total assets minus liabilities is equity, not working capital.",
		examId: "exam-cfa",
		subjectId: "sub-cfa-fra",
		topicId: "t-cfa-wc",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["working capital", "liquidity"]
	}),
	q({
		id: "q-cfa-02",
		type: "mcq",
		stem: "A firm has current assets of 90 and current liabilities of 60. Its current ratio is:",
		options: [
			FORM("a", "0.67"),
			FORM("b", "1.50"),
			FORM("c", "30"),
			FORM("d", "150")
		],
		correctAnswer: "b",
		explanation: "Current ratio = 90/60 = 1.50. 30 is working capital, not the ratio.",
		examId: "exam-cfa",
		subjectId: "sub-cfa-fra",
		topicId: "t-cfa-ratios",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["current ratio"]
	}),
	q({
		id: "q-cfa-03",
		type: "mcq",
		stem: "In a period of rising input prices, which inventory method typically reports the lowest COGS?",
		options: [
			FORM("a", "LIFO"),
			FORM("b", "FIFO"),
			FORM("c", "Weighted average"),
			FORM("d", "Specific identification of the newest units")
		],
		correctAnswer: "b",
		explanation: "FIFO expenses the oldest (cheaper) units first when prices are rising, so COGS is lower and ending inventory is higher than under LIFO.",
		examId: "exam-cfa",
		subjectId: "sub-cfa-fra",
		topicId: "t-cfa-inventory",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "medium",
		source: "starter",
		tags: [
			"FIFO",
			"LIFO",
			"inventory"
		]
	}),
	q({
		id: "q-cfa-04",
		type: "mcq",
		stem: "Macaulay duration is best described as:",
		options: [
			FORM("a", "The bond’s remaining legal maturity"),
			FORM("b", "The present-value-weighted average time to receipt of cash flows"),
			FORM("c", "The percentage price change for a 1% yield increase, with sign"),
			FORM("d", "Convexity of the price-yield curve")
		],
		correctAnswer: "b",
		explanation: "Macaulay duration is the PV-weighted average time until cash flows arrive. Modified duration, not Macaulay, scales that into an approximate percentage price change.",
		examId: "exam-cfa",
		subjectId: "sub-cfa-fi",
		topicId: "t-cfa-duration",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "medium",
		source: "starter",
		tags: ["duration"]
	}),
	q({
		id: "q-cfa-05",
		type: "mcq",
		stem: "Three-step DuPont ROE equals:",
		options: [
			FORM("a", "Gross margin × Inventory turnover × Current ratio"),
			FORM("b", "Net profit margin × Asset turnover × Equity multiplier"),
			FORM("c", "EBIT margin × Interest coverage × Tax retention"),
			FORM("d", "ROA × (1 − Debt ratio)")
		],
		correctAnswer: "b",
		explanation: "ROE = NPM × (Sales/Assets) × (Assets/Equity). That isolates profitability, efficiency, and leverage.",
		examId: "exam-cfa",
		subjectId: "sub-cfa-fra",
		topicId: "t-cfa-dupont",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["DuPont", "ROE"]
	}),
	q({
		id: "q-cfa-06",
		type: "tf",
		stem: "If a conventional project’s NPV is positive, its IRR exceeds the discount rate used in that NPV.",
		options: [FORM("true", "True"), FORM("false", "False")],
		correctAnswer: "true",
		explanation: "For a conventional cash-flow pattern, NPV > 0 if and only if IRR > r. Multiple IRRs can break this for non-conventional signs.",
		examId: "exam-cfa",
		subjectId: "sub-cfa-corp",
		topicId: "t-cfa-wacc",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "medium",
		source: "starter",
		tags: ["NPV", "IRR"]
	}),
	q({
		id: "q-cfa-07",
		type: "mcq",
		stem: "WACC is an appropriate discount rate when:",
		options: [
			FORM("a", "The project’s risk matches the firm’s average risk and capital structure is stable"),
			FORM("b", "Any project the firm might consider"),
			FORM("c", "Only projects financed entirely with retained earnings"),
			FORM("d", "Only the firm’s existing assets, never new projects")
		],
		correctAnswer: "a",
		explanation: "WACC reflects the firm’s existing business risk and financing mix. Higher-risk projects need a higher hurdle.",
		examId: "exam-cfa",
		subjectId: "sub-cfa-corp",
		topicId: "t-cfa-wacc",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "medium",
		source: "starter",
		tags: ["WACC"]
	}),
	q({
		id: "q-cfa-08",
		type: "mcq",
		stem: "The quick ratio excludes which current asset because it is often the least liquid?",
		options: [
			FORM("a", "Cash"),
			FORM("b", "Receivables"),
			FORM("c", "Inventory"),
			FORM("d", "Marketable securities")
		],
		correctAnswer: "c",
		explanation: "Inventory (and typically prepaids) is stripped out of the acid-test / quick ratio.",
		examId: "exam-cfa",
		subjectId: "sub-cfa-fra",
		topicId: "t-cfa-ratios",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["quick ratio", "inventory"]
	}),
	q({
		id: "q-cfa-09",
		type: "mcq",
		stem: "If a bond’s yield to maturity rises and nothing else changes, the bond’s price:",
		options: [
			FORM("a", "Rises"),
			FORM("b", "Falls"),
			FORM("c", "Is unchanged"),
			FORM("d", "Moves only if duration is less than 1")
		],
		correctAnswer: "b",
		explanation: "Price and yield move inversely. Duration measures the sensitivity, not the direction.",
		examId: "exam-cfa",
		subjectId: "sub-cfa-fi",
		topicId: "t-cfa-duration",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["bonds", "yield"]
	}),
	q({
		id: "q-cfa-10",
		type: "numerical",
		stem: "A cash flow of 1,210 arrives in 2 years. At 10% compounded annually, its present value is:",
		options: [],
		correctAnswer: "1000",
		explanation: "PV = 1210 / 1.10² = 1210 / 1.21 = 1,000.",
		examId: "exam-cfa",
		subjectId: "sub-cfa-quant",
		topicId: "t-cfa-tvm",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["TVM", "PV"]
	}),
	q({
		id: "q-cfa-11",
		type: "mcq",
		stem: "Under the indirect method, operating cash flow starts from:",
		options: [
			FORM("a", "Revenue"),
			FORM("b", "Net income"),
			FORM("c", "EBITDA"),
			FORM("d", "Cash at bank")
		],
		correctAnswer: "b",
		explanation: "Indirect CFO reconciles net income to cash by undoing non-cash items and working-capital changes.",
		examId: "exam-cfa",
		subjectId: "sub-cfa-fra",
		topicId: "t-cfa-wc",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["cash flow"]
	}),
	q({
		id: "q-cfa-12",
		type: "mcq",
		stem: "Modified duration is Macaulay duration divided by:",
		options: [
			FORM("a", "Yield to maturity"),
			FORM("b", "1 + periodic yield"),
			FORM("c", "Convexity"),
			FORM("d", "Coupon rate")
		],
		correctAnswer: "b",
		explanation: "ModD = MacD / (1 + y/k). That converts time into an approximate percentage price sensitivity.",
		examId: "exam-cfa",
		subjectId: "sub-cfa-fi",
		topicId: "t-cfa-duration",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "medium",
		source: "starter",
		tags: ["modified duration"]
	}),
	q({
		id: "q-cat-01",
		type: "numerical",
		stem: "What is 20% of 250?",
		options: [],
		correctAnswer: "50",
		explanation: "0.20 × 250 = 50.",
		examId: "exam-cat",
		subjectId: "sub-cat-quant",
		topicId: "t-cat-pct",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["percentages"]
	}),
	q({
		id: "q-cat-02",
		type: "mcq",
		stem: "A number is increased by 25% and then decreased by 20%. The net change is:",
		options: [
			FORM("a", "+5%"),
			FORM("b", "0%"),
			FORM("c", "−5%"),
			FORM("d", "+10%")
		],
		correctAnswer: "b",
		explanation: "1.25 × 0.80 = 1.00. Successive percentages multiply; they do not add.",
		examId: "exam-cat",
		subjectId: "sub-cat-quant",
		topicId: "t-cat-pct",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["percentages", "successive"]
	}),
	q({
		id: "q-cat-03",
		type: "numerical",
		stem: "A journey is 60 km/h for 2 hours and then 40 km/h for 2 hours. Average speed in km/h?",
		options: [],
		correctAnswer: "50",
		explanation: "Equal times: arithmetic mean. Distance 120+80=200 km in 4 h → 50 km/h.",
		examId: "exam-cat",
		subjectId: "sub-cat-quant",
		topicId: "t-cat-tsd",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["average speed"]
	}),
	q({
		id: "q-cat-04",
		type: "mcq",
		stem: "Out and back the same road at 60 km/h and 40 km/h. Average speed is:",
		options: [
			FORM("a", "50 km/h"),
			FORM("b", "48 km/h"),
			FORM("c", "52 km/h"),
			FORM("d", "45 km/h")
		],
		correctAnswer: "b",
		explanation: "Equal distances: harmonic mean 2ab/(a+b) = 2·60·40/100 = 48.",
		examId: "exam-cat",
		subjectId: "sub-cat-quant",
		topicId: "t-cat-tsd",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "medium",
		source: "starter",
		tags: ["harmonic mean"]
	}),
	q({
		id: "q-cat-05",
		type: "mcq",
		stem: "A fair coin is tossed three times. Probability of exactly two heads:",
		options: [
			FORM("a", "1/8"),
			FORM("b", "1/4"),
			FORM("c", "3/8"),
			FORM("d", "1/2")
		],
		correctAnswer: "c",
		explanation: "C(3,2)/8 = 3/8.",
		examId: "exam-cat",
		subjectId: "sub-cat-quant",
		topicId: "t-cat-prob",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["probability"]
	}),
	q({
		id: "q-cat-06",
		type: "numerical",
		stem: "If 3x + 2 = 17, x equals:",
		options: [],
		correctAnswer: "5",
		explanation: "3x = 15 → x = 5.",
		examId: "exam-cat",
		subjectId: "sub-cat-quant",
		topicId: "t-cat-pct",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["algebra"]
	}),
	q({
		id: "q-cat-07",
		type: "numerical",
		stem: "Two numbers are in the ratio 3:5 and sum to 72. The larger number is:",
		options: [],
		correctAnswer: "45",
		explanation: "3k+5k=72 → 8k=72 → k=9 → 5k=45.",
		examId: "exam-cat",
		subjectId: "sub-cat-quant",
		topicId: "t-cat-ratio",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["ratio"]
	}),
	q({
		id: "q-cat-08",
		type: "numerical",
		stem: "Simple interest on 5,000 at 8% per year for 2 years is:",
		options: [],
		correctAnswer: "800",
		explanation: "SI = P r t = 5000 × 0.08 × 2 = 800.",
		examId: "exam-cat",
		subjectId: "sub-cat-quant",
		topicId: "t-cat-pl",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["simple interest"]
	}),
	q({
		id: "q-cat-09",
		type: "numerical",
		stem: "A 180 m train travels at 54 km/h. Time in seconds to pass a pole:",
		options: [],
		correctAnswer: "12",
		explanation: "54 km/h = 15 m/s. t = 180/15 = 12 s.",
		examId: "exam-cat",
		subjectId: "sub-cat-quant",
		topicId: "t-cat-tsd",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "medium",
		source: "starter",
		tags: ["trains"]
	}),
	q({
		id: "q-cat-10",
		type: "numerical",
		stem: "A finishes a job in 10 days, B in 15. Days they take working together:",
		options: [],
		correctAnswer: "6",
		explanation: "Rates 1/10 + 1/15 = 1/6 → 6 days.",
		examId: "exam-cat",
		subjectId: "sub-cat-quant",
		topicId: "t-cat-work",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["time and work"]
	}),
	q({
		id: "q-cat-11",
		type: "mcq",
		stem: "Sequence: 2, 6, 12, 20, 30, … Next term:",
		options: [
			FORM("a", "36"),
			FORM("b", "40"),
			FORM("c", "42"),
			FORM("d", "44")
		],
		correctAnswer: "c",
		explanation: "n(n+1): 1·2, 2·3, 3·4, 4·5, 5·6, 6·7=42.",
		examId: "exam-cat",
		subjectId: "sub-cat-dilr",
		topicId: "t-cat-dilr",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["series"]
	}),
	q({
		id: "q-cat-12",
		type: "mcq",
		stem: "An article costs 240 and is sold at a 15% profit. Selling price:",
		options: [
			FORM("a", "255"),
			FORM("b", "264"),
			FORM("c", "276"),
			FORM("d", "288")
		],
		correctAnswer: "c",
		explanation: "SP = 240 × 1.15 = 276.",
		examId: "exam-cat",
		subjectId: "sub-cat-quant",
		topicId: "t-cat-pl",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["profit and loss"]
	}),
	q({
		id: "q-gre-01",
		type: "mcq",
		stem: "“Laconic” most nearly means:",
		options: [
			FORM("a", "Wordy"),
			FORM("b", "Using few words"),
			FORM("c", "Cheerful"),
			FORM("d", "Secretive")
		],
		correctAnswer: "b",
		explanation: "Laconic: terse, economical with words. Not necessarily secretive.",
		examId: "exam-gre",
		subjectId: "sub-gre-verbal",
		topicId: "t-gre-vocab",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["vocabulary"]
	}),
	q({
		id: "q-gre-02",
		type: "mcq",
		stem: "The report was deliberately equivocal. “Equivocal” means:",
		options: [
			FORM("a", "Equal in all respects"),
			FORM("b", "Open to more than one interpretation"),
			FORM("c", "Morally praiseworthy"),
			FORM("d", "Mathematically exact")
		],
		correctAnswer: "b",
		explanation: "Equivocal: ambiguous, capable of more than one reading. Not a compliment about precision.",
		examId: "exam-gre",
		subjectId: "sub-gre-verbal",
		topicId: "t-gre-vocab",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "medium",
		source: "starter",
		tags: ["vocabulary"]
	}),
	q({
		id: "q-gre-03",
		type: "numerical",
		stem: "If 2x − 5 = 11, x =",
		options: [],
		correctAnswer: "8",
		explanation: "2x = 16 → x = 8.",
		examId: "exam-gre",
		subjectId: "sub-gre-quant",
		topicId: "t-gre-alg",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["algebra"]
	}),
	q({
		id: "q-gre-04",
		type: "mcq",
		stem: "Area of a circle with radius 4 is:",
		options: [
			FORM("a", "8π"),
			FORM("b", "16π"),
			FORM("c", "4π"),
			FORM("d", "32π")
		],
		correctAnswer: "b",
		explanation: "A = πr² = 16π. 8π would be circumference if it were 2πr with r=4 — a common trap.",
		examId: "exam-gre",
		subjectId: "sub-gre-quant",
		topicId: "t-gre-geo",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["geometry", "circle"]
	}),
	q({
		id: "q-gre-05",
		type: "mcq",
		stem: "15 is what percent of 60?",
		options: [
			FORM("a", "15%"),
			FORM("b", "25%"),
			FORM("c", "40%"),
			FORM("d", "4%")
		],
		correctAnswer: "b",
		explanation: "15/60 = 0.25 = 25%.",
		examId: "exam-gre",
		subjectId: "sub-gre-quant",
		topicId: "t-gre-alg",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["percentages"]
	}),
	q({
		id: "q-gre-06",
		type: "mcq",
		stem: "A right triangle has legs 6 and 8. Hypotenuse:",
		options: [
			FORM("a", "10"),
			FORM("b", "14"),
			FORM("c", "7"),
			FORM("d", "48")
		],
		correctAnswer: "a",
		explanation: "6-8-10 is a scaled 3-4-5 triangle.",
		examId: "exam-gre",
		subjectId: "sub-gre-quant",
		topicId: "t-gre-geo",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["pythagoras"]
	}),
	q({
		id: "q-gre-07",
		type: "mcq",
		stem: "Quantity A: the mean of 2, 4, 6, 8, 10. Quantity B: the median of the same list. Comparison:",
		options: [
			FORM("a", "A is greater"),
			FORM("b", "B is greater"),
			FORM("c", "The two quantities are equal"),
			FORM("d", "Cannot be determined")
		],
		correctAnswer: "c",
		explanation: "Symmetric arithmetic sequence: mean = median = 6.",
		examId: "exam-gre",
		subjectId: "sub-gre-quant",
		topicId: "t-gre-qc",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["QC", "statistics"]
	}),
	q({
		id: "q-gre-08",
		type: "mcq",
		stem: "“Paucity” is closest in meaning to:",
		options: [
			FORM("a", "Abundance"),
			FORM("b", "Scarcity"),
			FORM("c", "Clarity"),
			FORM("d", "Speed")
		],
		correctAnswer: "b",
		explanation: "Paucity = fewness, scarcity. Abundance is an antonym.",
		examId: "exam-gre",
		subjectId: "sub-gre-verbal",
		topicId: "t-gre-vocab",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "medium",
		source: "starter",
		tags: ["vocabulary"]
	}),
	q({
		id: "q-gre-09",
		type: "mcq",
		stem: "If z = (x − μ)/σ, a z-score of 2 means x is:",
		options: [
			FORM("a", "Twice the mean"),
			FORM("b", "Two standard deviations above the mean"),
			FORM("c", "Two percent above the mean"),
			FORM("d", "The 2nd percentile")
		],
		correctAnswer: "b",
		explanation: "That is the definition of a standardized score. It is not a percentile by itself.",
		examId: "exam-gre",
		subjectId: "sub-gre-quant",
		topicId: "t-gre-stats",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["z-score"]
	}),
	q({
		id: "q-gre-10",
		type: "numerical",
		stem: "Probability of drawing an ace from a well-shuffled 52-card deck (as a simplified fraction, e.g. 1/13):",
		options: [],
		correctAnswer: "1/13",
		explanation: "4 aces / 52 cards = 1/13.",
		examId: "exam-gre",
		subjectId: "sub-gre-quant",
		topicId: "t-gre-stats",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["probability"]
	}),
	q({
		id: "q-gre-11",
		type: "mcq",
		stem: "A square has perimeter 20. Its area is:",
		options: [
			FORM("a", "16"),
			FORM("b", "20"),
			FORM("c", "25"),
			FORM("d", "100")
		],
		correctAnswer: "c",
		explanation: "Side 5, area 25. Trap: treating perimeter as area.",
		examId: "exam-gre",
		subjectId: "sub-gre-quant",
		topicId: "t-gre-geo",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "easy",
		source: "starter",
		tags: ["geometry"]
	}),
	q({
		id: "q-gre-12",
		type: "mcq",
		stem: "Which sentence uses “mitigate” correctly?",
		options: [
			FORM("a", "The new dam will mitigate flooding in the valley."),
			FORM("b", "She mitigated the hill in under an hour."),
			FORM("c", "They mitigated the contract by signing it."),
			FORM("d", "He mitigated to another country.")
		],
		correctAnswer: "a",
		explanation: "Mitigate = make less severe. Not climb, sign, or emigrate.",
		examId: "exam-gre",
		subjectId: "sub-gre-verbal",
		topicId: "t-gre-vocab",
		bookId: null,
		chapterId: null,
		page: null,
		difficulty: "medium",
		source: "starter",
		tags: ["vocabulary"]
	})
];
var CONCEPTS = [
	{
		id: "c-percentage",
		name: "Percentage",
		aliases: [
			"percent",
			"CAGR",
			"% change"
		],
		examIds: [
			"exam-cat",
			"exam-gre",
			"exam-cfa"
		],
		topicIds: ["t-cat-pct", "t-cfa-ratios"],
		summary: "Relative change versus a base. Chains multiply, they do not add.",
		createdAt: NOW
	},
	{
		id: "c-probability",
		name: "Probability",
		aliases: ["chance", "combinatorics"],
		examIds: [
			"exam-cat",
			"exam-gre",
			"exam-cfa"
		],
		topicIds: ["t-cat-prob", "t-gre-stats"],
		summary: "Measure of likelihood. Counting, conditionals, and expectation sit on top of it.",
		createdAt: NOW
	},
	{
		id: "c-inventory",
		name: "Inventory",
		aliases: [
			"FIFO",
			"LIFO",
			"stock"
		],
		examIds: ["exam-cfa"],
		topicIds: ["t-cfa-inventory"],
		summary: "Flow assumptions change COGS, margins, and activity ratios when prices move.",
		createdAt: NOW
	},
	{
		id: "c-ratios",
		name: "Financial ratios",
		aliases: [
			"current ratio",
			"ROE",
			"turnover"
		],
		examIds: ["exam-cfa"],
		topicIds: ["t-cfa-ratios", "t-cfa-dupont"],
		summary: "Compressed statements. Always ask which accounts enter the formula.",
		createdAt: NOW
	},
	{
		id: "c-tvm",
		name: "Time value of money",
		aliases: [
			"PV",
			"FV",
			"discounting"
		],
		examIds: [
			"exam-cfa",
			"exam-cat",
			"exam-gre"
		],
		topicIds: ["t-cfa-tvm"],
		summary: "A unit of currency today is not the same claim as one received later.",
		createdAt: NOW
	},
	{
		id: "c-duration",
		name: "Duration",
		aliases: ["Macaulay", "modified duration"],
		examIds: ["exam-cfa"],
		topicIds: ["t-cfa-duration"],
		summary: "Interest-rate sensitivity of a bond’s price, rooted in timing of cash flows.",
		createdAt: NOW
	},
	{
		id: "c-working-capital",
		name: "Working capital",
		aliases: ["WC", "liquidity"],
		examIds: ["exam-cfa"],
		topicIds: ["t-cfa-wc"],
		summary: "CA − CL. Connects operations to short-term solvency.",
		createdAt: NOW
	},
	{
		id: "c-dupont",
		name: "DuPont analysis",
		aliases: ["ROE decomposition"],
		examIds: ["exam-cfa"],
		topicIds: ["t-cfa-dupont"],
		summary: "Splits ROE into margin, turnover, and leverage.",
		createdAt: NOW
	},
	{
		id: "c-wacc",
		name: "Cost of capital",
		aliases: ["WACC", "CAPM"],
		examIds: ["exam-cfa"],
		topicIds: ["t-cfa-wacc"],
		summary: "Hurdle rate that matches financing mix and systematic risk.",
		createdAt: NOW
	},
	{
		id: "c-tsd",
		name: "Time-speed-distance",
		aliases: ["average speed", "trains"],
		examIds: ["exam-cat", "exam-gre"],
		topicIds: ["t-cat-tsd"],
		summary: "Distance = speed × time. Equal distance uses the harmonic mean of speeds.",
		createdAt: NOW
	},
	{
		id: "c-geometry",
		name: "Geometry",
		aliases: [
			"triangle",
			"circle",
			"area"
		],
		examIds: ["exam-gre", "exam-cat"],
		topicIds: ["t-gre-geo"],
		summary: "Pythagoras, area, and similar triangles cover most GRE items.",
		createdAt: NOW
	},
	{
		id: "c-stats",
		name: "Statistics",
		aliases: [
			"mean",
			"median",
			"z-score"
		],
		examIds: [
			"exam-gre",
			"exam-cfa",
			"exam-cat"
		],
		topicIds: ["t-gre-stats", "t-gre-qc"],
		summary: "Center, spread, and standardized position. Do not confuse mean with median.",
		createdAt: NOW
	},
	{
		id: "c-vocab",
		name: "Vocabulary in context",
		aliases: ["GRE verbal", "tone"],
		examIds: ["exam-gre"],
		topicIds: ["t-gre-vocab"],
		summary: "Meaning is constrained by the sentence, not the first synonym you remember.",
		createdAt: NOW
	}
];
var LINKS = [
	{
		id: "l1",
		fromId: "c-percentage",
		toId: "c-ratios",
		relation: "applies_to"
	},
	{
		id: "l2",
		fromId: "c-percentage",
		toId: "c-tvm",
		relation: "related"
	},
	{
		id: "l3",
		fromId: "c-probability",
		toId: "c-stats",
		relation: "related"
	},
	{
		id: "l4",
		fromId: "c-inventory",
		toId: "c-ratios",
		relation: "applies_to"
	},
	{
		id: "l5",
		fromId: "c-inventory",
		toId: "c-working-capital",
		relation: "related"
	},
	{
		id: "l6",
		fromId: "c-working-capital",
		toId: "c-ratios",
		relation: "related"
	},
	{
		id: "l7",
		fromId: "c-dupont",
		toId: "c-ratios",
		relation: "applies_to"
	},
	{
		id: "l8",
		fromId: "c-duration",
		toId: "c-tvm",
		relation: "prerequisite"
	},
	{
		id: "l9",
		fromId: "c-wacc",
		toId: "c-tvm",
		relation: "related"
	},
	{
		id: "l10",
		fromId: "c-tsd",
		toId: "c-percentage",
		relation: "related"
	},
	{
		id: "l11",
		fromId: "c-geometry",
		toId: "c-stats",
		relation: "related"
	},
	{
		id: "l12",
		fromId: "c-probability",
		toId: "c-wacc",
		relation: "related"
	}
];
async function ensureSeeded(db) {
	const settings = await getSettings();
	if (settings.seedVersion >= 1) return;
	const putIfMissing = async (table, rows) => {
		for (const row of rows) if (!await table.get(row.id)) await table.put(row);
	};
	await putIfMissing(db.exams, EXAMS);
	await putIfMissing(db.subjects, SUBJECTS);
	await putIfMissing(db.topics, TOPICS);
	await putIfMissing(db.formulas, FORMULAS);
	await putIfMissing(db.concepts, CONCEPTS);
	await putIfMissing(db.conceptLinks, LINKS);
	if (settings.includeStarterContent) await putIfMissing(db.questions, QUESTIONS);
	await patchSettings({ seedVersion: 1 });
}
async function removeStarterQuestions(db) {
	await db.questions.where("source").equals("starter").delete();
	await patchSettings({ includeStarterContent: false });
}
function StudyBoot({ children }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				const db = getDb();
				if (db) await ensureSeeded(db);
				if (!cancelled) setReady(true);
			} catch (e) {
				if (!cancelled) setError(e instanceof Error ? e.message : "Could not open local storage.");
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		const root = document.documentElement;
		const apply = (theme) => {
			const dark = theme === "dark" || theme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches;
			root.classList.toggle("dark", dark);
		};
		apply(localStorage.getItem("study-os-theme") ?? "system");
	}, [ready]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-bg px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl text-fg",
			children: "Storage unavailable"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-sm text-sm text-muted",
			children: error
		})] })
	});
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center bg-bg px-6 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-3xl font-medium tracking-tight text-fg",
			children: "Study OS"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Opening your local library…"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeSync, {}), children] });
}
function ThemeSync() {
	const settings = useSettingsLive();
	(0, import_react.useEffect)(() => {
		const theme = settings?.theme ?? "system";
		localStorage.setItem("study-os-theme", theme);
		const apply = () => {
			const dark = theme === "dark" || theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches;
			document.documentElement.classList.toggle("dark", dark);
		};
		apply();
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, [settings?.theme]);
	return null;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[opacity,transform,background-color,box-shadow] duration-150 ease-out disabled:pointer-events-none disabled:opacity-45 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-ink text-paper hover:opacity-90",
			secondary: "bg-surface-2 text-fg hover:opacity-90",
			outline: "bg-surface text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-fg hover:bg-surface-2",
			danger: "bg-bad text-paper hover:opacity-90"
		},
		size: {
			sm: "h-9 rounded-md px-3 text-sm",
			md: "h-11 rounded-lg px-4 text-sm",
			lg: "h-12 rounded-xl px-5 text-base",
			icon: "size-11 rounded-lg",
			"icon-sm": "size-9 rounded-md"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
var Button = (0, import_react.forwardRef)(({ className, variant, size, type = "button", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
	ref,
	type,
	className: cn(buttonVariants({
		variant,
		size
	}), className),
	...props
}));
Button.displayName = "Button";
var Input = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	ref,
	className: cn("h-11 w-full rounded-lg bg-surface-2 px-3 text-sm text-fg placeholder:text-subtle", "shadow-[var(--shadow-border)] outline-none focus:shadow-[var(--shadow-border-hover)]", className),
	...props
}));
Input.displayName = "Input";
var Textarea = (0, import_react.forwardRef)(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	ref,
	className: cn("min-h-28 w-full rounded-lg bg-surface-2 px-3 py-2.5 text-sm text-fg placeholder:text-subtle", "shadow-[var(--shadow-border)] outline-none focus:shadow-[var(--shadow-border-hover)]", className),
	...props
}));
Textarea.displayName = "Textarea";
function NativeSelect({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("h-11 w-full rounded-lg bg-surface-2 px-3 text-sm text-fg", "shadow-[var(--shadow-border)] outline-none focus:shadow-[var(--shadow-border-hover)]", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("mb-1.5 block text-sm font-medium text-fg", className),
		...props
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children] });
}
function Onboarding() {
	const settings = useSettingsLive();
	const exams = useAllExams();
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(0);
	const [other, setOther] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	if (settings?.onboardingComplete) return null;
	if (!settings) return null;
	const toggle = async (id, on) => {
		await updateExam(id, { active: on });
	};
	const finish = async () => {
		if (other.trim()) await createExam({
			name: other.trim(),
			priority: 3
		});
		if (name.trim()) await patchSettings({
			displayName: name.trim(),
			onboardingComplete: true
		});
		else await patchSettings({ onboardingComplete: true });
		navigate({ to: "/library" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 overflow-y-auto bg-bg px-5 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md",
			children: [
				step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium tracking-[0.16em] text-subtle uppercase",
						children: "Welcome"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-display text-4xl font-medium tracking-tight text-fg",
						children: "Personal Self-Study OS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-base text-muted",
						children: "Study smarter. Remember longer. Perform better."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "A local learning system for converting books into practice, revision, mocks, and exam readiness. Nothing here requires an account. Your data stays on this device."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-8 w-full",
						size: "lg",
						onClick: () => setStep(1),
						children: "Continue"
					})
				] }),
				step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium tracking-[0.16em] text-subtle uppercase",
						children: "Exams"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-3xl font-medium tracking-tight",
						children: "What are you preparing for?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "You can add or remove exams later."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 space-y-2",
						children: exams.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-14 cursor-pointer items-center justify-between rounded-2xl bg-surface px-4 shadow-[var(--shadow-border)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: e.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "size-5 accent-ink",
								checked: e.active,
								onChange: (ev) => toggle(e.id, ev.target.checked)
							})]
						}) }, e.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Other exam or course",
							value: other,
							onChange: (e) => setOther(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "flex-1",
							onClick: () => setStep(0),
							children: "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "flex-1",
							onClick: () => setStep(2),
							children: "Continue"
						})]
					})
				] }),
				step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium tracking-[0.16em] text-subtle uppercase",
						children: "You"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-3xl font-medium tracking-tight",
						children: "Optional name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Used only for the greeting. Stored locally."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-6",
						placeholder: "First name",
						value: name,
						onChange: (e) => setName(e.target.value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							onClick: finish,
							children: "Add books and start"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: async () => {
								await patchSettings({
									onboardingComplete: true,
									displayName: name.trim()
								});
								navigate({ to: "/" });
							},
							children: "Skip for now"
						})]
					})
				] })
			]
		})
	});
}
var styles_default = "/assets/styles-DKYE17th.css";
var APP_NAME = "Personal Self-Study OS";
var Route$23 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Study smarter. Remember longer. Perform better. A local-first learning OS."
			},
			{
				name: "theme-color",
				content: "#161412"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;1,400&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		className: "antialiased",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StudyBoot, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Onboarding, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					position: "top-center",
					toastOptions: { className: "font-sans" }
				})
			] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$22 = () => import("../_app-DuiZEEOR.mjs");
var Route$22 = createFileRoute("/_app")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("../_app-DxhYO-65.mjs");
var Route$21 = createFileRoute("/_app/")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./ask-BkdCdU6H.mjs");
var Route$20 = createFileRoute("/_app/ask")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./concepts-Bk7q0zRg.mjs");
var Route$19 = createFileRoute("/_app/concepts")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./formulas-D63fjeo-.mjs");
var Route$18 = createFileRoute("/_app/formulas")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./insights-L-YBdLwX.mjs");
var Route$17 = createFileRoute("/_app/insights")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./library-BBHAwX_2.mjs");
var Route$16 = createFileRoute("/_app/library")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./mistakes-DFbQhU6a.mjs");
var Route$15 = createFileRoute("/_app/mistakes")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./mocks-BU2zvz62.mjs");
var Route$14 = createFileRoute("/_app/mocks")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./notes-Dh2LPhrS.mjs");
var Route$13 = createFileRoute("/_app/notes")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./practice-C3qiWEE1.mjs");
var Route$12 = createFileRoute("/_app/practice")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./revision-CmKdEeDg.mjs");
var Route$11 = createFileRoute("/_app/revision")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./search-hMsPZKuM.mjs");
var Route$10 = createFileRoute("/_app/search")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./session-DN26vTtI.mjs");
var Route$9 = createFileRoute("/_app/session")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./settings-D1ulNYTD.mjs");
var Route$8 = createFileRoute("/_app/settings")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./mocks.run-BnGnt9IV.mjs");
var Route$7 = createFileRoute("/mocks/run")({
	validateSearch: (s) => ({ mockId: s.mockId ? String(s.mockId) : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./practice.run-DjJP0MvF.mjs");
var Route$6 = createFileRoute("/practice/run")({
	validateSearch: (s) => ({
		mode: s.mode ? String(s.mode) : void 0,
		examId: s.examId ? String(s.examId) : void 0,
		topicId: s.topicId ? String(s.topicId) : void 0,
		difficulty: s.difficulty ? String(s.difficulty) : void 0,
		timed: s.timed ? String(s.timed) : void 0,
		count: s.count ? String(s.count) : void 0,
		questionId: s.questionId ? String(s.questionId) : void 0,
		sessionId: s.sessionId ? String(s.sessionId) : void 0
	}),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./read._bookId-ASmUmrSB.mjs");
var Route$5 = createFileRoute("/read/$bookId")({
	validateSearch: (s) => ({ page: s.page != null ? Number(s.page) : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./concepts._conceptId-C3BZ4WKG.mjs");
var Route$4 = createFileRoute("/_app/concepts/$conceptId")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./library._bookId-Cx4JUkK5.mjs");
var Route$3 = createFileRoute("/_app/library/$bookId")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./notes._noteId-C0nxiECj.mjs");
var Route$2 = createFileRoute("/_app/notes/$noteId")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./questions.new-CNNPdULC.mjs");
var Route$1 = createFileRoute("/_app/questions/new")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./mocks.report._resultId-KoYWUsI0.mjs");
var Route = createFileRoute("/_app/mocks/report/$resultId")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var AppRoute = Route$22.update({
	id: "/_app",
	getParentRoute: () => Route$23
});
var AppIndexRoute = Route$21.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppAskRoute = Route$20.update({
	id: "/ask",
	path: "/ask",
	getParentRoute: () => AppRoute
});
var AppConceptsRoute = Route$19.update({
	id: "/concepts",
	path: "/concepts",
	getParentRoute: () => AppRoute
});
var AppFormulasRoute = Route$18.update({
	id: "/formulas",
	path: "/formulas",
	getParentRoute: () => AppRoute
});
var AppInsightsRoute = Route$17.update({
	id: "/insights",
	path: "/insights",
	getParentRoute: () => AppRoute
});
var AppLibraryRoute = Route$16.update({
	id: "/library",
	path: "/library",
	getParentRoute: () => AppRoute
});
var AppMistakesRoute = Route$15.update({
	id: "/mistakes",
	path: "/mistakes",
	getParentRoute: () => AppRoute
});
var AppMocksRoute = Route$14.update({
	id: "/mocks",
	path: "/mocks",
	getParentRoute: () => AppRoute
});
var AppNotesRoute = Route$13.update({
	id: "/notes",
	path: "/notes",
	getParentRoute: () => AppRoute
});
var AppPracticeRoute = Route$12.update({
	id: "/practice",
	path: "/practice",
	getParentRoute: () => AppRoute
});
var AppRevisionRoute = Route$11.update({
	id: "/revision",
	path: "/revision",
	getParentRoute: () => AppRoute
});
var AppSearchRoute = Route$10.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => AppRoute
});
var AppSessionRoute = Route$9.update({
	id: "/session",
	path: "/session",
	getParentRoute: () => AppRoute
});
var AppSettingsRoute = Route$8.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AppRoute
});
var MocksRunRoute = Route$7.update({
	id: "/mocks/run",
	path: "/mocks/run",
	getParentRoute: () => Route$23
});
var PracticeRunRoute = Route$6.update({
	id: "/practice/run",
	path: "/practice/run",
	getParentRoute: () => Route$23
});
var ReadBookIdRoute = Route$5.update({
	id: "/read/$bookId",
	path: "/read/$bookId",
	getParentRoute: () => Route$23
});
var AppConceptsConceptIdRoute = Route$4.update({
	id: "/$conceptId",
	path: "/$conceptId",
	getParentRoute: () => AppConceptsRoute
});
var AppLibraryBookIdRoute = Route$3.update({
	id: "/$bookId",
	path: "/$bookId",
	getParentRoute: () => AppLibraryRoute
});
var AppNotesNoteIdRoute = Route$2.update({
	id: "/$noteId",
	path: "/$noteId",
	getParentRoute: () => AppNotesRoute
});
var AppQuestionsNewRoute = Route$1.update({
	id: "/questions/new",
	path: "/questions/new",
	getParentRoute: () => AppRoute
});
var AppMocksReportResultIdRoute = Route.update({
	id: "/report/$resultId",
	path: "/report/$resultId",
	getParentRoute: () => AppMocksRoute
});
var AppConceptsRouteChildren = { AppConceptsConceptIdRoute };
var AppConceptsRouteWithChildren = AppConceptsRoute._addFileChildren(AppConceptsRouteChildren);
var AppLibraryRouteChildren = { AppLibraryBookIdRoute };
var AppLibraryRouteWithChildren = AppLibraryRoute._addFileChildren(AppLibraryRouteChildren);
var AppMocksRouteChildren = { AppMocksReportResultIdRoute };
var AppMocksRouteWithChildren = AppMocksRoute._addFileChildren(AppMocksRouteChildren);
var AppNotesRouteChildren = { AppNotesNoteIdRoute };
var AppRouteChildren = {
	AppAskRoute,
	AppConceptsRoute: AppConceptsRouteWithChildren,
	AppFormulasRoute,
	AppInsightsRoute,
	AppLibraryRoute: AppLibraryRouteWithChildren,
	AppMistakesRoute,
	AppMocksRoute: AppMocksRouteWithChildren,
	AppNotesRoute: AppNotesRoute._addFileChildren(AppNotesRouteChildren),
	AppPracticeRoute,
	AppRevisionRoute,
	AppSearchRoute,
	AppSessionRoute,
	AppSettingsRoute,
	AppIndexRoute,
	AppQuestionsNewRoute
};
var rootRouteChildren = {
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	MocksRunRoute,
	PracticeRunRoute,
	ReadBookIdRoute
};
var routeTree = Route$23._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { useConcepts as $, deleteBook as A, saveNote as B, analyzeMock as C, createFormula as D, createExam as E, recordAttempt as F, updateExam as G, startSession as H, reviewRevision as I, useBook as J, useAllExams as K, revisionBucket as L, endSession as M, markTopicEvent as N, createMock as O, patchSettings as P, useConceptLinks as Q, saveChapters as R, addRevision as S, classifyMistake as T, topicAnalytics as U, setTopicStatus as V, updateBook as W, useBooks as X, useBookmarks as Y, useChapters as Z, MISTAKE_LABEL as _, Route$4 as a, useMockResults as at, addBookmark as b, Route$7 as c, useQuestions as ct, NativeSelect as d, useSessions as dt, useExams as et, Textarea as f, useSettingsLive as ft, MISTAKE_CATEGORIES as g, __exportAll as h, whyLosingMarks as ht, Route$3 as i, useMistakes as it, deleteNote as j, createQuestion as k, Field as l, useReadiness as lt, removeStarterQuestions as m, useTopics as mt, Route as n, useHighlights as nt, Route$5 as o, useMocks as ot, Button as p, useSubjects as pt, useAttempts as q, Route$2 as r, useKnowledgeMap as rt, Route$6 as s, useNotes as st, router_exports as t, useFormulas as tt, Input as u, useRevisions as ut, PATTERN_COPY as v, buildPriorities as w, addHighlight as x, TOPIC_STATUS_LABEL as y, saveMockResult as z };
