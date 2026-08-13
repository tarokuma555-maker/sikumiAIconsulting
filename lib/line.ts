import config from "@/site.config.json";

/**
 * サイトとLINEのURL。
 *
 * 値は site.config.json にあります。変更したいときはそちらを直してください。
 * Vercelの環境変数を設定した場合は、環境変数が優先されます。
 *   NEXT_PUBLIC_SITE_URL … 公開サイトのURL
 *   NEXT_PUBLIC_LINE_URL … LINE公式アカウントの友だち追加URL
 * (環境変数はビルド時に埋め込まれるため、変更したら再デプロイが必要です)
 */
const clean = (v: string) => v.trim().replace(/\/+$/, "");

/** 公開サイトのURL(末尾スラッシュなし)。LINEのメッセージからLPへリンクするのに使います。 */
export const SITE_URL = clean(process.env.NEXT_PUBLIC_SITE_URL || config.siteUrl);

/**
 * LINE公式アカウントの友だち追加URL。
 * 未設定の場合、LPのLINE導線は表示されません(リンク切れを出さないため)。
 */
export const LINE_URL = clean(process.env.NEXT_PUBLIC_LINE_URL || config.lineUrl);

/** 申し込み完了後にLINEへ自動遷移するまでの秒数。0にすると自動遷移しません。 */
export const LINE_AUTO_REDIRECT_SEC = 5;
