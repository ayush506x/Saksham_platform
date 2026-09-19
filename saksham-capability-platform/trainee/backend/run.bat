@echo off
echo ================================================================
echo   SAKSHAM (सक्षम) - National AI Competency & Learning Service
echo ================================================================
echo.
echo Starting SAKSHAM AI Server on port 8080...
echo Health: http://localhost:8080/api/ai/health
echo.
py -3.13 ai_service.py 8080
if %ERRORLEVEL% NEQ 0 (
    python ai_service.py 8080
)
pause
