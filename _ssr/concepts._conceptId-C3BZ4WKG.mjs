import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Route$4 } from "./router-Cbj4RZlk.mjs";
import { t as ConceptDetailPage } from "./concepts-page-D54vPamc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/concepts._conceptId-C3BZ4WKG.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { conceptId } = Route$4.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConceptDetailPage, { conceptId });
}
//#endregion
export { Page as component };
