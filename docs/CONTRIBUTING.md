# Contributing Guidelines

Thank you for your interest in contributing to the AI Personal Health Coach! This document provides guidelines for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what's best for the community

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing others' private information
- Other unprofessional conduct

---

## Getting Started

### Prerequisites

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/your-username/ai-health-coach.git
   cd ai-health-coach
   ```
3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original/ai-health-coach.git
   ```
4. **Install dependencies**
   ```bash
   npm install
   ```
5. **Configure environment**
   ```bash
   cp .env.example .env
   # Add your Gemini API key
   ```

### Development Setup

1. **Start development server**
   ```bash
   npm run dev
   ```
2. **Open browser** to `http://localhost:5173`
3. **Make changes** and see them live reload

---

## Development Workflow

### 1. Create a Branch

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 2. Make Changes

- Write clean, readable code
- Follow coding standards (see below)
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Build to check for errors
npm run build

# Test manually in browser
npm run dev
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature"
```

See [Commit Guidelines](#commit-guidelines) below.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

1. Go to GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in PR template
5. Submit for review

---

## Coding Standards

### JavaScript/React

#### File Organization

```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { ExternalLibrary } from 'library';
import { localService } from '../services/service';

// 2. Constants
const CONSTANT_VALUE = 'value';

// 3. Component
const MyComponent = () => {
  // 3a. State
  const [state, setState] = useState(initial);
  
  // 3b. Effects
  useEffect(() => {
    // effect logic
  }, [dependencies]);
  
  // 3c. Event handlers
  const handleClick = () => {
    // handler logic
  };
  
  // 3d. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 4. Export
export default MyComponent;
```

#### Naming Conventions

```javascript
// Components: PascalCase
const MyComponent = () => { };

// Functions: camelCase
const handleClick = () => { };

// Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;

// Files: PascalCase for components, camelCase for utilities
// MyComponent.jsx
// stepCounter.js
```

#### React Best Practices

```javascript
// ✅ Good - Destructure props
const MyComponent = ({ title, onClick }) => { };

// ❌ Bad - Use props object
const MyComponent = (props) => {
  return <div>{props.title}</div>;
};

// ✅ Good - Use functional components
const MyComponent = () => { };

// ❌ Bad - Use class components (unless necessary)
class MyComponent extends React.Component { }

// ✅ Good - Use hooks
const [state, setState] = useState(0);

// ✅ Good - Meaningful variable names
const [isLoading, setIsLoading] = useState(false);

// ❌ Bad - Unclear names
const [flag, setFlag] = useState(false);
```

### CSS/TailwindCSS

```jsx
// ✅ Good - Use Tailwind utilities
<div className="flex items-center gap-4 p-6 rounded-lg bg-white/10">

// ✅ Good - Group related classes
<div className="
  flex items-center gap-4
  p-6 rounded-lg
  bg-white/10 backdrop-blur-md
  border border-white/20
">

// ❌ Bad - Inline styles (use only when necessary)
<div style={{ padding: '24px' }}>
```

### Comments

```javascript
// ✅ Good - Explain WHY, not WHAT
// Use debounce to prevent excessive API calls
const debouncedSearch = debounce(search, 300);

// ❌ Bad - Obvious comments
// Set loading to true
setLoading(true);

// ✅ Good - Document complex logic
/**
 * Calculates completion percentage based on completed items
 * @param {Object} progress - Progress object with date keys
 * @returns {number} Percentage from 0-100
 */
const calculateProgress = (progress) => { };
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(habits): add custom habit creation"

# Bug fix
git commit -m "fix(dashboard): correct step counter reset logic"

# Documentation
git commit -m "docs(api): update Gemini AI integration guide"

# Refactor
git commit -m "refactor(diet): extract meal card component"

# Multiple lines
git commit -m "feat(workout): add exercise filtering

- Add filter by muscle group
- Add filter by difficulty
- Update UI with filter controls"
```

### Commit Best Practices

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Keep first line under 72 characters
- Reference issues in footer (`Fixes #123`)

---

## Pull Request Process

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
How has this been tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested locally
```

### Review Process

1. **Automated Checks**
   - Linting passes
   - Build succeeds
   - No merge conflicts

2. **Code Review**
   - At least one approval required
   - Address all comments
   - Make requested changes

3. **Merge**
   - Squash and merge (for clean history)
   - Delete branch after merge

---

## Testing

### Manual Testing

Before submitting PR, test:

1. **Core Functionality**
   - All features work as expected
   - No console errors
   - No broken links

2. **Browser Compatibility**
   - Chrome
   - Firefox
   - Safari
   - Edge

3. **Responsive Design**
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)

4. **Data Persistence**
   - LocalStorage saves correctly
   - Data persists after refresh
   - No data corruption

### Future: Automated Testing

```javascript
// Unit tests (to be added)
describe('StepCounter', () => {
  test('increments step count', () => {
    stepCounter.setSteps(100);
    expect(stepCounter.getSteps()).toBe(100);
  });
});

// Integration tests (to be added)
describe('Dashboard', () => {
  test('renders health metrics', () => {
    render(<Dashboard />);
    expect(screen.getByText('Steps')).toBeInTheDocument();
  });
});
```

---

## Feature Requests

### Proposing New Features

1. **Check existing issues** - Avoid duplicates
2. **Open an issue** with:
   - Clear description
   - Use cases
   - Proposed implementation
   - Mockups (if UI change)
3. **Discuss** with maintainers
4. **Get approval** before starting work

### Feature Template

```markdown
## Feature Description
What feature do you want to add?

## Problem It Solves
What problem does this solve?

## Proposed Solution
How would you implement this?

## Alternatives Considered
What other approaches did you consider?

## Additional Context
Screenshots, mockups, examples
```

---

## Bug Reports

### Reporting Bugs

1. **Search existing issues** - Check if already reported
2. **Create new issue** with:
   - Clear title
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots
   - Environment details

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen?

## Actual Behavior
What actually happens?

## Screenshots
Add screenshots if applicable

## Environment
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]
```

---

## Documentation

### Updating Documentation

When making changes, update relevant documentation:

- **README.md** - Project overview
- **SETUP.md** - Installation steps
- **API.md** - Service changes
- **COMPONENTS.md** - Component changes
- **USER_GUIDE.md** - User-facing features
- **ARCHITECTURE.md** - System design changes

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep formatting consistent
- Update table of contents

---

## Questions?

- **General questions**: Open a discussion on GitHub
- **Bug reports**: Open an issue
- **Feature requests**: Open an issue
- **Security issues**: Email maintainers directly

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing! 🎉**
