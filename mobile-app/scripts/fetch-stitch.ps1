# PowerShell: fetch Stitch HTML from get_screen htmlCode.downloadUrl (curl -L equivalent).
# Usage:
#   .\scripts\fetch-stitch.ps1 -Url "<htmlCode.downloadUrl>" -Output "design\stitch\screens\home.html"
param(
    [Parameter(Mandatory = $true)][string]$Url,
    [Parameter(Mandatory = $true)][string]$Output
)
$dir = Split-Path -Parent $Output
if ($dir) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
Write-Host "Fetching Stitch HTML..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $Url -OutFile $Output -UseBasicParsing -MaximumRedirection 5
Write-Host "Saved to: $Output" -ForegroundColor Green
