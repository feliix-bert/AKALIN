@echo off
setlocal
echo ========================================================
echo   AKALIN - Menjalankan TripoSR Inference Server
echo ========================================================

set "PATH=%USERPROFILE%\.local\bin;%PATH%"

where uv >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] uv tidak ditemukan di PATH.
    echo Menjalankan instalasi uv...
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    set "PATH=%USERPROFILE%\.local\bin;%PATH%"
)

cd /d "%~dp0"
echo Menjalankan server pada http://localhost:8000 ...
uv run --python 3.10 --extra-index-url https://download.pytorch.org/whl/cu121 --with "fastapi" --with "uvicorn[standard]" --with "python-multipart" --with "Pillow" --with "trimesh" --with "rembg" --with "torch" --with "torchvision" --with "git+https://github.com/VAST-AI-Research/TripoSR.git" uvicorn main:app --host 0.0.0.0 --port 8000
pause

