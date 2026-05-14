# DevFlow — CI/CD Demo Website

A complete website project wired for **GitHub Actions** CI/CD.  
Push to `main` and watch lint → test → build → deploy run automatically.

## Project Structure

```
mywebsite/
├── index.html                    # Main HTML page
├── src/
│   ├── css/style.css             # Stylesheet
│   └── js/main.js                # JavaScript (utility functions + UI)
├── tests/
│   └── app.test.js               # Test suite (plain Node.js)
├── .github/
│   └── workflows/
│       └── ci.yml                # GitHub Actions pipeline
├── .eslintrc.json                # ESLint config
├── package.json
└── .gitignore
```

## Quick Start

```bash
# 1. Clone your repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# 2. Install dependencies
npm install

# 3. Run lint
npm run lint

# 4. Run tests
npm test

# 5. Build
npm run build

# 6. View locally
npx serve .
```

## CI/CD Pipeline

| Stage  | Trigger         | Command        | What it does                        |
|--------|-----------------|----------------|-------------------------------------|
| Lint   | every push / PR | `npm run lint` | ESLint checks `src/js/main.js`      |
| Test   | after lint      | `npm test`     | Runs `tests/app.test.js`            |
| Build  | after tests     | `npm run build`| Copies files to `dist/`             |
| Deploy | push to `main`  | custom         | Deploys `dist/` to your test server |

## Customising the Deploy Step

Open `.github/workflows/ci.yml` and replace the `echo` commands in the **Deploy** job with your real deploy command:

```yaml
# Deploy to a VPS via SSH/SCP
- uses: appleboy/scp-action@master
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    source: "dist/"
    target: "/var/www/html"

# OR deploy to Netlify
- uses: nwtgck/actions-netlify@v2
  with:
    publish-dir: './dist'
    production-branch: main
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Adding Tests

Add new test cases to `tests/app.test.js`:

```js
test('your test description', () => {
  assert(yourFunction('input') === 'expected output');
});
```

The pipeline will pick them up automatically on the next push.
