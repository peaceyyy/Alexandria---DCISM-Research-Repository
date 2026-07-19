export const DEPARTMENTS = ["CS", "IT", "IS"] as const;

export type Department = (typeof DEPARTMENTS)[number];

/**
 * The repository currently serves one academic unit. Programs remain a
 * separate layer so future units (for example, Engineering) can expose their
 * own program set without changing the existing program values or filters.
 */
export const ACADEMIC_UNITS = [
  {
    id: "dcism",
    label: "DCISM",
    programs: DEPARTMENTS,
  },
] as const;

export type AcademicUnitId = (typeof ACADEMIC_UNITS)[number]["id"];

export function isDepartment(value: string): value is Department {
  return DEPARTMENTS.includes(value as Department);
}
