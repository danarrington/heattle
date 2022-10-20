import { AggregatedTempCounts, aggregatedYearlyTemps } from "./types";
import { getTimeline } from "./canvas";
import { CHART_CONFIG } from "./app";
import { AnimateableShape, animateShapes } from "./animate";

const timelineShapes: AnimateableShape[] = [];

export const addYearToTimeline = async ({
  year,
  aggregatedTemps,
}: aggregatedYearlyTemps) => {
  const canvas = getTimeline();
  const shape = buildTimelineShape(year, aggregatedTemps);
  for (const shape of timelineShapes) {
    shape.y0 = shape.y1;
    shape.y1 += 15;
  }
  timelineShapes.push(shape);
  await new Promise((r) => setTimeout(r, 300));
  await animateShapes({ shapes: timelineShapes, durationMs: 100, canvas });
};

const buildTimelineShape = (
  year: number,
  aggregatedTemps: AggregatedTempCounts
): AnimateableShape => {
  const x = 35; //TODO
  const y0 = -20;
  const y1 = 10;
  const { colors } = CHART_CONFIG;

  return {
    x0: x,
    y0,
    x1: x,
    y1,
    draw: (x, y, ctx) => {
      for (const [key, value] of Object.entries(aggregatedTemps)) {
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "black";
        ctx.fillText(String(year), 0, 10 + y);

        const width = 5 * value;
        ctx.beginPath();
        //@ts-ignore
        ctx.fillStyle = colors[key];
        ctx.fillRect(x, y, width, 10);
        ctx.rect(x, y, width, 10);
        ctx.stroke();
        x = x + width;
      }
    },
  };
};
