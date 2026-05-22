import { SHEET_ID } from "./config.js";
import { loadSheet } from "./dashboard-base.js";

export function loadAgenciasSP() {
    loadSheet(SHEET_ID, "'Agencias-SP'!A1:H", "table-agencias-sp");
}