import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePageTitle from '../../usePageTitle'
import { mockCandidates } from '../../mockCandidates'

function HRCandidateList() {
  usePageTitle("Candidates | MTL HR Onboard");
  
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [businessUnit, setBusinessUnit] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // TODO: Replace with API call
  const candidates = mockCandidates.map(c => ({
    id: c.id,
    refNo: c.refNumber,
    name: c.name,
    designation: c.designation,
    businessUnit: c.businessUnit,
    completion: c.completionPercent,
    status: c.status
  }))

  const getStatusBadge = (status) => {
    const statusMap = {
      'not-started': 'Not Started',
      'in-progress': 'In Progress',
      'submitted': 'Submitted',
      'approved': 'Approved',
      'rejected': 'Rejected'
    }
    return statusMap[status] || status
  }

  return (
    <div>
      {/* Filter Bar */}
      <div className="hr-list-header">
        <div className="hr-filters">
          <input
            type="text"
            className="hr-filter-input"
            placeholder="Search by name or reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="hr-filter-select"
            value={businessUnit}
            onChange={(e) => setBusinessUnit(e.target.value)}
          >
            <option value="">All Business Units</option>
            <option value="Technology">Technology</option>
            <option value="Product">Product</option>
            <option value="Analytics">Analytics</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Human Resources">Human Resources</option>
          </select>
          <select
            className="hr-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button
          className="hr-add-btn"
          onClick={() => navigate('/hr/candidates/new')}
        >
          + Add New Candidate
        </button>
      </div>

      {/* Candidate Table */}
      <div className="hr-table-card">
        <table className="hr-table">
          <thead>
            <tr>
              <th>Reference No</th>
              <th>Candidate Name</th>
              <th>Designation</th>
              <th>Business Unit</th>
              <th>Completion %</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>{candidate.refNo}</td>
                <td>{candidate.name}</td>
                <td>{candidate.designation}</td>
                <td>{candidate.businessUnit}</td>
                <td>
                  <div className="hr-progress-bar-wrapper">
                    <div className="hr-progress-bar">
                      <div
                        className="hr-progress-fill"
                        style={{ width: `${candidate.completion}%` }}
                      ></div>
                    </div>
                    <span className="hr-progress-text">{candidate.completion}%</span>
                  </div>
                </td>
                <td>
                  <span className={`hr-status-badge ${candidate.status}`}>
                    {getStatusBadge(candidate.status)}
                  </span>
                </td>
                <td>
                  <button
                    className="hr-view-btn"
                    onClick={() => navigate(`/hr/candidates/${candidate.id}`)}
                  >
                    <span>👁️</span> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="hr-pagination">
          Showing 1–8 of 8 results
        </div>
      </div>
    </div>
  )
}

export default HRCandidateList
