import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-DZ4IgiFc.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function nid() {
	return crypto.randomUUID();
}
function greeting(d = /* @__PURE__ */ new Date()) {
	const h = d.getHours();
	if (h < 5) return "Good evening";
	if (h < 12) return "Good morning";
	if (h < 17) return "Good afternoon";
	return "Good evening";
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function formatDuration(ms) {
	if (!Number.isFinite(ms) || ms < 0) return "—";
	const s = Math.round(ms / 1e3);
	if (s < 60) return `${s}s`;
	const m = Math.floor(s / 60);
	const r = s % 60;
	if (m < 60) return r ? `${m}m ${r}s` : `${m}m`;
	return `${Math.floor(m / 60)}h ${m % 60}m`;
}
function formatMinutes(min) {
	if (!Number.isFinite(min)) return "—";
	if (min < 60) return `${Math.round(min)} min`;
	const h = Math.floor(min / 60);
	const m = Math.round(min % 60);
	return m ? `${h}h ${m}m` : `${h}h`;
}
function relativeDay(ts, now = Date.now()) {
	ts - now;
	const day = 864e5;
	const startToday = new Date(now);
	startToday.setHours(0, 0, 0, 0);
	const startThen = new Date(ts);
	startThen.setHours(0, 0, 0, 0);
	const days = Math.round((startThen.getTime() - startToday.getTime()) / day);
	if (days === 0) return "Today";
	if (days === 1) return "Tomorrow";
	if (days === -1) return "Yesterday";
	if (days > 1 && days < 7) return `In ${days} days`;
	if (days < -1 && days > -7) return `${-days} days ago`;
	return startThen.toLocaleDateString(void 0, {
		month: "short",
		day: "numeric"
	});
}
function stripExt(name) {
	return name.replace(/\.[^.]+$/, "");
}
function downloadBlob(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function numericalMatch(user, correct) {
	const a = user.trim();
	const b = correct.trim();
	if (!a || !b) return false;
	if (a.toLowerCase() === b.toLowerCase()) return true;
	const x = Number(a.replace(/,/g, ""));
	const y = Number(b.replace(/,/g, ""));
	if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
	const tol = Math.max(1e-6, Math.abs(y) * .005);
	return Math.abs(x - y) <= tol;
}
function shuffle(arr) {
	const a = arr.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}
function average(nums) {
	if (!nums.length) return 0;
	return nums.reduce((s, n) => s + n, 0) / nums.length;
}
//#endregion
export { formatDuration as a, nid as c, shuffle as d, stripExt as f, downloadBlob as i, numericalMatch as l, clamp as n, formatMinutes as o, cn as r, greeting as s, average as t, relativeDay as u };
