import type { Metadata } from "next";
import { LEGAL, field } from "@/lib/legal";

export const metadata: Metadata = {
  title: "プライバシーポリシー|シクミAIコンサル",
  description: "シクミAIコンサルにおける個人情報の取り扱いについて。",
};

function Email() {
  const f = field(LEGAL.email);
  return f.missing ? <span className="legal-missing">{f.text}</span> : <>{f.text}</>;
}

export default function Privacy() {
  return (
    <>
      <h1>プライバシーポリシー</h1>
      <p className="legal-lead">
        {LEGAL.tradeName}(以下「当方」)は、本サービスの提供にあたり取得する個人情報を、
        以下の方針にもとづいて取り扱います。
      </p>

      <h2>1. 取得する情報</h2>
      <p>
        当ウェブサイト上に入力フォームは設置していません。個人情報は、以下の外部サービスを
        通じてお客様が自らご提供いただいた場合にのみ取得します。
      </p>
      <ul>
        <li>
          <strong>無料相談のご予約(Googleカレンダーの予約ページ)</strong>
          <br />
          お名前、メールアドレス、ご記入いただいた相談内容
        </li>
        <li>
          <strong>LINE公式アカウント</strong>
          <br />
          LINEの表示名、アイコン、当方が発行するユーザーID、トークでやりとりした内容
          <br />
          <span className="legal-note">
            当方がお客様の電話番号やLINE IDを取得することはありません。
          </span>
        </li>
        <li>
          <strong>メールでのお問い合わせ</strong>
          <br />
          メールアドレス、お問い合わせ内容
        </li>
      </ul>

      <h2>2. 利用目的</h2>
      <ul>
        <li>無料相談の日程調整およびご連絡</li>
        <li>お問い合わせへの回答</li>
        <li>サービスの提供、および提供にあたって必要な連絡</li>
        <li>お申し込みいただいた場合の契約手続きおよび料金請求</li>
      </ul>
      <p>
        ご本人の同意なく、上記以外の目的で利用することはありません。
        営業目的で繰り返しご連絡することもいたしません。
      </p>

      <h2>3. 第三者への提供</h2>
      <p>
        法令にもとづく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。
      </p>

      <h2>4. 外部サービスの利用</h2>
      <p>
        本サービスは、予約・連絡のために以下の外部サービスを利用しています。
        これらのサービス上での情報の取り扱いは、各社のプライバシーポリシーに従います。
      </p>
      <ul>
        <li>
          Google LLC(Googleカレンダーの予約ページ、Google Meet)
        </li>
        <li>LINEヤフー株式会社(LINE公式アカウント)</li>
        <li>Vercel Inc.(本ウェブサイトのホスティング)</li>
      </ul>

      <h2>5. Cookie・アクセス解析について</h2>
      <p>
        現在、当ウェブサイトではアクセス解析ツールおよび広告目的のCookieを使用していません。
        今後導入する場合は、本ポリシーを改定したうえで、取得する情報と利用目的を明記します。
      </p>

      <h2>6. 個人情報の管理</h2>
      <p>
        取得した個人情報は、漏えい・滅失・毀損を防ぐために必要かつ適切な措置を講じて管理します。
        利用目的を達成し、保管の必要がなくなった情報は、速やかに削除します。
      </p>

      <h2>7. 開示・訂正・削除のご請求</h2>
      <p>
        ご本人からのお申し出により、当方が保有する個人情報の開示、訂正、利用停止、
        削除に応じます。下記の窓口までご連絡ください。
        ご本人であることを確認できた場合に限り、遅滞なく対応いたします。
      </p>

      <h2>8. 本ポリシーの改定</h2>
      <p>
        法令の変更やサービス内容の変更に応じて、本ポリシーを改定することがあります。
        重要な変更を行う場合は、当ウェブサイト上でお知らせします。
      </p>

      <h2>9. お問い合わせ窓口</h2>
      <dl className="legal-dl">
        <div>
          <dt>事業者</dt>
          <dd>
            {field(LEGAL.businessName).missing ? (
              <span className="legal-missing">要記入</span>
            ) : (
              LEGAL.businessName
            )}
            ({LEGAL.tradeName})
          </dd>
        </div>
        <div>
          <dt>メールアドレス</dt>
          <dd>
            <Email />
          </dd>
        </div>
      </dl>

      <p className="legal-updated">最終改定日:{LEGAL.effectiveDate}</p>
    </>
  );
}
