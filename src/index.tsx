import * as React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import { ErrorBoundary } from "./App/Ui/ErrorBoundary";
import { App } from "./App/App";

const domNode = document.getElementById("overlay")!;
hydrateRoot(
  domNode,
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
