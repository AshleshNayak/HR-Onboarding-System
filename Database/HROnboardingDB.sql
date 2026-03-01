-- ============================================================
-- HR ONBOARDING SYSTEM - MSSQL DATABASE SCHEMA
-- As per Project Summary Document
-- ============================================================

CREATE DATABASE HROnboardingDB;
GO

USE HROnboardingDB;
GO

-- ============================================================
-- SECTION 1: DROPDOWN / LOOKUP MASTER TABLES
-- (Managed directly in DB, no UI form needed)
-- ============================================================

CREATE TABLE tbl_States (
    StateID    INT IDENTITY(1,1) PRIMARY KEY,
    StateName  NVARCHAR(100) NOT NULL,
    Status     BIT           NOT NULL DEFAULT 1  -- 1=Active, 0=Inactive
);

CREATE TABLE tbl_Nationality (
    NationalityID   INT IDENTITY(1,1) PRIMARY KEY,
    NationalityName NVARCHAR(100) NOT NULL,
    Status          BIT           NOT NULL DEFAULT 1
);

CREATE TABLE tbl_BloodGroup (
    BloodGroupID   INT IDENTITY(1,1) PRIMARY KEY,
    BloodGroupName NVARCHAR(10)  NOT NULL,
    Status         BIT           NOT NULL DEFAULT 1
);

CREATE TABLE tbl_Relationship (
    RelationshipID   INT IDENTITY(1,1) PRIMARY KEY,
    RelationshipName NVARCHAR(50) NOT NULL,
    Status           BIT          NOT NULL DEFAULT 1
);

CREATE TABLE tbl_Qualification (
    QualificationID   INT IDENTITY(1,1) PRIMARY KEY,
    QualificationName NVARCHAR(100) NOT NULL,
    Status            BIT           NOT NULL DEFAULT 1
);

CREATE TABLE tbl_DocumentType (
    DocumentTypeID   INT IDENTITY(1,1) PRIMARY KEY,
    DocumentTypeName NVARCHAR(100) NOT NULL,
    Status           BIT           NOT NULL DEFAULT 1
);

-- ============================================================
-- SECTION 2: COMPANY MASTER
-- (Has UI form - Admin manages it)
-- ============================================================

CREATE TABLE tbl_CompanyMaster (
    CompanyID   INT IDENTITY(1,1) PRIMARY KEY,
    FullName    NVARCHAR(200) NOT NULL,
    ShortName   NVARCHAR(50)  NOT NULL,  -- Used in reports/charts
    Address     NVARCHAR(500) NULL,
    Status      BIT           NOT NULL DEFAULT 1,
    CreatedBy   INT           NOT NULL,
    CreatedAt   DATETIME      NOT NULL DEFAULT GETDATE(),
    ModifiedBy  INT           NULL,
    ModifiedAt  DATETIME      NULL
);

-- ============================================================
-- SECTION 3: BUSINESS UNIT MASTER
-- (Has UI form - Admin manages it)
-- ============================================================

CREATE TABLE tbl_BusinessUnitMaster (
    BusinessUnitID INT IDENTITY(1,1) PRIMARY KEY,
    CompanyID      INT           NOT NULL,
    UnitName       NVARCHAR(200) NOT NULL,
    ShortName      NVARCHAR(50)  NOT NULL,  -- Used in reports/charts
    Status         BIT           NOT NULL DEFAULT 1,
    CreatedBy      INT           NOT NULL,
    CreatedAt      DATETIME      NOT NULL DEFAULT GETDATE(),
    ModifiedBy     INT           NULL,
    ModifiedAt     DATETIME      NULL,
    CONSTRAINT FK_BU_Company FOREIGN KEY (CompanyID) REFERENCES tbl_CompanyMaster(CompanyID)
);

-- ============================================================
-- SECTION 4: ROLE MASTER
-- (Has UI form - Admin manages it)
-- ============================================================

