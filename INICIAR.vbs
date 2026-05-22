dim shell, cmd, cwd

set shell = WScript.CreateObject("WScript.Shell")

' Obter diretório atual
cwd = WScript.ScriptFullName
cwd = shell.CurrentDirectory

' Tentar iniciar com Python
shell.Run "cmd /k python -m http.server 8000", 1, false

' Se Python não existir, mostrar mensagem
WScript.Echo "Se a janela fechou, Python não está instalado." & vbCrLf & _
             "Por favor, instale Python em: https://www.python.org/downloads/" & vbCrLf & vbCrLf & _
             "Ou use a solução alternativa: abra index.html diretamente no navegador"
