import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/loginpage'
import ProtectedRoute from './components/ProtectedRoute'

// Candidate pages
import CandidateDashboard from './pages/candidate/CandidateDashboard'
import PersonalInfoForm from './pages/candidate/forms/PersonalInfoForm'
import ContactInfoForm from './pages/candidate/forms/ContactInfoForm'
import FamilyDetailsForm from './pages/candidate/forms/FamilyDetailsForm'
import EducationDetailsForm from './pages/candidate/forms/EducationDetailsForm'
import WorkExperienceForm from './pages/candidate/forms/WorkExperienceForm'
import PassportDetailsForm from './pages/candidate/forms/PassportDetailsForm'
import HealthInfoForm from './pages/candidate/forms/HealthInfoForm'
import IndividualTraitsForm from './pages/candidate/forms/IndividualTraitsForm'
import GeneralInfoForm from './pages/candidate/forms/GeneralInfoForm'
import ESGForm from './pages/candidate/forms/ESGForm'
import DocumentsForm from './pages/candidate/forms/DocumentsForm'

// HR pages
import HRDashboard from './pages/hr/HRDashboard'
import HRCandidateList from './pages/hr/HRCandidateList'
import HRNewCandidate from './pages/hr/HRNewCandidate'
import HRCandidateDetail from './pages/hr/HRCandidateDetail'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/candidate/:uniqueCode" element={<LoginPage />} />

      {/* Candidate protected routes */}
      <Route element={<ProtectedRoute authKey="candidateAuth" redirectTo="/login" />}>
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/form/personal-info" element={<PersonalInfoForm />} />
        <Route path="/candidate/form/contact-info" element={<ContactInfoForm />} />
        <Route path="/candidate/form/family-details" element={<FamilyDetailsForm />} />
        <Route path="/candidate/form/education" element={<EducationDetailsForm />} />
        <Route path="/candidate/form/work-experience" element={<WorkExperienceForm />} />
        <Route path="/candidate/form/passport" element={<PassportDetailsForm />} />
        <Route path="/candidate/form/health" element={<HealthInfoForm />} />
        <Route path="/candidate/form/individual-traits" element={<IndividualTraitsForm />} />
        <Route path="/candidate/form/general-info" element={<GeneralInfoForm />} />
        <Route path="/candidate/form/esg" element={<ESGForm />} />
        <Route path="/candidate/form/documents" element={<DocumentsForm />} />
      </Route>

      {/* HR protected routes */}
      <Route element={<ProtectedRoute authKey="hrAuth" redirectTo="/login" />}>
        <Route path="/hr/dashboard" element={<HRDashboard />}>
          <Route path="candidates" element={<HRCandidateList />} />
          <Route path="candidates/new" element={<HRNewCandidate />} />
          <Route path="candidates/:candidateId" element={<HRCandidateDetail />} />
        </Route>
        <Route path="/hr/candidates" element={<HRDashboard />}>
          <Route index element={<HRCandidateList />} />
          <Route path="new" element={<HRNewCandidate />} />
          <Route path=":candidateId" element={<HRCandidateDetail />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App