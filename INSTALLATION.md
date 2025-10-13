# Installation Guide - npm vs pnpm

## Choose Your Package Manager

This project supports both **npm** and **pnpm**. Choose based on your preference:

| Feature | npm | pnpm |
|---------|-----|------|
| Speed | Standard | 2-3x faster |
| Disk Space | Standard | 50% less |
| Installation | Built-in with Node.js | Requires separate install |
| Compatibility | 100% | 99%+ |

**Recommendation**: Use **pnpm** for faster installs and better disk space efficiency.

---

## Option 1: Installation with npm (Default)

### Prerequisites
```bash
# Verify Node.js and npm are installed
node --version   # Should be 18.0.0 or higher
npm --version    # Should be 9.0.0 or higher
```

### Step-by-Step Installation

#### 1. Clone Repository
```bash
git clone <your-repo-url>
cd PathForwardMyanmar
```

#### 2. Install Backend Dependencies
```bash
cd server
npm install
```

Expected output:
```
added 150 packages in 2m
```

#### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

Expected output:
```
added 350 packages in 3m
```

#### 4. Setup Environment Files
```bash
# Backend
cd ../server
cp .env.example .env
# Edit .env with your database credentials

# Frontend
cd ../client
cp .env.example .env.local
```

#### 5. Setup Database
```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE pathforward_myanmar;
\q

# Run migration
cd ../server
npm run migrate
```

#### 6. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

#### 7. Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## Option 2: Installation with pnpm (Recommended)

### Prerequisites

#### Install pnpm
```bash
# Using npm (recommended)
npm install -g pnpm

# Or using standalone script (Windows)
iwr https://get.pnpm.io/install.ps1 -useb | iex

# Or using standalone script (Mac/Linux)
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Verify installation
pnpm --version   # Should be 8.0.0 or higher
```

### Step-by-Step Installation

#### 1. Clone Repository
```bash
git clone <your-repo-url>
cd PathForwardMyanmar
```

#### 2. Install Backend Dependencies
```bash
cd server
pnpm install
```

Expected output:
```
Packages: +150
Progress: resolved 150, reused 150, downloaded 0, added 150, done
Done in 45s
```

#### 3. Install Frontend Dependencies
```bash
cd ../client
pnpm install
```

Expected output:
```
Packages: +350
Progress: resolved 350, reused 350, downloaded 0, added 350, done
Done in 1m
```

#### 4. Setup Environment Files
```bash
# Backend
cd ../server
cp .env.example .env
# Edit .env with your database credentials

# Frontend
cd ../client
cp .env.example .env.local
```

#### 5. Setup Database
```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE pathforward_myanmar;
\q

# Run migration
cd ../server
pnpm migrate
```

#### 6. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
pnpm dev
```

**Terminal 2 - Frontend:**
```bash
cd client
pnpm dev
```

#### 7. Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## Command Comparison

| Task | npm | pnpm |
|------|-----|------|
| Install all dependencies | `npm install` | `pnpm install` |
| Install specific package | `npm install <pkg>` | `pnpm add <pkg>` |
| Install dev dependency | `npm install -D <pkg>` | `pnpm add -D <pkg>` |
| Uninstall package | `npm uninstall <pkg>` | `pnpm remove <pkg>` |
| Run script | `npm run <script>` | `pnpm <script>` |
| Update dependencies | `npm update` | `pnpm update` |
| Clear cache | `npm cache clean --force` | `pnpm store prune` |

---

## Project-Specific Scripts

### Backend Scripts

#### Using npm:
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run migrate  # Run database migration
```

#### Using pnpm:
```bash
pnpm dev         # Start development server with nodemon
pnpm start       # Start production server
pnpm migrate     # Run database migration
```

### Frontend Scripts

#### Using npm:
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

#### Using pnpm:
```bash
pnpm dev         # Start development server
pnpm build       # Build for production
pnpm start       # Start production server
pnpm lint        # Run ESLint
```

---

## Adding New Dependencies

### Backend Example

#### Using npm:
```bash
cd server

# Production dependency
npm install express-rate-limit

# Development dependency
npm install -D jest
```

#### Using pnpm:
```bash
cd server

# Production dependency
pnpm add express-rate-limit

# Development dependency
pnpm add -D jest
```

### Frontend Example

#### Using npm:
```bash
cd client

# Production dependency
npm install @tanstack/react-query

# Development dependency
npm install -D @testing-library/react
```

#### Using pnpm:
```bash
cd client

# Production dependency
pnpm add @tanstack/react-query

# Development dependency
pnpm add -D @testing-library/react
```

---

## Switching Between npm and pnpm

### From npm to pnpm

