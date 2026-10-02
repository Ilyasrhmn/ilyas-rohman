"use client";

import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/layout/smooth-scroll";
import { Backdrop } from "@/components/layout/backdrop";
import { CustomCursor } from "@/components/layout/custom-cursor";
import ScrollProgress from "@/components/layout/scroll-progress";
import { Preloader } from "@/components/layout/preloader";
import { RouteReveal } from "@/components/layout/route-reveal";
import Navbar from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ContactModal } from "@/components/modals/contact-modal";

const ContactContext = createContext<(() => void) | null>(null);

export function useContact() {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error("useContact must be used within ChromeShell");
  return ctx;
}

export function ChromeShell({ children }: { children: React.ReactNode }) {
  const [contactOpen, setContactOpen] = useState(false);
  const openContact = () => setContactOpen(true);
  const pathname = usePathname();
  // These archive-style routes supply their own themed footer.
  const hasPageFooter = pathname === "/achievements" || pathname === "/projects";

  return (
    <SmoothScroll>
      {/* Above <main>, so the route-change overlay survives the page swap it covers. */}
      <RouteReveal>
        <ContactContext.Provider value={openContact}>
          <Backdrop />
          <Preloader />
          <CustomCursor />
          <ScrollProgress />
          <Navbar onContact={openContact} />
          <main>{children}</main>
          {!hasPageFooter && <Footer />}
          <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
        </ContactContext.Provider>
      </RouteReveal>
    </SmoothScroll>
  );
}
