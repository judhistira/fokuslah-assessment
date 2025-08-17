# Development Guidelines

## Code Organization

### Feature-Based Structure
- All code is organized by feature in the `features/` directory
- Each feature contains its own API hooks, server routes, and components
- Shared components and utilities are in the root `components/`, `utils/`, and `types/` directories

### Directory Structure
```
features/[feature]/
├── api/           # Frontend API hooks (React Query)
├── server/        # Backend API routes (Hono)
├── components/    # Feature-specific components
├── types/         # Feature-specific TypeScript types
└── index.ts       # Feature exports
```

## Naming Conventions

### Files
- Use kebab-case for file names (e.g., `user-profile.ts`)
- Use `use-` prefix for React hooks (e.g., `use-get-user.ts`)
- Use descriptive names that clearly indicate the file's purpose

### Components
- Use PascalCase for component names (e.g., `UserProfileCard`)
- Components should be named based on their purpose, not their implementation

### Variables and Functions
- Use camelCase for variables and functions
- Use descriptive names that clearly indicate the purpose
- Boolean variables should be prefixed with `is`, `has`, or `should`

## TypeScript Guidelines

### Type Definitions
- Define types in the `types/` directory when shared across features
- Define types in feature `types/` directories when feature-specific
- Use interfaces instead of types when possible
- Export types from index files for easy importing

### Type Safety
- Always specify return types for functions
- Use strict typing for API responses
- Avoid using `any` type unless absolutely necessary

## Component Development

### Props
- Define prop interfaces for all components
- Use destructuring for props in component parameters
- Provide default values for optional props when appropriate

### State Management
- Use React Query for server state management
- Use Zustand or React Context for client state when appropriate
- Keep components as pure as possible

## API Development

### Backend Routes
- Use Hono for API route handlers
- Follow REST conventions where applicable
- Include proper error handling and validation
- Use HTTP status codes appropriately

### Frontend Hooks
- Use React Query for data fetching
- Include proper error handling
- Use appropriate cache times for data
- Follow naming conventions (`useGet*`, `useCreate*`, etc.)

## Testing

### Unit Tests
- Place unit tests in `__tests__/unit/`
- Test pure functions and utilities
- Aim for high test coverage for critical business logic

### Integration Tests
- Place integration tests in `__tests__/integration/`
- Test API endpoints and database interactions
- Test component integration with mock data

## Error Handling

### Client-Side
- Use the error utilities in `utils/error.ts`
- Provide user-friendly error messages
- Handle errors gracefully without crashing the application

### Server-Side
- Use appropriate HTTP status codes
- Provide meaningful error messages
- Log errors for debugging purposes

## Performance

### Data Fetching
- Use React Query for caching and deduplication
- Set appropriate staleTime and cacheTime values
- Use query invalidation to keep data fresh

### Component Optimization
- Use `React.memo()` for expensive components
- Use `useMemo()` and `useCallback()` appropriately
- Avoid unnecessary re-renders

## Documentation

### Code Comments
- Comment complex business logic
- Document public APIs and functions
- Use JSDoc for function documentation

### README Files
- Update README files when adding new features
- Include usage examples for new components
- Document breaking changes

## Git Workflow

### Commits
- Use conventional commit messages
- Keep commits small and focused
- Reference issue numbers when applicable

### Branches
- Use feature branches for new development
- Delete branches after merging
- Use descriptive branch names