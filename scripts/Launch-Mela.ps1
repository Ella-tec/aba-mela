# Double-click launcher for Mela. Uses an already-running Mela site or starts Docker services.
$ErrorActionPreference = "Stop"
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$WebUrl = "http://127.0.0.1:5179"
$HealthUrl = "http://localhost:5018/health"
$AlreadyRunning = $false

Write-Host ""
Write-Host "Opening Mela..." -ForegroundColor Green
Write-Host "Project: $ProjectRoot"

# If the user already started Mela with npm run dev, reuse it instead of competing for port 5179.
try {
    $ExistingSite = Invoke-WebRequest -Uri $WebUrl -TimeoutSec 3 -UseBasicParsing
    if ($ExistingSite.Content -match '<title>Mela') {
        $AlreadyRunning = $true
        Write-Host "Mela is already running. Opening the existing app." -ForegroundColor Cyan
    } else {
        throw "Port 5179 is occupied by another application. Stop that application, then try again."
    }
} catch {
    if ($_.Exception.Message -like "*occupied by another application*") { throw }
}

if (-not $AlreadyRunning) {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        throw "Docker was not found. Install Docker Desktop, start it, or start Mela from VS Code with npm run dev."
    }

    Push-Location $ProjectRoot
    try {
        docker info *> $null
        if ($LASTEXITCODE -ne 0) {
            throw "Docker Desktop is not running. Open Docker Desktop, wait until Engine is running, then double-click Mela again."
        }

        docker compose up -d --build
        if ($LASTEXITCODE -ne 0) {
            throw "Mela could not start. Open PowerShell in the Mela folder and run: docker compose logs"
        }
    }
    finally {
        Pop-Location
    }

    Write-Host "Waiting for Mela API..." -ForegroundColor Yellow
    $Ready = $false
    for ($Attempt = 0; $Attempt -lt 60; $Attempt++) {
        try {
            $Response = Invoke-WebRequest -Uri $HealthUrl -TimeoutSec 2 -UseBasicParsing
            if ($Response.StatusCode -ge 200 -and $Response.StatusCode -lt 300) {
                $Ready = $true
                break
            }
        } catch {
            Start-Sleep -Seconds 2
        }
    }
    if (-not $Ready) {
        Write-Warning "The API did not report healthy within two minutes. The website will still open; check Docker Desktop if data features do not work."
    }
}

Start-Process $WebUrl
Write-Host "Mela is opening at $WebUrl" -ForegroundColor Green
