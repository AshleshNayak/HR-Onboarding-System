// Run this file with: node create-all-files.js
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const dirs = [
  'src/components',
  'src/pages/candidate',
  'src/pages/candidate/forms',
  'src/pages/hr'
];

dirs.forEach(dir => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

// File templates
const files = {
  'src/components/ProtectedRoute.jsx': `import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute({ authKey, redirectTo }) {
  const isAuthenticated = localStorage.getItem(authKey)

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
`,

  'src/pages/candidate/CandidateDashboard.jsx': `import { useNavigate } from 'react-router-dom'

function CandidateDashboard() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Candidate Dashboard</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default CandidateDashboard
`,

  'src/pages/candidate/forms/PersonalInfoForm.jsx': `import { useNavigate } from 'react-router-dom'

function PersonalInfoForm() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Personal Info Form</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default PersonalInfoForm
`,

  'src/pages/candidate/forms/ContactInfoForm.jsx': `import { useNavigate } from 'react-router-dom'

function ContactInfoForm() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Contact Info Form</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default ContactInfoForm
`,

  'src/pages/candidate/forms/FamilyDetailsForm.jsx': `import { useNavigate } from 'react-router-dom'

function FamilyDetailsForm() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Family Details Form</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default FamilyDetailsForm
`,

  'src/pages/candidate/forms/EducationDetailsForm.jsx': `import { useNavigate } from 'react-router-dom'

function EducationDetailsForm() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Education Details Form</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default EducationDetailsForm
`,

  'src/pages/candidate/forms/WorkExperienceForm.jsx': `import { useNavigate } from 'react-router-dom'

function WorkExperienceForm() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Work Experience Form</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default WorkExperienceForm
`,

  'src/pages/candidate/forms/PassportDetailsForm.jsx': `import { useNavigate } from 'react-router-dom'

function PassportDetailsForm() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Passport Details Form</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default PassportDetailsForm
`,

  'src/pages/candidate/forms/HealthInfoForm.jsx': `import { useNavigate } from 'react-router-dom'

function HealthInfoForm() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Health Info Form</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default HealthInfoForm
`,

  'src/pages/candidate/forms/IndividualTraitsForm.jsx': `import { useNavigate } from 'react-router-dom'

function IndividualTraitsForm() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Individual Traits Form</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default IndividualTraitsForm
`,

  'src/pages/candidate/forms/GeneralInfoForm.jsx': `import { useNavigate } from 'react-router-dom'

function GeneralInfoForm() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>General Info Form</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default GeneralInfoForm
`,

  'src/pages/candidate/forms/ESGForm.jsx': `import { useNavigate } from 'react-router-dom'

function ESGForm() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>ESG Form</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default ESGForm
`,

  'src/pages/candidate/forms/DocumentsForm.jsx': `import { useNavigate } from 'react-router-dom'

function DocumentsForm() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Documents Form</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default DocumentsForm
`,

  'src/pages/hr/HRDashboard.jsx': `import { useNavigate } from 'react-router-dom'

function HRDashboard() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>HR Dashboard</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default HRDashboard
`,

  'src/pages/hr/HRCandidateList.jsx': `import { useNavigate } from 'react-router-dom'

function HRCandidateList() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>HR Candidate List</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default HRCandidateList
`,

  'src/pages/hr/HRNewCandidate.jsx': `import { useNavigate } from 'react-router-dom'

function HRNewCandidate() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>HR New Candidate</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default HRNewCandidate
`,

  'src/pages/hr/HRCandidateDetail.jsx': `import { useNavigate } from 'react-router-dom'

function HRCandidateDetail() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>HR Candidate Detail</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default HRCandidateDetail
`
};

// Write all files
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Created: ${filePath}`);
});

console.log('\\n✅ All files created successfully!');
console.log('\\nNext steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run dev');
