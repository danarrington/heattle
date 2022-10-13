import { CHART_CONFIG } from "./app";
import { getCanvas } from "./canvas";
import { aggregatedYearlyTemps } from "./types";

export const addYearToChart = ({
  year,
  aggregatedTemps,
}: aggregatedYearlyTemps) => {
  const { canvas, ctx } = getCanvas("chart");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateTitle(String(year));
  drawAxis(ctx);

  for (const [key, value] of Object.entries(aggregatedTemps)) {
    drawTempValue(Number(key), value);
  }
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
const drawTempValue = (temp: number, count: number) => {
  if (count == 0) return;

  const { axisPadding, height: chartHeight, barWidth, ranges } = CHART_CONFIG;
  const { ctx } = getCanvas("chart");

  const x = Math.abs(ranges[0] - temp) * barWidth + axisPadding;
  const y = chartHeight - count * 5 - axisPadding;
  const shapeHeight = chartHeight - y - axisPadding;

  ctx.beginPath();
  ctx.rect(x, y, barWidth * 5, shapeHeight);
  ctx.stroke();
};
