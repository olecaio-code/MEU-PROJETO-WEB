import { SHEET_ID } from "./config.js";
import { loadSheet } from "./dashboard-base.js";

export function loadMetasMensais() {
    loadSheet(SHEET_ID, "'Metas-Mensais'!A1:E", "table-metas-mensais");
}