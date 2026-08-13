#!/usr/bin/env node
/**
 * リッチメニュー画像(line/richmenu.png)を作り直す。
 *
 *   npm run dev          # 別のターミナルで先に起動しておく
 *   npm run line:image
 *
 * /line-richmenu をそのままスクリーンショットするだけなので、
 * LPと同じフォント(Zen Old Mincho など)で描かれる。
 * 文言やリンク先は line/richmenu.tiles.json で変更する。
 *
 * Playwrightが必要(初回のみ):
 *   npm i -D playwright && npx playwright install chromium
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = (process.env.PREVIEW_URL || "http://localhost:3000").replace(/\/+$/, "");
const OUT = join(HERE, "richmenu.png");

const { width, height } = JSON.parse(
  readFileSync(join(HERE, "richmenu.tiles.json"), "utf8")
).size;

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error(
    "\n✗ playwright が見つかりません。次を実行してください:\n" +
      "    npm i -D playwright && npx playwright install chromium\n"
  );
  process.exit(1);
}

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1, // LINEに渡すのは等倍の2500×1686
  });
  const page = await ctx.newPage();
  const url = `${BASE}/line-richmenu`;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
  } catch {
    console.error(`\n✗ ${url} を開けませんでした。先に npm run dev で起動してください。\n`);
    process.exit(1);
  }
  await page.evaluate(async () => {
    await document.fonts.ready; // Webフォント待ち。抜けると別フォントで焼き付く
  });
  await page.waitForTimeout(800);

  const art = await page.$("#artwork");
  if (!art) {
    console.error("\n✗ #artwork が見つかりません。app/line-richmenu を確認してください。\n");
    process.exit(1);
  }
  const box = await art.boundingBox();
  if (Math.round(box.width) !== width || Math.round(box.height) !== height) {
    console.error(
      `\n✗ 原画のサイズが違います: ${Math.round(box.width)}×${Math.round(box.height)} ` +
        `(期待値 ${width}×${height})\n`
    );
    process.exit(1);
  }
  await art.screenshot({ path: OUT });

  const kb = Math.round(readFileSync(OUT).length / 1024);
  console.log(`✓ ${OUT}`);
  console.log(`  ${width}×${height} / ${kb}KB (上限1024KB)`);
  console.log("  次: npm run line:setup でLINEに反映");
} finally {
  await browser.close();
}
