import { getCanvas } from "./canvas";
import { addYearToTimeline } from "./timeline";
import { aggregatedYearlyTemps, rawYearlyTemps } from "./types";

const CHART_CONFIG = {
  ranges: [80, 85, 90, 95, 100],
  barWidth: 11,
  height: 150,
  width: 300,
  axisPadding: 24,
};

const fetchData = async () => {
  const myRequest = new Request("seattle-data-1990.json");
  const response = await fetch(myRequest);
  return response.json() as Promise<rawYearlyTemps[]>;
};

const main = async () => {
  const rawData = await fetchData();
  const aggregatedData = aggregateData(rawData);

  // for (const year of aggregatedData) {
  //   addYear(year);
  //   await new Promise((r) => setTimeout(r, 500));
  // }
  addYear(aggregatedData[1]);
};

const addYear = (yearData: aggregatedYearlyTemps) => {
  addYearToChart(yearData);
  addYearToTimeline(yearData);
};

const addYearToChart = ({ year, aggregatedTemps }: aggregatedYearlyTemps) => {
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

const aggregateData = (rawData: rawYearlyTemps[]): aggregatedYearlyTemps[] => {
  const res = [];
  for (const yearData of rawData) {
    const aggregatedTemps = aggregateYearData(yearData.hotDays);
    res.push({ aggregatedTemps, year: yearData.year });
  }
  return res;
};

const aggregateYearData = (temps: number[]) => {
  const nums = {
    80: 0,
    85: 0,
    90: 0,
    95: 0,
    100: 0,
  };

  for (const temp of temps) {
    if (temp > 100) {
      nums[100]++;
    } else if (temp > 95) {
      nums[95]++;
    } else if (temp > 90) {
      nums[90]++;
    } else if (temp > 85) {
      nums[85]++;
    } else if (temp > 80) {
      nums[80]++;
    }
  }

  return nums;
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

main();