CREATE TABLE tbl_RoleMaster (
    RoleID      INT IDENTITY(1,1) PRIMARY KEY,
    RoleName    NVARCHAR(100) NOT NULL,
    -- Roles: Admin, HR User, Security Manager, Security Executive
    Status      BIT           NOT NULL DEFAULT 1,
    CreatedBy   INT           NOT NULL,
    CreatedAt   DATETIME      NOT NULL DEFAULT GETDATE(),
    ModifiedBy  INT           NULL,
    ModifiedAt  DATETIME      NULL
);

-- ============================================================
-- SECTION 5: PERMISSION MASTER
-- (Has UI form - Admin manages it)
-- ============================================================

CREATE TABLE tbl_PermissionMaster (
    PermissionID   INT IDENTITY(1,1) PRIMARY KEY,
    PermissionName NVARCHAR(100) NOT NULL,
    Module         NVARCHAR(100) NOT NULL,  -- e.g. Admin, Candidate, Security
    Status         BIT           NOT NULL DEFAULT 1,
    CreatedBy      INT           NOT NULL,
    CreatedAt      DATETIME      NOT NULL DEFAULT GETDATE(),
    ModifiedBy     INT           NULL,
    ModifiedAt     DATETIME      NULL
);

-- ============================================================
-- SECTION 6: ROLE PERMISSIONS MAPPING
-- ============================================================

CREATE TABLE tbl_RolePermissions (
    RolePermissionID INT IDENTITY(1,1) PRIMARY KEY,
    RoleID           INT NOT NULL,
    PermissionID     INT NOT NULL,
    CreatedBy        INT NOT NULL,
    CreatedAt        DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_RP_Role       FOREIGN KEY (RoleID)       REFERENCES tbl_RoleMaster(RoleID),
    CONSTRAINT FK_RP_Permission FOREIGN KEY (PermissionID) REFERENCES tbl_PermissionMaster(PermissionID),
    CONSTRAINT UQ_RolePermission UNIQUE (RoleID, PermissionID)
);

-- ============================================================
-- SECTION 7: USER MASTER
-- Supports Custom and LDAP login types
-- (Has UI form - Admin manages it)
-- ============================================================

CREATE TABLE tbl_UserMaster (
    UserID         INT IDENTITY(1,1) PRIMARY KEY,
    FullName       NVARCHAR(200) NOT NULL,
    Username       NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash   NVARCHAR(500) NULL,     -- NULL if LoginType = 'LDAP'
    LoginType      NVARCHAR(10)  NOT NULL DEFAULT 'Custom', -- 'Custom' or 'LDAP'
    Email          NVARCHAR(200) NOT NULL,
    RoleID         INT           NOT NULL,
    CompanyID      INT           NULL,
    BusinessUnitID INT           NULL,
    Status         BIT           NOT NULL DEFAULT 1,
    CreatedBy      INT           NOT NULL,
    CreatedAt      DATETIME      NOT NULL DEFAULT GETDATE(),
    ModifiedBy     INT           NULL,
    ModifiedAt     DATETIME      NULL,
    CONSTRAINT FK_User_Role FOREIGN KEY (RoleID)         REFERENCES tbl_RoleMaster(RoleID),
    CONSTRAINT FK_User_Co   FOREIGN KEY (CompanyID)      REFERENCES tbl_CompanyMaster(CompanyID),
    CONSTRAINT FK_User_BU   FOREIGN KEY (BusinessUnitID) REFERENCES tbl_BusinessUnitMaster(BusinessUnitID)
);

-- ============================================================
-- SECTION 8: FORM MASTER
-- Central list of all forms available in the system
-- ============================================================

CREATE TABLE tbl_FormMaster (
    FormID      INT IDENTITY(1,1) PRIMARY KEY,
    FormName    NVARCHAR(200) NOT NULL,   -- e.g. Personal Details, Family Details
    FormCode    NVARCHAR(50)  NOT NULL UNIQUE,
    SortOrder   INT           NOT NULL DEFAULT 0,
    Status      BIT           NOT NULL DEFAULT 1,
    CreatedBy   INT           NOT NULL,
    CreatedAt   DATETIME      NOT NULL DEFAULT GETDATE(),
    ModifiedBy  INT           NULL,
    ModifiedAt  DATETIME      NULL
);

