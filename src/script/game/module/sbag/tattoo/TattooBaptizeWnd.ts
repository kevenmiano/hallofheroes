import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { TattooHoleView } from "./TattooHoleView";
import UIButton from "../../../../core/ui/UIButton";
import { RoleCtrl } from "../../bag/control/RoleCtrl";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { TattooHole } from "./model/TattooHole";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TattooModel } from "./model/TattooModel";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import { BagType } from "../../../constant/BagDefine";
import { GoodsManager } from "../../../manager/GoodsManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ArmyEvent } from "../../../constant/event/NotificationEvent";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import Logger from "../../../../core/logger/Logger";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import StringUtils from "../../../utils/StringUtils";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/1/9 21:33
 * @ver 1.0
 */

export class TattooBaptizeWnd extends BaseWindow {
  public showTips: fgui.Controller;
  public oldName: fgui.Controller;
  public newName: fgui.Controller;
  public useBind: fgui.Controller;
  public frame: fgui.GLabel;
  public icon_old: TattooHoleView;
  public txt_name_old: fgui.GTextField;
  public lock_old_0: fgui.GButton;
  public lock_old_1: fgui.GButton;
  public btnn_tips: fgui.GButton;
  public txt_oldAddProperty: fgui.GTextField;
  public txt_oldReduceProperty: fgui.GTextField;
  public icon_new: TattooHoleView;
  public txt_name_new: fgui.GTextField;
  public txt_newAddProperty: fgui.GTextField;
  public txt_newReduceProperty: fgui.GTextField;
  public btn_replace: UIButton;
  public txt_material_0: fgui.GTextField;
  public txt_material_1: fgui.GTextField;
  public btn_baptize: UIButton;
  public txt_tips_0: fgui.GTextField;
  // public txt_senior_material_0:fgui.GTextField;
  // public txt_senior_material_1:fgui.GTextField;
  // public btn_senior_baptize:UIButton;
  // public txt_tips_1:fgui.GTextField;
  public txt_condition: fgui.GTextField;
  public tipsmask: fgui.GGraph;

