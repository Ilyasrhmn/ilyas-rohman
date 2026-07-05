import { Hero } from "@/components/sections/hero";
import AboutIntro from "@/components/sections/AboutIntro";
import { Stack } from "@/components/sections/stack";
import CapabilitiesChoreography from "@/components/sections/CapabilitiesChoreography";
import { ScrollScale } from "@/components/motion/scroll-scale";
import Manifesto from "@/components/sections/Manifesto";
import HorizontalProjects from "@/components/sections/HorizontalProjects";
import Achievements from "@/components/sections/Achievements";
import Roadmap from "@/components/sections/Roadmap";
import ClosingTransition from "@/components/sections/ClosingTransition";
import CTASection from "@/components/sections/CTASection";
import { NavObserver } from "@/components/layout/nav-observer";

export default function Home() {
  return (
    <>
      <NavObserver />
      <Hero />
      <AboutIntro />
      <CapabilitiesChoreography />
      
      {/* The Narrative Portal (Zoom Transition) */}
      <ScrollScale />

      {/* WORLD B: The Post-Transition Environment */}
      <div 
        id="world-b-wrapper"
        className="relative z-10 w-full"
        style={{ 
          '--background': 'var(--world-b-bg)',
          '--foreground': 'var(--world-b-text)',
          '--muted': 'var(--world-b-surface)',
          '--muted-foreground': 'var(--world-b-muted)',
          '--border': 'var(--world-b-border)',
          '--primary': 'var(--world-b-accent)',
          '--card': 'var(--world-b-surface)',
          backgroundColor: 'var(--world-b-bg)', 
          color: 'var(--world-b-text)' 
        } as React.CSSProperties}
      >
        <Manifesto />
        
        <HorizontalProjects />
        
        <Achievements />
        
        <Roadmap />
        
        <ClosingTransition />
      </div>

      <CTASection />
    </>
  );
}
