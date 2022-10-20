import { AnimateableShape, animateShapes } from "./animate";
import { CHART_CONFIG } from "./app";
import { getChart } from "./canvas";
import { aggregatedYearlyTemps } from "./types";

let existingBars: AnimateableShape[] = [];

export const addYearToChart = async ({
  year,
  aggregatedTemps,
}: aggregatedYearlyTemps) => {
  const canvas = getChart();
  canvas.clear();

  updateTitle(String(year));

  const animatedBars: AnimateableShape[] = [];
  for (const [temp, count] of Object.entries(aggregatedTemps)) {
    const bar = buildTempBar(Number(temp), count);
    if (bar) animatedBars.push(bar);
  }

  animateExistingBarsOffChart();

  await animateShapes({
    shapes: [...animatedBars, ...existingBars],
    durationMs: 300,
    canvas,
  });
  existingBars = animatedBars;
};

const buildTempBar = (temp: number, count: number): AnimateableShape | void => {
  if (count == 0) return;

  const {
    axisPadding,
    height: chartHeight,
    barWidth,
    ranges,
    colors,
  } = CHART_CONFIG;

  const drawableArea = chartHeight - axisPadding;
  const x = Math.abs(ranges[0] - temp) * barWidth + axisPadding;
  const y = drawableArea - count * 5;
  const height = drawableArea - y;
  const width = barWidth * 5;
  //@ts-ignore
  const color = colors[temp];

  return {
    x0: x,
    y0: -chartHeight,
    x1: x,
    y1: y,
    draw: (x, y, ctx) => {
      if (y >= drawableArea) return;
      const drawableHeight = Math.min(height, drawableArea - y);
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, drawableHeight);
      ctx.rect(x, y, width, drawableHeight);
      ctx.stroke();
    },
  };
};

export const animateExistingBarsOffChart = () => {
  const { axisPadding, height: chartHeight } = CHART_CONFIG;
  for (const bar of existingBars) {
    bar.y0 = bar.y1;
    bar.y1 = chartHeight - axisPadding;
  }
};

const updateTitle = (title: string) => {
  const titleElement = document.getElementById("yearTitle");
  if (!titleElement) {
    return;
  }
  titleElement.textContent = title;
};

export const drawAxis = () => {
  const { axisPadding, height, ranges, barWidth } = CHART_CONFIG;
  const { ctx } = getChart();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(axisPadding, height - axisPadding);
  ctx.lineTo(300, height - axisPadding);
  ctx.moveTo(axisPadding, 0);
  ctx.lineTo(axisPadding, height - axisPadding);
  ctx.stroke();

  ctx.font = "12px sans-serif";
  for (let i = 0; i < ranges.length; i++) {
    ctx.fillText(
      String(ranges[i]),
      axisPadding + 20 + i * 5 * barWidth,
      height - 5
    );
  }
  const yLabels = [0, 5, 10, 15, 20];
  for (let i = 0; i < yLabels.length; i++) {
    const offsetToCenterText = 5;
    const y = height - axisPadding - 5 * yLabels[i];
    ctx.fillText(String(yLabels[i]), 0, y + offsetToCenterText);
    ctx.moveTo(axisPadding - 5, y);
    ctx.lineTo(axisPadding, y);
    ctx.stroke();
  }
};
