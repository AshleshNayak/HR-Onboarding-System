# MTL HR Onboarding System

Internal HR onboarding portal for Manipal Technologies Ltd.
Enables HR teams to manage candidate onboarding and allows
candidates to digitally complete their joining formalities.

---

## Project Structure

```
HR-Onboarding-System/
├── Database/
│   └── HROnboardingDB.sql     # MSSQL schema — run this first
└── Frontend/
    └── app/                   # React + Vite application
        └── src/
            ├── components/    # ProtectedRoute (auth guard)
            ├── hooks/         # usePageTitle (browser tab titles)
            ├── pages/
            │   ├── loginpage.jsx
            │   ├── candidate/ # Candidate portal + 11 forms
            │   └── hr/        # HR portal (dashboard, list, detail, new)
            ├── mockCandidates.js  # Mock data (replace with API)
            ├── App.jsx            # Routes
            └── index.css          # Global styles + CSS variables
```

---

## Tech Stack

| Layer    | Technology                      |
| -------- | ------------------------------- |
| Frontend | React 18, Vite, React Router v6 |
| Styling  | Plain CSS with CSS variables    |
| Database | Microsoft SQL Server            |
| Backend  | .NET Core Web API (planned)     |

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm
- SQL Server Management Studio (SSMS) for database setup

### Run the Frontend
```bash
cd Frontend/app
npm install
npm run dev
```
Open http://localhost:5173

### Database Setup
1. Open SQL Server Management Studio (SSMS)
2. Connect to your SQL Server instance
3. Open `Database/HROnboardingDB.sql`
4. Execute all statements (F5)

---

## Demo Credentials

### HR Staff Login (Staff Login tab)

| Role               | Username | Password |
| ------------------ | -------- | -------- |
| Admin              | admin    | admin123 |
| HR User            | hruser   | hr123    |
| Security Manager   | secmgr   | sec123   |
| Security Executive | secexec  | exec123  |

### Candidate Login (Candidate Access tab)
- Candidate Code: `CAND-A1B2C3`
- Email: `rahul.sharma@email.com`
- Or Unique Link: `https://hrboard.app/onboard?ref=CAND-A1B2C3`

> Demo credentials are shown directly on the login page in development mode.

---

## What Has Been Built

### Authentication & Login
- [x] Login page with Candidate Access and HR Staff Login tabs
- [x] Mock authentication with hardcoded demo credentials
- [x] 4-step candidate signup wizard (Details → Verify → OTP → Success)
- [x] Role-based login (Admin, HR User, Security Manager, Security Executive)
- [x] LDAP login toggle (UI only, backend pending)
- [x] "Fill with Test Data" button for quick testing
- [x] Auth stored in localStorage (`hrAuth` / `candidateAuth`)
- [x] Logout and Exit Portal buttons on both dashboards

### Candidate Portal
- [x] Candidate Dashboard with 11 form cards and status badges
- [x] Profile completion progress bar (auto-calculated)
- [x] Candidate name and reference number pulled from auth
- [x] All 11 onboarding forms built and navigable:
  1. Personal Information (signature upload, age auto-calc)
  2. Contact Information
  3. Family Details (conditional spouse/children fields)
  4. Education Details (tabs, repeatable degrees, semester marks)
  5. Work Experience (Fresher/Experienced toggle, repeatable employers)
  6. Passport Details (conditional fields)
  7. Health Information (conditional illness/surgery fields)
  8. Individual Traits (Yes/No card layout)
  9. General Information (EPF, references up to 3)
  10. ESG (vehicle type conditionals, fuel type conditionals)
  11. Documents (drag and drop, file type/size validation, photo preview)
- [x] Save as Draft and Submit on all forms
- [x] Form validation with inline red error messages
- [x] Read-only mode when form status = Approved
- [x] Exit banner when navigating away from a Draft form
- [x] Back arrow always returns to Candidate Dashboard

### HR Portal
- [x] HR Dashboard with fixed sidebar navigation
- [x] Summary cards (Total Candidates, Pending Review, Fully Completed, Approved)
- [x] Candidate list table with search and filter (Business Unit, Status)
- [x] Progress bars and status badges per candidate row
- [x] Candidate detail view with 3 tabs:
  - Form Status (11 cards with Approve/Reject/Request Correction buttons)
  - HR Verification (Section 19 internal fields)
  - Approval History (timeline)
- [x] Approve All Submitted bulk action
- [x] New Candidate form (cascading Company → Business Unit dropdowns)
- [x] Assign forms checklist when creating a candidate
- [x] Success modal with generated unique onboarding link
- [x] Logout with localStorage clear

### Database
- [x] 18 new form tables created (tbl_Form_PersonalInfo, tbl_Form_FamilyDetails, etc.)
- [x] tbl_CandidateApproval (approval audit trail)
- [x] tbl_Form_HRVerification (internal HR-only fields)
- [x] All tables have FK constraints, indexes on CandidateID
- [x] UpdatedAt triggers on all main form tables
- [x] Existing master tables: tbl_CandidateMaster, tbl_UserMaster, tbl_CompanyMaster, tbl_BusinessUnitMaster, tbl_States, tbl_Nationality, tbl_BloodGroup, tbl_Qualification

