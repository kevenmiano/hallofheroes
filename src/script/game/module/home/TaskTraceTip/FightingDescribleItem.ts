/*
 * @Author: jeremy.xu
 * @Date: 2023-02-02 11:53:44
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-10 14:39:53
 * @Description:
 */
import FUI_FightingDescribleItem from "../../../../../fui/Home/FUI_FightingDescribleItem";
import LangManager from "../../../../core/lang/LangManager";
import ColorConstant from "../../../constant/ColorConstant";
import FightingType from "../../../constant/FightingType";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import FightingManager from "../../../manager/FightingManager";
import FUIHelper from "../../../utils/FUIHelper";

export default class FightingDescribleItem extends FUI_FightingDescribleItem {
  private _info: object;
  private _type: number = 0;
  private _index: number = 0;
  protected onConstruct() {
    super.onConstruct();
  }

  private removeEvent() {
    this.operationBtn.offClick(this, this.operationBtnHandler);
  }

  get info(): object {
    return this._info;
  }

  set info(value: object) {
    if (!value) {
      this.state.selectedIndex = 0;
      return;
    }
    if (!value["type"]) return;
    if (!value["index"]) return;
    this._info = value;
    this.state.selectedIndex = 1;
    if (value["type"] == FightingType.F_EQUIP) {
      //1为装备
      this.setItemInfo(value["index"]);
      this._type = value["index"];
      this.setText();
      this.operationBtn.onClick(this, this.operationBtnHandler);
    } else if (value["type"] == FightingType.F_GEM) {
      //2为宝石
      this.setItemInfo(value["index"] + 3);
      this._type = value["index"] + 3;
      this.setText();
      this.operationBtn.onClick(this, this.operationBtnHandler);
    }
  }

