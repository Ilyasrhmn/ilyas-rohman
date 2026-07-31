"use client";

import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/layout/smooth-scroll";
import { Backdrop } from "@/components/layout/backdrop";
import { CustomCursor } from "@/components/layout/custom-cursor";
import ScrollProgress from "@/components/layout/scroll-progress";
import { Preloader } from "@/components/layout/preloader";
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
  // The achievements route supplies its own bespoke footer, so skip the site-wide one here.
  const isAchievements = pathname === "/achievements";

  return (
    <SmoothScroll>
      <ContactContext.Provider value={openContact}>
        <Backdrop />
        <Preloader />
        <CustomCursor />
        <ScrollProgress />
        <Navbar onContact={openContact} />
        <main>{children}</main>
        {!isAchievements && <Footer />}
        <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
      </ContactContext.Provider>
    </SmoothScroll>
  );
}
