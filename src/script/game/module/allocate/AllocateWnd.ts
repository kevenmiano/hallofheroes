import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import UIManager from "../../../core/ui/UIManager";
import { ArmyEvent } from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { EmWindow } from "../../constant/UIDefine";
import { ArmyPawn } from "../../datas/ArmyPawn";
import { ArmyManager } from "../../manager/ArmyManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import BuildingManager from "../../map/castle/BuildingManager";
import BuildingType from "../../map/castle/consant/BuildingType";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import NewbieBaseConditionMediator from "../guide/mediators/NewbieBaseConditionMediator";
import AllocateItem from "./AllocateItem";
import AllocateCtrl from "./control/AllocateCtrl";
/**
 * 部队
 */
export default class AllocateWnd extends BaseWindow {
  private n5Txt: fgui.GLabel;
  public frame: fgui.GLabel;
  private playerItem: AllocateItem; //士兵头像
  private NameLevelTxt: fgui.GLabel; //士兵等级
  private SoliderNumtxt: fgui.GLabel; //带兵数
  public BtnFormation: UIButton; //阵型调整
  private BtnRecruit: UIButton; //招募士兵
  public SoliderList: fgui.GList = null;
  public modelEnable: boolean = false;

  private ap: ArmyPawn;
  private list: any[];
  public OnInitWind() {
    super.OnInitWind();
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "armyII.AllocateFrame.title",
    );
    this.n5Txt.text = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip12",
    );
    this.BtnRecruit.title = LangManager.Instance.GetTranslation(
      "armyII.viewII.allocate.AllocateView.recruit",
    );
    this.addEvent();
    this.setCenter();
    this.SoliderList.setVirtual();
    PlayerManager.Instance.currentPlayerModel.setFightingCapacityRecord(
      "start",
    );
  }

  OnShowWind() {
    super.OnShowWind();
    this.allocateControler.setOldData();
    this.refreshView();
  }

  private get allocateControler(): AllocateCtrl {
    return FrameCtrlManager.Instance.getCtrl(
      EmWindow.AllocateWnd,
    ) as AllocateCtrl;
  }

  private addEvent() {
    this.BtnFormation.onClick(this, this.__formationExHandler);
    this.BtnRecruit.onClick(this, this.__recruitHandler);
    ArmyManager.Instance.army.addEventListener(
      ArmyEvent.ARMY_INFO_CHANGE,
      this.refreshView,
      this,
    );
    ArmyManager.Instance.army.baseHero.addEventListener(
      PlayerEvent.THANE_INFO_UPDATE,
      this.refreshView,
      this,
    );
    ArmyManager.Instance.addEventListener(
      ArmyEvent.ARMY_INFO_CHANGE,
      this.refreshView,
      this,
    );
    this.SoliderList.itemRenderer = Laya.Handler.create(
      this,
      this.__renderListItem,
      null,
      false,
    );
  }

  private removeEvent() {
    this.BtnFormation.offClick(this, this.__formationExHandler);
    this.BtnRecruit.offClick(this, this.__recruitHandler);
    ArmyManager.Instance.army.removeEventListener(
      ArmyEvent.ARMY_INFO_CHANGE,
      this.refreshView,
      this,
    );
    ArmyManager.Instance.army.baseHero.removeEventListener(
      PlayerEvent.THANE_INFO_UPDATE,
      this.refreshView,
      this,
    );
    ArmyManager.Instance.removeEventListener(
      ArmyEvent.ARMY_INFO_CHANGE,
      this.refreshView,
      this,
    );
    if (this.SoliderList && this.SoliderList.itemRenderer) {
      (this.SoliderList.itemRenderer as Laya.Handler)?.recover();
      this.SoliderList.itemRenderer = null;
    }
  }

  private __renderListItem(index: number, item: AllocateItem) {
    if (!item || item.isDisposed) return;
    item.index = index + 1;
    if (this.list.length < 6) {
      let len: number = this.list.length;
      if (index < len) {
        item.pawn = this.list[index];
      } else {
        item.pawn = null;
      }
    } else {
      item.pawn = this.list[index];
    }
  }

  /**招募士兵 */
  private __recruitHandler() {
    FrameCtrlManager.Instance.open(
      EmWindow.CasernWnd,
      BuildingManager.Instance.model.getBuildingInfoBySonType(
        BuildingType.CASERN,
      ),
    );
    FrameCtrlManager.Instance.exit(EmWindow.AllocateWnd);
  }

  /**阵型调整 */
  private __formationExHandler() {
    if (!NewbieBaseConditionMediator.checkConditionCommon(22)) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("AllocateWnd.soldiersToBattle"),
      );
      return;
    }
    this.BtnFormation.enabled = false;
    Laya.timer.once(500, this, () => {
      this.BtnFormation.enabled = true;
    });
    UIManager.Instance.ShowWind(EmWindow.AllocateFormationWnd);
  }

  private refreshView() {
    this.ap = ArmyManager.Instance.army.getPawnByIndex(0);
    if (this.playerItem) {
      this.playerItem.index = 0;
      this.playerItem.pawn = this.ap;
    }
    if (this.ap && this.ap.templateInfo && this.ap.ownPawns > 0) {
      this.NameLevelTxt.text =
        this.ap.templateInfo.PawnNameLang +
        " " +
        LangManager.Instance.GetTranslation(
          "buildings.casern.view.RecruitPawnCell.command06",
          this.ap.templateInfo.Level,
        );
    } else {
      this.NameLevelTxt.text = "";
    }
    this.SoliderNumtxt.text =
      ArmyManager.Instance.army.countAllArmyPawnNmber() +
      "/" +
      ArmyManager.Instance.army.baseHero.attackProrerty.totalConatArmy;
    this.list = ArmyManager.Instance.castlePawnList.getList();
    this.list = this.filterByCount(this.list);
    this.list.sort(this.sortByNeedBuild);
    if (this.list.length < 6) {
      this.SoliderList.numItems = 6;
    } else {
      this.SoliderList.numItems = this.list.length;
    }
    this.SoliderList.ensureBoundsCorrect();
  }

  private filterByCount(list: any[]): any[] {
    var arr: any[] = [];
    var len: number = list.length;
    var ap: ArmyPawn;
    var serialPawn: ArmyPawn = ArmyManager.Instance.army.getPawnByIndex(0);
    for (var i: number = 0; i < len; i++) {
      ap = list[i] as ArmyPawn;
      if (
        ap.ownPawns > 0 ||
        (ap.templateId == serialPawn.templateId && serialPawn.ownPawns > 0)
      ) {
        arr.push(list[i]);
      }
    }
    return arr;
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

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
    if (UIManager.Instance.isShowing(EmWindow.SoliderInfoTipWnd)) {
      //如果有弹窗
      UIManager.Instance.HideWind(EmWindow.SoliderInfoTipWnd);
    }
    PlayerManager.Instance.currentPlayerModel.setFightingCapacityRecord("end");
  }
}
