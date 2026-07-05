import { ReactNode } from "react";

export function Marquee({
  children,
  speed = "30s",
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  speed?: string;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex overflow-hidden whitespace-nowrap ${className}`}
      style={{ "--marquee-speed": speed } as React.CSSProperties}
    >
      <div className={`marquee-track ${reverse ? "marquee-track--reverse" : ""}`}>
        {children}
        {children}
      </div>
      <div className={`marquee-track ${reverse ? "marquee-track--reverse" : ""}`} aria-hidden="true">
        {children}
        {children}
      </div>
    </div>
  );
}
