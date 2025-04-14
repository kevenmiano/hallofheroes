export interface ILayer {
  init(node?: any): void;
  pushView(view: any, zIndex?: number): void;
  popView(view?: any): void;
  clear(): void;
}
