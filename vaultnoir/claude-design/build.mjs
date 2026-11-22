import { createRequire } from "node:module";
const { build } = createRequire(process.cwd() + "/package.json")("esbuild");
const S = process.argv[2], SRC = process.argv[3];
const globals = { react: "window.React", "react-dom": "window.ReactDOM" };
await build({
  entryPoints: [SRC + "/react/index.tsx"], bundle: true, format: "iife", globalName: "vaultnoir", minify: true,
  jsx: "transform", jsxFactory: "React.createElement", jsxFragment: "React.Fragment",
  banner: { js: '/* @ds-bundle: {"format":4,"namespace":"vaultnoir","components":[' +
    ["TopBar","Toolbar","Button","Chip","Rating","Card","Badge","KeySheet","Stats","Tabs","Alert","Empty","SkeletonGrid","Toasts","Field"].map(n => `{"name":"${n}"}`).join(",") + ']} */\nvar React = window.React;' },
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [{ name: "globals", setup(b) {
    b.onResolve({ filter: /^react(-dom)?(\/.*)?$/ }, (a) => ({ path: a.path, namespace: "g" }));
    b.onLoad({ filter: /.*/, namespace: "g" }, (a) => ({ contents: `module.exports = ${a.path.startsWith("react-dom") ? "window.ReactDOM" : "window.React"};`, loader: "js" }));
  } }],
  outfile: S + "/project/components/bundle.js", logLevel: "warning",
});
