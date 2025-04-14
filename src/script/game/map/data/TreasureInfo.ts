import ConfigMgr from "../../../core/config/ConfigMgr";
import { t_s_mapphysicpositionData } from "../../config/t_s_mapphysicposition";
import { ConfigType } from "../../constant/ConfigDefine";
import NodeMapPhysics from "../space/data/NodeMapPhysics";

export default class TreasureInfo extends NodeMapPhysics {
  public id: number = 0; // 野地编号
  public mapId: number = 0; // 所属地图编号
  private _templateId: number;
  public type: number = 0; //1=大宝藏矿脉  2=小宝藏矿脉
  private _tempInfo: t_s_mapphysicpositionData;

  public get tempInfo(): t_s_mapphysicpositionData {
    return this._tempInfo;
  }

  public get templateId(): number {
    return this._templateId;
  }

  public set templateId(value: number) {
    this._templateId = value;
    this._tempInfo = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_mapphysicposition,
      this._templateId.toString(),
    ) as t_s_mapphysicpositionData;
  }
}
