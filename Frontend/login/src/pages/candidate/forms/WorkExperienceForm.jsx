import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './forms-shared.css'
import './WorkExperienceForm.css'

function WorkExperienceForm() {
  const navigate = useNavigate()
  
  const [formStatus, setFormStatus] = useState('Pending')
  const [activeTab, setActiveTab] = useState('summary')
  const [formData, setFormData] = useState({
    // Summary Tab
    employmentType: '',
    totalExperience: '',
    employmentGap: 'No',
    gapFromDate: '',
    gapToDate: '',
    gapJustification: '',
    expectedSalary: '',
    selectedInOtherCompanies: 'No',
    otherCompanyDetails: '',
    joiningTimeRequired: '',
    
    // Employment History Tab
    employers: [
      {
        employerName: '',
        employerAddress: '',
        fromDate: '',
        currentlyWorking: false,
        toDate: '',
        designation: '',
        natureOfWork: '',
        reasonForLeaving: '',
        salary: ''
      }
    ]
  })
  
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState({ show: false, message: '' })

  // TODO: GET /api/forms/work-experience/:candidateId — load existing data on mount
  useEffect(() => {
    // Mock data load - replace with actual API call
    // const candidateId = localStorage.getItem('candidateId')
    // fetch(`/api/forms/work-experience/${candidateId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setFormData(data.formData)
    //     setFormStatus(data.status)
    //   })
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    
    setFormData(prev => ({ ...prev, [name]: newValue }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Clear Employment History errors when switching to Fresher
    if (name === 'employmentType' && value === 'Fresher') {
      const newErrors = { ...errors }
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith('employer')) {
          delete newErrors[key]
        }
      })
      setErrors(newErrors)
    }
  }

  const handleEmployerChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      employers: prev.employers.map((employer, i) =>
        i === index ? { ...employer, [field]: value } : employer
      )
    }))
    
    // Clear error
    if (errors[`employer${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`employer${index}_${field}`]: '' }))
    }
  }

  const handleCurrentlyWorkingChange = (index, checked) => {
    setFormData(prev => ({
      ...prev,
      employers: prev.employers.map((employer, i) =>
        i === index ? { ...employer, currentlyWorking: checked, toDate: checked ? '' : employer.toDate } : employer
      )
    }))
    
    // Clear toDate error if currently working
    if (checked && errors[`employer${index}_toDate`]) {
      setErrors(prev => ({ ...prev, [`employer${index}_toDate`]: '' }))
    }
  }

  const addEmployer = () => {
    setFormData(prev => ({
      ...prev,
      employers: [
        ...prev.employers,
        {
          employerName: '',
          employerAddress: '',
          fromDate: '',
          currentlyWorking: false,
          toDate: '',
          designation: '',
          natureOfWork: '',
          reasonForLeaving: '',
          salary: ''
        }
      ]
    }))
  }

  const removeEmployer = (index) => {
    if (formData.employers.length > 1) {
      setFormData(prev => ({
        ...prev,
        employers: prev.employers.filter((_, i) => i !== index)
      }))
      
      // Remove related errors
      const newErrors = { ...errors }
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`employer${index}_`)) {
          delete newErrors[key]
        }
      })
      setErrors(newErrors)
    }
  }

  const validateSummaryTab = () => {
    const newErrors = {}
    
    // Employment Type is mandatory
    if (!formData.employmentType) {
      newErrors.employmentType = 'Please select employment type'
    }
    
    // Total Experience mandatory if Experienced
    if (formData.employmentType === 'Experienced' && !formData.totalExperience.trim()) {
      newErrors.totalExperience = 'Please enter total experience'
    }
    
    // Employment Gap validation
    if (formData.employmentGap === 'Yes') {
      if (!formData.gapFromDate) {
        newErrors.gapFromDate = 'Please enter gap start date'
      }
      if (!formData.gapToDate) {
        newErrors.gapToDate = 'Please enter gap end date'
      }
      if (!formData.gapJustification.trim()) {
        newErrors.gapJustification = 'Please provide justification'
      } else if (formData.gapJustification.trim().length < 20) {
        newErrors.gapJustification = 'Justification must be at least 20 characters'
      }
      
      // Gap To Date must be after Gap From Date
      if (formData.gapFromDate && formData.gapToDate) {
        const fromDate = new Date(formData.gapFromDate)
        const toDate = new Date(formData.gapToDate)
        if (toDate <= fromDate) {
          newErrors.gapToDate = 'End date must be after start date'
        }
      }
    }
    
    // Other Company Details mandatory if Yes
    if (formData.selectedInOtherCompanies === 'Yes' && !formData.otherCompanyDetails.trim()) {
      newErrors.otherCompanyDetails = 'Please provide details'
    }
    
    return newErrors
  }

  const validateEmploymentHistory = () => {
    const newErrors = {}
    
    // Only validate if Experienced
    if (formData.employmentType === 'Experienced') {
      formData.employers.forEach((employer, index) => {
        if (!employer.employerName.trim()) {
          newErrors[`employer${index}_employerName`] = 'Required'
        }
        if (!employer.employerAddress.trim()) {
          newErrors[`employer${index}_employerAddress`] = 'Required'
        }
        if (!employer.fromDate) {
          newErrors[`employer${index}_fromDate`] = 'Required'
        }
        if (!employer.currentlyWorking && !employer.toDate) {
          newErrors[`employer${index}_toDate`] = 'Required'
        }
        if (!employer.designation.trim()) {
          newErrors[`employer${index}_designation`] = 'Required'
        }
      })
    }
    
    return newErrors
  }

  const validateForm = () => {
    const summaryErrors = validateSummaryTab()
    const historyErrors = validateEmploymentHistory()
    
    return { ...summaryErrors, ...historyErrors }
  }

  const showToast = (message) => {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  const handleSaveDraft = () => {
    // TODO: POST /api/forms/work-experience/draft — save as draft
    // const candidateId = localStorage.getItem('candidateId')
    // fetch('/api/forms/work-experience/draft', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ candidateId, formData })
    // })
    //   .then(res => res.json())
    //   .then(() => {
    //     setFormStatus('Draft')
    //     showToast('Draft saved successfully!')
    //   })
    
    setFormStatus('Draft')
    showToast('Draft saved successfully!')
  }

  const handleSubmit = () => {
    const validationErrors = validateForm()
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      
      // Switch to appropriate tab if there are errors
      const hasSummaryErrors = Object.keys(validationErrors).some(
        key => !key.startsWith('employer')
      )
      const hasHistoryErrors = Object.keys(validationErrors).some(
        key => key.startsWith('employer')
      )
      
      if (hasSummaryErrors) {
        setActiveTab('summary')
        showToast('Please fix all validation errors')
      } else if (hasHistoryErrors) {
        setActiveTab('history')
        showToast('Please fix all validation errors in Employment History')
      }
      return
    }
    
    // TODO: POST /api/forms/work-experience/submit — submit form
    // const candidateId = localStorage.getItem('candidateId')
    // fetch('/api/forms/work-experience/submit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ candidateId, formData })
    // })
    //   .then(res => res.json())
    //   .then(() => {
    //     setFormStatus('Submitted')
    //     showToast('Form submitted successfully!')
    //     setTimeout(() => navigate('/candidate/dashboard'), 2000)
    //   })
    
    setFormStatus('Submitted')
    showToast('Form submitted successfully!')
    setTimeout(() => navigate('/candidate/dashboard'), 2000)
  }

  const isReadOnly = formStatus === 'Approved'

  return (
    <div className="work-experience-form">
      {/* Header Bar */}
      <div className="form-header-bar">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="form-title">Work Experience Details</h1>
        <span className={`status-badge status-${formStatus.toLowerCase()}`}>
          {formStatus}
        </span>
      </div>

      {/* Lock Banner */}
      {isReadOnly && (
        <div className="lock-banner">
          🔒 This form has been approved and cannot be edited
        </div>
      )}

      {/* Main Content */}
      <div className="form-content">
        <div className="form-card">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
            {formData.employmentType === 'Fresher' ? (
              <div className="tab-button disabled" title="Not applicable for Freshers">
                Employment History
              </div>
            ) : (
              <button
                className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
                disabled={!formData.employmentType}
              >
                Employment History
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="summary-tab">
                <div className="form-grid">
                  {/* Employment Type */}
                  <div className="form-field">
                    <label className="field-label">
                      Employment Type <span className="required">*</span>
                    </label>
                    {isReadOnly ? (
                      <p className="read-only-value">{formData.employmentType || '-'}</p>
                    ) : (
                      <>
                        <select
                          name="employmentType"
                          value={formData.employmentType}
                          onChange={handleInputChange}
                          className={`field-input ${errors.employmentType ? 'error' : ''}`}
                        >
                          <option value="">Select...</option>
                          <option value="Fresher">Fresher</option>
                          <option value="Experienced">Experienced</option>
                        </select>
                        {errors.employmentType && (
                          <span className="error-message">{errors.employmentType}</span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Total Experience - only if Experienced */}
                  {formData.employmentType === 'Experienced' && (
                    <div className="form-field">
                      <label className="field-label">
                        Total Experience <span className="required">*</span>
                      </label>
                      {isReadOnly ? (
                        <p className="read-only-value">{formData.totalExperience || '-'}</p>
                      ) : (
                        <>
                          <input
                            type="text"
                            name="totalExperience"
                            value={formData.totalExperience}
                            onChange={handleInputChange}
                            placeholder="e.g., 3 years 2 months"
                            className={`field-input ${errors.totalExperience ? 'error' : ''}`}
                          />
                          {errors.totalExperience && (
                            <span className="error-message">{errors.totalExperience}</span>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Employment Gap */}
                  <div className="form-field full-width">
                    <label className="field-label">Employment Gap</label>
                    {isReadOnly ? (
                      <p className="read-only-value">{formData.employmentGap}</p>
                    ) : (
                      <div className="radio-group">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="employmentGap"
                            value="No"
                            checked={formData.employmentGap === 'No'}
                            onChange={handleInputChange}
                          />
                          No
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="employmentGap"
                            value="Yes"
                            checked={formData.employmentGap === 'Yes'}
                            onChange={handleInputChange}
                          />
                          Yes
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Gap Details - only if Yes */}
                  {formData.employmentGap === 'Yes' && (
                    <>
                      <div className="form-field">
                        <label className="field-label">Gap From Date</label>
                        {isReadOnly ? (
                          <p className="read-only-value">{formData.gapFromDate || '-'}</p>
                        ) : (
                          <>
                            <input
                              type="date"
                              name="gapFromDate"
                              value={formData.gapFromDate}
                              onChange={handleInputChange}
                              className={`field-input ${errors.gapFromDate ? 'error' : ''}`}
                            />
                            {errors.gapFromDate && (
                              <span className="error-message">{errors.gapFromDate}</span>
                            )}
                          </>
                        )}
                      </div>

                      <div className="form-field">
                        <label className="field-label">Gap To Date</label>
                        {isReadOnly ? (
                          <p className="read-only-value">{formData.gapToDate || '-'}</p>
                        ) : (
                          <>
                            <input
                              type="date"
                              name="gapToDate"
                              value={formData.gapToDate}
                              onChange={handleInputChange}
                              className={`field-input ${errors.gapToDate ? 'error' : ''}`}
                            />
                            {errors.gapToDate && (
                              <span className="error-message">{errors.gapToDate}</span>
                            )}
                          </>
                        )}
                      </div>

                      <div className="form-field full-width">
                        <label className="field-label">Gap Justification (min 20 characters)</label>
                        {isReadOnly ? (
                          <p className="read-only-value">{formData.gapJustification || '-'}</p>
                        ) : (
                          <>
                            <textarea
                              name="gapJustification"
                              value={formData.gapJustification}
                              onChange={handleInputChange}
                              placeholder="Explain the reason for employment gap..."
                              className={`field-input ${errors.gapJustification ? 'error' : ''}`}
                            />
                            {errors.gapJustification && (
                              <span className="error-message">{errors.gapJustification}</span>
                            )}
                          </>
                        )}
                      </div>
                    </>
                  )}

                  {/* Expected Salary */}
                  <div className="form-field">
                    <label className="field-label">Expected Salary</label>
                    {isReadOnly ? (
                      <p className="read-only-value">{formData.expectedSalary || '-'}</p>
                    ) : (
                      <input
                        type="text"
                        name="expectedSalary"
                        value={formData.expectedSalary}
                        onChange={handleInputChange}
                        placeholder="e.g., 6 LPA"
                        className="field-input"
                      />
                    )}
                  </div>

                  {/* Selected in Other Companies */}
                  <div className="form-field">
                    <label className="field-label">Selected in Other Companies?</label>
                    {isReadOnly ? (
                      <p className="read-only-value">{formData.selectedInOtherCompanies}</p>
                    ) : (
                      <div className="radio-group">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="selectedInOtherCompanies"
                            value="No"
                            checked={formData.selectedInOtherCompanies === 'No'}
                            onChange={handleInputChange}
                          />
                          No
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="selectedInOtherCompanies"
                            value="Yes"
                            checked={formData.selectedInOtherCompanies === 'Yes'}
                            onChange={handleInputChange}
                          />
                          Yes
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Other Company Details - only if Yes */}
                  {formData.selectedInOtherCompanies === 'Yes' && (
                    <div className="form-field full-width">
                      <label className="field-label">Other Company Details</label>
                      {isReadOnly ? (
                        <p className="read-only-value">{formData.otherCompanyDetails || '-'}</p>
                      ) : (
                        <>
                          <textarea
                            name="otherCompanyDetails"
                            value={formData.otherCompanyDetails}
                            onChange={handleInputChange}
                            placeholder="Provide details about other companies..."
                            className={`field-input ${errors.otherCompanyDetails ? 'error' : ''}`}
                          />
                          {errors.otherCompanyDetails && (
                            <span className="error-message">{errors.otherCompanyDetails}</span>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Joining Time Required */}
                  <div className="form-field">
                    <label className="field-label">Joining Time Required</label>
                    {isReadOnly ? (
                      <p className="read-only-value">{formData.joiningTimeRequired || '-'}</p>
                    ) : (
                      <input
                        type="text"
                        name="joiningTimeRequired"
                        value={formData.joiningTimeRequired}
                        onChange={handleInputChange}
                        placeholder="e.g., 30 days, Immediate"
                        className="field-input"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Employment History Tab */}
            {activeTab === 'history' && formData.employmentType === 'Experienced' && (
              <div className="history-tab">
                {formData.employers.map((employer, index) => (
                  <div key={index} className="employer-entry">
                    <div className="employer-entry-header">
                      <h3 className="employer-entry-title">Employer {index + 1}</h3>
                      {!isReadOnly && formData.employers.length > 1 && (
                        <button
                          className="remove-employer-button"
                          onClick={() => removeEmployer(index)}
                          title="Remove employer"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <div className="form-grid">
                      {/* Employer Name */}
                      <div className="form-field">
                        <label className="field-label">
                          Employer Name <span className="required">*</span>
                        </label>
                        {isReadOnly ? (
                          <p className="read-only-value">{employer.employerName || '-'}</p>
                        ) : (
                          <>
                            <input
                              type="text"
                              value={employer.employerName}
                              onChange={(e) => handleEmployerChange(index, 'employerName', e.target.value)}
                              className={`field-input ${errors[`employer${index}_employerName`] ? 'error' : ''}`}
                            />
                            {errors[`employer${index}_employerName`] && (
                              <span className="error-message">{errors[`employer${index}_employerName`]}</span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Employer Address */}
                      <div className="form-field full-width">
                        <label className="field-label">
                          Employer Address <span className="required">*</span>
                        </label>
                        {isReadOnly ? (
                          <p className="read-only-value">{employer.employerAddress || '-'}</p>
                        ) : (
                          <>
                            <textarea
                              value={employer.employerAddress}
                              onChange={(e) => handleEmployerChange(index, 'employerAddress', e.target.value)}
                              className={`field-input ${errors[`employer${index}_employerAddress`] ? 'error' : ''}`}
                            />
                            {errors[`employer${index}_employerAddress`] && (
                              <span className="error-message">{errors[`employer${index}_employerAddress`]}</span>
                            )}
                          </>
                        )}
                      </div>

                      {/* From Date */}
                      <div className="form-field">
                        <label className="field-label">
                          From Date <span className="required">*</span>
                        </label>
                        {isReadOnly ? (
                          <p className="read-only-value">{employer.fromDate || '-'}</p>
                        ) : (
                          <>
                            <input
                              type="date"
                              value={employer.fromDate}
                              onChange={(e) => handleEmployerChange(index, 'fromDate', e.target.value)}
                              className={`field-input ${errors[`employer${index}_fromDate`] ? 'error' : ''}`}
                            />
                            {errors[`employer${index}_fromDate`] && (
                              <span className="error-message">{errors[`employer${index}_fromDate`]}</span>
                            )}
                          </>
                        )}
                      </div>

                      {/* To Date & Currently Working */}
                      <div className="form-field">
                        <label className="field-label">
                          To Date {!employer.currentlyWorking && <span className="required">*</span>}
                        </label>
                        {isReadOnly ? (
                          <p className="read-only-value">
                            {employer.currentlyWorking ? 'Currently Working' : employer.toDate || '-'}
                          </p>
                        ) : (
                          <>
                            <input
                              type="date"
                              value={employer.toDate}
                              onChange={(e) => handleEmployerChange(index, 'toDate', e.target.value)}
                              disabled={employer.currentlyWorking}
                              className={`field-input ${errors[`employer${index}_toDate`] ? 'error' : ''}`}
                            />
                            {errors[`employer${index}_toDate`] && (
                              <span className="error-message">{errors[`employer${index}_toDate`]}</span>
                            )}
                            <label className="checkbox-label" style={{ marginTop: '8px' }}>
                              <input
                                type="checkbox"
                                checked={employer.currentlyWorking}
                                onChange={(e) => handleCurrentlyWorkingChange(index, e.target.checked)}
                              />
                              Currently Working
                            </label>
                          </>
                        )}
                      </div>

                      {/* Designation */}
                      <div className="form-field">
                        <label className="field-label">
                          Designation <span className="required">*</span>
                        </label>
                        {isReadOnly ? (
                          <p className="read-only-value">{employer.designation || '-'}</p>
                        ) : (
                          <>
                            <input
                              type="text"
                              value={employer.designation}
                              onChange={(e) => handleEmployerChange(index, 'designation', e.target.value)}
                              className={`field-input ${errors[`employer${index}_designation`] ? 'error' : ''}`}
                            />
                            {errors[`employer${index}_designation`] && (
                              <span className="error-message">{errors[`employer${index}_designation`]}</span>
                            )}
                          </>
                        )}
                      </div>

                      {/* Nature of Work */}
                      <div className="form-field">
                        <label className="field-label">Nature of Work</label>
                        {isReadOnly ? (
                          <p className="read-only-value">{employer.natureOfWork || '-'}</p>
                        ) : (
                          <input
                            type="text"
                            value={employer.natureOfWork}
                            onChange={(e) => handleEmployerChange(index, 'natureOfWork', e.target.value)}
                            className="field-input"
                          />
                        )}
                      </div>

                      {/* Reason for Leaving - hidden if currently working */}
                      {!employer.currentlyWorking && (
                        <div className="form-field">
                          <label className="field-label">Reason for Leaving</label>
                          {isReadOnly ? (
                            <p className="read-only-value">{employer.reasonForLeaving || '-'}</p>
                          ) : (
                            <input
                              type="text"
                              value={employer.reasonForLeaving}
                              onChange={(e) => handleEmployerChange(index, 'reasonForLeaving', e.target.value)}
                              className="field-input"
                            />
                          )}
                        </div>
                      )}

                      {/* Salary */}
                      <div className="form-field">
                        <label className="field-label">Salary</label>
                        {isReadOnly ? (
                          <p className="read-only-value">{employer.salary || '-'}</p>
                        ) : (
                          <input
                            type="text"
                            value={employer.salary}
                            onChange={(e) => handleEmployerChange(index, 'salary', e.target.value)}
                            placeholder="e.g., 5 LPA"
                            className="field-input"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Employer Button */}
                {!isReadOnly && (
                  <button className="add-employer-button" onClick={addEmployer}>
                    + Add Employer
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      {!isReadOnly && (
        <div className="form-footer-bar">
          <button className="draft-button" onClick={handleSaveDraft}>
            Save as Draft
          </button>
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className="toast-notification">
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default WorkExperienceForm