```bash
# Backend
cd server
rm -rf node_modules package-lock.json
pnpm install

# Frontend
cd ../client
rm -rf node_modules package-lock.json
pnpm install
```

### From pnpm to npm

```bash
# Backend
cd server
rm -rf node_modules pnpm-lock.yaml
npm install

# Frontend
cd ../client
rm -rf node_modules pnpm-lock.yaml
npm install
```

---

## CI/CD Integration

### GitHub Actions - npm

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
```

### GitHub Actions - pnpm

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
```

---

## Troubleshooting

### npm Issues

#### Problem: "EACCES: permission denied"
```bash
# Solution: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

#### Problem: "Cannot find module"
```bash
# Solution: Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Problem: "Peer dependency conflict"
```bash
# Solution: Use legacy peer deps
npm install --legacy-peer-deps
```

### pnpm Issues

#### Problem: "Command not found: pnpm"
```bash
# Solution: Reinstall pnpm
npm install -g pnpm
# Or add to PATH if installed via script
```

#### Problem: "Store corruption detected"
```bash
# Solution: Prune and reinstall
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Problem: "Peer dependency not installed"
```bash
# Solution: Use strict-peer-dependencies
pnpm install --strict-peer-dependencies=false
```

---

## Performance Comparison

### Installation Time (Cold Cache)
| Project | npm | pnpm |
|---------|-----|------|
| Backend | ~2-3 min | ~45 sec |
| Frontend | ~3-5 min | ~1 min |
| **Total** | **~5-8 min** | **~2 min** |

### Disk Space Usage
| Project | npm | pnpm |
|---------|-----|------|
| Backend | ~150 MB | ~80 MB |
| Frontend | ~400 MB | ~200 MB |
| **Total** | **~550 MB** | **~280 MB** |

### Re-installation Time (Warm Cache)
| Project | npm | pnpm |
|---------|-----|------|
| Backend | ~1 min | ~15 sec |
| Frontend | ~2 min | ~30 sec |
| **Total** | **~3 min** | **~45 sec** |

---

## Best Practices

### Using npm
1. ✅ Keep package-lock.json in version control
2. ✅ Use `npm ci` in CI/CD (faster, reliable)
3. ✅ Run `npm audit` regularly for security
4. ✅ Use `npm outdated` to check for updates

### Using pnpm
1. ✅ Keep pnpm-lock.yaml in version control
2. ✅ Use `pnpm install --frozen-lockfile` in CI/CD
3. ✅ Run `pnpm audit` regularly for security
4. ✅ Use `pnpm outdated` to check for updates
5. ✅ Use `pnpm store prune` to clean old packages

---

## Team Recommendations

### Consistency
- **Choose one package manager** for the entire team
- Update the README.md with the chosen package manager
- Add the lock file (package-lock.json or pnpm-lock.yaml) to git

### For Small Teams (1-3 people)
- Either npm or pnpm works fine
- npm is easier if everyone is familiar with it

### For Larger Teams (4+ people)
- pnpm recommended for better performance
- Saves time and disk space across multiple developers
- Better for monorepos (if project grows)

---

## Verification

After installation with either package manager:

### Check Backend
```bash
cd server
node --version    # Should show v18+
ls node_modules   # Should see many folders
npm list --depth=0  # or: pnpm list --depth=0
```

### Check Frontend
```bash
cd client
node --version    # Should show v18+
ls node_modules   # Should see many folders
npm list --depth=0  # or: pnpm list --depth=0
```

### Test Running
```bash
# Backend should start on port 5000
cd server
npm run dev  # or: pnpm dev

# Frontend should start on port 3000
cd client
npm run dev  # or: pnpm dev
```

---

## Summary

✅ **Use npm if:**
- You're new to Node.js
- You want maximum compatibility
- You don't have disk space concerns
- Your team is familiar with npm

✅ **Use pnpm if:**
- You want faster installations
- You want to save disk space
- You work with multiple Node.js projects
- You want better dependency management

**Both work perfectly with this project!** Choose what's best for your team.

---

## Quick Reference

### npm Commands
```bash
npm install              # Install dependencies
npm run dev              # Run development server
npm run build            # Build for production
npm test                 # Run tests
npm audit                # Security check
npm update               # Update dependencies
```

### pnpm Commands
```bash
pnpm install             # Install dependencies
pnpm dev                 # Run development server
pnpm build               # Build for production
pnpm test                # Run tests
pnpm audit               # Security check
pnpm update              # Update dependencies
pnpm store prune         # Clean cache
```

---

**Need Help?** Check [SETUP_GUIDE.md](SETUP_GUIDE.md) or [QUICKSTART.md](QUICKSTART.md)

**Last Updated**: 2024-01-01
