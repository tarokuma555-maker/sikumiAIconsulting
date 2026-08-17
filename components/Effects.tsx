"use client";

import { useEffect } from "react";

export default function Effects() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    const fig = document.getElementById("fig1");
    let io2: IntersectionObserver | undefined;
    if (fig) {
      io2 = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              fig.classList.add("visible");
              io2!.unobserve(fig);
            }
          });
        },
        { threshold: 0.3 }
      );
      io2.observe(fig);
    }

    // スマホの追従CTA:ヒーローのCTAか申込フォームが画面内にある間は引っ込める
    const cta = document.getElementById("mobile-cta");
    let io3: IntersectionObserver | undefined;
    if (cta) {
      const onScreen = new Set<Element>();
      io3 = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) onScreen.add(e.target);
            else onScreen.delete(e.target);
          });
          cta.classList.toggle("is-hidden", onScreen.size > 0);
        },
        { threshold: 0 }
      );
      document
        .querySelectorAll(".hero .cta-group, #contact")
        .forEach((el) => io3!.observe(el));
    }

    // オープニング演出: 同じ訪問中は2回目以降スキップする。
    // 演出中に画面を触ったら即座に飛ばす(CSS側でも自動的に消えるので保険)。
    const intro = document.getElementById("intro");
    const skipIntro = () => document.documentElement.classList.add("intro-skip");
    if (intro) {
      try {
        sessionStorage.setItem("intro", "1");
      } catch {
        /* プライベートブラウズ等で書けない場合は毎回再生されるだけ */
      }
      intro.addEventListener("click", skipIntro);
    }

    return () => {
      io.disconnect();
      io2?.disconnect();
      io3?.disconnect();
      intro?.removeEventListener("click", skipIntro);
    };
  }, []);

  return null;
}
