# Mela local launcher - starts the frontend, API, and PostgreSQL with Docker Compose.
$ErrorActionPreference = "Stop"
$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$WebUrl = "http://localhost:5178"
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
        throw "Docker Desktop is not running. Open Docker Desktop, wait until it says Engine running, then launch Mela again."
    }

    docker compose up -d --build
    if ($LASTEXITCODE -ne 0) {
        throw "Mela services could not start. Open PowerShell in the Mela folder and run: docker compose logs"
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
    Write-Warning "The API did not report healthy within two minutes. Mela may still be starting. Check Docker Desktop logs."
}

Start-Process $WebUrl
Write-Host "Mela is opening at $WebUrl" -ForegroundColor Green
