import { SHEET_ID } from "./config.js";
import { loadSheet } from "./dashboard-base.js";

export function loadProcessoMetropoles() {
  loadSheet(SHEET_ID, "'Processo-Metropoles'!A1:H", "table-processo-metropoles");
}