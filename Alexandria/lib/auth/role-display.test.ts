import { describe, expect, it } from "vitest";
import { getRoleDisplay } from "./role-display";

describe("getRoleDisplay", () => {
  it("treats a missing session as a guest", () => {
    expect(getRoleDisplay(null)).toMatchObject({
      role: "guest",
      label: "Guest",
      abbreviation: "G",
    });
  });

  it.each([
    ["member", "Member", "M"],
    ["moderator", "Moderator", "MOD"],
    ["admin", "Admin", "A"],
  ] as const)("maps %s to its header identity", (role, label, abbreviation) => {
    expect(getRoleDisplay(role)).toMatchObject({
      role,
      label,
      abbreviation,
    });
  });
});
