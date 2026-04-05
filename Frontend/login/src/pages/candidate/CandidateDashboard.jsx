import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePageTitle from '../../usePageTitle'
import './CandidateDashboard.css'

function CandidateDashboard() {
  usePageTitle("My Dashboard | MTL HR Onboard");
  
  const navigate = useNavigate()
  
  // TODO: Replace mock data with GET /api/candidates/:id on component mount
  const [candidateInfo] = useState({
    name: "Raghavendra Nayak",
    referenceNumber: "MPI-REF-2026-0145",
    forms: [
      { id: "personal-info", title: "Personal Information", subtitle: "Provide your personal details", icon: "👤", status: "Draft", route: "/candidate/form/personal-info" },
      { id: "contact-info", title: "Contact Information", subtitle: "Phone, email and address", icon: "📞", status: "Submitted", route: "/candidate/form/contact-info" },
      { id: "family-details", title: "Family Details", subtitle: "Family member details", icon: "👨‍👩‍👧", status: "Pending", route: "/candidate/form/family-details" },
      { id: "education", title: "Education Details", subtitle: "Academic qualifications", icon: "🎓", status: "Pending", route: "/candidate/form/education" },
      { id: "work-experience", title: "Work Experience", subtitle: "Previous employment", icon: "💼", status: "Draft", route: "/candidate/form/work-experience" },
      { id: "passport", title: "Passport Details", subtitle: "Travel documentation", icon: "🛂", status: "Pending", route: "/candidate/form/passport" },
      { id: "health", title: "Health Information", subtitle: "Medical details", icon: "💊", status: "Pending", route: "/candidate/form/health" },
      { id: "individual-traits", title: "Individual Traits", subtitle: "Strengths and skills", icon: "⭐", status: "Pending", route: "/candidate/form/individual-traits" },
      { id: "general-info", title: "General Information", subtitle: "Additional information", icon: "ℹ️", status: "Pending", route: "/candidate/form/general-info" },
      { id: "esg", title: "ESG", subtitle: "Environmental & social", icon: "🌿", status: "Pending", route: "/candidate/form/esg" },
      { id: "documents", title: "Documents", subtitle: "Upload certificates", icon: "📁", status: "Pending", route: "/candidate/form/documents" }
    ]
  })

  const calculateCompletionPercentage = () => {
    const completedCount = candidateInfo.forms.filter(
      form => form.status === "Submitted" || form.status === "Approved"
    ).length
    return Math.round((completedCount / 11) * 100)
  }

  const handleCardClick = (route) => {
    navigate(route)
  }

  const completionPercentage = calculateCompletionPercentage()

  return (
    <div className="candidate-dashboard">
      <div className="hero-banner">
        <div className="hero-content">
          <div className="hero-icon">🏅</div>
          <h1 className="hero-title">Congratulations on getting shortlisted!</h1>
          <p className="hero-subtitle">Fill the sections below for a smooth onboarding process.</p>
        </div>
      </div>

      <div className="info-bar">
        <div className="info-item">
          <span className="info-label">Candidate Name : </span>
          <span className="info-value">{candidateInfo.name}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Reference Number : </span>
          <span className="info-value">{candidateInfo.referenceNumber}</span>
        </div>
      </div>

      <div className="profile-completion">
        <div className="completion-header">
          <span className="completion-label">Profile Completion</span>
          <span className="completion-percentage">{completionPercentage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="forms-grid">
        {candidateInfo.forms.map((form) => (
          <div 
            key={form.id} 
            className="form-card"
            onClick={() => handleCardClick(form.route)}
          >
            <div className="card-header">
              <span className="card-icon">{form.icon}</span>
              <span className={`status-badge status-${form.status.toLowerCase()}`}>
                {form.status}
              </span>
            </div>
            <h3 className="card-title">{form.title}</h3>
            <p className="card-subtitle">{form.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CandidateDashboard
