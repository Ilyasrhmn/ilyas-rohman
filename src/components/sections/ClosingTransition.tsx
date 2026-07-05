"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ClosingTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !triggerRef.current) return;
    
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });

      tl.to(".closing-bg", { backgroundColor: "#101612", duration: 1 }, 0)
        .to(".closing-text", { color: "#8FAF8F", scale: 1.1, opacity: 0, duration: 1 }, 0)
        .fromTo(".closing-dark-text", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, 0.5)
        .to(document.documentElement, { 
          "--nav-bg": "rgba(16, 22, 18, 0.45)", 
          "--nav-text": "#E8E5DA", 
          "--nav-muted": "#98A39A",
          "--nav-border": "rgba(232, 229, 218, 0.08)",
          "--nav-contact-border": "#8FAF8F",
          duration: 1
        }, 0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-[250vh] z-10">
      <div ref={triggerRef} className="sticky top-0 closing-bg h-screen w-full flex flex-col items-center justify-center bg-[var(--world-b-bg)] overflow-hidden">
        
        <h2 className="closing-text text-5xl md:text-[7rem] lg:text-[9rem] font-black uppercase tracking-tighter text-[var(--world-b-text)] transition-transform text-center leading-[0.85]">
          The Journey <br/> Continues
        </h2>

        <div className="closing-dark-text absolute inset-0 flex items-center justify-center pointer-events-none">
           <h2 className="text-xl md:text-3xl font-mono tracking-widest text-[var(--world-a-muted)] uppercase text-center mt-12">
             Ready to build?
           </h2>
        </div>
      </div>
    </section>
  );
}
