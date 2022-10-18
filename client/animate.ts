import { Canvas } from "./canvas";

interface AnimateableCoordinates {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}
export interface AnimateableShape extends AnimateableCoordinates {
  draw: (x: number, y: number, ctx: CanvasRenderingContext2D) => void;
}
export type AnimateShapesOptions = {
  shapes: AnimateableShape[];
  durationMs: number;
  canvas: Canvas;
};

export const animateShapes = async ({
  shapes,
  durationMs,
  canvas,
}: AnimateShapesOptions): Promise<void> => {
  const frames = (durationMs / 1000) * 50;
  for (let i = 0; i <= frames; i++) {
    canvas.clear();
    for (const r of shapes) {
      drawFrame(r, i / frames, canvas);
    }
    await new Promise((r) => setTimeout(r, 20));
  }
  await new Promise((r) => setTimeout(r, 800));
  return Promise.resolve();
};

export const drawFrame = (
  r: AnimateableShape,
  percent: number,
  { ctx }: Canvas
) => {
  const x = r.x0 + percent * (r.x1 - r.x0);
  const y = r.y0 + percent * (r.y1 - r.y0);
  r.draw(x, y, ctx);
};
