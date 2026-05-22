import { SHEET_ID, USE_LOCAL_DATA, API_BASE_URL, TABS_CONFIG } from "./config.js";

// Cache para armazenar dados
const dataCache = {};

function columnToLetter(columnIndex) {
  let letter = '';
  let dividend = columnIndex + 1;

  while (dividend > 0) {
    let modulo = (dividend - 1) % 26;
    letter = String.fromCharCode(65 + modulo) + letter;
    dividend = Math.floor((dividend - modulo) / 26);
  }

  return letter;
}

function findTabByTableId(tableBodyId) {
  return TABS_CONFIG.find(tab => tab.tableId === tableBodyId);
}

function buildA1Range(tableBodyId, rowIndex, colIndex) {
  const tab = findTabByTableId(tableBodyId);
  if (!tab) {
    throw new Error(`Aba do dashboard não encontrada para tableId: ${tableBodyId}`);
  }

  const rowNumber = rowIndex + 1;
  const columnLetter = columnToLetter(colIndex);
  return `${tab.sheetName}!${columnLetter}${rowNumber}`;
}

// Função para carregar dados do Google Sheets
async function loadSheetFromAPI(sheetId, range, tableBodyId) {
  const tbody = document.getElementById(tableBodyId);
  if (!tbody) {
    console.warn(`Element with ID "${tableBodyId}" not found`);
    return;
  }

  tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; color: #666;">Carregando...</td></tr>';

  try {
    const encodedRange = encodeURIComponent(range);
    const url = `${API_BASE_URL || ''}/api/sheets/${encodedRange}`;
    
    console.log(`📥 Carregando via backend: ${range}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const rows = data.values || [];
    console.log(`📊 ${rows.length} linhas carregadas de ${range}`);

    if (rows.length <= 1) {
      tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; color: #999;">Nenhum dado disponível</td></tr>';
      return;
    }

    // Armazenar em cache
    dataCache[tableBodyId] = rows;

    // Renderizar dados
    tbody.innerHTML = "";
    for (let i = 1; i < rows.length; i++) {
      const tr = document.createElement("tr");
      tr.dataset.rowIndex = i;
      
      rows[i].forEach((cell, colIndex) => {
        const td = document.createElement("td");
        td.textContent = cell || "";
        td.dataset.colIndex = colIndex;
        td.style.cursor = "pointer";
        td.style.padding = "8px";
        
        // Permitir edição ao clicar
        td.addEventListener("click", function() {
          enableEdit(this, tableBodyId, i, colIndex);
        });
        
        tr.appendChild(td);
      });
      
      // Botão de deletar
      const tdDelete = document.createElement("td");
      const btnDelete = document.createElement("button");
      btnDelete.textContent = "🗑️";
      btnDelete.style.background = "#ff4444";
      btnDelete.style.color = "white";
      btnDelete.style.border = "none";
      btnDelete.style.padding = "5px 10px";
      btnDelete.style.borderRadius = "3px";
      btnDelete.style.cursor = "pointer";
      btnDelete.onclick = () => deleteRow(tableBodyId, i);
      tdDelete.appendChild(btnDelete);
      tr.appendChild(tdDelete);
      
      tbody.appendChild(tr);
    }

    console.log(`✅ ${rows.length - 1} linhas exibidas`);
  } catch (e) {
    console.error(`❌ Erro carregando ${range}:`, e.message);
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; color: red;">⚠️ Erro: ${e.message}</td></tr>`;
  }
}

// Função para ativar edição inline
function enableEdit(cell, tableBodyId, rowIndex, colIndex) {
  if (cell.contentEditable === "true") return; // Já está editando
  
  const originalValue = cell.textContent;
  cell.contentEditable = "true";
  cell.style.background = "#ffffcc";
  cell.style.border = "2px solid #4caf50";
  cell.focus();

  const cleanup = () => {
    cell.contentEditable = "false";
    cell.style.background = "";
    cell.style.border = "";
    cell.removeEventListener("blur", saveEdit);
    cell.removeEventListener("keydown", handleKeydown);
  };

  const saveEdit = async () => {
    cleanup();
    const newValue = cell.textContent;
    if (newValue !== originalValue) {
      console.log(`✏️ Célula atualizada: ${originalValue} → ${newValue}`);
      await updateSheetValue(tableBodyId, rowIndex, colIndex, newValue);
    }
  };

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      cell.textContent = originalValue;
      cleanup();
    }
  };

  cell.addEventListener("blur", saveEdit);
  cell.addEventListener("keydown", handleKeydown);
}

