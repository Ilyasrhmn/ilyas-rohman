"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ProjectDetailTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const closing = document.querySelector<HTMLElement>("[data-detail-closing-transition]");
    const header = document.querySelector<HTMLElement>("header.fixed");
    const syncTheme = () => {
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
      const rect = closing?.getBoundingClientRect();
      const stickyHeight = closing?.querySelector<HTMLElement>("[data-closing-surface]")?.offsetHeight ?? window.innerHeight;
      const dark = rect !== undefined && (closing?.dataset.closingMotion === "reduced"
        ? rect.top <= headerBottom
        : -rect.top >= Math.max(0, rect.height - stickyHeight) * 0.52);
      const theme = dark ? "world-a" : "world-b";
      if (document.body.getAttribute("data-nav-theme") !== theme) {
        document.body.setAttribute("data-nav-theme", theme);
      }
    };

    syncTheme();
    window.addEventListener("scroll", syncTheme, { passive: true });
    window.addEventListener("resize", syncTheme);
    return () => {
      window.removeEventListener("scroll", syncTheme);
      window.removeEventListener("resize", syncTheme);
      document.body.setAttribute("data-nav-theme", "world-a");
    };
  }, [pathname]);

  return null;
}
