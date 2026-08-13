import type { Metadata } from "next";
import { LEGAL, field } from "@/lib/legal";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記|シクミAIコンサル",
  description: "シクミAIコンサルの特定商取引法に基づく表記です。",
};

/**
 * 価格はLP(app/page.tsx のプランセクション)と揃える必要があります。
 * 料金を変更したときは両方直してください。
 */
const ROWS: { label: string; value: React.ReactNode }[] = [
  { label: "販売事業者", value: <Field v={LEGAL.businessName} /> },
  { label: "運営統括責任者", value: <Field v={LEGAL.operator} /> },
  { label: "屋号・サービス名", value: LEGAL.tradeName },
  { label: "所在地", value: LEGAL.addressDisclosure },
  { label: "電話番号", value: LEGAL.phoneDisclosure },
  { label: "メールアドレス", value: <Field v={LEGAL.email} /> },
  { label: "販売URL", value: LEGAL.siteUrl || "—" },
  {
    label: "販売価格",
    value: (
      <>
        講座プラン:29,800円(税込・買い切り)
        <br />
        伴走プラン:総額150,000円(税込・3ヶ月/月額50,000円×3回)
        <br />
        <span className="legal-note">
          対象業務が複雑な場合は、上位プラン(総額240,000円〜・税込)をご提案することがあります。
          いずれの場合も金額は無料相談時に確定してお伝えし、開始後に追加請求することはありません。
          分割払いのご相談も承ります。
        </span>
      </>
    ),
  },
  {
    label: "商品代金以外に必要な料金",
    value: (
      <>
        インターネット接続料金・通信料金はお客様のご負担となります。
        <br />
        また、受講にあたりAIサービス(Claude等)のご契約が必要になる場合があり、
        その利用料はお客様のご負担となります。
      </>
    ),
  },
  { label: "支払方法", value: <Field v={LEGAL.paymentMethods} /> },
  { label: "支払時期", value: LEGAL.paymentTiming },
  {
    label: "役務の提供時期",
    value: (
      <>
        講座プラン:お支払いの確認後、3営業日以内に教材の閲覧方法をメールでご案内します。
        <br />
        伴走プラン:お支払いの確認後、日程を調整のうえセッションを開始します。
      </>
    ),
  },
  {
    label: "返品・キャンセルについて",
    value: (
      <>
        <strong>講座プラン(デジタル教材)</strong>
        <br />
        商品の性質上、教材の閲覧を開始された後の返金はお受けできません。
        閲覧開始前であれば、お支払い後8日以内のお申し出に限り全額を返金します。
        <br />
        <br />
        <strong>伴走プラン(継続サービス)</strong>
        <br />
        最低契約期間は3ヶ月です。4ヶ月目以降は、解約をご希望の月の前月末日までに
        ご連絡いただくことで、翌月以降の契約を終了できます。
        お支払い済みの当月分および契約期間中の料金の返金はお受けできません。
        <br />
        <br />
        <span className="legal-note">
          当方の責めに帰すべき事由によりサービスを提供できなかった場合は、
          この限りではありません。個別にご返金等の対応をいたします。
        </span>
      </>
    ),
  },
  {
    label: "動作環境",
    value: (
      <>
        インターネットに接続されたパソコン(Windows または macOS)
        <br />
        オンラインセッションにはGoogle Meetを使用します。
      </>
    ),
  },
];

function Field({ v }: { v: string }) {
  const f = field(v);
  return f.missing ? <span className="legal-missing">{f.text}</span> : <>{f.text}</>;
}

export default function Tokushoho() {
  return (
    <>
      <h1>特定商取引法に基づく表記</h1>
      <dl className="legal-dl">
        {ROWS.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="legal-updated">最終改定日:{LEGAL.effectiveDate}</p>
    </>
  );
}
