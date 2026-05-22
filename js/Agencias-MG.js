import { SHEET_ID } from "./config.js";
import { loadSheet } from "./dashboard-base.js";

export function loadAgenciasMG() {
    loadSheet(SHEET_ID, "'Agencias-MG'!A1:H", "table-agencias-mg");
}