### UI & Design
- [x] Professional CSS design system with CSS variables
- [x] Consistent color palette, typography, spacing across all pages
- [x] Responsive candidate dashboard (4 col → 2 col → 1 col)
- [x] Sticky form headers and footers
- [x] Toast notifications on Save/Submit
- [x] Browser tab titles update per route
- [x] MTL favicon
- [x] Demo credentials card on login (dev mode only)

---

## What Is Pending

### Backend — .NET Core Web API
- [ ] Project setup (.NET Core 8 Web API, Entity Framework Core)
- [ ] MSSQL connection with connection string from config
- [ ] JWT authentication (replace localStorage mock)
- [ ] Auth endpoints: `POST /api/auth/login`, `POST /api/auth/candidate`
- [ ] Candidate management endpoints (CRUD)
- [ ] Form data endpoints (GET + POST per form table)
- [ ] Form approval endpoints (approve/reject per form)
- [ ] File upload endpoint for Documents form (store files on server/blob)
- [ ] Email notification on candidate link generation
- [ ] LDAP authentication integration

### Frontend — API Integration
- [ ] Replace all mock data with real API calls
- [ ] Replace localStorage auth with JWT tokens (httpOnly cookies or headers)
- [ ] Add loading spinners while API calls are in progress
- [ ] Add error handling for failed API calls (network errors, 401, 500)
- [ ] Environment variable setup (`VITE_API_URL` in `.env`)
- [ ] File upload progress indicator in Documents form
- [ ] Real candidate data on Candidate Dashboard (name, ref number, form statuses)

### Features Not Yet Built
- [ ] Admin panel (User management, Roles, Companies, Business Units)
- [ ] Security Manager screen (review HR-approved candidates)
- [ ] Security Executive screen (final verification)
- [ ] Reports page (completion stats by BU/Company, charts)
- [ ] Forms Review page (HR bulk review queue)
- [ ] Email OTP verification (currently dummy)
- [ ] Candidate signup connected to database
- [ ] Password reset flow
- [ ] Search functionality in candidate list (currently UI only)
- [ ] Filter functionality in candidate list (currently UI only)

---

## User Roles

| Role               | Access                                               |
| ------------------ | ---------------------------------------------------- |
| Admin              | Full system — users, roles, companies, BUs           |
| HR User            | Create candidates, assign forms, approve submissions |
| Security Manager   | Review HR-approved candidates                        |
| Security Executive | Final verification, view past records                |
| Candidate          | Fill assigned onboarding forms via unique link       |

---

## Route Reference

| Path                    | Component          | Auth          | Status |
| ----------------------- | ------------------ | ------------- | ------ |
| /login                  | LoginPage          | Public        | ✅ Built |
| /candidate/dashboard    | CandidateDashboard | candidateAuth | ✅ Built |
| /candidate/form/personal-info | PersonalInfoForm | candidateAuth | ✅ Built |
| /candidate/form/contact-info | ContactInfoForm | candidateAuth | ✅ Built |
| /candidate/form/family-details | FamilyDetailsForm | candidateAuth | ✅ Built |
| /candidate/form/education | EducationDetailsForm | candidateAuth | ✅ Built |
| /candidate/form/work-experience | WorkExperienceForm | candidateAuth | ✅ Built |
| /candidate/form/passport | PassportDetailsForm | candidateAuth | ✅ Built |
| /candidate/form/health | HealthInfoForm | candidateAuth | ✅ Built |
| /candidate/form/individual-traits | IndividualTraitsForm | candidateAuth | ✅ Built |
| /candidate/form/general-info | GeneralInfoForm | candidateAuth | ✅ Built |
| /candidate/form/esg | ESGForm | candidateAuth | ✅ Built |
| /candidate/form/documents | DocumentsForm | candidateAuth | ✅ Built |
| /hr/dashboard           | HRDashboard        | hrAuth        | ✅ Built |
| /hr/candidates          | HRCandidateList    | hrAuth        | ✅ Built |
| /hr/candidates/new      | HRNewCandidate     | hrAuth        | ✅ Built |
| /hr/candidates/:id      | HRCandidateDetail  | hrAuth        | ✅ Built |
| /admin/users            | AdminUsers         | adminAuth     | 🔄 Planned |
| /admin/roles            | AdminRoles         | adminAuth     | 🔄 Planned |
| /admin/companies        | AdminCompanies     | adminAuth     | 🔄 Planned |
| /hr/forms-review        | FormsReview        | hrAuth        | 🔄 Planned |
| /hr/reports             | Reports            | hrAuth        | 🔄 Planned |

---

## Next Steps (Recommended Order)

1. **Set up .NET Core 8 Web API project** inside a new `Backend/` folder
2. **Configure Entity Framework Core** with MSSQL connection
3. **Build JWT auth endpoints** — replace localStorage mock
4. **Build candidate + form API endpoints** — replace mockCandidates.js
5. **Connect React frontend** to API using `VITE_API_URL` env variable
6. **Build file upload endpoint** for Documents form
7. **Add Admin panel pages** for user/role/company management
8. **Build Security Manager and Executive screens**
9. **Add Reports page** with charts
10. **Set up email service** for onboarding link + OTP delivery
