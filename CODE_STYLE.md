# ✨ Code Style Guidelines

These guidelines help all contributors write clean, consistent, and maintainable code across the project.

---

## ⚙️ General

- Use **TypeScript** (not JavaScript).
- Prefer **functional components** and **React hooks**.
- Use **pnpm** for package management.
- Follow existing **project architecture** and **patterns**.
- Avoid using `any` — prefer strict typing and `unknown` or generics when needed.
- Format code according to **Biome** config.
- Suggest **accessibility best practices** in components (e.g., aria labels).

---

## 📝 TypeScript Guidelines

#### Interface Extends
- ALWAYS prefer interfaces when modelling inheritance.
- The `&` operator has terrible performance in TypeScript. Only use it where `interface extends` is not possible.

```ts
// BAD
type A = {
  a: string;
};

type B = {
  b: string;
};

type C = A & B;
```

```ts
// GOOD
interface A {
  a: string;
}

interface B {
  b: string;
}

interface C extends A, B {
  // Additional properties can be added here
}
```

#### Default Exports
- Unless explicitly required by the framework, do not use default exports.

```ts
// BAD
export default function myFunction() {
  return <div>Hello</div>;
}
```

```ts
// GOOD
export function myFunction() {
  return <div>Hello</div>;
}
```

- Default exports create confusion from the importing file.

```ts
// BAD
import myFunction from "./myFunction";
```

```ts
// GOOD
import { myFunction } from "./myFunction";
```

- There are certain situations where a framework may require a default export. For instance, Next.js requires a default export for pages.

```tsx
// This is fine, if required by the framework
export default function MyPage() {
  return <div>Hello</div>;
}
```

#### Any in Generic Functions
- Avoid using `any` inside generic functions. This defeats the purpose of generics and loses type safety.
- Use type constraints or proper generic types instead.

```ts
// BAD - defeats the purpose of generics
const processValue = <T>(value: T): any => {
  return JSON.parse(JSON.stringify(value));
};
```

```ts
// GOOD - maintains type safety
const processValue = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value)) as T;
};
```

```ts
// EVEN BETTER - use proper typing for JSON operations
const cloneValue = <T>(value: T): T => {
  return structuredClone(value);
};
```

- When you need to work with unknown types, use `unknown` instead of `any`:

```ts
// BAD
const handleApiResponse = <T>(response: any): T => {
  return response.data;
};
```

```ts
// GOOD
const handleApiResponse = <T>(response: unknown): T => {
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return (response as { data: T }).data;
  }
  throw new Error('Invalid response format');
};
```

