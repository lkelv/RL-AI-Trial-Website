/** Deterministic fake-async helper used by the (faked) AI flows. */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
