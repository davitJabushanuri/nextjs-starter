# 🤖 GitHub Copilot Instructions

These are guidelines to help GitHub Copilot generate consistent and production-friendly code and commits.

---

## ✅ General Coding Guidelines

- Use **TypeScript** syntax.
- Use **functional components** and **React hooks** for UI code.
- Prefer **pure functions**.
- Follow **existing patterns** in the project.
- Suggest **accessibility best practices** in components (e.g., aria labels).
- Format code according to **Biome** config.
- Follow **strict typing** — avoid `any`, use proper types or generics.

---

## 🔐 Security & Best Practices

- Sanitize user input (especially in forms and API handlers).
- Avoid hardcoding secrets — use `process.env`.
- Handle errors gracefully using `try/catch`.
- For sensitive logic, always explain security implications.

---

## 🧪 Testing

- Write `vitest` unit tests for functions and components.
- Prefer `describe/it` structure and descriptive test names.
- For E2E flows, suggest `playwright` tests.

---

## 📦 Dependencies

- Use `pnpm` for package management.
- Avoid suggesting large dependencies unless necessary.

---

## 🧾 Commits (Conventional Commits)

Use the following format for commit messages:

```
<type>(<scope>): <short description> (#<task-id>)
```

### Examples:
- `feat(auth): add password reset flow (#123)`
- `fix(ui): adjust button padding (#99)`
- `chore: update dependencies`

### Types:
- `feat` – new feature
- `fix` – bug fix
- `chore` – maintenance
- `docs` – documentation
- `test` – adding tests
- `refactor` – refactoring without new features or bugs
- `style` – formatting only
- `perf` – performance improvements
- `ci` – CI/CD changes

---

## 🔄 Releases

- Commits follow **semantic-release** rules.
- `feat` and `fix` trigger version bumps.
- Breaking changes must include `BREAKING CHANGE:` in the commit body.

---


