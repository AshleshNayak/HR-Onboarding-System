import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import usePageTitle from '../../../usePageTitle'
import './forms-shared.css'
import './EducationDetailsForm.css'

function EducationDetailsForm() {
  usePageTitle("Education Details | MTL HR Onboard");
  
  const navigate = useNavigate()
  
  const [formStatus, setFormStatus] = useState('Pending')
  const [activeTab, setActiveTab] = useState('pre-degree')
  const [formData, setFormData] = useState({
    // Pre-Degree Fields (Tab 1)
    sslcInstitution: '',
    sslcYear: '',
    sslcPercentage: '',
    pucInstitution: '',
    pucYear: '',
    pucPercentage: '',
    
    // Degree Details (Tab 2)
    degrees: [
      {
        degreeType: '',
        institution: '',
        location: '',
        yearOfPassing: '',
        specialization: '',
        aggregatePercentage: '',
        semesterMarks: {
          sem1: '', sem2: '', sem3: '', sem4: '',
          sem5: '', sem6: '', sem7: '', sem8: ''
        },
        semesterExpanded: false,
        projectTitle: '',
        projectDescription: '',
        projectDuration: '',
        projectExpanded: false
      }
    ],
    
    // Post-Graduation (Tab 3)
    hasPostGraduation: false,
    pgType: '',
    pgInstitution: '',
    pgLocation: '',
    pgYearOfPassing: '',
    pgSpecialization: '',
    pgAggregatePercentage: ''
  })
  
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState({ show: false, message: '' })

  // Generate year options (1980-2025)
  const yearOptions = []
  for (let year = 2025; year >= 1980; year--) {
    yearOptions.push(year)
  }

  // TODO: GET /api/forms/education-details/:candidateId — load existing data on mount
  useEffect(() => {
    // Mock data load - replace with actual API call
    // const candidateId = localStorage.getItem('candidateId')
    // fetch(`/api/forms/education-details/${candidateId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setFormData(data.formData)
    //     setFormStatus(data.status)
    //   })
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleDegreeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      degrees: prev.degrees.map((degree, i) =>
        i === index ? { ...degree, [field]: value } : degree
      )
    }))
    
    // Clear error
    if (errors[`degree${index}_${field}`]) {
      setErrors(prev => ({ ...prev, [`degree${index}_${field}`]: '' }))
    }
  }

  const handleSemesterChange = (degreeIndex, semester, value) => {
    setFormData(prev => ({
      ...prev,
      degrees: prev.degrees.map((degree, i) =>
        i === degreeIndex
          ? {
              ...degree,
              semesterMarks: { ...degree.semesterMarks, [semester]: value }
            }
          : degree
      )
    }))
  }

  const toggleSemesterSection = (index) => {
    setFormData(prev => ({
      ...prev,
      degrees: prev.degrees.map((degree, i) =>
        i === index ? { ...degree, semesterExpanded: !degree.semesterExpanded } : degree
      )
    }))
  }

  const toggleProjectSection = (index) => {
    setFormData(prev => ({
      ...prev,
      degrees: prev.degrees.map((degree, i) =>
        i === index ? { ...degree, projectExpanded: !degree.projectExpanded } : degree
      )
    }))
  }

  const handleAddDegree = () => {
    setFormData(prev => ({
      ...prev,
      degrees: [
        ...prev.degrees,
        {
          degreeType: '',
          institution: '',
          location: '',
          yearOfPassing: '',
          specialization: '',
          aggregatePercentage: '',
          semesterMarks: {
            sem1: '', sem2: '', sem3: '', sem4: '',
            sem5: '', sem6: '', sem7: '', sem8: ''
          },
          semesterExpanded: false,
          projectTitle: '',
          projectDescription: '',
          projectDuration: '',
          projectExpanded: false
        }
      ]
    }))
  }

  const handleRemoveDegree = (index) => {
    if (formData.degrees.length === 1) return
    setFormData(prev => ({
      ...prev,
      degrees: prev.degrees.filter((_, i) => i !== index)
    }))
  }

  const handlePostGraduationToggle = (e) => {
    const checked = e.target.checked
    setFormData(prev => ({
      ...prev,
      hasPostGraduation: checked,
      // Clear PG fields when unchecking
      ...(!checked && {
        pgType: '',
        pgInstitution: '',
        pgLocation: '',
        pgYearOfPassing: '',
        pgSpecialization: '',
        pgAggregatePercentage: ''
      })
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Pre-Degree Validation (Tab 1)
    if (!formData.sslcInstitution.trim()) {
      newErrors.sslcInstitution = 'This field is required'
    }
    if (!formData.sslcYear) {
      newErrors.sslcYear = 'This field is required'
    }
    if (!formData.sslcPercentage) {
      newErrors.sslcPercentage = 'This field is required'
    }
    if (!formData.pucInstitution.trim()) {
      newErrors.pucInstitution = 'This field is required'
    }
    if (!formData.pucYear) {
      newErrors.pucYear = 'This field is required'
    }
    if (!formData.pucPercentage) {
      newErrors.pucPercentage = 'This field is required'
    }
    
    // Degree Validation (Tab 2)
    formData.degrees.forEach((degree, index) => {
      if (!degree.degreeType.trim()) {
        newErrors[`degree${index}_degreeType`] = 'This field is required'
      }
      if (!degree.institution.trim()) {
        newErrors[`degree${index}_institution`] = 'This field is required'
      }
      if (!degree.location.trim()) {
        newErrors[`degree${index}_location`] = 'This field is required'
      }
      if (!degree.yearOfPassing) {
        newErrors[`degree${index}_yearOfPassing`] = 'This field is required'
      }
      if (!degree.specialization.trim()) {
        newErrors[`degree${index}_specialization`] = 'This field is required'
      }
      if (!degree.aggregatePercentage) {
        newErrors[`degree${index}_aggregatePercentage`] = 'This field is required'
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
    setFormStatus('Draft')
    showToast('Saved as draft')
    
    // TODO: POST /api/forms/education-details/:candidateId — save/submit
    // const candidateId = localStorage.getItem('candidateId')
    // fetch(`/api/forms/education-details/${candidateId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ formData, status: 'Draft' })
    // })
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      showToast('Please fill in all required fields')
      return
    }
    
    setFormStatus('Submitted')
    showToast('Form submitted successfully')
    
    // TODO: POST /api/forms/education-details/:candidateId — save/submit
    // const candidateId = localStorage.getItem('candidateId')
    // fetch(`/api/forms/education-details/${candidateId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ formData, status: 'Submitted' })
    // })
  }

  const isReadOnly = formStatus === 'Approved'

  return (
    <div className="education-details-form">
      {/* Header Bar */}
      <div className="form-header-bar">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="form-title">Education Details</h1>
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
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button
              className={`tab-button ${activeTab === 'pre-degree' ? 'active' : ''}`}
              onClick={() => setActiveTab('pre-degree')}
            >
              Pre-Degree
            </button>
            <button
              className={`tab-button ${activeTab === 'degree' ? 'active' : ''}`}
              onClick={() => setActiveTab('degree')}
            >
              Degree
            </button>
            <button
              className={`tab-button ${activeTab === 'post-graduation' ? 'active' : ''}`}
              onClick={() => setActiveTab('post-graduation')}
            >
              Post-Graduation
            </button>
          </div>

          {/* TAB 1: Pre-Degree */}
          {activeTab === 'pre-degree' && (
            <div className="tab-content">
              <div className="form-grid">
                {/* SSLC Institution */}
                <div className="form-field">
                  <label className="field-label">
                    SSLC Institution <span className="required">*</span>
                  </label>
                  {isReadOnly ? (
                    <p className="read-only-value">{formData.sslcInstitution || '—'}</p>
                  ) : (
                    <>
                      <input
                        type="text"
                        name="sslcInstitution"
                        value={formData.sslcInstitution}
                        onChange={handleInputChange}
                        className={`field-input ${errors.sslcInstitution ? 'error' : ''}`}
                        placeholder="Enter SSLC institution name"
                      />
                      {errors.sslcInstitution && <span className="error-message">{errors.sslcInstitution}</span>}
                    </>
                  )}
                </div>

                {/* SSLC Year */}
                <div className="form-field">
                  <label className="field-label">
                    SSLC Year <span className="required">*</span>
                  </label>
                  {isReadOnly ? (
                    <p className="read-only-value">{formData.sslcYear || '—'}</p>
                  ) : (
                    <>
                      <select
                        name="sslcYear"
                        value={formData.sslcYear}
                        onChange={handleInputChange}
                        className={`field-input ${errors.sslcYear ? 'error' : ''}`}
                      >
                        <option value="">Select Year</option>
                        {yearOptions.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      {errors.sslcYear && <span className="error-message">{errors.sslcYear}</span>}
                    </>
                  )}
                </div>

                {/* SSLC Percentage */}
                <div className="form-field">
                  <label className="field-label">
                    SSLC Percentage <span className="required">*</span>
                  </label>
                  {isReadOnly ? (
                    <p className="read-only-value">{formData.sslcPercentage ? `${formData.sslcPercentage}%` : '—'}</p>
                  ) : (
                    <>
                      <input
                        type="number"
                        name="sslcPercentage"
                        value={formData.sslcPercentage}
                        onChange={handleInputChange}
                        className={`field-input ${errors.sslcPercentage ? 'error' : ''}`}
                        placeholder="Enter percentage"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                      {errors.sslcPercentage && <span className="error-message">{errors.sslcPercentage}</span>}
                    </>
                  )}
                </div>

                {/* PUC Institution */}
                <div className="form-field">
                  <label className="field-label">
                    PUC Institution <span className="required">*</span>
                  </label>
                  {isReadOnly ? (
                    <p className="read-only-value">{formData.pucInstitution || '—'}</p>
                  ) : (
                    <>
                      <input
                        type="text"
                        name="pucInstitution"
                        value={formData.pucInstitution}
                        onChange={handleInputChange}
                        className={`field-input ${errors.pucInstitution ? 'error' : ''}`}
                        placeholder="Enter PUC institution name"
                      />
                      {errors.pucInstitution && <span className="error-message">{errors.pucInstitution}</span>}
                    </>
                  )}
                </div>

                {/* PUC Year */}
                <div className="form-field">
                  <label className="field-label">
                    PUC Year <span className="required">*</span>
                  </label>
                  {isReadOnly ? (
                    <p className="read-only-value">{formData.pucYear || '—'}</p>
                  ) : (
                    <>
                      <select
                        name="pucYear"
                        value={formData.pucYear}
                        onChange={handleInputChange}
                        className={`field-input ${errors.pucYear ? 'error' : ''}`}
                      >
                        <option value="">Select Year</option>
                        {yearOptions.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      {errors.pucYear && <span className="error-message">{errors.pucYear}</span>}
                    </>
                  )}
                </div>

                {/* PUC Percentage */}
                <div className="form-field">
                  <label className="field-label">
                    PUC Percentage <span className="required">*</span>
                  </label>
                  {isReadOnly ? (
                    <p className="read-only-value">{formData.pucPercentage ? `${formData.pucPercentage}%` : '—'}</p>
                  ) : (
                    <>
                      <input
                        type="number"
                        name="pucPercentage"
                        value={formData.pucPercentage}
                        onChange={handleInputChange}
                        className={`field-input ${errors.pucPercentage ? 'error' : ''}`}
                        placeholder="Enter percentage"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                      {errors.pucPercentage && <span className="error-message">{errors.pucPercentage}</span>}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Degree Details */}
          {activeTab === 'degree' && (
            <div className="tab-content">
              {formData.degrees.map((degree, index) => (
                <div key={index} className="degree-entry">
                  <div className="degree-entry-header">
                    <h3 className="degree-entry-title">Degree {index + 1}</h3>
                    {!isReadOnly && formData.degrees.length > 1 && (
                      <button
                        type="button"
                        className="remove-degree-button"
                        onClick={() => handleRemoveDegree(index)}
                        title="Remove degree"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className="form-grid">
                    {/* Degree Type */}
                    <div className="form-field">
                      <label className="field-label">
                        Degree Type <span className="required">*</span>
                      </label>
                      {isReadOnly ? (
                        <p className="read-only-value">{degree.degreeType || '—'}</p>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={degree.degreeType}
                            onChange={(e) => handleDegreeChange(index, 'degreeType', e.target.value)}
                            className={`field-input ${errors[`degree${index}_degreeType`] ? 'error' : ''}`}
                            placeholder="e.g., B.E., B.Com, BCA"
                          />
                          {errors[`degree${index}_degreeType`] && (
                            <span className="error-message">{errors[`degree${index}_degreeType`]}</span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Institution */}
                    <div className="form-field">
                      <label className="field-label">
                        Institution <span className="required">*</span>
                      </label>
                      {isReadOnly ? (
                        <p className="read-only-value">{degree.institution || '—'}</p>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={degree.institution}
                            onChange={(e) => handleDegreeChange(index, 'institution', e.target.value)}
                            className={`field-input ${errors[`degree${index}_institution`] ? 'error' : ''}`}
                            placeholder="Enter institution name"
                          />
                          {errors[`degree${index}_institution`] && (
                            <span className="error-message">{errors[`degree${index}_institution`]}</span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Location */}
                    <div className="form-field">
                      <label className="field-label">
                        Location <span className="required">*</span>
                      </label>
                      {isReadOnly ? (
                        <p className="read-only-value">{degree.location || '—'}</p>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={degree.location}
                            onChange={(e) => handleDegreeChange(index, 'location', e.target.value)}
                            className={`field-input ${errors[`degree${index}_location`] ? 'error' : ''}`}
                            placeholder="Enter location"
                          />
                          {errors[`degree${index}_location`] && (
                            <span className="error-message">{errors[`degree${index}_location`]}</span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Year of Passing */}
                    <div className="form-field">
                      <label className="field-label">
                        Year of Passing <span className="required">*</span>
                      </label>
                      {isReadOnly ? (
                        <p className="read-only-value">{degree.yearOfPassing || '—'}</p>
                      ) : (
                        <>
                          <select
                            value={degree.yearOfPassing}
                            onChange={(e) => handleDegreeChange(index, 'yearOfPassing', e.target.value)}
                            className={`field-input ${errors[`degree${index}_yearOfPassing`] ? 'error' : ''}`}
                          >
                            <option value="">Select Year</option>
                            {yearOptions.map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                          {errors[`degree${index}_yearOfPassing`] && (
                            <span className="error-message">{errors[`degree${index}_yearOfPassing`]}</span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Specialization */}
                    <div className="form-field">
                      <label className="field-label">
                        Specialization <span className="required">*</span>
                      </label>
                      {isReadOnly ? (
                        <p className="read-only-value">{degree.specialization || '—'}</p>
                      ) : (
                        <>
                          <input
                            type="text"
                            value={degree.specialization}
                            onChange={(e) => handleDegreeChange(index, 'specialization', e.target.value)}
                            className={`field-input ${errors[`degree${index}_specialization`] ? 'error' : ''}`}
                            placeholder="Enter specialization"
                          />
                          {errors[`degree${index}_specialization`] && (
                            <span className="error-message">{errors[`degree${index}_specialization`]}</span>
                          )}
                        </>
                      )}
                    </div>

                    {/* Aggregate Percentage */}
                    <div className="form-field">
                      <label className="field-label">
                        Aggregate Percentage <span className="required">*</span>
                      </label>
                      {isReadOnly ? (
                        <p className="read-only-value">{degree.aggregatePercentage ? `${degree.aggregatePercentage}%` : '—'}</p>
                      ) : (
                        <>
                          <input
                            type="number"
                            value={degree.aggregatePercentage}
                            onChange={(e) => handleDegreeChange(index, 'aggregatePercentage', e.target.value)}
                            className={`field-input ${errors[`degree${index}_aggregatePercentage`] ? 'error' : ''}`}
                            placeholder="Enter percentage"
                            min="0"
                            max="100"
                            step="0.01"
                          />
                          {errors[`degree${index}_aggregatePercentage`] && (
                            <span className="error-message">{errors[`degree${index}_aggregatePercentage`]}</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Collapsible Semester Marks Section */}
                  <div className="collapsible-section">
                    <button
                      type="button"
                      className="collapsible-header"
                      onClick={() => !isReadOnly && toggleSemesterSection(index)}
                      disabled={isReadOnly}
                    >
                      <span>Semester Marks</span>
                      {!isReadOnly && (
                        <span className={`chevron ${degree.semesterExpanded ? 'expanded' : ''}`}>▼</span>
                      )}
                    </button>
                    {degree.semesterExpanded && !isReadOnly && (
                      <div className="collapsible-content">
                        <div className="semester-grid">
                          {['sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6', 'sem7', 'sem8'].map((sem, semIndex) => (
                            <div key={sem} className="form-field">
                              <label className="field-label">Sem {semIndex + 1}</label>
                              <input
                                type="text"
                                value={degree.semesterMarks[sem]}
                                onChange={(e) => handleSemesterChange(index, sem, e.target.value)}
                                className="field-input"
                                placeholder="Optional"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Collapsible Project Details Section */}
                  <div className="collapsible-section">
                    <button
                      type="button"
                      className="collapsible-header"
                      onClick={() => !isReadOnly && toggleProjectSection(index)}
                      disabled={isReadOnly}
                    >
                      <span>Project Details</span>
                      {!isReadOnly && (
                        <span className={`chevron ${degree.projectExpanded ? 'expanded' : ''}`}>▼</span>
                      )}
                    </button>
                    {degree.projectExpanded && !isReadOnly && (
                      <div className="collapsible-content">
                        <div className="form-grid">
                          <div className="form-field">
                            <label className="field-label">Project Title</label>
                            <input
                              type="text"
                              value={degree.projectTitle}
                              onChange={(e) => handleDegreeChange(index, 'projectTitle', e.target.value)}
                              className="field-input"
                              placeholder="Enter project title"
                            />
                          </div>
                          <div className="form-field">
                            <label className="field-label">Project Duration</label>
                            <input
                              type="text"
                              value={degree.projectDuration}
                              onChange={(e) => handleDegreeChange(index, 'projectDuration', e.target.value)}
                              className="field-input"
                              placeholder="e.g., 6 months"
                            />
                          </div>
                          <div className="form-field full-width">
                            <label className="field-label">Project Description</label>
                            <textarea
                              value={degree.projectDescription}
                              onChange={(e) => handleDegreeChange(index, 'projectDescription', e.target.value)}
                              className="field-input"
                              placeholder="Enter project description"
                              rows="4"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Another Degree Button */}
              {!isReadOnly && (
                <button type="button" className="add-degree-button" onClick={handleAddDegree}>
                  + Add Another Degree
                </button>
              )}
            </div>
          )}

          {/* TAB 3: Post-Graduation */}
          {activeTab === 'post-graduation' && (
            <div className="tab-content">
              <div className="pg-checkbox-section">
                {isReadOnly ? (
                  <p className="read-only-value">
                    {formData.hasPostGraduation ? 'Has completed Post-Graduation' : 'No Post-Graduation'}
                  </p>
                ) : (
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.hasPostGraduation}
                      onChange={handlePostGraduationToggle}
                    />
                    <span>I have completed Post-Graduation</span>
                  </label>
                )}
              </div>

              {formData.hasPostGraduation && (
                <div className="form-grid">
                  {/* PG Type */}
                  <div className="form-field">
                    <label className="field-label">PG Type</label>
                    {isReadOnly ? (
                      <p className="read-only-value">{formData.pgType || '—'}</p>
                    ) : (
                      <input
                        type="text"
                        name="pgType"
                        value={formData.pgType}
                        onChange={handleInputChange}
                        className="field-input"
                        placeholder="e.g., MBA, M.Tech"
                      />
                    )}
                  </div>

                  {/* PG Institution */}
                  <div className="form-field">
                    <label className="field-label">Institution</label>
                    {isReadOnly ? (
                      <p className="read-only-value">{formData.pgInstitution || '—'}</p>
                    ) : (
                      <input
                        type="text"
                        name="pgInstitution"
                        value={formData.pgInstitution}
                        onChange={handleInputChange}
                        className="field-input"
                        placeholder="Enter institution name"
                      />
                    )}
                  </div>

                  {/* PG Location */}
                  <div className="form-field">
                    <label className="field-label">Location</label>
                    {isReadOnly ? (
                      <p className="read-only-value">{formData.pgLocation || '—'}</p>
                    ) : (
                      <input
                        type="text"
                        name="pgLocation"
                        value={formData.pgLocation}
                        onChange={handleInputChange}
                        className="field-input"
                        placeholder="Enter location"
                      />
                    )}
                  </div>

                  {/* PG Year of Passing */}
                  <div className="form-field">
                    <label className="field-label">Year of Passing</label>
                    {isReadOnly ? (
                      <p className="read-only-value">{formData.pgYearOfPassing || '—'}</p>
                    ) : (
                      <select
                        name="pgYearOfPassing"
                        value={formData.pgYearOfPassing}
                        onChange={handleInputChange}
                        className="field-input"
                      >
                        <option value="">Select Year</option>
                        {yearOptions.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* PG Specialization */}
                  <div className="form-field">
                    <label className="field-label">Specialization</label>
                    {isReadOnly ? (
                      <p className="read-only-value">{formData.pgSpecialization || '—'}</p>
                    ) : (
                      <input
                        type="text"
                        name="pgSpecialization"
                        value={formData.pgSpecialization}
                        onChange={handleInputChange}
                        className="field-input"
                        placeholder="Enter specialization"
                      />
                    )}
                  </div>

                  {/* PG Aggregate Percentage */}
                  <div className="form-field">
                    <label className="field-label">Aggregate Percentage</label>
                    {isReadOnly ? (
                      <p className="read-only-value">{formData.pgAggregatePercentage ? `${formData.pgAggregatePercentage}%` : '—'}</p>
                    ) : (
                      <input
                        type="number"
                        name="pgAggregatePercentage"
                        value={formData.pgAggregatePercentage}
                        onChange={handleInputChange}
                        className="field-input"
                        placeholder="Enter percentage"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
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

export default EducationDetailsForm
