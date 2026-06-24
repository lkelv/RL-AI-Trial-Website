/** Fixed, behind-everything background: a flat night fill. */
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-night" />
    </div>
  );
}
