import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as createFormula, S as addRevision, d as NativeSelect, et as useExams, f as Textarea, l as Field, p as Button, tt as useFormulas, u as Input } from "./router-Cbj4RZlk.mjs";
import { t as Card } from "./card-DFaudOAO.mjs";
import { n as Screen, t as EmptyState } from "./empty-r3dgi-HO.mjs";
import { n as DialogContent, r as DialogTrigger, t as Dialog } from "./dialog-CoFLxguO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/formulas-D63fjeo-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATS = [
	"All",
	"CFA",
	"CAT",
	"GRE",
	"Finance",
	"Statistics",
	"Economics",
	"Mathematics"
];
function FormulasPage() {
	const formulas = useFormulas();
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("All");
	const shown = (0, import_react.useMemo)(() => {
		return formulas.filter((f) => {
			const hay = `${f.name} ${f.formula} ${f.meaning} ${f.category}`.toLowerCase();
			if (q && !hay.includes(q.toLowerCase())) return false;
			if (cat === "All") return true;
			if (cat === "CFA") return f.examIds.includes("exam-cfa") || f.category === "Finance";
			if (cat === "CAT") return f.examIds.includes("exam-cat");
			if (cat === "GRE") return f.examIds.includes("exam-gre");
			return f.category === cat;
		});
	}, [
		formulas,
		q,
		cat
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Screen, {
		title: "Formula vault",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddFormulaButton, {}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search formulas",
				value: q,
				onChange: (e) => setQ(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 mb-4 flex gap-1 overflow-x-auto pb-1",
				children: CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCat(c),
					className: `h-9 shrink-0 rounded-full px-3 text-sm ${cat === c ? "bg-ink text-paper" : "bg-surface shadow-[var(--shadow-border)]"}`,
					children: c
				}, c))
			}),
			shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "No formulas",
				body: "Add your own. Starter formulas can be kept or ignored."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: shown.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: f.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg",
							children: f.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-sm",
							children: f.formula
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: f.meaning
						}),
						f.whenToUse ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted",
							children: ["When: ", f.whenToUse]
						}) : null,
						f.commonMistake ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-bad",
							children: ["Trap: ", f.commonMistake]
						}) : null,
						f.example ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted",
							children: ["e.g. ", f.example]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							className: "mt-2",
							onClick: async () => {
								await addRevision({
									kind: "formula",
									refId: f.id,
									prompt: `Recall the formula for ${f.name}`,
									answer: `${f.formula}\n${f.meaning}`,
									examId: f.examIds[0] ?? null
								});
								toast.success("Added to revision.");
							},
							children: "Add to revision"
						})
					]
				}) }, f.id))
			})
		]
	});
}
function AddFormulaButton() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const exams = useExams();
	const [name, setName] = (0, import_react.useState)("");
	const [formula, setFormula] = (0, import_react.useState)("");
	const [meaning, setMeaning] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Mathematics");
	const [examId, setExamId] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				children: "Add"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			title: "New formula",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Formula",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: formula,
							onChange: (e) => setFormula(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Meaning",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: meaning,
							onChange: (e) => setMeaning(e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Category",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
							value: category,
							onChange: (e) => setCategory(e.target.value),
							children: CATS.filter((c) => c !== "All" && ![
								"CFA",
								"CAT",
								"GRE"
							].includes(c)).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Exam",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
							value: examId,
							onChange: (e) => setExamId(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "None"
							}), exams.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: e.id,
								children: e.name
							}, e.id))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						onClick: async () => {
							if (!name.trim() || !formula.trim()) return;
							await createFormula({
								name: name.trim(),
								formula: formula.trim(),
								meaning,
								variables: [],
								example: "",
								whenToUse: "",
								commonMistake: "",
								examIds: examId ? [examId] : [],
								category,
								relatedConceptIds: []
							});
							setOpen(false);
							setName("");
							setFormula("");
							setMeaning("");
						},
						children: "Save"
					})
				]
			})
		})]
	});
}
var SplitComponent = FormulasPage;
//#endregion
export { SplitComponent as component };
