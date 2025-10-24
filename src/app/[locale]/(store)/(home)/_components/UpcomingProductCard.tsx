"use client";

import { useState, useEffect } from "react";
import { Bell, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-500 h-full flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Product Image Container */}
      <div className="relative h-64 overflow-hidden bg-secondary">
        <img
          src={image || "/placeholder.svg"}
          alt={productName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        <div className="absolute top-4 left-4 flex items-center gap-2 bg-primary/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <Zap className="w-4 h-4 text-primary-foreground" />
          <span className="text-xs font-semibold text-primary-foreground uppercase tracking-wider">{category}</span>
        </div>

        <div className="absolute top-4 right-4 bg-secondary/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-primary/30">
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Launching Soon</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col gap-4 relative z-10">
        {/* Product Name */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {productName}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>

        {timeLeft ? (
          <div className="grid grid-cols-4 gap-2 bg-secondary/50 backdrop-blur-sm p-4 rounded-lg border border-border/50">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{String(timeLeft.days).padStart(2, "0")}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Days</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{String(timeLeft.hours).padStart(2, "0")}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Hours</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{String(timeLeft.minutes).padStart(2, "0")}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Mins</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{String(timeLeft.seconds).padStart(2, "0")}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Secs</div>
            </div>
          </div>
        ) : (
          <div className="bg-primary/10 border border-primary/30 p-4 rounded-lg text-center">
            <p className="text-sm font-semibold text-primary">🎉 Now Available!</p>
          </div>
        )}

        {/* <Button
          onClick={() => setIsNotified(!isNotified)}
          className={`w-full font-semibold transition-all duration-300 ${
            isNotified
              ? "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/50"
          }`}
          variant={isNotified ? "outline" : "default"}
        >
          <Bell className="w-4 h-4 mr-2" />
          {isNotified ? "Notification Set" : "Notify Me"}
        </Button> */}
      </div>
    </Card>
  );
}
