@echo off
@REM set /p PORT=Enter port number (default 8000): 
@REM if "%PORT%"=="" set PORT=8000
echo Starting AI Services
uv run uvicorn main:app --reload --port 8000 