# ioBroker Weather Warnings Adapter

ioBroker weather warnings adapter written in TypeScript that fetches weather warnings from German (DWD), Austrian (ZAMG), and UWZ weather services and sends notifications via various platforms.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

- **Prerequisites**: Node.js >=20 required (project specifies Node 20+ in package.json)
- **Quick Setup**: 
  - `npm ci` -- installs all dependencies. Takes 3-18 seconds depending on cache. NEVER CANCEL.
- **Build the project**:
  - `npm run build` -- compiles TypeScript with ESBuild. Takes 3-5 seconds. NEVER CANCEL.
- **Type checking**:
  - `npm run check` -- TypeScript type checking without compilation. Takes 5 seconds.
- **Linting**:
  - `npm run lint` -- ESLint with @iobroker/eslint-config. Takes 6-9 seconds. NEVER CANCEL.

## Testing

- **Package validation**: `npm run test:package` -- validates package.json and io-package.json. Takes 15ms.
- **Integration tests**: `npm run test:integration` -- full ioBroker adapter testing with simulated environment. Takes 4 minutes. NEVER CANCEL. Set timeout to 10+ minutes.
- **Unit tests**: `npm run test:ts` -- currently broken due to missing dependencies. Install `chai-as-promised` and `sinon-chai` first if needed.
- **Full test suite**: `npm run test` -- runs both unit and package tests. Currently fails due to unit test issues.

## Validation

- Always run `npm run build` after making TypeScript changes.
- Always run `npm run lint` before committing changes to pass CI.
- Always run `npm run check` to validate TypeScript without compilation.
- For testing changes, prefer `npm run test:package` and `npm run test:integration` as they are reliable.
- Integration tests take 4 minutes but thoroughly test the adapter in a simulated ioBroker environment.

## Common Tasks

The following are outputs from frequently run commands. Reference them instead of viewing, searching, or running bash commands to save time.

### Repository Root Directory Listing
```
.create-adapter.json         # ioBroker adapter creation config
.eslintrc.js.bck            # ESLint backup config
.github/                    # GitHub workflows and templates
.gitignore                  # Git ignore rules
.releaseconfig.json         # Release configuration
.vscode/                    # VS Code settings
LICENSE                     # MIT license
README.md                   # Main documentation (English)
README_DE.md               # German documentation (often more current)
admin/                     # Admin interface files (icons, i18n, config)
build/                     # Compiled TypeScript output (generated)
eslint.config.mjs          # ESLint configuration
img/                       # Documentation images
io-package.json            # ioBroker adapter metadata
node_modules/              # NPM dependencies (after npm ci)
package-lock.json          # NPM lockfile
package.json               # NPM configuration
prettier.config.mjs        # Prettier formatting config
src/                       # TypeScript source code
test/                      # Test files
tsconfig.build.json        # Production TypeScript config
tsconfig.json              # Development TypeScript config
```

### Building and Development
- `npm run build` -- main build command, very fast (3 seconds)
- `npm run watch` -- watch mode for development
- `npm run prebuild` -- cleans build directory with rimraf

### Code Quality
- `npm run lint` -- ESLint checking (6 seconds)
- `npm run check` -- TypeScript type checking only
- `npm run coverage` -- test coverage with nyc (if unit tests work)

### Package Management  
- `npm run translate` -- translation management for ioBroker
- `npm run release` -- automated release script

## Important File Locations

### Source Code
- `/src/main.ts` -- main adapter entry point, extends ioBroker utils.Adapter
- `/src/lib/` -- core library files for weather services and notifications
- `/src/lib/provider.js` -- weather service providers (DWD, ZAMG, UWZ)
- `/src/lib/notification.js` -- notification services (Telegram, Email, etc.)

### Configuration
- `/package.json` -- npm configuration, scripts, and dependencies
- `/io-package.json` -- ioBroker adapter metadata and configuration
- `/tsconfig.json` -- TypeScript configuration for development
- `/tsconfig.build.json` -- specialized TypeScript config for compilation
- `/eslint.config.mjs` -- ESLint configuration using @iobroker/eslint-config

### Build and Output
- `/build/` -- compiled JavaScript output (created by build process)
- `/admin/` -- adapter admin interface files
- `/test/` -- test files (integration and package validation)

### Documentation
- `/README.md` -- main documentation (English)
- `/README_DE.md` -- German documentation (usually more current per README)

## Project Structure Reference

```
├── src/                    # TypeScript source code
│   ├── main.ts            # Main adapter entry point  
│   └── lib/               # Core library modules
├── admin/                 # Admin interface files
├── build/                 # Compiled output (generated)
├── test/                  # Test files
│   ├── integration.js     # Integration tests (4min runtime)
│   └── package.js         # Package validation (15ms)
├── .github/               # GitHub workflows and templates
├── package.json           # NPM configuration
├── io-package.json        # ioBroker adapter metadata
└── tsconfig*.json         # TypeScript configurations
```

## Timing Expectations and Timeouts

- **npm ci**: 3-18 seconds (depends on cache) -- NEVER CANCEL
- **npm run build**: 3-5 seconds -- NEVER CANCEL  
- **npm run lint**: 6-9 seconds -- NEVER CANCEL
- **npm run check**: 5 seconds
- **npm run test:package**: 15ms
- **npm run test:integration**: 4 minutes -- NEVER CANCEL, set timeout to 10+ minutes

## Known Issues and Workarounds

- **Unit tests broken**: `npm run test:ts` fails due to missing dependencies `chai-as-promised` and `sinon-chai`. Install manually if needed: `npm install --save-dev chai-as-promised sinon-chai`
- **Integration tests are reliable**: Use `npm run test:integration` for thorough testing instead of unit tests
- **Package tests always work**: Use `npm run test:package` for quick validation

## CI/CD Pipeline

- **GitHub Actions**: `.github/workflows/test-and-release.yml`
- **Test matrix**: Node.js 20.x, 22.x, 24.x on Ubuntu, Windows, macOS
- **Required checks**: ESLint, TypeScript compilation, package validation, adapter tests
- **Auto-deploy**: Triggered on version tags to NPM

## Adapter-Specific Notes

- This is an **ioBroker adapter**, not a standalone application
- It fetches weather warnings from German/Austrian weather services
- Supports multiple notification services (Telegram, Pushover, Email, Alexa, etc.)
- Runs within the ioBroker home automation platform ecosystem
- Integration tests simulate a complete ioBroker environment
- Admin interface allows configuration of weather services and notification settings

## Development Workflow

1. Install dependencies: `npm ci`
2. Make changes to TypeScript files in `/src/`
3. Build: `npm run build`
4. Check types: `npm run check`  
5. Lint: `npm run lint`
6. Test: `npm run test:package && npm run test:integration`
7. Commit changes

Always ensure the CI pipeline requirements are met by running build, lint, and tests before committing.