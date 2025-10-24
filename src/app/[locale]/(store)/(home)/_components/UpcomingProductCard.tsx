"use client";

import { useState, useEffect } from "react";
import { Bell, Zap, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface UpcomingProductCardProps {
  productName: string;
  description: string;
  releaseDate: Date;
  image: string;
  category?: string;
}

export function UpcomingProductCard({
  productName,
  description,
  releaseDate,
  image,
  category = "Coming Soon",
}: UpcomingProductCardProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [isNotified, setIsNotified] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = releaseDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [releaseDate]);

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-card via-card to-card/80 border-2 border-border hover:border-primary/60 transition-all duration-500 h-full flex flex-col hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 p-0 gap-0">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Animated shimmer effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

      {/* Product Image Container */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-secondary to-secondary/70">
        <Image
          src={image || "/placeholder.svg"}
          fill
          alt={productName}
          className="w-full h-full group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out"
        />

        {/* Multi-layer image overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category Badge with glow effect */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-gradient-to-r from-primary to-primary/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg shadow-primary/50 group-hover:shadow-primary/70 transition-shadow duration-300">
          <Zap className="w-3 h-3 text-primary-foreground animate-pulse" />
          <span className="text-[10px] font-bold text-primary-foreground uppercase tracking-wider">{category}</span>
        </div>

        {/* Launching Soon Badge with animation */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/40 shadow-lg group-hover:border-primary/70 transition-all duration-300">
          <Sparkles className="w-3 h-3 text-primary animate-pulse" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Soon</span>
        </div>

        {/* Pulse ring effect on image */}
        <div className="absolute inset-0 border-4 border-primary/0 group-hover:border-primary/20 transition-all duration-500 rounded-lg" />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col gap-3 relative z-10 bg-gradient-to-b from-transparent to-card/50">
        {/* Product Name & Description */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight line-clamp-1">
            {productName}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Countdown Timer with enhanced styling */}
        {timeLeft ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider">
              <Clock className="w-3 h-3" />
              <span>Launches In</span>
            </div>
            <div className="grid grid-cols-4 gap-2 bg-gradient-to-br from-secondary/60 to-secondary/40 backdrop-blur-sm p-3 rounded-lg border border-border/50 group-hover:border-primary/30 transition-all duration-300 shadow-inner">
              {[
                { value: timeLeft.days, label: "Days" },
                { value: timeLeft.hours, label: "Hrs" },
                { value: timeLeft.minutes, label: "Min" },
                { value: timeLeft.seconds, label: "Sec" },
              ].map((item, index) => (
                <div key={index} className="text-center space-y-1">
                  <div className="relative">
                    <div className="text-lg font-black text-primary bg-background/50 rounded-md py-1.5 px-1 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20 border border-primary/40 p-3 rounded-lg text-center shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse" />
            <p className="text-sm font-bold text-primary relative z-10 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Now Available!
              <Sparkles className="w-4 h-4" />
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
