# Contributing to Rainbow Relax Widget

Thank you for your interest in contributing to the Rainbow Relax Widget! This guide will help you get started with contributing to our project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Branching Strategy](#branching-strategy)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Development Workflow](#development-workflow)
- [Testing Guidelines](#testing-guidelines)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## 🤝 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## 🌿 Branching Strategy

This project uses a **branching strategy** for development rather than forking. All contributors work directly on the main repository using feature branches.

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

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher
- **Git**: Latest version
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Clone and Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/trevorproject/rainbow-relax.git
   cd rainbow-relax
   ```
2. **Create a new branch** for your Jira ticket:
   ```bash
   git checkout -b MPI-XXX  # Replace XXX with your Jira ticket number
   ```

## 🛠️ Development Setup

### Installation

```bash
# Install dependencies
npm install

# Verify installation
npm run type-check
npm run lint
```

### Development Servers

```bash
# Full application development
npm run dev
# Visit: http://localhost:5173

# Widget development
npm run dev:widget
# Visit: http://localhost:5173/widget-test.html
```

## 📝 Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

- 🐛 **Bug Fixes**: Fix existing issues
- ✨ **New Features**: Add new functionality
- 📚 **Documentation**: Improve guides and examples
- 🧪 **Tests**: Add or improve test coverage
- 🎨 **UI/UX**: Improve design and accessibility
- ⚡ **Performance**: Optimize bundle size and runtime performance
- 🌐 **Internationalization**: Add new languages or improve translations

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

### Issue Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Widget version: [e.g., 1.0.0]

## Additional Context
Any other relevant information
```bash

## 🎯 Areas for Contribution

### High Priority

- **Accessibility improvements**: ARIA labels, keyboard navigation
- **Performance optimization**: Bundle size, memory usage
- **Mobile responsiveness**: Touch interactions, viewport handling
- **Error handling**: Better error messages and recovery

### Medium Priority

- **New breathing techniques**: Different patterns and durations
- **Language support**: Additional translations
- **Customization options**: Themes, colors, sizes
- **Analytics**: Better tracking and reporting

### Low Priority

- **Documentation**: Examples, tutorials, guides
- **Testing**: Additional test coverage
- **Code quality**: Refactoring, optimization
- **Developer experience**: Better tooling, debugging

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Code Review**: Ask for help in PR comments
- **Documentation**: Check the docs folder

## 🙏 Recognition

Contributors will be recognized in:
- README acknowledgments
- Release notes
- GitHub contributors list
- Project documentation

Thank you for contributing to Rainbow Relax Widget! 🎉
