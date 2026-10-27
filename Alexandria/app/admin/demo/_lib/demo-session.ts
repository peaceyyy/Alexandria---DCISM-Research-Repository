import { formSchema, type FormValues } from "@/lib/upload/schema";

import type { DemoTemplate } from "./fixtures";

const DEMO_SESSION_KEY = "alexandria:presentation-demo:v1";
export const DEMO_SESSION_CHANGE_EVENT = "alexandria:presentation-demo-change";

type DemoSession = {
  template: DemoTemplate;
  values: FormValues;
};

export function writeDemoSession(template: DemoTemplate, values: FormValues) {
  const session: DemoSession = { template, values };
  window.sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(DEMO_SESSION_CHANGE_EVENT));
}

export function parseDemoSession(template: DemoTemplate, rawSession: string | null) {
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

export function readDemoSession(template: DemoTemplate) {
  return parseDemoSession(template, window.sessionStorage.getItem(DEMO_SESSION_KEY));
}

export function clearDemoSession() {
  window.sessionStorage.removeItem(DEMO_SESSION_KEY);
  window.dispatchEvent(new Event(DEMO_SESSION_CHANGE_EVENT));
}
