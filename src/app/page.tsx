import { Hero } from "@/components/sections/hero";
import AboutIntro from "@/components/sections/AboutIntro";
import CapabilitiesChoreography from "@/components/sections/CapabilitiesChoreography";
import { ScrollScale } from "@/components/motion/scroll-scale";
import ShortJourney from "@/components/sections/ShortJourney";
import HorizontalProjects from "@/components/sections/HorizontalProjects";
import Achievements from "@/components/sections/Achievements";
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
        <ShortJourney />
        
        <HorizontalProjects />
        
        <Achievements />
        
        <ClosingTransition />
      </div>

      <CTASection />
    </>
  );
}
