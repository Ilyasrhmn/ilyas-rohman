"use client";

import { motion, MotionValue, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { certificates as certificateData } from "@/data/certificates";

// Single source of truth: image paths come from src/data/certificates.ts.
const certificates = certificateData.map((c) => c.image);

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

const Column = ({ images, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/3 min-w-0 md:min-w-[250px] flex-col gap-[2vw] md:gap-[3vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-65%] will-change-transform"
      style={{ y, translateZ: 0 }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative w-full overflow-hidden rounded-2xl bg-black/5 ring-1 ring-[var(--world-b-border)]" style={{ paddingTop: '75%' }}>
          <Image
            src={src}
            alt={`Certificate ${i}`}
            fill
            sizes="(max-width: 768px) 30vw, (max-width: 1024px) 50vw, 33vw"
            className="pointer-events-none object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      ))}
    </motion.div>
  );
};

export default function Achievements() {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 20,
    damping: 15,
    mass: 0.2,
    restDelta: 0.001
  });

  const { height } = dimension;
  const y = useTransform(smoothProgress, [0, 1], [0, height * 1.2]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, height * 2.0]);
  const y3 = useTransform(smoothProgress, [0, 1], [0, height * 0.8]);

  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden pb-32">
      {/* Intro Text Section */}
      <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10 max-w-[1750px] mb-20 pt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center text-center justify-center gap-8 w-full"
        >
          <div className="space-y-6 w-full max-w-4xl">
            <div className="space-y-4">
              <h2 className="text-xs font-mono tracking-[0.25em] text-[var(--world-b-accent)] uppercase">
                Certifications & Achievements
              </h2>
              <h3 className="font-serif italic text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-[var(--world-b-text)]">
                Proof I stopped <span className="text-[var(--world-b-accent)]">guessing.</span>
              </h3>
              <p className="text-lg md:text-xl text-[var(--world-b-muted)] font-serif max-w-xl mx-auto mt-6">
                Eleven certificates, mostly Dicoding. The full archive is one click away.
              </p>
            </div>
          </div>

          <Link
            href="/achievements"
            className="group mt-4 inline-flex min-h-[44px] items-center gap-2 border border-[var(--world-b-border)] px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-b-text)] transition-colors hover:border-[var(--world-b-accent)] hover:text-[var(--world-b-accent)]"
          >
            View the archive
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* Parallax Gallery */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 lg:px-24">
        <div
          ref={gallery}
          className="relative box-border flex h-[100vh] md:h-[130vh] gap-[2vw] md:gap-[3vw] overflow-hidden rounded-3xl border border-[var(--world-b-border)]/50 p-[2vw]"
        >
          <Column images={[certificates[0], certificates[1], certificates[2], certificates[3], certificates[10], certificates[5]]} y={y} />
          <Column images={[certificates[5], certificates[6], certificates[7], certificates[8], certificates[9], certificates[0]]} y={y2} />
          <Column images={[certificates[10], certificates[8], certificates[7], certificates[6], certificates[4], certificates[3]]} y={y3} />
        </div>
      </div>
    </section>
  );
}
