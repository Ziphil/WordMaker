//


export function downloadImage(imageElement: HTMLImageElement, name: string): void {
  const canvas = document.createElement("canvas") ;
  canvas.width = imageElement.width;
  canvas.height = imageElement.height;
  const context = canvas.getContext("2d")!;
  context.drawImage(imageElement, 0, 0);
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = name;
  link.click();
}