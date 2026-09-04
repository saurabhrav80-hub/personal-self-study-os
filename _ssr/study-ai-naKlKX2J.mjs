import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/study-ai-naKlKX2J.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
async function chat(messages, maxTokens = 900) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment."
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			messages,
			max_tokens: maxTokens,
			temperature: .3
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI API error ${res.status}`
	};
	return {
		ok: true,
		text: (await res.json()).choices?.[0]?.message?.content ?? ""
	};
}
var askMyBooks_createServerFn_handler = createServerRpc({
	id: "8ad3af678f533f201a6f0faa5faf3f7a26f0998e73aa558d81e411a5417a516d",
	name: "askMyBooks",
	filename: "src/lib/ai/study-ai.ts"
}, (opts) => askMyBooks.__executeServer(opts));
var askMyBooks = createServerFn({ method: "POST" }).inputValidator((input) => input).handler(askMyBooks_createServerFn_handler, async ({ data }) => {
	if (!data.excerpts.length) return {
		ok: false,
		error: "I couldn't find this in your uploaded material."
	};
	const packed = data.excerpts.map((e, i) => `[${i + 1}] ${e.bookName}${e.chapterTitle ? " → " + e.chapterTitle : ""} → p.${e.page}\n${e.text}`).join("\n\n");
	return chat([{
		role: "system",
		content: "You are a book-grounded study assistant. Answer ONLY from the provided excerpts. Cite sources as Book → Chapter → Page using the labels given. If the excerpts are insufficient, say exactly: I couldn't find this in your uploaded material. Never invent page numbers, quotes, or citations. Label nothing as fact beyond the excerpts."
	}, {
		role: "user",
		content: `Question: ${data.question}\n\nExcerpts:\n${packed}`
	}], 800);
});
var generateChapterQuestions_createServerFn_handler = createServerRpc({
	id: "0a46218d2242f5024d938d98ff9287d75432cfdad7dbfbc3936f2e27545e5480",
	name: "generateChapterQuestions",
	filename: "src/lib/ai/study-ai.ts"
}, (opts) => generateChapterQuestions.__executeServer(opts));
var generateChapterQuestions = createServerFn({ method: "POST" }).inputValidator((input) => input).handler(generateChapterQuestions_createServerFn_handler, async ({ data }) => {
	if (data.text.trim().length < 80) return {
		ok: false,
		error: "Not enough extracted text in this chapter to ground questions."
	};
	return chat([{
		role: "system",
		content: "Create 5 practice questions strictly grounded in the chapter text. Return JSON only: {\"questions\":[{\"type\":\"mcq\"|\"numerical\"|\"tf\",\"stem\":\"\",\"options\":[{\"id\":\"a\",\"text\":\"\"}],\"correctAnswer\":\"a\",\"explanation\":\"\",\"difficulty\":\"easy\"|\"medium\"|\"hard\"}]}. MCQ must have 4 options. Do not invent facts absent from the text. Prefix nothing else."
	}, {
		role: "user",
		content: `Book: ${data.bookName}\nChapter: ${data.chapterTitle}\nDifficulty: ${data.difficulty}\n\nText:\n${data.text.slice(0, 6e3)}`
	}], 1600);
});
var explainQuestion_createServerFn_handler = createServerRpc({
	id: "d14930015653503448f7ec6e34e1f109b060d4e9682127791e9e2c08ea0c79cb",
	name: "explainQuestion",
	filename: "src/lib/ai/study-ai.ts"
}, (opts) => explainQuestion.__executeServer(opts));
var explainQuestion = createServerFn({ method: "POST" }).inputValidator((input) => input).handler(explainQuestion_createServerFn_handler, async ({ data }) => {
	return chat([{
		role: "system",
		content: `You help a CFA/CAT/GRE self-study student. ${data.mode === "simple" ? "Explain simply, as if to a peer who missed one lecture. Short paragraphs." : data.mode === "professional" ? "Explain professionally, exam-ready language, no fluff." : data.mode === "steps" ? "Explain step by step. Number the steps." : data.mode === "trap" ? "Show the common trap that leads to a wrong option. Be specific." : "Write ONE similar original question (stem, options, answer, explanation) of the same difficulty. Do not copy the original stem."} If book excerpts are provided, prefer them and cite Book → Chapter → Page. If they are missing, use general reasoning and label it as general reasoning, not as coming from the user's books. Never invent citations.`
	}, {
		role: "user",
		content: `Question: ${data.stem}\nOptions: ${data.options}\nCorrect: ${data.correctAnswer}\nStored explanation: ${data.explanation || "(none)"}\nExcerpts:\n${data.excerpts || "(none)"}`
	}], 700);
});
//#endregion
export { askMyBooks_createServerFn_handler, explainQuestion_createServerFn_handler, generateChapterQuestions_createServerFn_handler };