  private setText() {
    var desctionTxt: string;
    var showIndex: number;
    if (this._info["type"] == FightingType.F_EQUIP) {
      //装备
      switch (this._info["index"]) {
        case FightingType.F_EQUIP_TYPE1: //装备强化
          if (FightingManager.Instance.getAllHeroEquip().length > 0) {
            if (FightingManager.Instance.worstStrengEquip) {
              var strengScore: number =
                FightingManager.Instance.getEquipStrengScore();
              var strengindex: number =
                FightingManager.Instance.getIndexByScore(strengScore);
              desctionTxt = LangManager.Instance.GetTranslation(
                "fighting.FightingItem.desction1_" + strengindex,
              ); //装备
              showIndex = strengindex;
            } //装备强化到了顶级
            else {
              desctionTxt = LangManager.Instance.GetTranslation(
                "fighting.FightingItem.desction1_4",
              ); //装备已经强化到了顶级
              showIndex = 3;
            }
          } else {
            //无装备
            desctionTxt = LangManager.Instance.GetTranslation(
              "fighting.FightingItem.hasNotEquip",
            ); //请去穿戴装备
            showIndex = 1;
          }
          break;
        case FightingType.F_EQUIP_TYPE2: //装备洗练
          var refreshScore: number =
            FightingManager.Instance.getEquipRefreshScore();
          var refreshIndex: number =
            FightingManager.Instance.getIndexByScore(refreshScore);
          if (FightingManager.Instance.getAllHeroEquip().length > 0) {
            if (FightingManager.Instance.worstRefreshEquip) {
              desctionTxt = LangManager.Instance.GetTranslation(
                "fighting.FightingItem.desction2_" + refreshIndex,
              ); //已经全满了
              showIndex = refreshIndex;
            } //不需要在洗练
            else {
              desctionTxt = LangManager.Instance.GetTranslation(
                "fighting.FightingItem.desction2_4",
              ); //已经全满了
              showIndex = 3;
            }
          } //无装备
          else {
            desctionTxt = LangManager.Instance.GetTranslation(
              "fighting.FightingItem.hasNotEquip",
            ); //请去穿戴装备
            showIndex = 1;
          }
          break;
        case FightingType.F_EQUIP_TYPE3: //装备品质
          if (FightingManager.Instance.getAllHeroEquip().length > 0) {
            var score: number = FightingManager.Instance.getEquipQualityScore();
            var q_index: number =
              FightingManager.Instance.getIndexByScore(score);
            desctionTxt = LangManager.Instance.GetTranslation(
              "fighting.FightingItem.desction3_" + q_index,
            );
            showIndex = q_index;
          } //没有装备
          else {
            desctionTxt = LangManager.Instance.GetTranslation(
              "fighting.FightingItem.hasNotEquip",
            ); //请去穿戴装备
            showIndex = 1;
          }
          break;
      }
    } else if (this._info["type"] == FightingType.F_GEM) {
      switch (this._info["index"] + 3) {
        case FightingType.F_GEM_TYPE1:
          if (FightingManager.Instance.getAllHeroEquip().length > 0) {
            var gemscore: number = FightingManager.Instance.getGemScore();
            this._index = FightingManager.Instance.getIndexByScore(gemscore);
            desctionTxt = LangManager.Instance.GetTranslation(
              "fighting.FightingItem.desction4_" + this._index,
            );
            showIndex = this._index;
          } else {
            desctionTxt = LangManager.Instance.GetTranslation(
              "fighting.FightingItem.hasNotEquip",
            ); //请去穿戴装备
            showIndex = 1;
          }
          break;
        case FightingType.F_GEM_TYPE2:
          var markingScore: number = FightingManager.Instance.getMarkingScore();
          var m_index: number =
            FightingManager.Instance.getIndexByScore(markingScore);
          desctionTxt = LangManager.Instance.GetTranslation(
            "fighting.FightingItem.desction5_" + m_index,
          );
          showIndex = m_index;
          break;
      }
    }
    this.descTxt.text = desctionTxt;
    this.descTxt.color = this.getDescTxtColor(showIndex);
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

  private operationBtnHandler() {
    switch (this._type) {
      case FightingType.F_EQUIP_TYPE1: //装备强化
        FightingManager.Instance.strengEquipfun();
        break;
      case FightingType.F_EQUIP_TYPE2: //装备洗练
        FightingManager.Instance.refreshEquipFun();
        break;
      case FightingType.F_EQUIP_TYPE3: //装备品质
        FightingManager.Instance.qualityDescFun();
        break;
      case FightingType.F_GEM_TYPE1: //宝石
        FightingManager.Instance.gemgotoFun();
        break;
      case FightingType.F_GEM_TYPE2: //灵魂刻印
        FightingManager.Instance.markinggotoFun();
        break;
    }
  }

  private setItemInfo(type: number) {
    switch (type) {
      case FightingType.F_EQUIP_TYPE1: //装备强化
        this.typeNameTxt.text = LangManager.Instance.GetTranslation(
          "FightingDescribleItem.typeNameTxt1",
        );
        this.typeIcon.url = FUIHelper.getItemURL(
          EmPackName.Home,
          "Btn_Main_Desc3",
        );
        this.operationBtn.text = LangManager.Instance.GetTranslation(
          "HigherGradeOpenTipView.content4",
        );
        break;
      case FightingType.F_EQUIP_TYPE2: //装备洗练
        this.typeNameTxt.text = LangManager.Instance.GetTranslation(
          "FightingDescribleItem.typeNameTxt2",
        );
        this.typeIcon.url = FUIHelper.getItemURL(
          EmPackName.Home,
          "Btn_Main_Desc4",
        );
        this.operationBtn.text = LangManager.Instance.GetTranslation(
          "fashion.FashionSwitchItem.refreshTxt",
        );
        break;
      case FightingType.F_EQUIP_TYPE3: //装备品质
        this.typeNameTxt.text = LangManager.Instance.GetTranslation(
          "FightingDescribleItem.typeNameTxt3",
        );
        this.typeIcon.url = FUIHelper.getItemURL(
          EmPackName.Home,
          "Btn_Main_Desc5",
        );
        this.operationBtn.text = LangManager.Instance.GetTranslation(
          "fashion.FashionSwitchItem.operationBtnTxt1",
        );
        break;
      case FightingType.F_GEM_TYPE1: //宝石
        this.typeNameTxt.text = LangManager.Instance.GetTranslation(
          "FightingDescribleItem.typeNameTxt4",
        );
        this.typeIcon.url = FUIHelper.getItemURL(
          EmPackName.Home,
          "Btn_Main_Desc2",
        );
        if (this._index == 1) {
          this.operationBtn.text = LangManager.Instance.GetTranslation(
            "Forge.TabTitle.Compose",
          );
        } else {
          this.operationBtn.text = LangManager.Instance.GetTranslation(
            "HigherGradeOpenTipView.content8",
          );
        }
        break;
      case FightingType.F_GEM_TYPE2: //灵魂刻印
        this.typeNameTxt.text = LangManager.Instance.GetTranslation(
          "armyII.viewII.equip.JewelFrame.JewelNameTxt",
        );
        this.typeIcon.url = FUIHelper.getItemURL(
          EmPackName.Home,
          "Btn_Main_Desc1",
        );
        this.operationBtn.text = LangManager.Instance.GetTranslation(
          "fashion.FashionSwitchItem.operationBtnTxt2",
        );
        break;
    }
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
