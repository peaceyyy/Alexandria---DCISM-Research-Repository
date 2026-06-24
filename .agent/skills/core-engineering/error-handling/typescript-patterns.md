# TypeScript/JavaScript Error Handling (Modern)

Transform your error handling from "try-catch spaghetti" to predictable, type-safe control flows.

**1. Define the Result Type**

Avoid generic `Result<T, E>` in favor of strict Discriminated Unions for specific domains.

```typescript
type Result<T, E> = { success: true; data: T } | { success: false; error: E };
```

**2. Define Specific Errors**

Don't use generic strings. Use a Union Type for the `reason`.

```typescript
type CreateProjectError = {
  reason:
    | "NOT_AUTHENTICATED"
    | "NOT_AUTHORIZED"
    | "INVALID_DATA"
    | "DATABASE_ERROR";
  message: string;
  details?: Record<string, unknown>;
};
```

**3. The "Action" (Business Logic)**

Do NOT redirect or throw inside your logic. Return the Result.

```typescript
// actions/create-project.ts
export async function createProject(
  data: unknown,
): Promise<Result<Project, CreateProjectError>> {
  // 1. Validation
  const user = await getUser();
  if (!user) {
    return {
      success: false,
      error: { reason: "NOT_AUTHENTICATED", message: "Must be logged in" },
    };
  }

  // 2. Data Logic
  try {
    const project = await db.createProject(data);
    return { success: true, data: project };
  } catch (e) {
    return {
      success: false,
      error: { reason: "DATABASE_ERROR", message: "Failed to save" },
    };
  }
}
```

**4. The Consumer (Exhaustive Handling Component)**

Use `satisfies never` to ensure you handle **every possible error**.

```typescript
// components/ProjectForm.tsx
const result = await createProject(formData);

if (!result.success) {
  const { reason } = result.error;

  switch (reason) {
    case "NOT_AUTHENTICATED":
      redirect("/login");
      break;
    case "NOT_AUTHORIZED":
      toast.error("You are not an admin");
      break;
    case "INVALID_DATA":
      setFormErrors(result.error.details);
      break;
    case "DATABASE_ERROR":
      toast.error("System error, please try again");
      break;
    default:
      // CRITICAL: Builds fail if you add a new error and forget to handle it
      const _exhaustiveCheck: never = reason;
      throw new Error(`Unhandled error case: ${_exhaustiveCheck}`);
  }
  return;
}
```
