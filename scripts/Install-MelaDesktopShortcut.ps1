# Creates a Mela shortcut on the current Windows user's desktop.
$ErrorActionPreference = "Stop"
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Launcher = Join-Path $PSScriptRoot "Launch-Mela.ps1"
$Desktop = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $Desktop "Mela.lnk"

if (-not (Test-Path $Launcher)) {
    throw "Mela launcher not found: $Launcher"
}

$PowerShell = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
$Shell = New-Object -ComObject WScript.Shell
$Link = $Shell.CreateShortcut($ShortcutPath)
$Link.TargetPath = $PowerShell
$Link.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$Launcher`""
$Link.WorkingDirectory = $ProjectRoot
$Link.Description = "Start Mela services and open the Mela application"
$Icon = Join-Path $ProjectRoot "public\favicon.ico"
if (Test-Path $Icon) { $Link.IconLocation = $Icon }
$Link.Save()

Write-Host ""
Write-Host "Mela desktop shortcut created:" -ForegroundColor Green
Write-Host $ShortcutPath
Write-Host "Double-click Mela on your desktop to start the app."
