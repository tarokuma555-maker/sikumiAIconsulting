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
  {
    name: "適職みつかる.com",
    desc: "診断結果から、自分に合った求人や転職サービスを提案するアプリ",
    url: "https://tekishoku-mitsukaru.com/",
  },
  {
    name: "今の会社、続けるといくら損？",
    desc: "いまの会社に居続けた場合の生涯収入の差を試算するアプリ",
    url: "https://life-plan-app.vercel.app/",
  },
  {
    name: "MoguMogu",
    desc: "離乳食のレシピを月齢や食材から検索できるアプリ",
    url: "https://mogumogu-omega.vercel.app/",
  },
];
