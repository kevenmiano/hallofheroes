export interface IEnterFrame {
  enterFrame(time: number): void;
  leaveFrame?(): void;
  dispose?(): void;
}
