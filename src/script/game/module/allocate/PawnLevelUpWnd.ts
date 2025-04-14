import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import Dictionary from "../../../core/utils/Dictionary";
import { IconFactory } from "../../../core/utils/IconFactory";
import { t_s_pawntemplateData } from "../../config/t_s_pawntemplate";
import { PawnEvent } from "../../constant/event/NotificationEvent";
import { EmWindow } from "../../constant/UIDefine";
import { ArmyPawn } from "../../datas/ArmyPawn";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { ArmySocketOutManager } from "../../manager/ArmySocketOutManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import BuildingManager from "../../map/castle/BuildingManager";
import BuildingType from "../../map/castle/consant/BuildingType";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import { ThaneInfoHelper } from "../../utils/ThaneInfoHelper";
import { t_s_skilltemplateData } from "../../config/t_s_skilltemplate";
import { t_s_upgradetemplateData } from "../../config/t_s_upgradetemplate";
import { t_s_specialtemplateData } from "../../config/t_s_specialtemplate";
import UIButton from "../../../core/ui/UIButton";
import { BaseIcon } from "../../component/BaseIcon";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { GlobalConfig } from "../../constant/GlobalConfig";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
/**
 * @author:shujin.ou
 * @data: 2021-02-19 20:37
 * @description 士兵升级
 */
export class PawnLevelUpWnd extends BaseWindow {
  private _dic: Dictionary;
  private _buttonMap: Map<fgui.GButton, ArmyPawn>;
  private Btn_Convert: UIButton; //转换
  private Btn_Apperceive: UIButton; //领悟
  private Btn_Upgrade: UIButton; //升级
  private PlayerCom: BaseIcon; //兵种头像
  private SkillCom: BaseIcon; //技能图标
  private SpecialCom: BaseIcon; //特性图标
  private SkillNameTxt: fgui.GLabel; //技能名字
  private SoulValueTxt: fgui.GLabel; //战魂数量
  private PawnSpecialGradeTxt: fgui.GLabel; //士兵类别
  private SpecialAbilityNameTxt: fgui.GLabel; //特性名字
  private MaxLevelTxt: fgui.GLabel; //最大等级文字
  private NextLevelTxt: fgui.GLabel; //下一等级文字
  private CurrentLevelTxt: fgui.GLabel; //当前等级文字
  private SkillTitleTxt: fgui.GLabel; //技能文字
  private SpecialTitleTxt: fgui.GLabel; //特性文字
  private CostTxt: fgui.GLabel; //消耗数量:
  private PawnNameList: fgui.GList = null; //士兵列表
  private CurentValueList: fgui.GList = null; //当前属性列表
  private NewValueList: fgui.GList = null; //下一级属性列表
  private attributeArray: Array<string> = [
    "attack",
    "magicAttack",
    "defence",
    "magicDefence",
    "live",
  ];
  private _tempArr: any[];
  private _indexBtnArray: Array<fgui.GButton>;
  private _currentSelected: ArmyPawn;
  private _needSoulValue: number = 0;
  public helpBtn: fgui.GButton;
  private skillData: t_s_skilltemplateData;
  private specialAbilityData: t_s_specialtemplateData;
  private descTxt: fgui.GTextField;
  public tipItem: BaseTipItem;
  public OnInitWind() {
    this.SkillTitleTxt.text = LangManager.Instance.GetTranslation(
      "PawnLevelUpWnd.SkillTitleTxt",
    );
    this.SpecialTitleTxt.text = LangManager.Instance.GetTranslation(
      "PawnLevelUpWnd.SpecialTitleTxt",
    );
    this.CostTxt.text = LangManager.Instance.GetTranslation(
      "PawnLevelUpWnd.CostTxt",
    );
    this.helpBtn.visible = false;
    this.MaxLevelTxt.visible = false;
    this.initData();
    this.addEvent();
    this.initList();
    this.setCenter();
    this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    PlayerManager.Instance.currentPlayerModel.setFightingCapacityRecord(
      "start",
    );
  }

