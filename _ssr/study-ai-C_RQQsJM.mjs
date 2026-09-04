import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/study-ai-C_RQQsJM.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var askMyBooks = createServerFn({ method: "POST" }).inputValidator((input) => input).handler(createSsrRpc("8ad3af678f533f201a6f0faa5faf3f7a26f0998e73aa558d81e411a5417a516d"));
var generateChapterQuestions = createServerFn({ method: "POST" }).inputValidator((input) => input).handler(createSsrRpc("0a46218d2242f5024d938d98ff9287d75432cfdad7dbfbc3936f2e27545e5480"));
var explainQuestion = createServerFn({ method: "POST" }).inputValidator((input) => input).handler(createSsrRpc("d14930015653503448f7ec6e34e1f109b060d4e9682127791e9e2c08ea0c79cb"));
//#endregion
export { explainQuestion as n, generateChapterQuestions as r, askMyBooks as t };
