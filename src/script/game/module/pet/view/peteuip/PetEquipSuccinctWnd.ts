import ConfigMgr from "../../../../../core/config/ConfigMgr";
import LangManager from "../../../../../core/lang/LangManager";
import { PackageIn } from "../../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../../core/net/ServerDataManager";
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../../core/ui/UIManager";
import { BaseItem } from "../../../../component/item/BaseItem";
import ColorConstant from "../../../../constant/ColorConstant";
import { ConfigType } from "../../../../constant/ConfigDefine";
import { EmWindow } from "../../../../constant/UIDefine";
import { S2CProtocol } from "../../../../constant/protocol/S2CProtocol";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../../manager/GoodsManager";
import PetCtrl from "../../control/PetCtrl";
import { PetEquipCell } from "./PetEquipCell";
import PetEquipSuccinctItem from "./PetEquipSuccinctItem";

//@ts-expect-error: External dependencies
import PetEquipRefreshRspMsg = com.road.yishi.proto.pet.PetEquipRefreshRspMsg;
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import Utils from "../../../../../core/utils/Utils";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
export default class PetEquipSuccinctWnd extends BaseWindow {
  public comp_consume: BaseItem;
  public petEquipCell: PetEquipCell;
  public comp_frontItem: PetEquipSuccinctItem;
  public comp_afterItem: PetEquipSuccinctItem;

