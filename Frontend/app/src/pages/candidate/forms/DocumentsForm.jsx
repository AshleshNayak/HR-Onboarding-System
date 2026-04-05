import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import usePageTitle from '../../../hooks/usePageTitle'
import './forms-shared.css'
import './DocumentsForm.css'

function DocumentsForm() {
  usePageTitle("Documents | MTL HR Onboard");
  
  const navigate = useNavigate()
  
  const [formStatus, setFormStatus] = useState('Pending')
  const [showExitBanner, setShowExitBanner] = useState(false)
  const [documents, setDocuments] = useState({
    marksCards: [],
    kycDocs: [],
    panCard: [],
    photograph: [],
    employmentRecords: []
  })
  
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState({ show: false, message: '' })
  const [dragOver, setDragOver] = useState('')
  const [kycOtherType, setKycOtherType] = useState('')

  // TODO: GET /api/forms/documents/:candidateId — load existing data on mount
  useEffect(() => {
    // Mock data load - replace with actual API call
    // const candidateId = localStorage.getItem('candidateId')
    // fetch(`/api/forms/documents/${candidateId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setDocuments(data.documents)
    //     setFormStatus(data.status)
    //   })
  }, [])

  const validateFile = (file, section) => {
    const validations = {
      marksCards: { types: ['application/pdf', 'image/jpeg', 'image/png'], maxSize: 5 * 1024 * 1024 },
      kycDocs: { types: ['application/pdf', 'image/jpeg', 'image/png'], maxSize: 5 * 1024 * 1024, maxFiles: 2 },
      panCard: { types: ['application/pdf', 'image/jpeg', 'image/png'], maxSize: 5 * 1024 * 1024, maxFiles: 1 },
      photograph: { types: ['image/jpeg', 'image/png'], maxSize: 1 * 1024 * 1024, maxFiles: 1 },
      employmentRecords: { types: ['application/pdf', 'image/jpeg', 'image/png'], maxSize: 5 * 1024 * 1024 }
    }

    const config = validations[section]
    
    if (!config.types.includes(file.type)) {
      const allowedTypes = config.types.map(t => t.split('/')[1].toUpperCase()).join(', ')
      return `Invalid file type. Only ${allowedTypes} allowed.`
    }
    
    if (file.size > config.maxSize) {
      const maxSizeMB = config.maxSize / (1024 * 1024)
      return `File size exceeds ${maxSizeMB}MB limit.`
    }
    
    if (config.maxFiles && documents[section].length >= config.maxFiles) {
      return `Maximum ${config.maxFiles} file(s) allowed.`
    }
    
    return null
  }

  const handleFileSelect = (e, section) => {
    const files = Array.from(e.target.files)
    addFiles(files, section)
  }

  const handleDrop = (e, section) => {
    e.preventDefault()
    setDragOver('')
    const files = Array.from(e.dataTransfer.files)
    addFiles(files, section)
  }

  const addFiles = (files, section) => {
    const newErrors = { ...errors }
    delete newErrors[section]

    files.forEach(file => {
      const error = validateFile(file, section)
      if (error) {
        newErrors[section] = error
      } else {
        setDocuments(prev => ({
          ...prev,
          [section]: [...prev[section], {
            file,
            name: file.name,
            size: (file.size / 1024).toFixed(2),
            preview: section === 'photograph' ? URL.createObjectURL(file) : null
          }]
        }))
      }
    })

    setErrors(newErrors)
  }

  const handleRemoveFile = (section, index) => {
    setDocuments(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }))
    
    // Clear error when file is removed
    if (errors[section]) {
      setErrors(prev => ({ ...prev, [section]: '' }))
    }
  }

  const handleDragOver = (e, section) => {
    e.preventDefault()
    setDragOver(section)
  }

  const handleDragLeave = () => {
    setDragOver('')
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
    
    // TODO: POST /api/forms/documents/:candidateId — save/submit
    // const candidateId = localStorage.getItem('candidateId')
    // const formData = new FormData()
    // Object.keys(documents).forEach(section => {
    //   documents[section].forEach(doc => {
    //     formData.append(section, doc.file)
    //   })
    // })
    // formData.append('status', 'Draft')
    // fetch(`/api/forms/documents/${candidateId}`, {
    //   method: 'POST',
    //   body: formData
    // })
  }

  const handleSaveAndExit = () => {
    handleSaveAsDraft()
    navigate('/candidate/dashboard')
  }

  const handleSubmit = () => {
    const newErrors = {}
    
    // Validate required sections
    if (documents.panCard.length === 0) {
      newErrors.panCard = 'PAN Card is required'
    }
    
    if (documents.photograph.length === 0) {
      newErrors.photograph = 'Photograph is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setFormStatus('Submitted')
    showToast('Form submitted successfully')
    
    // TODO: POST /api/forms/documents/:candidateId — save/submit
    // const candidateId = localStorage.getItem('candidateId')
    // const formData = new FormData()
    // Object.keys(documents).forEach(section => {
    //   documents[section].forEach(doc => {
    //     formData.append(section, doc.file)
    //   })
    // })
    // formData.append('status', 'Submitted')
    // fetch(`/api/forms/documents/${candidateId}`, {
    //   method: 'POST',
    //   body: formData
    // })
  }

  const isReadOnly = formStatus === 'Approved'

  const renderUploadZone = (section, label, hint, accept) => {
    return (
      <div className="upload-section">
        <label className="section-label">{label}</label>
        {hint && <p className="section-hint">{hint}</p>}
        
        {isReadOnly ? (
          <div className="download-list">
            {documents[section].length > 0 ? (
              documents[section].map((doc, idx) => (
                <div key={idx} className="download-item">
                  <span>📄</span>
                  <a href="#" className="download-link">{doc.name}</a>
                  <span className="file-size">{doc.size} KB</span>
                </div>
              ))
            ) : (
              <p className="read-only-value">No files uploaded</p>
            )}
          </div>
        ) : (
          <>
            <div
              className={`drop-zone ${dragOver === section ? 'drag-over' : ''}`}
              onDrop={(e) => handleDrop(e, section)}
              onDragOver={(e) => handleDragOver(e, section)}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById(`${section}-input`).click()}
            >
              <span className="drop-icon">📎</span>
              <p className="drop-text">
                Drag & Drop files here or{' '}
                <span className="browse-text">Browse</span>
              </p>
            </div>
            
            <input
              type="file"
              id={`${section}-input`}
              accept={accept}
              multiple={section !== 'panCard' && section !== 'photograph'}
              onChange={(e) => handleFileSelect(e, section)}
              style={{ display: 'none' }}
            />
            
            {errors[section] && (
              <p className="error-message">{errors[section]}</p>
            )}
            
            {documents[section].length > 0 && (
              <div className="file-list">
                {documents[section].map((doc, idx) => (
                  <div key={idx} className="file-item">
                    {section === 'photograph' && doc.preview && (
                      <img src={doc.preview} alt="Preview" className="photo-preview" />
                    )}
                    <span className="file-icon">📄</span>
                    <span className="file-name">{doc.name}</span>
                    <span className="file-size">{doc.size} KB</span>
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveFile(section, idx)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="documents-form">
      {/* Header Bar */}
      <div className="form-header-bar">
        <button className="back-button" onClick={() => {
          if (formStatus === 'Draft') {
            setShowExitBanner(true)
          } else {
            navigate('/candidate/dashboard')
          }
        }}>
          ← Back
        </button>
        <h1 className="form-title">Documents Upload</h1>
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
          {/* Section 1: Marks Cards */}
          {renderUploadZone(
            'marksCards',
            'Marks Cards Upload',
            'Upload your SSLC, PUC and Degree mark sheets',
            'application/pdf,image/jpeg,image/png'
          )}

          <div className="section-divider" />

          {/* Section 2: KYC Documents */}
          {renderUploadZone(
            'kycDocs',
            'KYC Documents (Upload any 2)',
            'Accepted: Election Card, Passport, Driving License, Ration Card',
            'application/pdf,image/jpeg,image/png'
          )}

          {!isReadOnly && documents.kycDocs.some(doc => doc.name.toLowerCase().includes('other')) && (
            <div className="other-input-container">
              <input
                type="text"
                value={kycOtherType}
                onChange={(e) => setKycOtherType(e.target.value)}
                placeholder="Specify document type"
                className="field-input"
              />
            </div>
          )}

          <div className="section-divider" />

          {/* Section 3: PAN Card */}
          {renderUploadZone(
            'panCard',
            'PAN Card',
            null,
            'application/pdf,image/jpeg,image/png'
          )}

          <div className="section-divider" />

          {/* Section 4: Photograph */}
          {renderUploadZone(
            'photograph',
            'Recent Photograph',
            'JPG or PNG only, max 1MB, passport size preferred',
            'image/jpeg,image/png'
          )}

          <div className="section-divider" />

          {/* Section 5: Employment Records */}
          {renderUploadZone(
            'employmentRecords',
            'Previous Employment Records',
            'Offer letters, relieving letters, experience certificates',
            'application/pdf,image/jpeg,image/png'
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

export default DocumentsForm
