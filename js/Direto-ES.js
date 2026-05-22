import { SHEET_ID } from "./config.js";
import { loadSheet } from "./dashboard-base.js";

export function loadDiretoES() {
    loadSheet(SHEET_ID, "'Direto ES'!A1:H", "table-direto-es");
}