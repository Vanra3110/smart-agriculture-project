@echo off

echo Starting Smart Agriculture Project...

start "FastAPI AI Service" cmd /k "cd /d ai-service && dev.bat"

start "Express Backend" cmd /k "cd /d backend && dev.bat"

start "React Frontend" cmd /k "cd /d frontend && dev.bat"

echo.
echo All three servers are starting!