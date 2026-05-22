#!/usr/bin/env python3
"""
Script para extrair informações do arquivo OAuth e gerar config.js
"""

import json

# Ler o arquivo OAuth
with open('API Google Sheets.json', 'r', encoding='utf-8') as f:
    oauth_data = json.load(f)

installed = oauth_data.get('installed', {})

print("=" * 70)
print("INFORMAÇÕES EXTRAÍDAS DO ARQUIVO OAuth")
print("=" * 70)
print()
print(f"Client ID: {installed.get('client_id', 'NÃO ENCONTRADO')}")
print(f"Client Secret: {installed.get('client_secret', 'NÃO ENCONTRADO')}")
print(f"Project ID: {installed.get('project_id', 'NÃO ENCONTRADO')}")
print(f"Auth URI: {installed.get('auth_uri', 'NÃO ENCONTRADO')}")
print(f"Token URI: {installed.get('token_uri', 'NÃO ENCONTRADO')}")
print()
print("=" * 70)
print()
print("Para usar com Google Sheets API, você pode gerar uma chave de")
print("Serviço (Service Account Key) em:")
print("https://console.cloud.google.com/iam-admin/serviceaccounts")
print()
print("Ou usar OAuth 2.0 com o arquivo acima!")
print()
