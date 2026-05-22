import { SHEET_ID } from "./config.js";
import { loadSheet } from "./dashboard-base.js";

export function loadDiretoSP() {
    loadSheet(SHEET_ID, "'Direto SP'!A1:H", "table-direto-sp");
}