#### Optional Properties
- Use optional properties extremely sparingly. Only use them when the property is truly optional, and consider whether bugs may be caused by a failure to pass the property.
- In cases where you always want to pass a value (even if it's `undefined`), make the property required and use union types instead.

```ts
// BAD - allows forgetting to pass userId entirely
type AuthOptions = {
  userId?: string;
};

const func = (options: AuthOptions) => {
  const userId = options.userId;
};
```

```ts
// GOOD - forces explicit handling of undefined
type AuthOptions = {
  userId: string | undefined;
};

const func = (options: AuthOptions) => {
  const userId = options.userId;
};
```

- This approach prevents bugs caused by forgetting to pass important properties, even when their value might be `undefined`.

#### Import Type
- Use `import type` whenever you are importing a type.
- Prefer top-level `import type` over inline `import { type ... }`.

```ts
// BAD
import { type User } from "./user";
```

```ts
// GOOD
import type { User } from "./user";
```

- The reason for this is that in certain environments, the first version's import will not be erased. So you'll be left with:

```ts
// Before transpilation
import { type User } from "./user";

// After transpilation
import "./user";
```

- This can cause unnecessary side effects and module loading when you only intended to import types.

#### Discriminated Unions
- Proactively use discriminated unions to model data that can be in one of a few different shapes.

```ts
type UserCreatedEvent = {
  type: "user.created";
  data: { id: string; email: string };
};

type UserDeletedEvent = {
  type: "user.deleted";
  data: { id: string };
};

type Event = UserCreatedEvent | UserDeletedEvent;
```

- Use switch statements to handle the results of discriminated unions:

```ts
const handleEvent = (event: Event) => {
  switch (event.type) {
    case "user.created":
      console.log(event.data.email);
      break;
    case "user.deleted":
      console.log(event.data.id);
      break;
  }
};
```

- Use discriminated unions to prevent the 'bag of optionals' problem.

```ts
// BAD - allows impossible states
type FetchingState<TData> = {
  status: "idle" | "loading" | "success" | "error";
  data?: TData;
  error?: Error;
};

// GOOD - prevents impossible states
type FetchingState<TData> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: TData }
  | { status: "error"; error: Error };
```

#### Readonly Properties
- Use `readonly` properties for object types by default. This will prevent accidental mutation at runtime.
- Omit `readonly` only when the property is genuinely mutable.

```ts
// BAD
type User = {
  id: string;
};

const user: User = {
  id: "1",
};

user.id = "2";
```

```ts
// GOOD
type User = {
  readonly id: string;
};

const user: User = {
  id: "1",
};

user.id = "2"; // Error
```

#### Throwing (Error Handling)
- Think carefully before implementing code that throws errors.
- If a thrown error produces a desirable outcome in the system, go for it. For instance, throwing a custom error inside a backend framework's request handler.
- However, for code that you would need a manual try catch for, consider using a result type instead:

```ts
type Result<T, E extends Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

- For example, when parsing JSON:

```ts
const parseJson = (
  input: string,
): Result<unknown, Error> => {
  try {
    return { ok: true, value: JSON.parse(input) };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
};
```

- This way you can handle the error in the caller:

```ts
const result = parseJson('{"name": "John"}');

if (result.ok) {
  console.log(result.value);
} else {
  console.error(result.error);
}
```

#### Return Types
- When declaring functions on the top-level of a module, declare their return types. This will help future AI assistants understand the function's purpose.

```ts
const myFunc = (): string => {
  return "hello";
};
```

- One exception to this is components which return JSX. No need to declare the return type of a component, as it is always JSX.

```tsx
const MyComponent = () => {
  return <div>Hello</div>;
};
```

#### Enums
- Do not introduce new enums into the codebase. Retain existing enums.
- If you require enum-like behaviour, use an `as const` object:

```ts
const backendToFrontendEnum = {
  xs: "EXTRA_SMALL",
  sm: "SMALL",
  md: "MEDIUM",
} as const;

type LowerCaseEnum = keyof typeof backendToFrontendEnum; // "xs" | "sm" | "md"

type UpperCaseEnum =
  (typeof backendToFrontendEnum)[LowerCaseEnum]; // "EXTRA_SMALL" | "SMALL" | "MEDIUM"
```

- Remember that numeric enums behave differently to string enums. Numeric enums produce a reverse mapping:

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const direction = Direction.Up; // 0
const directionName = Direction[0]; // "Up"
```

- This means that the enum `Direction` above will have eight keys instead of four.

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

Object.keys(Direction).length; // 8
```

#### No Unchecked Indexed Access
- If the user has this rule enabled in their `tsconfig.json`, indexing into objects and arrays will behave differently from how you expect.

```ts
const obj: Record<string, string> = {};

// With noUncheckedIndexedAccess, value will
// be `string | undefined`
// Without it, value will be `string`
const value = obj.key;
```

```ts
const arr: string[] = [];

// With noUncheckedIndexedAccess, value will
// be `string | undefined`
// Without it, value will be `string`
const value = arr[0];
```

#### JSDoc Comments
- Use JSDoc comments to annotate functions and types.
- Be concise in JSDoc comments, and only provide JSDoc comments if the function's behaviour is not self-evident.
- Use the JSDoc inline `@link` tag to link to other functions and types within the same file.

```ts
/**
 * Subtracts two numbers
 */
const subtract = (a: number, b: number) => a - b;

/**
 * Does the opposite to {@link subtract}
 */
const add = (a: number, b: number) => a + b;
```

### Function Signatures
- Use function declarations for top-level functions.
- Use arrow functions for inline callbacks and short utilities.
- Always type function parameters and return types for public APIs.

```ts
// Good: Clear function declaration with types
function processUser(user: User): ProcessedUser {
  return { ...user, processed: true };
}

// Good: Arrow function for utilities
const formatName = (first: string, last: string): string => 
  `${first} ${last}`;
```

---

## 📦 Dependencies

- Use `pnpm` for package management.
- Avoid suggesting large dependencies unless necessary.
- When installing libraries, do not rely on your own training data.
- Your training data has a cut-off date. You're probably not aware of all of the latest developments in the JavaScript and TypeScript world.
- This means that instead of picking a version manually (via updating the `package.json` file), you should use a script to install the latest version of a library.

```bash
# pnpm
pnpm add -D @typescript-eslint/eslint-plugin

# yarn
yarn add -D @typescript-eslint/eslint-plugin

# npm
npm install --save-dev @typescript-eslint/eslint-plugin
```

- This will ensure you're always using the latest version.

### Naming Conventions
- Use kebab-case for file names (e.g., `my-component.ts`)
- Use camelCase for variables and function names (e.g., `myVariable`, `myFunction()`)
- Use UpperCamelCase (PascalCase) for classes, types, and interfaces (e.g., `MyClass`, `MyInterface`)
- Use ALL_CAPS for constants and enum values (e.g., `MAX_COUNT`, `Color.RED`)
- Inside generic types, functions or classes, prefix type parameters with `T` (e.g., `TKey`, `TValue`)

```ts
type RecordOfArrays<TItem> = Record<string, TItem[]>;
```

---

## ⚡ Next.js Rendering Patterns

Choose the appropriate rendering strategy based on your data requirements and user experience needs:

### Client-Side Rendering (CSR)
Use when:
- Data is user-specific and changes frequently
- Page requires real-time updates
- SEO is not important for the page
- Building interactive dashboards or admin panels

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';

// Component with named export
export function DashboardComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userData'],
    queryFn: fetchUserData,
  });
  
  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;
  
  return <div><UserDashboard data={data} /></div>;
}

// Page file - Next.js requires default export
export default function DashboardPage() {
  return <DashboardComponent />;
}
```

### Server-Side Rendering (SSR)
Use when:
- Data changes frequently and must be fresh on each request
- SEO is important and content is dynamic
- Personalized content that varies per user
- Real-time data that can't be cached

```tsx
// Component with named export
export function UserProfileComponent({ user }: { user: User }) {
  return <ProfilePage user={user} />;
}

// Page file - Next.js requires default export
export default async function UserProfilePage({ params }: { params: { id: string } }) {
  // This runs on every request
  const user = await fetchUser(params.id);
  
  return <UserProfileComponent user={user} />;
}
```

### Static Site Generation (SSG)
Use when:
- Content rarely changes
- SEO is critical
- Same content for all users
- Marketing pages, blogs, documentation

```tsx
// Component with named export
export function BlogPostComponent({ post }: { post: Post }) {
  return <Article post={post} />;
}

// Page file - Next.js requires default export
export default function BlogPostPage({ post }: { post: Post }) {
  return <BlogPostComponent post={post} />;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
```

### Incremental Static Regeneration (ISR)
Use when:
- Content changes occasionally (hours/days)
- Need both performance and freshness
- E-commerce product pages, news articles
- Want to avoid rebuilding entire site

```tsx
// Component with named export
export function ProductComponent({ product }: { product: Product }) {
  return <ProductDetails product={product} />;
}

// Page file - Next.js requires default export
export default function ProductPage({ product }: { product: Product }) {
  return <ProductComponent product={product} />;
}

export async function generateStaticParams() {
  // Generate most popular products at build time
  const popularProducts = await getPopularProducts();
  return popularProducts.map((product) => ({ id: product.id }));
}

// Revalidate every hour
export const revalidate = 3600;
```

### Partial Prerendering (PPR)
Use when:
- Page has both static and dynamic sections
- Want to serve static shell immediately
- Dynamic content can load progressively
- Complex pages with mixed content types

```tsx
import { Suspense } from 'react';

// Component with named export
export function HomePageComponent() {
  return (
    <div>
      {/* Static content - prerendered */}
      <Header />
      <HeroSection />
      
      {/* Dynamic content - streams in */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <PersonalizedRecommendations />
      </Suspense>
      
      <Suspense fallback={<ActivitySkeleton />}>
        <UserActivity />
      </Suspense>
      
      {/* Static content - prerendered */}
      <Footer />
    </div>
  );
}

// Page file - Next.js requires default export
export default function HomePage() {
  return <HomePageComponent />;
}

// Enable PPR for this page
export const experimental_ppr = true;
```

### Decision Matrix:

| Pattern | SEO | Performance | Dynamic Content | Use Case |
|---------|-----|-------------|-----------------|----------|
| **CSR** | ❌ | ⚠️ | ✅ | User dashboards, admin panels |
| **SSR** | ✅ | ⚠️ | ✅ | Personalized pages, fresh data |
| **SSG** | ✅ | ✅ | ❌ | Marketing pages, blogs |
| **ISR** | ✅ | ✅ | ⚠️ | Product pages, news |
| **PPR** | ✅ | ✅ | ✅ | Complex pages with mixed content |

---

## 🧹 Formatting & Style

- All code must be formatted and linted using **Biome**.
- Use consistent **indentation** (2 spaces).
- Prefer **descriptive variable and function names**.
- Remove unused imports and dead code.
- Follow **accessibility** best practices (`aria-*`, semantic HTML).

---

## 📁 Project Structure

All code should be organized within the `src/` folder with the following structure:

```
src/
├── app/                    # Next.js App Router (pages, layouts, route handlers)
│   ├── favicon.ico         # App favicon
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Home page component
├── assets/                 # Static assets (images, icons, fonts)
├── components/             # Shared/reusable UI components
│   └── button/             # Button component folder
│       ├── button.tsx           # Main component file
│       ├── button.test.tsx      # Component tests
│       └── index.ts             # Barrel export file
├── config/                 # Application configuration and constants
├── contexts/               # React contexts and providers
├── features/               # Feature-specific code (domain-driven)
│   └── [feature-name]/
│       ├── api/           # Feature-specific API calls and endpoints
│       ├── assets/         # Feature-specific assets
│       ├── components/     # Feature-specific components
│       ├── contexts/       # Feature-specific contexts
│       ├── hooks/          # Feature-specific custom hooks
│       ├── lib/           # Feature-specific business logic
│       ├── schemas/        # Feature-specific validation schemas
│       ├── types/         # Feature-specific type definitions
│       ├── utils/         # Feature-specific utilities
│       ├── tests/         # Feature-specific tests
│       └── index.ts       # Feature exports
├── hooks/                 # Shared custom React hooks
├── lib/                   # Shared business logic and configurations
│   └── api-client.ts      # Global API client for making HTTP requests
├── mocks/                 # Mock data and MSW handlers for testing
├── schemas/               # Shared validation schemas (Zod, Yup, etc.)
├── styles/                # Global styles and CSS files
│   └── globals.css        # Global CSS styles
├── utils/                 # Shared utility functions
│   └── cn.ts             # CSS class utility function
├── tests/                 # Global test setup and shared test utilities
│   ├── e2e/               # End-to-end tests
│   │   ├── example.spec.ts     # Example E2E test
│   │   └── setup/              # E2E test setup
│   │       └── auth.setup.ts   # Authentication setup for E2E
│   └── setup/             # Test configuration
│       ├── global-setup.ts     # Global test setup
│       └── setup-test-env.tsx  # Test environment setup
└── types/                 # Global type definitions
    └── reset.d.ts         # CSS reset type definitions
```

### Key Principles:
- **Feature-first organization**: Put feature-specific code inside the respective feature folder
- **Shared vs. Feature-specific**: Only put truly reusable code in shared folders (`components/`, `lib/`, `utils/`)
- **Co-location**: Keep related files close together
- **Barrel exports**: Use `index.ts` files to create clean import paths

### Examples:

```typescript
// ✅ GOOD: Feature-specific component
import { UserProfile } from '@/features/auth/components/user-profile';

// ✅ GOOD: Shared component
import { Button } from '@/components/button';

// ❌ BAD: Feature logic in shared folder
import { validateUser } from '@/lib/validate-user'; // Should be in features/auth/lib/
```

### Component Organization Example:
```
components/
└── button/
    ├── button.tsx       # Main component file
    ├── button.test.tsx  # Component tests
    └── index.ts         # Barrel export file
```

```typescript
// button/index.ts - Barrel export
export { Button } from './button';
export type { ButtonProps } from './button';

// Usage - clean import from barrel file
import { Button } from '@/components/button';
```

### Feature Folder Structure:
Each feature should be self-contained with its own:
- **Components**: Feature-specific UI components
- **Hooks**: Feature-specific custom React hooks
- **Contexts**: Feature-specific React contexts
- **Schemas**: Feature-specific validation schemas
- **Lib**: Business logic and API calls
- **Types**: Feature-specific type definitions
- **Utils**: Feature-specific utility functions
- **Assets**: Images, icons, etc. used only by this feature
- **Tests**: Unit and integration tests for the feature

### Feature Organization Rules:
- **ALWAYS** put feature-specific code inside the feature folder
- **NEVER** put feature logic in shared folders (`lib/`, `utils/`, `components/`)
- **Shared code** should only contain truly reusable logic used by multiple features
- **Each feature** should be completely self-contained and deletable

### Import Path Guidelines:
- Use `@/features/[feature-name]/...` for feature-specific imports
- Use `@/features/[feature-name]/api/...` for feature-specific API calls
- Use `@/components/...` for shared UI components
- Use `@/config/...` for application configuration and constants
- Use `@/hooks/...` for shared custom hooks
- Use `@/contexts/...` for shared React contexts
- Use `@/schemas/...` for shared validation schemas
- Use `@/lib/...` for shared business logic
- Use `@/lib/api-client` for the global API client
- Use `@/mocks/...` for test mocks and MSW handlers
- Use `@/utils/...` for shared utility functions
- Use `@/types/...` for global type definitions
- Use `@/features/[feature-name]/types/...` for feature-specific types

---

## 🧪 Testing

- Use **Vitest** for unit testing and **Playwright** for end-to-end tests.
- Tests must be written for all core business logic and UI components.
- Prefer `describe()` + `it()` syntax for clarity.
- Always mock external APIs and side-effects in unit tests.

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
