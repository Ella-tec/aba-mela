# Creates the Mela desktop shortcut and a matching Windows icon.
$ErrorActionPreference = "Stop"
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$Launcher = Join-Path $PSScriptRoot "Launch-Mela.ps1"
$PublicFolder = Join-Path $ProjectRoot "public"
$IconPath = Join-Path $PublicFolder "mela-app.ico"
$Desktop = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $Desktop "Mela.lnk"

if (-not (Test-Path $Launcher)) { throw "Mela launcher not found: $Launcher" }
if (-not (Test-Path $PublicFolder)) { New-Item -ItemType Directory -Path $PublicFolder -Force | Out-Null }

# Draw the Mela mark into a real .ico file so Windows can display it on the shortcut.
Add-Type -AssemblyName System.Drawing
$bitmap = New-Object System.Drawing.Bitmap 256, 256
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.Clear([System.Drawing.Color]::FromArgb(23, 59, 53))
$gold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(244, 198, 106))
$white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$points = @(
    (New-Object System.Drawing.Point 42,178),
    (New-Object System.Drawing.Point 42,75),
    (New-Object System.Drawing.Point 72,75),
    (New-Object System.Drawing.Point 128,137),
    (New-Object System.Drawing.Point 184,75),
    (New-Object System.Drawing.Point 214,75),
    (New-Object System.Drawing.Point 214,178),
    (New-Object System.Drawing.Point 178,178),
    (New-Object System.Drawing.Point 178,122),
    (New-Object System.Drawing.Point 128,171),
    (New-Object System.Drawing.Point 78,122),
    (New-Object System.Drawing.Point 78,178)
)
$graphics.FillPolygon($gold, $points)
$graphics.FillEllipse($white, 190, 187, 28, 28)
$hIcon = $bitmap.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$stream = [System.IO.File]::Create($IconPath)
try { $icon.Save($stream) } finally { $stream.Dispose(); $icon.Dispose(); $graphics.Dispose(); $gold.Dispose(); $white.Dispose(); $bitmap.Dispose() }


$PowerShell = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
$Shell = New-Object -ComObject WScript.Shell
$Link = $Shell.CreateShortcut($ShortcutPath)
$Link.TargetPath = $PowerShell
$Link.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$Launcher`""
$Link.WorkingDirectory = $ProjectRoot
$Link.Description = "Start Mela and open the Kansas City home services platform"
$Link.IconLocation = "$IconPath,0"
$Link.Save()

Write-Host ""
Write-Host "Mela desktop shortcut created successfully." -ForegroundColor Green
Write-Host "Desktop: $ShortcutPath"
Write-Host "Icon: $IconPath"
Write-Host "Double-click the Mela icon on your desktop to start the app."
