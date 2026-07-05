"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType<any> | any;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [viewMode] = useState<"orbital">("orbital");
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const getRelatedItems = (itemId: number): number[] => {
    const currentItem = timelineData.find((item) => item.id === itemId);
    return currentItem ? currentItem.relatedIds : [];
  };

  const centerViewOnNode = (nodeId: number) => {
    if (viewMode !== "orbital" || !nodeRefs.current[nodeId]) return;
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const totalNodes = timelineData.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState = { ...prev };
      Object.keys(newState).forEach((key) => {
        if (parseInt(key) !== id) {
          newState[parseInt(key)] = false;
        }
      });

      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulseEffect: Record<number, boolean> = {};
        relatedItems.forEach((relId) => {
          newPulseEffect[relId] = true;
        });
        setPulseEffect(newPulseEffect);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }

      return newState;
    });
  };

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let rotationTimer: NodeJS.Timeout;
    if (autoRotate && viewMode === "orbital") {
      rotationTimer = setInterval(() => {
        setRotationAngle((prev) => {
          const newAngle = (prev + 0.3) % 360;
          return Number(newAngle.toFixed(3));
        });
      }, 50);
    }
    return () => {
      if (rotationTimer) {
        clearInterval(rotationTimer);
      }
    };
  }, [autoRotate, viewMode]);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = isMobile ? 120 : 180;
    const radian = (angle * Math.PI) / 180;
    
    // Round floating points to avoid server/client hydration mismatch
    const x = Number((radius * Math.cos(radian) + centerOffset.x).toFixed(3));
    const y = Number((radius * Math.sin(radian) + centerOffset.y).toFixed(3));
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Number(Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2))).toFixed(3));
    
    return { x, y, angle, zIndex, opacity };
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    const relatedItems = getRelatedItems(activeNodeId);
    return relatedItems.includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed":
        return "text-[var(--world-a-bg)] bg-[var(--world-a-accent)] border-[var(--world-a-accent)]";
      case "in-progress":
        return "text-[var(--world-a-text)] bg-transparent border-[var(--world-a-accent)]";
      case "pending":
        return "text-[var(--world-a-muted)] bg-black/40 border-[var(--world-a-muted)]";
      default:
        return "text-white bg-black/40 border-white/50";
    }
  };

  return (
    <div
      className="w-full h-full min-h-[500px] flex flex-col items-center justify-center overflow-hidden"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{
            perspective: "1000px",
            transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)`,
          }}
        >
          {/* Core Center Node with Forest Theme */}
          <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-[var(--world-a-bg)] via-[var(--world-a-accent)] to-[var(--world-a-surface)] animate-pulse flex items-center justify-center z-10 shadow-[0_0_20px_rgba(143,175,143,0.4)]">
            <div className="absolute w-16 h-16 rounded-full border-2 border-[var(--world-a-accent)]/50 animate-ping opacity-80"></div>
            <div className="absolute w-20 h-20 rounded-full border border-[var(--world-a-accent)]/30 animate-ping opacity-60" style={{ animationDelay: "0.5s" }}></div>
            <div className="w-6 h-6 rounded-full bg-[var(--world-a-text)] backdrop-blur-md shadow-inner"></div>
          </div>

          <div className="absolute w-[240px] h-[240px] sm:w-[360px] sm:h-[360px] rounded-full border-[1.5px] border-[var(--world-a-border)] opacity-80"></div>

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            const nodeStyle = {
              transform: `translate(${position.x}px, ${position.y}px)`,
              zIndex: isExpanded ? 200 : position.zIndex,
              opacity: isExpanded ? 1 : position.opacity,
            };

            return (
              <div
                key={item.id}
                ref={(el) => {
                  nodeRefs.current[item.id] = el;
                }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={nodeStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(item.id);
                }}
              >
                <div
                  className={`absolute rounded-full -inset-1 ${isPulsing ? "animate-pulse duration-1000" : ""}`}
                  style={{
                    background: `radial-gradient(circle, rgba(143,175,143,0.15) 0%, rgba(143,175,143,0) 70%)`,
                    width: `${item.energy * 0.5 + 40}px`,
                    height: `${item.energy * 0.5 + 40}px`,
                    left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                  }}
                ></div>

                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    isExpanded
                      ? "bg-[var(--world-a-surface)] text-[var(--world-a-text)]"
                      : isRelated
                      ? "bg-[var(--world-a-surface)]/80 text-[var(--world-a-text)]"
                      : "bg-[var(--world-a-bg)] text-[var(--world-a-muted)]"
                  }
                  border
                  ${
                    isExpanded
                      ? "border-[var(--world-a-accent)] shadow-[0_0_15px_rgba(143,175,143,0.3)]"
                      : isRelated
                      ? "border-[var(--world-a-accent)]/50 animate-pulse"
                      : "border-[var(--world-a-border)]"
                  }
                  transition-all duration-300 transform
                  ${isExpanded ? "scale-125" : ""}
                `}
                >
                  <Icon size={16} />
                </div>

                <div
                  className={`
                  absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap
                  font-sans text-[0.8rem] font-bold tracking-[0.15em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
                  transition-all duration-300
                  ${isExpanded ? "text-white scale-110" : "text-[var(--world-a-text)]"}
                `}
                >
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-[var(--world-a-bg)]/95 backdrop-blur-lg border-[var(--world-a-border)] shadow-xl shadow-[var(--world-a-bg)]/50 overflow-visible z-[200]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-[var(--world-a-accent)]/50"></div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className={`px-2 text-[0.55rem] tracking-[0.2em] uppercase font-light rounded-none ${getStatusStyles(item.status)}`}>
                          {item.status.replace("-", " ")}
                        </Badge>
                        <span className="text-[0.6rem] font-mono tracking-widest text-[var(--world-a-muted)]">
                          {item.date}
                        </span>
                      </div>
                      <CardTitle className="text-base font-serif font-light tracking-wide text-[var(--world-a-text)] mt-2">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-[0.75rem] font-light leading-relaxed text-[var(--world-a-muted)]">
                      <p>{item.content}</p>

                      <div className="mt-4 pt-3 border-t border-[var(--world-a-border)]">
                        <div className="flex justify-between items-center text-[0.65rem] uppercase tracking-widest text-[var(--world-a-text)] mb-2">
                          <span className="flex items-center">
                            <Zap size={10} className="mr-1 text-[var(--world-a-accent)]" />
                            Proficiency
                          </span>
                          <span className="font-mono text-[var(--world-a-accent)]">{item.energy}%</span>
                        </div>
                        <div className="w-full h-[2px] bg-[var(--world-a-border)] overflow-hidden">
                          <div
                            className="h-full bg-[var(--world-a-accent)]"
                            style={{ width: `${item.energy}%` }}
                          ></div>
                        </div>
                      </div>

                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-[var(--world-a-border)]">
                          <div className="flex items-center mb-2">
                            <Link size={10} className="text-[var(--world-a-muted)] mr-1" />
                            <h4 className="text-[0.55rem] uppercase tracking-[0.2em] font-light text-[var(--world-a-muted)]">
                              Related Skills
                            </h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button
                                  key={relatedId}
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center h-5 px-1.5 py-0 text-[0.55rem] tracking-wider uppercase font-light rounded-none border-[var(--world-a-border)] bg-transparent hover:bg-[var(--world-a-surface)] text-[var(--world-a-text)] transition-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItem(relatedId);
                                  }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={8} className="ml-1 text-[var(--world-a-accent)]" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
