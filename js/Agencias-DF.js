import { SHEET_ID } from "./config.js";
import { loadSheet } from "./dashboard-base.js";

export function loadAgenciasDF() {
    loadSheet(SHEET_ID, "'Agencias-DF'!A1:H", "table-agencias-df");
}