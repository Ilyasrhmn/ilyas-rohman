"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ProjectDetailTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const closing = document.querySelector<HTMLElement>("[data-next-project]");
    const header = document.querySelector<HTMLElement>("header.fixed");
    const syncTheme = () => {
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
      const dark = closing !== null && closing.getBoundingClientRect().top <= headerBottom;
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
