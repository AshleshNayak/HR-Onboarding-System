-- ============================================================
-- HR ONBOARDING SYSTEM - MSSQL DATABASE SCHEMA
-- ============================================================
CREATE DATABASE HROnboardingDB;
GO USE HROnboardingDB;
GO -- ============================================================
    -- SECTION 1: DROPDOWN / LOOKUP MASTER TABLES
    -- ============================================================
    CREATE TABLE tbl_States (
        StateID INT IDENTITY(1, 1) PRIMARY KEY,
        StateName NVARCHAR(100) NOT NULL,
        Status BIT NOT NULL DEFAULT 1 -- 1=Active, 0=Inactive
    );
CREATE TABLE tbl_Nationality (
    NationalityID INT IDENTITY(1, 1) PRIMARY KEY,
    NationalityName NVARCHAR(100) NOT NULL,
    Status BIT NOT NULL DEFAULT 1
);
CREATE TABLE tbl_BloodGroup (
    BloodGroupID INT IDENTITY(1, 1) PRIMARY KEY,
    BloodGroupName NVARCHAR(10) NOT NULL,
    Status BIT NOT NULL DEFAULT 1
);
CREATE TABLE tbl_Relationship (
    RelationshipID INT IDENTITY(1, 1) PRIMARY KEY,
    RelationshipName NVARCHAR(50) NOT NULL,
    Status BIT NOT NULL DEFAULT 1
);
CREATE TABLE tbl_Qualification (
    QualificationID INT IDENTITY(1, 1) PRIMARY KEY,
    QualificationName NVARCHAR(100) NOT NULL,
    Status BIT NOT NULL DEFAULT 1
);
CREATE TABLE tbl_DocumentType (
    DocumentTypeID INT IDENTITY(1, 1) PRIMARY KEY,
    DocumentTypeName NVARCHAR(100) NOT NULL,
    Status BIT NOT NULL DEFAULT 1
);
-- ============================================================
-- SECTION 2: COMPANY MASTER
-- ============================================================
CREATE TABLE tbl_CompanyMaster (
    CompanyID INT IDENTITY(1, 1) PRIMARY KEY,
    FullName NVARCHAR(200) NOT NULL,
    ShortName NVARCHAR(50) NOT NULL,
    -- Used in reports/charts
    Address NVARCHAR(500) NULL,
    Status BIT NOT NULL DEFAULT 1,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedBy INT NULL,
    ModifiedAt DATETIME NULL
);
-- ============================================================
-- SECTION 3: BUSINESS UNIT MASTER
-- ============================================================
CREATE TABLE tbl_BusinessUnitMaster (
    BusinessUnitID INT IDENTITY(1, 1) PRIMARY KEY,
    CompanyID INT NOT NULL,
    UnitName NVARCHAR(200) NOT NULL,
    ShortName NVARCHAR(50) NOT NULL,
    -- Used in reports/charts
    Status BIT NOT NULL DEFAULT 1,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedBy INT NULL,
    ModifiedAt DATETIME NULL,
    CONSTRAINT FK_BU_Company FOREIGN KEY (CompanyID) REFERENCES tbl_CompanyMaster(CompanyID)
);
-- ============================================================
-- SECTION 4: ROLE MASTER
-- ============================================================
CREATE TABLE tbl_RoleMaster (
    RoleID INT IDENTITY(1, 1) PRIMARY KEY,
    RoleName NVARCHAR(100) NOT NULL,
    -- Roles: Admin, HR User, Security Manager, Security Executive
    Status BIT NOT NULL DEFAULT 1,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedBy INT NULL,
    ModifiedAt DATETIME NULL
);
-- ============================================================
-- SECTION 5: PERMISSION MASTER
-- ============================================================
CREATE TABLE tbl_PermissionMaster (
    PermissionID INT IDENTITY(1, 1) PRIMARY KEY,
    PermissionName NVARCHAR(100) NOT NULL,
    Module NVARCHAR(100) NOT NULL,
    -- e.g. Admin, Candidate, Security
    Status BIT NOT NULL DEFAULT 1,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedBy INT NULL,
    ModifiedAt DATETIME NULL
);
-- ============================================================
-- SECTION 6: ROLE PERMISSIONS MAPPING
-- ============================================================
CREATE TABLE tbl_RolePermissions (
    RolePermissionID INT IDENTITY(1, 1) PRIMARY KEY,
    RoleID INT NOT NULL,
    PermissionID INT NOT NULL,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_RP_Role FOREIGN KEY (RoleID) REFERENCES tbl_RoleMaster(RoleID),
    CONSTRAINT FK_RP_Permission FOREIGN KEY (PermissionID) REFERENCES tbl_PermissionMaster(PermissionID),
    CONSTRAINT UQ_RolePermission UNIQUE (RoleID, PermissionID)
);
-- ============================================================
-- SECTION 7: USER MASTER
-- Supports Custom and LDAP login types
-- ============================================================
CREATE TABLE tbl_UserMaster (
    UserID INT IDENTITY(1, 1) PRIMARY KEY,
    FullName NVARCHAR(200) NOT NULL,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(500) NULL,
    -- NULL if LoginType = 'LDAP'
    LoginType NVARCHAR(10) NOT NULL DEFAULT 'Custom',
    -- 'Custom' or 'LDAP'
    Email NVARCHAR(200) NOT NULL,
    RoleID INT NOT NULL,
    CompanyID INT NULL,
    BusinessUnitID INT NULL,
    Status BIT NOT NULL DEFAULT 1,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedBy INT NULL,
    ModifiedAt DATETIME NULL,
    CONSTRAINT FK_User_Role FOREIGN KEY (RoleID) REFERENCES tbl_RoleMaster(RoleID),
    CONSTRAINT FK_User_Co FOREIGN KEY (CompanyID) REFERENCES tbl_CompanyMaster(CompanyID),
    CONSTRAINT FK_User_BU FOREIGN KEY (BusinessUnitID) REFERENCES tbl_BusinessUnitMaster(BusinessUnitID)
);
-- ============================================================
-- SECTION 8: FORM MASTER
-- ============================================================
CREATE TABLE tbl_FormMaster (
    FormID INT IDENTITY(1, 1) PRIMARY KEY,
    FormName NVARCHAR(200) NOT NULL,
    -- e.g. Personal Details, Family Details
    FormCode NVARCHAR(50) NOT NULL UNIQUE,
    SortOrder INT NOT NULL DEFAULT 0,
    Status BIT NOT NULL DEFAULT 1,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedBy INT NULL,
    ModifiedAt DATETIME NULL
);
-- ============================================================
-- SECTION 9: CANDIDATE MASTER
-- Updated as per Schema Sheet
-- ============================================================
CREATE TABLE tbl_CandidateMaster (
    CandidateID INT IDENTITY(1, 1) PRIMARY KEY,
    CandidateCode NVARCHAR(20) NOT NULL UNIQUE,
    -- Unique alphanumeric, auto-generated by backend
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(200) NOT NULL,
    Phone NVARCHAR(20) NULL,
    CompanyID INT NOT NULL,
    -- FK - Company reference
    BusinessUnitID INT NOT NULL,
    -- FK - Unit reference
    UniqueLink NVARCHAR(500) NULL,
    -- URL sent to candidate (contains CandidateCode)
    Validity DATETIME NULL,
    -- Link expiry date/time
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    -- Pending | Submitted | Verified
    -- Security Manager Approved | Completed | Cancelled
    HRVerificationBy INT NULL,
    -- FK → UserMaster
    HRVerifiedDate DATETIME NULL,
    SecurityManagerApprovalBy INT NULL,
    -- FK → UserMaster
    SecurityManagerApprovalDate DATETIME NULL,
    SecurityOfficerApprovalBy INT NULL,
    -- FK → UserMaster
    SecurityOfficerApprovalDate DATETIME NULL,
    SecurityOfficerApprovalRemarks NVARCHAR(500) NULL,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedBy INT NULL,
    ModifiedAt DATETIME NULL,
    CONSTRAINT FK_Cand_Company FOREIGN KEY (CompanyID) REFERENCES tbl_CompanyMaster(CompanyID),
    CONSTRAINT FK_Cand_BU FOREIGN KEY (BusinessUnitID) REFERENCES tbl_BusinessUnitMaster(BusinessUnitID),
    CONSTRAINT FK_Cand_HRVerBy FOREIGN KEY (HRVerificationBy) REFERENCES tbl_UserMaster(UserID),
    CONSTRAINT FK_Cand_SecMgrBy FOREIGN KEY (SecurityManagerApprovalBy) REFERENCES tbl_UserMaster(UserID),
    CONSTRAINT FK_Cand_SecOfficBy FOREIGN KEY (SecurityOfficerApprovalBy) REFERENCES tbl_UserMaster(UserID)
);
-- ============================================================
-- SECTION 10: CANDIDATE FORMS
-- ============================================================
CREATE TABLE tbl_CandidateForms (
    CandidateFormID INT IDENTITY(1, 1) PRIMARY KEY,
    CandidateID INT NOT NULL,
    FormID INT NOT NULL,
    Status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    -- Pending | InProgress | Submitted | HRApproved
    IsLocked BIT NOT NULL DEFAULT 0,
    -- 1 = Locked after HR approval (read-only)
    SubmittedAt DATETIME NULL,
    ApprovedBy INT NULL,
    -- UserID of HR who approved
    ApprovedAt DATETIME NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedAt DATETIME NULL,
    CONSTRAINT FK_CF_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID),
    CONSTRAINT FK_CF_Form FOREIGN KEY (FormID) REFERENCES tbl_FormMaster(FormID),
    CONSTRAINT FK_CF_Approved FOREIGN KEY (ApprovedBy) REFERENCES tbl_UserMaster(UserID),
    CONSTRAINT UQ_CandidateForm UNIQUE (CandidateID, FormID)
);
-- ============================================================
-- SECTION 11: INDIVIDUAL FORM DATA TABLES
-- ============================================================
-- 11a. Personal Details Form
CREATE TABLE tbl_Form_PersonalDetails (
    PersonalDetailID INT IDENTITY(1, 1) PRIMARY KEY,
    CandidateFormID INT NOT NULL,
    CandidateID INT NOT NULL,
    -- Mandatory Fields
    NationalityID INT NOT NULL,
    DateOfBirth DATE NOT NULL,
    Gender NVARCHAR(10) NOT NULL,
    -- Optional Fields
    BloodGroupID INT NULL,
    AadhaarNumber NVARCHAR(20) NULL,
    PANNumber NVARCHAR(20) NULL,
    PassportNumber NVARCHAR(20) NULL,
    PassportExpiry DATE NULL,
    PermanentAddress NVARCHAR(500) NULL,
    PermanentStateID INT NULL,
    PermanentPinCode NVARCHAR(10) NULL,
    CurrentAddress NVARCHAR(500) NULL,
    CurrentStateID INT NULL,
    CurrentPinCode NVARCHAR(10) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedAt DATETIME NULL,
    CONSTRAINT FK_PD_CandForm FOREIGN KEY (CandidateFormID) REFERENCES tbl_CandidateForms(CandidateFormID),
    CONSTRAINT FK_PD_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID),
    CONSTRAINT FK_PD_Nationality FOREIGN KEY (NationalityID) REFERENCES tbl_Nationality(NationalityID),
    CONSTRAINT FK_PD_BloodGroup FOREIGN KEY (BloodGroupID) REFERENCES tbl_BloodGroup(BloodGroupID),
    CONSTRAINT FK_PD_PermState FOREIGN KEY (PermanentStateID) REFERENCES tbl_States(StateID),
    CONSTRAINT FK_PD_CurrState FOREIGN KEY (CurrentStateID) REFERENCES tbl_States(StateID)
);
-- 11b. Education Details Form
CREATE TABLE tbl_Form_EducationDetails (
    EducationDetailID INT IDENTITY(1, 1) PRIMARY KEY,
    CandidateFormID INT NOT NULL,
    CandidateID INT NOT NULL,
    -- Mandatory
    QualificationID INT NOT NULL,
    InstituteName NVARCHAR(300) NOT NULL,
    -- Optional
    BoardUniversity NVARCHAR(300) NULL,
    PassingYear INT NULL,
    Percentage DECIMAL(5, 2) NULL,
    Specialization NVARCHAR(200) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedAt DATETIME NULL,
    CONSTRAINT FK_ED_CandForm FOREIGN KEY (CandidateFormID) REFERENCES tbl_CandidateForms(CandidateFormID),
    CONSTRAINT FK_ED_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID),
    CONSTRAINT FK_ED_Qual FOREIGN KEY (QualificationID) REFERENCES tbl_Qualification(QualificationID)
);
-- 11c. Family Details Form
-- Optional form - variable number of entries per candidate
CREATE TABLE tbl_Form_FamilyDetails (
    FamilyDetailID INT IDENTITY(1, 1) PRIMARY KEY,
    CandidateFormID INT NOT NULL,
    CandidateID INT NOT NULL,
    MemberName NVARCHAR(200) NOT NULL,
    RelationshipID INT NOT NULL,
    DateOfBirth DATE NULL,
    Occupation NVARCHAR(200) NULL,
    ContactNumber NVARCHAR(20) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedAt DATETIME NULL,
    CONSTRAINT FK_FD_CandForm FOREIGN KEY (CandidateFormID) REFERENCES tbl_CandidateForms(CandidateFormID),
    CONSTRAINT FK_FD_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID),
    CONSTRAINT FK_FD_Relationship FOREIGN KEY (RelationshipID) REFERENCES tbl_Relationship(RelationshipID)
);
-- 11d. Employment History Form
CREATE TABLE tbl_Form_EmploymentHistory (
    EmploymentID INT IDENTITY(1, 1) PRIMARY KEY,
    CandidateFormID INT NOT NULL,
    CandidateID INT NOT NULL,
    EmployerName NVARCHAR(300) NOT NULL,
    Designation NVARCHAR(200) NULL,
    FromDate DATE NULL,
    ToDate DATE NULL,
    ReasonForLeaving NVARCHAR(500) NULL,
    ReferenceContact NVARCHAR(200) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ModifiedAt DATETIME NULL,
    CONSTRAINT FK_EH_CandForm FOREIGN KEY (CandidateFormID) REFERENCES tbl_CandidateForms(CandidateFormID),
    CONSTRAINT FK_EH_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
);
-- 11e. Document Upload Form
CREATE TABLE tbl_Form_Documents (
    DocumentID INT IDENTITY(1, 1) PRIMARY KEY,
    CandidateFormID INT NOT NULL,
    CandidateID INT NOT NULL,
    DocumentTypeID INT NOT NULL,
    FileName NVARCHAR(300) NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    FileSize INT NULL,
    -- in KB
    UploadedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Doc_CandForm FOREIGN KEY (CandidateFormID) REFERENCES tbl_CandidateForms(CandidateFormID),
    CONSTRAINT FK_Doc_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID),
    CONSTRAINT FK_Doc_DocType FOREIGN KEY (DocumentTypeID) REFERENCES tbl_DocumentType(DocumentTypeID)
);
-- ============================================================
-- SECTION 12: APPROVAL WORKFLOW
-- ============================================================
CREATE TABLE tbl_CandidateApprovals (
    ApprovalID INT IDENTITY(1, 1) PRIMARY KEY,
    CandidateID INT NOT NULL,
    ApprovalStage NVARCHAR(50) NOT NULL,
    -- 'HRApproval' | 'SecurityManagerApproval' | 'SecurityExecutiveVerification'
    ApprovalStatus NVARCHAR(20) NOT NULL,
    -- 'Approved' | 'Rejected' | 'OnHold'
    Remarks NVARCHAR(500) NULL,
    ApprovedBy INT NOT NULL,
    -- UserID
    ApprovedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Approval_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID),
    CONSTRAINT FK_Approval_User FOREIGN KEY (ApprovedBy) REFERENCES tbl_UserMaster(UserID)
);
-- ============================================================
-- SECTION 13: AUDIT LOG
-- Tracks who created/modified any master record
-- ============================================================
CREATE TABLE tbl_AuditLog (
    AuditID INT IDENTITY(1, 1) PRIMARY KEY,
    TableName NVARCHAR(100) NOT NULL,
    RecordID INT NOT NULL,
    Action NVARCHAR(10) NOT NULL,
    -- 'INSERT' | 'UPDATE' | 'DELETE'
    OldValues NVARCHAR(MAX) NULL,
    -- JSON snapshot before change
    NewValues NVARCHAR(MAX) NULL,
    -- JSON snapshot after change
    PerformedBy INT NOT NULL,
    PerformedAt DATETIME NOT NULL DEFAULT GETDATE(),
    IPAddress NVARCHAR(50) NULL
);
-- ============================================================
-- SECTION 14: SEED DATA
-- ============================================================
-- Roles
INSERT INTO tbl_RoleMaster (RoleName, Status, CreatedBy)
VALUES ('Admin', 1, 1),
    ('HR User', 1, 1),
    ('Security Manager', 1, 1),
    ('Security Executive', 1, 1);
