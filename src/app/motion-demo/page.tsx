import { ScrollScale } from "@/components/motion/scroll-scale";
import { SectionColor } from "@/components/motion/section-color";

export default function MotionDemoPage() {
  return (
    <div>
      <div className="h-[60vh] flex items-center justify-center text-muted-foreground">
        Scroll down
      </div>
      <ScrollScale text="Craft" />
      <div className="h-[100vh] flex items-center justify-center text-foreground">
        Next section after the scale
      </div>
      <SectionColor color="#7A5C3E" className="h-[150vh] flex items-center justify-center">
        <span className="text-foreground text-2xl">Warm section color moment</span>
      </SectionColor>
      <div className="h-[100vh] flex items-center justify-center text-foreground">
        Back to dark
      </div>
    </div>
  );
}
