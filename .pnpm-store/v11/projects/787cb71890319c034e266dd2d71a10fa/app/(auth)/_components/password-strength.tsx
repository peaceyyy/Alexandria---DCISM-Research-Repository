import { Check, X } from "lucide-react";

export function PasswordStrength({ 
  password, 
  confirmPassword 
}: { 
  password?: string;
  confirmPassword?: string;
}) {
  const pw = password || "";
  const cpw = confirmPassword || "";
  
  const rules = [
    { label: "At least 8 characters", met: pw.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(pw) },
    { label: "One lowercase letter", met: /[a-z]/.test(pw) },
    { label: "One number", met: /[0-9]/.test(pw) },
    { label: "One special character", met: /[^A-Za-z0-9]/.test(pw) },
  ];

  const matchMet = pw.length > 0 && pw === cpw;

  return (
    <div className="mt-2 flex flex-col gap-3 px-2">
      <ul className="flex flex-col gap-1.5">
        {rules.map((rule) => (
          <li
            key={rule.label}
            className="flex items-center gap-2 text-sm"
            style={{
              color: rule.met ? "var(--color-success, #22c55e)" : "var(--color-placeholder)",
            }}
          >
            {rule.met ? (
              <Check size={16} aria-hidden />
            ) : (
              <X size={16} aria-hidden />
            )}
            <span>{rule.label}</span>
          </li>
        ))}
      </ul>
      {cpw.length > 0 && (
        <div 
          className="flex items-center gap-2 text-sm font-medium"
          style={{
            color: matchMet ? "var(--color-success, #22c55e)" : "var(--color-danger, #ef4444)",
          }}
        >
          {matchMet ? (
            <Check size={16} aria-hidden />
          ) : (
            <X size={16} aria-hidden />
          )}
          <span>{matchMet ? "Passwords match" : "Passwords do not match"}</span>
        </div>
      )}
    </div>
  );
}