-- ============================================================
-- SECTION 9: CANDIDATE MASTER
-- HR enters basic candidate details here
-- Unique alphanumeric CandidateCode is auto-generated by backend
-- This code is embedded in the URL sent to the candidate
-- ============================================================

CREATE TABLE tbl_CandidateMaster (
    CandidateID    INT IDENTITY(1,1) PRIMARY KEY,
    CandidateCode  NVARCHAR(20)  NOT NULL UNIQUE,  -- Auto-generated alphanumeric by backend
    FirstName      NVARCHAR(100) NOT NULL,
    LastName       NVARCHAR(100) NOT NULL,
    Email          NVARCHAR(200) NOT NULL,
    PhoneNumber    NVARCHAR(20)  NOT NULL,
    Remarks        NVARCHAR(500) NULL,
    CompanyID      INT           NOT NULL,
    BusinessUnitID INT           NOT NULL,
    AccessURL      NVARCHAR(500) NULL,             -- URL sent to candidate (contains CandidateCode)
    OverallStatus  NVARCHAR(50)  NOT NULL DEFAULT 'Pending',
                                                   -- Pending | InProgress | SubmittedToHR
                                                   -- HRApproved | SecurityManagerApproved | Completed
    CreatedBy      INT           NOT NULL,
    CreatedAt      DATETIME      NOT NULL DEFAULT GETDATE(),
    ModifiedBy     INT           NULL,
    ModifiedAt     DATETIME      NULL,
    CONSTRAINT FK_Cand_Company FOREIGN KEY (CompanyID)      REFERENCES tbl_CompanyMaster(CompanyID),
    CONSTRAINT FK_Cand_BU      FOREIGN KEY (BusinessUnitID) REFERENCES tbl_BusinessUnitMaster(BusinessUnitID)
);

-- ============================================================
-- SECTION 10: CANDIDATE FORMS
-- Links each candidate to their assigned forms
-- One row per form per candidate
-- ============================================================

CREATE TABLE tbl_CandidateForms (
    CandidateFormID INT IDENTITY(1,1) PRIMARY KEY,
    CandidateID     INT          NOT NULL,
    FormID          INT          NOT NULL,
    Status          NVARCHAR(50) NOT NULL DEFAULT 'Pending',
                                          -- Pending | InProgress | Submitted | HRApproved
    IsLocked        BIT          NOT NULL DEFAULT 0,  -- 1 = Locked after HR approval (read-only)
    SubmittedAt     DATETIME     NULL,
    ApprovedBy      INT          NULL,    -- UserID of HR who approved
    ApprovedAt      DATETIME     NULL,
    CreatedAt       DATETIME     NOT NULL DEFAULT GETDATE(),
    ModifiedAt      DATETIME     NULL,
    CONSTRAINT FK_CF_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID),
    CONSTRAINT FK_CF_Form      FOREIGN KEY (FormID)      REFERENCES tbl_FormMaster(FormID),
    CONSTRAINT FK_CF_Approved  FOREIGN KEY (ApprovedBy)  REFERENCES tbl_UserMaster(UserID),
    CONSTRAINT UQ_CandidateForm UNIQUE (CandidateID, FormID)
);

-- ============================================================
-- SECTION 11: INDIVIDUAL FORM DATA TABLES
-- Separate table per form - stores detailed submitted data
-- All linked to CandidateForms via CandidateFormID
-- ============================================================

