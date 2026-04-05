import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './forms-shared.css'
import './PersonalInfoForm.css'

function PersonalInfoForm() {
  const navigate = useNavigate()
  
  const [formStatus, setFormStatus] = useState('Pending')
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    age: '',
    placeOfBirth: '',
    state: '',
    pincode: '',
    maritalStatus: '',
    signatureFile: null,
    signaturePreview: null,
    signatureFilename: '',
    signatureSize: ''
  })
  
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState({ show: false, message: '' })

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ]

  // TODO: GET /api/forms/personal-info/:candidateId — load existing data on mount
  useEffect(() => {
    // Mock data load - replace with actual API call
    // const candidateId = localStorage.getItem('candidateId')
    // fetch(`/api/forms/personal-info/${candidateId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setFormData(data.formData)
    //     setFormStatus(data.status)
    //   })
  }, [])

  // Calculate age from date of birth
  useEffect(() => {
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      let calculatedAge = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--
      }
      
      setFormData(prev => ({ ...prev, age: calculatedAge.toString() }))
    }
  }, [formData.dateOfBirth])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          signatureFile: file,
          signaturePreview: reader.result,
          signatureFilename: file.name,
          signatureSize: (file.size / 1024).toFixed(2) + ' KB'
        }))
      }
      reader.readAsDataURL(file)
      
      if (errors.signatureFile) {
        setErrors(prev => ({ ...prev, signatureFile: '' }))
      }
    }
  }

  const handleRemoveSignature = () => {
    setFormData(prev => ({
      ...prev,
      signatureFile: null,
      signaturePreview: null,
      signatureFilename: '',
      signatureSize: ''
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'This field is required'
    }
    
    if (!formData.gender) {
      newErrors.gender = 'This field is required'
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'This field is required'
    }
    
    if (!formData.placeOfBirth.trim()) {
      newErrors.placeOfBirth = 'This field is required'
    }
    
    if (!formData.state) {
      newErrors.state = 'This field is required'
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'This field is required'
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be exactly 6 digits'
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
    setFormStatus('Draft')
    showToast('Saved as draft')
    
    // TODO: POST /api/forms/personal-info/:candidateId — save/submit
    // const candidateId = localStorage.getItem('candidateId')
    // fetch(`/api/forms/personal-info/${candidateId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ formData, status: 'Draft' })
    // })
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }
    
    setFormStatus('Submitted')
    showToast('Form submitted successfully')
    
    // TODO: POST /api/forms/personal-info/:candidateId — save/submit
    // const candidateId = localStorage.getItem('candidateId')
    // fetch(`/api/forms/personal-info/${candidateId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ formData, status: 'Submitted' })
    // })
  }

  const isReadOnly = formStatus === 'Approved'

  return (
    <div className="personal-info-form">
      {/* Header Bar */}
      <div className="form-header-bar">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="form-title">Personal Information</h1>
        <span className={`status-badge status-${formStatus.toLowerCase()}`}>
          {formStatus}
        </span>
      </div>

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
          <div className="form-grid">
            {/* Full Name */}
            <div className="form-field">
              <label className="field-label">
                Full Name As Per Records <span className="required">*</span>
              </label>
              {isReadOnly ? (
                <p className="read-only-value">{formData.fullName || '—'}</p>
              ) : (
                <>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`field-input ${errors.fullName ? 'error' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </>
              )}
            </div>

            {/* Gender */}
            <div className="form-field">
              <label className="field-label">
                Gender <span className="required">*</span>
              </label>
              {isReadOnly ? (
                <p className="read-only-value">{formData.gender || '—'}</p>
              ) : (
                <>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`field-input ${errors.gender ? 'error' : ''}`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <span className="error-message">{errors.gender}</span>}
                </>
              )}
            </div>

            {/* Date of Birth */}
            <div className="form-field">
              <label className="field-label">
                Date of Birth <span className="required">*</span>
              </label>
              {isReadOnly ? (
                <p className="read-only-value">{formData.dateOfBirth || '—'}</p>
              ) : (
                <>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={`field-input ${errors.dateOfBirth ? 'error' : ''}`}
                  />
                  {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
                </>
              )}
            </div>

            {/* Age (Read-only) */}
            <div className="form-field">
              <label className="field-label">Age</label>
              <p className="read-only-value">{formData.age ? `${formData.age} years` : '—'}</p>
            </div>

            {/* Place of Birth */}
            <div className="form-field">
              <label className="field-label">
                Place of Birth <span className="required">*</span>
              </label>
              {isReadOnly ? (
                <p className="read-only-value">{formData.placeOfBirth || '—'}</p>
              ) : (
                <>
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={formData.placeOfBirth}
                    onChange={handleInputChange}
                    className={`field-input ${errors.placeOfBirth ? 'error' : ''}`}
                    placeholder="Enter place of birth"
                  />
                  {errors.placeOfBirth && <span className="error-message">{errors.placeOfBirth}</span>}
                </>
              )}
            </div>

            {/* State */}
            <div className="form-field">
              <label className="field-label">
                State <span className="required">*</span>
              </label>
              {isReadOnly ? (
                <p className="read-only-value">{formData.state || '—'}</p>
              ) : (
                <>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`field-input ${errors.state ? 'error' : ''}`}
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </>
              )}
            </div>

            {/* Pincode */}
            <div className="form-field">
              <label className="field-label">
                Pincode <span className="required">*</span>
              </label>
              {isReadOnly ? (
                <p className="read-only-value">{formData.pincode || '—'}</p>
              ) : (
                <>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className={`field-input ${errors.pincode ? 'error' : ''}`}
                    placeholder="Enter 6-digit pincode"
                    pattern="[0-9]{6}"
                    maxLength="6"
                  />
                  {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                </>
              )}
            </div>

            {/* Marital Status */}
            <div className="form-field">
              <label className="field-label">Marital Status</label>
              {isReadOnly ? (
                <p className="read-only-value">{formData.maritalStatus || '—'}</p>
              ) : (
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="maritalStatus"
                      value="Single"
                      checked={formData.maritalStatus === 'Single'}
                      onChange={handleInputChange}
                    />
                    <span>Single</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="maritalStatus"
                      value="Married"
                      checked={formData.maritalStatus === 'Married'}
                      onChange={handleInputChange}
                    />
                    <span>Married</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="maritalStatus"
                      value="Divorced"
                      checked={formData.maritalStatus === 'Divorced'}
                      onChange={handleInputChange}
                    />
                    <span>Divorced</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="maritalStatus"
                      value="Widowed"
                      checked={formData.maritalStatus === 'Widowed'}
                      onChange={handleInputChange}
                    />
                    <span>Widowed</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Signature Upload (Full Width) */}
          <div className="form-field signature-field">
            <label className="field-label">Candidate Signature</label>
            {isReadOnly ? (
              <>
                {formData.signaturePreview && (
                  <img src={formData.signaturePreview} alt="Signature" className="signature-preview" />
                )}
                {!formData.signaturePreview && <p className="read-only-value">—</p>}
              </>
            ) : (
              <>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="file-input"
                  id="signature-upload"
                />
                <label htmlFor="signature-upload" className="file-input-label">
                  Choose File
                </label>
                {formData.signaturePreview && (
                  <div className="signature-container">
                    <img src={formData.signaturePreview} alt="Signature" className="signature-preview" />
                    <div className="file-info">
                      <span className="file-name">{formData.signatureFilename}</span>
                      <span className="file-size">{formData.signatureSize}</span>
                      <button type="button" className="remove-link" onClick={handleRemoveSignature}>
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
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

export default PersonalInfoForm
