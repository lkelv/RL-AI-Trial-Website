export function TypingDots({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 bg-mint"
          style={{ animation: "rl-bob 1s ease-in-out infinite", animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  );
}