-- 11a. Personal Details Form
CREATE TABLE tbl_Form_PersonalDetails (
    PersonalDetailID  INT IDENTITY(1,1) PRIMARY KEY,
    CandidateFormID   INT           NOT NULL,
    CandidateID       INT           NOT NULL,
    -- Mandatory Fields
    NationalityID     INT           NOT NULL,  -- Mandatory as per summary
    DateOfBirth       DATE          NOT NULL,
    Gender            NVARCHAR(10)  NOT NULL,
    -- Optional Fields
    BloodGroupID      INT           NULL,
    AadhaarNumber     NVARCHAR(20)  NULL,
    PANNumber         NVARCHAR(20)  NULL,
    PassportNumber    NVARCHAR(20)  NULL,
    PassportExpiry    DATE          NULL,
    PermanentAddress  NVARCHAR(500) NULL,
    PermanentStateID  INT           NULL,
    PermanentPinCode  NVARCHAR(10)  NULL,
    CurrentAddress    NVARCHAR(500) NULL,
    CurrentStateID    INT           NULL,
    CurrentPinCode    NVARCHAR(10)  NULL,
    CreatedAt         DATETIME      NOT NULL DEFAULT GETDATE(),
    ModifiedAt        DATETIME      NULL,
    CONSTRAINT FK_PD_CandForm     FOREIGN KEY (CandidateFormID)  REFERENCES tbl_CandidateForms(CandidateFormID),
    CONSTRAINT FK_PD_Candidate    FOREIGN KEY (CandidateID)      REFERENCES tbl_CandidateMaster(CandidateID),
    CONSTRAINT FK_PD_Nationality  FOREIGN KEY (NationalityID)    REFERENCES tbl_Nationality(NationalityID),
    CONSTRAINT FK_PD_BloodGroup   FOREIGN KEY (BloodGroupID)     REFERENCES tbl_BloodGroup(BloodGroupID),
    CONSTRAINT FK_PD_PermState    FOREIGN KEY (PermanentStateID) REFERENCES tbl_States(StateID),
    CONSTRAINT FK_PD_CurrState    FOREIGN KEY (CurrentStateID)   REFERENCES tbl_States(StateID)
);

-- 11b. Education Details Form
CREATE TABLE tbl_Form_EducationDetails (
    EducationDetailID INT IDENTITY(1,1) PRIMARY KEY,
    CandidateFormID   INT           NOT NULL,
    CandidateID       INT           NOT NULL,
    -- Mandatory
    QualificationID   INT           NOT NULL,
    InstituteName     NVARCHAR(300) NOT NULL,
    -- Optional
    BoardUniversity   NVARCHAR(300) NULL,
    PassingYear       INT           NULL,
    Percentage        DECIMAL(5,2)  NULL,
    Specialization    NVARCHAR(200) NULL,
    CreatedAt         DATETIME      NOT NULL DEFAULT GETDATE(),
    ModifiedAt        DATETIME      NULL,
    CONSTRAINT FK_ED_CandForm  FOREIGN KEY (CandidateFormID) REFERENCES tbl_CandidateForms(CandidateFormID),
    CONSTRAINT FK_ED_Candidate FOREIGN KEY (CandidateID)     REFERENCES tbl_CandidateMaster(CandidateID),
    CONSTRAINT FK_ED_Qual      FOREIGN KEY (QualificationID) REFERENCES tbl_Qualification(QualificationID)
);

-- 11c. Family Details Form
-- Optional form - variable number of entries per candidate
CREATE TABLE tbl_Form_FamilyDetails (
    FamilyDetailID  INT IDENTITY(1,1) PRIMARY KEY,
    CandidateFormID INT           NOT NULL,
    CandidateID     INT           NOT NULL,
    MemberName      NVARCHAR(200) NOT NULL,
    RelationshipID  INT           NOT NULL,
    DateOfBirth     DATE          NULL,
    Occupation      NVARCHAR(200) NULL,
    ContactNumber   NVARCHAR(20)  NULL,
    CreatedAt       DATETIME      NOT NULL DEFAULT GETDATE(),
    ModifiedAt      DATETIME      NULL,
    CONSTRAINT FK_FD_CandForm     FOREIGN KEY (CandidateFormID) REFERENCES tbl_CandidateForms(CandidateFormID),
    CONSTRAINT FK_FD_Candidate    FOREIGN KEY (CandidateID)     REFERENCES tbl_CandidateMaster(CandidateID),
    CONSTRAINT FK_FD_Relationship FOREIGN KEY (RelationshipID)  REFERENCES tbl_Relationship(RelationshipID)
);

