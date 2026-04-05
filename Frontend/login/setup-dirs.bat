@echo off
echo Creating directory structure...

mkdir "src\components" 2>nul
mkdir "src\pages\candidate" 2>nul
mkdir "src\pages\candidate\forms" 2>nul
mkdir "src\pages\hr" 2>nul

echo Directories created!
echo.
echo Now creating React component files...

node -e "const fs=require('fs');const dirs=['src/components','src/pages/candidate','src/pages/candidate/forms','src/pages/hr'];dirs.forEach(d=>{fs.mkdirSync(d,{recursive:true})});console.log('Done!');"

echo.
echo Setup complete! Now run: npm install
pause
