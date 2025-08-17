# Quick Start Guide

## 🚀 Fast Setup for Experienced Developers

If you're already familiar with the stack and want to get started quickly:

### 1. Clone and Install
```bash
git clone [repository-url]
cd fokuslah
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env.local
# Update database credentials and other config
```

### 3. Database Setup
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed  # Optional: seed with sample data
```

### 4. Start Development
```bash
npm run dev
```

## 🏗️ Project Architecture at a Glance

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Hono API routes with RPC-style endpoints
- **Database**: PostgreSQL with Prisma ORM
- **State Management**: React Query for server state, Zustand for client state
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with component library

## 📁 Key Directories

```
features/           # Feature modules (main work area)
├── lessons/        # Math lessons and problems
├── profile/        # User profiles and stats
└── accounts/       # Authentication and user management

components/         # Shared UI components
├── common/         # Reusable components
└── layout/         # Layout components

app/                # Next.js pages and routes
lib/                # Core utilities and services
types/              # Shared TypeScript types
```

## 🔄 Development Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
npm run test        # Run tests
npm run test:watch  # Run tests in watch mode
```

## 🔧 Key APIs

- **GET** `/api/lessons` - List all lessons
- **GET** `/api/lessons/:id` - Get lesson details
- **POST** `/api/lessons/:id/submit` - Submit answers
- **GET** `/api/profile` - Get user profile

## 🎯 First Tasks to Try

1. **Explore the codebase**: Look at `features/lessons/` to understand the pattern
2. **Run existing tests**: `npm run test`
3. **Make a small change**: Update a component or add a simple feature
4. **Submit a PR**: Follow our conventional commit guidelines

## 📚 Need Help?

- Check the [Onboarding Guide](./onboarding-guide.md) for detailed information
- Review existing features to understand patterns
- Ask questions in #fokuslah-dev Slack channel

Happy coding! 🚀