-- 11d. Employment History Form
CREATE TABLE tbl_Form_EmploymentHistory (
    EmploymentID     INT IDENTITY(1,1) PRIMARY KEY,
    CandidateFormID  INT           NOT NULL,
    CandidateID      INT           NOT NULL,
    EmployerName     NVARCHAR(300) NOT NULL,
    Designation      NVARCHAR(200) NULL,
    FromDate         DATE          NULL,
    ToDate           DATE          NULL,
    ReasonForLeaving NVARCHAR(500) NULL,
    ReferenceContact NVARCHAR(200) NULL,
    CreatedAt        DATETIME      NOT NULL DEFAULT GETDATE(),
    ModifiedAt       DATETIME      NULL,
    CONSTRAINT FK_EH_CandForm  FOREIGN KEY (CandidateFormID) REFERENCES tbl_CandidateForms(CandidateFormID),
    CONSTRAINT FK_EH_Candidate FOREIGN KEY (CandidateID)     REFERENCES tbl_CandidateMaster(CandidateID)
);

-- 11e. Document Upload Form
CREATE TABLE tbl_Form_Documents (
    DocumentID      INT IDENTITY(1,1) PRIMARY KEY,
    CandidateFormID INT           NOT NULL,
    CandidateID     INT           NOT NULL,
    DocumentTypeID  INT           NOT NULL,
    FileName        NVARCHAR(300) NOT NULL,
    FilePath        NVARCHAR(500) NOT NULL,
    FileSize        INT           NULL,       -- in KB
    UploadedAt      DATETIME      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Doc_CandForm  FOREIGN KEY (CandidateFormID) REFERENCES tbl_CandidateForms(CandidateFormID),
    CONSTRAINT FK_Doc_Candidate FOREIGN KEY (CandidateID)     REFERENCES tbl_CandidateMaster(CandidateID),
    CONSTRAINT FK_Doc_DocType   FOREIGN KEY (DocumentTypeID)  REFERENCES tbl_DocumentType(DocumentTypeID)
);

-- ============================================================
-- SECTION 12: APPROVAL WORKFLOW
-- Tracks each approval stage per candidate
-- HR Approval → Security Manager Approval → Security Executive Verification
-- ============================================================

CREATE TABLE tbl_CandidateApprovals (
    ApprovalID     INT IDENTITY(1,1) PRIMARY KEY,
    CandidateID    INT           NOT NULL,
    ApprovalStage  NVARCHAR(50)  NOT NULL,
                                 -- 'HRApproval' | 'SecurityManagerApproval' | 'SecurityExecutiveVerification'
    ApprovalStatus NVARCHAR(20)  NOT NULL,
                                 -- 'Approved' | 'Rejected' | 'OnHold'
    Remarks        NVARCHAR(500) NULL,
    ApprovedBy     INT           NOT NULL,  -- UserID
    ApprovedAt     DATETIME      NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Approval_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID),
    CONSTRAINT FK_Approval_User      FOREIGN KEY (ApprovedBy)  REFERENCES tbl_UserMaster(UserID)
);

-- ============================================================
-- SECTION 13: AUDIT LOG
-- Tracks who created/modified any master record
-- ============================================================

CREATE TABLE tbl_AuditLog (
    AuditID     INT IDENTITY(1,1) PRIMARY KEY,
    TableName   NVARCHAR(100) NOT NULL,
    RecordID    INT           NOT NULL,
    Action      NVARCHAR(10)  NOT NULL,    -- 'INSERT' | 'UPDATE' | 'DELETE'
    OldValues   NVARCHAR(MAX) NULL,        -- JSON snapshot before change
    NewValues   NVARCHAR(MAX) NULL,        -- JSON snapshot after change
    PerformedBy INT           NOT NULL,
    PerformedAt DATETIME      NOT NULL DEFAULT GETDATE(),
    IPAddress   NVARCHAR(50)  NULL
);