-- Permissions
INSERT INTO tbl_PermissionMaster (PermissionName, Module, Status, CreatedBy)
VALUES ('UserCreate', 'Admin', 1, 1),
    ('UserEdit', 'Admin', 1, 1),
    ('RoleManage', 'Admin', 1, 1),
    ('PermissionManage', 'Admin', 1, 1),
    ('CompanyManage', 'Admin', 1, 1),
    ('BusinessUnitManage', 'Admin', 1, 1),
    ('CandidateCreate', 'Candidate', 1, 1),
    ('CandidateView', 'Candidate', 1, 1),
    ('CandidateFormApprove', 'Candidate', 1, 1),
    ('SecurityManagerApprove', 'Security', 1, 1),
    ('SecurityExecutiveVerify', 'Security', 1, 1);
-- Blood Groups
INSERT INTO tbl_BloodGroup (BloodGroupName, Status)
VALUES ('A+', 1),
    ('A-', 1),
    ('B+', 1),
    ('B-', 1),
    ('AB+', 1),
    ('AB-', 1),
    ('O+', 1),
    ('O-', 1);
-- Relationships
INSERT INTO tbl_Relationship (RelationshipName, Status)
VALUES ('Father', 1),
    ('Mother', 1),
    ('Spouse', 1),
    ('Son', 1),
    ('Daughter', 1),
    ('Sibling', 1),
    ('Guardian', 1);
