import { SHEET_ID } from "./config.js";
import { loadSheet } from "./dashboard-base.js";

export function loadDiretoMG() {
    loadSheet(SHEET_ID, "'Direto MG'!A1:H", "table-direto-mg");
}