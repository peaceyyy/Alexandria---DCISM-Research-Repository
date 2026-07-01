import { describe, expect, it } from "vitest";
import { getPostAuthDestination } from "./auth-routing";

describe("getPostAuthDestination", () => {
  it.each(["member", "moderator", "admin"] as const)(
    "sends %s to the thesis preview after authentication",
    (role) => {
      expect(getPostAuthDestination(role)).toBe("/theses");
    },
  );

  it("sends a newly registered account to the thesis preview", () => {
    expect(getPostAuthDestination()).toBe("/theses");
  });
});
