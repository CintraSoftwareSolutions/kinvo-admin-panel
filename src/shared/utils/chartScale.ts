/** Axis maximum and evenly spaced ticks for a bar chart, derived from the data rather than a constant. */
export function chartScale(values: number[], tickCount = 5) {
  // All-zero data still gets a readable 0..4 axis.
  const max = Math.max(tickCount - 1, ...values)
  const rawStep = max / (tickCount - 1)
  const magnitude = 10 ** Math.floor(Math.log10(rawStep))
  const step = [1, 2, 2.5, 5, 10].map((factor) => factor * magnitude).find((candidate) => candidate >= rawStep) ?? rawStep
  const maxValue = step * (tickCount - 1)
  const ticks = Array.from({ length: tickCount }, (_, index) => Math.round((maxValue - index * step) * 100) / 100)
  return { maxValue, ticks }
}
