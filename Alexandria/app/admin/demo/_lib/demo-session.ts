import { formSchema, type FormValues } from "@/lib/upload/schema";

import type { DemoTemplate } from "./fixtures";

const DEMO_SESSION_KEY = "alexandria:presentation-demo:v1";

type DemoSession = {
  template: DemoTemplate;
  values: FormValues;
};

export function writeDemoSession(template: DemoTemplate, values: FormValues) {
  const session: DemoSession = { template, values };
  window.sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
}

export function readDemoSession(template: DemoTemplate) {
  const rawSession = window.sessionStorage.getItem(DEMO_SESSION_KEY);

  if (!rawSession) return null;

  try {
    const session = JSON.parse(rawSession) as DemoSession;
    if (session.template !== template) return null;

    const result = formSchema.safeParse(session.values);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function clearDemoSession() {
  window.sessionStorage.removeItem(DEMO_SESSION_KEY);
}
