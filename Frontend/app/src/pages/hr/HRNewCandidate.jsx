import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import usePageTitle from '../../hooks/usePageTitle'
import './HRNewCandidate.css'

function HRNewCandidate() {
  usePageTitle("New Candidate | MTL HR Onboard");
  
  const navigate = useNavigate()

  // Generate initial employee code
  const generateEmployeeCode = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `EMP-${randomNum}`
  }

  const [formData, setFormData] = useState({
    employeeName: '',
    designation: '',
    employeeCode: generateEmployeeCode(),
    company: '',
    businessUnit: '',
    supervisorName: '',
    supervisorDesignation: '',
    supervisorContact: '',
    email: '',
    phoneNumber: '',
    additionalRemarks: ''
  })

  const [assignedForms, setAssignedForms] = useState([
    { id: 1, name: 'Personal Information', checked: true },
    { id: 2, name: 'Contact Information', checked: true },
    { id: 3, name: 'Family Details', checked: true },
    { id: 4, name: 'Education Details', checked: true },
    { id: 5, name: 'Work Experience', checked: true },
    { id: 6, name: 'Passport Details', checked: true },
    { id: 7, name: 'Health Information', checked: true },
    { id: 8, name: 'Individual Traits', checked: true },
    { id: 9, name: 'General Information', checked: true },
    { id: 10, name: 'ESG Declaration', checked: true },
    { id: 11, name: 'Documents Upload', checked: true }
  ])

  const [errors, setErrors] = useState({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  const businessUnitOptions = {
    'Manipal Health': ['Hospital Operations', 'Clinical Services', 'Admin'],
    'Manipal Education': ['Faculty', 'Administration', 'Research'],
    'Manipal Technologies': ['Engineering', 'Product', 'Support'],
    'Manipal Group': ['Corporate', 'Finance', 'HR', 'Legal']
  }

  // Reset business unit when company changes
  useEffect(() => {
    if (formData.company) {
      setFormData(prev => ({ ...prev, businessUnit: '' }))
    }
  }, [formData.company])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleFormCheck = (formId) => {
    setAssignedForms(prev =>
      prev.map(form =>
        form.id === formId ? { ...form, checked: !form.checked } : form
      )
    )
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.employeeName.trim()) newErrors.employeeName = 'Employee Name is required'
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required'
    if (!formData.employeeCode.trim()) newErrors.employeeCode = 'Employee Code is required'
    if (!formData.company) newErrors.company = 'Company is required'
    if (!formData.businessUnit) newErrors.businessUnit = 'Business Unit is required'
    if (!formData.supervisorName.trim()) newErrors.supervisorName = 'Supervisor Name is required'
    if (!formData.supervisorDesignation.trim()) newErrors.supervisorDesignation = 'Supervisor Designation is required'
    if (!formData.supervisorContact.trim()) newErrors.supervisorContact = 'Supervisor Contact is required'
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required'
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number must be 10 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      // TODO: POST /api/candidates — creates tbl_CandidateMaster, inserts tbl_CandidateForms rows, sends email
      setShowSuccessModal(true)
    }
  }

  const handleCopyLink = () => {
    const link = `https://hrboard.app/onboard?ref=${formData.employeeCode}`
    navigator.clipboard.writeText(link)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleCreateAnother = () => {
    setFormData({
      employeeName: '',
      designation: '',
      employeeCode: generateEmployeeCode(),
      company: '',
      businessUnit: '',
      supervisorName: '',
      supervisorDesignation: '',
      supervisorContact: '',
      email: '',
      phoneNumber: '',
      additionalRemarks: ''
    })
    setAssignedForms(prev => prev.map(form => ({ ...form, checked: true })))
    setErrors({})
    setShowSuccessModal(false)
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
        </button> &gt; New Candidate
      </div>

      {/* Form Card */}
      <div className="new-candidate-card">
        <h2 className="new-candidate-title">Create New Candidate</h2>

        <div className="new-candidate-form">
          {/* Two-column grid fields */}
          <div className="form-grid-2col">
            {/* Employee Name */}
            <div className="form-group">
              <label className="form-label">
                Employee Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="employeeName"
                className={`form-input ${errors.employeeName ? 'error' : ''}`}
                value={formData.employeeName}
                onChange={handleInputChange}
              />
              {errors.employeeName && <span className="error-text">{errors.employeeName}</span>}
            </div>

            {/* Designation */}
            <div className="form-group">
              <label className="form-label">
                Designation <span className="required">*</span>
              </label>
              <input
                type="text"
                name="designation"
                className={`form-input ${errors.designation ? 'error' : ''}`}
                value={formData.designation}
                onChange={handleInputChange}
              />
              {errors.designation && <span className="error-text">{errors.designation}</span>}
            </div>

            {/* Employee Code */}
            <div className="form-group">
              <label className="form-label">
                Employee Code <span className="required">*</span>
              </label>
              <input
                type="text"
                name="employeeCode"
                className={`form-input ${errors.employeeCode ? 'error' : ''}`}
                value={formData.employeeCode}
                onChange={handleInputChange}
              />
              <span className="form-hint">Auto-generated, you may edit</span>
              {errors.employeeCode && <span className="error-text">{errors.employeeCode}</span>}
            </div>

            {/* Company */}
            <div className="form-group">
              <label className="form-label">
                Company <span className="required">*</span>
              </label>
              <select
                name="company"
                className={`form-input ${errors.company ? 'error' : ''}`}
                value={formData.company}
                onChange={handleInputChange}
              >
                <option value="">Select Company</option>
                <option value="Manipal Group">Manipal Group</option>
                <option value="Manipal Health">Manipal Health</option>
                <option value="Manipal Education">Manipal Education</option>
                <option value="Manipal Technologies">Manipal Technologies</option>
              </select>
              {errors.company && <span className="error-text">{errors.company}</span>}
            </div>

            {/* Business Unit */}
            <div className="form-group">
              <label className="form-label">
                Business Unit <span className="required">*</span>
              </label>
              <select
                name="businessUnit"
                className={`form-input ${errors.businessUnit ? 'error' : ''}`}
                value={formData.businessUnit}
                onChange={handleInputChange}
                disabled={!formData.company}
              >
                <option value="">Select Business Unit</option>
                {formData.company && businessUnitOptions[formData.company]?.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
              {errors.businessUnit && <span className="error-text">{errors.businessUnit}</span>}
            </div>

            {/* Supervisor Name */}
            <div className="form-group">
              <label className="form-label">
                Supervisor Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="supervisorName"
                className={`form-input ${errors.supervisorName ? 'error' : ''}`}
                value={formData.supervisorName}
                onChange={handleInputChange}
              />
              {errors.supervisorName && <span className="error-text">{errors.supervisorName}</span>}
            </div>

            {/* Supervisor Designation */}
            <div className="form-group">
              <label className="form-label">
                Supervisor Designation <span className="required">*</span>
              </label>
              <input
                type="text"
                name="supervisorDesignation"
                className={`form-input ${errors.supervisorDesignation ? 'error' : ''}`}
                value={formData.supervisorDesignation}
                onChange={handleInputChange}
              />
              {errors.supervisorDesignation && <span className="error-text">{errors.supervisorDesignation}</span>}
            </div>

            {/* Supervisor Contact */}
            <div className="form-group">
              <label className="form-label">
                Supervisor Contact <span className="required">*</span>
              </label>
              <input
                type="text"
                name="supervisorContact"
                className={`form-input ${errors.supervisorContact ? 'error' : ''}`}
                value={formData.supervisorContact}
                onChange={handleInputChange}
              />
              {errors.supervisorContact && <span className="error-text">{errors.supervisorContact}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                Email to Send Link <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label">
                Phone Number <span className="required">*</span>
              </label>
              <input
                type="text"
                name="phoneNumber"
                className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
            </div>
          </div>

          {/* Assign Forms - Full Width */}
          <div className="form-group full-width">
            <label className="form-label">Select forms to assign to this candidate</label>
            <div className="forms-checklist">
              {assignedForms.map(form => (
                <label key={form.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={form.checked}
                    onChange={() => handleFormCheck(form.id)}
                  />
                  <span>{form.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Remarks - Full Width */}
          <div className="form-group full-width">
            <label className="form-label">Additional Remarks</label>
            <textarea
              name="additionalRemarks"
              className="form-textarea"
              rows="4"
              value={formData.additionalRemarks}
              onChange={handleInputChange}
            />
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              className="btn-cancel"
              onClick={() => navigate('/hr/candidates')}
            >
              Cancel
            </button>
            <button
              className="btn-submit"
              onClick={handleSubmit}
            >
              Create & Send Link
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">✅</div>
            <h3 className="modal-title">Candidate Created Successfully!</h3>
            <p className="modal-text">Onboarding link has been generated:</p>
            <div className="link-box">
              https://hrboard.app/onboard?ref={formData.employeeCode}
            </div>
            <div className="modal-actions">
              <button className="btn-copy" onClick={handleCopyLink}>
                {linkCopied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                className="btn-view"
                onClick={() => navigate('/hr/candidates/1')}
              >
                View Candidate
              </button>
              <button className="btn-create-another" onClick={handleCreateAnother}>
                Create Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HRNewCandidate
