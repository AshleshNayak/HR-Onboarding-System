import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePageTitle from '../../../hooks/usePageTitle'
import '../forms/forms-shared.css'
import './HealthInfoForm.css'

function HealthInfoForm() {
  usePageTitle("Health Information | MTL HR Onboard");
  
  const navigate = useNavigate()

  const [formStatus, setFormStatus] = useState('Pending')
  const [showExitBanner, setShowExitBanner] = useState(false)
  const [formData, setFormData] = useState({
    bloodGroup: '',
    hasMajorIllness: 'No',
    illnessDetails: '',
    hasMajorSurgeries: 'No',
    surgeryDetails: ''
  })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState({ show: false, message: '' })

  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleRadioChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Clear details field if switching to No
      ...(value === 'No' && field === 'hasMajorIllness' && { illnessDetails: '' }),
      ...(value === 'No' && field === 'hasMajorSurgeries' && { surgeryDetails: '' })
    }))
    
    // Clear related errors
    if (field === 'hasMajorIllness' && value === 'No') {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.illnessDetails
        return newErrors
      })
    }
    if (field === 'hasMajorSurgeries' && value === 'No') {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.surgeryDetails
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Blood group is required
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Please select your blood group'
    }

    // If has major illness, details are required
    if (formData.hasMajorIllness === 'Yes' && !formData.illnessDetails.trim()) {
      newErrors.illnessDetails = 'Please provide illness details'
    }

    // If has major surgeries, details are required
    if (formData.hasMajorSurgeries === 'Yes' && !formData.surgeryDetails.trim()) {
      newErrors.surgeryDetails = 'Please provide surgery details'
    }

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
    // TODO: API call to POST /api/forms/health-info/:candidateId with status: 'Draft'
    setFormStatus('Draft')
    showToast('Health information saved as draft')
  }

  const handleSaveAndExit = () => {
    handleSaveAsDraft()
    navigate('/candidate/dashboard')
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // TODO: API call to POST /api/forms/health-info/:candidateId with status: 'Submitted'
      setFormStatus('Submitted')
      showToast('Health information submitted successfully!')
    } else {
      showToast('Please fix the errors before submitting')
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
        <h1>Health Information</h1>
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
          <div className="form-grid">
            {/* Blood Group */}
            <div className="form-field">
              <label>
                Blood Group <span className="required-star">*</span>
              </label>
              {isReadOnly ? (
                <p className="form-readonly-value">{formData.bloodGroup || '—'}</p>
              ) : (
                <>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className={`form-select ${errors.bloodGroup ? 'error' : ''}`}
                  >
                    <option value="">Select blood group</option>
                    {bloodGroupOptions.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                  {errors.bloodGroup && (
                    <span className="form-error">{errors.bloodGroup}</span>
                  )}
                </>
              )}
            </div>

            {/* Major Illness */}
            <div className="form-field">
              <label>
                Any Major Illness? <span className="required-star">*</span>
              </label>
              {isReadOnly ? (
                <p className="form-readonly-value">{formData.hasMajorIllness}</p>
              ) : (
                <div className="form-radio-group">
                  <div className="form-radio-option">
                    <input
                      type="radio"
                      id="illness-yes"
                      name="hasMajorIllness"
                      value="Yes"
                      checked={formData.hasMajorIllness === 'Yes'}
                      onChange={(e) => handleRadioChange('hasMajorIllness', e.target.value)}
                    />
                    <label htmlFor="illness-yes">Yes</label>
                  </div>
                  <div className="form-radio-option">
                    <input
                      type="radio"
                      id="illness-no"
                      name="hasMajorIllness"
                      value="No"
                      checked={formData.hasMajorIllness === 'No'}
                      onChange={(e) => handleRadioChange('hasMajorIllness', e.target.value)}
                    />
                    <label htmlFor="illness-no">No</label>
                  </div>
                </div>
              )}
            </div>

            {/* Illness Details (Conditional) */}
            {formData.hasMajorIllness === 'Yes' && (
              <div className="form-field form-grid-full">
                <label>
                  Illness Details <span className="required-star">*</span>
                </label>
                {isReadOnly ? (
                  <p className="form-readonly-value">{formData.illnessDetails || '—'}</p>
                ) : (
                  <>
                    <textarea
                      name="illnessDetails"
                      value={formData.illnessDetails}
                      onChange={handleChange}
                      className={`form-textarea ${errors.illnessDetails ? 'error' : ''}`}
                      placeholder="Please describe the illness, duration, and current status"
                      rows={4}
                    />
                    {errors.illnessDetails && (
                      <span className="form-error">{errors.illnessDetails}</span>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Major Surgeries */}
            <div className="form-field">
              <label>
                Any Major Surgeries? <span className="required-star">*</span>
              </label>
              {isReadOnly ? (
                <p className="form-readonly-value">{formData.hasMajorSurgeries}</p>
              ) : (
                <div className="form-radio-group">
                  <div className="form-radio-option">
                    <input
                      type="radio"
                      id="surgery-yes"
                      name="hasMajorSurgeries"
                      value="Yes"
                      checked={formData.hasMajorSurgeries === 'Yes'}
                      onChange={(e) => handleRadioChange('hasMajorSurgeries', e.target.value)}
                    />
                    <label htmlFor="surgery-yes">Yes</label>
                  </div>
                  <div className="form-radio-option">
                    <input
                      type="radio"
                      id="surgery-no"
                      name="hasMajorSurgeries"
                      value="No"
                      checked={formData.hasMajorSurgeries === 'No'}
                      onChange={(e) => handleRadioChange('hasMajorSurgeries', e.target.value)}
                    />
                    <label htmlFor="surgery-no">No</label>
                  </div>
                </div>
              )}
            </div>

            {/* Surgery Details (Conditional) */}
            {formData.hasMajorSurgeries === 'Yes' && (
              <div className="form-field form-grid-full">
                <label>
                  Surgery Details <span className="required-star">*</span>
                </label>
                {isReadOnly ? (
                  <p className="form-readonly-value">{formData.surgeryDetails || '—'}</p>
                ) : (
                  <>
                    <textarea
                      name="surgeryDetails"
                      value={formData.surgeryDetails}
                      onChange={handleChange}
                      className={`form-textarea ${errors.surgeryDetails ? 'error' : ''}`}
                      placeholder="Please describe the surgery, date, and recovery status"
                      rows={4}
                    />
                    {errors.surgeryDetails && (
                      <span className="form-error">{errors.surgeryDetails}</span>
                    )}
                  </>
                )}
              </div>
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

export default HealthInfoForm
