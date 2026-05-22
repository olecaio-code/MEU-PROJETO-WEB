import { SHEET_ID } from "./config.js";
import { loadSheet } from "./dashboard-base.js";

export function loadFunilComercial() {
    loadSheet(SHEET_ID, "'Funil-Comercial'!A1:D", "table-funil-comercial");
}