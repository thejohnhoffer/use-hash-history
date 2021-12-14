import React from "react";
import ReactDOM from "react-dom";
import linkedom from "linkedom";
import Example from "../../demo/example.tsx";
import { act, Simulate } from "react-dom/test-utils";

export function setup() {
  const { window } = parseHTML(`<body><main></main></body>`);
  global.getComputedStyle = window.getComputedStyle;
  global.navigator = window.navigator;
  global.document = window.document;
  global.window = window;
}

export function reset() {
  const container = window.document.querySelector("main");
  ReactDOM.unmountComponentAtNode(container);
}

export function renderExample(props = {}) {
  const container = window.document.querySelector("main");
  act(() => {
    const component = React.createElement(Example, { ...props, window }, null);
    ReactDOM.render(component, container, resolve.bind(null, container));
  });
  return container;
}
