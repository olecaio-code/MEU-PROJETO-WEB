const SHEET_ID = "1TWukqSR6JrBoW23xX1xDKiNph4R1NlK4OOLAzmL1VAA";
const API_KEY = "AIzaSyAHN8gFXs8CDoRfGb_AFFqQEvZvwQr-zvw";

// Use Google Sheets API (true) or local data.json (false)
const USE_LOCAL_DATA = false;

// Endereço base da API do servidor local (quando usar OAuth + edição)
const API_BASE_URL = "https://meu-projeto-web-w9b4.onrender.com";

// Intervalo de atualização automática em milissegundos
const REFRESH_INTERVAL_MS = 60000;

// Configuração de abas, nomes de planilhas e ranges
const TABS_CONFIG = [
  {
    id: "agencias-sp",
    label: "Agências SP",
    sheetName: "Agencias-SP",
    range: "'Agencias-SP'!A1:H",
    tableId: "table-agencias-sp",
    headers: ["NOME", "CARGO", "EMAIL", "NOME DA EMPRESA", "PERFIL DO LINKEDIN", "SEGMENTO", "SITE", "OBSERVAÇÕES"]
  },
  {
    id: "direto-sp",
    label: "Direto SP",
    sheetName: "Direto-SP",
    range: "'Direto-SP'!A1:H",
    tableId: "table-direto-sp",
    headers: ["NOME", "CARGO", "EMAIL", "NOME DA EMPRESA", "PERFIL DO LINKEDIN", "SEGMENTO", "SITE", "OBSERVAÇÕES"]
  },
  {
    id: "agencias-df",
    label: "Agências DF",
    sheetName: "Agencias-DF",
    range: "'Agencias-DF'!A1:H",
    tableId: "table-agencias-df",
    headers: ["NOME", "CARGO", "EMAIL", "NOME DA EMPRESA", "PERFIL DO LINKEDIN", "SEGMENTO", "SITE", "OBSERVAÇÕES"]
  },
  {
    id: "direto-df",
    label: "Direto DF",
    sheetName: "Direto-DF",
    range: "'Direto-DF'!A1:H",
    tableId: "table-direto-df",
    headers: ["NOME", "CARGO", "EMAIL", "NOME DA EMPRESA", "PERFIL DO LINKEDIN", "SEGMENTO", "SITE", "OBSERVAÇÕES"]
  },
  {
    id: "agencias-mg",
    label: "Agências MG",
    sheetName: "Agencias-MG",
    range: "'Agencias-MG'!A1:H",
    tableId: "table-agencias-mg",
    headers: ["NOME", "CARGO", "EMAIL", "NOME DA EMPRESA", "PERFIL DO LINKEDIN", "SEGMENTO", "SITE", "OBSERVAÇÕES"]
  },
  {
    id: "direto-mg",
    label: "Direto MG",
    sheetName: "Direto-MG",
    range: "'Direto-MG'!A1:H",
    tableId: "table-direto-mg",
    headers: ["NOME", "CARGO", "EMAIL", "NOME DA EMPRESA", "PERFIL DO LINKEDIN", "SEGMENTO", "SITE", "OBSERVAÇÕES"]
  },
  {
    id: "agencias-es",
    label: "Agências ES",
    sheetName: "Agencias-ES",
    range: "'Agencias-ES'!A1:H",
    tableId: "table-agencias-es",
    headers: ["NOME", "CARGO", "EMAIL", "NOME DA EMPRESA", "PERFIL DO LINKEDIN", "SEGMENTO", "SITE", "OBSERVAÇÕES"]
  },
  {
    id: "direto-es",
    label: "Direto ES",
    sheetName: "Direto-ES",
    range: "'Direto-ES'!A1:H",
    tableId: "table-direto-es",
    headers: ["NOME", "CARGO", "EMAIL", "NOME DA EMPRESA", "PERFIL DO LINKEDIN", "SEGMENTO", "SITE", "OBSERVAÇÕES"]
  },
  {
    id: "planejamento-semanal",
    label: "Planejamento Semanal",
    sheetName: "Planejamento-Semanal",
    range: "'Planejamento-Semanal'!A1:E",
    tableId: "table-planejamento-semanal",
    headers: ["Atividade", "Data", "Responsável", "Status", "Notas"]
  },
  {
    id: "prospeccao-inteligente",
    label: "Prospecção Inteligente",
    sheetName: "Prospeccao-Inteligente",
    range: "'Prospeccao-Inteligente'!A1:E",
    tableId: "table-prospeccao-inteligente",
    headers: ["Nome", "Status", "Origem", "Classificação", "Valor"]
  },
  {
    id: "processo-metropoles",
    label: "Processo Metrópoles",
    sheetName: "Processo-Metropoles",
    range: "'Processo-Metropoles'!A1:H",
    tableId: "table-processo-metropoles",
    headers: ["Cliente", "Necessidade", "Solução Proposta", "Formato Comercial", "Valor Estimado", "Responsável", "Status", "Próxima Ação"]
  },
  {
    id: "funil-comercial",
    label: "Funil Comercial",
    sheetName: "Funil-Comercial",
    range: "'Funil-Comercial'!A1:D",
    tableId: "table-funil-comercial",
    headers: ["Etapa", "Contagem", "Meta", "Taxa Conversão (%)"]
  },
  {
    id: "metas-mensais",
    label: "Metas Mensais",
    sheetName: "Metas-Mensais",
    range: "'Metas-Mensais'!A1:E",
    tableId: "table-metas-mensais",
    headers: ["Mês", "Planejado", "Realizado", "Variação (%)", "Status"]
  }
];

export { SHEET_ID, API_KEY, USE_LOCAL_DATA, API_BASE_URL, REFRESH_INTERVAL_MS, TABS_CONFIG };