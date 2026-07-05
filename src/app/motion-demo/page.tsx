import { ScrollScale } from "@/components/motion/scroll-scale";

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
    </div>
  );
}
