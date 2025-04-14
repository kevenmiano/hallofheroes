//@ts-expect-error: External dependencies
import { SpaceModel } from "../SpaceModel";
import NodeMapPhysics from "./NodeMapPhysics";

/**
 * 天空之城场景节点
 *
 */
export class SpaceNode extends NodeMapPhysics {
  public sonType: number = 0;
  public nodeId: number = 0;
  public tempData: object; //临时数据
  public npcId: number = 0;
  public curPosX: number = 0;
  public curPosY: number = 0;
  public resetPosX: number = 0;
  public resetPosY: number = 0;
  public fixX: number = 0; //地编中精确到象素值
  public fixY: number = 0; //地编中精确到象素值
  public moveToMapId: number = 0;
  public moveToNodeId: number = 0;
  public patrolPos: string;
  public nameColor: number = 0;
  public sizeType: number = 0; //小, 1 大, 2 巨大, 10
  public toward: number = 0; //默认角度
  public resource: number = 0;
  public handlerRange: number = 0; //事件攻击范围
  public dialogue: string;
  public param1: number = 0; //PVP中为teamid;
  public param2: number = 0;
  public param3: string;
  public param4: string;
  public param5: string;
  public sort: number = 0;

  public funcType: string;
  public uid: string; //唯一标识符
  public layer: number = 0; //0:底层, 2顶层
  public stateId: number = 0; //天空之城掉落配置；默认为0；1位显示, 0为隐藏
  public static STATE0: number = 0; //隐藏
  public static STATE1: number = 1; //显示
  private _handlerRangePoints: any[];

  constructor() {
    super();
  }

  public get handlerRangePoints(): any[] {
    return this._handlerRangePoints;
  }

  public initHandlerRangePoints(model: SpaceModel) {
    this._handlerRangePoints = [];
    let i: number;
    let j: number;
    let point: Laya.Point;
    for (i = 0, j = this.handlerRange; i <= this.handlerRange; i++, j--) {
      if (model.getWalkable(this.curPosX + i, this.curPosY + j)) {
        point = new Laya.Point(this.curPosX + i, this.curPosY + j);
        this._handlerRangePoints.push(point);
      }
      if (model.getWalkable(this.curPosX + i, this.curPosY - j)) {
        point = new Laya.Point(this.curPosX + i, this.curPosY - j);
        this._handlerRangePoints.push(point);
      }
      if (model.getWalkable(this.curPosX + j, this.curPosY + i)) {
        point = new Laya.Point(this.curPosX + j, this.curPosY + i);
        this._handlerRangePoints.push(point);
      }
      if (model.getWalkable(this.curPosX - j, this.curPosY + i)) {
        point = new Laya.Point(this.curPosX - j, this.curPosY + i);
        this._handlerRangePoints.push(point);
      }
    }
  }
}
