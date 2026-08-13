import type { Metadata } from "next";
import { RICH_MENU_TILES, RICH_MENU_SIZE } from "@/lib/richmenu";

/**
 * リッチメニュー画像の原画。
 *
 * LINEに登録する画像(2500×1686)をこのページとして描き、
 * Playwrightでスクリーンショットして line/richmenu.png を作る。
 * HTMLで作ることで、LP本体と同じフォント(Zen Old Mincho / Zen Kaku Gothic New /
 * IBM Plex Mono)がそのまま使える。
 *
 * 文言やリンク先を変えたいときは lib/richmenu.ts を編集し、
 *   npm run line:image     画像を作り直す
 *   npm run line:setup     LINEに反映する
 * の順に実行する。
 *
 * 検索避けのため noindex。デプロイされても実害はないが、
 * 不要なら app/line-richmenu/ ごと削除してよい(画像は生成済みのため)。
 */
export const metadata: Metadata = {
  title: "リッチメニュー原画",
  robots: { index: false, follow: false },
};

const { width: W, height: H, cols: COLS, rows: ROWS } = RICH_MENU_SIZE;

const ICONS: Record<string, React.ReactNode> = {
  talk: (
    <>
      <path d="M6 10h36v22H20l-9 8v-8H6z" />
      <path d="M15 18h18M15 25h12" />
    </>
  ),
  form: (
    <>
      <path d="M11 5h19l7 7v31H11z" />
      <path d="M30 5v7h7" />
      <path d="M17 24h14M17 32h9" />
    </>
  ),
  price: (
    <>
      <path d="M24 6 8 22v20h32V22z" />
      <path d="M18 26l6 7 6-7M24 33v8M19 37h10" />
    </>
  ),
  service: (
    <>
      <path d="M5 9h16v13H5zM27 9h16v13H27zM5 27h16v13H5zM27 27h16v13H27z" />
    </>
  ),
  faq: (
    <>
      <circle cx="24" cy="24" r="18" />
      <path d="M19 19a5 5 0 1 1 5 6v3" />
      <circle cx="24" cy="34" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  teacher: (
    <>
      <circle cx="24" cy="16" r="8" />
      <path d="M9 42c0-8 6.7-13 15-13s15 5 15 13" />
    </>
  ),
};

export default function RichMenuArtwork() {
  const colW = Array.from({ length: COLS }, (_, i) =>
    // 2500 は 3 で割り切れないので、最後の列で端数を吸収する
    i === COLS - 1 ? W - Math.floor(W / COLS) * (COLS - 1) : Math.floor(W / COLS)
  );
  const rowH = Math.floor(H / ROWS);

  return (
    <div
      id="artwork"
      style={{
        width: W,
        height: H,
        display: "grid",
        gridTemplateColumns: colW.map((w) => `${w}px`).join(" "),
        gridTemplateRows: `repeat(${ROWS}, ${rowH}px)`,
        background: "#F5F7F9",
        backgroundImage:
          "linear-gradient(#DCE5EC 2px, transparent 2px), linear-gradient(90deg, #DCE5EC 2px, transparent 2px)",
        backgroundSize: "62px 62px",
        overflow: "hidden",
      }}
    >
      {RICH_MENU_TILES.map((tile, i) => {
        const accent = tile.accent;
        return (
          <div
            key={tile.key}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 44,
              background: accent ? "#FFF6E6" : "rgba(255,255,255,.72)",
              // スマホ実機では2500px幅の画像が約390pxに縮む(約1/6.4)。
              // 罫線3pxでは0.5px相当で消えるため、6pxにして1px弱を確保する
              borderRight: (i + 1) % COLS === 0 ? "none" : "6px solid #C3D2DE",
              borderBottom: i < COLS ? "6px solid #C3D2DE" : "none",
              boxShadow: accent ? "inset 0 0 0 10px #E8A33D" : "none",
            }}
          >
            <svg
              width={182}
              height={182}
              viewBox="0 0 48 48"
              fill="none"
              stroke={accent ? "#B97A14" : "#24457F"}
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {ICONS[tile.icon]}
            </svg>
            <div
              style={{
                // 実機で約15px相当。英字キャプションは4px相当で判読できないため置かない
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 98,
                lineHeight: 1.3,
                letterSpacing: ".02em",
                color: "#0F1D33",
                textAlign: "center",
                whiteSpace: "pre-line",
              }}
            >
              {tile.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
