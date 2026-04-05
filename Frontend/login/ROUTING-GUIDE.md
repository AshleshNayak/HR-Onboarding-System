# Quick Setup Guide

## Option 1: Automated (Recommended)

```bash
cd Frontend/login
node create-all-files.js
npm install
npm run dev
```

## Option 2: If PowerShell is available

Install PowerShell 7+:

```powershell
winget install --id Microsoft.Powershell --source winget
```

Then rerun the GitHub Copilot CLI commands.

## What's Already Done ✅

### 1. package.json

Added: `"react-router-dom": "^6.28.0"`

### 2. main.jsx

```jsx
import { BrowserRouter } from "react-router-dom";
// ...wrapped <App /> with <BrowserRouter>
```

### 3. App.jsx

Complete routing structure with:

- Public routes: /, /login, /candidate/:uniqueCode
- Candidate protected routes: 12 form pages
- HR protected routes: 4 dashboard/management pages

## Routes Created

### Public

- `/` → Redirects to /login
- `/login` → LoginPage
- `/candidate/:uniqueCode` → LoginPage (unique link login)

### Candidate (Protected - requires candidateAuth in localStorage)

- `/candidate/dashboard`
- `/candidate/form/personal-info`
- `/candidate/form/contact-info`
- `/candidate/form/family-details`
- `/candidate/form/education`
- `/candidate/form/work-experience`
- `/candidate/form/passport`
- `/candidate/form/health`
- `/candidate/form/individual-traits`
- `/candidate/form/general-info`
- `/candidate/form/esg`
- `/candidate/form/documents`

### HR (Protected - requires hrAuth in localStorage)

- `/hr/dashboard`
- `/hr/candidates`
- `/hr/candidates/new`
- `/hr/candidates/:candidateId`

## Components Created

### ProtectedRoute.jsx

Checks localStorage for auth keys and protects routes.

### Stub Pages (16 total)

All stub pages include:

- Page title (h2)
- "Coming Soon" text
- Back button using `useNavigate(-1)`

Ready for development!

## Testing the Setup

1. After running `npm run dev`, visit `http://localhost:5173`
2. You should see the LoginPage
3. Try navigating to `/candidate/dashboard` - should redirect to /login (not authenticated)
4. Set localStorage: `localStorage.setItem('candidateAuth', 'true')`
5. Now `/candidate/dashboard` should work

## Next Steps

- Implement authentication in LoginPage to set localStorage keys
- Build out each form component
- Connect to backend API
- Add styling consistent with loginpage.jsx
