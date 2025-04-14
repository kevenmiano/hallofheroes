import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { EquipTip } from "./EquipTip";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { EquipTipView } from "./EquipTipView";
import { GoodsManager } from "../manager/GoodsManager";
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";
import { NotificationManager } from "../manager/NotificationManager";
import { TipsEvent } from "../constant/event/NotificationEvent";
import LangManager from "../../core/lang/LangManager";
import GoodsSonType from "../constant/GoodsSonType";
import { Directions } from "../manager/ToolTipsManager";
import BaseTips from "./BaseTips";
import { BagHelper } from "../module/bag/utils/BagHelper";
import GroupLayoutType = fgui.GroupLayoutType;
import Resolution from "../../core/comps/Resolution";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/20 15:46
 * @ver 1.0
 *
 */
export class EquipContrastTips extends BaseTips {
  public goodstip2: EquipTipView;
  public goodstip3: EquipTipView;
  public goodstip1: EquipTipView;
  public totalBox: fgui.GGroup;

  private _info: GoodsInfo;
  private _canOperate: boolean;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();

    this.initData();
    this.initView();
    this.addEvent();

    this.updateTransform();
    this.goodstip1.ensureBoundsCorrect();
    this.goodstip2.ensureBoundsCorrect();
    this.goodstip3.ensureBoundsCorrect();
    this.totalBox.ensureBoundsCorrect();
  }

  private initData() {
    [this._info, this._canOperate] = this.params;
  }

  private initView() {
    this.goodstip2.equipType = EquipTip.EQUIPED;
    this.goodstip3.equipType = EquipTip.EQUIPED;
  }

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      TipsEvent.EQUIP_TIPS_HIDE,
      this.OnBtnClose,
      this,
    );
    NotificationManager.Instance.addEventListener(
      TipsEvent.EQUIP_TIPS_OBTAIN,
      this.onObtain,
      this,
    );
  }

  private onObtain() {
    if (this.goodstip3.visible) {
      this.goodstip3.alpha = 0;
      // this.goodstip3.x -= 265;
    }
    if (this.goodstip2.visible) {
      this.goodstip2.alpha = 0;
      // this.goodstip2.x -= 265;
    }
    // // if(this.goodstip1.visible){
    // //     this.goodstip1.x -= 265;
    // // }
    // this.goodstip1.ensureBoundsCorrect();
    // this.goodstip2.ensureBoundsCorrect();
    // this.goodstip3.ensureBoundsCorrect();
    // this.totalBox.ensureBoundsCorrect();
    let point = this.goodstip1.parent.localToGlobal(
      this.goodstip1.x,
      this.goodstip1.y,
    );
    //当前方向
    if (point.x + this.goodstip1.width >= Resolution.gameWidth) {
      this.totalBox.x -= 265;
    }
  }

  private updateTransform() {
    this.clean();

    if (!this._info) {
      return;
    }

    this.goodstip1.canOperate = this._canOperate;
    this.goodstip1.info = this._info;
    this.goodstip1.visible = true;

    let equipeds: any[] = GoodsManager.Instance.getHeroGoodsListBySonTypeAndId(
      this._info.templateInfo.SonType,
      this.thane.id,
    ).getList();
    equipeds = ArrayUtils.sortOn(equipeds, "pos", ArrayConstant.NUMERIC);
    let equiped: GoodsInfo;
    if (equipeds.length >= 2) {
      this.goodstip1.btn_use.text = LangManager.Instance.GetTranslation(
        "armyII.viewII.skill.btnEquipExchange",
      ); //替换
      equiped = equipeds[0] as GoodsInfo;
      this.goodstip2.showObtain = false;
      this.goodstip2.info = equiped;
      this.goodstip2.visible = true;
      equiped = equipeds[1] as GoodsInfo;
      this.goodstip3.showObtain = false;
      this.goodstip3.info = equiped;
      this.goodstip3.visible = true;
    } else if (equipeds.length >= 1) {
      equiped = equipeds[0] as GoodsInfo;
      this.goodstip2.showObtain = false;
      this.goodstip2.info = equiped;
      this.goodstip2.visible = true;
      if (
        equiped.templateInfo.SonType == GoodsSonType.SONTYPE_RING ||
        equiped.templateInfo.SonType == GoodsSonType.SONTYPE_TRINKET
      ) {
        //戒指和饰品有两个, 只装备了1个的情况下 仍然显示装备按钮
        this.goodstip1.btn_use.text = LangManager.Instance.GetTranslation(
          "armyII.viewII.skill.btnEquipOn",
        ); //装备
      } else {
        this.goodstip1.btn_use.text = LangManager.Instance.GetTranslation(
          "armyII.viewII.skill.btnEquipExchange",
        ); //替换
      }
    } else {
    }
    //时装合成界面显示放入和卸下
    if (this._canOperate && BagHelper.isOpenFashionWnd()) {
      this.goodstip1.initFashion();
    }

    this.goodstip2.btn_use.visible = false;
    this.goodstip3.btn_use.visible = false;

    if (BagHelper.isOpenConsortiaStorageWnd()) {
      //是否打开公会宝箱
      this.goodstip1.btn_use.text = BagHelper.getText(this._info);
      this.goodstip1.btn_use.visible = true;
    }
  }

  /**
   * ToolTipsManager中调用
   * @param value
   */
  public set direction(value: number) {
    switch (value) {
      case Directions.DIRECTION_BL:
      case Directions.DIRECTION_L:
      case Directions.DIRECTION_TL:
      case Directions.DIRECTION_B:
        break;
      case Directions.DIRECTION_BR:
      case Directions.DIRECTION_R:
      case Directions.DIRECTION_TR:
      case Directions.DIRECTION_T:
        //NOTE 有布局的Group只能先取消布局再调换位置、然后开启布局立即重排, 否则位置卡的死死的动不了
        this.totalBox.layout = GroupLayoutType.None;
        this.totalBox.ensureBoundsCorrect();
        this.contentPane.swapChildren(this.goodstip1, this.goodstip2);
        this.totalBox.layout = GroupLayoutType.Horizontal;
        this.totalBox.ensureBoundsCorrect();

        // this.contentPane.addChild(this.goodstip1);
        // this.contentPane.addChild(this.goodstip3);
        // this.contentPane.addChild(this.goodstip2);

        // let tempX:number = this.goodstip1.x;
        // this.goodstip1.x = this.goodstip2.x;
        // this.goodstip2.x = tempX;
        break;
    }
    this.contentPane.ensureBoundsCorrect();
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private clean() {
    this.goodstip2.info = null;
    this.goodstip3.info = null;
    this.goodstip1.info = null;
    this.goodstip2.visible = false;
    this.goodstip3.visible = false;
    this.goodstip1.visible = false;
  }

  protected OnClickModal() {
    super.OnClickModal();
    this.hide();
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      TipsEvent.EQUIP_TIPS_HIDE,
      this.OnBtnClose,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      TipsEvent.EQUIP_TIPS_OBTAIN,
      this.onObtain,
      this,
    );
  }

  public OnHideWind() {
    super.OnHideWind();

    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    this._info = null;
    super.dispose(dispose);
  }
}
