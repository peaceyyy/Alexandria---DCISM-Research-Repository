import { z } from "zod";

const stringToArray = z.union([z.string(), z.array(z.string())]).transform((val) => {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
});

export const publicThesisSearchSchema = z.object({
  q: z.string().optional().catch(undefined),
  from: z.coerce.number().optional().catch(undefined),
  to: z.coerce.number().optional().catch(undefined),
  department: stringToArray.optional().catch(undefined),
  area: stringToArray.optional().catch(undefined),
  type: stringToArray.optional().catch(undefined),
  tag: stringToArray.optional().catch(undefined),
  mine: z.enum(["1"]).optional().catch(undefined),
  status: z.enum(["all", "for_review", "flagged", "accepted"]).optional().catch(undefined),
  page: z.coerce.number().min(1).default(1).catch(1),
});

export type PublicThesisSearchParams = z.infer<typeof publicThesisSearchSchema>;
