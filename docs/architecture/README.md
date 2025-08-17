# Architecture Documentation

## Project Structure

```
fokuslah/
├── app/                 # Next.js App Router pages
├── components/          # Shared UI components
│   ├── common/          # Reusable components
│   ├── layout/          # Layout components
│   └── ui/              # Primitive UI components
├── constants/           # Application constants
├── docs/                # Documentation
├── features/            # Feature modules
│   ├── [feature]/       # Individual feature
│   │   ├── api/         # Frontend API hooks
│   │   ├── components/  # Feature-specific components
│   │   ├── server/      # Backend API routes
│   │   └── types/       # Feature-specific types
├── lib/                 # Core library functions
├── prisma/              # Database schema and migrations
├── providers/           # React context providers
├── public/              # Static assets
├── types/               # Shared TypeScript types
├── utils/               # Utility functions
└── __tests__/           # Test files
    ├── unit/            # Unit tests
    └── integration/     # Integration tests
```

## Feature Structure

Each feature follows a consistent structure:

```
features/[feature]/
├── api/                 # Frontend API hooks
│   ├── use-get-*.ts     # Query hooks
│   └── use-*.ts         # Mutation hooks
├── components/          # Feature-specific components
├── server/              # Backend API routes
│   └── route.ts         # Hono route handlers
├── types/               # Feature-specific types
└── index.ts             # Feature exports
```