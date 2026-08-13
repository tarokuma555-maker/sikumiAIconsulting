import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { BOOKING_URL, SITE_URL } from "@/lib/line";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ============================================================
   送信する文面。ここだけ直せば内容を変えられます。
   ============================================================ */

/** 友だち追加された直後に送るメッセージ */
const GREETING = BOOKING_URL
  ? [
      "友だち追加ありがとうございます。シクミAIコンサルです。",
      "",
      "無料相談(30分・オンライン)は、下のボタンから日程をお選びいただけます。空いている時間を選ぶだけで予約が完了します。",
      "",
      "まだ迷っている段階でも大丈夫です。いま時間を取られている業務をこのトークに送っていただければ、自動化できそうかその場でお答えします。",
    ].join("\n")
  : [
      "友だち追加ありがとうございます。シクミAIコンサルです。",
      "",
      "無料相談をお申し込みいただいた方は、このトークで日程を調整させていただきます。ご希望の曜日・時間帯を送ってください(例:平日の夜、土曜の午前)。",
      "",
      "まだお申し込み前の方も、いま時間を取られている業務をそのまま送っていただければ、自動化できそうかその場でお答えします。",
    ].join("\n");

/** 追加直後に出す選択肢(キーボードの上に並ぶボタン) */
const QUICK_REPLIES = ["業務の相談をしたい", "料金を知りたい", "何ができるか知りたい"];

/** 日程調整ページへのボタン。title 40字 / text 60字 / label 20字 が上限 */
const BOOKING_CARD = {
  title: "無料相談の日程を選ぶ",
  text: "カレンダーの空き時間から選ぶだけで予約できます",
  label: "日程を予約する",
};

/**
 * キーワードへの自動返信。
 * 上から順に判定し、最初に当たったものを返します。
 * ここに当たらないメッセージには何も返しません(手動で返信するため)。
 */
const AUTO_REPLIES: {
  match: RegExp;
  reply: (site: string) => string;
  withBooking?: boolean;
}[] = [
  {
    match: /日程|予約|空き|いつ|相談したい|申し込/,
    reply: () =>
      BOOKING_URL
        ? [
            "ありがとうございます。無料相談は30分・オンラインで行っています。",
            "",
            "下のボタンから、空いている時間をお選びください。",
          ].join("\n")
        : [
            "ありがとうございます。無料相談は30分・オンライン(Google Meet)で行っています。",
            "",
            "ご希望の曜日と時間帯をこのトークに送ってください(例:平日20時以降、土曜の午前)。こちらから候補日をお返しします。",
          ].join("\n"),
    // 予約ページがあるときはボタンも一緒に出す
    withBooking: true,
  },
  {
    match: /料金|価格|費用|いくら|値段|金額/,
    reply: (site) =>
      [
        "料金は2つのプランをご用意しています。",
        "",
        "・講座プラン:買い切りの教材で自分のペースで学ぶ",
        "・伴走プラン:月額制で、あなたの業務の自動化を一緒に作り上げる",
        "",
        `詳しくはこちらをご覧ください。${site ? `\n${site}/#plans` : ""}`,
        "",
        "業務内容によってお見積りが変わるため、無料相談で確定金額をお伝えしています。",
      ].join("\n"),
  },
  {
    match: /何ができ|できること|どんな|サービス|内容|概要/,
    reply: (site) =>
      [
        "シクミAIコンサルは、非エンジニアのビジネス職向けに、AI・Claude Codeで自分の業務を自動化できるようになるスクールです。",
        "",
        "教材で学ぶだけで終わらせず、あなたの実際の業務を題材に、3ヶ月で動く仕組みを1つ完成させるところまで伴走します。",
        site ? `\n${site}/#concept` : "",
      ]
        .filter(Boolean)
        .join("\n"),
  },
];

/* ============================================================
   ここから下は仕組み
   ============================================================ */

type LineEvent = {
  type: string;
  replyToken?: string;
  message?: { type: string; text?: string };
};

const SECRET = process.env.LINE_CHANNEL_SECRET ?? "";
const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN ?? "";

/** 署名検証。LINE以外からのPOSTを弾く */
function verify(rawBody: string, signature: string | null): boolean {
  if (!SECRET || !signature) return false;
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(rawBody)
    .digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  // timingSafeEqual は長さが違うと投げるので先に比較する
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function reply(replyToken: string, messages: unknown[]) {
  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ replyToken, messages }),
  });
  if (!res.ok) {
    // トークンや文面の不備はここに出る。本文にトークンは含めない
    console.error("[line] reply failed:", res.status, await res.text());
  }
}

function quickReply(labels?: string[]) {
  if (!labels?.length) return {};
  return {
    quickReply: {
      items: labels.map((label) => ({
        type: "action",
        action: { type: "message", label, text: label },
      })),
    },
  };
}

function textMessage(text: string, quickReplies?: string[]) {
  return { type: "text", text, ...quickReply(quickReplies) };
}

/** 日程調整ページを開くボタン。BOOKING_URL が空なら null */
function bookingMessage(quickReplies?: string[]) {
  if (!BOOKING_URL) return null;
  return {
    type: "template",
    altText: `${BOOKING_CARD.title} ${BOOKING_URL}`, // 通知やPCで表示される代替文
    template: {
      type: "buttons",
      title: BOOKING_CARD.title,
      text: BOOKING_CARD.text,
      actions: [{ type: "uri", label: BOOKING_CARD.label, uri: BOOKING_URL }],
    },
    ...quickReply(quickReplies),
  };
}

async function handle(event: LineEvent) {
  if (!event.replyToken) return;

  if (event.type === "follow") {
    // クイックリプライは最後のメッセージに付ける
    const booking = bookingMessage(QUICK_REPLIES);
    await reply(
      event.replyToken,
      booking
        ? [textMessage(GREETING), booking]
        : [textMessage(GREETING, QUICK_REPLIES)]
    );
    return;
  }

  if (event.type === "message" && event.message?.type === "text") {
    const text = event.message.text ?? "";
    const hit = AUTO_REPLIES.find((r) => r.match.test(text));
    // 当たらないものは無返信。運営者が自分で返信できるようにするため
    if (!hit) return;
    const booking = hit.withBooking ? bookingMessage() : null;
    await reply(
      event.replyToken,
      [textMessage(hit.reply(SITE_URL)), booking].filter(Boolean) as unknown[]
    );
  }
}

export async function POST(req: Request) {
  // 署名検証には生のボディが必要なので、JSONにする前に文字列で受ける
  const raw = await req.text();

  if (!verify(raw, req.headers.get("x-line-signature"))) {
    console.warn("[line] invalid signature");
    return new NextResponse("invalid signature", { status: 401 });
  }

  if (!TOKEN) {
    console.warn("[line] LINE_CHANNEL_ACCESS_TOKEN 未設定のため返信しません");
    return NextResponse.json({ ok: true });
  }

  let events: LineEvent[] = [];
  try {
    events = JSON.parse(raw).events ?? [];
  } catch {
    return NextResponse.json({ ok: true });
  }

  // 1件failしても他を止めない。LINEには常に200を返す(再送させない)
  await Promise.all(
    events.map((e) =>
      handle(e).catch((err) => console.error("[line] handle failed:", err))
    )
  );

  return NextResponse.json({ ok: true });
}
