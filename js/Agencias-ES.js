import { SHEET_ID } from "./config.js";
import { loadSheet } from "./dashboard-base.js";

export function loadAgenciasES() {
    loadSheet(SHEET_ID, "'Agencias-ES'!A1:H", "table-agencias-es");
}