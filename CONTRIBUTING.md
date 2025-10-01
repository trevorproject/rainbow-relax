# Contributing

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

## Branching Strategy

All contributors work directly on the main repository using feature branches.

### Branch Naming Convention

We use Jira ticket numbers for branch naming to maintain traceability:

- **Feature branches**: `MPI-XXX` (e.g., `MPI-149`, `MPI-150`)
- **Bug fixes**: `MPI-XXX` (e.g., `MPI-151`, `MPI-152`)
- **Hotfixes**: `MPI-XXX` (e.g., `MPI-153`, `MPI-154`)

Where `MPI-XXX` corresponds to your Jira ticket number.

### Workflow

1. **Create Jira ticket** for the feature/bug/hotfix
2. **Create branch** using the Jira ticket number (e.g., `MPI-149`)
3. **Develop** on the feature branch
4. **Create Pull Request** from feature branch to `main` with Jira ticket reference
5. **Code review** is required before merging
6. **Merge** to `main` after approval
7. `main` branch is always deployable

## Getting Started

```bash
git clone https://github.com/trevorproject/rainbow-relax.git
cd rainbow-relax
git checkout -b MPI-XXX  # Use your Jira ticket number
npm install
npm run dev
```

## Contributing Guidelines

We welcome bug fixes, new features, documentation improvements, tests, UI/UX enhancements, performance optimizations, and internationalization.

### Before You Start

1. **Check existing issues** to see if your idea is already being discussed
2. **Create an issue** for significant changes to discuss the approach
3. **Read the codebase** to understand the architecture
4. **Run tests** to ensure everything is working

## 🔄 Development Workflow

### 1. Create a Branch

```bash
# Update your local repository
git fetch origin
git checkout main
git pull origin main

# Create a new branch using Jira ticket number
git checkout -b MPI-XXX  # Replace XXX with your Jira ticket number
```

### 2. Make Changes

- Write clean, readable code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
npm run test

# Run specific tests
npm run test -- --grep "YourTestName"

# Run E2E tests
npm run test:e2e

# Check code style
npm run lint

# Type check
npm run type-check

# Build widget
npm run build:widget
```bash

### 4. Commit Changes

```bash
# Stage changes
git add .

# Commit with descriptive message and Jira reference
git commit -m "feat(MPI-XXX): add new breathing technique option

- Add 4-4-4 breathing pattern
- Update UI to show new option
- Add tests for new functionality
- Update documentation"
```bash

**Commit Message Format**:
- `feat(MPI-XXX):` New features
- `fix(MPI-XXX):` Bug fixes
- `docs(MPI-XXX):` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Maintenance tasks

### 5. Push and Create PR

```bash
# Push to your branch
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

## 🧪 Testing Guidelines

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows
- **Performance Tests**: Test memory usage and bundle size

### Writing Tests

```typescript
// Example unit test
import { render, screen } from '@testing-library/react';
import { WelcomePage } from '../components/WelcomePage';

describe('WelcomePage', () => {
  it('renders welcome message', () => {
    render(<WelcomePage />);
    expect(screen.getByText('Welcome to Rainbow Relax')).toBeInTheDocument();
  });
});
```bash

### Test Coverage

- Aim for >80% test coverage
- Test both happy path and error cases
- Include accessibility tests
- Test responsive behavior

## 🎨 Code Style

### TypeScript

- Use strict mode
- Define interfaces for all props
- Use type guards where appropriate
- Avoid `any` type

### React

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Follow React best practices

### CSS

- Use Tailwind CSS classes with `rr-` prefix
- Follow mobile-first responsive design
- Use CSS custom properties for theming
- Keep styles scoped to prevent conflicts

### File Organization

- One component per file
- Group related files in folders
- Use descriptive file names
- Keep files under 300 lines when possible

## 📋 Pull Request Process

### Before Submitting

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] TypeScript compilation successful
- [ ] Widget builds successfully

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```bash

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** in different environments
4. **Approval** from at least one maintainer
5. **Merge** after approval

## 🐛 Issue Reporting

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check if it's already fixed** in the latest version
3. **Gather information** about the problem

Thank you for contributing to Rainbow Relax Widget! 🎉
