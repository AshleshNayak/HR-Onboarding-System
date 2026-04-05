import { useNavigate } from 'react-router-dom'

function ContactInfoForm() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px' }}>
      <h2>Contact Info Form</h2>
      <p>Coming Soon</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  )
}

export default ContactInfoForm
