import { SVG } from '@svgdotjs/svg.js';

export function createFallbackSVG(
  assetName: string,
  width: number,
  height: number
): string {
  const svg = SVG().size(width, height);
  svg.rect(width, height).fill('red');
  svg
    .text(assetName)
    .size(14)
    .fill('white')
    .center(width / 2, height / 2);
  const svgString = svg.svg();
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
}
