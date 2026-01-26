interface TMALogoProps {
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  testId?: string;
}

export function TMALogo({ variant = "light", size = "md", testId = "tma-logo" }: TMALogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12"
  };

  const textColor = variant === "light" ? "text-white" : "text-primary";
  const subTextColor = variant === "light" ? "text-white/70" : "text-muted-foreground";
  const globeColor = variant === "light" ? "#FFFFFF" : "#1EA0FF";
  const globeBgColor = variant === "light" ? "rgba(255,255,255,0.3)" : "rgba(30,160,255,0.3)";

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]}`} data-testid={testId}>
      <div className="flex items-baseline">
        <span className={`text-2xl font-bold ${textColor} tracking-tight`}>TMA</span>
      </div>
      <div className="relative flex items-center">
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6"
          aria-label="TMA Solutions Globe"
        >
          <circle cx="12" cy="12" r="10" fill={globeBgColor} />
          <ellipse cx="12" cy="12" rx="4" ry="10" fill="none" stroke={globeColor} strokeWidth="1" opacity="0.7" />
          <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke={globeColor} strokeWidth="1" opacity="0.7" />
          <circle cx="12" cy="12" r="10" fill="none" stroke={globeColor} strokeWidth="1.5" />
        </svg>
      </div>
      <div className="flex flex-col leading-none ml-0.5">
        <span className={`text-[10px] ${subTextColor} tracking-wider`}>solutions</span>
      </div>
    </div>
  );
}
