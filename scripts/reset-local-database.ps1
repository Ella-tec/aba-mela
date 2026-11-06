$ErrorActionPreference = "Stop"
Write-Host "This deletes the local Mela PostgreSQL volume and all local demo data." -ForegroundColor Yellow
$confirmation = Read-Host "Type DELETE to continue"
if ($confirmation -eq "DELETE") { docker compose down -v }
else { Write-Host "Cancelled." }
