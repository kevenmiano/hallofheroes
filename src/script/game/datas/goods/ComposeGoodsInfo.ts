import ConfigMgr from "../../../core/config/ConfigMgr";
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { t_s_composeData } from "../../config/t_s_compose";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { ConfigType } from "../../constant/ConfigDefine";

export class ComposeGoodsInfo extends GameEventDispatcher {
  public cellType: number = 0;
  public groupId: number = 0;
  public templateId: number = 0;

  private _ownCount1: number = 0;
  private _ownCount2: number = 0;
  private _ownCount3: number = 0;
  private _ownCount4: number = 0;

  private _canMakeCount1: number = 0;
  private _canMakeCount2: number = 0;
  private _canMakeCount3: number = 0;
  private _canMakeCount4: number = 0;

  public get template(): t_s_composeData {
    return ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_compose,
      this.templateId
    );
  }
  public get itemTemplate(): t_s_itemtemplateData {
    return ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      this.template.NewMaterial
    );
  }

  public get ownCount1(): number {
    return this._ownCount1;
  }

  public set ownCount1(value: number) {
    this._ownCount1 = value;
    this._canMakeCount1 = this._ownCount1 / this.template.Count1;
  }

  public get ownCount2(): number {
    return this._ownCount2;
  }

  public set ownCount2(value: number) {
    this._ownCount2 = value;
    this._canMakeCount2 =
      this.template.Count2 > 0
        ? this._ownCount2 / this.template.Count2
        : this._ownCount2;
  }

  public get ownCount3(): number {
    return this._ownCount3;
  }

  public set ownCount3(value: number) {
    this._ownCount3 = value;
    this._canMakeCount3 =
      this.template.Count3 > 0
        ? this._ownCount3 / this.template.Count3
        : this._ownCount3;
  }

  public get ownCount4(): number {
    return this._ownCount4;
  }

  public set ownCount4(value: number) {
    this._ownCount4 = value;
    this._canMakeCount4 =
      this.template.Count4 > 0
        ? this._ownCount4 / this.template.Count4
        : this._ownCount4;
  }

  public getCanMakeCount(): number {
    var num: number = Number.MAX_VALUE;
    if (this.template.Material1 > 0)
      num = this._canMakeCount1 <= 0 ? 0 : this._canMakeCount1;

    if (this.template.Material2 > 0)
      num = this._canMakeCount2 < num ? this._canMakeCount2 : num;

    if (this.template.Material3 > 0)
      num = this._canMakeCount3 < num ? this._canMakeCount3 : num;

    if (this.template.Material4 > 0)
      num = this._canMakeCount4 < num ? this._canMakeCount4 : num;
    if (num == Number.MAX_VALUE)
      throw new Error("模板有问题, 该公式不需要任何材料");
    return Math.floor(num);
  }

  private _canMakeCount: number = 0;
  public get canMakeCount(): number {
    // if (this.itemTemplate.SonType == GoodsSonType.SONTYPE_MOUNT_CARD) {
    //     // 只能合成一件的坐骑卡
    //     let justOne = ForgeData.checkComposeOneMountCard(this.template.NewMaterial)
    //     if (justOne) {
    //         // 是否已经合成
    //         let bBagHas = GoodsManager.Instance.getGoodsByGoodsTId(this.template.NewMaterial)
    //         // 是否已经激活
    //         let bLight = MountsManager.Instance.avatarList.isLightTemplate(this.itemTemplate.Property1)
    //         if (bBagHas.length == 0 && !bLight && this._canMakeCount > 0) {
    //             return 1
    //         } else {
    //             return 0
    //         }
    //     }
    // }

    return this._canMakeCount;
  }
  public set canMakeCount(value: number) {
    this._canMakeCount = value;
  }
}
