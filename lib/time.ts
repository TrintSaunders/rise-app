/**
 * "10pm", "12am". Takes any whole hour, including 24 (the end of the last
 * two-hour window on Patterns), which is midnight: 12am, not 12pm.
 */
export function hourLabel(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  const twelve = h % 12 === 0 ? 12 : h % 12;
  return `${twelve}${h < 12 ? 'am' : 'pm'}`;
}
