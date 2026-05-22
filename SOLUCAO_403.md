# 🔒 Problema: HTTP 403 - Acesso Negado

## O que está acontecendo?

A API Google Sheets está rejeitando a requisição com **HTTP 403 Forbidden**, o que significa:

```
❌ A chave API não tem permissão para acessar a planilha
```

---

## ✅ Solução 1: Verifique o Compartilhamento (RÁPIDA)

### Passo 1️⃣: Abra a planilha
```
https://docs.google.com/spreadsheets/d/1TWukqSR6JrBoW23xX1xDKiNph4R1NlK4OOLAzmL1VAA/
```

### Passo 2️⃣: Clique em "Compartilhar"
- Botão azul no canto **superior direito**

### Passo 3️⃣: Verifique as permissões
Procure por **"Acesso geral"** e garanta que seja:
- ✅ **"Qualquer pessoa com o link"** (melhor opção)
- ✅ **"Público"**

Se estiver em "Acesso restrito", mude para uma das opções acima!

### Passo 4️⃣: Teste novamente
```
Abra: meu-projeto-web/test-api.html
```

---

## ✅ Solução 2: Gere uma Nova Chave API (Se solução 1 não funcionar)

### Passo 1️⃣: Acesse Google Cloud Console
```
https://console.cloud.google.com/
```

### Passo 2️⃣: Crie/Selecione um Projeto
- Clique em "Select a Project" (topo)
- Clique em "New Project"
- Digite um nome (ex: "Dashboard Comercial")
- Clique em "Create"

### Passo 3️⃣: Habilite Google Sheets API
- Vá para **APIs & Services** → **Library**
- Procure por: **"Google Sheets API"**
- Clique e depois **"Enable"**

### Passo 4️⃣: Crie uma Chave API
- Vá para **APIs & Services** → **Credentials**
- Clique em **"+ Create Credentials"** (azul, topo)
- Selecione **"API Key"**
- Uma nova chave será gerada!
- Copie a chave

### Passo 5️⃣: Atualize no projeto
- Abra: `meu-projeto-web/js/config.js`
- Encontre a linha com `const API_KEY = "..."`
- Substitua pela nova chave
- **Salve o arquivo**

### Passo 6️⃣: Teste novamente
```
Abra: meu-projeto-web/test-api.html
```

---

## 📊 Resumo das Causas Possíveis

| Causa | Status Atual | Solução |
|-------|-------------|---------|
| Planilha com acesso restrito | ❌ Provável | Ver Solução 1 |
| Chave API desativada | ❓ Possível | Ver Solução 2 |
| Chave API sem Sheets API habilitada | ❓ Possível | Ver Solução 2 |
| Chave API expirada | ❓ Possível | Ver Solução 2 |

---

## 🆘 Se Nenhuma Solução Funcionar

Se depois de testar as 2 soluções ainda receber 403:

1. **Abra o Console do navegador (F12)**
2. **Vá para a aba "Console"**
3. **Procure por mensagens de erro detalhadas**
4. **Compartilhe essas mensagens**

Alternativas:
- Use um servidor Node.js com `googleapis` package
- Exporte os dados como CSV e sirva localmente
- Use Google Apps Script como intermediário

---

## ⏱️ Tempo Estimado
- **Solução 1**: 2 minutos ⚡
- **Solução 2**: 10 minutos ⏱️

**Comece pela Solução 1!** É a mais rápida e tem 80% de chance de funcionar.

---

## 📞 Próximo Passo
Depois de implementar uma solução, volte para:
```
meu-projeto-web/test-api.html
```

Se os testes passarem (✅), o dashboard funcionará automaticamente!
