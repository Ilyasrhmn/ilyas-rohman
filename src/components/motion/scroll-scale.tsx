"use client";

import { useRef, useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ScrollScale() {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldALayerRef = useRef<HTMLDivElement>(null);
  
  const statement1Ref = useRef<HTMLHeadingElement>(null);
  const statement2Ref = useRef<HTMLParagraphElement>(null);
  
  const portalPositionLayerRef = useRef<HTMLDivElement>(null);
  const portalScaleLayerRef = useRef<HTMLDivElement>(null);
  const tStemRef = useRef<HTMLSpanElement>(null);

  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !containerRef.current || !worldALayerRef.current) return;

    const ctx = gsap.context(() => {
      // We will measure dynamically using invalidateOnRefresh
    const getZoomData = () => {
      if (!tStemRef.current || !portalScaleLayerRef.current) return { x: 0, y: 0, scale: 1 };
      
      // We must reset transforms to get natural measurements during resize refresh
      const currentX = gsap.getProperty(portalScaleLayerRef.current, "x");
      const currentY = gsap.getProperty(portalScaleLayerRef.current, "y");
      const currentScale = gsap.getProperty(portalScaleLayerRef.current, "scale");
      
      gsap.set(portalScaleLayerRef.current, { x: 0, y: 0, scale: 1 });
      
      const tRect = tStemRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      const cx = vw / 2;
      const cy = vh / 2;
      
      const tCenterX = tRect.left + tRect.width / 2;
      const tCenterY = tRect.top + tRect.height / 2;
      
      // Distance from screen center to the 'T' stem center
      const deltaX = tCenterX - cx;
      const deltaY = tCenterY - cy;
      
      // Calculate scale to ensure the vertical stem covers the entire viewport.
      // A standard 'T' stem is approx 35% of the glyph's total width.
      // Using 20% width and 50% height to guarantee massive over-coverage.
      const stemWidth = tRect.width * 0.2; 
      const stemHeight = tRect.height * 0.5;
      
      const scaleX = vw / stemWidth;
      const scaleY = vh / stemHeight;
      const requiredScale = Math.max(scaleX, scaleY) * 2.0; // 2x Safety margin for full corner coverage
      
      // Translation required while scaling to bring the 'T' stem to the center
      const finalX = -deltaX * requiredScale;
      const finalY = -deltaY * requiredScale;
      
      // Restore the active transforms so we don't break the current animation state
      gsap.set(portalScaleLayerRef.current, { x: currentX, y: currentY, scale: currentScale });
      
      return { x: finalX, y: finalY, scale: requiredScale };
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.0, // Smoother scrub for the narrative flow
        invalidateOnRefresh: true, // Recalculates getZoomData() on resize/font load
      }
    });

    // Initial States
    gsap.set(portalScaleLayerRef.current, { autoAlpha: 0, scale: 0.85, transformOrigin: "50% 50%" });
    gsap.set(statement1Ref.current, { y: 0, autoAlpha: 1 });
    gsap.set(statement2Ref.current, { y: 0, autoAlpha: 1 });

    // PHASE A & B: Statement Movement and Clearing (Progress 0.0 -> 0.35)
    tl.to(statement1Ref.current, { y: "-30vh", autoAlpha: 0, duration: 1.2, ease: "power1.inOut" }, 0)
      .to(statement2Ref.current, { y: "30vh", autoAlpha: 0, duration: 1.2, ease: "power1.inOut" }, 0);

    // PHASE C: Small Invitation Appears and Settles (Progress 0.35 -> 0.50)
    tl.to(portalScaleLayerRef.current, { autoAlpha: 1, duration: 0.5 }, 1.0)
      .to(portalScaleLayerRef.current, { scale: 1, duration: 1, ease: "power2.out" }, 1.0);

    // PHASE D: Small-to-Extreme Typography Zoom targeting 'T' stem (Progress 0.60 -> 0.90)
    tl.to(portalScaleLayerRef.current, {
      scale: () => getZoomData().scale,
      x: () => getZoomData().x,
      y: () => getZoomData().y,
      duration: 2,
      ease: "power3.in",
      force3D: false // Prevents bitmap rasterization, keeps DOM text sharp during extreme zoom
    }, 2.2);

    // Fade out navbar opacity as we zoom to avoid visual collision
    tl.to(document.documentElement, { "--nav-opacity": 0, duration: 1.5, ease: "power2.inOut" }, 2.5);

    // PHASE E: World B Handoff (Progress 0.92 -> 1.00)
    tl.to(worldALayerRef.current, {
      autoAlpha: 0, // Dissolve the dark layer to reveal the identical cream base seamlessly
      duration: 0.5,
      ease: "none"
    }, 4.0);

    // Fade navbar back in as World B starts
    tl.to(document.documentElement, { "--nav-opacity": 1, duration: 0.3, ease: "power1.inOut" }, 4.2);

    }); // close ctx

    return () => ctx.revert();
  }, [reduced]);

  if (reduced) {
    return (
      <div className="section-pad flex items-center justify-center bg-[var(--world-b-bg)]">
        <div className="display text-center text-[var(--world-b-text)]">ENTER</div>
      </div>
    );
  }

  return (
    <section ref={containerRef} className="relative h-[280vh] md:h-[320vh] w-full">
      {/* Sticky Stage */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[var(--world-b-bg)]">
        
        {/* World A Layer (Dark) */}
        <div 
          ref={worldALayerRef} 
          className="absolute inset-0 w-full h-full" 
        >
          {/* Solid Dark Background */}
          <div className="absolute inset-0 bg-[var(--world-a-bg)]" />

          {/* Phase A: Editorial Statement Layer (Normal text above dark background) */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 pointer-events-none z-10">
            <h2 
              ref={statement1Ref} 
              className="text-5xl md:text-7xl lg:text-[7rem] font-black uppercase text-[var(--world-a-text)] tracking-tighter leading-[0.85] max-w-4xl"
            >
              I Build For<br/>The Web
            </h2>
            <p 
              ref={statement2Ref} 
              className="mt-12 text-2xl md:text-4xl lg:text-5xl font-medium text-[var(--world-a-muted)] self-end text-right max-w-3xl leading-[1.1] tracking-tight"
            >
              With <span className="text-[var(--world-a-accent)] italic pr-2">Motion</span>, Purpose,<br/>And Curiosity.
            </p>
          </div>

          {/* Phase C & D: Portal Position Layer */}
          <div 
            ref={portalPositionLayerRef} 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {/* Direct cream text. We scale this until it floods the screen. No blend mode pixelation. */}
            <div ref={portalScaleLayerRef}>
              <h2 className="text-[18vw] md:text-[14vw] font-black leading-none text-[var(--world-b-bg)] tracking-tighter flex items-center">
                <span>EN</span>
                <span ref={tStemRef} className="relative inline-block">T</span>
                <span>ER</span>
              </h2>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
