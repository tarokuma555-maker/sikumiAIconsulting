"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ConsultForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
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

  if (status === "success") {
    return (
      <div className="form-card">
        <p className="form-success-title">送信を受け付けました</p>
        <p className="form-success-body">
          ありがとうございます。日程調整のご案内を1営業日以内にメールでお送りします。届かない場合は迷惑メールフォルダをご確認ください。
        </p>
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