  OnShowWind() {
    super.OnShowWind();
    this.defaultSelected(this.frameData);
  }

  private initData() {
    this._dic = new Dictionary();
    this._buttonMap = new Map();
    this._indexBtnArray = [];
    this._tempArr = ArmyManager.Instance.casernPawnList.getList();
    this._tempArr.sort(this.sortByNeedBuild);
  }

  private sortByNeedBuild(pawn1: ArmyPawn, pawn2: ArmyPawn): number {
    var needBuild1: number = parseInt(
      pawn1.templateInfo.NeedBuilding.toString(),
    );
    var needBuild2: number = parseInt(
      pawn2.templateInfo.NeedBuilding.toString(),
    );
    if (needBuild1 > needBuild2) return 1;
    else if (needBuild1 < needBuild2) return -1;
    else return 0;
  }

  private initList() {
    this.PawnNameList.numItems = this._tempArr.length;
    this.PawnNameList.ensureBoundsCorrect();
  }

  private addEvent() {
    this.Btn_Convert.onClick(this, this.__onConvertBtnClick.bind(this));
    this.Btn_Apperceive.onClick(this, this.__onApperceiveClick.bind(this));
    this.Btn_Upgrade.onClick(this, this.__upgradeHandler.bind(this));
    this.PawnNameList.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
    this.PawnNameList.itemRenderer = Laya.Handler.create(
      this,
      this.renderItem,
      null,
      false,
    );
    this.on(Laya.Event.CLICK, this, this.click);
    this.SkillCom.on(Laya.Event.CLICK, this, this._skillClickHander);
    this.SpecialCom.on(Laya.Event.CLICK, this, this._specialClickHander);
    for (const key in this._tempArr) {
      if (Object.prototype.hasOwnProperty.call(this._tempArr, key)) {
        let element: ArmyPawn = this._tempArr[key];
        element.addEventListener(
          PawnEvent.PAWN_PROPERTY_CHAGER,
          this.__pawnChangeHandler,
          this,
        );
        element.addEventListener(
          PawnEvent.SPECIAL_ALIBITY,
          this.__specialAblityChange,
          this,
        );
      }
    }
  }

