import { suite } from "uvu";
import * as assert from "uvu/assert";
import { _parse } from "../src/wrapper.ts";

// Test parse of hash
const testWrapper = (label, { hash }) => {
  const TestWrapper = suite(`test wrapper`);
  const noParser = (str) => str;

  TestWrapper(`test ${label} parser`, () => {
    assert.is(hash, _parse(noParser, hash));
  });

  return TestWrapper;
};

// Run the tests
[testWrapper("empty", { hash: "#hash" })].map((test) => test.run());
