---
name: security-audit
description: >-
  Runs a security audit on the project. Use when checking for
  vulnerabilities, exposed secrets, or before deployment.
---

# Security Audit Sub-Agent

When invoked:
1. Run `npm audit --audit-level=high`.
2. Inspect `.env` files ensuring no sensitive secrets are staged or committed.
3. Verify password hashing using bcrypt with minimum 10 salt rounds.
4. Verify NextAuth route handler and role protection on admin endpoints.