  private removeEvent() {
    this.Btn_Convert.offClick(this);
    this.Btn_Apperceive.offClick(this);
    this.Btn_Upgrade.offClick(this);
    this.PawnNameList.off(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
    this.SkillCom.off(Laya.Event.CLICK, this, this._skillClickHander);
    this.SpecialCom.off(Laya.Event.CLICK, this, this._specialClickHander);
    // Ensure itemRenderer is properly reset or cleared without calling recover
    this.PawnNameList.itemRenderer = null;
    this.PawnNameList.itemRenderer = null;
    for (const key in this._tempArr) {
      if (Object.prototype.hasOwnProperty.call(this._tempArr, key)) {
        let element: ArmyPawn = this._tempArr[key];
        element.removeEventListener(
          PawnEvent.PAWN_PROPERTY_CHAGER,
          this.__pawnChangeHandler,
          this,
        );
        element.removeEventListener(
          PawnEvent.SPECIAL_ALIBITY,
          this.__specialAblityChange,
          this,
        );
      }
    }
  }

  private renderItem(index: number, item: fgui.GButton) {
    item.selected = false;
    item.text = this.getPawnNameByMasterType(
      this._tempArr[index].templateInfo.MasterType,
    );
    item.enabled = this._tempArr[index].canRecruit;
    this._dic[this._tempArr[index].templateInfo.SonType] = item;
    this._indexBtnArray.push(item);
    this._buttonMap.set(item, this._tempArr[index]);
  }

  private __onConvertBtnClick() {
    if (this.thane.grades < 40) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "buildings.casern.view.PawnLevelUpFrame.command08",
        ),
      );
      return;
    }
    let count: number = 0;
    for (let i: number = 0; i < this._tempArr.length; i++) {
      if (
        this._tempArr[i].templateId != this._currentSelected.templateId &&
        this._tempArr[i].templateInfo.Level >= 10
      ) {
        count += 1;
      }
    }
    if (count > 0) {
      //打开特性转换界面
      UIManager.Instance.ShowWind(
        EmWindow.SpecialSwitchWnd,
        this._currentSelected,
      );
    } else {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "armyII.viewII.pawnupgrade.PawnLevelUpFrame.noToConver",
        ),
      );
    }
  }

  private __onApperceiveClick() {
    if (this.thane.grades < 40) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "buildings.casern.view.PawnLevelUpFrame.command08",
        ),
      );
      return;
    }
    //打开特性领悟界面
    UIManager.Instance.ShowWind(
      EmWindow.PawnSpecialAbilityWnd,
      this._currentSelected,
    );
  }

  //升级
  private __upgradeHandler(e: MouseEvent) {
    if (ResourceManager.Instance.gold.count < this._needSoulValue) {
      var str: string = LangManager.Instance.GetTranslation(
        "Allocate.GoldNotEnough",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    var build: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(
      BuildingType.CASERN,
    );
    var nextTemp: t_s_pawntemplateData = this._currentSelected.nextTemplate;
    if (
      build &&
      nextTemp &&
      nextTemp.Level > build.templeteInfo.BuildingGrade
    ) {
      str = LangManager.Instance.GetTranslation(
        "buildings.casern.view.PawnLevelUpFrame.command06",
        nextTemp.Level,
      );
      MessageTipManager.Instance.show(str);
      return;
    } else if (!nextTemp) {
      str = LangManager.Instance.GetTranslation("PawnLevelUpWnd.MaxLevelTxt");
      MessageTipManager.Instance.show(str);
      return;
    }
    ArmySocketOutManager.sendUpgradePawn(this._currentSelected.templateId);
  }

  private __pawnChangeHandler(data: ArmyPawn) {
    if (data && data == this._currentSelected) {
      this.refreshRight(true);
      var str1: string = LangManager.Instance.GetTranslation(
        "buildings.casern.view.PawnLevelUpFrame.command07",
        this._currentSelected.templateInfo.Level,
      );
      MessageTipManager.Instance.show(str1);
    }
  }

  private __specialAblityChange(data: ArmyPawn) {
    if (data && data == this._currentSelected) {
      this.refreshSpecialAbility();
    }
  }

  private onClickItem(selectedItem: any) {
    let btn: fgui.GButton = <fgui.GButton>selectedItem;
    this._currentSelected = <ArmyPawn>this._buttonMap.get(btn);
    this.PlayerCom.setIcon(
      IconFactory.getSoldierIconByIcon(this._currentSelected.templateInfo.Icon),
    );
    this.PawnSpecialGradeTxt.text = this.getPawnNameByMasterType(
      this._currentSelected.templateInfo.MasterType,
    );
    this.CurrentLevelTxt.text = LangManager.Instance.GetTranslation(
      "public.level4_space2",
      this._currentSelected.templateInfo.Level,
    );
    this.refreshRight();
  }

  private _skillClickHander(evt: Event) {
    evt.stopPropagation();
    if (UIManager.Instance.isShowing(EmWindow.SoliderSkillTipWnd)) {
      //如果有弹窗
      UIManager.Instance.HideWind(EmWindow.SoliderSkillTipWnd);
    } else {
      let point = this.SkillCom.parent.localToGlobal(
        this.SkillCom.x,
        this.SkillCom.y,
      );
      UIManager.Instance.ShowWind(EmWindow.SoliderSkillTipWnd, {
        posX: point.x,
        posY: point.y,
        pawnData: this.skillData,
      });
    }
  }

  private _specialClickHander(evt: Event) {
    evt.stopPropagation();
    if (UIManager.Instance.isShowing(EmWindow.SoliderSkillTipWnd)) {
      UIManager.Instance.HideWind(EmWindow.SoliderSkillTipWnd);
    } else {
      let point = this.SpecialCom.parent.localToGlobal(
        this.SpecialCom.x,
        this.SpecialCom.y,
      );
      UIManager.Instance.ShowWind(EmWindow.SoliderSkillTipWnd, {
        posX: point.x,
        posY: point.y,
        pawnData: this.specialAbilityData,
      });
    }
  }

  private click() {
    if (UIManager.Instance.isShowing(EmWindow.SoliderSkillTipWnd)) {
      UIManager.Instance.HideWind(EmWindow.SoliderSkillTipWnd);
    }
  }

  private refreshRight(playMovie: boolean = false) {
    this.MaxLevelTxt.visible = false;
    this.CurentValueList.removeChildrenToPool();
    this.NewValueList.removeChildrenToPool();
    let nextTemp: t_s_pawntemplateData = this._currentSelected.nextTemplate;
    let attributeNameKey: string;
    let nextPawn: ArmyPawn = new ArmyPawn();
    let newValueTxt: fgui.GTextField;
    let addValueTxt: fgui.GTextField;
    for (const key in this.attributeArray) {
      let attribute: string = this.attributeArray[key];
      if (this._currentSelected[attribute] > 0) {
        let currentItem: any = this.CurentValueList.addItemFromPool();
        attributeNameKey = "PawnLevelUpWnd.AttributeNameTxt." + attribute;
        (<fgui.GTextField>currentItem.getChild("AttributeNameTxt")).text =
          LangManager.Instance.GetTranslation(attributeNameKey);
        (<fgui.GTextField>currentItem.getChild("AttributeValueTxt")).text =
          this._currentSelected[attribute].toString();
        if (nextTemp) {
          let nextItem: any = this.NewValueList.addItemFromPool();
          nextPawn.templateId = this._currentSelected.nextTemplate.TemplateId;
          nextPawn.attributeDic = this._currentSelected.attributeDic;
          newValueTxt = nextItem.getChild("newValueTxt");
          addValueTxt = nextItem.getChild("addValueTxt");
          newValueTxt.text = nextPawn[attribute].toString();
          addValueTxt.text = LangManager.Instance.GetTranslation(
            "PawnLevelUpWnd.addValueTxt",
            nextPawn[attribute] - this._currentSelected[attribute],
          );
        }
      }
    }
    if (nextTemp) {
      this.NextLevelTxt.text = LangManager.Instance.GetTranslation(
        "public.level4_space2",
        nextTemp.Level,
      );
      this.Btn_Upgrade.enabled = true;
    } else {
      this.NextLevelTxt.text = "";
      this.Btn_Upgrade.enabled = false;
    }
    this.CurrentLevelTxt.text = LangManager.Instance.GetTranslation(
      "public.level4_space2",
      this._currentSelected.templateInfo.Level,
    );
    this.CurentValueList.ensureBoundsCorrect();
    this.refreshSkill();
    this.refreshSpecialAbility();
  }

  private refreshSkill() {
    var maxTemplateId: number = ThaneInfoHelper.getPawnMaxTempIDBySontype(
      this._currentSelected.templateInfo.SonType,
    );
    var maxTemp: t_s_pawntemplateData =
      TempleteManager.Instance.getPawnTemplateById(maxTemplateId);
    var list: any[] = maxTemp.HighSkill.split(",");
    for (var i: number = 0; i < 1; i++) {
      let temp: t_s_skilltemplateData;
      if (i < list.length) {
        temp = TempleteManager.Instance.getSkillTemplateInfoById(
          Math.ceil(list[i]),
        );
        if (temp) {
          this.SkillCom.setIcon(IconFactory.getTecIconByIcon(temp.Icons));
          this.skillData = temp;
          this.SkillNameTxt.text = temp.SkillTemplateName;
        }
      } else {
        (<fgui.GLoader>this.SkillCom.getChild("icon")).url = "";
        this.SkillNameTxt.text = "";
      }
    }
  }

  private refreshSpecialAbility() {
    let nextTemp: t_s_pawntemplateData = this._currentSelected.nextTemplate;
    let upgradeTemp: t_s_upgradetemplateData = nextTemp
      ? TempleteManager.Instance.getTemplateByTypeAndLevelAndID(
          nextTemp.Level,
          1,
          nextTemp.TemplateId,
        )
      : null;
    if (!upgradeTemp) {
      this.MaxLevelTxt.visible = true;
      this.MaxLevelTxt.text = LangManager.Instance.GetTranslation(
        "PawnLevelUpWnd.MaxLevelTxt",
      );
      this.SoulValueTxt.text = ResourceManager.Instance.gold.count.toString();
      this.SoulValueTxt.color = "#FFECC6";
    } else {
      let soul: number = upgradeTemp.Data;
      this._needSoulValue = nextTemp ? soul : 0;
      this.SoulValueTxt.text =
        ResourceManager.Instance.gold.count + "/" + this._needSoulValue;
      if (this._needSoulValue > ResourceManager.Instance.gold.count) {
        this.SoulValueTxt.color = "#FF2E2E";
      } else {
        this.SoulValueTxt.color = "#FFECC6";
      }
    }
    this.SpecialCom.visible = false;
    // this.SpecialAbilityNameTxt.x = 780;
    // this.SpecialAbilityNameTxt.y = 375;
    (<fgui.GLoader>this.SpecialCom.getChild("icon")).url = "";
    this.SpecialAbilityNameTxt.text = "";
    this.descTxt.text = "";
    if (this._currentSelected) {
      let specialTemp: t_s_specialtemplateData =
        TempleteManager.Instance.getPawnSpecialTemplateByID(
          parseInt(this._currentSelected.specialAbility),
        );
      if (specialTemp) {
        this.SpecialAbilityNameTxt.color = "#FFECC6";
        this.SpecialCom.setIcon(
          IconFactory.getCommonIconPath(specialTemp.ResPath),
        );
        this.SpecialCom.visible = true;
        this.SpecialAbilityNameTxt.text = LangManager.Instance.GetTranslation(
          "public.level.name",
          specialTemp.TemplateNameLang,
          specialTemp.Grades,
        );
        this.specialAbilityData = specialTemp;
      }
      if (this._currentSelected.templateInfo.Level < 10) {
        this.SpecialAbilityNameTxt.text = LangManager.Instance.GetTranslation(
          "PawnLevelUpWnd.SpecialAbilityNameTxt.openTxt",
        );
        this.SpecialAbilityNameTxt.color = "#FF2E2E";
        // this.SpecialAbilityNameTxt.x = 725;
        // this.SpecialAbilityNameTxt.y = 435;
        this.descTxt.text = "";
        this.Btn_Convert.visible = false;
        this.Btn_Apperceive.visible = false;
      } else {
        this.Btn_Convert.visible = true;
        this.Btn_Apperceive.visible = true;
        if (this.thane.grades < 40) {
          this.descTxt.text = LangManager.Instance.GetTranslation(
            "PawnLevelUpWnd.SpecialAbilityNameTxt.openTxt2",
          );
          this.Btn_Convert.enabled = false;
          this.Btn_Apperceive.enabled = false;
        }
      }
    }
  }

  private defaultSelected(value: ArmyPawn) {
    let btn: fgui.GButton = this._dic[value.templateInfo.SonType];
    this.onClickItem(btn);
    for (let i: number = 0; i < this._indexBtnArray.length; i++) {
      if (this._indexBtnArray[i] == btn) {
        this.PawnNameList.addSelection(i, true);
        break;
      }
    }
  }

  private getPawnNameByMasterType(value: number): string {
    return LangManager.Instance.GetTranslation(
      "PawnLevelUpWnd.soldier" + value,
    );
  }

  public get model(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  Show() {
    FrameCtrlManager.Instance.open(EmWindow.PawnLevelUp);
  }

  OnHideWind() {
    super.OnHideWind();
    this.PawnNameList.removeChildrenToPool(0, this._tempArr.length - 1);
    if (UIManager.Instance.isShowing(EmWindow.SoliderSkillTipWnd)) {
      UIManager.Instance.HideWind(EmWindow.SoliderSkillTipWnd);
    }
    this.removeEvent();
    PlayerManager.Instance.currentPlayerModel.setFightingCapacityRecord("end");
  }

  dispose() {
    super.dispose();
  }
}
