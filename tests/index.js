import { test } from "uvu";
import * as assert from "uvu/assert";
import * as ENV from "./setup/env";

// Thanks `@babel/register`
import { useHashHistory } from "../src/index.ts";
import { Example } from "../demo/example.tsx";

// Create and clean the DOM
test.before(ENV.setup);
test.after.each(ENV.reset);

test("Example renders", async () => {
  const container = ENV.renderExample();

  const result = container.innerHTML;
  const expected = `<a href="#home">Go to #home</a> content`;
  console.log({ result, expected });

  assert.snapshot(result, expected);
});

/*
test('sum', () => {
  assert.type(math.sum, 'function');
  assert.is(math.sum(1, 2), 3);
  assert.is(math.sum(-1, -2), -3);
  assert.is(math.sum(-1, 1), 0);
});
*/

test.run();
