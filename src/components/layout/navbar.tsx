"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLenis } from "@/components/layout/smooth-scroll";
import { profile } from "@/data/profile";

const NAV_LINKS = [
  { name: "Works", href: "#works" },
  { name: "About", href: "#about" },
  { name: "Journey", href: "#journey" },
  { name: "Stack", href: "#stack" },
  { name: "Certificates", href: "#certificates" },
];

export default function Navbar({ onContact }: { onContact: () => void }) {
  const lenis = useLenis();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  const scrollRange = 800;

  const bgOpacity = useTransform(scrollY, [0, scrollRange], [0, 1]);
  const backdropBlur = useTransform(scrollY, [0, scrollRange], [0, 16]);
  const backdropFilter = useMotionTemplate`blur(${backdropBlur}px)`;
  const py = useTransform(scrollY, [0, scrollRange], [24, 12]);

  useEffect(() => {
    const overflowVal = isMobileMenuOpen ? "hidden" : "";
    document.body.style.overflow = overflowVal;
    document.documentElement.style.overflow = overflowVal;

    if (isMobileMenuOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      lenis?.start();
    };
  }, [isMobileMenuOpen, lenis]);

  const scrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const elem = document.getElementById(targetId);
      setIsMobileMenuOpen(false);

      if (!elem) return;

      if (lenis) {
        lenis.scrollTo(elem, { offset: -80, duration: 1.5 });
      } else {
        const offsetPosition = elem.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    },
    [lenis]
  );

  return (
    <motion.header
      ref={headerRef}
      style={{ paddingTop: py, paddingBottom: py }}
      className="fixed top-0 left-0 right-0 z-[100] transition-colors duration-300"
    >
      <motion.div
        style={{ opacity: bgOpacity, backdropFilter, WebkitBackdropFilter: backdropFilter }}
        className="absolute inset-0 bg-background/75 border-b border-border -z-10 pointer-events-none"
      />

      <nav className="mx-auto max-w-6xl px-6 flex items-center justify-between w-full">
        <Link
          href="#hero"
          onClick={(e) => scrollToSection(e, "#hero")}
          className="relative z-[110] flex items-center gap-2 group"
        >
          <span className="text-lg sm:text-xl font-serif tracking-tight text-foreground transition-opacity duration-300 group-hover:opacity-70">
            {profile.name}
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="relative text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground group py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/projects"
                className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Projects
              </Link>
            </li>
          </ul>

          <button
            onClick={onContact}
            className="cursor-pointer rounded-full border border-accent px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-accent"
          >
            Contact
          </button>
        </div>

        <div className="flex lg:hidden items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="relative z-[110] cursor-pointer p-2 text-foreground focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-background lg:hidden flex flex-col h-dvh w-screen"
          >
            <div className="flex flex-col flex-1 pt-24 pb-24 px-6 overflow-y-auto relative z-10">
              <ul className="flex flex-col gap-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="group flex items-baseline"
                    >
                      <span className="text-3xl font-serif tracking-tight text-foreground transition-all duration-300 group-hover:pl-4 group-hover:text-accent">
                        {link.name}
                      </span>
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + NAV_LINKS.length * 0.05, duration: 0.5 }}
                >
                  <Link href="/projects" className="text-3xl font-serif tracking-tight text-foreground">
                    Projects
                  </Link>
                </motion.li>
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onContact();
                  }}
                  className="cursor-pointer rounded-full border border-accent px-5 py-2.5 text-sm font-medium uppercase tracking-[0.2em] text-foreground"
                >
                  Contact
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
