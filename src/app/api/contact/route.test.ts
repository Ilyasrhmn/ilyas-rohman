import assert from "node:assert";
import { test } from "node:test";
import { validateContact } from "./route";

test("rejects missing name/message", () => {
  assert.equal(validateContact({ email: "a@b.co", message: "hi" }), null);
  assert.equal(validateContact({ name: "A", email: "a@b.co" }), null);
});

test("rejects bad email", () => {
  assert.equal(validateContact({ name: "A", email: "nope", message: "hi" }), null);
});

test("rejects non-object bodies", () => {
  assert.equal(validateContact(null), null);
  assert.equal(validateContact("string"), null);
});

test("accepts and trims valid input", () => {
  assert.deepEqual(validateContact({ name: " A ", email: "a@b.co", message: " hi " }), {
    name: "A",
    email: "a@b.co",
    message: "hi",
  });
});