-- Nationality (Sample)
INSERT INTO tbl_Nationality (NationalityName, Status)
VALUES ('Indian', 1),
    ('American', 1),
    ('British', 1),
    ('Canadian', 1),
    ('Australian', 1),
    ('Other', 1);
-- States (Sample - India)
INSERT INTO tbl_States (StateName, Status)
VALUES ('Andhra Pradesh', 1),
    ('Karnataka', 1),
    ('Maharashtra', 1),
    ('Tamil Nadu', 1),
    ('Telangana', 1),
    ('Gujarat', 1),
    ('Rajasthan', 1),
    ('Uttar Pradesh', 1),
    ('West Bengal', 1),
    ('Delhi', 1);
-- Document Types
INSERT INTO tbl_DocumentType (DocumentTypeName, Status)
VALUES ('Aadhaar Card', 1),
    ('PAN Card', 1),
    ('Passport', 1),
    ('Degree Certificate', 1),
    ('Experience Letter', 1),
    ('Offer Letter', 1),
    ('Relieving Letter', 1),
    ('Photograph', 1);
-- Qualifications
INSERT INTO tbl_Qualification (QualificationName, Status)
VALUES ('10th (SSC)', 1),
    ('12th (HSC)', 1),
    ('Diploma', 1),
    ('Bachelor''s Degree', 1),
    ('Master''s Degree', 1),
    ('MBA', 1),
    ('PhD', 1),
    ('Other', 1);
