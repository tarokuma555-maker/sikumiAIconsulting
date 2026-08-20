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
          <span className="seg">毎週の面倒を、</span>
          <span className="seg">AIに任せる。</span>
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
                <span className="eyebrow">毎週の面倒な作業を、AIに任せるスクール</span>
                <h1>
                  <span className="line1 reveal-line">コードは書けない。</span>
                  <span className="line2 reveal-line">
                    <span className="seg">でも、仕事は</span>
                    <span className="seg">自動化できる。</span>
                  </span>
                </h1>
                <p className="sub">
                  プログラムが書けなくても大丈夫です。あなたが毎週やっている面倒な作業を1つ選んで、
                  <strong>それをAIに任せる形を、3ヶ月で一緒に作ります。</strong>
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
                <p className="hero-note">相談は30分・オンライン・売り込みはしません</p>
              </div>
              <div className="tategaki">
                毎週の面倒を、
                <br />
                AIに任せる。
              </div>
            </div>
          </div>

          {/* FIG.1 */}
          <div className="fig" id="fig1">
            <div className="fig-label">3ヶ月で、こう変わります</div>
            <svg
              className="fig-svg"
              viewBox="0 0 1000 190"
              role="img"
              aria-label="いまの仕事が、3ヶ月の受講を経て、AIに任せられる形に変わる流れの図"
            >
              <line className="wire w1" x1="300" y1="95" x2="365" y2="95" />
              <line className="wire w2" x1="665" y1="95" x2="730" y2="95" />
              <polygon points="365,90 375,95 365,100" fill="#24457F" />
              <polygon points="730,90 740,95 730,100" fill="#E8A33D" />
              <rect className="node" x="20" y="30" width="280" height="130" rx="2" />
              <text className="node-title" x="44" y="70">
                いま
              </text>
              <text className="node-body" x="44" y="100">
                報告書づくり、データの打ち込み、
              </text>
              <text className="node-body" x="44" y="122">
                メール返信に毎週何時間も
              </text>
              <rect className="node" x="380" y="30" width="280" height="130" rx="2" />
              <text className="node-title" x="404" y="70">
                3ヶ月のあいだ
              </text>
              <text className="node-body" x="404" y="100">
                動画で基礎を覚えながら、
              </text>
              <text className="node-body" x="404" y="122">
                月2回のレッスンで実際に作る
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
                3ヶ月後
              </text>
              <text className="node-body" x="769" y="100">
                面倒な部分はAIがやり、
              </text>
              <text className="node-body" x="769" y="122">
                あなたは確認するだけ
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
                <span className="fig-step-title">いま</span>
                <span className="fig-step-body">
                  報告書づくり、データの打ち込み、メール返信に毎週何時間も
                </span>
              </div>
              <div className="fig-arrow" aria-hidden="true">
                <i />
              </div>
              <div className="fig-step">
                <span className="fig-step-title">3ヶ月のあいだ</span>
                <span className="fig-step-body">
                  動画で基礎を覚えながら、月2回のレッスンで実際に作る
                </span>
              </div>
              <div className="fig-arrow is-result">
                <i />
                <span>3ヶ月</span>
              </div>
              <div className="fig-step is-result">
                <span className="fig-step-title">3ヶ月後</span>
                <span className="fig-step-body">
                  面倒な部分はAIがやり、あなたは確認するだけ
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

      {/* ========== CONCEPT ==========
          「結局なにをしてもらえるのか」に、まっすぐ答えるセクション。
          提供形態(動画+レッスン)の説明ではなく、
          選ぶ → 一緒に作る → 手元に残る、という順で書く。 */}
      <section className="sheet" id="concept">
        <div className="container">
          <span className="eyebrow">シクミAIコンサルとは</span>
          <h2>
            <span className="seg">ひとことで言うと、</span>
            <span className="seg">こういうサービスです。</span>
          </h2>
          <p className="concept-lead">
            「AIの使い方」を教わる教室ではありません。
            <strong>
              あなたが毎週やっている面倒な作業を1つ選んで、それをAIに任せる形を、3ヶ月かけて一緒に作ります。
            </strong>
          </p>
          <div className="concept-steps">
            <div className="concept-card reveal">
              <span className="tag">まず</span>
              <h3>作業を1つ選ぶ</h3>
              <p>
                「毎週これに時間を取られている」という作業を、最初の無料相談で一緒に探します。たとえば報告書づくり、
                データの打ち込み、いつも同じ内容のメール返信。
              </p>
            </div>
            <div className="concept-joint" aria-hidden="true">
              <svg viewBox="0 0 36 36" fill="none">
                <path d="M4 18h24M22 10l8 8-8 8" stroke="#24457F" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="concept-card accent reveal d1">
              <span className="tag">3ヶ月</span>
              <h3>一緒に作る</h3>
              <p>
                動画で基礎を覚えながら、月2回のオンライン個別レッスンで実際に手を動かします。
                行きづまったら、レッスンを待たずにチャットで質問できます。
              </p>
            </div>
            <div className="concept-joint" aria-hidden="true">
              <svg viewBox="0 0 36 36" fill="none">
                <path d="M4 18h24M22 10l8 8-8 8" stroke="#24457F" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="concept-card reveal d2">
              <span className="tag">そのあと</span>
              <h3>ずっと手元に残る</h3>
              <p>
                作ったものは、あなたのパソコンに残ります。受講が終わったあとも、毎週それを使い続けられます。
                レッスンの期間が終わったら消える、ということはありません。
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
          <span className="eyebrow">やることは、こんな感じです</span>
          <h2>
            <span className="seg">むずかしいことは</span>
            <span className="seg">しません。</span>
          </h2>
          <p className="demo-lead">
            プログラムを書くわけではありません。
            <strong>やってほしいことを、人にお願いするみたいに書くだけです。</strong>
            たとえば毎週の報告書づくりなら、こうなります。
          </p>

          <div className="fig demo-fig" id="fig2">
            <div className="fig-label">たとえば、毎週の報告書づくりなら</div>

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
                {/* ① 人がお願いする。吹き出しにして「話しかけるだけ」に見せる */}
                <div className="demo-pane">
                  <span className="demo-step">1</span>
                  <span className="demo-role">あなたがお願いする</span>
                  <div className="demo-screen is-prompt">
                    <p className="demo-typed">
                      <span className="dl">「先週の会議のメモをまとめて、</span>
                      <span className="dl">いつもの形で報告書を作って。」</span>
                    </p>
                  </div>
                  <span className="demo-cap">話しかけるように書くだけ</span>
                </div>

                <div className="demo-arrow" aria-hidden="true">
                  <svg viewBox="0 0 36 36" fill="none">
                    <path d="M4 18h24M22 10l8 8-8 8" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* ② AIが代わりにやる */}
                <div className="demo-pane">
                  <span className="demo-step">2</span>
                  <span className="demo-role">AIが代わりにやる</span>
                  <div className="demo-screen is-run">
                    <span className="dr">
                      <i aria-hidden="true" />
                      会議のメモ12件に目を通す
                    </span>
                    <span className="dr">
                      <i aria-hidden="true" />
                      先月の報告書の形をまねる
                    </span>
                    <span className="dr">
                      <i aria-hidden="true" />
                      下書きを作る
                    </span>
                    <span className="demo-file">報告書の下書き</span>
                  </div>
                  <span className="demo-cap">あなたは待っているだけ・約1分</span>
                </div>

                <div className="demo-arrow is-result" aria-hidden="true">
                  <svg viewBox="0 0 36 36" fill="none">
                    <path d="M4 18h24M22 10l8 8-8 8" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>

                {/* ③ 人は中身を見るだけ */}
                <div className="demo-pane is-result">
                  <span className="demo-step">3</span>
                  <span className="demo-role">あなたは中身を見るだけ</span>
                  <div className="demo-screen is-doc" aria-hidden="true">
                    <span className="doc-title">報告書の下書き</span>
                    <span className="doc-h">今週やったこと</span>
                    <span className="doc-b" />
                    <span className="doc-b is-short" />
                    <span className="doc-h">困っていること</span>
                    <span className="doc-b" />
                    <span className="doc-b is-short" />
                    <span className="doc-h">来週やること</span>
                    <span className="doc-b" />
                  </div>
                  <span className="demo-cap">合っているか確かめて、提出するだけ</span>
                </div>
              </div>
            )}
          </div>

          <p className="demo-note">
            {DEMO_VIDEO
              ? "* これは一例です。あなたが何をAIに任せるかは、無料相談で一緒に決めます。"
              : "* これはイメージです。あなたが何をAIに任せるかは、無料相談で一緒に決めます。"}
          </p>
        </div>
      </section>

      {/* ========== BEFORE/AFTER ========== */}
      <section className="cases" id="cases">
        <div className="container">
          <span className="eyebrow">どれくらい変わるのか</span>
          <h2>
            <span className="seg">面倒な作業が、</span>
            <span className="seg">ここまで減ります。</span>
          </h2>
          <div className="case-grid">
            <div className="case-card reveal">
              <span className="job">事例1 — 企画のお仕事</span>
              <h3>毎週の報告書づくり</h3>
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
                あちこちにあるメモや数字をAIが1つにまとめて、いつもの形に整えます。あなたは中身を確かめるだけ。
              </p>
            </div>
            <div className="case-card reveal d1">
              <span className="job">事例2 — 営業のお仕事</span>
              <h3>日報と打ち合わせメモの整理</h3>
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
                思いついたことを声で吹き込むか、箇条書きで渡すだけ。いつもの形の日報と「次にやること」ができあがります。
              </p>
            </div>
            <div className="case-card reveal d2">
              <span className="job">事例3 — 事務のお仕事</span>
              <h3>データの打ち込みと集計</h3>
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
                いくつものファイルを行き来してコピーする作業をやめて、合計を出して表にするところまで、まとめて終わらせます。
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
            <span className="seg hang-q">「作りきる」か。</span>
          </h2>
          <div className="plan-grid">
            <div className="plan-card reveal">
              <div className="plan-name">講座プラン</div>
              <div className="plan-for">まずは自分のペースで、ひとりで覚えたい方に</div>
              <div className="plan-price">
                ¥29,800<small>(税込・買い切り)</small>
              </div>
              <div className="plan-price-note">教材は買い切り・視聴期限なし</div>
              <ul>
                <li>仕事でAIを使うための基礎(動画)</li>
                <li>Claude Codeのはじめかた(動画)</li>
                <li>よくある作業をAIに任せるためのひな形集</li>
                <li>動画の内容についての質問(30日間)</li>
                <li>あとから伴走プランに変えるときは、差額のお支払いだけで済みます</li>
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
              <div className="plan-for">自分の作業を1つ、確実に終わらせたい方に</div>
              <div className="plan-price">
                総額 ¥150,000<small>(税込)</small>
              </div>
              <div className="plan-price-sub">
                月々¥50,000 × 3ヶ月。分割のご相談もできます
              </div>
              <div className="plan-price-note">
                金額は無料相談のときに決まります。始まったあとに追加でお金をいただくことはありません。作業が思ったより大きい場合は、右の定着プランをおすすめすることがあります。
              </div>
              <ul>
                <li>講座プランの動画がぜんぶ見られます</li>
                <li>月2回のオンライン個別レッスン(1回60分)</li>
                <li>分からないことはチャットで質問し放題(平日は24時間以内に返信)</li>
                <li>あなたの作業に合わせて、何をどう作るかを一緒に考えます</li>
                <li>社内で説明するときの資料づくりもお手伝いします</li>
              </ul>
              <div className="plan-promise">
                <strong>お約束:</strong>
                3ヶ月で、あなたの作業を1つ、AIに任せられる形にします。
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
                いくつもの作業をまとめて片づけ、続く形にしたい方に
              </div>
              <div className="plan-price">
                総額 ¥240,000<small>(税込)</small>
              </div>
              <div className="plan-price-sub">
                月々¥40,000 × 6ヶ月。分割のご相談もできます
              </div>
              <div className="plan-price-note">
                期間が長いぶん、月々のお支払いは伴走プランより軽くなります。
              </div>
              <ul>
                <li>伴走プランの内容がぜんぶ含まれます</li>
                <li>期間は6ヶ月(伴走プランの2倍)</li>
                <li>月2回のオンライン個別レッスン(1回60分)</li>
                <li>いまの作業を一つずつ書き出して、どれから手をつけるか決めます</li>
                <li>作ったものの使い方を手順書にして、人に引き継げるようにします</li>
              </ul>
              <div className="plan-promise">
                <strong>お約束:</strong>
                6ヶ月で、あなたの作業を3つAIに任せられる形にして、続けられる状態にします。
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
            まずは伴走プラン(3ヶ月・総額¥150,000)で、作業を1つ片づけるのが基本の形です。片づけたい作業がいくつもある場合や、作ったあと自分で使い続けられる状態まで持っていきたい場合は、定着プラン(6ヶ月・総額¥240,000)をおすすめします。どちらの場合も、無料相談でお仕事の内容をうかがったうえで金額をお伝えします。始まったあとに追加でお金をいただくことはありません。相談したからといって、申し込む必要はまったくありません。
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
                大手企業のシステム刷新プロジェクトのまとめ役
              </div>
              <div className="teacher-title-note">
                (事業側プロキシ型ITコンサル / PMO)
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
                  <span className="cp now">ITのまとめ役</span>
                </span>
              </div>
              <p>
                私自身、最初の仕事は飲食店の店長でした。パソコンとはほぼ無縁の現場から、営業、労務の相談役を経てIT業界へ。いまは大手企業グループの社内システムを作り替える大きなプロジェクトで、現場とエンジニアの間をつなぐ役をしています。そのかたわらで、自分の仕事もAIに任せる形に変えてきました。
              </p>
              <p>
                だからこそ、
                <strong>
                  「非エンジニアがどこでつまずくか」を自分の体験として知っています。
                </strong>
                エンジニアが「当たり前」と思っていることを前提にせず、ふだんの言葉で説明します。
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
            <h3 className="works-title">実際にAIで作ったもの</h3>
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
                    <span className="work-tag">{work.tag ?? "AIで作りました"}</span>
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
              <div className="step-num">ステップ 1</div>
              <div className="step-body">
                <h3>無料相談を申し込む</h3>
                <p>
                  カレンダーから空いている時間を選ぶだけです。当日はオンライン(Google
                  Meet)で30分お話しします。
                </p>
              </div>
            </div>
            <div className="step-item reveal">
              <div className="step-num">ステップ 2</div>
              <div className="step-body">
                <h3>お仕事の話をうかがう</h3>
                <p>
                  ふだんどんな仕事をしていて、どの作業に時間を取られているかをうかがいます。その場で「これはAIに任せられそう」という部分をお伝えします。
                </p>
              </div>
            </div>
            <div className="step-item reveal">
              <div className="step-num">ステップ 3</div>
              <div className="step-body">
                <h3>プランと金額をお伝えする</h3>
                <p>
                  お話をふまえて、合いそうなプランと金額をお伝えします。考える時間はいくらでも取ってください。しつこく誘うことはしません。
                </p>
              </div>
            </div>
            <div className="step-item reveal">
              <div className="step-num">ステップ 4</div>
              <div className="step-body">
                <h3>スタート</h3>
                <p>
                  動画で基礎を覚えながら、レッスンで実際に作りはじめます。3ヶ月後には、毎週使えるものが1つ手元にあります。
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
          <h2>心配なことは、ここで。</h2>
          <details>
            <summary>パソコンが得意ではないのですが、大丈夫ですか?</summary>
            <div className="answer">
              はい。ふだんの仕事でExcelやインターネットを使えていれば十分です。プログラムを書いた経験はまったく要りません。むしろ「書けない人向け」に内容を組み立てています。
            </div>
          </details>
          <details>
            <summary>WindowsとMac、どちらでも受けられますか?</summary>
            <div className="answer">
              どちらでも受けられます。最初の準備からお使いのパソコンに合わせてお手伝いします。
            </div>
          </details>
          <details>
            <summary>会社の情報をAIに渡して大丈夫でしょうか?</summary>
            <div className="answer">
              扱う情報の重さに合わせて進め方を変えます。名前や数字を伏せたり、本物そっくりの架空データで作ったりして、大事な情報をAIに渡さずに済ませるやり方も講座で扱います。会社のルールが分からない場合は、何を確認すればいいかもお伝えします。
            </div>
          </details>
          <details>
            <summary>受講料のほかに、お金はかかりますか?</summary>
            <div className="answer">
              はい。AI(Claudeなど)の月々の利用料は別にかかります。だいたい月数千円からです。無料で使える範囲や、いちばん安いプランから始めるやり方もご案内します。
            </div>
          </details>
          <details>
            <summary>忙しくて、時間が取れるか心配です。</summary>
            <div className="answer">
              レッスンは月2回、1回60分だけです。あとは空いた時間にチャットで質問しながら進められます。「勉強の時間を別に作る」のではなく、「ふだんの仕事をしながら作る」のがこのスクールの考え方です。
            </div>
          </details>
        </div>
      </section>

      {/* ========== CLOSING ========== */}
      <section className="closing" id="contact">
        <div className="container">
          <span className="eyebrow">無料相談</span>
          <h2>
            あなたの仕事のどこを
            <br />
            AIに任せられるか、お伝えします。
          </h2>
          <div className="closing-inner">
            <p className="closing-lead">
              30分お話をうかがって、「ここはAIに任せられます」という部分をその場でお伝えします。相談だけで終わっても、まったく問題ありません。
            </p>
            <ul className="closing-points">
              <li>所要30分・オンライン(Google Meet)</li>
              <li>その場で「任せられる作業」をお伝えします</li>
              <li>しつこい売り込みは一切しません</li>
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
              カレンダーの空いている時間を選ぶだけで予約できます。まず質問だけしたい方は、LINEからどうぞ。
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
