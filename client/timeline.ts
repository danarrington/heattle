import { aggregatedYearlyTemps } from "./types";
import { getCanvas } from "./canvas";
import { CHART_CONFIG } from "./app";

const timelineShapes = [];

export const addYearToTimeline = ({
  year,
  aggregatedTemps,
}: aggregatedYearlyTemps) => {
  const { ctx } = getCanvas("timeline");

  const { colors } = CHART_CONFIG;
  ctx.font = "12px sans-serif";
  ctx.fillStyle = "black";

  let y = Math.abs(1990 - year) * 15;
  ctx.fillText(String(year), 0, 10 + y);

  let x = 35;
  for (const [key, value] of Object.entries(aggregatedTemps)) {
    const width = 5 * value;
    ctx.beginPath();
    //@ts-ignore
    ctx.fillStyle = colors[key];
    ctx.fillRect(x, y, width, 10);
    ctx.rect(x, y, width, 10);
    ctx.stroke();
    x = x + width;
  }
};
