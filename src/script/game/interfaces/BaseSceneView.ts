import { BaseSceneView } from "@/script/game/map/scene/BaseSceneView";

export interface IBaseSceneView {
  preLoadingStart(data: object): Promise<void>;
  enter(preScene: BaseSceneView, data: object): Promise<void>;
  enterOver(): Promise<void>;
  leaving(): Promise<void>;
  getUIID(): string;
  moveArmyByPos?(endX: number, endY: number, isCheckRect?: boolean): boolean;
}
