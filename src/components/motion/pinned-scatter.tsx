"use client";

import { Children, useEffect, useRef } from "react";
import { registerGsap, gsap } from "@/lib/gsap";
import { useReducedMotion, useIsTouch } from "@/hooks/use-reduced-motion";

export function PinnedScatter({ children }: { children: React.ReactNode }) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();
  const touch = useIsTouch();
  const disabled = reduced || touch;
  const items = Children.toArray(children);

  useEffect(() => {
    if (disabled || !spacerRef.current) return;
    registerGsap();
    const els = itemRefs.current.filter((e): e is HTMLDivElement => !!e);
    const n = els.length;
    if (n === 0) return;
    const cols = Math.ceil(Math.sqrt(n));

    const ctx = gsap.context(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const gridW = Math.min(vw * 0.9, 1100);
      const cellW = gridW / cols;
      const cellH = Math.min(cellW * 0.7, vh * 0.28);
      const rows = Math.ceil(n / cols);
      const startX = (vw - gridW) / 2;
      const startY = (vh - rows * cellH) / 2;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: spacerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          pin: stageRef.current,
        },
      });

      els.forEach((el, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        tl.fromTo(
          el,
          {
            top: vh * (0.1 + ((i * 37) % 60) / 100),
            left: vw * (0.05 + ((i * 53) % 70) / 100),
            rotate: i % 2 ? 6 : -6,
            opacity: 0.5,
            scale: 0.85,
          },
          {
            top: startY + row * (cellH + 12),
            left: startX + col * cellW + 6,
            width: cellW - 12,
            height: cellH - 12,
            rotate: 0,
            opacity: 1,
            scale: 1,
            ease: "power2.inOut",
            immediateRender: false,
          },
          0
        );
      });
      tl.to({}, { duration: 0.6 });
    }, spacerRef);

    return () => ctx.revert();
  }, [disabled, items.length]);

  if (disabled) {
    return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{children}</div>;
  }

  return (
    <>
      <div ref={spacerRef} className="h-[300vh] w-full" />
      <div ref={stageRef} className="pointer-events-none fixed inset-0 h-screen w-full overflow-hidden">
        {items.map((child, i) => (
          <div
            key={i}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="pointer-events-auto absolute w-[42vw] sm:w-[26vw]"
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
}
