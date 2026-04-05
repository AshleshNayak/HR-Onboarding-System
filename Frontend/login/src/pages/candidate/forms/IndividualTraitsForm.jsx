import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePageTitle from '../../../usePageTitle'
import '../forms/forms-shared.css'
import './IndividualTraitsForm.css'

function IndividualTraitsForm() {
  usePageTitle("Individual Traits | MTL HR Onboard");
  
  const navigate = useNavigate()

  const [formStatus, setFormStatus] = useState('Pending')
  const [showExitBanner, setShowExitBanner] = useState(false)
  const [formData, setFormData] = useState({
    drinkingHabit: '',
    gamblingHabit: '',
    drugAbuse: '',
    criminalRecord: '',
    arrestHistory: '',
    additionalRemarks: ''
  })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState({ show: false, message: '' })

  const traits = [
    { id: 'drinkingHabit', icon: '🍺', label: 'Drinking Habit' },
    { id: 'gamblingHabit', icon: '🎲', label: 'Gambling Habit' },
    { id: 'drugAbuse', icon: '💊', label: 'Drug Abuse' },
    { id: 'criminalRecord', icon: '⚖️', label: 'Criminal Record' },
    { id: 'arrestHistory', icon: '🚔', label: 'Arrest History' }
  ]

  const handleRadioChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    // All trait questions are mandatory
    traits.forEach(trait => {
      if (!formData[trait.id]) {
        newErrors[trait.id] = 'This field is required'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const showToast = (message) => {
    setToast({ show: true, message })
    setTimeout(() => {
      setToast({ show: false, message: '' })
    }, 3000)
  }

  const handleSaveAsDraft = () => {
    // TODO: API call to POST /api/forms/individual-traits/:candidateId with status: 'Draft'
    setFormStatus('Draft')
    showToast('Individual traits saved as draft')
  }

  const handleSaveAndExit = () => {
    handleSaveAsDraft()
    navigate('/candidate/dashboard')
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // TODO: API call to POST /api/forms/individual-traits/:candidateId with status: 'Submitted'
      setFormStatus('Submitted')
      showToast('Individual traits submitted successfully!')
    } else {
      showToast('Please answer all mandatory questions before submitting')
    }
  }

  const isReadOnly = formStatus === 'Approved'

  return (
    <div className="form-page-container">
      {/* Header */}
      <div className="form-page-header">
        <button className="back-button" onClick={() => {
          if (formStatus === 'Draft') {
            setShowExitBanner(true)
          } else {
            navigate('/candidate/dashboard')
          }
        }}>
          ← Back
        </button>
        <h1>Individual Traits</h1>
        <span className={`status-badge status-${formStatus.toLowerCase()}`}>
          {formStatus}
        </span>
      </div>

      {/* Exit Banner */}
      {showExitBanner && (
        <div className="exit-banner">
          <p className="exit-banner-message">You have unsaved changes.</p>
          <div className="exit-banner-actions">
            <button className="btn-primary" onClick={handleSaveAndExit}>
              Save as Draft
            </button>
            <button className="btn-link" onClick={() => navigate('/candidate/dashboard')}>
              Leave without saving
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="form-content">
        <div className="form-card">
          {/* Intro Message */}
          <div className="traits-intro">
            Please answer honestly. This information is kept confidential.
          </div>

          {/* Trait Questions */}
          <div className="traits-list">
            {traits.map(trait => (
              <div key={trait.id} className={`trait-item ${errors[trait.id] ? 'error' : ''}`}>
                <div className="trait-label">
                  <span className="trait-icon">{trait.icon}</span>
                  <span className="trait-text">
                    {trait.label} <span className="required-star">*</span>
                  </span>
                </div>

                {isReadOnly ? (
                  <div className="trait-readonly">
                    {formData[trait.id] || '—'}
                  </div>
                ) : (
                  <div className="trait-options">
                    <div className="form-radio-option">
                      <input
                        type="radio"
                        id={`${trait.id}-yes`}
                        name={trait.id}
                        value="Yes"
                        checked={formData[trait.id] === 'Yes'}
                        onChange={(e) => handleRadioChange(trait.id, e.target.value)}
                      />
                      <label htmlFor={`${trait.id}-yes`}>Yes</label>
                    </div>
                    <div className="form-radio-option">
                      <input
                        type="radio"
                        id={`${trait.id}-no`}
                        name={trait.id}
                        value="No"
                        checked={formData[trait.id] === 'No'}
                        onChange={(e) => handleRadioChange(trait.id, e.target.value)}
                      />
                      <label htmlFor={`${trait.id}-no`}>No</label>
                    </div>
                  </div>
                )}

                {errors[trait.id] && (
                  <div className="trait-error">{errors[trait.id]}</div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Remarks */}
          <div className="form-field" style={{ marginTop: '32px' }}>
            <label>Additional Remarks (Optional)</label>
            {isReadOnly ? (
              <p className="form-readonly-value">{formData.additionalRemarks || '—'}</p>
            ) : (
              <textarea
                name="additionalRemarks"
                value={formData.additionalRemarks}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Any additional information you'd like to share..."
                rows={4}
              />
            )}
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      {!isReadOnly && (
        <div className="form-sticky-footer">
          <button className="btn-secondary" onClick={handleSaveAsDraft}>
            Save as Draft
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="form-toast">
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default IndividualTraitsForm
