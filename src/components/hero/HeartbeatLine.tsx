export function HeartbeatLine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 120" className={className} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="ecg-grad" x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.16 220)" stopOpacity="0" />
          <stop offset="40%" stopColor="oklch(0.82 0.16 220)" />
          <stop offset="100%" stopColor="oklch(0.65 0.22 290)" stopOpacity="0" />
        </linearGradient>
        <filter id="ecg-glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M0 60 L120 60 L140 60 L150 40 L160 80 L170 20 L180 100 L195 60 L260 60 L280 60 L290 50 L300 70 L320 60 L420 60 L435 40 L445 80 L455 30 L465 90 L480 60 L600 60"
        fill="none"
        stroke="url(#ecg-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#ecg-glow)"
        strokeDasharray="1200"
        style={{ animation: "ecg 3s linear infinite" }}
      />
    </svg>
  );
}
