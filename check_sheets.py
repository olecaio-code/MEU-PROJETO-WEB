import urllib.request
import json

SHEET_ID = "1TWukqSR6JrBoW23xX1xDKiNph4R1NlK4OOLAzmL1VAA"
API_KEY = "AIzaSyBG3wqjDh5BqucfBzQmkiX2zGMKb2rRDLQ"

# Get metadata
url = f"https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}?key={API_KEY}"
try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode())
        print("Sheet names in this spreadsheet:")
        print("=" * 50)
        if "sheets" in data:
            for sheet in data["sheets"]:
                title = sheet["properties"]["title"]
                sheet_id = sheet["properties"]["sheetId"]
                print(f"  - '{title}' (gid: {sheet_id})")
except Exception as e:
    print(f"Error: {e}")
