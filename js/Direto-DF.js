import { SHEET_ID } from "./config.js";
import { loadSheet } from "./dashboard-base.js";

export function loadDiretoDF() {
    loadSheet(SHEET_ID, "'Direto DF'!A1:H", "table-direto-df");
}