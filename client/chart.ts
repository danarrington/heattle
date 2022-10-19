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
  drawAxis(canvas.ctx);

  const recs: AnimateableShape[] = [];
  for (const [temp, count] of Object.entries(aggregatedTemps)) {
    const bar = buildTempBar(Number(temp), count);
    if (bar) recs.push(bar);
  }
  // for (const bar of existingBars) {
  //   bar.y0 = bar.y1;
  //   bar.y1 = 400;
  // }
  const animateOn = animateShapes({ shapes: recs, durationMs: 300, canvas });
  // const animateOff = animateShapes({
  //   shapes: existingBars,
  //   durationMs: 300,
  //   canvas,
  // });
  await Promise.all([animateOn]);
  // existingBars = recs;
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

  const x = Math.abs(ranges[0] - temp) * barWidth + axisPadding;
  const y = chartHeight - count * 5 - axisPadding;
  const height = chartHeight - y - axisPadding;
  const width = barWidth * 5;
  //@ts-ignore
  const color = colors[temp];

  return {
    x0: x,
    y0: -chartHeight,
    x1: x,
    y1: y,
    draw: (x, y, ctx) => {
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
      ctx.rect(x, y, width, height);
      ctx.stroke();
    },
  };
};

const updateTitle = (title: string) => {
  const titleElement = document.getElementById("yearTitle");
  if (!titleElement) {
    return;
  }
  titleElement.textContent = title;
};

const drawAxis = (chart: CanvasRenderingContext2D) => {
  const { axisPadding, height, ranges, barWidth } = CHART_CONFIG;

  chart.fillStyle = "black";
  chart.beginPath();
  chart.moveTo(axisPadding, height - axisPadding);
  chart.lineTo(300, height - axisPadding);
  chart.moveTo(axisPadding, 0);
  chart.lineTo(axisPadding, height - axisPadding);
  chart.stroke();

  chart.font = "12px sans-serif";
  for (let i = 0; i < ranges.length; i++) {
    chart.fillText(
      String(ranges[i]),
      axisPadding + 20 + i * 5 * barWidth,
      height - 5
    );
  }
  const yLabels = [0, 5, 10, 15, 20];
  for (let i = 0; i < yLabels.length; i++) {
    const offsetToCenterText = 5;
    const y = height - axisPadding - 5 * yLabels[i];
    chart.fillText(String(yLabels[i]), 0, y + offsetToCenterText);
    chart.moveTo(axisPadding - 5, y);
    chart.lineTo(axisPadding, y);
    chart.stroke();
  }
};
