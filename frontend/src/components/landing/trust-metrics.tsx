"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldCheck, MessageSquare, Zap, Headphones, CheckCircle2 } from "lucide-react";

interface MetricItem {
  numericValue: number;
  suffix: string;
  decimals?: number;
  label: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
}

const metrics: MetricItem[] = [
  {
    numericValue: 10,
    suffix: "K+",
    label: "Businesses Connected",
    description: "Empowering fast-growing brands & modern teams",
    icon: ShieldCheck,
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  {
    numericValue: 1,
    suffix: "B+",
    label: "Messages Processed",
    description: "High-throughput official API infrastructure",
    icon: MessageSquare,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    numericValue: 99.9,
    suffix: "%",
    decimals: 1,
    label: "Platform Uptime",
    description: "Enterprise SLA with redundant global edge servers",
    icon: Zap,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  {
    numericValue: 24,
    suffix: "/7",
    label: "Dedicated Support",
    description: "Fast-response technical and solutions assistance",
    icon: Headphones,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-500/10",
  },
];

export function TrustMetrics() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={containerRef} className="border-y border-border/60 bg-muted/30 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
          {metrics.map((item, idx) => (
            <div
              key={item.label}
              className="flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300 hover:bg-background/80 hover:shadow-xs"
            >
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${item.bgColor} ${item.iconColor}`}>
                <item.icon className="h-6 w-6" />
              </div>

              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {isVisible ? (
                  <AnimatedNumber
                    target={item.numericValue}
                    decimals={item.decimals || 0}
                    suffix={item.suffix}
                  />
                ) : (
                  <span>0{item.suffix}</span>
                )}
              </div>

              <h3 className="mt-1 text-sm font-bold text-foreground">
                {item.label}
              </h3>

              <p className="mt-1 text-xs text-muted-foreground max-w-[180px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedNumber({
  target,
  decimals = 0,
  suffix = "",
}: {
  target: number;
  decimals?: number;
  suffix?: string;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {decimals > 0 ? current.toFixed(decimals) : Math.floor(current)}
      {suffix}
    </span>
  );
}
