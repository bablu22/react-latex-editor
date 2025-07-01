# Complete Guide: Creating a React NPM Package with Vite and TypeScript

This comprehensive guide will walk you through creating a professional React component library that can be published to npm, complete with TypeScript support, modern build tools, and proper development workflow.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Initialization](#project-initialization)
3. [Project Structure](#project-structure)
4. [Configuration Files](#configuration-files)
5. [Source Code Setup](#source-code-setup)
6. [Build System](#build-system)
7. [Local Development & Testing](#local-development--testing)
8. [Publishing to NPM](#publishing-to-npm)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** for version control
- A code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and npm

Verify your installation:
```bash
node --version  # Should be v18+
npm --version   # Should be 9+
```

## Project Initialization

### Step 1: Create Project Directory

```bash
# Create and navigate to your project directory
mkdir my-react-package
cd my-react-package

# Initialize npm package
npm init -y
```

### Step 2: Install Dependencies

Install all required dependencies:

```bash
# Core React dependencies (as peer dependencies)
npm install --save-dev react react-dom @types/react @types/react-dom

# TypeScript and compilation tools
npm install --save-dev typescript

# Vite and plugins for building
npm install --save-dev vite @vitejs/plugin-react vite-plugin-dts

# Optional: ESLint and Prettier for code quality
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier
```

### Step 3: Understanding Dependency Types

- **dependencies**: Runtime dependencies that users need when they install your package
- **devDependencies**: Development-only dependencies (build tools, testing, etc.)
- **peerDependencies**: Dependencies that the consuming application should provide (React, React-DOM)

## Project Structure

Create this recommended folder structure:

```
my-react-package/
├── .github/                    # GitHub workflows (optional)
│   └── workflows/
│       └── ci.yml
├── src/                        # Source code
│   ├── components/             # React components
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── hooks/                  # Custom hooks (optional)
│   ├── utils/                  # Utility functions (optional)
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts
│   ├── index.ts               # Main entry point
│   └── vite-env.d.ts          # Vite type definitions
├── dist/                       # Built files (generated)
├── examples/                   # Usage examples (optional)
├── docs/                      # Documentation (optional)
├── .eslintrc.js               # ESLint configuration
├── .gitignore                 # Git ignore rules
├── .prettierrc                # Prettier configuration
├── package.json               # Package configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
├── README.md                  # Package documentation
└── LICENSE                    # License file
```

## Configuration Files

### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Declaration generation */
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist",
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": false,
    "jsx": "react-jsx",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.tsx",
    "**/*.test.ts"
  ]
}
```

### Vite Configuration (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      exclude: ['**/*.test.tsx', '**/*.test.ts', '**/examples/**']
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyReactPackage',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
```

### Package.json Configuration

```json
{
  "name": "my-react-package",
  "version": "1.0.0",
  "description": "A React component library built with Vite and TypeScript",
  "type": "module",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js"
    }
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit",
    "prepublishOnly": "npm run type-check && npm run lint && npm run build"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.2.2",
    "vite": "^5.2.0",
    "vite-plugin-dts": "^3.8.1"
  },
  "keywords": [
    "react",
    "component",
    "library",
    "typescript",
    "vite"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/my-react-package.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/my-react-package/issues"
  },
  "homepage": "https://github.com/yourusername/my-react-package#readme"
}
```

### Git Ignore (.gitignore)

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
*.log

# Coverage reports
coverage/

# Package files
*.tgz
```

## Source Code Setup

### Main Entry Point (src/index.ts)

```typescript
// Export all components
export { Button } from './components/Button'
export { Card } from './components/Card'

// Export all hooks
export { useLocalStorage } from './hooks/useLocalStorage'

// Export types
export type { ButtonProps } from './components/Button'
export type { CardProps } from './components/Card'

// Export utilities (if any)
export { formatDate } from './utils'
```

### Component Example (src/components/Button/Button.tsx)

```typescript
import React from 'react'

export interface ButtonProps {
  /**
   * The variant of the button
   */
  variant?: 'primary' | 'secondary' | 'danger'
  /**
   * The size of the button
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Whether the button is disabled
   */
  disabled?: boolean
  /**
   * Whether the button is loading
   */
  loading?: boolean
  /**
   * The button content
   */
  children: React.ReactNode
  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /**
   * Additional CSS class name
   */
  className?: string
  /**
   * Button type
   */
  type?: 'button' | 'submit' | 'reset'
}

/**
 * A customizable button component
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  children,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  }
  
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }
  
  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  )
}
```

### Component Export (src/components/Button/index.ts)

```typescript
export { Button } from './Button'
export type { ButtonProps } from './Button'
```

### Components Index (src/components/index.ts)

```typescript
export * from './Button'
export * from './Card'
// Add more components as you create them
```

### Vite Environment Types (src/vite-env.d.ts)

```typescript
/// <reference types="vite/client" />
```

## Build System

### Building Your Package

```bash
# Build the package
npm run build

# This creates:
# - dist/index.esm.js (ES modules)
# - dist/index.cjs.js (CommonJS)
# - dist/index.d.ts (TypeScript declarations)
# - Source maps for debugging
```

### Understanding Build Outputs

- **ES Modules (ESM)**: Modern JavaScript modules using `import/export`
- **CommonJS (CJS)**: Traditional Node.js modules using `require/module.exports`
- **Type Declarations**: TypeScript `.d.ts` files for type checking
- **Source Maps**: For debugging in development

## Local Development & Testing

### Method 1: Using npm link (Recommended)

```bash
# In your package directory
npm run build
npm link

# Create a test React app
npx create-react-app test-app --template typescript
cd test-app

# Link your package
npm link my-react-package

# Test your components
# Edit src/App.tsx in test-app to import and use your components
```

### Method 2: Using npm pack

```bash
# In your package directory
npm pack

# This creates my-react-package-1.0.0.tgz
# In your test project
npm install /path/to/my-react-package-1.0.0.tgz
```

### Development Workflow

1. Make changes to your package
2. Run `npm run build`
3. Test changes are reflected in linked test app
4. Repeat until satisfied

### Setting up a Development Environment

Create `index.html` in your package root for local development:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Package Development</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/dev.tsx"></script>
  </body>
</html>
```

Create `src/dev.tsx` for testing components:

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Button } from './index'

const App = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Component Development</h1>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Button variant="primary" onClick={() => alert('Primary clicked!')}>
          Primary Button
        </Button>
        <Button variant="secondary" size="large">
          Secondary Button
        </Button>
        <Button variant="danger" loading>
          Loading Button
        </Button>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
```

Run development server:
```bash
npm run dev
```

## Publishing to NPM

### Pre-Publishing Checklist

1. **Version your package**:
   ```bash
   npm version patch  # 1.0.0 -> 1.0.1
   npm version minor  # 1.0.0 -> 1.1.0  
   npm version major  # 1.0.0 -> 2.0.0
   ```

2. **Run quality checks**:
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```

3. **Test the package**:
   ```bash
   npm pack
   # Test the generated .tgz file
   ```

### Publishing Steps

1. **Create npm account**: Sign up at [npmjs.com](https://www.npmjs.com/)

2. **Login to npm**:
   ```bash
   npm login
   ```

3. **Publish your package**:
   ```bash
   npm publish
   
   # For scoped packages (recommended)
   npm publish --access public
   ```

### Scoped Packages (Recommended)

Use scoped packages to avoid naming conflicts:

```json
{
  "name": "@yourusername/my-react-package",
  // ... rest of package.json
}
```

Publish scoped package:
```bash
npm publish --access public
```

### Semantic Versioning

Follow [SemVer](https://semver.org/) principles:

- **Patch** (1.0.1): Bug fixes, no breaking changes
- **Minor** (1.1.0): New features, backwards compatible
- **Major** (2.0.0): Breaking changes

## Best Practices

### Code Organization

1. **Single Responsibility**: Each component should have one clear purpose
2. **Consistent Naming**: Use PascalCase for components, camelCase for props
3. **Export Strategy**: Export everything from main index.ts
4. **Type Safety**: Define interfaces for all props

### Documentation

1. **JSDoc Comments**: Document all public APIs
2. **README.md**: Include installation, usage examples, and API documentation
3. **Examples**: Provide working examples in `/examples` folder
4. **Changelog**: Maintain a CHANGELOG.md for version history

### Performance

1. **Bundle Size**: Keep bundle size small, use peer dependencies
2. **Tree Shaking**: Ensure your package supports tree shaking
3. **Lazy Loading**: Support code splitting where appropriate

### Accessibility

1. **Semantic HTML**: Use appropriate HTML elements
2. **ARIA Labels**: Include accessibility attributes
3. **Keyboard Navigation**: Support keyboard interactions
4. **Focus Management**: Handle focus states properly

### Testing (Optional but Recommended)

Add testing capabilities:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest-environment-jsdom vitest
```

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})
```

### CI/CD with GitHub Actions

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Type check
      run: npm run type-check
    
    - name: Lint
      run: npm run lint
    
    - name: Build
      run: npm run build
```

## Troubleshooting

### Common Issues and Solutions

#### 1. TypeScript Declaration Issues

**Problem**: "Could not find declaration file for module"

**Solution**:
- Ensure `vite-plugin-dts` is installed and configured
- Check that `dist/index.d.ts` is generated after build
- Verify `package.json` has correct `types` field

#### 2. React Hook Errors in Development

**Problem**: "Invalid hook call" when using npm link

**Solution**:
```bash
# Link React from test project to package
cd test-project/node_modules/react
npm link

cd your-package-directory
npm link react
```

#### 3. Bundle Size Issues

**Problem**: Package bundle is too large

**Solution**:
- Move React to peerDependencies
- Check for duplicate dependencies
- Use bundle analyzer to identify large dependencies

#### 4. Import/Export Issues

**Problem**: Components not importing correctly

**Solution**:
- Check your main `src/index.ts` exports
- Ensure consistent export patterns
- Verify build outputs include all necessary files

#### 5. Styling Issues

**Problem**: Styles not applied or conflicting

**Solution**:
- Use CSS-in-JS solutions or CSS modules
- Provide clear documentation about required stylesheets
- Consider using Tailwind CSS or styled-components

### Debugging Tips

1. **Check Build Output**: Always inspect `dist/` folder after building
2. **Test Locally**: Use npm link extensively during development
3. **Version Control**: Use git tags for releases
4. **Monitor Bundle**: Use tools like bundlephobia.com to check bundle size
5. **User Feedback**: Set up GitHub issues for user feedback

## Advanced Topics

### Monorepo Setup

For larger projects, consider using monorepo tools like:
- Lerna
- Nx
- Rush

### Styling Solutions

Consider these styling approaches:
- **CSS Modules**: Scoped CSS
- **Styled Components**: CSS-in-JS
- **Emotion**: CSS-in-JS with better performance
- **Tailwind CSS**: Utility-first CSS framework

### Performance Optimization

1. **Code Splitting**: Split large components
2. **Lazy Loading**: Load components on demand
3. **Bundle Analysis**: Use webpack-bundle-analyzer
4. **Peer Dependencies**: Avoid bundling common libraries

## Conclusion

Creating a professional React npm package involves careful consideration of build tools, TypeScript configuration, and development workflow. This guide provides a solid foundation for building maintainable, distributable React components.

Key takeaways:
- Use modern tools (Vite, TypeScript, npm)
- Follow established conventions
- Test thoroughly before publishing
- Document everything
- Consider your users' experience

With this setup, you'll have a robust foundation for creating and maintaining React component libraries that can be easily shared and consumed by other developers.

## Resources

- [NPM Documentation](https://docs.npmjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Semantic Versioning](https://semver.org/)
- [Open Source Guide](https://opensource.guide/)