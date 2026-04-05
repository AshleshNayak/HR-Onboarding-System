import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePageTitle from '../../../usePageTitle'
import '../forms/forms-shared.css'
import './PassportDetailsForm.css'

function PassportDetailsForm() {
  usePageTitle("Passport Details | MTL HR Onboard");
  
  const navigate = useNavigate()

  const [formStatus, setFormStatus] = useState('Pending')
  const [formData, setFormData] = useState({
    hasPassport: 'No',
    passportNumber: '',
    issueDate: '',
    validTill: '',
    placeOfIssue: ''
  })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState({ show: false, message: '' })

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

  const handlePassportToggle = (value) => {
    setFormData(prev => ({
      ...prev,
      hasPassport: value,
      // Clear passport fields if switching to No
      ...(value === 'No' && {
        passportNumber: '',
        issueDate: '',
        validTill: '',
        placeOfIssue: ''
      })
    }))
    // Clear all errors when toggling
    setErrors({})
  }

  const validateForm = () => {
    const newErrors = {}

    if (formData.hasPassport === 'Yes') {
      // Passport number validation
      if (!formData.passportNumber.trim()) {
        newErrors.passportNumber = 'Passport number is required'
      } else if (!/^[A-Z0-9]{6,15}$/i.test(formData.passportNumber)) {
        newErrors.passportNumber = 'Enter a valid alphanumeric passport number (6-15 characters)'
      }

      // Issue date validation
      if (!formData.issueDate) {
        newErrors.issueDate = 'Issue date is required'
      }

      // Valid till validation
      if (!formData.validTill) {
        newErrors.validTill = 'Expiry date is required'
      } else if (formData.issueDate && formData.validTill) {
        const issue = new Date(formData.issueDate)
        const expiry = new Date(formData.validTill)
        if (expiry <= issue) {
          newErrors.validTill = 'Expiry date must be after issue date'
        }
      }

      // Place of issue validation
      if (!formData.placeOfIssue.trim()) {
        newErrors.placeOfIssue = 'Place of issue is required'
      }
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
    // TODO: API call to POST /api/forms/passport-details/:candidateId with status: 'Draft'
    setFormStatus('Draft')
    showToast('Passport details saved as draft')
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // TODO: API call to POST /api/forms/passport-details/:candidateId with status: 'Submitted'
      setFormStatus('Submitted')
      showToast('Passport details submitted successfully!')
    } else {
      showToast('Please fix the errors before submitting')
    }
  }

  const isReadOnly = formStatus === 'Approved'

  return (
    <div className="form-page-container">
      {/* Header */}
      <div className="form-page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>Passport Details</h1>
        <span className={`status-badge status-${formStatus.toLowerCase()}`}>
          {formStatus}
        </span>
      </div>

      {/* Content */}
      <div className="form-content">
        <div className="form-card">
          {/* Passport Holder Question */}
          <div className="form-field">
            <label>
              Are you a Passport Holder? <span className="required-star">*</span>
            </label>
            {isReadOnly ? (
              <p className="form-readonly-value">{formData.hasPassport}</p>
            ) : (
              <div className="form-radio-group">
                <div className="form-radio-option">
                  <input
                    type="radio"
                    id="passport-yes"
                    name="hasPassport"
                    value="Yes"
                    checked={formData.hasPassport === 'Yes'}
                    onChange={(e) => handlePassportToggle(e.target.value)}
                  />
                  <label htmlFor="passport-yes">Yes</label>
                </div>
                <div className="form-radio-option">
                  <input
                    type="radio"
                    id="passport-no"
                    name="hasPassport"
                    value="No"
                    checked={formData.hasPassport === 'No'}
                    onChange={(e) => handlePassportToggle(e.target.value)}
                  />
                  <label htmlFor="passport-no">No</label>
                </div>
              </div>
            )}
          </div>

          {/* Conditional Passport Fields */}
          {formData.hasPassport === 'Yes' ? (
            <div className="passport-details-section">
              <div className="form-grid">
                {/* Passport Number */}
                <div className="form-field">
                  <label>
                    Passport Number <span className="required-star">*</span>
                  </label>
                  {isReadOnly ? (
                    <p className="form-readonly-value">{formData.passportNumber || '—'}</p>
                  ) : (
                    <>
                      <input
                        type="text"
                        name="passportNumber"
                        value={formData.passportNumber}
                        onChange={handleChange}
                        className={`form-input ${errors.passportNumber ? 'error' : ''}`}
                        placeholder="Enter passport number"
                        maxLength={15}
                      />
                      {errors.passportNumber && (
                        <span className="form-error">{errors.passportNumber}</span>
                      )}
                    </>
                  )}
                </div>

                {/* Place of Issue */}
                <div className="form-field">
                  <label>
                    Place of Issue <span className="required-star">*</span>
                  </label>
                  {isReadOnly ? (
                    <p className="form-readonly-value">{formData.placeOfIssue || '—'}</p>
                  ) : (
                    <>
                      <input
                        type="text"
                        name="placeOfIssue"
                        value={formData.placeOfIssue}
                        onChange={handleChange}
                        className={`form-input ${errors.placeOfIssue ? 'error' : ''}`}
                        placeholder="e.g., Bengaluru"
                      />
                      {errors.placeOfIssue && (
                        <span className="form-error">{errors.placeOfIssue}</span>
                      )}
                    </>
                  )}
                </div>

                {/* Issue Date */}
                <div className="form-field">
                  <label>
                    Issue Date <span className="required-star">*</span>
                  </label>
                  {isReadOnly ? (
                    <p className="form-readonly-value">{formData.issueDate || '—'}</p>
                  ) : (
                    <>
                      <input
                        type="date"
                        name="issueDate"
                        value={formData.issueDate}
                        onChange={handleChange}
                        className={`form-input ${errors.issueDate ? 'error' : ''}`}
                      />
                      {errors.issueDate && (
                        <span className="form-error">{errors.issueDate}</span>
                      )}
                    </>
                  )}
                </div>

                {/* Valid Till */}
                <div className="form-field">
                  <label>
                    Valid Till <span className="required-star">*</span>
                  </label>
                  {isReadOnly ? (
                    <p className="form-readonly-value">{formData.validTill || '—'}</p>
                  ) : (
                    <>
                      <input
                        type="date"
                        name="validTill"
                        value={formData.validTill}
                        onChange={handleChange}
                        className={`form-input ${errors.validTill ? 'error' : ''}`}
                      />
                      {errors.validTill && (
                        <span className="form-error">{errors.validTill}</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="form-info-box">
              No passport details required.
            </div>
          )}
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

export default PassportDetailsForm
