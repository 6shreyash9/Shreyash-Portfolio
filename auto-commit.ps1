# Auto-commit and push script for portfolio updates
# This script automatically commits and pushes changes to GitHub

param(
    [string]$message = "Auto-update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

# Set working directory
Set-Location -Path "C:\Users\LENOVO\Desktop\portfolio shr"

# Check if there are changes to commit
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Changes detected, committing and pushing to GitHub..."
    
    # Add all changes
    git add .
    
    # Commit with timestamp message
    git commit -m $message
    
    # Push to GitHub
    git push origin main
    
    Write-Host "Successfully pushed changes to GitHub!" -ForegroundColor Green
} else {
    Write-Host "No changes to commit." -ForegroundColor Yellow
}
