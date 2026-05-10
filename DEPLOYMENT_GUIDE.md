# GitHub Pages Deployment Guide - Wings Global School

## Problem Analysis

Your React (Vite) website was showing a blank page on GitHub Pages because of:

1. **Missing `base` path** in `vite.config.js` - Vite didn't know the app is hosted at `/The-Wings-Global-School/`
2. **Missing `homepage`** in `package.json` - Required for correct asset path resolution
3. **BrowserRouter without `basename`** - Routes weren't matching the subdirectory path
4. **Missing deploy script** - No automated way to push to gh-pages branch

## Fixes Applied ✅

### 1. vite.config.js
```javascript
export default defineConfig({
  base: '/The-Wings-Global-School/',  // Added base path
  // ... rest of config
})
```

### 2. package.json
```json
{
  "homepage": "https://lab942004.github.io/The-Wings-Global-School/",
  "scripts": {
    "deploy": "npm run build && npx gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.1.1"  // Added gh-pages package
  }
}
```

### 3. src/App.jsx
```javascript
// Added basename for React Router
const basename = '/The-Wings-Global-School'

function App() {
  return (
    <Router basename={basename}>
      {/* routes */}
    </Router>
  )
}
```

## Deployment Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build for Production
```bash
npm run build
```

This creates a `dist/` folder with all assets properly prefixed with `/The-Wings-Global-School/`.

### Step 3: Deploy to GitHub Pages
```bash
npm run deploy
```

This command:
1. Builds the project
2. Uses `gh-pages` to push the `dist/` folder to the `gh-pages` branch
3. GitHub Pages automatically serves from this branch

### Step 4: Verify GitHub Pages Settings

1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Ensure **Source** is set to:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
4. Click **Save**

## Debugging Steps (Using Browser Console)

If you still see issues, follow these steps:

### 1. Open Browser Developer Tools
- Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Go to the **Console** tab

### 2. Check for Common Errors

#### Error: "Failed to load resource: net::ERR_ABORTED 404"
**Cause**: Assets (JS/CSS) not found
**Fix**: Verify `base` path in vite.config.js matches your repo name

#### Error: "Uncaught Error: You are calling basename on a router that has not been passed a basename"
**Cause**: Router basename not set correctly
**Fix**: Ensure `basename` is passed to `<Router>` in App.jsx

#### Error: Blank page with no console errors
**Cause**: JavaScript bundle failed to load
**Fix**: Check Network tab for 404 errors on JS files

### 3. Check Network Tab
- In DevTools, go to **Network** tab
- Refresh the page (`Ctrl+R` or `F5`)
- Look for any requests with status `404` or `403`
- Check if `index.html`, JS bundles, and CSS files are loading

### 4. Verify Asset Paths
Open the page source (`Ctrl+U` or `Cmd+U`) and check:
```html
<!-- Should see paths like: -->
<script type="module" crossorigin src="/The-Wings-Global-School/assets/index-xxxx.js"></script>
<link rel="stylesheet" href="/The-Wings-Global-School/assets/index-xxxx.css">
```

## Final Checklist Before Deploying

- [ ] `vite.config.js` has `base: '/The-Wings-Global-School/'`
- [ ] `package.json` has `homepage` set to your GitHub Pages URL
- [ ] `package.json` has `deploy` script
- [ ] `gh-pages` is installed as dev dependency
- [ ] `App.jsx` has `basename` set in Router
- [ ] You've run `npm run build` successfully
- [ ] GitHub Pages is configured to use `gh-pages` branch

## Testing Locally Before Deploy

To test the production build locally:

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

The preview will show the app as it would appear on GitHub Pages (but at `localhost:4173/The-Wings-Global-School/`).

## Troubleshooting

### Issue: Assets loading from wrong path
**Solution**: Clear browser cache or do a hard refresh (`Ctrl+Shift+R`)

### Issue: Router not working after deploy
**Solution**: Ensure `basename` matches the repo name exactly (case-sensitive)

### Issue: 404 on page refresh
**Solution**: This is expected with GitHub Pages + BrowserRouter. Consider using HashRouter as alternative:
```javascript
import { HashRouter as Router } from 'react-router-dom'
// No basename needed with HashRouter
```

### Issue: gh-pages command not found
**Solution**: Install gh-pages globally or use npx:
```bash
npm install --save-dev gh-pages
# or
npx gh-pages -d dist
```

## Support

If you're still experiencing issues:
1. Check the browser console for specific errors
2. Verify all configuration files match the examples above
3. Try clearing GitHub's cache by adding a query string to your URL (e.g., `?v=2`)

---

**Note**: After making these changes, it may take 1-2 minutes for GitHub Pages to update.