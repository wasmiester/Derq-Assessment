$backendFailed = $false
$frontendFailed = $false


Write-Host "  BACKEND TESTS"
npm run test:backend
if ($LASTEXITCODE -ne 0) { $backendFailed = $true }


Write-Host "  FRONTEND TESTS"
npm run test:frontend
if ($LASTEXITCODE -ne 0) { $frontendFailed = $true }


Write-Host "  RESULTS" 

if ($backendFailed) {
    Write-Host "  Backend:  FAILED" 
} else {
    Write-Host "  Backend:  PASSED" 
}

if ($frontendFailed) {
    Write-Host "  Frontend: FAILED" 
} else {
    Write-Host "  Frontend: PASSED" 
}

Write-Host ""

if ($backendFailed -or $frontendFailed) {
    Write-Host "  Some tests failed." 
    exit 1
} else {
    Write-Host "  All tests passed." 
    exit 0
}
