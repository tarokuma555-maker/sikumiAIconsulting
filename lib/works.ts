/**
 * 講師が実際にAIで作ったもの(講師紹介セクションの実績カード)。
 *
 * 追加するときはこの配列に足すだけです。カードは自動で並びます。
 * 表示順はこの配列の順番。モバイルでは縦積みになります。
 */
export type Work = {
  name: string;
  desc: string;
  url: string;
  /** カードに出すタグ。省略時は「Claude Codeで開発」 */
  tag?: string;
};

export const WORKS: Work[] = [
  {
    name: "Tedori",
    desc: "手取り額と転職シミュレーションができるiOS給与計算アプリ",
    url: "https://tedori-web.vercel.app/",
  },
  {
    name: "サロン予約台帳",
    desc: "美容サロン向け予約管理SaaS(LINE通知連携)",
    url: "https://salon-ledger.vercel.app/guide",
  },
  {
    name: "anime-trips",
    desc: "アニメの聖地巡礼をサポートするアプリ",
    url: "https://www.anime-trips.com/",
  },
];
