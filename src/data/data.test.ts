import assert from "node:assert";
import { test } from "node:test";
import { getFeaturedProjects, getProject, projects } from "./projects";
import { stackGroups } from "./stack";

test("featured projects are a subset of all projects", () => {
  const featured = getFeaturedProjects();
  assert.ok(featured.every((p) => projects.includes(p)));
});

test("getProject finds by slug and misses cleanly", () => {
  assert.equal(getProject("marketplace-desa")?.slug, "marketplace-desa");
  assert.equal(getProject("nope"), undefined);
});

test("every project slug is unique", () => {
  const slugs = projects.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("stack has exactly the three capability groups", () => {
  assert.deepEqual(
    stackGroups.map((g) => g.label),
    ["Frontend Engineering", "Motion & Interaction", "Backend & Integration"]
  );
});
