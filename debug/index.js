import { suite } from "uvu";
import * as assert from "uvu/assert";
import * as ENV from "../tests/setup/env.js";
import { useHashHistory } from "../src/index.ts";

const DebugUseHistory = suite("debug history hook");

// Create and clean the DOM
DebugUseHistory.before.each(ENV.reset);

DebugUseHistory("Example renders", async () => {
  debugger;
  const { innerHTML } = ENV.renderExample({});
  const expected = ENV.expectExample({});
  assert.snapshot(innerHTML, expected);
});

DebugUseHistory.run();