-- ============================================================
-- SECTION 14: SEED DATA
-- ============================================================

-- Roles (as described in summary)
INSERT INTO tbl_RoleMaster (RoleName, Status, CreatedBy) VALUES
('Admin',               1, 1),
('HR User',             1, 1),
('Security Manager',    1, 1),
('Security Executive',  1, 1);

-- Permissions
INSERT INTO tbl_PermissionMaster (PermissionName, Module, Status, CreatedBy) VALUES
('UserCreate',                  'Admin',     1, 1),
('UserEdit',                    'Admin',     1, 1),
('RoleManage',                  'Admin',     1, 1),
('PermissionManage',            'Admin',     1, 1),
('CompanyManage',               'Admin',     1, 1),
('BusinessUnitManage',          'Admin',     1, 1),
('CandidateCreate',             'Candidate', 1, 1),
('CandidateView',               'Candidate', 1, 1),
('CandidateFormApprove',        'Candidate', 1, 1),
('SecurityManagerApprove',      'Security',  1, 1),
('SecurityExecutiveVerify',     'Security',  1, 1);

-- Blood Groups
INSERT INTO tbl_BloodGroup (BloodGroupName, Status) VALUES
('A+', 1), ('A-', 1), ('B+', 1), ('B-', 1),
('AB+', 1), ('AB-', 1), ('O+', 1), ('O-', 1);

-- Relationships
INSERT INTO tbl_Relationship (RelationshipName, Status) VALUES
('Father', 1), ('Mother', 1), ('Spouse', 1),
('Son', 1), ('Daughter', 1), ('Sibling', 1), ('Guardian', 1);

-- Nationality (Sample)
INSERT INTO tbl_Nationality (NationalityName, Status) VALUES
('Indian', 1), ('American', 1), ('British', 1),
('Canadian', 1), ('Australian', 1), ('Other', 1);

-- States (Sample - India)
INSERT INTO tbl_States (StateName, Status) VALUES
('Andhra Pradesh', 1), ('Karnataka', 1), ('Maharashtra', 1),
('Tamil Nadu', 1), ('Telangana', 1), ('Gujarat', 1),
('Rajasthan', 1), ('Uttar Pradesh', 1), ('West Bengal', 1), ('Delhi', 1);

-- Document Types
INSERT INTO tbl_DocumentType (DocumentTypeName, Status) VALUES
('Aadhaar Card', 1), ('PAN Card', 1), ('Passport', 1),
('Degree Certificate', 1), ('Experience Letter', 1),
('Offer Letter', 1), ('Relieving Letter', 1), ('Photograph', 1);

-- Qualifications
INSERT INTO tbl_Qualification (QualificationName, Status) VALUES
('10th (SSC)', 1), ('12th (HSC)', 1), ('Diploma', 1),
('Bachelor''s Degree', 1), ('Master''s Degree', 1),
('MBA', 1), ('PhD', 1), ('Other', 1);

-- Form Master
INSERT INTO tbl_FormMaster (FormName, FormCode, SortOrder, Status, CreatedBy) VALUES
('Personal Details',    'PERSONAL',   1, 1, 1),
('Education Details',   'EDUCATION',  2, 1, 1),
('Family Details',      'FAMILY',     3, 1, 1),
('Employment History',  'EMPLOYMENT', 4, 1, 1),
('Document Upload',     'DOCUMENTS',  5, 1, 1);

-- Sample Company
INSERT INTO tbl_CompanyMaster (FullName, ShortName, Address, Status, CreatedBy) VALUES
('ABC Technologies Pvt Ltd', 'ABCTECH', 'Mumbai, Maharashtra', 1, 1);

-- Sample Business Unit
INSERT INTO tbl_BusinessUnitMaster (CompanyID, UnitName, ShortName, Status, CreatedBy) VALUES
(1, 'Human Resources',      'HR',  1, 1),
(1, 'Information Technology', 'IT', 1, 1),
(1, 'Finance & Accounts',   'FIN', 1, 1);

-- ============================================================
-- END OF SCHEMA
-- ============================================================
