import { useNavigate } from 'react-router-dom'
import usePageTitle from '../../../usePageTitle'

function ContactInfoForm() {
  usePageTitle("Contact Information | MTL HR Onboard");
  
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
