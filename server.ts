import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Route to fetch match data from Google Sheets (Publicly published or Apps Script)
// Helper to extract the spreadsheet ID regardless of whether the user passed the ID itself,
// a full standard spreadsheet URL, or a full published pubhtml URL.
function extractSheetId(input: string): { id: string; isPublished: boolean } {
  const cleanInput = input.trim();
  if (cleanInput.startsWith("http://") || cleanInput.startsWith("https://")) {
    const publishedMatch = cleanInput.match(/\/spreadsheets\/d\/e\/([A-Za-z0-9_-]+)/);
    if (publishedMatch) {
      return { id: publishedMatch[1], isPublished: true };
    }
    const standardMatch = cleanInput.match(/\/spreadsheets\/d\/([A-Za-z0-9_-]+)/);
    if (standardMatch) {
      return { id: standardMatch[1], isPublished: false };
    }
  }
  if (cleanInput.startsWith("2PACX-")) {
    return { id: cleanInput, isPublished: true };
  }
  return { id: cleanInput, isPublished: false };
}

// Check if raw fetch data is valid CSV format and not Google Login/Permission HTML block page
function isValidCsv(data: any): boolean {
  if (typeof data !== "string") return false;
  const trimmed = data.trim();
  if (trimmed.length === 0) return false;
  if (
    trimmed.startsWith("<!DOCTYPE") ||
    trimmed.startsWith("<html") ||
    trimmed.startsWith("<xml") ||
    trimmed.includes("Google Accounts") ||
    trimmed.includes("Service Login") ||
    trimmed.includes("docs-signin") ||
    trimmed.includes("Sign in - Google Accounts")
  ) {
    return false;
  }
  return true;
}

