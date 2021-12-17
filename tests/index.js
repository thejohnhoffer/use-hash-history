import { suite } from "uvu";
import * as assert from "uvu/assert";
import * as ENV from "./setup/env.js";
import { useHashHistory } from "../src/index.ts";

const TestUseHistory = suite("test history hook");

// Create and clean the DOM
TestUseHistory.before.each(ENV.reset);

TestUseHistory("Example renders", async () => {
  const { innerHTML } = ENV.renderExample({});
  const expected = ENV.expectExample({});
  assert.snapshot(innerHTML, expected);
});

TestUseHistory("#a=1#b=2 renders", async () => {
  const props = {
    options: { hashRoot: "", hashSlash: "#" },
    routes: ["home", "a=1/b=2"],
  };
  const { innerHTML } = ENV.renderExample(props);
  const expected = ENV.expectExample(props);
  assert.snapshot(innerHTML, expected);
});

TestUseHistory("#!/hello/world renders", async () => {
  const props = {
    options: { hashRoot: "!/", hashSlash: "/" },
    routes: ["home", "hello", "hello/world"],
  };
  const { innerHTML } = ENV.renderExample(props);
  const expected = ENV.expectExample(props);
  assert.snapshot(innerHTML, expected);
});

const getTestData = ({ options, fn, pathList }) => {
  const history = useHashHistory(options);
  return {
    fn: history[fn],
    listen: history.listen,
    input: "/" + pathList.join("/"),
  };
};

/*
 * Roundtrip test of pathname update
 */
const testLocationPathname = async ({ fn, listen, input }) => {
  return new Promise((resolve) => {
    listen(({ location }) => {
      resolve(location.pathname);
    });
    fn(input);
  });
};

TestUseHistory(`hashRoot="" push`, async () => {
  const data = getTestData({
    options: {
      hashRoot: "",
    },
    fn: "push",
    pathList: ["test"],
  });
  const result = await testLocationPathname(data);
  assert.is(result, "/test");
});

TestUseHistory(`hashRoot="" replace`, async () => {
  const data = getTestData({
    options: {
      hashRoot: "",
    },
    fn: "replace",
    pathList: ["test"],
  });
  const result = await testLocationPathname(data);
  assert.is(result, "/test");
});

TestUseHistory(`hashRoot="/" push`, async () => {
  const data = getTestData({
    options: {
      hashRoot: "/",
    },
    fn: "push",
    pathList: ["test"],
  });
  const result = await testLocationPathname(data);
  assert.is(result, "/test");
});

TestUseHistory(`hashRoot="/" replace`, async () => {
  const data = getTestData({
    options: {
      hashRoot: "/",
    },
    fn: "replace",
    pathList: ["test"],
  });
  const result = await testLocationPathname(data);
  assert.is(result, "/test");
});

TestUseHistory.run();
