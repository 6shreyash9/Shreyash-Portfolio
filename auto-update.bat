@echo off
cd /d "C:\Users\LENOVO\Desktop\portfolio shr"

echo Checking for changes...
git status --porcelain >nul 2>&1
if %errorlevel% neq 0 (
    echo No changes to commit.
    pause
    exit /b
)

echo Changes detected! Committing and pushing to GitHub...
git add .
git commit -m "Auto-update: %date% %time%"
git push origin main

echo Successfully pushed to GitHub!
pause
