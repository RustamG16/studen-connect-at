// Copy check (AC-R3): no string lost, reworded, shortened or translated against origin/main.
//   npm run qa:copy                  extracts every user-facing string literal from src/pages/** and
//                                    src/components/** on origin/main and asserts each is still present
//                                    in the working tree's src/ (strings may move between files).
//   node qa/copy.test.mjs <git-ref>  compares against another ref instead of origin/main
// Extracted: JSX text; placeholder, alt, aria-label and title attributes; string and template literals in
// props, arrays, objects, calls and returns. Skipped: imports and exports, class lists (className, cn(),
// cva()), console arguments, non-copy props (type, id, key, to, href, src, icon, ...), strings with no letters.
// Needs the dev dependency `typescript`, which the project already has.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const ref = process.argv[2] || "origin/main";
const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 1 << 26 });
const norm = (s) => s.replace(/\\n/g, " ").replace(/\s+/g, " ").trim();

try {
  git("rev-parse", "--verify", "--quiet", ref);
} catch {
  console.error(`Copy check: ref ${ref} not found. Fetch it first (git fetch origin main).`);
  process.exit(1);
}

const isSource = (f) => /\.(tsx?|jsx?)$/.test(f);
const oldFiles = git("ls-tree", "-r", "--name-only", ref, "src/pages", "src/components").split("\n").filter((f) => f && isSource(f));
const treeFiles = git("ls-files", "src").split("\n").filter((f) => f && /\.(tsx?|jsx?|css)$/.test(f));
const raw = treeFiles.map((f) => readFileSync(f, "utf8")).join("\n");
// Headings are split into words and ruled spans (<em>Bonuses</em>), so a sentence is also looked for with the
// JSX tags and `{" "}` separators removed, which is what the browser renders.
const tree = norm(raw);
const flat = norm(raw.replace(/\{\s*" "\s*\}/g, " ").replace(/<\/?[A-Za-z][^<>]*>/g, ""));

const COPY_ATTRS = new Set(["placeholder", "alt", "aria-label", "title"]);
const SKIP_PROPS = new Set([
  "className", "class", "variant", "size", "type", "to", "href", "id", "key", "name", "path", "side", "align",
  "asChild", "role", "htmlFor", "autoComplete", "inputMode", "icon", "color", "bg", "gradient", "viewBox", "d",
  "fill", "stroke", "src", "style", "target", "preserveAspectRatio", "rel", "loading", "decoding", "sizes", "srcSet", "media", "value",
]);
const CLASS_CALLS = new Set(["cn", "cva", "clsx", "twMerge"]);

const looksLikeClasses = (s) =>
  /^[a-z!\[\-:]/.test(s) && !/[.,;!?] /.test(s) && (/[-:\[]/.test(s.split(/\s+/)[0]) || /\S[:\[]\S/.test(s));

function extract(src, file) {
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const out = new Set();
  const add = (s) => {
    s = norm(s);
    if (s && /[A-Za-zÄÖÜäöüß0-9€]/.test(s) && !looksLikeClasses(s)) out.add(s);
  };
  const skipCall = (c) => {
    const e = c.expression;
    const name = ts.isIdentifier(e) ? e.text : ts.isPropertyAccessExpression(e) ? e.expression.getText() : "";
    return name === "console" || CLASS_CALLS.has(name);
  };
  const visit = (n) => {
    if (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) return;
    if (ts.isCallExpression(n) && skipCall(n)) return;
    if (ts.isJsxText(n)) add(n.getText());
    else if (ts.isJsxAttribute(n)) {
      const name = n.name.getText();
      if (COPY_ATTRS.has(name) && n.initializer && ts.isStringLiteral(n.initializer)) add(n.initializer.text);
      if (n.initializer && ts.isJsxExpression(n.initializer) && n.initializer.expression && !SKIP_PROPS.has(name)) visit(n.initializer.expression);
      return;
    } else if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
      const p = n.parent;
      if (ts.isPropertyAssignment(p) && p.initializer === n) {
        if (!SKIP_PROPS.has(p.name.getText().replace(/['"]/g, ""))) add(n.text);
      } else if (
        ts.isArrayLiteralExpression(p) || ts.isJsxExpression(p) || ts.isConditionalExpression(p) || ts.isBinaryExpression(p) ||
        ts.isCallExpression(p) || ts.isReturnStatement(p) || ts.isVariableDeclaration(p) || ts.isCaseClause(p)
      ) {
        if (n.text.includes(" ") || /^[A-Z]/.test(n.text)) add(n.text);
      }
    } else if (ts.isTemplateExpression(n)) {
      add(n.head.text);
      n.templateSpans.forEach((s) => add(s.literal.text));
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return out;
}

const missing = [];
let total = 0;
for (const f of oldFiles) {
  for (const s of extract(git("show", `${ref}:${f}`), f)) {
    total++;
    if (!tree.includes(s) && !flat.includes(s)) missing.push(`${f}: ${s}`);
  }
}

console.log(`Copy check against ${ref}: ${oldFiles.length} files, ${total} strings.`);
if (missing.length) {
  console.error(`\n${missing.length} string(s) from ${ref} not found in the working tree:\n  ` + missing.join("\n  "));
  process.exit(1);
}
console.log("Copy OK: nothing lost.");
