import assert from "node:assert";
import { test } from "node:test";
import { getFeaturedProjects, getProject, projects } from "./projects";

test("featured projects are a subset of all projects", () => {
  const featured = getFeaturedProjects();
  assert.ok(featured.every((p) => projects.includes(p)));
});

test("getProject finds by slug and misses cleanly", () => {
  assert.equal(getProject("nutrio")?.slug, "nutrio");
  assert.equal(getProject("nope"), undefined);
});

test("every project slug is unique", () => {
  const slugs = projects.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});
