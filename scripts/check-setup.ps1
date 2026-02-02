# Script de vérification de la configuration

Write-Host "=== Vérification de la Configuration Dir-Khir ===" -ForegroundColor Cyan
Write-Host ""

# 1. Vérifier .env.local
Write-Host "1. Vérification de .env.local..." -ForegroundColor Yellow
if (Test-Path .env.local) {
    $envContent = Get-Content .env.local -Raw
    if ($envContent -match "DATABASE_URL") {
        Write-Host "   ✓ DATABASE_URL trouvée" -ForegroundColor Green
        $dbUrl = ($envContent -split "`n" | Where-Object { $_ -match "DATABASE_URL" }) -replace "DATABASE_URL=", "" -replace '"', "" -replace "'", ""
        if ($dbUrl -match "postgresql://") {
            Write-Host "   ✓ Format DATABASE_URL valide" -ForegroundColor Green
        } else {
            Write-Host "   ✗ Format DATABASE_URL invalide" -ForegroundColor Red
        }
    } else {
        Write-Host "   ✗ DATABASE_URL manquante dans .env.local" -ForegroundColor Red
    }
} else {
    Write-Host "   ✗ Fichier .env.local introuvable" -ForegroundColor Red
}

Write-Host ""

# 2. Vérifier les fichiers de configuration
Write-Host "2. Vérification des fichiers de configuration..." -ForegroundColor Yellow

$files = @(
    "lib/auth/config.ts",
    "lib/db/schema.ts",
    "lib/db/index.ts",
    "drizzle.config.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "   ✓ $file existe" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $file manquant" -ForegroundColor Red
    }
}

Write-Host ""

# 3. Vérifier les dépendances
Write-Host "3. Vérification des dépendances..." -ForegroundColor Yellow

$deps = @("better-auth", "drizzle-orm", "postgres", "zod", "react-hook-form")
foreach ($dep in $deps) {
    $result = npm list $dep 2>&1
    if ($result -match $dep) {
        Write-Host "   ✓ $dep installé" -ForegroundColor Green
    } else {
        Write-Host "   ✗ $dep manquant" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Vérification terminée ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Prochaines étapes :" -ForegroundColor Yellow
Write-Host "1. Vérifiez que DATABASE_URL est correcte dans .env.local"
Write-Host "2. Exécutez: npm run db:push"
Write-Host "3. Vérifiez les tables dans Drizzle Studio: npm run db:studio"
Write-Host "4. Redémarrez le serveur: npm run dev"
