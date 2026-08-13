#!/usr/bin/env node
/**
 * リッチメニューをLINEに登録する。
 *
 *   SITE_URL=https://example.com \
 *   LINE_CHANNEL_ACCESS_TOKEN=xxxxx \
 *   npm run line:setup
 *
 * やること:
 *   1. 既存のリッチメニューを削除(--keep で残せる)
 *   2. line/richmenu.tiles.json から定義を作ってリッチメニューを作成
 *   3. line/richmenu.png をアップロード
 *   4. 全ユーザーのデフォルトメニューに設定
 *
 * --dry-run を付けるとAPIを呼ばず、送信予定の内容だけを表示する。
 *
 * トークンはチャネルアクセストークン(long-lived)。
 * LINE Developers > Messaging API設定 > チャネルアクセストークン から発行する。
 * リポジトリには絶対に書かないこと。
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const API = "https://api.line.me";
const API_DATA = "https://api-data.line.me";

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const KEEP_OLD = args.has("--keep");

const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim();
const SITE_URL = process.env.SITE_URL?.trim().replace(/\/+$/, "");

function die(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

if (!SITE_URL) die("SITE_URL が未設定です(例: SITE_URL=https://example.com)");
if (!/^https:\/\//.test(SITE_URL)) die(`SITE_URL は https で始まる必要があります: ${SITE_URL}`);
if (!TOKEN && !DRY_RUN) die("LINE_CHANNEL_ACCESS_TOKEN が未設定です");

// ---- 定義を組み立てる -------------------------------------------------

const def = JSON.parse(readFileSync(join(HERE, "richmenu.tiles.json"), "utf8"));
const { width, height, cols, rows } = def.size;

if (def.tiles.length !== cols * rows) {
  die(`タイル数(${def.tiles.length})が ${cols}×${rows} と一致しません`);
}

// 2500 は 3 で割り切れないので、最終列/最終行で端数を吸収する(原画側と同じ計算)
const colW = Array.from({ length: cols }, (_, i) =>
  i === cols - 1 ? width - Math.floor(width / cols) * (cols - 1) : Math.floor(width / cols)
);
const rowH = Array.from({ length: rows }, (_, i) =>
  i === rows - 1 ? height - Math.floor(height / rows) * (rows - 1) : Math.floor(height / rows)
);

const areas = def.tiles.map((tile, i) => {
  const c = i % cols;
  const r = Math.floor(i / cols);
  const action =
    tile.action.type === "uri"
      ? { type: "uri", label: tile.label.replace(/\n/g, ""), uri: `${SITE_URL}${tile.action.path}` }
      : { type: "message", label: tile.label.replace(/\n/g, ""), text: tile.action.text };
  return {
    bounds: {
      x: colW.slice(0, c).reduce((a, b) => a + b, 0),
      y: rowH.slice(0, r).reduce((a, b) => a + b, 0),
      width: colW[c],
      height: rowH[r],
    },
    action,
  };
});

const richMenu = {
  size: { width, height },
  selected: true, // トークを開いた時点でメニューを開いた状態にする
  name: def.name,
  chatBarText: def.chatBarText,
  areas,
};

// ---- 画像を確認する ---------------------------------------------------

const imgPath = join(HERE, "richmenu.png");
let image;
try {
  image = readFileSync(imgPath);
} catch {
  die(`${imgPath} がありません。先に npm run line:image を実行してください`);
}
if (image.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") die("richmenu.png がPNGではありません");
const imgW = image.readUInt32BE(16);
const imgH = image.readUInt32BE(20);
if (imgW !== width || imgH !== height) {
  die(`画像サイズが定義と違います: 画像 ${imgW}×${imgH} / 定義 ${width}×${height}`);
}
if (image.length > 1024 * 1024) {
  die(`画像が1MBを超えています(${Math.round(image.length / 1024)}KB)`);
}

console.log(`定義  : ${def.name} (${width}×${height}, ${def.tiles.length}エリア)`);
console.log(`画像  : ${Math.round(image.length / 1024)}KB`);
console.log(`リンク先:`);
areas.forEach((a, i) =>
  console.log(
    `  ${String(i + 1)}. ${def.tiles[i].label.replace(/\n/g, "")}`.padEnd(22) +
      (a.action.type === "uri" ? a.action.uri : `[メッセージ送信] ${a.action.text}`)
  )
);

if (DRY_RUN) {
  console.log("\n--dry-run のためAPIは呼びません。送信する定義:\n");
  console.log(JSON.stringify(richMenu, null, 2));
  process.exit(0);
}

// ---- API ---------------------------------------------------------------

async function line(method, url, { json, body, contentType } = {}) {
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...(contentType ? { "Content-Type": contentType } : {}),
    },
    body: json ? JSON.stringify(json) : body,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${method} ${url.replace(TOKEN, "***")} → ${res.status}\n${text}`);
  }
  return text ? JSON.parse(text) : {};
}

try {
  if (!KEEP_OLD) {
    const { richmenus = [] } = await line("GET", `${API}/v2/bot/richmenu/list`);
    for (const m of richmenus) {
      await line("DELETE", `${API}/v2/bot/richmenu/${m.richMenuId}`);
      console.log(`削除  : ${m.name} (${m.richMenuId})`);
    }
  }

  const { richMenuId } = await line("POST", `${API}/v2/bot/richmenu`, { json: richMenu });
  console.log(`作成  : ${richMenuId}`);

  await line("POST", `${API_DATA}/v2/bot/richmenu/${richMenuId}/content`, {
    body: image,
    contentType: "image/png",
  });
  console.log("画像  : アップロード完了");

  await line("POST", `${API}/v2/bot/user/all/richmenu/${richMenuId}`);
  console.log("既定  : 全ユーザーに設定完了");

  console.log("\n✓ 反映しました。LINEアプリでトークを開き直すと表示されます。");
} catch (e) {
  die(e.message);
}