  private _oldAddValue: number = 0;
  private _notAlert1: boolean = false;
  //		private static _autoBuyNotAlert:boolean = false;//自动购买染料
  private static _autoBuyUseBind: boolean = false; //自动购买染料, true为使用绑钻
  private static _lockUseBind: boolean = true; //锁定属性, true为使用绑钻
  private lockNeedPoints: number = 0; //锁定需要多少钻
  private autoBuyNeedPoints: number = 0; //购买缺少的材料需要多少钻
  private autoBuyNeedPoints2: number = 0; //购买缺少的高级材料需要多少钻
  private costNum: number = 100;
  private _index: number = 0;
  protected setOptimize: boolean = false;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.initData();
    this.initView();
    this.initEvent();
    this.setCenter();
  }

  protected get modelAlpha(): number {
    return 0;
  }

  private initData() {
    this.showTips = this.getController("showTips");
    this.oldName = this.getController("oldName");
    this.newName = this.getController("newName");
    this.useBind = this.getController("useBind");
  }

  private initView() {
    this.refresh();
    this.refreshPoint();
  }

  private initEvent() {
    this.tipsmask.onClick(this, this.onTipsMaskClick);
    this.btn_replace.onClick(this, this.__onReplaceAttriBtnClick);
    this.btn_baptize.onClick(this, this.__onTattooBtnClick);
    // this.btn_senior_baptize.onClick(this, this.__onSeniorTattooBtnClick);
    this.lock_old_0.onClick(this, this.__tattooLockBtn1ClickHandler);
    this.lock_old_1.onClick(this, this.__tattooLockBtn2ClickHandler);

    // _autoBuySelectButton.addEventListener(MouseEvent.CLICK, __autoBuySelectButtonClickHandler);
    NotificationManager.Instance.addEventListener(
      ArmyEvent.TATTOO_INFO,
      this.updateTattooInfo,
      this,
    );
  }

  public OnShowWind() {
    super.OnShowWind();

    // this.refresh();
    // this.refreshPoint();
  }

  private onTipsMaskClick() {
    this.showTips.selectedIndex = 0;
  }

  public refresh(): void {
    this._index = this.tattooModel.currHoleIndex;
    let hole: TattooHole = this.holes[this._index];
    if (!hole) {
      hole = new TattooHole();
    }
    let addPropertyStr: string = "";
    let reducePropertyStr: string = "";
    this.btn_baptize.enabled = true;

    // this.icon_old.info = hole;
    this.icon_old.setHoleInfo(2, hole);
    if (hole.oldAddProperty >= 0) {
      this._oldAddValue = hole.oldAddingValue;
      addPropertyStr = LangManager.Instance.GetTranslation(
        "tattoo.TattooPopFrame.propertyName" + hole.oldAddProperty,
      );
      reducePropertyStr = LangManager.Instance.GetTranslation(
        "tattoo.TattooPopFrame.propertyName" + hole.oldReduceProperty,
      );

      this.icon_old.visible = true;
      this.oldName.selectedIndex = 0;
      //[color=#ffc68f]{name=力量}[/color]龙纹
      this.txt_name_old.setVar("name", addPropertyStr).flushVars();

      this.txt_oldAddProperty.text =
        addPropertyStr + "  +" + hole.oldAddingValue;
      this.txt_oldReduceProperty.text =
        reducePropertyStr + "  " + hole.oldReduceValue;
      this.lock_old_0.visible = true;
      this.lock_old_1.visible = true;
      this.lock_old_0.selected = hole.isLockAdd;
      this.lock_old_1.selected = hole.isLockReduce;
    } else {
      this.icon_old.visible = false;
      this.oldName.selectedIndex = 1;
      this.txt_oldAddProperty.text = "";
      this.txt_oldReduceProperty.text = "";
      this.lock_old_0.visible = false;
      this.lock_old_1.visible = false;
    }

    // this.icon_new.newInfo = hole;
    this.icon_new.setHoleInfo(3, hole);
    if (hole.newAddProperty >= 0) {
      this.icon_new.visible = true;
      addPropertyStr = LangManager.Instance.GetTranslation(
        "tattoo.TattooPopFrame.propertyName" + hole.newAddProperty,
      );
      reducePropertyStr = LangManager.Instance.GetTranslation(
        "tattoo.TattooPopFrame.propertyName" + hole.newReduceProperty,
      );
      this.newName.selectedIndex = 0;
      //[color=#ffc68f]{name=力量}[/color]龙纹
      this.txt_name_new.setVar("name", addPropertyStr).flushVars();
      this.txt_newAddProperty.text =
        addPropertyStr + "  +" + hole.newAddingValue;
      this.txt_newReduceProperty.text =
        reducePropertyStr + "  " + hole.newReduceValue;
      this.btn_replace.visible = true;
    } else {
      this.icon_new.visible = false;
      this.newName.selectedIndex = 1;
      this.btn_replace.visible = false;
      this.txt_newAddProperty.text = "";
      this.txt_newReduceProperty.text = "";
    }
    this.txt_material_0.text = this.tattooModel.tattooConsumeNum + ""; //GoodsManager.Instance.getBagCountByTempId(BagType.Player, this.tattooController.tattooModel.tattooConsumeId) + "";
    this.txt_tips_0.text = this.getTattooAddRange(hole);
    // this.txt_senior_material_0.text = GoodsManager.Instance.getBagCountByTempId(BagType.Player, this.tattooController.tattooModel.highTattooConsumeId) + "";
    // this.txt_tips_1.text = this.getSeniorTattooAddRange(hole);

    let nextLv: number = this.tattooModel.getGradeByStep(
      this.tattooModel.coreStep,
    );
    if (nextLv > 0) {
      this.btnn_tips.visible = true;
      //{step=2}阶龙纹核心
      // 龙纹属性≧{value=2000}
      this.txt_condition
        .setVar(
          "step",
          StringUtils.getRomanNumber(this.tattooModel.coreStep + 1),
        )
        .setVar(
          "value",
          this.tattooModel.getProtertyValueMaxByStep(hole.oldStep).toString(),
        )
        .flushVars();
    } else {
      this.btnn_tips.visible = false;
    }
  }

  private getTattooAddRange(hole: TattooHole): string {
    let max: number = this.tattooModel.getTattooMaxAddValue(hole);
    // let max:number = (Number)(Math.ceil(10 * (primaryMax - hole.oldAddingValue) / primaryMax));
    if (max > 1) {
      return (
        LangManager.Instance.GetTranslation(
          "tattoo.TattooPopFrame.AddProperty",
        ) +
        "1~" +
        max
      );
    } else if (max == 1) {
      return (
        LangManager.Instance.GetTranslation(
          "tattoo.TattooPopFrame.AddProperty",
        ) + "1"
      );
    } else {
      return LangManager.Instance.GetTranslation(
        "tattoo.TattooPopFrame.tattooCannotAdd",
      );
    }
  }

  private clickIndex: number = 0;

  protected __tattooLockBtn1ClickHandler(): void {
    this.clickIndex = 1;
    if (this.lock_old_0.selected) {
      this.lock_old_0.selected = false;
      this.refreshPoint();
      this.showLockAlert();
    } else {
      this.switchState();
      this.refreshPoint();
    }
  }

  protected __tattooLockBtn2ClickHandler(): void {
    this.clickIndex = 2;
    if (this.lock_old_1.selected) {
      this.lock_old_1.selected = false;
      this.refreshPoint();
      this.showLockAlert();
    } else {
      this.switchState();
      this.refreshPoint();
    }
  }

  private isFirstTimeLock: boolean = true;

  private showLockAlert(): void {
    if (this.isFirstTimeLock) {
      let tip: string = LangManager.Instance.GetTranslation(
        "TattooPopFrame.lockCostPrompt",
      ); //洗炼时锁定的属性会保留, 但每次洗炼会额外消耗钻石, 确定锁定？
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.USEBINDPOINT_ALERT,
        null,
        prompt,
        tip,
        confirm,
        cancel,
        this.showLockAlertBack.bind(this),
      );
    } else {
      this.showLockAlertBack(true, TattooBaptizeWnd._lockUseBind);
    }
  }

  /**
   * @param b确认: true；取消: false
   * @param payType
   */
  private showLockAlertBack(b: boolean, payType: boolean): void {
    if (b) {
      this.isFirstTimeLock = false;
      TattooBaptizeWnd._lockUseBind = payType;
      this.useBind.selectedIndex = payType ? 1 : 0;
      let clickedBtn: fgui.GButton =
        this.clickIndex == 1 ? this.lock_old_0 : this.lock_old_1;
      clickedBtn.selected = true;
      this.switchState();
      this.refreshPoint();
    } else {
      this.isFirstTimeLock = true;
    }
  }

  private switchState(): void {
    let hole: TattooHole = this.holes[this._index];
    if (this.clickIndex == 1) {
      (this.holes[this._index] as TattooHole).isLockAdd = !(
        this.holes[this._index] as TattooHole
      ).isLockAdd;
      let isLockAdd: boolean = (this.holes[this._index] as TattooHole)
        .isLockAdd;
      Logger.yyz("切换到了【" + (isLockAdd ? "" : "不") + "锁定】增加属性");
      // _nowTattooAddPropertyTxt.setFrame(isLockAdd ? 2 : 1);

      //[color=#ffc68f]{name=力量}[/color]
      if (isLockAdd) {
        let arr = this.txt_oldAddProperty.text.split("  ");
        if (arr) {
          let str =
            "[color=#5DAF2C]" +
            arr[0] +
            "[/color]" +
            "&nbsp;[color=#FFECC6]" +
            arr[1] +
            "[/color]";
          this.txt_oldAddProperty.text = str;
        }
      } else {
        let addPropertyStr = LangManager.Instance.GetTranslation(
          "tattoo.TattooPopFrame.propertyName" + hole.oldAddProperty,
        );
        this.txt_oldAddProperty.text =
          addPropertyStr + "  +" + hole.oldAddingValue;
      }

      // this.txt_oldAddProperty.color = isLockAdd ? "#5DAF2C" : "#FFECC6";
    } else if (this.clickIndex == 2) {
      (this.holes[this._index] as TattooHole).isLockReduce = !(
        this.holes[this._index] as TattooHole
      ).isLockReduce;
      let isLockReduce: boolean = (this.holes[this._index] as TattooHole)
        .isLockReduce;
      Logger.yyz("切换到了【" + (isLockReduce ? "" : "不") + "锁定】减少属性");
      // _nowTattooReducePropertyTxt.setFrame(isLockReduce ? 2 : 1);
      if (isLockReduce) {
        let arr = this.txt_oldReduceProperty.text.split("  ");
        if (arr) {
          let str =
            "[color=#5DAF2C]" +
            arr[0] +
            "[/color]" +
            "&nbsp;[color=#FFECC6]" +
            arr[1] +
            "[/color]";
          this.txt_oldReduceProperty.text = str;
        }
      } else {
        let reducePropertyStr = LangManager.Instance.GetTranslation(
          "tattoo.TattooPopFrame.propertyName" + hole.oldReduceProperty,
        );
        this.txt_oldReduceProperty.text =
          reducePropertyStr + "  " + hole.oldReduceValue;
      }
      // this.txt_oldReduceProperty.color = isLockReduce ? "#5DAF2C" : "#FFECC6";
    }
  }

  /**
   * 刷新消耗钻石
   */
  private refreshPoint(): void {
    this.calcStillNeedPoint();
    this.txt_material_1.text =
      this.lockNeedPoints + this.autoBuyNeedPoints + "";
    // this.txt_senior_material_1.text = this.lockNeedPoints + this.autoBuyNeedPoints2 + "";
    let autoBuy: boolean = false; //_autoBuySelectButton.selected;
    if (!autoBuy) {
      this.btn_baptize.enabled = this.tattooModel.canUpgrade();
      let hasNum: number = GoodsManager.Instance.getBagCountByTempId(
        BagType.Player,
        TattooModel.DragonCrystalId,
      );
      this.txt_material_0.color =
        hasNum >= this.tattooModel.tattooConsumeNum ? "#FFECC6" : "#FF0000";
      // let needTempId2:number = this.tattooController.tattooModel.highTattooConsumeId;
      // let hasNum2:number = GoodsManager.Instance.getBagCountByTempId(BagType.Player, needTempId2);
      // this.btn_senior_baptize.enabled = hasNum2 >= this.tattooController.tattooModel.highTattooConsumeNum;
    } else {
      // this.btn_baptize.enabled = hasEnoughPoints(1);
      // this.btn_senior_baptize.enabled = hasEnoughPoints(2);
    }
  }

  /**
   *  计算除了已有的材料, 还需要多少钻石
   */
  private calcStillNeedPoint(): void {
    let isLockAdd: boolean = (this.holes[this._index] as TattooHole).isLockAdd;
    let isLockReduce: boolean = (this.holes[this._index] as TattooHole)
      .isLockReduce;
    this.lockNeedPoints = 0;
    let tattooRefreshLockPrice: number = 0; //this.tattooModel.tattooRefreshLockPrice;
    if (isLockAdd) {
      this.lockNeedPoints += tattooRefreshLockPrice;
    }
    if (isLockReduce) {
      this.lockNeedPoints += tattooRefreshLockPrice;
    }

    // let needTempId:number = this.tattooController.tattooModel.tattooDyeTempId;
    // let needTempId2:number = this.tattooController.tattooModel.seniorTattooDyeTempId;
    // let hasNum:number = GoodsManager.Instance.getBagCountByTempId(BagType.Player, needTempId);
    // let hasNum2:number = GoodsManager.Instance.getBagCountByTempId(BagType.Player, needTempId2);
    // let needNum:number = 100;
    // let content:string = "";
    // this.autoBuyNeedPoints = 0;
    // this.autoBuyNeedPoints2 = 0;
    // if(_autoBuySelectButton.selected && hasNum < needNum){//材料不够, 要补钻石
    //     let shopInfo:ShopGoodsInfo = TempleteManager.instance.getShopTempInfoByItemId(needTempId);
    //     let price:number = shopInfo.GiftToken;
    //     //				let price:number = 1;
    //     this.autoBuyNeedPoints = (needNum - hasNum) * price;
    // }
    // if(_autoBuySelectButton.selected && hasNum2 < needNum){//高级材料不够, 要补钻石
    //     let shopInfo2:ShopGoodsInfo = TempleteManager.instance.getShopTempInfoByItemId(needTempId2);
    //     let price2:number = shopInfo2.GiftToken;
    //     //				let price2:number = 100;
    //     this.autoBuyNeedPoints2 = (needNum - hasNum2) * price2;
    // }
  }

  private __onReplaceAttriBtnClick(): void {
    this.tattooController.sendReplace(
      this.tattooController.tattooModel.currHoleIndex,
    );
  }

  private tattooType: number = 0;

  private __onTattooBtnClick(): void {
    if (this._notAlert1) {
      this.checkAvailableReplace();
      return;
    }
    this.tattooType = 1;
    let hole: TattooHole = this.holes[this._index];
    if (
      this._oldAddValue >=
      this.tattooModel.getProtertyValueMaxByStep(hole.oldStep)
    ) {
      let content2000: string = LangManager.Instance.GetTranslation(
        "tattoo.TattooPopFrame.tattoo",
      );
      UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
        content: content2000,
        backFunction: this.checkAvailableReplace.bind(this),
        closeFunction: null,
        state: 2,
      });
    } else {
      this.checkAvailableReplace();
    }
  }

  private checkAvailableReplace(check: boolean = false): void {
    if (check) {
      this._notAlert1 = true;
    }

    if (this.tattooModel.notAlert) {
      this.tattooBtnClickCallback();
      return;
    }
    if (this.btn_replace.visible) {
      let content: string = LangManager.Instance.GetTranslation(
        "tattoo.TattooPopFrame.existsAvailableReplace02",
      ); //新龙纹未替换, 是否继续洗炼？
      UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
        content: content,
        backFunction: this.tattooBtnClickCallback.bind(this),
        closeFunction: null,
        state: 2,
      });
    } else {
      this.tattooBtnClickCallback();
    }
  }

  private tattooBtnClickCallback(check: boolean = false): void {
    if (check) {
      this.tattooModel.notAlert = true;
    }
    this.calcStillNeedPoint();
    this.checkPointsAndDoFresh();
  }

  /**
   * 检查钻石和绑钻够不够, 够就发请求
   */
  private checkPointsAndDoFresh(): void {
    if (!this.hasEnoughPoints(this.tattooType)) {
      //加上钻石也不够
      RechargeAlertMannager.Instance.show();
      return;
    }
    let currHoleIndex: number = this.tattooController.tattooModel.currHoleIndex;
    let isLockAdd: boolean = (this.holes[this._index] as TattooHole).isLockAdd;
    let isLockReduce: boolean = (this.holes[this._index] as TattooHole)
      .isLockReduce;
    let autoBuy: boolean = false; //_autoBuySelectButton.selected;
    this.tattooController.sendUpgrade(currHoleIndex);
  }

  private hasEnoughPoints(type: number): boolean {
    let needPoint: number = 0;
    let needGiftToken: number = 0;
    if (TattooBaptizeWnd._autoBuyUseBind) {
      needGiftToken +=
        type == 1 ? this.autoBuyNeedPoints : this.autoBuyNeedPoints2;
    } else {
      needPoint += type == 1 ? this.autoBuyNeedPoints : this.autoBuyNeedPoints2;
    }
    if (TattooBaptizeWnd._lockUseBind) {
      needGiftToken += this.lockNeedPoints;
    } else {
      needPoint += this.lockNeedPoints;
    }
    if (this.playerInfo.point < needPoint) {
      return false;
    }
    if (
      this.playerInfo.point + this.playerInfo.giftToken <
      needPoint + needGiftToken
    ) {
      return false;
    }
    return true;
  }

  private updateTattooInfo(): void {
    this.refresh();
    this.refreshPoint();
  }

  private removeEvent() {
    this.tipsmask.offClick(this, this.onTipsMaskClick);
    this.btn_replace.offClick(this, this.__onReplaceAttriBtnClick);
    this.btn_baptize.offClick(this, this.__onTattooBtnClick);
    // this.btn_senior_baptize.offClick(this, this.__onSeniorTattooBtnClick);
    this.lock_old_0.offClick(this, this.__tattooLockBtn1ClickHandler);
    this.lock_old_1.offClick(this, this.__tattooLockBtn2ClickHandler);

    // _autoBuySelectButton.removeEventListener(MouseEvent.CLICK, __autoBuySelectButtonClickHandler);
    NotificationManager.Instance.removeEventListener(
      ArmyEvent.TATTOO_INFO,
      this.updateTattooInfo,
      this,
    );
  }

  private get tattooController(): RoleCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.SRoleWnd) as RoleCtrl;
  }

  private get tattooModel(): TattooModel {
    return this.tattooController.tattooModel;
  }

  private get holes(): TattooHole[] {
    return this.tattooController.tattooModel.holes;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  helpBtnClick() {
    let title = LangManager.Instance.GetTranslation("public.help");
    let content = LangManager.Instance.GetTranslation(
      "tattoo.TattooBaptizeWnd.helpContent02",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  protected OnBtnClose() {
    let hole: TattooHole = this.holes[this._index];
    if (hole.newAddProperty >= 0) {
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      let content: string = LangManager.Instance.GetTranslation(
        "tattoo.view.close.tips02",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        prompt,
        content,
        confirm,
        cancel,
        (b: boolean) => {
          if (b) {
            this.tattooController.sendDelete(hole.index);
            Laya.timer.callLater(this, () => {
              this.hide();
            });
          }
        },
      );
    } else {
      this.hide();
    }
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
