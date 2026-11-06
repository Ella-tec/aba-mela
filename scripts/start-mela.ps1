$ErrorActionPreference = "Stop"
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Host "Docker Desktop is required. Install/start Docker Desktop, then run this script again." -ForegroundColor Red
  exit 1
}
docker compose up --build
