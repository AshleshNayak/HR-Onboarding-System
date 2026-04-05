# Frontend — MTL HR Onboarding

## Quick Start

```bash
npm install
npm run dev
```

## Available Scripts

| Script          | Description                               |
| --------------- | ----------------------------------------- |
| npm run dev     | Start development server (localhost:5173) |
| npm run build   | Production build                          |
| npm run preview | Preview production build locally          |

## Folder Structure

```
src/
├── components/
│   └── ProtectedRoute.jsx    # Checks localStorage auth before rendering
├── hooks/
│   └── usePageTitle.js       # Sets document.title per page
├── pages/
│   ├── loginpage.jsx         # Login + candidate signup (4-step wizard)
│   ├── candidate/
│   │   ├── CandidateDashboard.jsx   # 11 form cards + progress bar
│   │   └── forms/
│   │       ├── forms-shared.css     # Shared styles for all forms
│   │       ├── PersonalInfoForm.jsx
│   │       ├── ContactInfoForm.jsx
│   │       ├── FamilyDetailsForm.jsx
│   │       ├── EducationDetailsForm.jsx
│   │       ├── WorkExperienceForm.jsx
│   │       ├── PassportDetailsForm.jsx
│   │       ├── HealthInfoForm.jsx
│   │       ├── IndividualTraitsForm.jsx
│   │       ├── GeneralInfoForm.jsx
│   │       ├── ESGForm.jsx
│   │       └── DocumentsForm.jsx
│   └── hr/
│       ├── HRDashboard.jsx          # Shell layout with sidebar
│       ├── HRCandidateList.jsx      # Candidate table with filters
│       ├── HRCandidateDetail.jsx    # 3-tab detail view
│       └── HRNewCandidate.jsx       # Create candidate + assign forms
├── mockCandidates.js         # Mock data (replace with API calls)
├── App.jsx                   # Route definitions
├── main.jsx                  # React entry point
└── index.css                 # Global styles + CSS variables
```

## Authentication (Current Mock)

Auth is stored in localStorage:

- `hrAuth` — set on HR staff login
- `candidateAuth` — set on candidate login
  Both are cleared on logout/exit.
  Replace with JWT tokens when .NET Core API is ready.

## Adding a New Form

1. Create `src/pages/candidate/forms/NewForm.jsx`
2. Import `forms-shared.css` at the top
3. Add route in `App.jsx`
4. Add card entry to the forms array in `CandidateDashboard.jsx`
5. Add DB table in `HROnboardingDB.sql`

## Environment Variables

Create `.env` in this folder when API is ready:

```
VITE_API_URL=https://localhost:7001/api
```

Then use `import.meta.env.VITE_API_URL` in API calls.
