# PowerShell script to run migrations
# Usage: .\run-migrations.ps1

Write-Host "=== Mini QMS Database Migration Script ===" -ForegroundColor Cyan
Write-Host ""

# Check if DATABASE_URL is set
if ($env:DATABASE_URL) {
    Write-Host "✅ DATABASE_URL found in environment" -ForegroundColor Green
    $dbUrl = $env:DATABASE_URL
} elseif ($env:POSTGRES_URL) {
    Write-Host "✅ POSTGRES_URL found, using it as DATABASE_URL" -ForegroundColor Green
    $dbUrl = $env:POSTGRES_URL
    $env:DATABASE_URL = $env:POSTGRES_URL
} else {
    Write-Host "❌ No DATABASE_URL or POSTGRES_URL found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please either:" -ForegroundColor Yellow
    Write-Host "1. Set DATABASE_URL environment variable, OR" -ForegroundColor Yellow
    Write-Host "2. Pull from Vercel: vercel env pull .env.local" -ForegroundColor Yellow
    Write-Host "3. Or provide URL when running:" -ForegroundColor Yellow
    Write-Host "   `$env:DATABASE_URL='your-url'; .\run-migrations.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 1: Pushing Prisma schema to database..." -ForegroundColor Cyan
npx prisma db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Schema push failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Seeding ISO 9001 clauses..." -ForegroundColor Cyan
npm run db:seed

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Seed failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Migrations completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create your first user (via Prisma Studio or SQL)" -ForegroundColor White
Write-Host "2. Deploy to Vercel or run locally" -ForegroundColor White
