import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../forms/forms-shared.css'
import './GeneralInfoForm.css'

function GeneralInfoForm() {
  const navigate = useNavigate()

  const [formStatus, setFormStatus] = useState('Pending')
  const [formData, setFormData] = useState({
    // EPF Details
    isEpfMember: 'No',
    epfAccountNumber: '',
    
    // Background
    appliedBefore: 'No',
    languagesKnown: '',
    computerSkills: '',
    hobbies: '',
    professionalMemberships: '',
    
    // References (default: 1 reference)
    references: [
      { name: '', designation: '', address: '', contact: '' }
    ]
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

  const handleRadioChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Clear EPF account number if switching to No
      ...(field === 'isEpfMember' && value === 'No' && { epfAccountNumber: '' })
    }))
    
    // Clear related errors
    if (field === 'isEpfMember' && value === 'No') {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.epfAccountNumber
        return newErrors
      })
    }
  }

  const handleReferenceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) =>
        i === index ? { ...ref, [field]: value } : ref
      )
    }))
    
    // Clear error for this specific reference field
    const errorKey = `references.${index}.${field}`
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const handleAddReference = () => {
    if (formData.references.length < 3) {
      setFormData(prev => ({
        ...prev,
        references: [
          ...prev.references,
          { name: '', designation: '', address: '', contact: '' }
        ]
      }))
    }
  }

  const handleRemoveReference = (index) => {
    // Always keep at least 1 reference
    if (formData.references.length > 1) {
      setFormData(prev => ({
        ...prev,
        references: prev.references.filter((_, i) => i !== index)
      }))
      
      // Clear errors for this reference
      setErrors(prev => {
        const newErrors = { ...prev }
        Object.keys(newErrors).forEach(key => {
          if (key.startsWith(`references.${index}.`)) {
            delete newErrors[key]
          }
        })
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // EPF validation
    if (formData.isEpfMember === 'Yes' && !formData.epfAccountNumber.trim()) {
      newErrors.epfAccountNumber = 'EPF account number is required'
    }

    // Background fields validation
    if (!formData.languagesKnown.trim()) {
      newErrors.languagesKnown = 'This field is required'
    }
    if (!formData.computerSkills.trim()) {
      newErrors.computerSkills = 'This field is required'
    }
    if (!formData.hobbies.trim()) {
      newErrors.hobbies = 'This field is required'
    }

    // References validation - at least first reference must be complete
    const firstRef = formData.references[0]
    if (!firstRef.name.trim()) {
      newErrors['references.0.name'] = 'Reference name is required'
    }
    if (!firstRef.designation.trim()) {
      newErrors['references.0.designation'] = 'Reference designation is required'
    }
    if (!firstRef.address.trim()) {
      newErrors['references.0.address'] = 'Reference address is required'
    }
    if (!firstRef.contact.trim()) {
      newErrors['references.0.contact'] = 'Reference contact is required'
    } else if (!/^[0-9]{10}$/.test(firstRef.contact)) {
      newErrors['references.0.contact'] = 'Enter a valid 10-digit phone number'
    }

    // Validate other references if they have any data
    formData.references.forEach((ref, index) => {
      if (index > 0) {
        const hasAnyData = ref.name || ref.designation || ref.address || ref.contact
        if (hasAnyData) {
          if (!ref.name.trim()) {
            newErrors[`references.${index}.name`] = 'Reference name is required'
          }
          if (!ref.designation.trim()) {
            newErrors[`references.${index}.designation`] = 'Reference designation is required'
          }
          if (!ref.address.trim()) {
            newErrors[`references.${index}.address`] = 'Reference address is required'
          }
          if (!ref.contact.trim()) {
            newErrors[`references.${index}.contact`] = 'Reference contact is required'
          } else if (!/^[0-9]{10}$/.test(ref.contact)) {
            newErrors[`references.${index}.contact`] = 'Enter a valid 10-digit phone number'
          }
        }
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
    // TODO: API call to POST /api/forms/general-info/:candidateId with status: 'Draft'
    setFormStatus('Draft')
    showToast('General information saved as draft')
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // TODO: API call to POST /api/forms/general-info/:candidateId with status: 'Submitted'
      setFormStatus('Submitted')
      showToast('General information submitted successfully!')
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
        <h1>General Information</h1>
        <span className={`status-badge status-${formStatus.toLowerCase()}`}>
          {formStatus}
        </span>
      </div>

      {/* Content */}
      <div className="form-content">
        <div className="form-card">
          {/* SECTION 1: EPF Details */}
          <h2 className="form-section-title">EPF Details</h2>
          <div className="form-grid">
            <div className="form-field">
              <label>
                Are you an EPF Member? <span className="required-star">*</span>
              </label>
              {isReadOnly ? (
                <p className="form-readonly-value">{formData.isEpfMember}</p>
              ) : (
                <div className="form-radio-group">
                  <div className="form-radio-option">
                    <input
                      type="radio"
                      id="epf-yes"
                      name="isEpfMember"
                      value="Yes"
                      checked={formData.isEpfMember === 'Yes'}
                      onChange={(e) => handleRadioChange('isEpfMember', e.target.value)}
                    />
                    <label htmlFor="epf-yes">Yes</label>
                  </div>
                  <div className="form-radio-option">
                    <input
                      type="radio"
                      id="epf-no"
                      name="isEpfMember"
                      value="No"
                      checked={formData.isEpfMember === 'No'}
                      onChange={(e) => handleRadioChange('isEpfMember', e.target.value)}
                    />
                    <label htmlFor="epf-no">No</label>
                  </div>
                </div>
              )}
            </div>

            {formData.isEpfMember === 'Yes' && (
              <div className="form-field">
                <label>
                  EPF Account Number <span className="required-star">*</span>
                </label>
                {isReadOnly ? (
                  <p className="form-readonly-value">{formData.epfAccountNumber || '—'}</p>
                ) : (
                  <>
                    <input
                      type="text"
                      name="epfAccountNumber"
                      value={formData.epfAccountNumber}
                      onChange={handleChange}
                      className={`form-input ${errors.epfAccountNumber ? 'error' : ''}`}
                      placeholder="Enter EPF account number"
                    />
                    {errors.epfAccountNumber && (
                      <span className="form-error">{errors.epfAccountNumber}</span>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* SECTION 2: Background */}
          <h2 className="form-section-title">Background</h2>
          <div className="form-grid">
            <div className="form-field form-grid-full">
              <label>
                Have you applied to Manipal Group before? <span className="required-star">*</span>
              </label>
              {isReadOnly ? (
                <p className="form-readonly-value">{formData.appliedBefore}</p>
              ) : (
                <div className="form-radio-group">
                  <div className="form-radio-option">
                    <input
                      type="radio"
                      id="applied-yes"
                      name="appliedBefore"
                      value="Yes"
                      checked={formData.appliedBefore === 'Yes'}
                      onChange={(e) => handleRadioChange('appliedBefore', e.target.value)}
                    />
                    <label htmlFor="applied-yes">Yes</label>
                  </div>
                  <div className="form-radio-option">
                    <input
                      type="radio"
                      id="applied-no"
                      name="appliedBefore"
                      value="No"
                      checked={formData.appliedBefore === 'No'}
                      onChange={(e) => handleRadioChange('appliedBefore', e.target.value)}
                    />
                    <label htmlFor="applied-no">No</label>
                  </div>
                </div>
              )}
            </div>

            <div className="form-field">
              <label>
                Languages Known <span className="required-star">*</span>
              </label>
              {isReadOnly ? (
                <p className="form-readonly-value">{formData.languagesKnown || '—'}</p>
              ) : (
                <>
                  <input
                    type="text"
                    name="languagesKnown"
                    value={formData.languagesKnown}
                    onChange={handleChange}
                    className={`form-input ${errors.languagesKnown ? 'error' : ''}`}
                    placeholder="e.g., English, Kannada, Hindi"
                  />
                  {errors.languagesKnown && (
                    <span className="form-error">{errors.languagesKnown}</span>
                  )}
                </>
              )}
            </div>

            <div className="form-field">
              <label>
                Computer Skills <span className="required-star">*</span>
              </label>
              {isReadOnly ? (
                <p className="form-readonly-value">{formData.computerSkills || '—'}</p>
              ) : (
                <>
                  <input
                    type="text"
                    name="computerSkills"
                    value={formData.computerSkills}
                    onChange={handleChange}
                    className={`form-input ${errors.computerSkills ? 'error' : ''}`}
                    placeholder="e.g., MS Office, Tally, AutoCAD"
                  />
                  {errors.computerSkills && (
                    <span className="form-error">{errors.computerSkills}</span>
                  )}
                </>
              )}
            </div>

            <div className="form-field">
              <label>
                Hobbies <span className="required-star">*</span>
              </label>
              {isReadOnly ? (
                <p className="form-readonly-value">{formData.hobbies || '—'}</p>
              ) : (
                <>
                  <input
                    type="text"
                    name="hobbies"
                    value={formData.hobbies}
                    onChange={handleChange}
                    className={`form-input ${errors.hobbies ? 'error' : ''}`}
                    placeholder="e.g., Reading, Sports, Music"
                  />
                  {errors.hobbies && (
                    <span className="form-error">{errors.hobbies}</span>
                  )}
                </>
              )}
            </div>

            <div className="form-field">
              <label>Professional Memberships (Optional)</label>
              {isReadOnly ? (
                <p className="form-readonly-value">{formData.professionalMemberships || '—'}</p>
              ) : (
                <input
                  type="text"
                  name="professionalMemberships"
                  value={formData.professionalMemberships}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g., IEEE, ACM"
                />
              )}
            </div>
          </div>

          {/* SECTION 3: References */}
          <h2 className="form-section-title">References</h2>
          <div className="references-section">
            {formData.references.map((reference, index) => (
              <div key={index} className="reference-item">
                <div className="reference-header">
                  <h3 className="reference-title">
                    Reference {index + 1}
                    {index === 0 && <span className="required-star">*</span>}
                  </h3>
                  {!isReadOnly && formData.references.length > 1 && (
                    <button
                      type="button"
                      className="remove-reference-btn"
                      onClick={() => handleRemoveReference(index)}
                      title="Remove this reference"
                    >
                      × Remove
                    </button>
                  )}
                </div>

                <div className="form-grid">
                  <div className="form-field">
                    <label>
                      Name {index === 0 && <span className="required-star">*</span>}
                    </label>
                    {isReadOnly ? (
                      <p className="form-readonly-value">{reference.name || '—'}</p>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={reference.name}
                          onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                          className={`form-input ${errors[`references.${index}.name`] ? 'error' : ''}`}
                          placeholder="Reference name"
                        />
                        {errors[`references.${index}.name`] && (
                          <span className="form-error">{errors[`references.${index}.name`]}</span>
                        )}
                      </>
                    )}
                  </div>

                  <div className="form-field">
                    <label>
                      Designation {index === 0 && <span className="required-star">*</span>}
                    </label>
                    {isReadOnly ? (
                      <p className="form-readonly-value">{reference.designation || '—'}</p>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={reference.designation}
                          onChange={(e) => handleReferenceChange(index, 'designation', e.target.value)}
                          className={`form-input ${errors[`references.${index}.designation`] ? 'error' : ''}`}
                          placeholder="e.g., Manager, Professor"
                        />
                        {errors[`references.${index}.designation`] && (
                          <span className="form-error">{errors[`references.${index}.designation`]}</span>
                        )}
                      </>
                    )}
                  </div>

                  <div className="form-field">
                    <label>
                      Contact Number {index === 0 && <span className="required-star">*</span>}
                    </label>
                    {isReadOnly ? (
                      <p className="form-readonly-value">{reference.contact || '—'}</p>
                    ) : (
                      <>
                        <input
                          type="tel"
                          value={reference.contact}
                          onChange={(e) => handleReferenceChange(index, 'contact', e.target.value)}
                          className={`form-input ${errors[`references.${index}.contact`] ? 'error' : ''}`}
                          placeholder="10-digit phone number"
                          maxLength={10}
                        />
                        {errors[`references.${index}.contact`] && (
                          <span className="form-error">{errors[`references.${index}.contact`]}</span>
                        )}
                      </>
                    )}
                  </div>

                  <div className="form-field form-grid-full">
                    <label>
                      Address {index === 0 && <span className="required-star">*</span>}
                    </label>
                    {isReadOnly ? (
                      <p className="form-readonly-value">{reference.address || '—'}</p>
                    ) : (
                      <>
                        <textarea
                          value={reference.address}
                          onChange={(e) => handleReferenceChange(index, 'address', e.target.value)}
                          className={`form-textarea ${errors[`references.${index}.address`] ? 'error' : ''}`}
                          placeholder="Complete address"
                          rows={3}
                        />
                        {errors[`references.${index}.address`] && (
                          <span className="form-error">{errors[`references.${index}.address`]}</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {!isReadOnly && (
              <div className="add-reference-section">
                {formData.references.length < 3 ? (
                  <button
                    type="button"
                    className="add-reference-btn"
                    onClick={handleAddReference}
                  >
                    + Add Reference
                  </button>
                ) : (
                  <div className="max-references-message">
                    Maximum 3 references allowed
                  </div>
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

export default GeneralInfoForm