-- Form Master
INSERT INTO tbl_FormMaster (FormName, FormCode, SortOrder, Status, CreatedBy)
VALUES ('Personal Details', 'PERSONAL', 1, 1, 1),
    ('Education Details', 'EDUCATION', 2, 1, 1),
    ('Family Details', 'FAMILY', 3, 1, 1),
    ('Employment History', 'EMPLOYMENT', 4, 1, 1),
    ('Document Upload', 'DOCUMENTS', 5, 1, 1);
-- Sample Company
INSERT INTO tbl_CompanyMaster (FullName, ShortName, Address, Status, CreatedBy)
VALUES (
        'ABC Technologies Pvt Ltd',
        'ABCTECH',
        'Mumbai, Maharashtra',
        1,
        1
    );
-- Sample Business Unit
INSERT INTO tbl_BusinessUnitMaster (
        CompanyID,
        UnitName,
        ShortName,
        Status,
        CreatedBy
    )
VALUES (1, 'Human Resources', 'HR', 1, 1),
    (1, 'Information Technology', 'IT', 1, 1),
    (1, 'Finance & Accounts', 'FIN', 1, 1);
-- ============================================================
-- SECTION: ADDITIONAL FORM TABLES (18 NEW TABLES)
-- ============================================================
-- ============================================================
-- 1. tbl_Form_PersonalInfo
-- ============================================================
IF NOT EXISTS (
    SELECT *
    FROM sys.tables
    WHERE name = 'tbl_Form_PersonalInfo'
) BEGIN CREATE TABLE tbl_Form_PersonalInfo (
    PersonalInfoID INT IDENTITY(1, 1) PRIMARY KEY,
    CandidateID INT NOT NULL,
    FullNameAsPerRecords NVARCHAR(200) NULL,
    Gender NVARCHAR(10) NULL,
    DateOfBirth DATE NULL,
    Age AS (DATEDIFF(YEAR, DateOfBirth, GETDATE())) PERSISTED,
    PlaceOfBirth NVARCHAR(100) NULL,
    State NVARCHAR(100) NULL,
    Pincode NVARCHAR(10) NULL,
    MaritalStatus NVARCHAR(20) NULL,
    CandidateSignaturePath NVARCHAR(500) NULL,
    FormStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (
        FormStatus IN (
            'Pending',
            'Draft',
            'Submitted',
            'Approved',
            'Rejected'
        )
    ),
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_PersonalInfo_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
);
END
GO -- ============================================================
    -- 2. tbl_Form_FamilyDetails (Main form - not child)
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_FamilyDetails'
    ) BEGIN CREATE TABLE tbl_Form_FamilyDetails (
        FamilyDetailsID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        FatherName NVARCHAR(100) NULL,
        FatherOccupation NVARCHAR(100) NULL,
        FatherAge INT NULL,
        MotherName NVARCHAR(100) NULL,
        MotherOccupation NVARCHAR(100) NULL,
        MotherAge INT NULL,
        SpouseName NVARCHAR(100) NULL,
        SpouseOccupation NVARCHAR(100) NULL,
        SpouseAge INT NULL,
        NumberOfChildren INT NULL DEFAULT 0,
        AnnualFamilyIncome NVARCHAR(50) NULL,
        FormStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (
            FormStatus IN (
                'Pending',
                'Draft',
                'Submitted',
                'Approved',
                'Rejected'
            )
        ),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_FamilyDetails_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 3. tbl_Form_ChildrenDetails (CHILD TABLE - no FormStatus)
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_ChildrenDetails'
    ) BEGIN CREATE TABLE tbl_Form_ChildrenDetails (
        ChildID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        ChildName NVARCHAR(100) NULL,
        ChildAge INT NULL,
        ChildGender NVARCHAR(10) NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_ChildrenDetails_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 4. tbl_Form_ContactInfo
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_ContactInfo'
    ) BEGIN CREATE TABLE tbl_Form_ContactInfo (
        ContactInfoID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        PresentAddress NVARCHAR(500) NULL,
        PermanentAddress NVARCHAR(500) NULL,
        SameAsPresent BIT NOT NULL DEFAULT 0,
        MobileNo NVARCHAR(15) NULL,
        EmailID NVARCHAR(200) NULL,
        FormStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (
            FormStatus IN (
                'Pending',
                'Draft',
                'Submitted',
                'Approved',
                'Rejected'
            )
        ),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_ContactInfo_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 5. tbl_Form_PassportDetails
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_PassportDetails'
    ) BEGIN CREATE TABLE tbl_Form_PassportDetails (
        PassportDetailsID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        PassportHolder BIT NOT NULL DEFAULT 0,
        PassportNo NVARCHAR(20) NULL,
        PassportIssueDate DATE NULL,
        PassportValidTill DATE NULL,
        PassportIssuePlace NVARCHAR(100) NULL,
        FormStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (
            FormStatus IN (
                'Pending',
                'Draft',
                'Submitted',
                'Approved',
                'Rejected'
            )
        ),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_PassportDetails_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 6. tbl_Form_IndividualTraits
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_IndividualTraits'
    ) BEGIN CREATE TABLE tbl_Form_IndividualTraits (
        IndividualTraitsID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        DrinkingHabit BIT NULL,
        GamblingHabit BIT NULL,
        DrugAbuse BIT NULL,
        CriminalRecord BIT NULL,
        ArrestHistory BIT NULL,
        IndividualRemarks NVARCHAR(500) NULL,
        FormStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (
            FormStatus IN (
                'Pending',
                'Draft',
                'Submitted',
                'Approved',
                'Rejected'
            )
        ),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_IndividualTraits_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 7. tbl_Form_Education
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_Education'
    ) BEGIN CREATE TABLE tbl_Form_Education (
        EducationID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        SSLC_Institution NVARCHAR(200) NULL,
        SSLC_Year INT NULL,
        SSLC_Percentage DECIMAL(5, 2) NULL,
        PUC_Institution NVARCHAR(200) NULL,
        PUC_Year INT NULL,
        PUC_Percentage DECIMAL(5, 2) NULL,
        FormStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (
            FormStatus IN (
                'Pending',
                'Draft',
                'Submitted',
                'Approved',
                'Rejected'
            )
        ),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_Education_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 8. tbl_Form_DegreeDetails (CHILD TABLE - no FormStatus)
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_DegreeDetails'
    ) BEGIN CREATE TABLE tbl_Form_DegreeDetails (
        DegreeID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        DegreeType NVARCHAR(50) NULL,
        Institution NVARCHAR(200) NULL,
        Location NVARCHAR(100) NULL,
        YearOfPassing INT NULL,
        Specialization NVARCHAR(200) NULL,
        AggregatePercentage DECIMAL(5, 2) NULL,
        Sem1 DECIMAL(5, 2) NULL,
        Sem2 DECIMAL(5, 2) NULL,
        Sem3 DECIMAL(5, 2) NULL,
        Sem4 DECIMAL(5, 2) NULL,
        Sem5 DECIMAL(5, 2) NULL,
        Sem6 DECIMAL(5, 2) NULL,
        Sem7 DECIMAL(5, 2) NULL,
        Sem8 DECIMAL(5, 2) NULL,
        ProjectTitle NVARCHAR(200) NULL,
        ProjectDescription NVARCHAR(1000) NULL,
        ProjectDuration NVARCHAR(50) NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_DegreeDetails_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 9. tbl_Form_PostGraduation
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_PostGraduation'
    ) BEGIN CREATE TABLE tbl_Form_PostGraduation (
        PostGraduationID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        PGType NVARCHAR(50) NULL,
        PG_Institution NVARCHAR(200) NULL,
        PG_Location NVARCHAR(100) NULL,
        PG_YearOfPassing INT NULL,
        PG_Specialization NVARCHAR(200) NULL,
        PG_AggregatePercentage DECIMAL(5, 2) NULL,
        FormStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (
            FormStatus IN (
                'Pending',
                'Draft',
                'Submitted',
                'Approved',
                'Rejected'
            )
        ),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_PostGraduation_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 10. tbl_Form_WorkExperience
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_WorkExperience'
    ) BEGIN CREATE TABLE tbl_Form_WorkExperience (
        WorkExperienceID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        EmploymentType NVARCHAR(20) NULL,
        TotalExperience NVARCHAR(50) NULL,
        EmploymentGap BIT NOT NULL DEFAULT 0,
        GapFromDate DATE NULL,
        GapToDate DATE NULL,
        GapJustification NVARCHAR(500) NULL,
        ExpectedSalary NVARCHAR(50) NULL,
        SelectedOtherCompanies BIT NOT NULL DEFAULT 0,
        OtherCompanyDetails NVARCHAR(500) NULL,
        JoiningTimeRequired NVARCHAR(50) NULL,
        FormStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (
            FormStatus IN (
                'Pending',
                'Draft',
                'Submitted',
                'Approved',
                'Rejected'
            )
        ),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_WorkExperience_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 11. tbl_Form_EmploymentHistory (CHILD TABLE - no FormStatus)
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_EmploymentHistory'
    ) BEGIN CREATE TABLE tbl_Form_EmploymentHistory (
        EmployerID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        EmployerName NVARCHAR(200) NULL,
        EmployerAddress NVARCHAR(500) NULL,
        FromDate DATE NULL,
        ToDate DATE NULL,
        CurrentlyWorking BIT NOT NULL DEFAULT 0,
        Designation NVARCHAR(100) NULL,
        NatureOfWork NVARCHAR(200) NULL,
        ReasonForLeaving NVARCHAR(300) NULL,
        Salary NVARCHAR(50) NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_EmploymentHistory_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 12. tbl_Form_HealthInfo
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_HealthInfo'
    ) BEGIN CREATE TABLE tbl_Form_HealthInfo (
        HealthInfoID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        BloodGroup NVARCHAR(10) NULL,
        MajorIllness BIT NOT NULL DEFAULT 0,
        IllnessDetails NVARCHAR(500) NULL,
        MajorSurgeries BIT NOT NULL DEFAULT 0,
        SurgeryDetails NVARCHAR(500) NULL,
        FormStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (
            FormStatus IN (
                'Pending',
                'Draft',
                'Submitted',
                'Approved',
                'Rejected'
            )
        ),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_HealthInfo_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 13. tbl_Form_GeneralInfo
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_GeneralInfo'
    ) BEGIN CREATE TABLE tbl_Form_GeneralInfo (
        GeneralInfoID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        EPFMember BIT NOT NULL DEFAULT 0,
        EPFAccountNo NVARCHAR(50) NULL,
        AppliedManipalGroup BIT NOT NULL DEFAULT 0,
        LanguagesKnown NVARCHAR(300) NULL,
        ComputerSkills NVARCHAR(300) NULL,
        Hobbies NVARCHAR(300) NULL,
        ProfessionalMemberships NVARCHAR(300) NULL,
        FormStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (
            FormStatus IN (
                'Pending',
                'Draft',
                'Submitted',
                'Approved',
                'Rejected'
            )
        ),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_GeneralInfo_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 14. tbl_Form_References (CHILD TABLE - no FormStatus)
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_References'
    ) BEGIN CREATE TABLE tbl_Form_References (
        ReferenceID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        RefName NVARCHAR(100) NULL,
        RefDesignation NVARCHAR(100) NULL,
        RefAddress NVARCHAR(300) NULL,
        RefContact NVARCHAR(50) NULL,
        SortOrder INT NOT NULL DEFAULT 1,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_References_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 15. tbl_Form_ESG
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_ESG'
    ) BEGIN CREATE TABLE tbl_Form_ESG (
        ESGID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        CommuteType NVARCHAR(50) NULL,
        VehicleType NVARCHAR(20) NULL,
        FuelType NVARCHAR(20) NULL,
        VehicleRegNo NVARCHAR(50) NULL,
        DrivingLicenseNo NVARCHAR(50) NULL,
        DistanceTravelKm DECIMAL(8, 2) NULL,
        AvgFuelConsumption DECIMAL(8, 2) NULL,
        MonthlyFuelConsumptionLiters DECIMAL(8, 2) NULL,
        FormStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (
            FormStatus IN (
                'Pending',
                'Draft',
                'Submitted',
                'Approved',
                'Rejected'
            )
        ),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_ESG_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 16. tbl_Form_Documents (CHILD TABLE - no FormStatus)
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_Documents'
    ) BEGIN CREATE TABLE tbl_Form_Documents (
        DocumentID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        DocumentType NVARCHAR(50) NOT NULL,
        DocumentName NVARCHAR(200) NULL,
        FilePath NVARCHAR(500) NULL,
        UploadedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_FormDocuments_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 17. tbl_Form_HRVerification (HR internal only)
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_Form_HRVerification'
    ) BEGIN CREATE TABLE tbl_Form_HRVerification (
        HRVerificationID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        SupervisorName NVARCHAR(100) NULL,
        SupervisorDesignation NVARCHAR(100) NULL,
        SupervisorContact NVARCHAR(50) NULL,
        Ref1VerificationComments NVARCHAR(500) NULL,
        Ref2VerificationComments NVARCHAR(500) NULL,
        CriminalCheckResult NVARCHAR(200) NULL,
        SubstanceAbuseCheck NVARCHAR(200) NULL,
        RecruitmentFitness NVARCHAR(100) NULL,
        HRRemarks NVARCHAR(500) NULL,
        SalaryOfferedCTC NVARCHAR(50) NULL,
        VerifiedBy NVARCHAR(100) NULL,
        VerifiedDate DATETIME NULL,
        CheckedBy NVARCHAR(100) NULL,
        CheckedDate DATETIME NULL,
        FormStatus NVARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (
            FormStatus IN (
                'Pending',
                'Draft',
                'Submitted',
                'Approved',
                'Rejected'
            )
        ),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_HRVerification_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID)
    );