app.get("/api/matches", async (req, res) => {
  try {
    const spreadsheetId = process.env.VITE_GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_ID;
    const appsScriptUrl = process.env.VITE_APPS_SCRIPT_URL || process.env.APPS_SCRIPT_URL;

    if (!spreadsheetId && !appsScriptUrl) {
      return res.status(400).json({ 
        error: "환경 변수 설정이 필요합니다 (시트 ID 또는 Apps Script URL).",
        debug: { hasSpreadsheetId: !!spreadsheetId, hasAppsScriptUrl: !!appsScriptUrl }
      });
    }

    let rawData: any[] = [];
    let fetchSource = "";
    let fetchedDataString = "";
    let fetchSuccess = false;

    // 1. Try Apps Script if and only if it looks like a valid active Web App deployment url
    if (appsScriptUrl && appsScriptUrl.includes("/exec")) {
      try {
        console.log(`[Matches API] Attempting Apps Script fetch: ${appsScriptUrl}`);
        const response = await axios.get(appsScriptUrl, { timeout: 8000 });
        if (response.status === 200 && response.data) {
          const parsedData = Array.isArray(response.data) ? response.data : (response.data.data || []);
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            rawData = parsedData;
            fetchSource = "Apps Script";
            fetchSuccess = true;
            console.log(`[Matches API] Success with Apps Script! Rows: ${rawData.length}`);
          }
        }
      } catch (err: any) {
        console.warn(`[Matches API] Apps Script fetch failed/ignored: ${err.message}. Proceeding to Google Sheet ID...`);
      }
    }

    // 2. Cascade fallback to fetching from Google Sheet CSV
    if (!fetchSuccess && spreadsheetId) {
      const { id, isPublished } = extractSheetId(spreadsheetId);
      let urlsToTry: { url: string; description: string }[] = [];

      if (isPublished) {
        urlsToTry = [
          { url: `https://docs.google.com/spreadsheets/d/e/${id}/pub?output=csv`, description: "Published Web CSV" },
          { url: `https://docs.google.com/spreadsheets/d/e/${id}/pub?gid=0&single=true&output=csv`, description: "Published Web CSV (gid=0)" }
        ];
      } else {
        urlsToTry = [
          // 1. Google Visualization API CSV: Incredibly robust and bypassing bot and browser redirect limits for open sheets
          { url: `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv`, description: "Google Charts API CSV" },
          { url: `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=%EC%A0%84%EC%A0%81`, description: "Google Charts API CSV (sheet=전적)" },
          // 2. Published CSV URL (acting like a published sheet)
          { url: `https://docs.google.com/spreadsheets/d/e/${id}/pub?output=csv`, description: "Published CSV representation" },
          // 3. Normal CSV exports
          { url: `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`, description: "Standard Export CSV (No gid)" },
          { url: `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=0`, description: "Standard Export CSV (gid=0)" },
          { url: `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&sheet=%EC%A0%84%EC%A0%81`, description: "Standard Export CSV (sheet=전적)" }
        ];
      }

      console.log(`[Matches API] Sheet ID parsed: ${id} (isPublished: ${isPublished}). Commencing cascading fetches...`);
      
      let lastErrorMessage = "";

      for (const attempt of urlsToTry) {
        try {
          console.log(`[Matches API] Trying fetch via: ${attempt.description} (${attempt.url})`);
          const response = await axios.get(attempt.url, { timeout: 8000 });
          
          if (response.status === 200 && isValidCsv(response.data)) {
            fetchedDataString = response.data;
            fetchSource = attempt.description;
            fetchSuccess = true;
            console.log(`[Matches API] Success with ${attempt.description}! Raw characters received: ${fetchedDataString.length}`);
            break;
          } else {
            console.warn(`[Matches API] Got response but it failed validation (possibly HTML or too short) for ${attempt.description}`);
          }
        } catch (err: any) {
          console.warn(`[Matches API] Failed attempt with ${attempt.description}: ${err.message}`);
          lastErrorMessage = err.message;
        }
      }

      if (!fetchSuccess) {
        return res.status(403).json({
          error: "구글 시트 연동을 완료하지 못했습니다.",
          details: `설정된 시트 정보 또는 권한 문제일 수 있습니다. (마지막 에러: ${lastErrorMessage})`,
          debug: { id, isPublished, urlsTriedCount: urlsToTry.length }
        });
      }

      // Parse fetched CSV string
      const lines = fetchedDataString.split(/\r?\n/);
      rawData = lines.map((line: string) => {
        return line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((cell: string) => {
          return cell.replace(/^"(.*)"$/, "$1").trim();
        });
      });
    }

    console.log(`[Matches API] Successfully fetched from ${fetchSource}. Total parsed csv rows: ${rawData.length}`);

    if (!Array.isArray(rawData)) {
      console.error("Invalid data format received:", rawData);
      return res.status(500).json({ error: "데이터 형식이 올바르지 않습니다." });
    }

    // Filter and map out matches (skip header dynamically, handles row size safely)
    const matches = rawData.filter(row => {
      if (!row || row.length < 8) return false;
      const firstCol = String(row[0]).trim();
      // Drop column headers
      if (!firstCol || firstCol === "matchId" || firstCol.toLowerCase().includes("매치") || firstCol.includes("매치 ID")) {
        return false;
      }
      return true;
    }).map((row) => {
      const parseSafe = (val: any) => {
        if (val === undefined || val === null) return 0;
        const n = parseInt(String(val).replace(/,/g, ""));
        return isNaN(n) ? 0 : n;
      };

      const trimSafe = (val: any) => {
        if (val === undefined || val === null) return "";
        return String(val).trim();
      };

      const championName = trimSafe(row[7]);
      
      return {
        matchId: trimSafe(row[0]) || "Unknown",
        gameNum: parseSafe(row[1]),
        duration: parseSafe(row[2]),
        teamName: trimSafe(row[3]) || "Unknown",
        isWin: trimSafe(row[4]) === "승리" || trimSafe(row[4]) === "true" || trimSafe(row[4]) === "승",
        position: trimSafe(row[5]) || "Unknown",
        playerName: trimSafe(row[6]) || "Unknown",
        championName: championName,
        championId: championName,
        cs: parseSafe(row[8]),
        kills: parseSafe(row[9]),
        deaths: parseSafe(row[10]),
        assists: parseSafe(row[11]),
        damage: parseSafe(row[12]),
        gold: parseSafe(row[13]),
      };
    });

    console.log(`[Matches API] Parsed matches count: ${matches.length}`);

    // If matches count is 0, provide first 3 CSV rows as a troubleshoot guide in the debug object
    if (matches.length === 0 && rawData.length > 0) {
      console.warn("[Matches API] Matches count is 0. Returning debug data.");
      return res.status(200).json({
        warning: "매치 데이터를 하나도 파싱하지 못했습니다. 시트의 컬럼 순서나 컬럼명을 확인하세요.",
        sampleRows: rawData.slice(0, 3)
      });
    }

    res.json(matches);
  } catch (error: any) {
    console.error("Error fetching data:", error);
    res.status(500).json({ 
      error: "데이터를 불러오는데 실패했습니다. 시트 공유 설정을 확인하세요.", 
      details: error.message,
      stack: error.stack?.substring(0, 200)
    });
  }
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupVite().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
