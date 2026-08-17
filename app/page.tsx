import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Effects from "@/components/Effects";
import { BOOKING_URL, LINE_URL, SNS } from "@/lib/line";
import { WORKS } from "@/lib/works";

/**
 * 「無料相談」系ボタンの遷移先。
 * 日程調整ページ(site.config.json の bookingUrl)が設定されていればそこへ、
 * 未設定ならページ下部のCTAセクション(#contact)へ送る。
 */
const bookingLink = BOOKING_URL
  ? { href: BOOKING_URL, target: "_blank", rel: "noopener noreferrer" }
  : { href: "#contact" };

/** XのURLからハンドル名(@xxx)を取り出す。リンクが1文字だと押しづらいため */
const X_HANDLE = SNS.x ? `@${SNS.x.replace(/\/+$/, "").split("/").pop()}` : "";

/** LINE公式アカウントへの遷移先 */
const lineLink = {
  href: LINE_URL,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

/**
 * 講師写真。public/teacher.png(または jpg/jpeg/webp)を置くと自動で表示される。
 * ファイルがない間は枠だけのプレースホルダーになるので、
 * 置き忘れても画像リンク切れにはならない。
 */
const TEACHER_PHOTO = ["teacher.png", "teacher.jpg", "teacher.jpeg", "teacher.webp"].find(
  (file) => fs.existsSync(path.join(process.cwd(), "public", file))
);

/**
 * 操作の実演動画。public/demo.mp4(または webm)を置くと、
 * FIG.2 の作図パネルの代わりに動画が再生される。
 * 置いていない間は作図パネルのままなので、動画がなくても成立する。
 */
const DEMO_VIDEO = ["demo.mp4", "demo.webm"].find((file) =>
  fs.existsSync(path.join(process.cwd(), "public", file))
);
/** 動画のサムネイル(再生前に出る静止画)。あれば使う */
const DEMO_POSTER = ["demo.jpg", "demo.png", "demo.webp"].find((file) =>
  fs.existsSync(path.join(process.cwd(), "public", file))
);

export default function Home() {
  return (
    <>
      <Effects />

      {/* オープニング演出。設計図の枠が引かれてから幕が上がる。
          CSSだけで消えるので、JSが動かなくても閉じ込められることはない。
          2回目以降の表示・prefers-reduced-motion では表示しない(Effects.tsx / globals.css) */}
      <div className="intro" id="intro" aria-hidden="true">
        <span className="intro-fig">FIG.0 — SHIKUMI</span>
        <svg className="intro-frame" viewBox="0 0 440 320" fill="none">
          {/* 枠 → 四隅の基準十字 → 寸法線 の順に、製図するように引かれる */}
          <rect className="intro-rect" x="40" y="60" width="360" height="180" />
          <g className="intro-crosses">
            <path d="M33 60h14M40 53v14" />
            <path d="M393 60h14M400 53v14" />
            <path d="M33 240h14M40 233v14" />
            <path d="M393 240h14M400 233v14" />
          </g>
          <path className="intro-dim" d="M40 272h360" />
          <path className="intro-tick" d="M40 265v14M400 265v14" />
          <text className="intro-dimval" x="220" y="300" textAnchor="middle">
            3ヶ月
          </text>
        </svg>

        {/* 枠の中で入れ替わる2つのメッセージ(痛み → 約束)、そのあと社名 */}
        <p className="intro-beat b1">
          <span className="seg">毎週、</span>
          <span className="seg">同じ作業に数時間。</span>
        </p>
        <p className="intro-beat b2">
          <span className="seg">その時間を、</span>
          <span className="seg">仕組みで取り戻す。</span>
        </p>
        <div className="intro-logo">
          シクミAIコンサル
          <small>SHIKUMI AI CONSULTING</small>
        </div>
        <p className="intro-tagline">
          <span className="seg">非エンジニアのための、</span>
          <span className="seg">業務設計。</span>
        </p>

        <p className="intro-hint">タップでスキップ</p>
        <div className="intro-progress" />
      </div>

      <header>
        <div className="container header-inner">
          <a className="logo" href="#top">
            シクミAIコンサル<small>SHIKUMI AI CONSULTING</small>
          </a>
          <div className="header-ctas">
            <a className="header-cta" {...bookingLink}>
              無料相談する
            </a>
            {LINE_URL && (
              <a className="header-cta is-line" {...lineLink}>
                LINE
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ========== HERO ========== */}
      <section className="hero sheet" id="top">
        <div className="container">
          <div className="drawing-frame">
            <div className="hero-grid">
              <div>
                <span className="eyebrow">AI × 業務の仕組み化スクール</span>
                <h1>
                  <span className="line1 reveal-line">コードは書けない。</span>
                  <span className="line2 reveal-line">
                    <span className="seg">でも、仕事は</span>
                    <span className="seg">自動化できる。</span>
                  </span>
                </h1>
                <p className="sub">
                  シクミAIコンサルは、非エンジニアのビジネス職のための、AI・Claude
                  Code伴走型スクール。あなたの実際の業務を題材に、
                  <strong>3ヶ月で業務自動化を1つ完成</strong>させます。
                </p>
                <div className="cta-group">
                  <a className="btn-primary" {...bookingLink}>
                    無料相談を申し込む
                  </a>
                  {LINE_URL && (
                    <a className="btn-primary btn-line-cta" {...lineLink}>
                      LINEで相談する
                    </a>
                  )}
                </div>
                <p className="hero-note">{"// 相談は30分・オンライン・営業なし"}</p>
              </div>
              <div className="tategaki">
                非エンジニアのための、
                <br />
                業務設計。
              </div>
            </div>
          </div>

          {/* FIG.1 */}
          <div className="fig" id="fig1">
            <div className="fig-label">FIG.1 — 業務の仕組み化 工程図</div>
            <svg
              className="fig-svg"
              viewBox="0 0 1000 190"
              role="img"
              aria-label="いまの業務がシクミAIコンサルを経て仕組み化された業務に変わる工程図"
            >
              <line className="wire w1" x1="300" y1="95" x2="365" y2="95" />
              <line className="wire w2" x1="665" y1="95" x2="730" y2="95" />
              <polygon points="365,90 375,95 365,100" fill="#24457F" />
              <polygon points="730,90 740,95 730,100" fill="#E8A33D" />
              <rect className="node" x="20" y="30" width="280" height="130" rx="2" />
              <text className="node-title" x="44" y="70">
                いまの業務
              </text>
              <text className="node-body" x="44" y="100">
                毎週の報告書づくり・データ転記・
              </text>
              <text className="node-body" x="44" y="122">
                メール対応に数時間
              </text>
              <rect className="node" x="380" y="30" width="280" height="130" rx="2" />
              <text className="node-title" x="404" y="70">
                シクミAIコンサル
              </text>
              <text className="node-body" x="404" y="100">
                講座で基礎を学び、
              </text>
              <text className="node-body" x="404" y="122">
                伴走で自分の業務に実装
              </text>
              <rect
                className="node node-result"
                x="745"
                y="30"
                width="235"
                height="130"
                rx="2"
              />
              <text className="node-title" x="769" y="70">
                仕組み化された業務
              </text>
              <text className="node-body" x="769" y="100">
                AIが下ごしらえ、
              </text>
              <text className="node-body" x="769" y="122">
                あなたは判断に集中
              </text>
              <line className="dimline" x1="380" y1="178" x2="600" y2="178" />
              <line className="dimline" x1="380" y1="172" x2="380" y2="184" />
              <line className="dimline" x1="660" y1="172" x2="660" y2="184" />
              <line className="dimline" x1="640" y1="178" x2="660" y2="178" />
              <text className="dim" x="606" y="182">
                3ヶ月
              </text>
            </svg>

            {/* 狭い画面ではSVGの文字が潰れるため、縦積みのHTML工程図に差し替える */}
            <div className="fig-flow">
              <div className="fig-step">
                <span className="fig-step-title">いまの業務</span>
                <span className="fig-step-body">
                  毎週の報告書づくり・データ転記・メール対応に数時間
                </span>
              </div>
              <div className="fig-arrow" aria-hidden="true">
                <i />
              </div>
              <div className="fig-step">
                <span className="fig-step-title">シクミAIコンサル</span>
                <span className="fig-step-body">
                  講座で基礎を学び、伴走で自分の業務に実装
                </span>
              </div>
              <div className="fig-arrow is-result">
                <i />
                <span>3ヶ月</span>
              </div>
              <div className="fig-step is-result">
                <span className="fig-step-title">仕組み化された業務</span>
                <span className="fig-step-body">
                  AIが下ごしらえ、あなたは判断に集中
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PAIN ========== */}
      <section className="pain">
        <div className="container">
          <span className="eyebrow">こんな悩みはありませんか</span>
          <h2 className="hang-q">
            「AIを使いこなせ」と言われても、
            <br />
            何から始めればいいのか。
          </h2>
          <div className="pain-list">
            <div className="pain-card reveal">
              <strong>ChatGPTは触った。でも…</strong>
              たまに文章を直してもらう程度で、「業務で使いこなせている」実感はない。周りとの差が開いていく気がする。
            </div>
            <div className="pain-card reveal d1">
              <strong>毎週、同じ作業に数時間</strong>
              報告書の作成、データの転記、定型メールの返信。「これ、自動化できるのでは」と思いながら手が出せない。
            </div>
            <div className="pain-card reveal d2">
              <strong>Claude Code?自分には無理</strong>
              便利らしいと聞くが、黒い画面はエンジニアのもの。非エンジニアの自分が触れるとは思えない。
            </div>
          </div>
          <p className="pain-close">
            その思い込み、<em>3ヶ月で覆します。</em>
          </p>
        </div>
      </section>

      {/* ========== CONCEPT ========== */}
      <section className="sheet" id="concept">
        <div className="container">
          <span className="eyebrow">シクミAIコンサルとは</span>
          <h2>教材で学び、伴走で完成させる。</h2>
          <p className="concept-lead">
            動画教材を見ただけでは、自分の業務は1ミリも変わりません。シクミAIコンサルは「学ぶ」で終わらせず、
            <strong>
              あなたの実際の業務を題材に、動く仕組みを一緒に作り上げる
            </strong>
            ことをゴールにした2階建てのプログラムです。
          </p>
          <div className="concept-cols">
            <div className="concept-card reveal">
              <span className="tag">STEP 1 — 学ぶ</span>
              <h3>オンライン講座・教材</h3>
              <p>
                AIの業務活用の基礎から、Claude
                Codeを「開発ツール」ではなく「業務自動化ツール」として使う方法まで。非エンジニアがつまずくポイントを先回りして解説します。
              </p>
            </div>
            <div className="concept-joint" aria-hidden="true">
              <svg viewBox="0 0 36 36" fill="none">
                <path
                  d="M4 18h24M22 10l8 8-8 8"
                  stroke="#24457F"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div className="concept-card accent reveal d1">
              <span className="tag">STEP 2 — 作る</span>
              <h3>伴走型コンサル/レッスン</h3>
              <p>
                月2回のマンツーマンセッションとチャットサポートで、あなたの業務の自動化を設計から完成まで伴走。「作りきる」ところまで一緒に走ります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== DEMO(FIG.2) ==========
          「Claude Codeで自動化」と言われても絵が浮かばない人向けに、
          実際のやりとりの形を作図で見せるセクション。
          public/demo.mp4 を置けば、作図の代わりに実演動画が入る。 */}
      <section className="demo-sec" id="demo">
        <div className="container">
          <span className="eyebrow">実際の操作イメージ</span>
          <h2 className="hang-q">
            <span className="seg">やることは、</span>
            <span className="seg">日本語で頼むだけ。</span>
          </h2>
          <p className="demo-lead">
            「黒い画面でプログラムを書く」わけではありません。
            <strong>やってほしいことを日本語で書くと、AIが手を動かします。</strong>
            たとえば週次報告書を仕組み化すると、こうなります。
          </p>

          <div className="fig demo-fig" id="fig2">
            <div className="fig-label">FIG.2 — 週次報告書を仕組み化した場合</div>

            {DEMO_VIDEO ? (
              <video
                className="demo-video"
                controls
                playsInline
                preload="metadata"
                poster={DEMO_POSTER ? `/${DEMO_POSTER}` : undefined}
              >
                <source
                  src={`/${DEMO_VIDEO}`}
                  type={DEMO_VIDEO.endsWith(".webm") ? "video/webm" : "video/mp4"}
                />
                お使いのブラウザは動画の再生に対応していません。
              </video>
            ) : (
              <div className="demo">
                {/* 01 — 人が書く指示 */}
                <div className="demo-pane">
                  <span className="demo-step">01</span>
                  <span className="demo-role">あなたが書く</span>
                  <div className="demo-screen is-prompt">
                    <p className="demo-typed">
                      <span className="dl">議事録フォルダの先週分を読んで、</span>
                      <span className="dl">週報のドラフトを作って。</span>
                      <span className="dl">書式は、先月の週報に合わせて。</span>
                    </p>
                    <span className="demo-caret" aria-hidden="true" />
                  </div>
                  <span className="demo-cap">打つのは、この3行だけ</span>
                </div>

                <div className="demo-arrow" aria-hidden="true">
                  <svg viewBox="0 0 36 36" fill="none">
                    <path d="M4 18h24M22 10l8 8-8 8" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* 02 — AIが動く */}
                <div className="demo-pane">
                  <span className="demo-step">02</span>
                  <span className="demo-role">AIが手を動かす</span>
                  <div className="demo-screen is-run">
                    <span className="dr">
                      <i aria-hidden="true" />
                      議事録を12件読み込み
                    </span>
                    <span className="dr">
                      <i aria-hidden="true" />
                      先月の週報から書式を抽出
                    </span>
                    <span className="dr">
                      <i aria-hidden="true" />
                      ドラフトを書き出し
                    </span>
                    <span className="demo-file">週報_08-17.md</span>
                  </div>
                  <span className="demo-cap">待っているだけ・約1分</span>
                </div>

                <div className="demo-arrow is-result" aria-hidden="true">
                  <svg viewBox="0 0 36 36" fill="none">
                    <path d="M4 18h24M22 10l8 8-8 8" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* 03 — 人は判断だけ */}
                <div className="demo-pane is-result">
                  <span className="demo-step">03</span>
                  <span className="demo-role">あなたは確認して出す</span>
                  <div className="demo-screen is-doc" aria-hidden="true">
                    <span className="doc-title">週報_08-17.md</span>
                    <span className="doc-h">今週のトピック</span>
                    <span className="doc-b" />
                    <span className="doc-b is-short" />
                    <span className="doc-h">進捗と課題</span>
                    <span className="doc-b" />
                    <span className="doc-b is-short" />
                    <span className="doc-h">来週の予定</span>
                    <span className="doc-b" />
                  </div>
                  <span className="demo-cap">事実を確認して、ひとこと添えるだけ</span>
                </div>
              </div>
            )}
          </div>

          <p className="demo-note">
            {DEMO_VIDEO
              ? "* 題材は一例です。実際に何を仕組み化するかは、あなたの業務に合わせて無料相談で決めます。"
              : "* 画面は操作イメージです。実際に何を仕組み化するかは、あなたの業務に合わせて無料相談で決めます。"}
          </p>
        </div>
      </section>

      {/* ========== BEFORE/AFTER ========== */}
      <section className="cases" id="cases">
        <div className="container">
          <span className="eyebrow">Before / After</span>
          <h2 className="hang-q">「仕組み化」で、業務はここまで変わる。</h2>
          <div className="case-grid">
            <div className="case-card reveal">
              <span className="job">CASE 01 — 企画職</span>
              <h3>週次報告書の作成</h3>
              <div className="ba">
                <span className="before">毎週3時間</span>
                <span className="arrow">→</span>
                <span className="after">
                  15<small>分</small>
                </span>
              </div>
              {/* 帯の長さがそのまま所要時間の比。180分 → 15分 = 8% */}
              <div
                className="ba-bar"
                style={{ "--after": "8%" } as React.CSSProperties}
                aria-hidden="true"
              >
                <i />
              </div>
              <p>
                各所からのメモやデータをClaude
                Codeが集約・整形。人は最終チェックと判断だけに集中。
              </p>
            </div>
            <div className="case-card reveal d1">
              <span className="job">CASE 02 — 営業職</span>
              <h3>日報・商談メモの整理</h3>
              <div className="ba">
                <span className="before">毎日40分</span>
                <span className="arrow">→</span>
                <span className="after">
                  5<small>分</small>
                </span>
              </div>
              {/* 40分 → 5分 = 13% */}
              <div
                className="ba-bar"
                style={{ "--after": "13%" } as React.CSSProperties}
                aria-hidden="true"
              >
                <i />
              </div>
              <p>
                音声メモや箇条書きを投げるだけで、フォーマットに沿った日報と次回アクションが自動生成。
              </p>
            </div>
            <div className="case-card reveal d2">
              <span className="job">CASE 03 — バックオフィス</span>
              <h3>データ転記・集計</h3>
              <div className="ba">
                <span className="before">月8時間</span>
                <span className="arrow">→</span>
                <span className="after">
                  30<small>分</small>
                </span>
              </div>
              {/* 480分 → 30分 = 6% */}
              <div
                className="ba-bar"
                style={{ "--after": "6%" } as React.CSSProperties}
                aria-hidden="true"
              >
                <i />
              </div>
              <p>
                複数ファイルからの転記・集計・レポート化をワンコマンドで実行する仕組みを構築。
              </p>
            </div>
          </div>
          <p className="case-note">
            * 帯の長さは作業時間の比です。斜線の部分がなくなる時間にあたります。
            <br />* 削減時間は業務内容により異なります。上記は想定モデルケースです。
          </p>
        </div>
      </section>

      {/* ========== PLANS ========== */}
      <section id="plans">
        <div className="container">
          <span className="eyebrow">プランと料金</span>
          <h2 className="hang-q">
            <span className="seg">「学ぶだけ」か、</span>
            <span className="seg hang-q">「完成させる」か。</span>
          </h2>
          <div className="plan-grid">
            <div className="plan-card reveal">
              <div className="plan-name">講座プラン</div>
              <div className="plan-for">まず自分のペースで学びたい方に</div>
              <div className="plan-price">
                ¥29,800<small>(税込・買い切り)</small>
              </div>
              <div className="plan-price-note">教材は買い切り・視聴期限なし</div>
              <ul>
                <li>AI業務活用の基礎講座(動画教材)</li>
                <li>非エンジニアのためのClaude Code入門</li>
                <li>業務自動化テンプレート集</li>
                <li>教材内容の質問サポート(30日間)</li>
                <li>伴走プランへは差額でアップグレード可能</li>
              </ul>
              <div className="cta-pair">
                <a className="btn-secondary" {...bookingLink}>
                  無料相談で詳しく聞く
                </a>
                {LINE_URL && (
                  <a className="btn-secondary is-line" {...lineLink}>
                    LINEで相談
                  </a>
                )}
              </div>
            </div>
            <div className="plan-card featured reveal d1">
              <div className="plan-name">伴走プラン</div>
              <div className="plan-for">自分の業務を確実に自動化したい方に</div>
              <div className="plan-price">
                総額 ¥150,000<small>(税込)</small>
              </div>
              <div className="plan-price-sub">
                月額¥50,000 × 3ヶ月 / 分割払い相談可
              </div>
              <div className="plan-price-note">
                金額は無料相談で確定し、開始後の追加請求はありません。対象業務が複雑な場合は、右の定着プランをご提案することがあります。
              </div>
              <ul>
                <li>講座プランの全教材が含まれます</li>
                <li>月2回のマンツーマンセッション(60分)</li>
                <li>期間中のチャットサポート(平日24時間以内に返信)</li>
                <li>あなたの業務に合わせた自動化の設計・実装伴走</li>
                <li>社内で説明するための資料化サポート</li>
              </ul>
              <div className="plan-promise">
                <strong>成果物のお約束:</strong>
                3ヶ月で、あなたの業務の自動化を1つ完成させます。
              </div>
              <div className="cta-pair">
                <a className="btn-secondary" {...bookingLink}>
                  無料相談を申し込む
                </a>
                {LINE_URL && (
                  <a className="btn-secondary is-line" {...lineLink}>
                    LINEで相談
                  </a>
                )}
              </div>
            </div>

            <div className="plan-card reveal d2">
              <div className="plan-name">定着プラン</div>
              <div className="plan-for">
                業務全体を仕組み化し、運用に乗せたい方に
              </div>
              <div className="plan-price">
                総額 ¥240,000<small>(税込)</small>
              </div>
              <div className="plan-price-sub">
                月額¥40,000 × 6ヶ月 / 分割払い相談可
              </div>
              <div className="plan-price-note">
                期間が長いぶん、月あたりの負担は伴走プランより抑えられます。
              </div>
              <ul>
                <li>伴走プランの内容がすべて含まれます</li>
                <li>期間は6ヶ月(伴走プランの2倍)</li>
                <li>月2回のマンツーマンセッション(60分)</li>
                <li>業務の棚卸しから、自動化する対象の選定まで</li>
                <li>作った仕組みの手順書化・引き継ぎ資料の作成</li>
              </ul>
              <div className="plan-promise">
                <strong>成果物のお約束:</strong>
                6ヶ月で、あなたの業務の自動化を3つ完成させ、運用に乗せます。
              </div>
              <div className="cta-pair">
                <a className="btn-secondary" {...bookingLink}>
                  無料相談を申し込む
                </a>
                {LINE_URL && (
                  <a className="btn-secondary is-line" {...lineLink}>
                    LINEで相談
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="price-policy reveal">
            <strong>料金の考え方</strong>
            まずは伴走プラン(3ヶ月・総額¥150,000)で自動化を1つ完成させるのが基本です。対象業務が複数にまたがる場合や、作った仕組みを運用に定着させたい場合は定着プラン(6ヶ月・総額¥240,000)をご提案します。いずれの場合も、無料相談で業務内容を伺ったうえで確定金額をお伝えし、開始後に追加請求することはありません。相談したからといって申し込む必要は一切ありません。
          </div>
        </div>
      </section>

      {/* ========== TEACHER ========== */}
      <section className="teacher" id="teacher">
        <div className="container">
          <span className="eyebrow">講師紹介</span>
          <h2>
            <span className="seg">教えるのは、</span>
            <span className="seg hang-q">「元・非エンジニア」です。</span>
          </h2>
          <div className="teacher-inner">
            <div className="teacher-profile">
              <div className="teacher-photo">
                {TEACHER_PHOTO ? (
                  <Image
                    src={`/${TEACHER_PHOTO}`}
                    alt="シクミAIコンサル 講師 大熊太郎"
                    width={240}
                    height={240}
                    sizes="240px"
                  />
                ) : (
                  "PHOTO 240×240"
                )}
              </div>
              <div className="teacher-name">大熊　太郎</div>
              <div className="teacher-title">
                事業側プロキシ型ITコンサル / PMO
              </div>
            </div>
            <div>
              <div className="career-path">
                <span className="cp">飲食店 店長</span>
                <span className="cp-group">
                  <span className="arrow">→</span>
                  <span className="cp">法人営業</span>
                </span>
                <span className="cp-group">
                  <span className="arrow">→</span>
                  <span className="cp">労務コンサル</span>
                </span>
                <span className="cp-group">
                  <span className="arrow">→</span>
                  <span className="cp now">ITコンサル / PMO</span>
                </span>
              </div>
              <p>
                私自身、キャリアのスタートは飲食店の店長でした。コードとは無縁の現場から、営業、労務コンサルを経てIT業界へ。現在は大手企業グループの基幹システム刷新プロジェクトでPMOを務めながら、AIを活用した業務の仕組み化を実践しています。
              </p>
              <p>
                だからこそ、
                <strong>
                  「非エンジニアがどこでつまずくか」を自分の体験として知っています。
                </strong>
                エンジニアの「当たり前」を前提にしない、ビジネス職のための言葉で教えます。
              </p>
              <p className="mission">
                <span className="seg">眠っている可能性を、</span>
                <span className="seg">機会を通じて強みに変える。</span>
                <br />
                <span className="seg">AIは、そのための</span>
                <span className="seg">最強の道具です。</span>
              </p>
            </div>
          </div>

          {/* 実績。カードは lib/works.ts の配列から生成する */}
          <div className="works reveal">
            <h3 className="works-title">講師が実際にAIで作ったもの</h3>
            <div className="works-grid">
              {WORKS.map((work) => (
                <a
                  className="work-card"
                  key={work.url}
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* public/works/<slug>.png を置くと画面写真が入る。
                      置いていないカードは、いままでどおり文字だけで成立する */}
                  {work.shot && (
                    <span className="work-shot">
                      <Image
                        src={work.shot}
                        alt={`${work.name}の画面`}
                        width={640}
                        height={400}
                        sizes="(max-width:720px) 100vw, (max-width:1000px) 50vw, 33vw"
                      />
                    </span>
                  )}
                  <span className="work-body">
                    <span className="work-tag">{work.tag ?? "Claude Codeで開発"}</span>
                    <span className="work-name">{work.name}</span>
                    <span className="work-desc">{work.desc}</span>
                    <span className="work-link">サイトを見る →</span>
                  </span>
                </a>
              ))}
            </div>

            {(SNS.x || SNS.note) && (
              <p className="sns-links">
                <span className="sns-label">発信</span>
                {SNS.x && (
                  <a href={SNS.x} target="_blank" rel="noopener noreferrer">
                    X {X_HANDLE}
                  </a>
                )}
                {SNS.note && (
                  <a href={SNS.note} target="_blank" rel="noopener noreferrer">
                    note
                  </a>
                )}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ========== STEPS ========== */}
      <section className="sheet" id="steps">
        <div className="container">
          <span className="eyebrow">受講までの流れ</span>
          <h2>まずは30分、話すところから。</h2>
          <div className="step-list">
            <div className="step-item reveal">
              <div className="step-num">STEP 01</div>
              <div className="step-body">
                <h3>無料相談を申し込む</h3>
                <p>
                  下のフォームから希望日時を選ぶだけ。オンライン(Google
                  Meet)で30分です。
                </p>
              </div>
            </div>
            <div className="step-item reveal">
              <div className="step-num">STEP 02</div>
              <div className="step-body">
                <h3>業務のヒアリング</h3>
                <p>
                  いまの業務内容と「時間を取られている作業」を伺い、自動化できそうなポイントをその場で診断します。
                </p>
              </div>
            </div>
            <div className="step-item reveal">
              <div className="step-num">STEP 03</div>
              <div className="step-body">
                <h3>プランのご提案</h3>
                <p>
                  診断結果をもとに、最適なプランと確定金額をご提案。検討期間はいくらでもどうぞ。無理な勧誘はしません。
                </p>
              </div>
            </div>
            <div className="step-item reveal">
              <div className="step-num">STEP 04</div>
              <div className="step-body">
                <h3>受講スタート</h3>
                <p>
                  教材で基礎を固めながら、伴走セッションで自動化の設計に着手。3ヶ月後、あなたの業務に「仕組み」が1つ増えています。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="faq" id="faq">
        <div className="container">
          <span className="eyebrow">よくある質問</span>
          <h2>不安な点は、ここで解消を。</h2>
          <details>
            <summary>PCスキルに自信がなくても大丈夫ですか?</summary>
            <div className="answer">
              はい。Excelやブラウザを日常業務で使えるレベルであれば問題ありません。プログラミング経験は一切不要です。むしろ「非エンジニアであること」を前提にカリキュラムを設計しています。
            </div>
          </details>
          <details>
            <summary>WindowsでもMacでも受講できますか?</summary>
            <div className="answer">
              どちらでも受講可能です。お使いの環境に合わせてセットアップからサポートします。
            </div>
          </details>
          <details>
            <summary>会社のセキュリティ的に問題ないでしょうか?</summary>
            <div className="answer">
              扱う情報の機密度に応じた進め方をご提案します。機密情報をAIに渡さずに業務を仕組み化する設計(匿名化・ダミーデータの活用など)も講座内で扱います。会社の規定が不明な場合の確認ポイントもお伝えします。
            </div>
          </details>
          <details>
            <summary>AIツールの利用料は別途かかりますか?</summary>
            <div className="answer">
              はい、Claude等のAIサービス利用料(月数千円程度〜)は別途ご負担いただきます。無料枠や最小プランから始める方法もご案内します。
            </div>
          </details>
          <details>
            <summary>忙しくて時間が取れるか不安です。</summary>
            <div className="answer">
              伴走プランのセッションは月2回・各60分。それ以外は隙間時間のチャット(平日24時間以内返信)で進められる設計です。「学習時間を捻出する」のではなく「業務の中で作る」のがこのプログラムの考え方です。
            </div>
          </details>
        </div>
      </section>

      {/* ========== CLOSING ========== */}
      <section className="closing" id="contact">
        <div className="container">
          <span className="eyebrow">無料相談</span>
          <h2>
            あなたの業務、
            <br />
            どこまで自動化できるか診断します。
          </h2>
          <div className="closing-inner">
            <p className="closing-lead">
              30分のオンライン相談で、いまの業務の「仕組み化ポイント」をその場でお伝えします。相談だけで終わってもまったく問題ありません。
            </p>
            <ul className="closing-points">
              <li>所要30分・オンライン(Google Meet)</li>
              <li>その場で「自動化できる業務」を診断</li>
              <li>無理な勧誘・しつこい営業は一切なし</li>
            </ul>
            <div className="cta-pair closing-cta">
              <a className="btn-primary" {...bookingLink}>
                日程を選んで予約する
              </a>
              {LINE_URL && (
                <a className="btn-primary btn-line-cta" {...lineLink}>
                  LINEで相談する
                </a>
              )}
            </div>
            <p className="closing-note">
              カレンダーの空いている時間から選ぶだけで予約できます。まず質問だけしたい方はLINEへどうぞ。
            </p>
          </div>
        </div>
      </section>

      <footer>
        <div className="container footer-inner">
          <div>© 2026 シクミAIコンサル / Shikumi.ai</div>
          <nav>
            <a href="/tokushoho">特定商取引法に基づく表記</a>
            <a href="/privacy">プライバシーポリシー</a>
          </nav>
        </div>
      </footer>

      {/* スマホのみ:フォームが画面に入るまで常時表示するCTA */}
      <div className="mobile-cta is-hidden" id="mobile-cta">
        <a className="mobile-cta-main" {...bookingLink}>
          <span>無料相談を予約</span>
          <small>30分・オンライン</small>
        </a>
        {LINE_URL && (
          <a className="mobile-cta-line" {...lineLink}>
            <span>LINEで相談</span>
            <small>友だち追加</small>
          </a>
        )}
      </div>
    </>
  );
}
