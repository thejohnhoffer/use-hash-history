import { suite } from "uvu";
import * as assert from "uvu/assert";
import { _parse } from "../src/wrapper.ts";
import { _useParser } from "../src/transcoder.ts";

// Test parse of hash
const testParser = (label, { hash }) => {
  const TestParser = suite(`test ${label} parser`);
  const noParser = (str) => str;

  TestParser(`test wrapper parse`, () => {
    assert.is(hash, _parse(noParser, hash));
  });

  TestParser(`test transcoder useParser`, () => {
    assert.is(hash, _useParser([noParser])(hash));
  });

  return TestParser;
};

// Run the tests
[testParser("empty", { hash: "#hash" })].map((test) => test.run());
