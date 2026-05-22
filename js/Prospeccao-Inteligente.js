import { SHEET_ID } from "./config.js";
import { loadSheet } from "./dashboard-base.js";

export function loadProspecaoInteligente() {
    loadSheet(SHEET_ID, "'Prospeccao-Inteligente'!A1:E", "table-prospeccao-inteligente");
}