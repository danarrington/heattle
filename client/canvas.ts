type CanvasContext = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};
export const getCanvas = (elementId: string): CanvasContext => {
  const canvas = document.getElementById(elementId) as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  return {
    canvas,
    ctx,
  };
};
