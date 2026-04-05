@echo off
REM Create hooks directory
if not exist "src\hooks" mkdir "src\hooks"
echo Created hooks directory

REM Create usePageTitle hook file
(
echo import { useEffect } from 'react'
echo.
echo function usePageTitle^(title^) {
echo   useEffect^(^(^) =^> {
echo     document.title = title
echo   }, [title]^)
echo }
echo.
echo export default usePageTitle
) > "src\hooks\usePageTitle.js"
echo Created usePageTitle.js hook

echo Done! All files created.
pause
