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

    return () => {
      io.disconnect();
      io2?.disconnect();
    };
  }, []);

  return null;
}