END
GO -- ============================================================
    -- 18. tbl_CandidateApproval (approval audit trail)
    -- ============================================================
    IF NOT EXISTS (
        SELECT *
        FROM sys.tables
        WHERE name = 'tbl_CandidateApproval'
    ) BEGIN CREATE TABLE tbl_CandidateApproval (
        ApprovalID INT IDENTITY(1, 1) PRIMARY KEY,
        CandidateID INT NOT NULL,
        FormTableName NVARCHAR(100) NOT NULL,
        ApprovedByUserID INT NOT NULL,
        ApprovalStage NVARCHAR(30) NOT NULL CHECK (
            ApprovalStage IN ('HR', 'SecurityManager', 'SecurityExecutive')
        ),
        Status NVARCHAR(20) NOT NULL CHECK (Status IN ('Pending', 'Approved', 'Rejected')),
        Comments NVARCHAR(500) NULL,
        ActionDate DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_CandidateApproval_Candidate FOREIGN KEY (CandidateID) REFERENCES tbl_CandidateMaster(CandidateID),
        CONSTRAINT FK_CandidateApproval_User FOREIGN KEY (ApprovedByUserID) REFERENCES tbl_UserMaster(UserID)
    );
END
GO -- ============================================================
    -- INDEXES ON CandidateID COLUMNS
    -- ============================================================
    CREATE NONCLUSTERED INDEX IX_PersonalInfo_CandidateID ON tbl_Form_PersonalInfo(CandidateID);
