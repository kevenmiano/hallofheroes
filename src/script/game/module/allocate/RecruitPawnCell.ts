import {
  ArmyEvent,
  PawnEvent,
  ServiceReceiveEvent,
} from "../../constant/event/NotificationEvent";
import { ArmyPawn } from "../../datas/ArmyPawn";
import { TempleteManager } from "../../manager/TempleteManager";
import BuildingManager from "../../map/castle/BuildingManager";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import { t_s_pawntemplateData } from "../../config/t_s_pawntemplate";
import LangManager from "../../../core/lang/LangManager";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { IconFactory } from "../../../core/utils/IconFactory";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { PlayerManager } from "../../manager/PlayerManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { ResourceManager } from "../../manager/ResourceManager";
import BuildingType from "../../map/castle/consant/BuildingType";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import { ArrayUtils, ArrayConstant } from "../../../core/utils/ArrayUtils";
import { UIFilter } from "../../../core/ui/UIFilter";
import Utils from "../../../core/utils/Utils";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { t_s_buildingtemplateData } from "../../config/t_s_buildingtemplate";
import FUI_RecruitPawnCell from "../../../../fui/Allocate/FUI_RecruitPawnCell";
import ResMgr from "../../../core/res/ResMgr";
import UIButton from "../../../core/ui/UIButton";
import OpenGrades from "../../constant/OpenGrades";

/**
 * @author:pzlricky
 * @data: 2021-02-19 20:43
 * @description ***
 */
export default class RecruitPawnCell extends FUI_RecruitPawnCell {
  private _data: ArmyPawn;
  private pawnTemp: t_s_pawntemplateData;
  private _number: number; //士兵数量
  private _model: PlayerModel;

  private btnUpgrade: UIButton;
  private btnRecruitPawn: UIButton;

  protected onConstruct() {
    super.onConstruct();
    this.playerCom = this.getChild("playerCom").asLoader;
    this.Btn_Upgrade = this.getChild("Btn_Upgrade").asButton;
    this.Btn_RecruitPawn = this.getChild("Btn_RecruitPawn").asButton;

    this.btnUpgrade = new UIButton(this.Btn_Upgrade);
    this.btnRecruitPawn = new UIButton(this.Btn_RecruitPawn);
    this.addEvent();
    this._model = PlayerManager.Instance.currentPlayerModel;
    Utils.setDrawCallOptimize(this);
  }

  public setArmyData(value: ArmyPawn) {
    if (this._data) {
      this._data.removeEventListener(
        PawnEvent.PAWN_PROPERTY_CHAGER,
        this.__pawnChangeHandler,
        this,
      );
    }
    this._data = value;
    if (this._data) {
      this._data.addEventListener(
        PawnEvent.PAWN_PROPERTY_CHAGER,
        this.__pawnChangeHandler,
        this,
      );
    }
    this.refreshView();
    this.updateIconData();
  }

  private addEvent() {
    this.btnUpgrade.onClick(this, this.__upgradePawnHandler);
    this.btnRecruitPawn.onClick(this, this.__recruitPawnBtn);
    this.playerCom.on(Laya.Event.CLICK, this, this._playerComClickHander);
    ArmyManager.Instance.addEventListener(
      ServiceReceiveEvent.UPGRADE_PAWN_SUCCESS,
      this.__pawnLevelUpHandler,
      this,
    );
    ArmyManager.Instance.addEventListener(
      ArmyEvent.ARMY_INFO_CHANGE,
      this.__pawnChangeHandler,
      this,
    );
  }

  private removeEvent() {
    if (this._data) {
      this._data.removeEventListener(
        PawnEvent.PAWN_PROPERTY_CHAGER,
        this.__pawnChangeHandler,
        this,
      );
    }
    this.btnRecruitPawn.offClick(this, this.__recruitPawnBtn);
    this.btnUpgrade.offClick(this, this.__upgradePawnHandler);
    this.playerCom.off(Laya.Event.CLICK, this, this._playerComClickHander);
    ArmyManager.Instance.removeEventListener(
      ServiceReceiveEvent.UPGRADE_PAWN_SUCCESS,
      this.__pawnLevelUpHandler,
      this,
    );
    ArmyManager.Instance.removeEventListener(
      ArmyEvent.ARMY_INFO_CHANGE,
      this.__pawnChangeHandler,
      this,
    );
  }

  private __recruitPawnBtn() {
    let population: number = ResourceManager.Instance.population.count;
    let maxPopulation: number = ResourceManager.Instance.population.limit;
    let need: number = (this._data as ArmyPawn).templateInfo.NeedPopulation;
    let number: number = (maxPopulation - population) / need;
    let maxEffectBuildingArray: any[] =
      BuildingManager.Instance.getMaxEffectBuildingTemplate(this.pawnTemp);
    maxEffectBuildingArray = ArrayUtils.sortOn(
      maxEffectBuildingArray,
      "Property4",
      ArrayConstant.NUMERIC,
    );
    let buildTemp: t_s_buildingtemplateData = <t_s_buildingtemplateData>(
      maxEffectBuildingArray[0]
    );
    let race: number = buildTemp.Property4 / 100;
    let goldValue: number =
      this._model.playerEffect.getRecruitPawnResourceAddition(
        this.pawnTemp.GoldConsume * (1 - race),
      );
    let str: string = "";
    if (number <= 0) {
      if (
        BuildingManager.Instance.getBuildingInfoBySonType(BuildingType.HOUSES)
          .templeteInfo.NextGradeTemplateId == 0
      ) {
        str = LangManager.Instance.GetTranslation(
          "buildings.casern.view.RecruitPawnCell.command03",
        );
        MessageTipManager.Instance.show(str);
      } else {
        str = LangManager.Instance.GetTranslation(
          "buildings.casern.view.RecruitPawnCell.command04",
        );
        MessageTipManager.Instance.show(str);
      }
    } else if (goldValue > ResourceManager.Instance.gold.count) {
      str = LangManager.Instance.GetTranslation("public.gold");
      MessageTipManager.Instance.show(str);
    } else {
      FrameCtrlManager.Instance.open(EmWindow.CasernRecruitWnd, this._data);
    }
  }

