import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import usePageTitle from '../../hooks/usePageTitle'
import { getCandidateById } from '../../mockCandidates'

function HRCandidateDetail() {
  usePageTitle("Candidate Detail | MTL HR Onboard");
  
  const { candidateId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('form-status')

  // TODO: Replace with API call
  const candidate = getCandidateById(candidateId)
  
  if (!candidate) {
    return (
      <div style={{padding: '20px', textAlign: 'center'}}>
        <h2>Candidate not found</h2>
        <button onClick={() => navigate('/hr/candidates')}>Back to Candidates</button>
      </div>
    )
  }

  const candidateInfo = {
    name: candidate.name,
    refNo: candidate.refNumber,
    designation: candidate.designation,
    businessUnit: candidate.businessUnit,
    dateAdded: new Date(candidate.dateAdded).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // TODO: Replace with API call
  const [formStatuses, setFormStatuses] = useState(
    candidate.forms.map((form, index) => {
      let statusKey = form.status.toLowerCase()
      // Map form statuses to expected format
      if (statusKey === 'pending') statusKey = 'not-started'
      if (statusKey === 'draft') statusKey = 'in-progress'
      return {
        id: index + 1,
        name: form.title,
        status: statusKey
      }
    })
  )

  const getStatusBadge = (status) => {
    const statusMap = {
      'not-started': 'Not Started',
      'in-progress': 'In Progress',
      'submitted': 'Submitted',
      'approved': 'Approved',
      'rejected': 'Rejected'
    }
    return statusMap[status] || status
  }

  const handleApprove = (formId) => {
    setFormStatuses(prev =>
      prev.map(form =>
        form.id === formId ? { ...form, status: 'approved' } : form
      )
    )
  }

  const handleReject = (formId) => {
    setFormStatuses(prev =>
      prev.map(form =>
        form.id === formId ? { ...form, status: 'rejected' } : form
      )
    )
  }

  const handleRequestCorrection = (formId) => {
    alert(`Request correction for form ${formId}`)
  }

  const handleApproveAll = () => {
    setFormStatuses(prev =>
      prev.map(form =>
        form.status === 'submitted' ? { ...form, status: 'approved' } : form
      )
    )
  }

  const handleSaveHRNotes = () => {
    // TODO: API call to save HR verification notes
    alert('HR notes saved successfully!')
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="hr-breadcrumb">
        <button 
          onClick={() => navigate('/hr/candidates')} 
          style={{background: 'none', border: 'none', color: '#2196b6', cursor: 'pointer', textDecoration: 'underline', padding: 0, font: 'inherit'}}
        >
          Candidates
        </button> &gt; {candidateInfo.name}
      </div>

      {/* Candidate Info Header */}
      <div className="hr-info-card">
        <div className="hr-candidate-header">
          <div>
            <h1 className="hr-candidate-name">{candidateInfo.name}</h1>
          </div>
        </div>
        <div className="hr-info-grid">
          <div className="hr-info-item">
            <div className="hr-info-label">Reference No</div>
            <div className="hr-info-value">{candidateInfo.refNo}</div>
          </div>
          <div className="hr-info-item">
            <div className="hr-info-label">Designation</div>
            <div className="hr-info-value">{candidateInfo.designation}</div>
          </div>
          <div className="hr-info-item">
            <div className="hr-info-label">Business Unit</div>
            <div className="hr-info-value">{candidateInfo.businessUnit}</div>
          </div>
          <div className="hr-info-item">
            <div className="hr-info-label">Date Added</div>
            <div className="hr-info-value">{candidateInfo.dateAdded}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="hr-tabs">
        <button
          className={`hr-tab ${activeTab === 'form-status' ? 'active' : ''}`}
          onClick={() => setActiveTab('form-status')}
        >
          Form Status
        </button>
        <button
          className={`hr-tab ${activeTab === 'hr-verification' ? 'active' : ''}`}
          onClick={() => setActiveTab('hr-verification')}
        >
          HR Verification
        </button>
        <button
          className={`hr-tab ${activeTab === 'approval-history' ? 'active' : ''}`}
          onClick={() => setActiveTab('approval-history')}
        >
          Approval History
        </button>
      </div>

      {/* Tab Content */}
      <div className="hr-tab-content">
        {activeTab === 'form-status' && (
          <div>
            <div className="hr-forms-header">
              <h3>Form Completion Status</h3>
              <button className="hr-approve-all-btn" onClick={handleApproveAll}>
                ✅ Approve All Submitted
              </button>
            </div>
            <div className="hr-forms-grid">
              {formStatuses.map((form) => (
                <div key={form.id} className={`hr-form-card ${form.status}`}>
                  <div className="hr-form-title">{form.name}</div>
                  <span className={`hr-status-badge ${form.status}`}>
                    {getStatusBadge(form.status)}
                  </span>
                  {form.status === 'submitted' && (
                    <div className="hr-form-actions">
                      <button
                        className="hr-action-btn approve"
                        onClick={() => handleApprove(form.id)}
                      >
                        <span>✅</span> Approve
                      </button>
                      <button
                        className="hr-action-btn reject"
                        onClick={() => handleReject(form.id)}
                      >
                        <span>❌</span> Reject
                      </button>
                      <button
                        className="hr-action-btn request"
                        onClick={() => handleRequestCorrection(form.id)}
                      >
                        <span>↩️</span> Request
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'hr-verification' && (
          <div className="hr-verification-form">
            <h3 style={{ marginBottom: '20px' }}>HR Verification Details</h3>
            <div className="hr-form-grid">
              <div className="hr-form-group">
                <label className="hr-form-label">Supervisor Name</label>
                <input type="text" className="hr-form-input" />
              </div>
              <div className="hr-form-group">
                <label className="hr-form-label">Supervisor Designation</label>
                <input type="text" className="hr-form-input" />
              </div>
              <div className="hr-form-group">
                <label className="hr-form-label">Supervisor Contact</label>
                <input type="text" className="hr-form-input" />
              </div>
              <div className="hr-form-group">
                <label className="hr-form-label">Salary Offered CTC</label>
                <input type="text" className="hr-form-input" />
              </div>
            </div>
            <div className="hr-form-grid">
              <div className="hr-form-group">
                <label className="hr-form-label">Reference 1 Verification Comments</label>
                <textarea className="hr-form-textarea"></textarea>
              </div>
              <div className="hr-form-group">
                <label className="hr-form-label">Reference 2 Verification Comments</label>
                <textarea className="hr-form-textarea"></textarea>
              </div>
            </div>
            <div className="hr-form-grid">
              <div className="hr-form-group">
                <label className="hr-form-label">Criminal Check Result</label>
                <input type="text" className="hr-form-input" />
              </div>
              <div className="hr-form-group">
                <label className="hr-form-label">Substance Abuse Check</label>
                <input type="text" className="hr-form-input" />
              </div>
              <div className="hr-form-group">
                <label className="hr-form-label">Recruitment Fitness</label>
                <input type="text" className="hr-form-input" />
              </div>
            </div>
            <div className="hr-form-grid full">
              <div className="hr-form-group">
                <label className="hr-form-label">HR Remarks</label>
                <textarea className="hr-form-textarea"></textarea>
              </div>
            </div>
            <button className="hr-save-btn" onClick={handleSaveHRNotes}>
              Save HR Notes
            </button>
          </div>
        )}

        {activeTab === 'approval-history' && (
          <div className="hr-timeline">
            <h3 style={{ marginBottom: '20px' }}>Approval History</h3>
            <div className="hr-timeline-item">
              <div className="hr-timeline-dot"></div>
              <div className="hr-timeline-content">
                <div className="hr-timeline-action">Personal Information Approved</div>
                <div className="hr-timeline-meta">
                  by <span className="hr-timeline-by">Sarah Johnson</span> • March 16, 2024 at 10:30 AM
                </div>
              </div>
            </div>
            <div className="hr-timeline-item">
              <div className="hr-timeline-dot"></div>
              <div className="hr-timeline-content">
                <div className="hr-timeline-action">Contact Information Approved</div>
                <div className="hr-timeline-meta">
                  by <span className="hr-timeline-by">Sarah Johnson</span> • March 16, 2024 at 10:35 AM
                </div>
              </div>
            </div>
            <div className="hr-timeline-item">
              <div className="hr-timeline-dot"></div>
              <div className="hr-timeline-content">
                <div className="hr-timeline-action">Candidate Profile Created</div>
                <div className="hr-timeline-meta">
                  by <span className="hr-timeline-by">System</span> • March 15, 2024 at 9:00 AM
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HRCandidateDetail
