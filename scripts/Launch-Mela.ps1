# Double-click launcher for the local Mela demo. Requires Docker Desktop.
$ErrorActionPreference = "Stop"
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$WebUrl = "http://127.0.0.1:5179"
$HealthUrl = "http://localhost:5018/health"

Write-Host ""
Write-Host "Starting Mela..." -ForegroundColor Green
Write-Host "Project: $ProjectRoot"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker was not found. Install Docker Desktop, start it, and try again."
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

Start-Process $WebUrl
Write-Host "Mela is opening at $WebUrl" -ForegroundColor Green
