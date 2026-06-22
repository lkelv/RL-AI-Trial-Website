/** Atmospheric, fixed, behind-everything background: layered mint/amber/pine
 *  glows that slowly drift, a faint blueprint grid, and a vignette.
 *  Pure CSS — no images, demo-safe. */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-night" />

      <div
        className="absolute -left-[12%] -top-[18%] h-[62vh] w-[62vw] rounded-full opacity-45"
        style={{
          background:
            "radial-gradient(circle, var(--color-mint) 0%, transparent 62%)",
          filter: "blur(120px)",
          animation: "rl-drift 24s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-[18%] -right-[12%] h-[58vh] w-[58vw] rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(circle, var(--color-amber) 0%, transparent 62%)",
          filter: "blur(130px)",
          animation: "rl-drift 30s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute left-[35%] top-[28%] h-[42vh] w-[42vw] rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, var(--color-pine-soft) 0%, transparent 62%)",
          filter: "blur(120px)",
          animation: "rl-drift 26s ease-in-out infinite",
        }}
      />

      {/* blueprint grid — fitting for a maths product */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* vignette for depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 0%, transparent 48%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </div>
  );
}
