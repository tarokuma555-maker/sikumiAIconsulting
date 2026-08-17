import type { Metadata, Viewport } from "next";
import { Zen_Old_Mincho, Zen_Kaku_Gothic_New, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const mincho = Zen_Old_Mincho({
  weight: ["500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: false,
});

const gothic = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: false,
});

const mono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "シクミAIコンサル|コードは書けない。でも、仕事は自動化できる。",
  description:
    "非エンジニアのビジネス職のための、AI・Claude Code伴走型スクール。あなたの実際の業務を題材に、3ヶ月で業務自動化を1つ完成させます。",
  openGraph: {
    title: "シクミAIコンサル|コードは書けない。でも、仕事は自動化できる。",
    description:
      "非エンジニアのビジネス職のための、AI・Claude Code伴走型スクール。3ヶ月で業務自動化を1つ完成させます。",
    type: "website",
    locale: "ja_JP",
    siteName: "シクミAIコンサル",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // ピンチズームは潰さない(アクセシビリティ上、拡大は常に許可する)
  maximumScale: 5,
  themeColor: "#F5F7F9",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className={`${mincho.variable} ${gothic.variable} ${mono.variable}`}>
        {/* オープニング演出は同じ訪問中1回だけ。描画前にクラスを付けたいので
            インラインで先に実行する(遅らせると一瞬だけ幕が見えてしまう) */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              // アンカー付き(リッチメニューの /#plans など)で来た人は、
              // 目的のセクションが幕で隠れてしまうので演出を出さない
              // js クラスは「段階的に出す」演出の前提。付いていない(=JSが動かない)
              // 環境では、隠さず最初から全部見えるようにCSS側で分岐している
              "document.documentElement.classList.add('js');" +
              "try{if(location.hash||sessionStorage.getItem('intro'))document.documentElement.classList.add('intro-skip')}catch(e){if(location.hash)document.documentElement.classList.add('intro-skip')}",
          }}
        />
        {children}
      </body>
    </html>
  );
}