CREATE NONCLUSTERED INDEX IX_FamilyDetails_CandidateID ON tbl_Form_FamilyDetails(CandidateID);
CREATE NONCLUSTERED INDEX IX_ChildrenDetails_CandidateID ON tbl_Form_ChildrenDetails(CandidateID);
CREATE NONCLUSTERED INDEX IX_ContactInfo_CandidateID ON tbl_Form_ContactInfo(CandidateID);
CREATE NONCLUSTERED INDEX IX_PassportDetails_CandidateID ON tbl_Form_PassportDetails(CandidateID);
CREATE NONCLUSTERED INDEX IX_IndividualTraits_CandidateID ON tbl_Form_IndividualTraits(CandidateID);
CREATE NONCLUSTERED INDEX IX_Education_CandidateID ON tbl_Form_Education(CandidateID);
CREATE NONCLUSTERED INDEX IX_DegreeDetails_CandidateID ON tbl_Form_DegreeDetails(CandidateID);
CREATE NONCLUSTERED INDEX IX_PostGraduation_CandidateID ON tbl_Form_PostGraduation(CandidateID);
CREATE NONCLUSTERED INDEX IX_WorkExperience_CandidateID ON tbl_Form_WorkExperience(CandidateID);
CREATE NONCLUSTERED INDEX IX_EmploymentHistory_CandidateID ON tbl_Form_EmploymentHistory(CandidateID);
CREATE NONCLUSTERED INDEX IX_HealthInfo_CandidateID ON tbl_Form_HealthInfo(CandidateID);
CREATE NONCLUSTERED INDEX IX_GeneralInfo_CandidateID ON tbl_Form_GeneralInfo(CandidateID);
CREATE NONCLUSTERED INDEX IX_References_CandidateID ON tbl_Form_References(CandidateID);
CREATE NONCLUSTERED INDEX IX_ESG_CandidateID ON tbl_Form_ESG(CandidateID);
CREATE NONCLUSTERED INDEX IX_FormDocuments_CandidateID ON tbl_Form_Documents(CandidateID);
CREATE NONCLUSTERED INDEX IX_HRVerification_CandidateID ON tbl_Form_HRVerification(CandidateID);
CREATE NONCLUSTERED INDEX IX_CandidateApproval_CandidateID ON tbl_CandidateApproval(CandidateID);
GO -- ============================================================
    -- UPDATE TRIGGERS FOR MAIN FORM TABLES
    -- ============================================================
    -- Trigger for tbl_Form_PersonalInfo
    CREATE TRIGGER trg_PersonalInfo_UpdatedAt ON tbl_Form_PersonalInfo
