export type Canvas = {
  ctx: CanvasRenderingContext2D;
  clear: () => void;
};
export const getChart = (): Canvas => {
  const canvas = document.getElementById("chart") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  return {
    ctx,
    clear: () => {
      ctx.clearRect(25, 0, canvas.width - 25, canvas.height - 25);
    },
  };
};

export const getTimeline = (): Canvas => {
  const canvas = document.getElementById("timeline") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  return {
    ctx,
    clear: () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
};
