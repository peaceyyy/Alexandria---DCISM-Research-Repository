# Vibe Code Security Checklist

A practical 16-point checklist for "Vibe Coders" (AI-assisted rapid development) to ensure apps are secure without slowing down momentum. Based on "16 Ways to Vibe Code Securely".

## 🚀 The Protocol (Prompt-First Security)

For many of these, the "Senior Dev" move is simply to **Prompt the AI** to do it for you. Don't skip it; prompt it.

### Core Infrastructure

1.  **HTTPS Everywhere**: Ensure your platform (like Replit) serves over HTTPS.
    - _Check_: Is the lock icon visible?
2.  **DOS Protection**: Rely on platform defenses (e.g., Google Cloud Armor on Replit).
    - _Action_: Don't reinvent this unless hosting yourself.
3.  **Keep Dependencies Updated**: Most vulnerabilities are old libs.
    - _Prompt_: "Are my packages out of date? How do I update them safely?"

### Frontend & Client

4.  **No Secrets in Client Code**: NEVER hardcode API keys in React/HTML/JS.
    - _Check_: Can I see the key in the "Network" tab? If yes, it's leaked.
5.  **Input Validation**: Validate on the client for UX, but **Sanitize** on the server for security.
    - _Prompt_: "Add Zod validation schema for this form."
6.  **No Secrets in Local Storage**: excessive data persistence is a risk.
    - _Action_: Use HTTP-only cookies for sessions, not localStorage.

### Backend & API

7.  **Authentication**: Don't roll your own.
    - _Action_: Use `Replit Auth`, `NextAuth`, or `Clerk`.
8.  **Authorization Checks**: Just because they are _Logged In_ doesn't mean they are _Admin_.
    - _Prompt_: "Ensure only users with 'admin' role can hit this endpoint."
9.  **Rate Limiting**: Prevent abuse of your expensive AI endpoints.
    - _Prompt_: "Add rate limiting to this API route using Upstash or a simple map."
10. **SQL Injection**: Use an ORM (Prisma, Drizzle).
    - _Check_: Are you concatenating strings into SQL? Stop. Use the ORM.
11. **API Endpoint Protection**: Protect internal APIs from external callers.
    - _Prompt_: "Add CORS headers and verify session on this API route."

### Hardening

12. **CSRF Protection**: Prevent cross-site form submission.
    - _Prompt_: "Help me implement CSRF tokens for these forms."
13. **Security Headers**: Simple HTML/Server headers prevent embedding hacking.
    - _Prompt_: "Add security headers like X-Frame-Options and Content-Security-Policy."
14. **Secure Cookies**: HTTP Only, Secure, SameSite=Strict.
    - _Prompt_: "Configure these cookies to be HTTP-only and Secure."
15. **File Upload Security**: The most dangerous feature.
    - _Action_: Restrict file types/sizes. Sanitize filenames. Use cloud storage (S3/GCS) which usually handles this safely.
16. **Proper Error Handling**: Don't leak stack traces to the user.
    - _Prompt_: "Ensure error messages don't reveal sensitive server info."

## Summary for AI Agent

When the user asks to "Secure this app" or "Vibe Check":

1.  Run through this list.
2.  For missing items, **Generate the Fix** using the suggested prompts.
