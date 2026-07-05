import { Hero } from "@/components/sections/hero";
import { Works } from "@/components/sections/works";
import { About } from "@/components/sections/about";
import { Journey } from "@/components/sections/journey";
import { Stack } from "@/components/sections/stack";
import { Certificates } from "@/components/sections/certificates";
import { Cta } from "@/components/sections/cta";
import { ScrollScale } from "@/components/motion/scroll-scale";

export default function Home() {
  return (
    <>
      <Hero />
      <Works />
      <About />
      <Journey />
      <Stack />
      <ScrollScale text="Always learning." panelColor="#7A5C3E" />
      <Certificates />
      <Cta />
    </>
  );
}