AFTER
UPDATE AS BEGIN
SET NOCOUNT ON;
UPDATE tbl_Form_PersonalInfo
SET UpdatedAt = GETDATE()
FROM tbl_Form_PersonalInfo t
    INNER JOIN inserted i ON t.PersonalInfoID = i.PersonalInfoID;
END
GO -- Trigger for tbl_Form_FamilyDetails
    CREATE TRIGGER trg_FamilyDetails_UpdatedAt ON tbl_Form_FamilyDetails
AFTER
UPDATE AS BEGIN
SET NOCOUNT ON;
UPDATE tbl_Form_FamilyDetails
SET UpdatedAt = GETDATE()
FROM tbl_Form_FamilyDetails t
    INNER JOIN inserted i ON t.FamilyDetailsID = i.FamilyDetailsID;
END
GO -- Trigger for tbl_Form_ContactInfo
    CREATE TRIGGER trg_ContactInfo_UpdatedAt ON tbl_Form_ContactInfo
AFTER
UPDATE AS BEGIN
SET NOCOUNT ON;
UPDATE tbl_Form_ContactInfo
SET UpdatedAt = GETDATE()
FROM tbl_Form_ContactInfo t
    INNER JOIN inserted i ON t.ContactInfoID = i.ContactInfoID;
END
GO -- Trigger for tbl_Form_PassportDetails
    CREATE TRIGGER trg_PassportDetails_UpdatedAt ON tbl_Form_PassportDetails
AFTER
UPDATE AS BEGIN
SET NOCOUNT ON;
UPDATE tbl_Form_PassportDetails
SET UpdatedAt = GETDATE()
FROM tbl_Form_PassportDetails t
    INNER JOIN inserted i ON t.PassportDetailsID = i.PassportDetailsID;
END
GO -- Trigger for tbl_Form_IndividualTraits
    CREATE TRIGGER trg_IndividualTraits_UpdatedAt ON tbl_Form_IndividualTraits
AFTER
UPDATE AS BEGIN
SET NOCOUNT ON;
UPDATE tbl_Form_IndividualTraits
SET UpdatedAt = GETDATE()
FROM tbl_Form_IndividualTraits t
    INNER JOIN inserted i ON t.IndividualTraitsID = i.IndividualTraitsID;
END
GO -- Trigger for tbl_Form_Education
    CREATE TRIGGER trg_Education_UpdatedAt ON tbl_Form_Education
AFTER
UPDATE AS BEGIN
SET NOCOUNT ON;
UPDATE tbl_Form_Education
SET UpdatedAt = GETDATE()
FROM tbl_Form_Education t
    INNER JOIN inserted i ON t.EducationID = i.EducationID;
END
GO -- Trigger for tbl_Form_DegreeDetails
    CREATE TRIGGER trg_DegreeDetails_UpdatedAt ON tbl_Form_DegreeDetails
AFTER
UPDATE AS BEGIN
SET NOCOUNT ON;
UPDATE tbl_Form_DegreeDetails
SET UpdatedAt = GETDATE()
FROM tbl_Form_DegreeDetails t
    INNER JOIN inserted i ON t.DegreeID = i.DegreeID;
END
GO -- Trigger for tbl_Form_PostGraduation
    CREATE TRIGGER trg_PostGraduation_UpdatedAt ON tbl_Form_PostGraduation
AFTER
UPDATE AS BEGIN
SET NOCOUNT ON;
UPDATE tbl_Form_PostGraduation
SET UpdatedAt = GETDATE()
FROM tbl_Form_PostGraduation t
    INNER JOIN inserted i ON t.PostGraduationID = i.PostGraduationID;
END
GO -- Trigger for tbl_Form_WorkExperience
    CREATE TRIGGER trg_WorkExperience_UpdatedAt ON tbl_Form_WorkExperience
AFTER
UPDATE AS BEGIN
SET NOCOUNT ON;
UPDATE tbl_Form_WorkExperience
SET UpdatedAt = GETDATE()
FROM tbl_Form_WorkExperience t
    INNER JOIN inserted i ON t.WorkExperienceID = i.WorkExperienceID;
END
GO -- Trigger for tbl_Form_EmploymentHistory
    CREATE TRIGGER trg_EmploymentHistory_UpdatedAt ON tbl_Form_EmploymentHistory
