import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import usePageTitle from '../../../usePageTitle'
import './forms-shared.css'
import './FamilyDetailsForm.css'

function FamilyDetailsForm() {
  usePageTitle("Family Details | MTL HR Onboard");
  
  const navigate = useNavigate()
  
  const [formStatus, setFormStatus] = useState('Pending')
  const [formData, setFormData] = useState({
    fatherName: '',
    fatherOccupation: '',
    fatherAge: '',
    motherName: '',
    motherOccupation: '',
    motherAge: '',
    maritalStatus: 'Single',
    spouseName: '',
    spouseOccupation: '',
    spouseAge: '',
    numberOfChildren: '',
    children: [],
    annualFamilyIncome: ''
  })
  
  const [toast, setToast] = useState({ show: false, message: '' })
  const [showExitBanner, setShowExitBanner] = useState(false)

  // TODO: GET /api/forms/family-details/:candidateId — load existing data on mount
  useEffect(() => {
    // Mock data load - replace with actual API call
    // const candidateId = localStorage.getItem('candidateId')
    // fetch(`/api/forms/family-details/${candidateId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setFormData(data.formData)
    //     setFormStatus(data.status)
    //   })
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Mark as draft if user is editing and form was pending
    if (formStatus === 'Pending') {
      setFormStatus('Draft')
    }
  }

  const handleMaritalStatusChange = (e) => {
    const { value } = e.target
    setFormData(prev => ({
      ...prev,
      maritalStatus: value,
      // Clear spouse and children fields when switching to Single
      ...(value === 'Single' && {
        spouseName: '',
        spouseOccupation: '',
        spouseAge: '',
        numberOfChildren: '',
        children: []
      })
    }))
    
    // Mark as draft if user is editing and form was pending
    if (formStatus === 'Pending') {
      setFormStatus('Draft')
    }
  }

  const handleAddChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { name: '', age: '', gender: '' }]
    }))
  }

  const handleRemoveChild = (index) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }))
  }

  const handleChildChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.map((child, i) =>
        i === index ? { ...child, [field]: value } : child
      )
    }))
  }

  const showToast = (message) => {
    setToast({ show: true, message })
    setTimeout(() => {
      setToast({ show: false, message: '' })
    }, 3000)
  }

  const handleSaveAsDraft = () => {
    setFormStatus('Draft')
    showToast('Saved as draft')
    
    // TODO: POST /api/forms/family-details/:candidateId — save/submit
    // const candidateId = localStorage.getItem('candidateId')
    // fetch(`/api/forms/family-details/${candidateId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ formData, status: 'Draft' })
    // })
  }

  const handleSubmit = () => {
    setFormStatus('Submitted')
    showToast('Form submitted successfully')
    
    // TODO: POST /api/forms/family-details/:candidateId — save/submit
    // const candidateId = localStorage.getItem('candidateId')
    // fetch(`/api/forms/family-details/${candidateId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ formData, status: 'Submitted' })
    // })
  }

  const handleBackClick = () => {
    if (formStatus === 'Draft') {
      setShowExitBanner(true)
    } else {
      navigate('/candidate/dashboard')
    }
  }

  const handleSaveAndExit = () => {
    handleSaveAsDraft()
    setTimeout(() => {
      navigate('/candidate/dashboard')
    }, 500)
  }

  const handleLeaveWithoutSaving = () => {
    navigate('/candidate/dashboard')
  }

  const isReadOnly = formStatus === 'Approved'
  const isMarried = formData.maritalStatus === 'Married'

  return (
    <div className="family-details-form">
      {/* Header Bar */}
      <div className="form-header-bar">
        <button className="back-button" onClick={handleBackClick}>
          ← Back
        </button>
        <h1 className="form-title">Family Details</h1>
        <span className={`status-badge status-${formStatus.toLowerCase()}`}>
          {formStatus}
        </span>
      </div>

      {/* Exit Confirmation Banner */}
      {showExitBanner && (
        <div className="exit-banner">
          <span>You have unsaved changes. </span>
          <button className="save-exit-button" onClick={handleSaveAndExit}>
            Save as Draft
          </button>
          <button className="leave-button" onClick={handleLeaveWithoutSaving}>
            Leave without saving
          </button>
        </div>
      )}

      {/* Approved Lock Banner */}
      {isReadOnly && (
        <div className="lock-banner">
          <span>ℹ️</span>
          <span>This form has been approved and is locked.</span>
        </div>
      )}

      {/* Main Content */}
      <div className="form-content">
        <div className="form-card">
          {/* Section 1: Parents */}
          <h2 className="section-title">Parent Details</h2>
          <div className="form-grid">
            {/* Father Name */}
            <div className="form-field">
              <label className="field-label">Father Name</label>
              {isReadOnly ? (
                <p className="read-only-value">{formData.fatherName || '—'}</p>
              ) : (
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  className="field-input"
                  placeholder="Enter father's name"
                />
              )}
            </div>

            {/* Father Occupation */}
            <div className="form-field">
              <label className="field-label">Father Occupation</label>
              {isReadOnly ? (
                <p className="read-only-value">{formData.fatherOccupation || '—'}</p>
              ) : (
                <input
                  type="text"
                  name="fatherOccupation"
                  value={formData.fatherOccupation}
                  onChange={handleInputChange}
                  className="field-input"
                  placeholder="Enter father's occupation"
                />
              )}
            </div>

            {/* Father Age */}
            <div className="form-field">
              <label className="field-label">Father Age</label>
              {isReadOnly ? (
                <p className="read-only-value">{formData.fatherAge ? `${formData.fatherAge} years` : '—'}</p>
              ) : (
                <input
                  type="number"
                  name="fatherAge"
                  value={formData.fatherAge}
                  onChange={handleInputChange}
                  className="field-input"
                  placeholder="Enter age"
                  min="0"
                  max="120"
                />
              )}
            </div>

            {/* Mother Name */}
            <div className="form-field">
              <label className="field-label">Mother Name</label>
              {isReadOnly ? (
                <p className="read-only-value">{formData.motherName || '—'}</p>
              ) : (
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  className="field-input"
                  placeholder="Enter mother's name"
                />
              )}
            </div>

            {/* Mother Occupation */}
            <div className="form-field">
              <label className="field-label">Mother Occupation</label>
              {isReadOnly ? (
                <p className="read-only-value">{formData.motherOccupation || '—'}</p>
              ) : (
                <input
                  type="text"
                  name="motherOccupation"
                  value={formData.motherOccupation}
                  onChange={handleInputChange}
                  className="field-input"
                  placeholder="Enter mother's occupation"
                />
              )}
            </div>

            {/* Mother Age */}
            <div className="form-field">
              <label className="field-label">Mother Age</label>
              {isReadOnly ? (
                <p className="read-only-value">{formData.motherAge ? `${formData.motherAge} years` : '—'}</p>
              ) : (
                <input
                  type="number"
                  name="motherAge"
                  value={formData.motherAge}
                  onChange={handleInputChange}
                  className="field-input"
                  placeholder="Enter age"
                  min="0"
                  max="120"
                />
              )}
            </div>
          </div>

          {/* Section 2: Marital Status Toggle and Spouse & Children */}
          <h2 className="section-title">Marital Status</h2>
          <div className="marital-status-toggle">
            {isReadOnly ? (
              <p className="read-only-value">{formData.maritalStatus}</p>
            ) : (
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="Single"
                    checked={formData.maritalStatus === 'Single'}
                    onChange={handleMaritalStatusChange}
                  />
                  <span>Single</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="maritalStatus"
                    value="Married"
                    checked={formData.maritalStatus === 'Married'}
                    onChange={handleMaritalStatusChange}
                  />
                  <span>Married</span>
                </label>
              </div>
            )}
          </div>

          {/* Spouse & Children Section (only when married) */}
          {isMarried && (
            <>
              <h2 className="section-title">Spouse & Children Details</h2>
              <div className="form-grid">
                {/* Spouse Name */}
                <div className="form-field">
                  <label className="field-label">Spouse Name</label>
                  {isReadOnly ? (
                    <p className="read-only-value">{formData.spouseName || '—'}</p>
                  ) : (
                    <input
                      type="text"
                      name="spouseName"
                      value={formData.spouseName}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder="Enter spouse's name"
                    />
                  )}
                </div>

                {/* Spouse Occupation */}
                <div className="form-field">
                  <label className="field-label">Spouse Occupation</label>
                  {isReadOnly ? (
                    <p className="read-only-value">{formData.spouseOccupation || '—'}</p>
                  ) : (
                    <input
                      type="text"
                      name="spouseOccupation"
                      value={formData.spouseOccupation}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder="Enter spouse's occupation"
                    />
                  )}
                </div>

                {/* Spouse Age */}
                <div className="form-field">
                  <label className="field-label">Spouse Age</label>
                  {isReadOnly ? (
                    <p className="read-only-value">{formData.spouseAge ? `${formData.spouseAge} years` : '—'}</p>
                  ) : (
                    <input
                      type="number"
                      name="spouseAge"
                      value={formData.spouseAge}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder="Enter age"
                      min="0"
                      max="120"
                    />
                  )}
                </div>

                {/* Number of Children */}
                <div className="form-field">
                  <label className="field-label">Number of Children</label>
                  {isReadOnly ? (
                    <p className="read-only-value">{formData.numberOfChildren || '0'}</p>
                  ) : (
                    <input
                      type="number"
                      name="numberOfChildren"
                      value={formData.numberOfChildren}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder="Enter number"
                      min="0"
                      max="20"
                    />
                  )}
                </div>
              </div>

              {/* Children Details */}
              <div className="children-section">
                <label className="field-label">Children Details</label>
                {formData.children.length === 0 && !isReadOnly && (
                  <p className="no-children-text">No children added yet</p>
                )}
                {formData.children.length === 0 && isReadOnly && (
                  <p className="read-only-value">—</p>
                )}
                {formData.children.map((child, index) => (
                  <div key={index} className="child-row">
                    <div className="child-field">
                      <label className="child-label">Child Name</label>
                      {isReadOnly ? (
                        <p className="read-only-value">{child.name || '—'}</p>
                      ) : (
                        <input
                          type="text"
                          value={child.name}
                          onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                          className="field-input"
                          placeholder="Name"
                        />
                      )}
                    </div>
                    <div className="child-field">
                      <label className="child-label">Child Age</label>
                      {isReadOnly ? (
                        <p className="read-only-value">{child.age ? `${child.age} years` : '—'}</p>
                      ) : (
                        <input
                          type="number"
                          value={child.age}
                          onChange={(e) => handleChildChange(index, 'age', e.target.value)}
                          className="field-input"
                          placeholder="Age"
                          min="0"
                          max="100"
                        />
                      )}
                    </div>
                    <div className="child-field">
                      <label className="child-label">Child Gender</label>
                      {isReadOnly ? (
                        <p className="read-only-value">{child.gender || '—'}</p>
                      ) : (
                        <select
                          value={child.gender}
                          onChange={(e) => handleChildChange(index, 'gender', e.target.value)}
                          className="field-input"
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      )}
                    </div>
                    {!isReadOnly && (
                      <button
                        type="button"
                        className="remove-child-button"
                        onClick={() => handleRemoveChild(index)}
                        title="Remove child"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {!isReadOnly && (
                  <button type="button" className="add-child-button" onClick={handleAddChild}>
                    + Add Child
                  </button>
                )}
              </div>
            </>
          )}

          {/* Section 3: Financial */}
          <h2 className="section-title">Financial Details</h2>
          <div className="form-grid">
            <div className="form-field">
              <label className="field-label">Annual Family Income</label>
              {isReadOnly ? (
                <p className="read-only-value">{formData.annualFamilyIncome || '—'}</p>
              ) : (
                <input
                  type="text"
                  name="annualFamilyIncome"
                  value={formData.annualFamilyIncome}
                  onChange={handleInputChange}
                  className="field-input"
                  placeholder="e.g., 5-10 Lakhs"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bar */}
      {!isReadOnly && (
        <div className="form-footer-bar">
          <button className="draft-button" onClick={handleSaveAsDraft}>
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

export default FamilyDetailsForm
