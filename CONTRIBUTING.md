# Contributing to @rumenx/sitemap

Thank you for your interest in contributing to @rumenx/sitemap! We welcome contributions from the community and are pleased to have you join us.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment
4. Create a new branch for your changes
5. Make your changes
6. Test your changes
7. Submit a pull request

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn package manager
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/npm-sitemap.git
cd npm-sitemap

# Install dependencies
npm install

# Run tests to ensure everything is working
npm test

# Build the project
npm run build
```

### Available Scripts

```bash
# Development
npm run dev          # Watch mode for TypeScript compilation
npm run build        # Build the project (ESM, CJS, and types)
npm run clean        # Clean build artifacts

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run typecheck    # Run TypeScript type checking
```

## Making Changes

### Branch Naming Convention

- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation changes
- `refactor/description` - for code refactoring
- `test/description` - for test improvements

### Commit Message Guidelines

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

```
type(scope): description

feat(sitemap): add support for video sitemaps
fix(validator): resolve URL validation edge case
docs(readme): update installation instructions
test(utils): add tests for XML escaping
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

## Testing

We maintain high test coverage (97%+) and all contributions should include appropriate tests.

### Writing Tests

- Place tests in the `tests/` directory
- Use descriptive test names
- Follow the existing test structure and patterns
- Test both success and error cases
- Include edge cases

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test tests/unit/Sitemap.test.ts

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch
```

## Submitting Changes

### Pull Request Process

1. Ensure your code follows our coding standards
2. Update documentation if needed
3. Add tests for new functionality
4. Ensure all tests pass
5. Update CHANGELOG.md with your changes
6. Submit a pull request with a clear description

### Pull Request Template

When submitting a pull request, please include:

- **Description**: What does this PR do?
- **Motivation**: Why is this change needed?
- **Testing**: How was this tested?
- **Breaking Changes**: Are there any breaking changes?
- **Screenshots**: If applicable, add screenshots

### Review Process

- All PRs require at least one review from a maintainer
- Automated tests must pass
- Code coverage should not decrease
- Documentation should be updated if needed

## Coding Standards

### TypeScript Guidelines

- Use strict TypeScript configuration
- Provide proper type annotations
- Avoid `any` types when possible
- Use interfaces for object types
- Follow naming conventions:
  - PascalCase for classes and interfaces
  - camelCase for variables and functions
  - UPPER_CASE for constants

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check formatting
npm run format:check

# Auto-fix formatting issues
npm run format

# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Documentation

- Use JSDoc comments for public APIs
- Keep README.md up to date
- Include code examples in documentation
- Update CHANGELOG.md for notable changes

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- Node.js version
- Package version
- Operating system
- Steps to reproduce
- Expected behavior
- Actual behavior
- Code examples (if applicable)

### Feature Requests

When requesting features, please include:

- Use case description
- Proposed API (if applicable)
- Examples of how it would be used
- Alternatives considered

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed

## Development Tips

### Performance Considerations

- Consider memory usage for large sitemaps
- Optimize string concatenation for XML generation
- Use streaming when possible for large datasets

### Compatibility

- Maintain Node.js >= 18.0.0 compatibility
- Ensure TypeScript compatibility
- Support both ESM and CJS module systems

### Security

- Validate all user inputs
- Sanitize data before XML generation
- Follow security best practices

## Questions?

If you have questions about contributing, please:

1. Check existing issues and discussions
2. Join our community discussions
3. Reach out to maintainers

Thank you for contributing to @rumenx/sitemap! 🎉
