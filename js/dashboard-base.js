import { SHEET_ID, API_KEY, USE_LOCAL_DATA } from "./config.js";

// Mapeamento de nomes de abas para IDs de tabela
const SHEET_MAP = {
  "Agencias-SP": "table-agencias-sp",
  "Direto SP": "table-direto-sp",
  "Agencias-DF": "table-agencias-df",
  "Direto-DF": "table-direto-df",
  "Agencias-MG": "table-agencias-mg",
  "Direto-MG": "table-direto-mg",
  "Agencias-ES": "table-agencias-es",
  "Direto-ES": "table-direto-es",
  "Planejamento-Semanal": "table-planejamento-semanal",
  "Prospeccao-Inteligente": "table-prospeccao-inteligente",
  "Processo-Metropoles": "table-processo-metropoles",
  "Funil-Comercial": "table-funil-comercial",
  "Metas-Mensais": "table-metas-mensais"
};

async function loadSheetLocal(sheetName, tableBodyId) {
  const tbody = document.getElementById(tableBodyId);
  if (!tbody) {
    console.warn(`Element with ID "${tableBodyId}" not found. Skipping...`);
    return;
  }

  tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; color: #666;">Carregando...</td></tr>';

  try {
    console.log(`Loading (local): ${sheetName}`);
    
    const response = await fetch('./data.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Não foi possível carregar data.json`);
    }
    
    const allData = await response.json();
    const sheet = allData.sheets.find(s => s.name === sheetName);
    
    if (!sheet) {
      throw new Error(`Aba "${sheetName}" não encontrada em data.json`);
    }

    const rows = sheet.data || [];

    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; color: #999;">Nenhum dado disponível</td></tr>';
      return;
    }

    tbody.innerHTML = "";

    for (let i = 1; i < rows.length; i++) {
      const tr = document.createElement("tr");
      rows[i].forEach((cell) => {
        const td = document.createElement("td");
        td.textContent = cell || "";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }

    console.log(`✓ Loaded ${rows.length - 1} data rows from ${sheetName}`);
  } catch (e) {
    console.error(`✗ Erro carregando ${sheetName}:`, e.message);
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; color: red;">Erro: ${e.message}</td></tr>`;
  }
}

async function loadSheetAPI(sheetId, range, tableBodyId) {
  const tbody = document.getElementById(tableBodyId);
  if (!tbody) {
    console.warn(`Element with ID "${tableBodyId}" not found. Skipping...`);
    return;
  }

  tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; color: #666;">Carregando...</td></tr>';

  try {
    const encodedRange = encodeURIComponent(range);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodedRange}?alt=json&key=${API_KEY}`;
    
    console.log(`Loading (API): ${range}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const rows = data.values || [];

    if (rows.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; color: #999;">Nenhum dado disponível</td></tr>';
      return;
    }

    tbody.innerHTML = "";

    for (let i = 1; i < rows.length; i++) {
      const tr = document.createElement("tr");
      rows[i].forEach((cell) => {
        const td = document.createElement("td");
        td.textContent = cell || "";
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    }

    console.log(`✓ Loaded ${rows.length - 1} data rows from ${range}`);
  } catch (e) {
    console.error(`✗ Erro carregando ${range}:`, e.message);
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; color: red;">Erro: ${e.message}</td></tr>`;
  }
}

async function loadAllSheets() {
  if (USE_LOCAL_DATA) {
    console.log("Modo: Dados Locais (data.json)");
    
    const sheetNames = Object.keys(SHEET_MAP);
    console.log(`Starting to load ${sheetNames.length} sheets from local data...`);
    
    await Promise.all(
      sheetNames.map(sheetName => loadSheetLocal(sheetName, SHEET_MAP[sheetName]))
    );
    console.log("All sheets loaded from local data!");
  } else {
    console.log("Modo: Google Sheets API");
    
    const sheets = [
      { name: "'Agencias-SP'!A1:H", id: "table-agencias-sp" },
      { name: "'Direto SP'!A1:H", id: "table-direto-sp" },
      
      { name: "'AgenciasDF'!A1:H", id: "table-agencias-df" },
      { name: "'Direto-DF'!A1:H", id: "table-direto-df" },
      
      { name: "'Agencias-MG'!A1:H", id: "table-agencias-mg" },
      { name: "'Direto-MG'!A1:H", id: "table-direto-mg" },
      
      { name: "'Agencias-ES'!A1:H", id: "table-agencias-es" },
      { name: "'Direto-ES'!A1:H", id: "table-direto-es" },
      
      { name: "'Planejamento-Semanal'!A1:E", id: "table-planejamento-semanal" },
      { name: "'Prospeccao-Inteligente'!A1:E", id: "table-prospeccao-inteligente" },
      { name: "'Processo-Metropoles'!A1:H", id: "table-processo-metropoles" },
      
      { name: "'Funil-Comercial'!A1:D", id: "table-funil-comercial" },
      { name: "'Metas-Mensais'!A1:E", id: "table-metas-mensais" }
    ];

    console.log("Starting to load all sheets from Google Sheets API...");
    await Promise.all(
      sheets.map(sheet => loadSheetAPI(SHEET_ID, sheet.name, sheet.id))
    );
    console.log("All sheets loaded from API!");
  }
}

export { loadSheetLocal, loadSheetAPI, loadAllSheets };