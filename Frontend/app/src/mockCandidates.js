// Mock candidate data for testing without backend
export const mockCandidates = [
  {
    id: 1,
    name: "Rahul Sharma",
    refNumber: "MPI-REF-2026-0145",
    designation: "Software Engineer",
    businessUnit: "Engineering",
    company: "Manipal Technologies",
    dateAdded: "2026-03-15",
    completionPercent: 45,
    status: "in-progress",
    forms: [
      { id: "personal-info", title: "Personal Information", status: "Submitted" },
      { id: "contact-info", title: "Contact Information", status: "Approved" },
      { id: "family-details", title: "Family Details", status: "Draft" },
      { id: "education", title: "Education Details", status: "Pending" },
      { id: "work-experience", title: "Work Experience", status: "Submitted" },
      { id: "passport", title: "Passport Details", status: "Pending" },
      { id: "health", title: "Health Information", status: "Pending" },
      { id: "individual-traits", title: "Individual Traits", status: "Pending" },
      { id: "general-info", title: "General Information", status: "Pending" },
      { id: "esg", title: "ESG", status: "Pending" },
      { id: "documents", title: "Documents", status: "Pending" }
    ]
  },
  {
    id: 2,
    name: "Priya Nair",
    refNumber: "MPI-REF-2026-0146",
    designation: "Product Manager",
    businessUnit: "Product",
    company: "Manipal Health Enterprises",
    dateAdded: "2026-03-18",
    completionPercent: 91,
    status: "submitted",
    forms: [
      { id: "personal-info", title: "Personal Information", status: "Approved" },
      { id: "contact-info", title: "Contact Information", status: "Approved" },
      { id: "family-details", title: "Family Details", status: "Approved" },
      { id: "education", title: "Education Details", status: "Approved" },
      { id: "work-experience", title: "Work Experience", status: "Approved" },
      { id: "passport", title: "Passport Details", status: "Approved" },
      { id: "health", title: "Health Information", status: "Approved" },
      { id: "individual-traits", title: "Individual Traits", status: "Approved" },
      { id: "general-info", title: "General Information", status: "Approved" },
      { id: "esg", title: "ESG", status: "Submitted" },
      { id: "documents", title: "Documents", status: "Pending" }
    ]
  },
  {
    id: 3,
    name: "Arjun Patel",
    refNumber: "MPI-REF-2026-0147",
    designation: "Data Analyst",
    businessUnit: "Analytics",
    company: "Manipal Technologies",
    dateAdded: "2026-03-20",
    completionPercent: 27,
    status: "in-progress",
    forms: [
      { id: "personal-info", title: "Personal Information", status: "Draft" },
      { id: "contact-info", title: "Contact Information", status: "Submitted" },
      { id: "family-details", title: "Family Details", status: "Submitted" },
      { id: "education", title: "Education Details", status: "Pending" },
      { id: "work-experience", title: "Work Experience", status: "Pending" },
      { id: "passport", title: "Passport Details", status: "Pending" },
      { id: "health", title: "Health Information", status: "Pending" },
      { id: "individual-traits", title: "Individual Traits", status: "Pending" },
      { id: "general-info", title: "General Information", status: "Pending" },
      { id: "esg", title: "ESG", status: "Pending" },
      { id: "documents", title: "Documents", status: "Pending" }
    ]
  },
  {
    id: 4,
    name: "Anjali Menon",
    refNumber: "MPI-REF-2026-0148",
    designation: "UX Designer",
    businessUnit: "Design",
    company: "Manipal Digital",
    dateAdded: "2026-03-22",
    completionPercent: 100,
    status: "approved",
    forms: [
      { id: "personal-info", title: "Personal Information", status: "Approved" },
      { id: "contact-info", title: "Contact Information", status: "Approved" },
      { id: "family-details", title: "Family Details", status: "Approved" },
      { id: "education", title: "Education Details", status: "Approved" },
      { id: "work-experience", title: "Work Experience", status: "Approved" },
      { id: "passport", title: "Passport Details", status: "Approved" },
      { id: "health", title: "Health Information", status: "Approved" },
      { id: "individual-traits", title: "Individual Traits", status: "Approved" },
      { id: "general-info", title: "General Information", status: "Approved" },
      { id: "esg", title: "ESG", status: "Approved" },
      { id: "documents", title: "Documents", status: "Approved" }
    ]
  },
  {
    id: 5,
    name: "Vikram Singh",
    refNumber: "MPI-REF-2026-0149",
    designation: "DevOps Engineer",
    businessUnit: "Engineering",
    company: "Manipal Technologies",
    dateAdded: "2026-03-25",
    completionPercent: 64,
    status: "in-progress",
    forms: [
      { id: "personal-info", title: "Personal Information", status: "Approved" },
      { id: "contact-info", title: "Contact Information", status: "Approved" },
      { id: "family-details", title: "Family Details", status: "Approved" },
      { id: "education", title: "Education Details", status: "Submitted" },
      { id: "work-experience", title: "Work Experience", status: "Submitted" },
      { id: "passport", title: "Passport Details", status: "Submitted" },
      { id: "health", title: "Health Information", status: "Draft" },
      { id: "individual-traits", title: "Individual Traits", status: "Pending" },
      { id: "general-info", title: "General Information", status: "Pending" },
      { id: "esg", title: "ESG", status: "Pending" },
      { id: "documents", title: "Documents", status: "Pending" }
    ]
  },
  {
    id: 6,
    name: "Sneha Reddy",
    refNumber: "MPI-REF-2026-0150",
    designation: "Marketing Manager",
    businessUnit: "Marketing",
    company: "Manipal Health Enterprises",
    dateAdded: "2026-03-27",
    completionPercent: 18,
    status: "in-progress",
    forms: [
      { id: "personal-info", title: "Personal Information", status: "Submitted" },
      { id: "contact-info", title: "Contact Information", status: "Draft" },
      { id: "family-details", title: "Family Details", status: "Pending" },
      { id: "education", title: "Education Details", status: "Pending" },
      { id: "work-experience", title: "Work Experience", status: "Pending" },
      { id: "passport", title: "Passport Details", status: "Pending" },
      { id: "health", title: "Health Information", status: "Pending" },
      { id: "individual-traits", title: "Individual Traits", status: "Pending" },
      { id: "general-info", title: "General Information", status: "Pending" },
      { id: "esg", title: "ESG", status: "Pending" },
      { id: "documents", title: "Documents", status: "Pending" }
    ]
  },
  {
    id: 7,
    name: "Karthik Kumar",
    refNumber: "MPI-REF-2026-0151",
    designation: "Financial Analyst",
    businessUnit: "Finance",
    company: "Manipal Education",
    dateAdded: "2026-03-28",
    completionPercent: 82,
    status: "submitted",
    forms: [
      { id: "personal-info", title: "Personal Information", status: "Approved" },
      { id: "contact-info", title: "Contact Information", status: "Approved" },
      { id: "family-details", title: "Family Details", status: "Approved" },
      { id: "education", title: "Education Details", status: "Approved" },
      { id: "work-experience", title: "Work Experience", status: "Submitted" },
      { id: "passport", title: "Passport Details", status: "Approved" },
      { id: "health", title: "Health Information", status: "Approved" },
      { id: "individual-traits", title: "Individual Traits", status: "Submitted" },
      { id: "general-info", title: "General Information", status: "Submitted" },
      { id: "esg", title: "ESG", status: "Pending" },
      { id: "documents", title: "Documents", status: "Pending" }
    ]
  },
  {
    id: 8,
    name: "Divya Iyer",
    refNumber: "MPI-REF-2026-0152",
    designation: "HR Business Partner",
    businessUnit: "Human Resources",
    company: "Manipal Global",
    dateAdded: "2026-03-30",
    completionPercent: 55,
    status: "in-progress",
    forms: [
      { id: "personal-info", title: "Personal Information", status: "Approved" },
      { id: "contact-info", title: "Contact Information", status: "Approved" },
      { id: "family-details", title: "Family Details", status: "Submitted" },
      { id: "education", title: "Education Details", status: "Submitted" },
      { id: "work-experience", title: "Work Experience", status: "Submitted" },
      { id: "passport", title: "Passport Details", status: "Draft" },
      { id: "health", title: "Health Information", status: "Pending" },
      { id: "individual-traits", title: "Individual Traits", status: "Pending" },
      { id: "general-info", title: "General Information", status: "Pending" },
      { id: "esg", title: "ESG", status: "Pending" },
      { id: "documents", title: "Documents", status: "Pending" }
    ]
  }
]

// Helper function to find candidate by ref number
export const getCandidateByRefNumber = (refNumber) => {
  return mockCandidates.find(c => c.refNumber === refNumber)
}

// Helper function to find candidate by ID
export const getCandidateById = (id) => {
  return mockCandidates.find(c => c.id === parseInt(id))
}
