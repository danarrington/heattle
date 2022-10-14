export type AnimateRectangleOptions = {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  height: number;
  width: number;
  durationMs: number;
  color: string;
  ctx: CanvasRenderingContext2D;
};
type DrawRectangleOptions = {
  x: number;
  y: number;
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
};

export const animateRectangle = async ({
  x0,
  x1,
  y0,
  y1,
  width,
  height,
  durationMs,
  ctx,
}: AnimateRectangleOptions): Promise<void> => {
  ctx.beginPath();
  ctx.rect(x0, y0, width, height);
  ctx.stroke();
  console.log("start");
  return new Promise((resolve) => {
    setTimeout(resolve, durationMs);
  }).then(() => {
    console.log("then");
    ctx.beginPath();
    ctx.rect(x1, y1, width, height);
    ctx.stroke();
  });
};

const drawRectangle = ({ x, y, width, height, ctx }: DrawRectangleOptions) => {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.stroke();
};
