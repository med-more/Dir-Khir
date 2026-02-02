# Script pour arrêter Drizzle Studio si le port 4983 est occupé

Write-Host "Recherche du processus utilisant le port 4983..." -ForegroundColor Yellow

$port = netstat -ano | findstr :4983

if ($port) {
    $pid = ($port -split '\s+')[-1]
    Write-Host "Processus trouvé avec PID: $pid" -ForegroundColor Yellow
    Write-Host "Arrêt du processus..." -ForegroundColor Yellow
    taskkill /PID $pid /F
    Write-Host "Processus arrêté avec succès!" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "Aucun processus n'utilise le port 4983" -ForegroundColor Green
}

Write-Host "Démarrage de Drizzle Studio..." -ForegroundColor Yellow
npm run db:studio
