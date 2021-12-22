import { suite } from "uvu";
import * as assert from "uvu/assert";
import * as ENV from "./setup/env.js";
import { useHashHistory } from "../src/index.ts";
import { createPath } from "history";

/*
 * Test rendering with react-router-dom
 */
const testExample = (key, props) => {
  const TestExample = suite(`test ${key} with react-router-dom`);
  TestExample.before.each(ENV.reset);

  TestExample("Example renders", async () => {
    const { innerHTML } = ENV.renderExample(props);
    const expected = ENV.expectExample(props);
    assert.snapshot(innerHTML, expected);
  });

  return TestExample;
};

/*
 * Roundtrip pathname update
 */
const updatePathname = async ({ fn, listen, input }) => {
  return new Promise((resolve) => {
    listen(({ location }) => {
      resolve(location.pathname);
    });
    fn(input);
  });
};

const testUseHistory = (key, options) => {
  const TestUseHistory = suite(`test ${key} history listener`);
  let history;

  // Create and clean the DOM
  TestUseHistory.before.each(ENV.reset);
  TestUseHistory.before.each(() => {
    history = useHashHistory(options);
  });

  // Test window location at every step
  TestUseHistory.after.each(() => {
    const { hashRoot = "" } = options;
    const historyHref = createPath(history.location);
    const windowHref = document.defaultView.location.hash.substr(1);
    assert.is(historyHref.replace(/^\//, hashRoot), windowHref);
  });

  TestUseHistory(`push /test`, async () => {
    const result = await updatePathname({
      fn: history.push,
      listen: history.listen,
      input: "/test",
    });
    assert.is(result, "/test");
  });

  TestUseHistory(`replace /test`, async () => {
    const result = await updatePathname({
      fn: history.replace,
      listen: history.listen,
      input: "/test",
    });
    assert.is(result, "/test");
  });

  TestUseHistory(`push ../test`, async () => {
    const result = await updatePathname({
      fn: history.push,
      listen: history.listen,
      input: "../test",
    });
    assert.is(result, "../test");
  });

  return TestUseHistory;
};

// Run the tests
[
  testExample("default", {}),
  testExample("#a=1#b=2", {
    options: { hashRoot: "", hashSlash: "#" },
    routes: ["home", "a=1/b=2"],
  }),
  testExample("!/hello/world", {
    options: { hashRoot: "!/", hashSlash: "/" },
    routes: ["home", "hello", "hello/world"],
  }),
  testUseHistory("default", {}),
  testUseHistory("relative", { hashRoot: "" }),
  testUseHistory("absolute", { hashRoot: "/" }),
].map((test) => test.run());
