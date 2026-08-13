import config from "@/legal.config.json";
import { SITE_URL } from "@/lib/line";

/**
 * 特定商取引法に基づく表記 / プライバシーポリシーで使う事業者情報。
 * 実体は legal.config.json にあります。
 *
 * 空欄の項目は公開してはいけないので、ページ側で「要記入」と表示し、
 * 冒頭にも警告を出します(MISSING_FIELDS を参照)。
 */
export const LEGAL = { ...config, siteUrl: SITE_URL };

/** 公開前に必ず埋める必要がある項目 */
const REQUIRED = [
  ["businessName", "販売事業者(氏名)"],
  ["operator", "運営統括責任者"],
  ["email", "メールアドレス"],
  ["paymentMethods", "支払方法"],
] as const;

export const MISSING_FIELDS = REQUIRED.filter(
  ([key]) => !String(config[key] ?? "").trim()
).map(([, label]) => label);

/** 未記入なら「要記入」のマークを返す。ページ側で赤字表示する */
export function field(value: string) {
  const v = String(value ?? "").trim();
  return v ? { text: v, missing: false } : { text: "要記入", missing: true };
}
