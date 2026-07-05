"use client";

import { motion, MotionValue, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const certificates = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000",
  "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?q=80&w=1000",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000",
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1000",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=1000",
];

function ScrambleButton({ href }: { href: string }) {
  const [displayText, setDisplayText] = useState("View All Achievements");
  const [isScrambling, setIsScrambling] = useState(false);
  const originalText = "View All Achievements";
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

  const scramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);
    
    let iteration = 0;
    const maxIterations = originalText.length;

    const interval = setInterval(() => {
      setDisplayText((prev) =>
        originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setIsScrambling(false);
      }

      iteration += 1 / 3;
    }, 30);
  };

  return (
    <Link
      href={href}
      onMouseEnter={scramble}
      className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[var(--world-b-text)] text-[var(--world-b-bg)] rounded-full font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg"
    >
      <span className="relative z-10">{displayText}</span>
      <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--world-b-text)]/0 via-[var(--world-b-bg)]/10 to-[var(--world-b-text)]/0 translate-x-[-100%] group-hover:animate-[move-x_1.5s_infinite]" />
    </Link>
  );
}

type ColumnProps = {
  images: string[];
  y: MotionValue<number>;
};

const Column = ({ images, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative -top-[45%] flex h-full w-1/3 min-w-[250px] flex-col gap-[2vw] md:gap-[3vw] first:top-[-45%] [&:nth-child(2)]:top-[-95%] [&:nth-child(3)]:top-[-65%] will-change-transform"
      style={{ y, translateZ: 0 }}
    >
      {images.map((src, i) => (
        <div key={i} className="relative w-full overflow-hidden rounded-2xl bg-black/5 ring-1 ring-[var(--world-b-border)]" style={{ paddingTop: '75%' }}>
          <Image
            src={src}
            alt={`Certificate ${i}`}
            fill
            unoptimized
            sizes="(max-width: 1024px) 50vw, 33vw"
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
              <h2 className="text-sm font-mono tracking-[0.2em] text-[var(--world-b-accent)] uppercase">
                Certifications & Achievements
              </h2>
              <h3 className="text-4xl md:text-5xl lg:text-7xl font-black leading-[0.9] tracking-tighter text-[var(--world-b-text)] uppercase">
                Validating <span className="italic text-[var(--world-b-accent)] pr-2">Excellence</span> <br/> through Global Standards.
              </h3>
              <p className="text-lg md:text-xl text-[var(--world-b-muted)] font-light max-w-2xl mx-auto mt-6">
                A collection of my professional certifications in AI, Web Development, and Cloud Engineering from industry leaders.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <ScrambleButton href="/achievements" />
          </div>
        </motion.div>
      </div>

      {/* Parallax Gallery */}
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 lg:px-24">
        <div
          ref={gallery}
          className="relative box-border flex h-[100vh] md:h-[130vh] gap-[2vw] md:gap-[3vw] overflow-hidden rounded-3xl border border-[var(--world-b-border)]/50 p-[2vw]"
        >
          <Column images={[certificates[0], certificates[1], certificates[2], certificates[3], certificates[4], certificates[5]]} y={y} />
          <Column images={[certificates[5], certificates[6], certificates[7], certificates[8], certificates[9], certificates[0]]} y={y2} />
          <Column images={[certificates[9], certificates[8], certificates[7], certificates[6], certificates[5], certificates[4]]} y={y3} />
        </div>
      </div>
    </section>
  );
}
