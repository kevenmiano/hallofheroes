import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { UIFilter } from "../../../../core/ui/UIFilter";
import UIManager from "../../../../core/ui/UIManager";
import Utils from "../../../../core/utils/Utils";
import SimpleAlertHelper, {
  AlertBtnType,
} from "../../../component/SimpleAlertHelper";
import { t_s_petartifactpropertyData } from "../../../config/t_s_petartifactproperty";
import { BagType } from "../../../constant/BagDefine";
import GoodsSonType from "../../../constant/GoodsSonType";
import { GoodsType } from "../../../constant/GoodsType";
import { EmWindow } from "../../../constant/UIDefine";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { GoodsCheck } from "../../../utils/GoodsCheck";
import TodayNotAlertWnd from "../../mount/TodayNotAlertWnd";
import PetCtrl from "../control/PetCtrl";
import ArtifactCell from "./item/ArtifactCell";

export default class ArtifactResetWnd extends BaseWindow {
  public descTxt1: fgui.GRichTextField;
  public descTxt2: fgui.GRichTextField;
  public levelTxt1: fgui.GTextInput;
  public levelTxt2: fgui.GTextInput;
  public addPrecentTxt1: fgui.GTextInput;
  public addPrecentTxt2: fgui.GTextInput;
  public costNumTxt: fgui.GTextField;
  public resetBtn: fgui.GButton;
  public addBtn: fgui.GButton;
  public artIcon1: ArtifactCell;
  public artIcon2: ArtifactCell;
  public goodsList: fgui.GList;
  private _goodsArr: Array<GoodsInfo> = [];
  private _costDiamond: number = 0;
  public static MAX_COUNT: number = 100;
  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
  }

  OnShowWind() {
    super.OnShowWind();
    this.artIcon1.type = 1;
    this.artIcon1.selectType = 1;
    this.artIcon1.info = this.frameData;
    this.artIcon1.isEquip.selectedIndex = GoodsCheck.hasEquipArtifact(
      this.artIcon1.info,
    )
      ? 1
      : 0;
    this.artIcon1.isIdentify.selectedIndex = GoodsCheck.hasIdentify(
      this.artIcon1.info,
    )
      ? 1
      : 0;
    this.addEvent();
    this.updateView();
  }

  OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }

  private addEvent() {
    this.goodsList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.resetBtn.onClick(this, this.resetBtnHandler);
    this.goodsList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    NotificationManager.Instance.addEventListener(
      NotificationEvent.ARTIFACT_SELECT_GOODS_UPDATE,
      this.updateSelectView,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.ARTIFACT_CANCEL_GOODS_UPDATE,
      this.updateCancelView,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.ARTIFACT_SUCCESS_UPDATE,
      this.refreshView,
      this,
    );
  }

  private removeEvent() {
    this.resetBtn.offClick(this, this.resetBtnHandler);
    Utils.clearGListHandle(this.goodsList);
    this.goodsList.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.ARTIFACT_SELECT_GOODS_UPDATE,
      this.updateSelectView,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.ARTIFACT_CANCEL_GOODS_UPDATE,
      this.updateCancelView,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.ARTIFACT_SUCCESS_UPDATE,
      this.refreshView,
      this,
    );
  }

  private renderListItem(index: number, item: ArtifactCell) {
    item.type = 0;
    if (this._goodsArr.length > index) {
      item.info = this._goodsArr[index];
      if (this.isSelect(item.info)) {
        item.isSelect.selectedIndex = 1;
      } else {
        item.isSelect.selectedIndex = 0;
      }
      if (this.checkGrade(item.info)) {
        UIFilter.normal(item);
      } else {
        UIFilter.gray(item);
      }
      if (GoodsCheck.hasEquipArtifact(item.info)) {
        item.isEquip.selectedIndex = 1;
      } else {
        item.isEquip.selectedIndex = 0;
      }
    } else {
      item.info = null;
      item.isSelect.selectedIndex = 0;
      item.isEquip.selectedIndex = 0;
    }
  }

  private onClickItem(selectedItem: ArtifactCell) {
    if (!selectedItem) return;
    PlayerManager.Instance.currentPlayerModel.currentSelectArtifact =
      selectedItem.info;
  }

  /**
   * 左侧有神器被选择了，从右侧找一个空格子填入进去，没有空格子了提示
   */
  private updateSelectView(goodsInfo: GoodsInfo) {
    if (this.artIcon1.info && this.artIcon2.info) {
      //1和2格子全部有神器了
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "ArtifactResetWnd.updateSelectTips",
        ),
      );
      return;
    } else if (
      (this.artIcon1.info && this.artIcon1.info.id == goodsInfo.id) ||
      (this.artIcon2.info && this.artIcon2.info.id == goodsInfo.id)
    ) {
      //已经装备上的
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "ArtifactResetWnd.updateSelectTips2",
        ),
      );
      return;
    } else if (!this.checkGrade(goodsInfo)) {
      //等级不满足
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "ArtifactResetWnd.updateSelectTips3",
        ),
      );
      return;
    } else {
      //被选中的神器加上选中标识。从右侧找一个空格子填充进去
      if (this.artIcon1.info) {
        //1号格子有神器了
        this.artIcon2.type = 1;
        this.artIcon2.selectType = 1;
        this.artIcon2.info = goodsInfo;
        this.artIcon2.isEquip.selectedIndex = GoodsCheck.hasEquipArtifact(
          this.artIcon2.info,
        )
          ? 1
          : 0;
        this.artIcon2.isIdentify.selectedIndex = GoodsCheck.hasIdentify(
          this.artIcon2.info,
        )
          ? 1
          : 0;
      } else {
        this.artIcon1.type = 1;
        this.artIcon1.selectType = 1;
        this.artIcon1.info = goodsInfo;
        this.artIcon1.isEquip.selectedIndex = GoodsCheck.hasEquipArtifact(
          this.artIcon1.info,
        )
          ? 1
          : 0;
        this.artIcon1.isIdentify.selectedIndex = GoodsCheck.hasIdentify(
          this.artIcon1.info,
        )
          ? 1
          : 0;
      }
      for (let i: number = 0; i < this.goodsList.numChildren; i++) {
        let item: ArtifactCell = this.goodsList.getChildAt(i) as ArtifactCell;
        if (item && item.info && item.info.id == goodsInfo.id) {
          item.isSelect.selectedIndex = 1;
        }
        if (item && item.info && this.checkGrade(item.info)) {
          UIFilter.normal(item);
        } else {
          UIFilter.gray(item);
        }
      }
      this.updateRightView();
    }
  }

  private updateCancelView(info: GoodsInfo) {
    if (this.artIcon1.info && this.artIcon1.info.id == info.id) {
      //取消的是1号格子
      this.artIcon1.selectType = 0;
      this.artIcon1.isEquip.selectedIndex = 0;
      this.artIcon1.info = null;
      this.artIcon1.isIdentify.selectedIndex = 1;
    } else if (this.artIcon2.info && this.artIcon2.info.id == info.id) {
      this.artIcon2.selectType = 0;
      this.artIcon2.isEquip.selectedIndex = 0;
      this.artIcon2.info = null;
      this.artIcon2.isIdentify.selectedIndex = 1;
    }
    //刷新左侧列表
    for (let i: number = 0; i < this.goodsList.numChildren; i++) {
      let item: ArtifactCell = this.goodsList.getChildAt(i) as ArtifactCell;
      if (item && item.info && item.info.id == info.id) {
        item.isSelect.selectedIndex = 0;
      }
      if (item && item.info && this.checkGrade(item.info)) {
        UIFilter.normal(item);
      } else {
        UIFilter.gray(item);
      }
    }
    //刷新右下角
    this.updateRightView();
  }

  /**
   * 1,2格子都有神器的话，否则的话
   */
  private updateRightView() {
    if (this.artIcon1.info && this.artIcon2.info) {
      //两个位置都有神器
      this.resetBtn.enabled = true;
      let level = 0;
      let addPrecent = 0;
      let templateData1: t_s_petartifactpropertyData =
        TempleteManager.Instance.getArtifactTemplate(
          this.artIcon1.info.templateId,
        );
      let templateData2: t_s_petartifactpropertyData =
        TempleteManager.Instance.getArtifactTemplate(
          this.artIcon2.info.templateId,
        );
      if (templateData1.Level == templateData2.Level) {
        level = templateData1.Level + 1;
        addPrecent = templateData1.UpgradeRandom1;
        this._costDiamond = templateData1.ReforgeDiamond;
      } else if (templateData1.Level > templateData2.Level) {
        level = templateData1.Level + 1;
        addPrecent = templateData1.UpgradeRandom2;
        this._costDiamond = templateData1.ReforgeDiamond;
      } else if (templateData1.Level < templateData2.Level) {
        level = templateData2.Level + 1;
        addPrecent = templateData2.UpgradeRandom2;
        this._costDiamond = templateData2.ReforgeDiamond;
      }
      this.addPrecentTxt1.text = addPrecent + "%";
      this.levelTxt1.text =
        LangManager.Instance.GetTranslation("public.level3", level) + ":";
      this.costNumTxt.text = this._costDiamond.toString();
      this.levelTxt2.text =
        LangManager.Instance.GetTranslation("public.level3", level - 1) + ":";
      this.addPrecentTxt2.text = 100 - addPrecent + "%";
    } else {
      this.resetBtn.enabled = false;
      this.levelTxt1.text = "--:";
      this.addPrecentTxt1.text = "--";
      this.costNumTxt.text = "--";
      this.levelTxt2.text = "--:";
      this.addPrecentTxt2.text = "--";
    }
  }

  private updateView() {
    this._goodsArr = this.getAllArtifact();
    this.goodsList.numItems = ArtifactResetWnd.MAX_COUNT;
    this.updateRightView();
  }

  /**
   *
   * @returns 所有的神器，包括已经装备和未装备的
   */
  private getAllArtifact(): Array<GoodsInfo> {
    let allArtifactArr: Array<GoodsInfo> = [];
    let goodsInfo: GoodsInfo;
    let arr = GoodsManager.Instance.getGoodsByBagType(BagType.Player);
    for (let i = 0; i < arr.length; i++) {
      goodsInfo = arr[i];
      if (
        goodsInfo &&
        goodsInfo.templateInfo &&
        goodsInfo.templateInfo.MasterType == GoodsType.EQUIP &&
        goodsInfo.templateInfo.SonType == GoodsSonType.ARTIFACT
      ) {
        allArtifactArr.push(goodsInfo);
      }
    }
    let arr1 = GoodsManager.Instance.getGoodsByBagType(BagType.PET_EQUIP_BAG);
    for (let j = 0; j < arr1.length; j++) {
      goodsInfo = arr1[j];
      if (
        goodsInfo &&
        goodsInfo.templateInfo &&
        goodsInfo.templateInfo.MasterType == GoodsType.EQUIP &&
        goodsInfo.templateInfo.SonType == GoodsSonType.ARTIFACT
      ) {
        allArtifactArr.push(goodsInfo);
      }
    }

    allArtifactArr.sort(this.byOrder);
    return allArtifactArr;
  }

  private byOrder(a: GoodsInfo, b: GoodsInfo): number {
    if (a.templateId > b.templateId) {
      return -1;
    } else if (a.templateId < b.templateId) {
      return -1;
    } else {
      return 0;
    }
  }

  helpBtnClick() {
    let title = LangManager.Instance.GetTranslation(
      "ArtifactResetWnd.HelpTitle",
    );
    let content = LangManager.Instance.GetTranslation(
      "ArtifactResetWnd.content",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  /**
   *
   * @param info 是否处于选中状态
   * @returns
   */
  private isSelect(info: GoodsInfo): boolean {
    let flag: boolean = false;
    if (info) {
      if (
        (this.artIcon1 &&
          this.artIcon1.info &&
          info.id == this.artIcon1.info.id) ||
        (this.artIcon2 &&
          this.artIcon2.info &&
          info.id == this.artIcon2.info.id)
      ) {
        flag = true;
      }
    }
    return flag;
  }

  private checkGrade(info: GoodsInfo): boolean {
    let flag: boolean = false;
    let templateId = this.artIcon1.info
      ? this.artIcon1.info.templateId
      : this.artIcon2.info
        ? this.artIcon2.info.templateId
        : 0;
    let templateData1: t_s_petartifactpropertyData =
      TempleteManager.Instance.getArtifactTemplate(templateId);
    let templateData: t_s_petartifactpropertyData =
      TempleteManager.Instance.getArtifactTemplate(info.templateId);
    if (templateId > 0) {
      if (
        templateData1 &&
        Math.abs(templateData1.Level - templateData.Level) <= 1
      ) {
        flag = true;
      }
    } else {
      flag = true;
    }
    return flag;
  }

  public get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  private resetBtnHandler() {
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let content: string = LangManager.Instance.GetTranslation(
      "ArtifactResetWnd.resetBtn.AlertContent",
      this._costDiamond,
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
          SimpleAlertHelper.Instance.Hide();
          if (this.playerModel.playerInfo.point < this._costDiamond) {
            RechargeAlertMannager.Instance.show();
            return;
          }
          if (this.artIcon1.info && this.artIcon2.info) {
            PetCtrl.sendArtifactReset(
              this.artIcon1.info.pos,
              this.artIcon1.info.objectId,
              this.artIcon2.info.pos,
              this.artIcon2.info.objectId,
            );
          }
        }
      },
      AlertBtnType.OC,
      false,
      true,
    );
  }

  /**
   * 重铸成功后更新界面
   */
  private refreshView() {
    this.artIcon1.selectType = this.artIcon2.selectType = 0;
    this.artIcon1.info = this.artIcon2.info = null;
    this.artIcon1.isIdentify.selectedIndex =
      this.artIcon2.isIdentify.selectedIndex = 1;
    this.artIcon1.isEquip.selectedIndex = 0;
    this.artIcon2.isEquip.selectedIndex = 0;
    this.resetBtn.enabled = true;
    this.updateView();
  }

  public dispose(dispose?: boolean) {
    this.removeEvent();
    super.dispose();
  }
}
