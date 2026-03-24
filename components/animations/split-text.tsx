"use client";

import React, { useEffect, useRef, useState } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  animationFrom?: React.CSSProperties;
  animationTo?: React.CSSProperties;
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right";
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 50,
  animationFrom = { opacity: 0, transform: "translate3d(0,40px,0)" },
  animationTo = { opacity: 1, transform: "translate3d(0,0,0)" },
  threshold = 0.1,
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  const words = text.split(" ");
  let letterIndex = 0;
  const totalLetters = text.replace(/ /g, "").length;

  return (
    <span
      ref={containerRef}
      className={className}
      style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: textAlign === "center" ? "center" : textAlign === "right" ? "flex-end" : "flex-start" }}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} style={{ display: "inline-flex", whiteSpace: "nowrap" }}>
          {word.split("").map((char) => {
            const currentIndex = letterIndex++;
            const currentDelay = currentIndex * delay;

            return (
              <span
                key={`${wordIdx}-${currentIndex}`}
                style={{
                  display: "inline-block",
                  transition: `all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${currentDelay}ms`,
                  ...(isVisible ? animationTo : animationFrom),
                }}
                onTransitionEnd={() => {
                  if (currentIndex === totalLetters - 1) {
                    onLetterAnimationComplete?.();
                  }
                }}
              >
                {char}
              </span>
            );
          })}
          {wordIdx < words.length - 1 && (
            <span style={{ display: "inline-block", width: "0.3em" }}>&nbsp;</span>
          )}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
