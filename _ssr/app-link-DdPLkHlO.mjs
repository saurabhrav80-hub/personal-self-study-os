import { b as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-link-DdPLkHlO.js
var import_jsx_runtime = require_jsx_runtime();
function AppLink({ href, className, children }) {
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		className,
		onClick: (e) => {
			if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
			e.preventDefault();
			router.history.push(href);
		},
		children
	});
}
//#endregion
export { AppLink as t };
