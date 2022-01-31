export { warn } from "./warn.js";
import { h } from "hastscript";
import { createElement } from "react";
import { toHtml } from "hast-util-to-html";
import Example from "../../demo/example.tsx";
import { renderElement, resetDocument } from "linkedom-history";

const MAIN = "main";

function makeTranscoder({ hashRoot, hashSlash }) {
  return (list) => {
    return list
      .map((path, i) => {
        const symbol = !i ? hashRoot : hashSlash;
        return symbol + path;
      })
      .join("");
  };
}

function expectHeader({ options, encodedPath }) {
  const { hashRoot, hashSlash } = options;
  const format = `${hashRoot}root${hashSlash}slash`;
  return h("h3", `#${format} #${encodedPath}`);
}

function expectAnchor({ route, options }) {
  const encodeRelative = makeTranscoder({
    hashSlash: options.hashSlash,
    hashRoot: "",
  });
  const relative = encodeRelative(route.split("/"));
  const encoded = options.hashRoot + relative;
  const href = `#/${relative}`;
  return h("li", [h("a", { href }, `Go to #${encoded}`)]);
}

function expectExample(props = {}) {
  const { hashRoot = "", hashSlash = "/" } = {
    ...Example.defaultProps.options,
    ...props.options,
  };
  const { routes } = {
    ...Example.defaultProps,
    ...props,
  };
  const options = { hashRoot, hashSlash };
  const encode = makeTranscoder(options);

  const encodedPath = encode([""]);
  const header = expectHeader({ options, encodedPath });
  const anchors = h(
    "ul",
    routes.map((route) => {
      return expectAnchor({ route, options });
    })
  );
  return toHtml(h(MAIN, [header, anchors]).children);
}

function renderExample(props = {}) {
  const element = createElement(Example, props);
  return renderElement(MAIN, element);
}

function reset() {
  return resetDocument(MAIN);
}

export { reset, renderExample, expectExample };
