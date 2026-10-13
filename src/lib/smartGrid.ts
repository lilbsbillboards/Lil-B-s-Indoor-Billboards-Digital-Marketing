// ============================================
// SMART GRID
// Card grids whose rows always fill the full width — no orphan gaps.
//
// Desktop (lg) uses a 12-column track. Cards are split into balanced rows of
// at most `maxPerRow`, and each card spans 12 / rowSize columns:
//   5 cards → 3 + 2      7 cards → 3 + 2 + 2      8 cards (max 4) → 4 + 4
// Tablet (md) uses 2 columns; an odd last card spans both.
//
// Cards in short rows get `smart-grid-wide` / `smart-grid-span-md` so the
// media height can be capped (see global.css) instead of growing with width.
// ============================================

// Literal class names so Tailwind picks them up.
const LG_SPAN: Record<number, string> = {
  1: "lg:col-span-12",
  2: "lg:col-span-6",
  3: "lg:col-span-4",
  4: "lg:col-span-3",
};

export function smartGrid(count: number, maxPerRow: number = count % 4 === 0 ? 4 : 3) {
  const perRow = Math.max(1, Math.min(4, maxPerRow));
  const rows = Math.max(1, Math.ceil(count / perRow));
  const base = Math.floor(count / rows);
  const extra = count % rows;

  // Row size for each card, larger rows first (e.g. 5 → [3, 3, 3, 2, 2]).
  const rowSizes: number[] = [];
  for (let r = 0; r < rows; r++) {
    const size = base + (r < extra ? 1 : 0);
    for (let i = 0; i < size; i++) rowSizes.push(size);
  }
  const fullRow = perRow === 1 ? 1 : Math.min(perRow, count);

  return {
    container: "grid-cols-1 md:grid-cols-2 lg:grid-cols-12",
    item(i: number) {
      const size = rowSizes[i] ?? fullRow;
      const spanMd = count % 2 === 1 && i === count - 1;
      return [
        spanMd && "md:col-span-2 smart-grid-span-md",
        LG_SPAN[size],
        size < fullRow && "smart-grid-wide",
      ]
        .filter(Boolean)
        .join(" ");
    },
  };
}
