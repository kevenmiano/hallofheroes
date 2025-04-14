export class MemToolItemInfo {
  id: number;
  url: string;
  gpuMemory: number;
  width: number;
  height: number;
  referenceCount: number;
  constructor(
    id: number,
    url: string,
    gpuMemory: number,
    width: number,
    height: number,
    referenceCount: number,
  ) {
    this.id = id;
    this.url = url;
    this.gpuMemory = gpuMemory;
    this.width = width;
    this.height = height;
    this.referenceCount = referenceCount;
  }
}