  private __upgradePawnHandler(event: MouseEvent) {
    FrameCtrlManager.Instance.exit(EmWindow.CasernWnd);
    FrameCtrlManager.Instance.open(EmWindow.PawnLevelUp, this._data);
  }

  private _playerComClickHander() {
    if (UIManager.Instance.isShowing(EmWindow.SoliderInfoTipWnd)) {
      //如果有弹窗
    } else {
      //没有弹窗则弹窗
      let point = this.parent.localToGlobal(this.playerCom.x, this.playerCom.y);
      UIManager.Instance.ShowWind(EmWindow.SoliderInfoTipWnd, {
        posX: point.x,
        posY: point.y,
        pawnData: this._data,
        type: 3,
      });
    }
  }

  private __pawnLevelUpHandler(sonType: number) {
    if (this.pawnTemp && sonType == this.pawnTemp.SonType) {
      this.updateIconData();
      this.refreshView();
    }
  }

  public get ArmyData(): ArmyPawn {
    return this._data;
  }

  private refreshView() {
    if (!this._data) return;
    this.pawnTemp = this._data.templateInfo;
    let b: t_s_buildingtemplateData =
      TempleteManager.Instance.getBuildTemplateByID(
        parseInt(this.pawnTemp.NeedBuilding.toString()),
      );
    let buildInfo: BuildInfo = b
      ? BuildingManager.Instance.getBuildingInfoBySonType(b.SonType)
      : null;
    let flag: boolean = buildInfo
      ? buildInfo.templeteInfo.BuildingGrade >= b.BuildingGrade
      : true;
    let ap = ArmyManager.Instance.army.getPawnByIndex(0);
    if (ap && ap.ownPawns > 0) {
      this.isEquip.selectedIndex =
        ap.templateId == this.pawnTemp.TemplateId ? 1 : 0;
    } else {
      this.isEquip.selectedIndex = 0;
    }
    if (this._data.canRecruit && flag) {
      this.unLock.selectedIndex = 0;
      this.titleNameTxt.text =
        this.pawnTemp.PawnNameLang +
        " " +
        LangManager.Instance.GetTranslation(
          "buildings.casern.view.RecruitPawnCell.command06",
          this.pawnTemp.Level,
        );
      this.number = this._data.ownPawns;
      this.needOpenGradeTxt.text = "";
      let onPawns =
        this._data.ownPawns +
        ArmyManager.Instance.getCasernOnPawn(this.pawnTemp.SonType);
      if (onPawns > 0)
        this.ownCount.text = LangManager.Instance.GetTranslation(
          "buildings.casern.view.RecruitPawnCell.command07",
          onPawns,
        );
      else this.ownCount.text = "";
      this.btnRecruitPawn.visible = true;
      this.btnUpgrade.visible = this.thane.grades >= OpenGrades.ARMY;
      this.btnRecruitPawn.enabled = true;
      this.btnUpgrade.enabled = true;
      UIFilter.normal(this.playerCom.displayObject);
    } else {
      this.unLock.selectedIndex = 1;
      this.titleNameTxt.text =
        this.pawnTemp.PawnNameLang +
        " " +
        LangManager.Instance.GetTranslation(
          "buildings.casern.view.RecruitPawnCell.command06",
          this.pawnTemp.Level,
        );
      this.needOpenGradeTxt.text = LangManager.Instance.GetTranslation(
        "buildings.casern.view.RecruitPawnCell.command05",
        this.getNeedBuilding(
          parseInt(this._data.templateInfo.NeedBuilding.toString()),
        ),
      );
      this.ownCount.text = "";
      this.btnRecruitPawn.visible = this.btnUpgrade.visible = false;
      UIFilter.dark(this.playerCom.displayObject);
      this.btnRecruitPawn.enabled = false;
      this.btnUpgrade.enabled = false;
    }
  }

  private getNeedBuilding(id: number): string {
    let b: t_s_buildingtemplateData =
      TempleteManager.Instance.getBuildTemplateByID(id);
    return LangManager.Instance.GetTranslation(
      "public.level.name",
      b.BuildingNameLang,
      b.BuildingGrade,
    );
  }

  private updateIconData() {
    let url = IconFactory.getSoldierIconByIcon(this._data.templateInfo.Icon);
    ResMgr.Instance.loadRes(url, (res) => {
      if (res && !this.isDisposed) {
        this.playerCom.url = url;
      }
    });
  }

  private __pawnChangeHandler() {
    this.refreshView();
    this.updateIconData();
  }

  public set number(value: number) {
    this._number = value;
  }
  public get number(): number {
    return this._number;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  public dispose() {
    this.removeEvent();
    super.dispose();
  }
}
