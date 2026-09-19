#!/usr/bin/env bash
echo "================================================================"
echo "  SAKSHAM (सक्षम) - National AI Competency & Learning Service"
echo "================================================================"
echo ""
echo "Starting SAKSHAM AI Server on port 8080..."
echo "Health: http://localhost:8080/api/ai/health"
echo ""
python3 ai_service.py 8080
