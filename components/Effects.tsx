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

    // 工程図(FIG.1)と操作イメージ(FIG.2)は、画面に入ってから作図が始まる
    const figs = document.querySelectorAll(".fig");
    let io2: IntersectionObserver | undefined;
    if (figs.length) {
      io2 = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              io2!.unobserve(e.target);
            }
          });
        },
        // FIG.2は縦に長いので、3割見えるまで待つと下端でしか発火しない
        { threshold: 0.25 }
      );
      figs.forEach((el) => io2!.observe(el));
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

    return () => {
      io.disconnect();
      io2?.disconnect();
      io3?.disconnect();
    };
  }, []);

  return null;
}
