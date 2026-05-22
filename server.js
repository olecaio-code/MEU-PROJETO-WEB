// filepath: c:\Users\Caio Bruno Corrêa\OneDrive\Área de Trabalho\meu-projeto-web\server.js
/**
 * Servidor Node.js para acessar Google Sheets com OAuth 2.0
 * Soluciona o problema de CORS, leitura e edição de células.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const { google } = require('googleapis');

const CREDENTIALS_PATH = path.join(__dirname, 'API Google Sheets.json');
const TOKEN_PATH = path.join(__dirname, 'token.json');
const SHEET_ID = '1TWukqSR6JrBoW23xX1xDKiNph4R1NlK4OOLAzmL1VAA';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
const oauthConfig = credentials.web || credentials.installed || credentials;
const redirectUris = oauthConfig.redirect_uris || oauthConfig.redirectUris || [];
const redirectUri = redirectUris.find(uri => uri.includes(':3000')) || redirectUris[0] || 'http://localhost:3000/oauth2callback';
const oauth2Client = new google.auth.OAuth2(
  oauthConfig.client_id,
  oauthConfig.client_secret,
  redirectUri
);

oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    const currentTokens = fs.existsSync(TOKEN_PATH)
      ? JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'))
      : {};
    const mergedTokens = { ...currentTokens, ...tokens };
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(mergedTokens, null, 2));
    console.log('Token OAuth atualizado em token.json.');
  }
});

if (fs.existsSync(TOKEN_PATH)) {
  try {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    oauth2Client.setCredentials(token);
    console.log('Token OAuth carregado com sucesso.');
  } catch (error) {
    console.warn('Falha ao carregar token OAuth:', error.message);
  }
} else {
  console.log('token.json não encontrado. Acesse /auth para autorizar o aplicativo.');
}

const sheets = google.sheets({ version: 'v4', auth: oauth2Client });

function createCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function normalizeSheetName(sheetName) {
  return sheetName.replace(/\s+/g, '-');
}

function normalizeRange(range) {
  const quotedMatch = range.match(/^'(.+)'!(.+)$/);
  if (quotedMatch) {
    const sheetName = normalizeSheetName(quotedMatch[1]);
    return `'${sheetName}'!${quotedMatch[2]}`;
  }

  const match = range.match(/^([^!]+)!(.+)$/);
  if (match) {
    const sheetName = normalizeSheetName(match[1]);
    return `${sheetName}!${match[2]}`;
  }

  return range;
}

const server = http.createServer(async (req, res) => {
  createCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const code = parsedUrl.searchParams.get('code');
  const oauthError = parsedUrl.searchParams.get('error');

  if (oauthError) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end(`<h1>Autorização negada</h1><p>${oauthError}</p>`);
    return;
  }

  if (pathname === '/auth') {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: SCOPES,
    });

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>Autorizar Google Sheets</h1>
      <p>Clique para autorizar o acesso à planilha:</p>
      <a href="${authUrl}" target="_blank">Autorizar Google Sheets</a>
      <p>Se o Google redirecionar para <strong>http://localhost</strong>, recarregue esta página para concluir.</p>
    `);
    return;
  }

  if (code && (pathname === '/oauth2callback' || pathname === '/' || pathname === '')) {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end('<h1>Autorizado</h1><p>O token foi salvo em token.json. Feche esta aba e recarregue o dashboard.</p>');
    } catch (error) {
      console.error('Erro ao trocar o código por token:', error);
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`<h1>Erro</h1><p>${error.message}</p>`);
    }

    return;
  }

  if (pathname === '/api/sheets/update' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const range = body.range;
      const value = body.value;

      if (!range || value === undefined) {
        sendJson(res, 400, { error: 'Campos obrigatórios: range e value.' });
        return;
      }

      const normalizedRange = normalizeRange(range);
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: normalizedRange,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[value]],
        },
      });

      sendJson(res, 200, response.data);
    } catch (error) {
      console.error('Erro ao salvar no Google Sheets:', error);
      sendJson(res, 500, { error: error.message });
    }
    return;
  }

  if (pathname === '/api/sheets/append' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const sheetName = body.sheetName;
      const values = body.values;

      if (!sheetName || !Array.isArray(values) || values.length === 0) {
        sendJson(res, 400, { error: 'Campos obrigatórios: sheetName e values.' });
        return;
      }

      const normalizedSheetName = normalizeSheetName(sheetName);
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${normalizedSheetName}!A1`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values,
        },
      });

      sendJson(res, 200, response.data);
    } catch (error) {
      console.error('Erro ao adicionar linha no Google Sheets:', error);
      sendJson(res, 500, { error: error.message });
    }
    return;
  }

  if (pathname === '/api/sheets/delete' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const sheetName = body.sheetName;
      const rowNumber = Number(body.rowNumber);

      if (!sheetName || Number.isNaN(rowNumber) || rowNumber < 1) {
        sendJson(res, 400, { error: 'Campos obrigatórios: sheetName e rowNumber válidos.' });
        return;
      }

      const normalizedSheetName = normalizeSheetName(sheetName);
      const sheetResponse = await sheets.spreadsheets.get({
        spreadsheetId: SHEET_ID,
        ranges: [`${normalizedSheetName}`],
        includeGridData: false,
        fields: 'sheets.properties.sheetId,sheets.properties.title'
      });

      const sheet = (sheetResponse.data.sheets || []).find(s => s.properties.title === normalizedSheetName);
      if (!sheet) {
        sendJson(res, 404, { error: 'Aba não encontrada.' });
        return;
      }

      const response = await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SHEET_ID,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: sheet.properties.sheetId,
                  dimension: 'ROWS',
                  startIndex: rowNumber - 1,
                  endIndex: rowNumber
                }
              }
            }
          ]
        }
      });

      sendJson(res, 200, response.data);
    } catch (error) {
      console.error('Erro ao excluir linha no Google Sheets:', error);
      sendJson(res, 500, { error: error.message });
    }
    return;
  }

  if (pathname.startsWith('/api/sheets/') && req.method === 'GET') {
    const range = decodeURIComponent(pathname.replace('/api/sheets/', ''));

    try {
      const normalizedRange = normalizeRange(range);
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: normalizedRange,
      });

      sendJson(res, 200, response.data);
    } catch (error) {
      console.error('Erro ao ler dados do Google Sheets:', error);
      sendJson(res, 403, { error: error.message });
    }
    return;
  }

  if (pathname === '/' || pathname === '') {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('404 Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  const filePath = path.join(__dirname, pathname);
  const ext = path.extname(filePath);

  if (ext === '.js') {
    res.setHeader('Content-Type', 'application/javascript');
  } else if (ext === '.json') {
    res.setHeader('Content-Type', 'application/json');
  } else if (ext === '.css') {
    res.setHeader('Content-Type', 'text/css');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('404');
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

server.listen(3000, () => {
  console.log('Servidor iniciado em http://localhost:3000');
  console.log('Acesse sua aplicação em: http://localhost:3000');
  console.log('Se necessário, abra http://localhost:3000/auth para autorizar o acesso ao Google Sheets.');
});
