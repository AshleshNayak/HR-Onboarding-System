import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import usePageTitle from '../../../usePageTitle'
import './forms-shared.css'
import './ESGForm.css'

function ESGForm() {
  usePageTitle("ESG | MTL HR Onboard");
  
  const navigate = useNavigate()
  
  const [formStatus, setFormStatus] = useState('Pending')
  const [formData, setFormData] = useState({
    commuteType: '',
    vehicleType: '',
    fuelType: '',
    vehicleRegNumber: '',
    drivingLicenseNumber: '',
    distanceOfTravel: '',
    avgFuelConsumption: '',
    monthlyFuelConsumption: ''
  })
  
  const [toast, setToast] = useState({ show: false, message: '' })

  // TODO: GET /api/forms/esg/:candidateId — load existing data on mount
  useEffect(() => {
    // Mock data load - replace with actual API call
    // const candidateId = localStorage.getItem('candidateId')
    // fetch(`/api/forms/esg/${candidateId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setFormData(data.formData)
    //     setFormStatus(data.status)
    //   })
  }, [])

  // Auto-calculate monthly fuel consumption when distance or avg consumption changes
  useEffect(() => {
    if (formData.distanceOfTravel && formData.avgFuelConsumption) {
      const distance = parseFloat(formData.distanceOfTravel)
      const avgConsumption = parseFloat(formData.avgFuelConsumption)
      
      if (distance > 0 && avgConsumption > 0) {
        // Formula: Distance × 2 × 22 working days / Avg consumption
        const calculated = (distance * 2 * 22) / avgConsumption
        setFormData(prev => ({ 
          ...prev, 
          monthlyFuelConsumption: calculated.toFixed(2) 
        }))
      }
    }
  }, [formData.distanceOfTravel, formData.avgFuelConsumption])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Reset dependent fields when commute type changes
    if (name === 'commuteType') {
      if (value === 'Public Transport') {
        setFormData({
          commuteType: value,
          vehicleType: '',
          fuelType: '',
          vehicleRegNumber: '',
          drivingLicenseNumber: '',
          distanceOfTravel: '',
          avgFuelConsumption: '',
          monthlyFuelConsumption: ''
        })
      } else {
        setFormData(prev => ({ ...prev, [name]: value }))
      }
      return
    }
    
    // Reset fuel type when vehicle type changes
    if (name === 'vehicleType') {
      setFormData(prev => ({ ...prev, [name]: value, fuelType: '' }))
      return
    }
    
    setFormData(prev => ({ ...prev, [name]: value }))
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
    
    // TODO: POST /api/forms/esg/:candidateId — save/submit
    // const candidateId = localStorage.getItem('candidateId')
    // fetch(`/api/forms/esg/${candidateId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ formData, status: 'Draft' })
    // })
  }

  const handleSubmit = () => {
    setFormStatus('Submitted')
    showToast('Form submitted successfully')
    
    // TODO: POST /api/forms/esg/:candidateId — save/submit
    // const candidateId = localStorage.getItem('candidateId')
    // fetch(`/api/forms/esg/${candidateId}`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ formData, status: 'Submitted' })
    // })
  }

  const isReadOnly = formStatus === 'Approved'

  return (
    <div className="esg-form">
      {/* Header Bar */}
      <div className="form-header-bar">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="form-title">ESG Information</h1>
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
          {/* Question 1: Commute Type */}
          <div className="form-field">
            <label className="field-label">
              How do you commute to office?
            </label>
            {isReadOnly ? (
              <p className="read-only-value">{formData.commuteType || '—'}</p>
            ) : (
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="commuteType"
                    value="Self-Owned Vehicle"
                    checked={formData.commuteType === 'Self-Owned Vehicle'}
                    onChange={handleInputChange}
                  />
                  <span>Self-Owned Vehicle</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="commuteType"
                    value="Public Transport"
                    checked={formData.commuteType === 'Public Transport'}
                    onChange={handleInputChange}
                  />
                  <span>Public Transport</span>
                </label>
              </div>
            )}
          </div>

          {/* Public Transport Info Box */}
          {formData.commuteType === 'Public Transport' && !isReadOnly && (
            <div className="info-box">
              No additional details required for public transport.
            </div>
          )}

          {/* Vehicle Details (shown only if Self-Owned Vehicle) */}
          {formData.commuteType === 'Self-Owned Vehicle' && (
            <>
              {/* Question 2: Vehicle Type */}
              <div className="form-field">
                <label className="field-label">
                  Vehicle Type
                </label>
                {isReadOnly ? (
                  <p className="read-only-value">{formData.vehicleType || '—'}</p>
                ) : (
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="vehicleType"
                        value="2 Wheeler"
                        checked={formData.vehicleType === '2 Wheeler'}
                        onChange={handleInputChange}
                      />
                      <span>2 Wheeler</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="vehicleType"
                        value="4 Wheeler"
                        checked={formData.vehicleType === '4 Wheeler'}
                        onChange={handleInputChange}
                      />
                      <span>4 Wheeler</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Fuel Type (conditional based on vehicle type) */}
              {formData.vehicleType && (
                <div className="form-field">
                  <label className="field-label">
                    Fuel Type
                  </label>
                  {isReadOnly ? (
                    <p className="read-only-value">{formData.fuelType || '—'}</p>
                  ) : (
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="fuelType"
                          value="Petrol"
                          checked={formData.fuelType === 'Petrol'}
                          onChange={handleInputChange}
                        />
                        <span>Petrol</span>
                      </label>
                      {formData.vehicleType === '4 Wheeler' && (
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="fuelType"
                            value="Diesel"
                            checked={formData.fuelType === 'Diesel'}
                            onChange={handleInputChange}
                          />
                          <span>Diesel</span>
                        </label>
                      )}
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="fuelType"
                          value="Electric"
                          checked={formData.fuelType === 'Electric'}
                          onChange={handleInputChange}
                        />
                        <span>Electric</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="fuelType"
                          value="CNG"
                          checked={formData.fuelType === 'CNG'}
                          onChange={handleInputChange}
                        />
                        <span>CNG</span>
                      </label>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Vehicle Details */}
              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">
                    Vehicle Registration Certificate Number
                  </label>
                  {isReadOnly ? (
                    <p className="read-only-value">{formData.vehicleRegNumber || '—'}</p>
                  ) : (
                    <input
                      type="text"
                      name="vehicleRegNumber"
                      value={formData.vehicleRegNumber}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder="Enter vehicle registration number"
                    />
                  )}
                </div>

                <div className="form-field">
                  <label className="field-label">
                    Driving License Number
                  </label>
                  {isReadOnly ? (
                    <p className="read-only-value">{formData.drivingLicenseNumber || '—'}</p>
                  ) : (
                    <input
                      type="text"
                      name="drivingLicenseNumber"
                      value={formData.drivingLicenseNumber}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder="Enter driving license number"
                    />
                  )}
                </div>

                <div className="form-field">
                  <label className="field-label">
                    Distance of Travel (2-way)
                  </label>
                  {isReadOnly ? (
                    <p className="read-only-value">
                      {formData.distanceOfTravel ? `${formData.distanceOfTravel} km` : '—'}
                    </p>
                  ) : (
                    <input
                      type="number"
                      name="distanceOfTravel"
                      value={formData.distanceOfTravel}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder="Enter distance in km"
                      min="0"
                      step="0.1"
                    />
                  )}
                </div>

                <div className="form-field">
                  <label className="field-label">
                    Average Fuel Consumption (km/L)
                  </label>
                  {isReadOnly ? (
                    <p className="read-only-value">
                      {formData.avgFuelConsumption ? `${formData.avgFuelConsumption} km/L` : '—'}
                    </p>
                  ) : (
                    <input
                      type="number"
                      name="avgFuelConsumption"
                      value={formData.avgFuelConsumption}
                      onChange={handleInputChange}
                      className="field-input"
                      placeholder="Enter average consumption"
                      min="0"
                      step="0.1"
                    />
                  )}
                </div>

                <div className="form-field full-width">
                  <label className="field-label">
                    Monthly Fuel Consumption (Liters)
                  </label>
                  {isReadOnly ? (
                    <p className="read-only-value">
                      {formData.monthlyFuelConsumption ? `${formData.monthlyFuelConsumption} L` : '—'}
                    </p>
                  ) : (
                    <>
                      <input
                        type="number"
                        name="monthlyFuelConsumption"
                        value={formData.monthlyFuelConsumption}
                        onChange={handleInputChange}
                        className="field-input"
                        placeholder="Auto-calculated or enter manually"
                        min="0"
                        step="0.01"
                      />
                      <span className="field-hint">
                        Auto-calculated: Distance × 2 × 22 working days / Avg consumption
                      </span>
                    </>
                  )}
                </div>
              </div>
            </>
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

export default ESGForm
