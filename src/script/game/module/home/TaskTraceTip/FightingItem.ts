import FUI_FightingItem from "../../../../../fui/Home/FUI_FightingItem";
import ColorConstant from "../../../constant/ColorConstant";
import FightingType from "../../../constant/FightingType";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import FightingManager from "../../../manager/FightingManager";
import FightIngModel from "../../../mvc/model/FightIngModel";
import FUIHelper from "../../../utils/FUIHelper";
import LangManager from "../../../../core/lang/LangManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
// import { UIModuleTypes } from "../../../constant/UIModuleTypes";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";

export default class FightingItem extends FUI_FightingItem {
  private _info: FightIngModel;
  private _index: number; //得分在某个区间
  protected onConstruct() {
    super.onConstruct();
    this.scoreTxt.text = LangManager.Instance.GetTranslation("public.minute");
    this.addEvent();
  }

  private addEvent() {
    this.lookInfoBtn.onClick(this, this.lookInfoBtnHandler);
    this.upBtn.onClick(this, this.upBtnHandler);
  }

  private removeEvent() {
    this.lookInfoBtn.offClick(this, this.lookInfoBtnHandler);
    this.upBtn.offClick(this, this.upBtnHandler);
  }

  /**
   * 提升
   */
  private upBtnHandler() {
    switch (this._info.type) {
      case FightingType.F_EQUIP: //装备
        FightingManager.Instance.equipFun();
        break;
      case FightingType.F_GEM: //宝石
        FightingManager.Instance.gemFun();
        break;
      case FightingType.F_TALENT: //天赋, 符文
        FightingManager.Instance.talentFun();
        break;
      case FightingType.F_START: //星运
        FightingManager.Instance.starFun();
        break;
      case FightingType.F_PET: //宠物
        FightingManager.Instance.petFun();
        break;
      case FightingType.F_MOUNT: //坐骑
        FightingManager.Instance.mountFun();
        break;
    }
  }

  /**
   * 详情
   */
  private lookInfoBtnHandler() {
    switch (this._info.type) {
      case FightingType.F_EQUIP:
        FrameCtrlManager.Instance.open(EmWindow.FightingDescribleWnd, {
          tabIndex: 1,
        });
        break;
      case FightingType.F_GEM:
        FrameCtrlManager.Instance.open(EmWindow.FightingDescribleWnd, {
          tabIndex: 2,
        });
        break;
      case FightingType.F_PET:
        if (PlayerManager.Instance.currentPlayerModel.petSystemIsOpened) {
          if (!FightingManager.Instance.getCurrPet()) {
            var _str: string = LangManager.Instance.GetTranslation(
              "fighting.FightingItem.hasNotPet",
            ); // "当前没有英灵, 不能打开英灵";
            MessageTipManager.Instance.show(_str);
          } else {
            FrameCtrlManager.Instance.open(EmWindow.FightingPetWnd);
          }
        } else {
          var str: string = LangManager.Instance.GetTranslation(
            "fighting.FightingItem.petNotOpen",
          ); // "当前没有英灵, 不能打开英灵";
          MessageTipManager.Instance.show(str);
        }

        break;
    }
  }

  private setTxt() {
    switch (this._info.type) {
      case FightingType.F_EQUIP: //装备
        this.descTxt.text = FightingManager.Instance.showEquipDesc;
        break;
      case FightingType.F_GEM: //宝石
        this.descTxt.text = FightingManager.Instance.showGemDesc;
        break;
      case FightingType.F_TALENT: //天赋, 符文
        this.descTxt.text = FightingManager.Instance.showTalentDesc;
        break;
      case FightingType.F_START: //星运
        this.descTxt.text = FightingManager.Instance.showStarDesc;
        break;
      case FightingType.F_PET: //宠物
        this.descTxt.text = FightingManager.Instance.showPetDesc;
        break;
      case FightingType.F_MOUNT: //坐骑
        this.descTxt.text = FightingManager.Instance.showMountDesc;
        break;
    }
  }

  get info(): FightIngModel {
    return this._info;
  }

  set info(value: FightIngModel) {
    this._info = value;
    if (this._info) {
      this._index = FightingManager.Instance.getIndexByScore(this._info.score);
      this.scoreValueTxt.color =
        this.scoreTxt.color =
        this.descTxt.color =
          this.getDescTxtColor(this._index);
      this.typeIcon.url = this.getTypeIconUrl(this._info.type);
      this.scoreValueTxt.text = this._info.score.toString();
      this.setTxt();
      if (
        this._info.type == FightingType.F_EQUIP ||
        this._info.type == FightingType.F_GEM ||
        this._info.type == FightingType.F_PET
      ) {
        this.state.selectedIndex = 1;
      } else {
        this.state.selectedIndex = 0;
      }
    } else {
      this.descTxt.text = "";
      this.typeIcon.url = "";
      this.nameTxt.text = "";
      this.state.selectedIndex = 0;
    }
  }

  private getDescTxtColor(value: number): string {
    switch (value) {
      case FightingManager.FIRST_GRADE:
        return ColorConstant.Q_RED_COLOR;
      case FightingManager.SECOND_GRADE:
        return ColorConstant.Q_GREEN_COLOR;
      case FightingManager.THIRD_GRADE:
      case FightingManager.FOUR_GRADE:
        return ColorConstant.Q_GOLD_COLOR;
    }
    return "";
  }

  private getTypeIconUrl(type: number): string {
    switch (type) {
      case FightingType.F_EQUIP: //装备
        this.nameTxt.text = LangManager.Instance.GetTranslation("public.equip");
        return FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Equip2");
      case FightingType.F_GEM: //宝石
        this.nameTxt.text = LangManager.Instance.GetTranslation(
          "FightingItem.typeNameTxt1",
        );
        return FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Gem2");
      case FightingType.F_TALENT:
        this.nameTxt.text = LangManager.Instance.GetTranslation(
          "FightingItem.typeNameTxt2",
        );
        return FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Talents2");
      case FightingType.F_START:
        this.nameTxt.text = LangManager.Instance.GetTranslation(
          "tasktracetip.view.StarTipView.text",
        );
        return FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Astro2");
      case FightingType.F_PET:
        this.nameTxt.text = LangManager.Instance.GetTranslation(
          "HigherGradeOpenTipView.content23",
        );
        return FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Sylph2");
      case FightingType.F_MOUNT:
        this.nameTxt.text = LangManager.Instance.GetTranslation(
          "HigherGradeOpenTipView.content21",
        );
        return FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Mount2");
    }
    return "";
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
