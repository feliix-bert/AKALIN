# AKALIN - TripoSR Server Starter for PowerShell
$env:Path = "$HOME\.local\bin;$env:Path"

if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    Write-Host "[INFO] Menginstal uv package manager..." -ForegroundColor Cyan
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    $env:Path = "$HOME\.local\bin;$env:Path"
}

Set-Location $PSScriptRoot
Write-Host "========================================================" -ForegroundColor Green
Write-Host "  AKALIN - Menjalankan TripoSR Inference Server" -ForegroundColor Green
Write-Host "  Endpoint: http://localhost:8000" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green

uv run --python 3.10 `
  --extra-index-url https://download.pytorch.org/whl/cu121 `
  --with "fastapi" `
  --with "uvicorn[standard]" `
  --with "python-multipart" `
  --with "Pillow" `
  --with "trimesh" `
  --with "rembg" `
  --with "torch" `
  --with "torchvision" `
  --with "git+https://github.com/VAST-AI-Research/TripoSR.git" `
  uvicorn main:app --host 0.0.0.0 --port 8000

