export interface ILayer {
  init(node?: any): void;
  pushView(view: any, zIndex?: number): void;
  popView(view?: any): void;
  clear(): void;
  canPop(): boolean;
  count(): number;
  setVisible(flag: boolean): void;
  removeSelf(): void;
}
