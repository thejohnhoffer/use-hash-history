import { suite } from "uvu";
import * as assert from "uvu/assert";
import { _parse } from "../src/wrapper.ts";
import { useTranscoders } from "../src/index.ts";

// Test parse of hash
const testParser = (label, { hash }) => {
  const TestParser = suite(`test ${label} parser`);
  const noParser = (str) => str;

  TestParser(`test wrapper _parse`, () => {
    assert.is(hash, _parse(noParser, hash));
  });

  TestParser(`test transcoders`, () => {
    const { decode, encode } = useTranscoders({
      hashRoot: "",
      hashSlash: "/",
    });
    assert.is(hash, _parse(encode, _parse(decode, hash)));
  });

  return TestParser;
};

// Run the tests
[testParser("empty", { hash: "#hash" })].map((test) => test.run());
