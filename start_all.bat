@echo off
set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

:: Check if environment setup has been run
if not exist "backend\venv\" (
    echo [!] Virtual environment not found. Running setup_and_install.bat first...
    call "%SCRIPT_DIR%setup_and_install.bat"
    exit /b
)
if not exist "frontend\node_modules\" (
    echo [!] Frontend dependencies not found. Running setup_and_install.bat first...
    call "%SCRIPT_DIR%setup_and_install.bat"
    exit /b
)

echo =======================================================================
echo          SecureChain: Healthcare Decentralized Access Control
echo =======================================================================
echo Starting all services:
echo   1. Hardhat Ethereum Node  (http://127.0.0.1:8545)
echo   2. Django REST API Backend (http://127.0.0.1:8000)
echo   3. Next.js Web Frontend    (http://localhost:3000)
echo =======================================================================
echo.

echo [1/3] Starting Local Ethereum Hardhat Node on http://127.0.0.1:8545 ...
start "SecureChain 1 - Hardhat Ethereum Node" cmd /k "cd contracts && npx hardhat node"

ping 127.0.0.1 -n 3 >nul

echo [2/3] Starting Django REST Framework Backend on http://127.0.0.1:8000 ...
start "SecureChain 2 - Django Backend" cmd /k "cd backend && venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000"

ping 127.0.0.1 -n 3 >nul

echo [3/3] Starting Next.js Web Frontend on http://localhost:3000 ...
start "SecureChain 3 - Next.js Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo =======================================================================
echo All services launched in separate windows!
echo Web Application:        http://localhost:3000
echo 10K Big Data Dashboard: http://localhost:3000/analytics
echo Django REST API:        http://127.0.0.1:8000/api/records/
echo Local Ethereum Node:    http://127.0.0.1:8545
echo =======================================================================
echo.
