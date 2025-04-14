import * as fs from "fs";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { App } from "./src/App/App";

console.log("📸 rendering loading screen to string...");

const appContent = renderToString(React.createElement(App, { loading: true }));

console.log("🖊 replacing content in index.html...");

let indexContent = fs.readFileSync(__dirname + "/dist/index.html").toString();

indexContent = indexContent.replace(
  `<div id="overlay"></div>`,
  `<div id="overlay">${appContent}</div>`
);

fs.writeFileSync(__dirname + "/dist/index.html", indexContent);

console.log("✅ done");
