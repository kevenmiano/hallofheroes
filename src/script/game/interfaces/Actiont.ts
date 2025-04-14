export interface IAction {
  type: string;
  filter(action: IAction): unknown;
  ready(BattleFrameCount: number): unknown;
  prepare(): unknown;
  dispose(): unknown;
  update?(): unknown;
  finished?: any;
  inheritType?: any;
  replace(action: IAction): boolean;
  cancel(): void;
}
