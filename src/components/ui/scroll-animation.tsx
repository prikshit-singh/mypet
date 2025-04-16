
import React from "react";

export type AnimationType = 
  | "fade-in-up" 
  | "fade-in-left" 
  | "fade-in-right" 
  | "fade-in" 
  | "scale-in";

export interface ScrollAnimationProps {
  children: React.ReactNode;
  type?: AnimationType;
  delay?: 100 | 200 | 300 | 400 | 500;
  className?: string;
}

export function ScrollAnimation({
  children,
  type = "fade-in-up",
  delay,
  className,
}: ScrollAnimationProps) {
  const delayClass = delay ? `delay-${delay}` : "";
  
  return (
    <div className={`${type} ${delayClass} ${className || ""}`}>
      {children}
    </div>
  );
}
