# ✨ Code Style Guidelines

These guidelines help all contributors write clean, consistent, and maintainable code across the project.

---

## ⚙️ General

- Use **TypeScript** (not JavaScript).
- Prefer **functional components** and **React hooks**.
- Use **pnpm** for package management.
- Follow existing **project architecture** and **patterns**.
- Avoid using `any` — prefer strict typing and `unknown` or generics when needed.

---

## 🧹 Formatting & Style

- All code must be formatted and linted using **Biome**.
- Use consistent **indentation** (2 spaces).
- Prefer **descriptive variable and function names**.
- Remove unused imports and dead code.
- Follow **accessibility** best practices (`aria-*`, semantic HTML).

---

## 📦 Project Structure

- Organize code into `apps/`, `packages/`, and `components/` as needed.
- Use **barrel files** (`index.ts`) for exports when grouping modules.
- Co-locate tests (`*.test.ts` or `*.spec.ts`) with the file under test when appropriate.

---

## 🧪 Testing

- Use **Vitest** for unit testing and **Playwright** for end-to-end tests.
- Tests must be written for all core business logic and UI components.
- Prefer `describe()` + `it()` syntax for clarity.
- Always mock external APIs and side-effects in unit tests.

---

## 🤖 GitHub Copilot

Copilot is allowed but must follow these rules:
- Output must follow the **project's code style**.
- Generated code should be **reviewed and refactored** before committing.
- Follow **commit message** rules below.

---

## ✅ Commits

Use **[Conventional Commits](https://www.conventionalcommits.org/)**:

```
<type>(<scope>): <short summary> (#task-id)
```

**Examples**:
- `feat(auth): implement login flow (#123)`
- `fix(dashboard): handle null values (#78)`
- `refactor(ui): simplify button component`
- `test: add unit tests for form validator`

**Types**:
- `feat` – New feature
- `fix` – Bug fix
- `refactor` – Code restructuring
- `style` – Non-functional formatting changes
- `test` – Adding or updating tests
- `chore` – Tooling or maintenance
- `ci` – CI/CD config
- `docs` – Documentation only

---

## 🚀 Releases

- Use **semantic-release** to manage versioning.
- `feat` = minor bump, `fix` = patch bump.
- For breaking changes, include `BREAKING CHANGE:` in the commit body.

---

## 🔐 Security

- Sanitize inputs and escape output.
- Store secrets in environment variables, **never** hardcode them.
- Handle authentication and authorization checks clearly and consistently.

---

## 📄 File Locations

- Place this file at the root as `CODE_STYLE.md` or `.github/CODE_GUIDELINES.md`.

---

Let’s keep our code clean, safe, and consistent! ✨
