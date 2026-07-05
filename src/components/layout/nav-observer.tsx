"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function NavObserver() {
  useEffect(() => {
    // Initial state
    document.body.setAttribute("data-nav-theme", "world-a");

    const ctx = gsap.context(() => {
      // The World B wrapper starts right after ScrollScale.
      // We target the world-b wrapper.
      ScrollTrigger.create({
        trigger: "#world-b-wrapper",
        start: "top center", // when the top of World B hits center viewport
        end: "bottom center",
        onEnter: () => document.body.setAttribute("data-nav-theme", "world-b"),
        onLeaveBack: () => document.body.setAttribute("data-nav-theme", "world-a"),
        // When leaving World B at the bottom (into CTA)
        onLeave: () => document.body.setAttribute("data-nav-theme", "world-a"),
        onEnterBack: () => document.body.setAttribute("data-nav-theme", "world-b"),
      });
    });

    return () => {
      ctx.revert();
      document.body.removeAttribute("data-nav-theme");
    };
  }, []);

  return null;
}
