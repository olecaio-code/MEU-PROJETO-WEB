import { SHEET_ID } from "./config.js";
import { loadSheet } from "./dashboard-base.js";

export function loadPlanejamentoSemanal() {
  loadSheet(SHEET_ID, "'Planejamento-Semanal'!A1:E", "table-planejamento-semanal");
}