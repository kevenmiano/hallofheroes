import ObjectUtils from "../../core/utils/ObjectUtils";
import { AppellView } from "../avatar/view/AppellView";
import { ShowAvatar } from "../avatar/view/ShowAvatar";
import { t_s_appellData } from "../config/t_s_appell";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import GoodsSonType from "../constant/GoodsSonType";
import { EmWindow } from "../constant/UIDefine";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { TempleteManager } from "../manager/TempleteManager";
import { GoodsCheck } from "../utils/GoodsCheck";
import BaseTips from "./BaseTips";
import { EquipTipView } from "./EquipTipView";

/**
 * 技能提示
 */
export default class AvatarTips extends BaseTips {
  private tipData: any;
  private canOperate: any;
  _figure: any;
  private _showThane: any;
  thane: any;
  public bg: fgui.GLoader;
  public equipTip: EquipTipView;
  tipType: EmWindow;
  startPoint: Laya.Point;
  public itemList: fgui.GList;
  rewardData: GoodsInfo[] = [];
  private _honerView: AppellView;

  public OnInitWind() {
    super.OnInitWind();
    this.initData();
    this.setTipsData();
  }

  protected onClickEvent() {
    this.onInitClick();
  }

  private initData() {
    [this.tipData, this.canOperate] = this.params;
    this.itemList.itemRenderer = Laya.Handler.create(
      this,
      this.renderItem,
      null,
      false
    );
  }

  setTipsData() {
    if (!this.tipData) return;
    // let id = this.tipData.split(',')[0];
    // let info: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(id);

    let rewardItem: string[] = this.tipData.split("|");
    let count = rewardItem.length;
    for (let index = 0; index < count; index++) {
      let tempStr = rewardItem[index];
      let infos = tempStr.split(",");
      let goods = new GoodsInfo();
      goods.templateId = Number(infos[0]);
      goods.count = Number(infos[1]);

      // let info: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(goods.templateId);
      // if (info && info.SonType == GoodsSonType.SONTYPE_APPELL) {
      //     goods.id = -1;
      // }
      this.rewardData.push(goods);
    }

    this.itemList.numItems = this.rewardData.length;
    this.itemList.resizeToFit();

    for (let i = 0; i < this.rewardData.length; i++) {
      let info: t_s_itemtemplateData =
        TempleteManager.Instance.getGoodsTemplatesByTempleteId(
          this.rewardData[i].templateId
        );
      if (!info) {
        return;
      }
      let isAppell = info.SonType == GoodsSonType.SONTYPE_APPELL;
      let isFashion = GoodsCheck.isFashion(info);
      if (isFashion) {
        this._figure = new ShowAvatar(true);
        this._figure.x = 50;
        this._figure.y = 100;
        this._figure.mouseEnabled = false;
        this.thane = ArmyManager.Instance.thane;
        this._showThane = new ThaneInfo();
        this._showThane.templateId = this.thane.templateId;
        this._showThane.armsEquipAvata = this.thane.armsEquipAvata;
        this._showThane.bodyEquipAvata = this.thane.bodyEquipAvata;
        this._showThane.wingAvata = this.thane.wingEquipAvata;
        this._showThane.armsFashionAvata = this.thane.armsFashionAvata;
        this._showThane.bodyFashionAvata = this.thane.bodyFashionAvata;
        this._showThane.hairFashionAvata = this.thane.hairFashionAvata;
        switch (info.SonType) {
          case GoodsSonType.FASHION_CLOTHES:
            this._showThane.bodyFashionAvata = info.Avata;
            break;
          case GoodsSonType.FASHION_HEADDRESS:
            this._showThane.hairFashionAvata = info.Avata;
            break;
          case GoodsSonType.FASHION_WEAPON:
            this._showThane.armsFashionAvata = info.Avata;
            break;
          case GoodsSonType.SONTYPE_WING:
            this._showThane.wingAvata = info.Avata;
            break;
        }
        this._figure.data = this._showThane;

        this.bg.displayObject.addChild(this._figure);
      }
      if (isAppell) {
        let appellId = info.Property2;
        if (!appellId) {
          return;
        }
        // let appellInfo = ArmyManager.Instance.thane.appellInfo;
        let appellInfo: t_s_appellData =
          TempleteManager.Instance.getAppellTemplateByID(appellId);
        if (appellInfo) {
          this._honerView = new AppellView(
            appellInfo.ImgWidth,
            appellInfo.ImgHeight,
            appellInfo.TemplateId
          );
          this._honerView.x = 180;
          this._honerView.y = 70;
          this.bg.displayObject.addChild(this._honerView);
        }
      }
    }

    // let gInfo: GoodsInfo = new GoodsInfo();
    // gInfo.templateId = id;
    // this.equipTip.info = gInfo;
  }

  renderItem(index: number, item: EquipTipView) {
    item.info = this.rewardData[index];
  }

  public OnHideWind() {
    super.OnHideWind();
  }

  dispose(dispose?: boolean) {
    ObjectUtils.disposeObject(this._figure);
    super.dispose(dispose);
    // this.itemList.itemRenderer.recover();
  }
}
