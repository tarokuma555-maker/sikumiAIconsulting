import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/line";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ============================================================
   送信する文面。ここだけ直せば内容を変えられます。
   ============================================================ */

/** 友だち追加された直後に送るメッセージ */
const GREETING = [
  "友だち追加ありがとうございます。シクミAIコンサルです。",
  "",
  "無料相談をお申し込みいただいた方は、このトークで日程を調整させていただきます。ご希望の曜日・時間帯を送ってください(例:平日の夜、土曜の午前)。",
  "",
  "まだお申し込み前の方も、いま時間を取られている業務をそのまま送っていただければ、自動化できそうかその場でお答えします。",
].join("\n");

/** 追加直後に出す選択肢(キーボードの上に並ぶボタン) */
const QUICK_REPLIES = ["日程を相談したい", "料金を知りたい", "何ができるか知りたい"];

/**
 * キーワードへの自動返信。
 * 上から順に判定し、最初に当たったものを返します。
 * ここに当たらないメッセージには何も返しません(手動で返信するため)。
 */
const AUTO_REPLIES: { match: RegExp; reply: (site: string) => string }[] = [
  {
    match: /日程|予約|空き|いつ|相談したい|申し込/,
    reply: () =>
      [
        "ありがとうございます。無料相談は30分・オンライン(Google Meet)で行っています。",
        "",
        "ご希望の曜日と時間帯をこのトークに送ってください(例:平日20時以降、土曜の午前)。こちらから候補日をお返しします。",
      ].join("\n"),
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

function textMessage(text: string, quickReplies?: string[]) {
  return {
    type: "text",
    text,
    ...(quickReplies?.length
      ? {
          quickReply: {
            items: quickReplies.map((label) => ({
              type: "action",
              action: { type: "message", label, text: label },
            })),
          },
        }
      : {}),
  };
}

async function handle(event: LineEvent) {
  if (!event.replyToken) return;

  if (event.type === "follow") {
    await reply(event.replyToken, [textMessage(GREETING, QUICK_REPLIES)]);
    return;
  }

  if (event.type === "message" && event.message?.type === "text") {
    const text = event.message.text ?? "";
    const hit = AUTO_REPLIES.find((r) => r.match.test(text));
    // 当たらないものは無返信。運営者が自分で返信できるようにするため
    if (hit) await reply(event.replyToken, [textMessage(hit.reply(SITE_URL))]);
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
