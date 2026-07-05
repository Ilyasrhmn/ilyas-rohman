import { Marquee } from "./marquee";

export function InfiniteRibbon({
  text,
  speed = "30s",
  reverse = false,
  rotation = 0,
  bgClass = "bg-primary",
  textClass = "text-primary-foreground",
}: {
  text: string;
  speed?: string;
  reverse?: boolean;
  rotation?: number;
  bgClass?: string;
  textClass?: string;
}) {
  // We add many repetitions of the text so the CSS marquee loops seamlessly
  const items = Array(8).fill(text);

  return (
    <div
      className={`w-[120vw] -ml-[10vw] flex items-center py-3 overflow-hidden ${bgClass}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
      }}
    >
      <Marquee speed={speed} reverse={reverse}>
        {items.map((item, i) => (
          <span
            key={i}
            className={`mx-6 text-xl md:text-3xl font-black uppercase tracking-widest ${textClass}`}
          >
            {item} <span className="mx-6 text-current opacity-30">✧</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
