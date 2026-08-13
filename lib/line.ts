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

/**
 * 無料相談の日程調整ページ。
 * LINEのあいさつと「日程」キーワードへの自動返信で案内します。
 * 空にすると、URLを出さずトークで希望日時を聞く文面に切り替わります。
 */
export const BOOKING_URL = clean(
  process.env.NEXT_PUBLIC_BOOKING_URL || config.bookingUrl
);

/** 発信リンク(X / note)。空の項目はLPに表示されません。 */
export const SNS = {
  x: clean(config.snsX),
  note: clean(config.snsNote),
};
