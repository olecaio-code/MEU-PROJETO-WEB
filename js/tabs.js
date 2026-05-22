import { TABS_CONFIG } from "./config.js";

function initTabs() {
  const container = document.getElementById("app-container");
  
  // Create header with tabs
  const header = document.createElement("header");
  const nav = document.createElement("nav");
  nav.className = "tabs";
  
  TABS_CONFIG.forEach((tab, index) => {
    const btn = document.createElement("button");
    btn.dataset.tab = tab.id;
    btn.textContent = tab.label;
    if (index === 0) btn.classList.add("active");
    btn.addEventListener("click", () => switchTab(tab.id));
    nav.appendChild(btn);
  });
  
  header.appendChild(nav);
  container.parentElement.insertBefore(header, container);
  
  // Create tab panels
  TABS_CONFIG.forEach((tab, index) => {
    const panel = document.createElement("div");
    panel.id = tab.id;
    panel.className = "tab-panel" + (index === 0 ? " active" : "");
    
    const title = document.createElement("h2");
    title.textContent = tab.label;
    panel.appendChild(title);
    
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    
    const headers = tab.headers || ["NOME", "CARGO", "EMAIL", "NOME DA EMPRESA", "PERFIL DO LINKEDIN", "SEGMENTO", "SITE", "OBSERVAÇÕES"];
    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    const tbody = document.createElement("tbody");
    tbody.id = tab.tableId;
    table.appendChild(tbody);
    
    panel.appendChild(table);
    container.appendChild(panel);
  });
  
  console.log("UI initialized with", TABS_CONFIG.length, "tabs");
}

function switchTab(tabId) {
  // Hide all panels
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  
  // Show selected panel
  document.getElementById(tabId).classList.add("active");
  document.querySelector(`[data-tab="${tabId}"]`).classList.add("active");
  
  console.log("Switched to tab:", tabId);
}

export { initTabs };
