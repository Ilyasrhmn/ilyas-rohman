import assert from "node:assert";
import { test } from "node:test";
import { splitWords } from "./scroll-reveal";

test("splits into words and preserves spacing tokens", () => {
  const parts = splitWords("hello  world");
  assert.deepEqual(parts, ["hello", "  ", "world"]);
});

test("empty string yields empty array of words", () => {
  assert.deepEqual(splitWords(""), [""]);
});
