"""
Batch update candidate form files with back navigation and exit banner
"""
import re

# CSS snippet to add exit banner styles
EXIT_BANNER_CSS = """
/* Exit Confirmation Banner */
.exit-banner {
  background-color: #fff3cd;
  border-bottom: 1px solid #ffc107;
  color: #333;
  padding: 12px 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
}

.save-exit-button {
  padding: 8px 16px;
  background-color: #2196b6;
  border: none;
  color: white;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: 'Inter', sans-serif;
}

.save-exit-button:hover {
  background-color: #1976a0;
}

.leave-button {
  padding: 8px 16px;
  background: none;
  border: none;
  color: #666;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  font-family: 'Inter', sans-serif;
}

.leave-button:hover {
  color: #333;
}
"""

# Files to update (excluding already updated ones)
FORM_FILES = [
    'WorkExperienceForm',
    'PassportDetailsForm',
    'HealthInfoForm',
    'IndividualTraitsForm',
    'GeneralInfoForm',
    'ESGForm',
    'DocumentsForm'
]

BASE_PATH = r'C:\Users\justi\OneDrive\Desktop\MTL_Employee_Onboarding_project\HR-Onboarding-System\Frontend\login\src\pages\candidate\forms'


def update_jsx_file(filename):
    filepath = f'{BASE_PATH}\\{filename}.jsx'

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if already updated
        if 'showExitBanner' in content:
            print(f"✓ {filename}.jsx already updated")
            return

        # 1. Add showExitBanner state
        content = re.sub(
            r'(\[toast, setToast\] = useState\(\{[^}]+\}\))',
            r'\1\n  const [showExitBanner, setShowExitBanner] = useState(false)',
            content,
            count=1
        )

        # 2. Update handleInputChange or handleChange to mark as Draft
        # Look for either handleInputChange or handleChange
        if 'handleInputChange' in content:
            content = re.sub(
                r'(const handleInputChange = \(e\) => \{[^}]*\{[^}]*name,[^}]*value[^}]*\}[^}]*= e\.target[^}]*setFormData\([^)]+\))',
                r'''\1
    
    // Mark as draft if user is editing and form was pending
    if (formStatus === 'Pending') {
      setFormStatus('Draft')
    }''',
                content,
                count=1
            )
        elif 'handleChange' in content:
            content = re.sub(
                r'(const handleChange = \(e\) => \{[^}]*\{[^}]*name,[^}]*value[^}]*\}[^}]*= e\.target[^}]*setFormData\([^)]+\))',
                r'''\1
    
    // Mark as draft if user is editing and form was pending
    if (formStatus === 'Pending') {
      setFormStatus('Draft')
    }''',
                content,
                count=1
            )

        # 3. Add navigation handlers before handleSubmit or isReadOnly
        nav_handlers = '''
  const handleBackClick = () => {
    if (formStatus === 'Draft') {
      setShowExitBanner(true)
    } else {
      navigate('/candidate/dashboard')
    }
  }

  const handleSaveAndExit = () => {
    handleSaveAsDraft()
    setTimeout(() => {
      navigate('/candidate/dashboard')
    }, 500)
  }

  const handleLeaveWithoutSaving = () => {
    navigate('/candidate/dashboard')
  }

  '''

        # Insert before isReadOnly or before return statement
        if 'const isReadOnly' in content:
            content = re.sub(
                r'(\n\s*const isReadOnly)',
                nav_handlers + r'\1',
                content,
                count=1
            )
        else:
            content = re.sub(
                r'(\n\s*return \()',
                nav_handlers + r'\1',
                content,
                count=1
            )

        # 4. Replace navigate(-1) with handleBackClick
        content = re.sub(
            r'onClick=\{\(\) => navigate\(-1\)\}',
            r'onClick={handleBackClick}',
            content
        )

        # 5. Add exit banner JSX after header and before lock banner or content
        exit_banner_jsx = '''
      {/* Exit Confirmation Banner */}
      {showExitBanner && (
        <div className="exit-banner">
          <span>You have unsaved changes. </span>
          <button className="save-exit-button" onClick={handleSaveAndExit}>
            Save as Draft
          </button>
          <button className="leave-button" onClick={handleLeaveWithoutSaving}>
            Leave without saving
          </button>
        </div>
      )}

'''

        # Insert before lock banner if it exists
        if '{/* Approved Lock Banner' in content:
            content = re.sub(
                r'(\n\s*\{/\* Approved Lock Banner)',
                exit_banner_jsx + r'\1',
                content,
                count=1
            )
        elif '{/* Main Content' in content:
            content = re.sub(
                r'(\n\s*\{/\* Main Content)',
                exit_banner_jsx + r'\1',
                content,
                count=1
            )

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"✓ Updated {filename}.jsx")

    except Exception as e:
        print(f"✗ Error updating {filename}.jsx: {e}")


def update_css_file(filename):
    filepath = f'{BASE_PATH}\\{filename}.css'

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check if already updated
        if '.exit-banner' in content:
            print(f"✓ {filename}.css already has exit banner styles")
            return

        # Find .lock-banner and add exit banner styles after it
        if '.lock-banner' in content:
            content = re.sub(
                r'(\.lock-banner \{[^}]+\})',
                r'\1\n' + EXIT_BANNER_CSS,
                content,
                count=1
            )

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)

            print(f"✓ Updated {filename}.css")
        else:
            print(f"⚠ {filename}.css has no .lock-banner class")

    except Exception as e:
        print(f"✗ Error updating {filename}.css: {e}")


def main():
    print("Starting batch update of form files...\n")

    for form in FORM_FILES:
        print(f"\nProcessing {form}...")
        update_jsx_file(form)
        update_css_file(form)

    print("\n✅ Batch update complete!")


if __name__ == '__main__':
    main()
