import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "./@radix-ui/react-compose-refs+[...].mjs";
import { t as Dexie } from "./dexie.mjs";
//#region node_modules/dexie-react-hooks/dist/dexie-react-hooks.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function useObservable(observableFactory, arg2, arg3) {
	let deps;
	let defaultResult;
	if (typeof observableFactory === "function") {
		deps = arg2 || [];
		defaultResult = arg3;
	} else {
		deps = [];
		defaultResult = arg2;
	}
	const monitor = import_react.useRef({
		hasResult: false,
		result: defaultResult,
		error: null
	});
	const [_, triggerUpdate] = import_react.useReducer((x) => x + 1, 0);
	const observable = import_react.useMemo(() => {
		const observable = typeof observableFactory === "function" ? observableFactory() : observableFactory;
		if (!observable || typeof observable.subscribe !== "function") {
			if (observableFactory === observable) throw new TypeError(`Given argument to useObservable() was neither a valid observable nor a function.`);
			else throw new TypeError(`Observable factory given to useObservable() did not return a valid observable.`);
		}
		if (!monitor.current.hasResult && typeof window !== "undefined") {
			if (typeof observable.hasValue !== "function" || observable.hasValue()) {
				if (typeof observable.getValue === "function") {
					monitor.current.result = observable.getValue();
					monitor.current.hasResult = true;
				} else {
					const subscription = observable.subscribe((val) => {
						monitor.current.result = val;
						monitor.current.hasResult = true;
					});
					if (typeof subscription === "function") subscription();
					else subscription.unsubscribe();
				}
			}
		}
		return observable;
	}, deps);
	import_react.useDebugValue(monitor.current.result);
	import_react.useEffect(() => {
		const subscription = observable.subscribe((val) => {
			const { current } = monitor;
			if (current.error !== null || current.result !== val) {
				current.error = null;
				current.result = val;
				current.hasResult = true;
				triggerUpdate();
			}
		}, (err) => {
			const { current } = monitor;
			if (current.error !== err) {
				current.error = err;
				triggerUpdate();
			}
		});
		return typeof subscription === "function" ? subscription : subscription.unsubscribe.bind(subscription);
	}, deps);
	if (monitor.current.error) throw monitor.current.error;
	return monitor.current.result;
}
function useLiveQuery(querier, deps, defaultResult) {
	return useObservable(() => Dexie.liveQuery(querier), deps || [], defaultResult);
}
typeof FinalizationRegistry !== "undefined" && new FinalizationRegistry((doc) => {
	const DexieYProvider = Dexie["DexieYProvider"];
	if (DexieYProvider) DexieYProvider.release(doc);
});
Reflect.get(import_react, "use");
//#endregion
export { useLiveQuery as t };