// Função para atualizar valor no Google Sheets
async function updateSheetValue(tableBodyId, rowIndex, colIndex, newValue) {
  try {
    if (USE_LOCAL_DATA) {
      console.warn("Modo local ativado: alterações não são enviadas ao Google Sheets.");
      return;
    }

    const range = buildA1Range(tableBodyId, rowIndex, colIndex);
    const url = `${API_BASE_URL}/api/sheets/update`;

    console.log(`📤 Salvando no Google Sheets: ${range} = ${newValue}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ range, value: newValue })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message = payload?.error || response.statusText || `HTTP ${response.status}`;
      throw new Error(message);
    }

    const result = await response.json();
    console.log("✅ Valor salvo com sucesso:", result.updatedRange || range);
    return result;
  } catch (e) {
    console.error("❌ Erro ao salvar:", e.message);
    const tbody = document.getElementById(tableBodyId);
    if (tbody) {
      const warning = document.createElement("div");
      warning.textContent = `Erro ao salvar no Google Sheets: ${e.message}`;
      warning.style.color = "#b71c1c";
      warning.style.padding = "8px";
      warning.style.marginTop = "8px";
      tbody.parentElement.insertBefore(warning, tbody);
    }
  }
}

// Função para adicionar nova linha ao Google Sheets
async function appendSheetRow(tableBodyId, rowValues) {
  try {
    if (USE_LOCAL_DATA) {
      console.warn("Modo local ativado: alterações não são enviadas ao Google Sheets.");
      return;
    }

    const tab = findTabByTableId(tableBodyId);
    if (!tab) {
      throw new Error(`Aba do dashboard não encontrada para tableId: ${tableBodyId}`);
    }

    const url = `${API_BASE_URL}/api/sheets/append`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sheetName: tab.sheetName, values: [rowValues] })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message = payload?.error || response.statusText || `HTTP ${response.status}`;
      throw new Error(message);
    }

    const result = await response.json();
    console.log("✅ Linha adicionada ao Google Sheets:", result.updates || result);
    return result;
  } catch (e) {
    console.error("❌ Erro ao adicionar linha:", e.message);
    const tbody = document.getElementById(tableBodyId);
    if (tbody) {
      const warning = document.createElement("div");
      warning.textContent = `Erro ao adicionar linha no Google Sheets: ${e.message}`;
      warning.style.color = "#b71c1c";
      warning.style.padding = "8px";
      warning.style.marginTop = "8px";
      tbody.parentElement.insertBefore(warning, tbody);
    }
  }
}

async function deleteSheetRow(tableBodyId, sheetRowNumber) {
  try {
    if (USE_LOCAL_DATA) {
      console.warn("Modo local ativado: exclusões não são enviadas ao Google Sheets.");
      return;
    }

    const tab = findTabByTableId(tableBodyId);
    if (!tab) {
      throw new Error(`Aba do dashboard não encontrada para tableId: ${tableBodyId}`);
    }

    const url = `${API_BASE_URL}/api/sheets/delete`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sheetName: tab.sheetName, rowNumber: sheetRowNumber })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message = payload?.error || response.statusText || `HTTP ${response.status}`;
      throw new Error(message);
    }

    const result = await response.json();
    console.log("✅ Linha excluída no Google Sheets:", result);
    return result;
  } catch (e) {
    console.error("❌ Erro ao excluir linha:", e.message);
    const tbody = document.getElementById(tableBodyId);
    if (tbody) {
      const warning = document.createElement("div");
      warning.textContent = `Erro ao excluir linha no Google Sheets: ${e.message}`;
      warning.style.color = "#b71c1c";
      warning.style.padding = "8px";
      warning.style.marginTop = "8px";
      tbody.parentElement.insertBefore(warning, tbody);
    }
  }
}

// Função para deletar linha
async function deleteRow(tableBodyId, rowIndex) {
  if (!confirm("Tem certeza que quer deletar esta linha?")) return;

  const index = parseInt(rowIndex, 10);
  if (Number.isNaN(index) || index < 1) return;

  const tbody = document.getElementById(tableBodyId);
  const rows = tbody.querySelectorAll("tr");
  const targetRow = rows[index - 1];
  if (!targetRow) return;

  if (targetRow.dataset.newRow === "true") {
    targetRow.remove();
    console.log(`🗑️ Linha temporária removida do dashboard`);
    return;
  }

  const sheetRowNumber = index + 1;
  const result = await deleteSheetRow(tableBodyId, sheetRowNumber);
  if (result) {
    await loadSheetFromAPI(SHEET_ID, findTabByTableId(tableBodyId).range, tableBodyId);
  }
}

// Função para adicionar nova linha
async function addNewRow(tableBodyId, headers) {
  try {
    const tbody = document.getElementById(tableBodyId);
    const tr = document.createElement("tr");
    tr.dataset.newRow = "true";

    headers.forEach((header, colIndex) => {
      const td = document.createElement("td");
      td.style.background = "#e8f5e9";
      td.style.border = "2px solid #4caf50";
      td.style.padding = "4px";
      td.style.minWidth = "120px";

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = header || "Digite...";
      input.style.width = "100%";
      input.style.border = "1px solid #ccc";
      input.style.borderRadius = "4px";
      input.style.padding = "8px";
      input.dataset.colIndex = colIndex;
      input.spellcheck = false;

      td.appendChild(input);
      tr.appendChild(td);
    });

    const tdActions = document.createElement("td");
    tdActions.style.display = "flex";
    tdActions.style.gap = "8px";

    const btnSave = document.createElement("button");
    btnSave.textContent = "Salvar";
    btnSave.style.background = "#007bff";
    btnSave.style.color = "white";
    btnSave.style.border = "none";
    btnSave.style.padding = "8px 12px";
    btnSave.style.borderRadius = "4px";
    btnSave.style.cursor = "pointer";

    const btnCancel = document.createElement("button");
    btnCancel.textContent = "Cancelar";
    btnCancel.style.background = "#666";
    btnCancel.style.color = "white";
    btnCancel.style.border = "none";
    btnCancel.style.padding = "8px 12px";
    btnCancel.style.borderRadius = "4px";
    btnCancel.style.cursor = "pointer";

    btnSave.onclick = async () => {
      const inputs = Array.from(tr.querySelectorAll('input[data-col-index]'));
      const rowValues = inputs.map(input => input.value.trim());
      if (rowValues.every(value => value === "")) {
        alert('Preencha pelo menos uma célula antes de salvar.');
        return;
      }

      const result = await appendSheetRow(tableBodyId, rowValues);
      if (result) {
        await loadSheetFromAPI(SHEET_ID, findTabByTableId(tableBodyId).range, tableBodyId);
      }
    };

    btnCancel.onclick = () => tr.remove();

    tdActions.appendChild(btnSave);
    tdActions.appendChild(btnCancel);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
    const firstInput = tr.querySelector('input');
    if (firstInput) firstInput.focus();
    console.log(`➕ Nova linha adicionada`);
  } catch (e) {
    console.error("❌ Erro ao adicionar linha:", e.message);
  }
}

// Função principal para carregar todas as abas
async function loadAllSheets() {
  if (USE_LOCAL_DATA) {
    console.log("Modo: Dados Locais (data.json)");
    await Promise.all(
      TABS_CONFIG.map(tab => loadSheetLocal(tab.sheetName, tab.tableId))
    );
    console.log("✅ Todas as abas carregadas do local!");
  } else {
    console.log("Modo: Google Sheets API");
    await Promise.all(
      TABS_CONFIG.map(tab => loadSheetFromAPI(SHEET_ID, tab.range, tab.tableId))
    );
    console.log("✅ Todas as abas carregadas da API!");
  }
}

// Função para adicionar botão de edição à interface
function addEditButton(tabId) {
  const panel = document.getElementById(tabId);
  if (!panel) return;

  const buttonContainer = panel.querySelector(".button-container") || (() => {
    const container = document.createElement("div");
    container.className = "button-container";
    container.style.marginBottom = "20px";
    container.style.display = "flex";
    container.style.gap = "10px";
    panel.insertBefore(container, panel.querySelector("table"));
    return container;
  })();

  // Botão para adicionar linha
  const btnAdd = document.createElement("button");
  btnAdd.textContent = "➕ Adicionar Linha";
  btnAdd.style.background = "#4caf50";
  btnAdd.style.color = "white";
  btnAdd.style.border = "none";
  btnAdd.style.padding = "10px 20px";
  btnAdd.style.borderRadius = "5px";
  btnAdd.style.cursor = "pointer";
  btnAdd.onclick = () => {
    const tbody = panel.querySelector("tbody");
    const thead = panel.querySelector("thead");
    const headers = Array.from(thead.querySelectorAll("th")).map(th => th.textContent);
    addNewRow(tbody.id, headers);
  };

  buttonContainer.innerHTML = "";
  buttonContainer.appendChild(btnAdd);
}

export { loadSheetFromAPI, loadAllSheets, addEditButton, enableEdit, deleteRow, addNewRow };
