@echo off
echo =======================================================================
echo          SecureChain: Healthcare Decentralized Access Control
echo =======================================================================
echo Starting all services (Hardhat Node, Django Backend, Next.js Frontend)
echo.

echo [1/3] Starting Django REST Framework Backend on http://127.0.0.1:8000 ...
start "SecureChain Django Backend" cmd /k "cd backend && ..\backend\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Next.js Frontend on http://localhost:3000 ...
start "SecureChain Next.js Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services launched!
echo Access the Web Application at: http://localhost:3000
echo Access the Django API at:      http://127.0.0.1:8000/api/records/
echo =======================================================================
pause
