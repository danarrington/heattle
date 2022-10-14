import { Canvas } from "./canvas";

export type AnimateableRectangle = {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  height: number;
  width: number;
  color?: string;
};
export type AnimateRectanglesOptions = {
  recs: AnimateableRectangle[];
  durationMs: number;
  canvas: Canvas;
};
type DrawRectangleOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
};

export const animateRectangles = async ({
  recs,
  durationMs,
  canvas,
}: AnimateRectanglesOptions): Promise<void> => {
  const frames = (durationMs / 1000) * 50;
  for (let i = 0; i <= frames; i++) {
    canvas.clear();
    for (const r of recs) {
      drawRectangleFrame(r, i / frames, canvas);
    }
    await new Promise((r) => setTimeout(r, 20));
  }
  await new Promise((r) => setTimeout(r, 800));
  return Promise.resolve();
};

export const drawRectangleFrame = (
  r: AnimateableRectangle,
  percent: number,
  { ctx }: Canvas
) => {
  const x = r.x0 + percent * (r.x1 - r.x0);
  const y = r.y0 + percent * (r.y1 - r.y0);
  ctx.beginPath();
  if (r.color) ctx.fillStyle = r.color;
  ctx.fillRect(x, y, r.width, r.height);
  ctx.rect(x, y, r.width, r.height);
  ctx.stroke();
};
