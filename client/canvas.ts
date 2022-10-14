export type Canvas = {
  ctx: CanvasRenderingContext2D;
  clear: () => void;
};

export const getCanvas = (elementId: string): Canvas => {
  const canvas = document.getElementById(elementId) as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  return {
    ctx,
    clear: () => {
      ctx.clearRect(25, 0, canvas.width - 25, canvas.height - 25);
    },
  };
};