  private _petId: number;
  private _profile: number; // 0白 1绿 2蓝 3紫 4橙 5红
  private _fontGoodsInfo: GoodsInfo;
  private _afterGoodsInfo: GoodsInfo;
  private _templateId: number = 2127103;
  private _templateCount: number = 1;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initView();
  }

  private initView() {
    this["img_background1"].scaleX = 1;
    this["img_background1"].scaleY = 1;
  }

  private helpBtnClick() {
    let title: string = LangManager.Instance.GetTranslation("public.help");
    let content: string =
      LangManager.Instance.GetTranslation("PetFrame.help10");
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private btn_succincClick() {
    this["btn_succinc"].enabled = false;
    this["btn_change"].enabled = false;

    if (
      GoodsManager.Instance.getGoodsNumByTempId(this._templateId) <
      this._templateCount
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("pet.exchange.template.lack"),
      );
      this["btn_succinc"].enabled = true;
      this["btn_change"].enabled = true;
      return;
    }

    PetCtrl.reqPetEquipSuccinc(
      this._petId,
      this._fontGoodsInfo.bagType,
      this._fontGoodsInfo.pos,
      0,
    );
  }

  private btn_changeClick() {
    this["btn_succinc"].enabled = false;
    this["btn_change"].enabled = false;
    PetCtrl.reqPetEquipSuccinc(
      this._petId,
      this._fontGoodsInfo.bagType,
      this._fontGoodsInfo.pos,
      1,
    );
  }

  OnShowWind() {
    super.OnShowWind();
    this._fontGoodsInfo = this.params;
    if (!this._fontGoodsInfo) return;
    this._petId = this._fontGoodsInfo.petData
      ? this._fontGoodsInfo.petData.petId
      : this._fontGoodsInfo.objectId;
    this.updateView();
    PetCtrl.reqPetEquipSuccinc(
      this._petId,
      this._fontGoodsInfo.bagType,
      this._fontGoodsInfo.pos,
      2,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_PET_SUCCINCT,
      this,
      this.onHandleServerData,
    );
  }

  set info(value: GoodsInfo) {
    this._fontGoodsInfo = value;
    if (!this._fontGoodsInfo) return;
    this.petCtrl.succinctEquip = true;
    this._petId = this._fontGoodsInfo.petData
      ? this._fontGoodsInfo.petData.petId
      : this._fontGoodsInfo.objectId;
  }

  private deepCopyWithAccessors<T>(obj: T): T {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    let copy: any = Object.create(Object.getPrototypeOf(obj));

    const descriptors = Object.getOwnPropertyDescriptors(obj);

    for (const key in descriptors) {
      if (Object.prototype.hasOwnProperty.call(descriptors, key)) {
        const descriptor = descriptors[key];

        if (descriptor && (descriptor.get || descriptor.set)) {
          // 处理访问器属性
          const newDescriptor: PropertyDescriptor = {};

          if (descriptor.get) {
            newDescriptor.get = descriptor.get;
          }

          if (descriptor.set) {
            newDescriptor.set = descriptor.set;
          }

          Object.defineProperty(copy, key, newDescriptor);
        } else {
          // 处理普通属性
          copy[key] = this.deepCopyWithAccessors(obj[key]);
        }
      }
    }

    return copy;
  }

  private onHandleServerData(pkg: PackageIn) {
    this.refreshTemplate();

    this["btn_succinc"].enabled = true;
    this["btn_change"].enabled = true;

    let msg = pkg.readBody(PetEquipRefreshRspMsg) as PetEquipRefreshRspMsg;
    this._afterGoodsInfo = null;
    if ((msg.op === 0 || msg.op === 2) && msg.masterAttr && msg.sonAttr) {
      this.getController("succinct").selectedIndex = 1;
      // 洗炼
      this._afterGoodsInfo = this.deepCopyWithAccessors(this._fontGoodsInfo);
      if (msg.masterAttr) {
        this._afterGoodsInfo.masterAttr = msg.masterAttr;
      }

      if (msg.sonAttr) {
        this._afterGoodsInfo.sonAttr = msg.sonAttr;
      }

      if (msg.petSuitId) {
        this._afterGoodsInfo.suitId = msg.petSuitId;
      }
      this.updateView(false);
    } else if (msg.op === 1) {
      this.getController("succinct").selectedIndex = 0;
      // 替换
      if (msg.masterAttr) {
        this._fontGoodsInfo.masterAttr = msg.masterAttr;
      }

      if (msg.sonAttr) {
        this._fontGoodsInfo.sonAttr = msg.sonAttr;
      }

      if (msg.petSuitId) {
        this._fontGoodsInfo.suitId = msg.petSuitId;
      }
      this.updateView(true);
    }
  }

  private updateView(refreshFont: boolean = true) {
    this["img_background1"].scaleX = 1;
    this["img_background1"].scaleY = 1;

    this.petEquipCell.info = this._fontGoodsInfo;
    this["txt_petEuipName"].color =
      this._fontGoodsInfo.templateInfo.profileColor;
    this["txt_petEuipName"].text =
      this._fontGoodsInfo.templateInfo.TemplateNameLang;
    this["txt_petEuipStrengCount"].text =
      "+" + this._fontGoodsInfo.strengthenGrade;

    this.refreshTemplate();

    if (refreshFont) this.comp_frontItem.info = this._fontGoodsInfo;
    if (this._afterGoodsInfo) {
      this.comp_afterItem.getController("showItem").selectedIndex = 1;
      this.comp_afterItem.info = this._afterGoodsInfo;
    } else {
      this.comp_afterItem.getController("showItem").selectedIndex = 0;
    }
  }

  /**刷新消耗物品 */
  private refreshTemplate() {
    this._templateId = this._fontGoodsInfo.templateInfo.Property6;

    let config: any = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_config,
      "pet_equip_refresh",
    );
    if (config) {
      let configs = config.ConfigValue.split(",");
      this._templateCount =
        Number(configs[0]) +
        Number(configs[1]) *
          Math.floor(this._fontGoodsInfo.strengthenGrade / 5);
    }

    let gInfo: GoodsInfo;
    gInfo = new GoodsInfo();
    gInfo.count = this._templateCount;
    gInfo.templateId = this._templateId;

    let goodsCount: number = GoodsManager.Instance.getGoodsNumByTempId(
      this._templateId,
    );

    this.comp_consume.info = gInfo;
    this.comp_consume.text =
      "[color=" +
      this.getLackColor(goodsCount >= this._templateCount) +
      "]" +
      goodsCount +
      "[/color]/" +
      this._templateCount;
    this.comp_consume.isConsume.selectedIndex = 1;
  }

  /**数量不够展示红色 */
  private getLackColor(isFixed: boolean): string {
    if (isFixed) {
      return ColorConstant.WHITE_COLOR;
    } else {
      return ColorConstant.RED_COLOR;
    }
  }

  private get petCtrl(): PetCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Pet) as PetCtrl;
  }

  OnHideWind() {
    this._petId = null;
    this._profile = null;
    this._fontGoodsInfo = null;
    this._afterGoodsInfo = null;
    this.petCtrl.succinctEquip = false;
    ServerDataManager.cancel(
      S2CProtocol.U_C_PET_SUCCINCT,
      this,
      this.onHandleServerData,
    );
    super.OnHideWind();
  }
}
