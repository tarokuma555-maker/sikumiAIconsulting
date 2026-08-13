/**
 * LINE公式アカウントのURL。
 *
 * 設定方法は2通りあります(どちらか一方でOK)。
 *   1. Vercelの環境変数 NEXT_PUBLIC_LINE_URL に設定する(推奨。再デプロイで反映)
 *   2. 下の FALLBACK_LINE_URL に直接書く
 * 両方ある場合は環境変数が優先されます。
 *
 * 入れる値は「友だち追加」用のURLです。例:
 *   https://lin.ee/xxxxxxx        (LINE Official Account Manager の友だち追加URL)
 *   https://line.me/R/ti/p/@xxxxx (ベーシックIDを使う形式)
 *
 * 未設定の場合、LINEへの導線は表示されません(リンク切れを出さないため)。
 */
const FALLBACK_LINE_URL = "https://lin.ee/Wh4KvwQ";

export const LINE_URL = (
  process.env.NEXT_PUBLIC_LINE_URL || FALLBACK_LINE_URL
).trim();

/** 申し込み完了後にLINEへ自動遷移するまでの秒数。0にすると自動遷移しません。 */
export const LINE_AUTO_REDIRECT_SEC = 5;

/**
 * 公開サイトのURL(末尾スラッシュなし)。
 * LINEのメッセージからLPへリンクするときに使います。
 * Vercelの環境変数 NEXT_PUBLIC_SITE_URL に本番URLを設定してください。
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "")
  .trim()
  .replace(/\/+$/, "");
