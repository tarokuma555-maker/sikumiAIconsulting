import { MISSING_FIELDS } from "@/lib/legal";

/**
 * 特商法表記・プライバシーポリシー共通のレイアウト。
 * LPと同じ配色のまま、余計な装飾を省いた読み物向けの見た目にする。
 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="legal">
      <header className="legal-header">
        <div className="container">
          <a className="logo" href="/">
            シクミAIコンサル<small>SHIKUMI AI CONSULTING</small>
          </a>
        </div>
      </header>

      <main className="container legal-body">
        {MISSING_FIELDS.length > 0 && (
          <p className="legal-warning" role="alert">
            <strong>公開前に記入が必要な項目があります:</strong>{" "}
            {MISSING_FIELDS.join(" / ")}
            <br />
            リポジトリの <code>legal.config.json</code> を編集してください。
          </p>
        )}
        {children}
      </main>

      <footer className="legal-footer">
        <div className="container">
          <a href="/">← トップページに戻る</a>
        </div>
      </footer>
    </div>
  );
}
