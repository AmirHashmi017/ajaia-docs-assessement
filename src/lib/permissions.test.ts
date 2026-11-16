import { describe, expect, it } from "vitest";
import { canEdit, canManageSharing, canView } from "./permissions";

describe("permissions", () => {
  it("allows owners and editors to edit", () => {
    expect(canEdit("owner")).toBe(true);
    expect(canEdit("editor")).toBe(true);
    expect(canEdit("viewer")).toBe(false);
    expect(canEdit(null)).toBe(false);
  });

  it("restricts sharing management to owners", () => {
    expect(canManageSharing("owner")).toBe(true);
    expect(canManageSharing("editor")).toBe(false);
    expect(canManageSharing("viewer")).toBe(false);
  });

  it("allows any granted role to view", () => {
    expect(canView("owner")).toBe(true);
    expect(canView("editor")).toBe(true);
    expect(canView("viewer")).toBe(true);
    expect(canView(null)).toBe(false);
  });
});
