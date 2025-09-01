"use client";

type JRLogoProps = { className?: string };

export default function JRLogo({ className = "h-6 w-auto" }: JRLogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 420 80"
      aria-label="Joe Rey Photography"
    >
      <title>Joe Rey Photography</title>

      {/* Wordmark */}
      <text
        x="20"
        y="52"
        fontFamily="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
        fontWeight="800"
        fontSize="28"
        letterSpacing="3"
        fill="currentColor"
      >
        JOE REY
      </text>

      {/* Little camera/aperture mark on the right */}
      <circle
        cx="360"
        cy="40"
        r="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path d="M360 26 l6 10 -6 10 -6 -10z" fill="currentColor" />
    </svg>
  );
}