"use client";

import { useEffect, useRef, useState } from "react";
import { LINE_AUTO_REDIRECT_SEC, LINE_URL } from "@/lib/line";

type Status = "idle" | "sending" | "success" | "error";

export default function ConsultForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [secLeft, setSecLeft] = useState(LINE_AUTO_REDIRECT_SEC);
  const [autoRedirect, setAutoRedirect] = useState(true);
  const doneRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    job: "",
    message: "",
  });

  const update =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg("お名前とメールアドレスを入力してください。");
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMsg("メールアドレスの形式をご確認ください。");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
    } catch {
      setErrorMsg(
        "送信できませんでした。時間をおいて再度お試しください。"
      );
      setStatus("error");
    }
  };

  // 入力欄が完了メッセージに置き換わると高さが縮み、送信ボタンを押した位置の
  // まま残るとカードが画面外になることがあるので、確実に見える位置へ寄せる
  useEffect(() => {
    if (status !== "success") return;
    doneRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [status]);

  // 送信完了後、LINEが設定されていれば自動で友だち追加ページへ送る。
  // 「このページに留まる」でいつでも止められる。
  const countingDown =
    status === "success" &&
    !!LINE_URL &&
    autoRedirect &&
    LINE_AUTO_REDIRECT_SEC > 0;

  useEffect(() => {
    if (!countingDown) return;
    if (secLeft <= 0) {
      window.location.href = LINE_URL;
      return;
    }
    const timer = setTimeout(() => setSecLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [countingDown, secLeft]);

  if (status === "success") {
    return (
      <div className="form-card" ref={doneRef} role="status">
        <p className="form-success-title">送信を受け付けました</p>
        {LINE_URL ? (
          <>
            <p className="form-success-body">
              ありがとうございます。続けて
              <strong>LINEで友だち追加</strong>
              していただくと、日程調整も気になっていることの相談も、そのままトークで進められます。
            </p>
            <a className="btn-primary btn-line-cta" href={LINE_URL}>
              <span className="btn-label">LINEで今すぐ相談する</span>
              <span className="btn-sub">友だち追加してトークを開く</span>
            </a>
            {/* カードは role="status" で1回だけ読み上げる。残り秒数まで
                読み上げると毎秒割り込むので、この行は live から外す */}
            <p className="form-note" aria-live="off">
              {countingDown ? (
                <>
                  {secLeft}秒後にLINEへ移動します。
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => setAutoRedirect(false)}
                  >
                    このページに留まる
                  </button>
                </>
              ) : (
                "LINEをお使いでない場合も、日程調整のご案内を1営業日以内にメールでお送りします。"
              )}
            </p>
          </>
        ) : (
          <p className="form-success-body">
            ありがとうございます。日程調整のご案内を1営業日以内にメールでお送りします。届かない場合は迷惑メールフォルダをご確認ください。
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="form-card">
      <div className="form-field">
        <label htmlFor="name">
          お名前<span className="req">必須</span>
        </label>
        <input
          id="name"
          type="text"
          placeholder="山田 太郎"
          autoComplete="name"
          value={form.name}
          onChange={update("name")}
        />
      </div>
      <div className="form-field">
        <label htmlFor="email">
          メールアドレス<span className="req">必須</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="taro@example.com"
          autoComplete="email"
          value={form.email}
          onChange={update("email")}
        />
      </div>
      <div className="form-field">
        <label htmlFor="job">ご職種</label>
        <select id="job" value={form.job} onChange={update("job")}>
          <option value="">選択してください</option>
          <option>企画・マーケティング</option>
          <option>営業</option>
          <option>バックオフィス(人事・経理・総務など)</option>
          <option>経営者・個人事業主</option>
          <option>その他</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="msg">相談したいこと(任意)</label>
        <textarea
          id="msg"
          rows={4}
          placeholder="例:毎週の報告書作成に時間がかかっており、自動化できないか相談したい"
          value={form.message}
          onChange={update("message")}
        />
      </div>
      {status === "error" && <p className="form-error">{errorMsg}</p>}
      <button
        className="btn-primary"
        style={{ width: "100%" }}
        type="button"
        disabled={status === "sending"}
        onClick={submit}
      >
        {status === "sending" ? (
          "送信しています…"
        ) : (
          <>
            <span className="btn-label">無料相談を申し込む</span>
            <span className="btn-sub">30分・オンライン</span>
          </>
        )}
      </button>
      <p className="form-note">
        送信後、日程調整のご案内をメールでお送りします。しつこい営業は行いません。
      </p>
    </div>
  );
}
