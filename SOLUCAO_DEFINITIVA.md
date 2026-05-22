╔════════════════════════════════════════════════════════════════════════╗
║         🔑 PROBLEMA: HTTP 403 PERSISTE - SOLUÇÃO DEFINITIVA           ║
╚════════════════════════════════════════════════════════════════════════╝


📊 DIAGNÓSTICO:
────────────────────────────────────────────────────────────────────────

Todos os testes: ❌ HTTP 403
Significado: A chave API atual não funciona

Arquivo encontrado: ✅ API Google Sheets.json
Project ID: projeto-definitivo-496720


🔧 SOLUÇÃO: Extrair Chave Correta do Projeto
════════════════════════════════════════════════════════════════════════

Seu arquivo OAuth é para "Desktop Application", mas a API precisa de
uma "API Key" diferente. Vou guiar você a gerar a chave correta.


📋 PASSOS:
────────────────────────────────────────────────────────────────────────

[1] Acesse Google Cloud Console com sua conta:
    👉 https://console.cloud.google.com/

[2] Selecione o Projeto Correto:
    
    a) Clique no seletor de projeto (canto superior)
    b) Procure por: "projeto-definitivo-496720"
    c) Clique para abrir
    
    (Este é o projeto do seu arquivo OAuth)


[3] Vá para: Credentials

    a) Menu esquerdo → "APIs & Services"
    b) Clique em "Credentials"


[4] Procure por uma chave API existente:

    Você verá uma lista com:
    ├─ API Keys
    ├─ OAuth 2.0 Client IDs
    └─ Service Accounts
    
    Se houver um "API Key" na lista → Copie-a!
    Se NÃO houver → Vá para [5]


[5] Se não houver API Key, crie uma:

    a) Clique: "+ CREATE CREDENTIALS" (azul, topo)
    b) Escolha: "API Key"
    c) Uma chave será gerada
    d) Clique: "Copy" para copiar


[6] Certifique-se de que Google Sheets API está habilitada:

    a) Menu esquerdo → "APIs & Services" → "Library"
    b) Procure: "Google Sheets API"
    c) Se estiver "Disabled" → Clique "Enable"


[7] Copie a Chave:

    a) Volte para "Credentials"
    b) Procure a chave API (geralmente começa com "AIzaSy...")
    c) Clique no ícone "Copy" ou selecione e copie


[8] Atualize o config.js:

    a) Abra: meu-projeto-web/js/config.js
    b) Substitua a linha:
    
       const API_KEY = "COLE_AQUI_A_CHAVE_QUE_COPIOU";
    
    c) Salve: Ctrl+S


[9] Teste novamente:

    a) Abra no navegador: meu-projeto-web/test-api.html
    b) Se ver ✅ → Funcionou!
    c) Se ainda ❌ → Vá para [10]


[10] Se ainda der 403, compartilhe a planilha:

     a) Abra: https://docs.google.com/spreadsheets/d/1TWukqSR6JrBoW23xX1xDKiNph4R1NlK4OOLAzmL1VAA/
     b) Clique em: "Compartilhar" (canto superior direito)
     c) Mude para: "Qualquer pessoa com o link"
     d) Teste novamente


════════════════════════════════════════════════════════════════════════

⚡ VERSÃO RÁPIDA (5 minutos):
────────────────────────────────────────────────────────────────────────

1. https://console.cloud.google.com/
2. Projeto: "projeto-definitivo-496720"
3. Credentials → Google Sheets API → Enable (se desabilitada)
4. "+ CREATE CREDENTIALS" → "API Key"
5. Copie a chave
6. Edite: js/config.js
7. Cole a chave
8. Salve (Ctrl+S)
9. Teste: test-api.html


════════════════════════════════════════════════════════════════════════

❓ DÚVIDAS?
────────────────────────────────────────────────────────────────────────

P: Não consigo encontrar a chave?
R: Procure por "API Keys" na seção de Credentials
   Deve ser uma string começando com "AIzaSy..."

P: Criei uma nova chave mas continua não funcionando?
R: Pode levar até 1-2 minutos para ativar. Aguarde e tente novamente.

P: Ainda dá HTTP 403?
R: Então precisa compartilhar a planilha também:
   → Abra: COMPARTILHAR_PLANILHA.txt


════════════════════════════════════════════════════════════════════════

✅ VERIFICAÇÃO:
────────────────────────────────────────────────────────────────────────

Após atualizar config.js, teste:

meu-projeto-web/test-api.html

Esperado: ✅ ✅ ✅ (todas as abas em verde)


════════════════════════════════════════════════════════════════════════

🎯 SE TUDO FUNCIONAR:

1. Abra: meu-projeto-web/index.html
2. Verá o dashboard carregando
3. Dados aparecem nas tabelas
4. Clique nas abas para navegar

PRONTO! 🎉


════════════════════════════════════════════════════════════════════════

PRÓXIMO PASSO: Execute os passos [1] a [9] acima ☝️

════════════════════════════════════════════════════════════════════════
