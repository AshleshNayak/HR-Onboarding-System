# Page Titles & Favicon Update Summary

## Changes Made

### 1. Updated index.html

- ✅ Changed `<title>` from "loginpage" to "MTL HR Onboard"
- ✅ Favicon link already correct: `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`

### 2. Created New Favicon

- ✅ Replaced `Frontend/login/public/favicon.svg` with a simple MTL logo
- Design: White "MTL" text on dark navy (#1a2f5a) background with rounded corners
- Viewbox: 32x32

### 3. Created Custom Hook

- ✅ Created `Frontend/login/src/usePageTitle.js`
- Simple hook that sets document.title using useEffect

### 4. Updated All Page Components

#### Public Pages:

- ✅ **loginpage.jsx** → "Login | MTL HR Onboard"

#### Candidate Pages:

- ✅ **CandidateDashboard.jsx** → "My Dashboard | MTL HR Onboard"

#### Candidate Forms:

- ✅ **PersonalInfoForm.jsx** → "Personal Information | MTL HR Onboard"
- ✅ **ContactInfoForm.jsx** → "Contact Information | MTL HR Onboard"
- ✅ **FamilyDetailsForm.jsx** → "Family Details | MTL HR Onboard"
- ✅ **EducationDetailsForm.jsx** → "Education Details | MTL HR Onboard"
- ✅ **WorkExperienceForm.jsx** → "Work Experience | MTL HR Onboard"
- ✅ **PassportDetailsForm.jsx** → "Passport Details | MTL HR Onboard"
- ✅ **HealthInfoForm.jsx** → "Health Information | MTL HR Onboard"
- ✅ **IndividualTraitsForm.jsx** → "Individual Traits | MTL HR Onboard"
- ✅ **GeneralInfoForm.jsx** → "General Information | MTL HR Onboard"
- ✅ **ESGForm.jsx** → "ESG | MTL HR Onboard"
- ✅ **DocumentsForm.jsx** → "Documents | MTL HR Onboard"

#### HR Pages:

- ✅ **HRDashboard.jsx** → "HR Dashboard | MTL HR Onboard"
- ✅ **HRCandidateList.jsx** → "Candidates | MTL HR Onboard"
- ✅ **HRNewCandidate.jsx** → "New Candidate | MTL HR Onboard"
- ✅ **HRCandidateDetail.jsx** → "Candidate Detail | MTL HR Onboard"

## Files Modified: 19

## Files Created: 1 (usePageTitle.js)

## How to Test

1. Open the application in a browser
2. Navigate to different pages
3. Check the browser tab - it should show the appropriate page title
4. Check the favicon - it should show "MTL" in white on navy background

## Note on Hook Location

The `usePageTitle.js` hook was created in `src/` instead of `src/hooks/` due to environment constraints. This is a valid location and commonly used. If you prefer to move it to `src/hooks/`, you can:

1. Create the directory: `mkdir src\hooks`
2. Move the file: `move src\usePageTitle.js src\hooks\usePageTitle.js`
3. Update all imports from `'../../usePageTitle'` to `'../../hooks/usePageTitle'` (or similar based on the file's relative path)

Alternatively, run the provided setup script:

```bash
cd Frontend/login
node setup-hooks.js
```

This will create the hooks directory and move the file automatically.
