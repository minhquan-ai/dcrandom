"use client";

import React, { useRef, useEffect, useState } from "react";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = "",
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed = 8,
  showBorder = false,
}) => {
  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    backgroundSize: "300% 100%",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "transparent",
    animation: `gradient-shift ${animationSpeed}s linear infinite`,
  };

  const borderStyle: React.CSSProperties = showBorder
    ? {
        borderImage: `linear-gradient(to right, ${colors.join(", ")}) 1`,
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "9999px",
        padding: "4px 16px",
        backgroundSize: "300% 100%",
        animation: `gradient-shift ${animationSpeed}s linear infinite`,
      }
    : {};

  return (
    <>
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <span className={className} style={{ ...gradientStyle, ...borderStyle }}>
        {children}
      </span>
    </>
  );
};

export default GradientText;
