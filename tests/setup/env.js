import { createElement } from "react";
import { parseHTML } from "linkedom";
import { render } from "@testing-library/react";
import { parsePath, createMemoryHistory } from "history";
import Example from "../../demo/example.tsx";
import { toHtml } from "hast-util-to-html";
import { h } from "hastscript";

export { warn } from "./warn.js";

const MAIN = "main";
const POP = "popstate";
const BODY = `<body><${MAIN}></${MAIN}></body>`;
const findMain = (doc) => doc.querySelector(MAIN);

const parseToHash = (url) => {
  const path = parsePath(url);
  return path;
};

const proxyGet = (object, key, handler) => {
  return new Proxy(object, {
    get(target, prop, _) {
      if (prop !== key) {
        return Reflect.get(target, prop, _);
      }
      return handler(target);
    },
  });
};

const proxyApplyUrl = (fn) => {
  return new Proxy(fn, {
    apply(fnTarget, _this, [state, _title, url]) {
      return fnTarget(parseToHash(url), state);
    },
  });
};

const makeGlobalDocument = () => {
  //const target = new EventTarget();
  const history = createMemoryHistory();
  const defaultView = parseHTML(BODY);
  const { document } = defaultView;
  const popEvent = document.createEvent("CustomEvent");
  popEvent.initCustomEvent(POP, false, false, null);
  history.listen(() => document.dispatchEvent(popEvent));
  return proxyGet(document, "defaultView", (target) => {
    const win = proxyGet(target.defaultView, "history", () => {
      return new Proxy(history, {
        get(targetHistory, prop, _) {
          switch (prop) {
            case "pushState":
              return proxyApplyUrl(targetHistory.push);
            case "replaceState":
              return proxyApplyUrl(targetHistory.replace);
            default:
              return Reflect.get(targetHistory, prop, _);
          }
        },
      });
    });
    return proxyGet(win, "location", (_) => history.location);
  });
};

export function reset() {
  const newGlobal = {
    document: makeGlobalDocument(),
    // Mock window needed for ReactDOM
    window: {
      HTMLIFrameElement: Boolean,
    },
  };
  global.IS_REACT_ACT_ENVIRONMENT = true;
  global.document = newGlobal.document;
  global.window = newGlobal.window;
}

const makeTranscoder = ({ hashRoot, hashSlash }) => {
  return (list) => {
    return list
      .map((path, i) => {
        const symbol = !i ? hashRoot : hashSlash;
        return symbol + path;
      })
      .join("");
  };
};

const expectHeader = ({ options, encodedPath }) => {
  const { hashRoot, hashSlash } = options;
  const format = `${hashRoot}root${hashSlash}slash`;
  return h("h3", `#${format} #${encodedPath}`);
};

const expectAnchor = ({ route, options }) => {
  const encodeRelative = makeTranscoder({
    hashSlash: options.hashSlash,
    hashRoot: "",
  });
  const relative = encodeRelative(route.split("/"));
  const encoded = options.hashRoot + relative;
  const href = `#/${relative}`;
  return h("li", [h("a", { href }, `Go to #${encoded}`)]);
};

export function expectExample(props) {
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

export function renderExample(props = {}) {
  const root = findMain(global.document);
  render(createElement(Example, props, null), {
    container: root,
  });
  return findMain(global.document);
}