AFTER
UPDATE AS BEGIN
SET NOCOUNT ON;
UPDATE tbl_Form_EmploymentHistory
SET UpdatedAt = GETDATE()
FROM tbl_Form_EmploymentHistory t
    INNER JOIN inserted i ON t.EmployerID = i.EmployerID;
END
GO -- Trigger for tbl_Form_HealthInfo
    CREATE TRIGGER trg_HealthInfo_UpdatedAt ON tbl_Form_HealthInfo
AFTER
UPDATE AS BEGIN
SET NOCOUNT ON;
UPDATE tbl_Form_HealthInfo
SET UpdatedAt = GETDATE()
FROM tbl_Form_HealthInfo t
    INNER JOIN inserted i ON t.HealthInfoID = i.HealthInfoID;
END
GO -- Trigger for tbl_Form_GeneralInfo
    CREATE TRIGGER trg_GeneralInfo_UpdatedAt ON tbl_Form_GeneralInfo
AFTER
UPDATE AS BEGIN
SET NOCOUNT ON;
UPDATE tbl_Form_GeneralInfo
SET UpdatedAt = GETDATE()
FROM tbl_Form_GeneralInfo t
    INNER JOIN inserted i ON t.GeneralInfoID = i.GeneralInfoID;
END
GO -- Trigger for tbl_Form_ESG
    CREATE TRIGGER trg_ESG_UpdatedAt ON tbl_Form_ESG
AFTER
UPDATE AS BEGIN
SET NOCOUNT ON;
UPDATE tbl_Form_ESG
SET UpdatedAt = GETDATE()
FROM tbl_Form_ESG t
    INNER JOIN inserted i ON t.ESGID = i.ESGID;
END
GO -- Trigger for tbl_Form_HRVerification
    CREATE TRIGGER trg_HRVerification_UpdatedAt ON tbl_Form_HRVerification
AFTER
UPDATE AS BEGIN
SET NOCOUNT ON;
UPDATE tbl_Form_HRVerification
SET UpdatedAt = GETDATE()
FROM tbl_Form_HRVerification t
    INNER JOIN inserted i ON t.HRVerificationID = i.HRVerificationID;
END
GO -- ============================================================
    -- SEED DATA FOR tbl_FormMaster (Additional Form Definitions)
    -- ============================================================
    -- Add new form codes to tbl_FormMaster if they don't already exist
    IF NOT EXISTS (
        SELECT *
        FROM tbl_FormMaster
        WHERE FormCode = 'PERSONAL_INFO'
    )
INSERT INTO tbl_FormMaster (FormName, FormCode, SortOrder, Status, CreatedBy)
VALUES ('Personal Info', 'PERSONAL_INFO', 6, 1, 1);
IF NOT EXISTS (
    SELECT *
    FROM tbl_FormMaster
    WHERE FormCode = 'CONTACT_INFO'
)
INSERT INTO tbl_FormMaster (FormName, FormCode, SortOrder, Status, CreatedBy)
VALUES ('Contact Info', 'CONTACT_INFO', 7, 1, 1);
IF NOT EXISTS (
    SELECT *
    FROM tbl_FormMaster
    WHERE FormCode = 'FAMILY_DETAILS'
)
INSERT INTO tbl_FormMaster (FormName, FormCode, SortOrder, Status, CreatedBy)
VALUES ('Family Details', 'FAMILY_DETAILS', 8, 1, 1);
IF NOT EXISTS (
    SELECT *
    FROM tbl_FormMaster
    WHERE FormCode = 'EDUCATION_DETAILS'
)
INSERT INTO tbl_FormMaster (FormName, FormCode, SortOrder, Status, CreatedBy)
VALUES (
        'Education Details',
        'EDUCATION_DETAILS',
        9,
        1,
        1
    );
IF NOT EXISTS (
    SELECT *
    FROM tbl_FormMaster
    WHERE FormCode = 'WORK_EXPERIENCE'
)
INSERT INTO tbl_FormMaster (FormName, FormCode, SortOrder, Status, CreatedBy)
VALUES ('Work Experience', 'WORK_EXPERIENCE', 10, 1, 1);
IF NOT EXISTS (
    SELECT *
    FROM tbl_FormMaster
    WHERE FormCode = 'PASSPORT_DETAILS'
)
INSERT INTO tbl_FormMaster (FormName, FormCode, SortOrder, Status, CreatedBy)
VALUES ('Passport Details', 'PASSPORT_DETAILS', 11, 1, 1);
IF NOT EXISTS (
    SELECT *
    FROM tbl_FormMaster
    WHERE FormCode = 'HEALTH_INFO'
)
INSERT INTO tbl_FormMaster (FormName, FormCode, SortOrder, Status, CreatedBy)
VALUES ('Health Info', 'HEALTH_INFO', 12, 1, 1);
IF NOT EXISTS (
    SELECT *
    FROM tbl_FormMaster
    WHERE FormCode = 'INDIVIDUAL_TRAITS'
)
INSERT INTO tbl_FormMaster (FormName, FormCode, SortOrder, Status, CreatedBy)
VALUES (
        'Individual Traits',
        'INDIVIDUAL_TRAITS',
        13,
        1,
        1
    );
IF NOT EXISTS (
    SELECT *
    FROM tbl_FormMaster
    WHERE FormCode = 'GENERAL_INFO'
)
INSERT INTO tbl_FormMaster (FormName, FormCode, SortOrder, Status, CreatedBy)
VALUES ('General Info', 'GENERAL_INFO', 14, 1, 1);
IF NOT EXISTS (
    SELECT *
    FROM tbl_FormMaster
    WHERE FormCode = 'ESG'
)
INSERT INTO tbl_FormMaster (FormName, FormCode, SortOrder, Status, CreatedBy)
VALUES ('ESG', 'ESG', 15, 1, 1);
IF NOT EXISTS (
    SELECT *
    FROM tbl_FormMaster
    WHERE FormCode = 'DOCUMENTS'
)
INSERT INTO tbl_FormMaster (FormName, FormCode, SortOrder, Status, CreatedBy)
VALUES ('Documents', 'DOCUMENTS', 16, 1, 1);
GO -- ============================================================
    -- END OF SCHEMA
    -- ============================================================