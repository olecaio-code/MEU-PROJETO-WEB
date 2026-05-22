@echo off
cd /d "c:\Users\Caio Bruno Corrêa\OneDrive\Área de Trabalho\meu-projeto-web"
echo.
echo ========================================
echo 🚀 Iniciando Servidor HTTP
echo ========================================
echo.
echo Digite o endereço no navegador:
echo http://localhost:8000
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
echo ========================================
echo.
python -m http.server 8000
pause
