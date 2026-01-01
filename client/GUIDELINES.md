# Client Directory Structure Guidelines

To maintain code consistency and organization in the `client` directory, please adhere to the following structure:

## Directory Layout

```
client/src/
├── components/
│   ├── ui/                # Primitive UI components (shadcn/ui, buttons, inputs)
│   │   └── button.tsx
│   ├── layout/            # Layout components (Sidebar, Navbar, MobileNav)
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   ├── features/          # Feature-specific components grouped by domain
│   │   ├── bank/
│   │   │   ├── BankCard.tsx
│   │   │   └── TotalBalanceBox.tsx
│   │   └── home/
│   ├── shared/            # Reusable shared components (composite, not primitive)
│   │   ├── HeaderBox.tsx
│   │   └── DoughnutChart.tsx
│   └── forms/             # Form-specific components
│       └── SignInForm.tsx
├── app/                   # Next.js App Router pages
├── lib/                   # Utilities
├── hooks/                 # Custom React hooks
└── stores/                # Zustand stores
```

## Rules

1.  **Primitives vs Shared**: Use `components/ui` for small, generic primitives (shadcn). Use `components/shared` for larger reusable components.
2.  **Features**: Group components that belong to a specific feature (e.g., banking, transactions) in `components/features/<domain>`.
3.  **Layout**: Place structural components in `components/layout`.
4.  **Barrels**: Use `index.ts` files in these directories to simplify imports if helpful.

## Imports

Preferred import style using aliases:

- `@/components/ui/button`
- `@/components/layout/Sidebar`
- `@/components/features/bank/BankCard`
