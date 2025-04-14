//@ts-expect-error: External dependencies
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { ArmyPawn } from "../../datas/ArmyPawn";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { ArmySocketOutManager } from "../../manager/ArmySocketOutManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import UIButton from "../../../core/ui/UIButton";
import { ShowAvatarBattle } from "../../avatar/view/ShowAvatarBattle";
import { GameLoadNeedData } from "../../battle/data/GameLoadNeedData";
import { PathManager } from "../../manager/PathManager";
import { HeroMovieClipRefType } from "../../constant/BattleDefine";

/**
 * 阵型调整
 *
 */
export default class AllocateFormationWnd extends BaseWindow {
  private ap: ArmyPawn;
  private pawnFigureData: GameLoadNeedData;

  private _frontRowIndex: number = 2;
  private _backRowIndex: number = 3;

  /**
   * 新手配置里面用到, 不要改名字
   */
  public BtnFrontRow: UIButton;
  public BtnBackRow: UIButton;

  private figureItem1: ShowAvatarBattle; //前排
  private figureItem2: ShowAvatarBattle; //前排
  private figureItem3: ShowAvatarBattle; //前排
  private figureItem4: ShowAvatarBattle; //后排
  private figureItem5: ShowAvatarBattle; //后排
  private figureItem6: ShowAvatarBattle; //后排

  private _intervalTime: number = 0;
  private selectedPic: fgui.GImage;
  private _type: number = 0; //0后排 1前排
  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initView();
  }

  public OnShowWind() {
    super.OnShowWind();
    this.refreshView();
  }

  private addEvent() {
    this.BtnBackRow.onClick(this, this.__backRowBtnClickHandler);
    this.BtnFrontRow.onClick(this, this.__frontRowBtnClickHandler);
  }

  private offEvent() {
    this.BtnBackRow.offClick(this, this.__backRowBtnClickHandler);
    this.BtnFrontRow.offClick(this, this.__frontRowBtnClickHandler);
  }

  private initView() {
    for (let index = 1; index <= 6; index++) {
      this["figureItem" + index] = new ShowAvatarBattle(
        HeroMovieClipRefType.UI_PANEL,
      );
      let item = this["figureItem" + index] as ShowAvatarBattle;
      let posX = this["bg" + index].x;
      let posY = this["bg" + index].y;
      item.pos(posX, posY);
      item.setNameColor("#00F0FF");
      item.setNameStroke(0, 1);
      this.addChild(item);
    }
  }

  private __frontRowBtnClickHandler() {
    if (this._type == 1) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "FormationExWnd.frontRowBtnClickHandler.tips",
        ),
      );
      return;
    }
    if (Laya.Browser.now() - this._intervalTime < 1000) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.view.ActivityItem.command01",
        ),
      );
      return;
    }
    this._intervalTime = Laya.Browser.now();
    if (this.ap && this.ap.templateInfo && this.ap.ownPawns > 0) {
      ArmyManager.Instance.army.baseHero.fightPos = this._backRowIndex;
      this.armyPawn.fightPos = this._frontRowIndex;
      this.selectedPic.x = 724;
      this._type = 1;
      ArmySocketOutManager.sendEditArmyPos(
        ArmyManager.Instance.army.baseHero.userId,
        ArmyManager.Instance.army.baseHero.fightPos,
        this.armyPawn.fightPos,
      );
      ArmyManager.Instance.isSorted = true;
      this.refreshArmyView();
    } else {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("armyII.ArmyControler.command02"),
      );
      return;
    }
  }

  private __backRowBtnClickHandler() {
    if (this._type == 0) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "FormationExWnd.backRowBtnClickHandler.tips",
        ),
      );
      return;
    }
    if (Laya.Browser.now() - this._intervalTime < 1000) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.view.ActivityItem.command01",
        ),
      );
      return;
    }
    this._intervalTime = Laya.Browser.now();
    if (this.ap && this.ap.templateInfo && this.ap.ownPawns > 0) {
      ArmyManager.Instance.army.baseHero.fightPos = this._frontRowIndex;
      this.armyPawn.fightPos = this._backRowIndex;
      this.selectedPic.x = 478;
      this._type = 0;
      ArmySocketOutManager.sendEditArmyPos(
        ArmyManager.Instance.army.baseHero.userId,
        ArmyManager.Instance.army.baseHero.fightPos,
        this.armyPawn.fightPos,
      );
      ArmyManager.Instance.isSorted = true;
      this.refreshArmyView();
    } else {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("armyII.ArmyControler.command02"),
      );
      return;
    }
  }

  private refreshRowBtnState() {
    if (this.ap.ownPawns != 0) {
      if (
        ArmyManager.Instance.army.baseHero.fightPos == this._frontRowIndex &&
        this.armyPawn.fightPos == this._backRowIndex
      ) {
        this.selectedPic.x = 478;
        this._type = 0;
      } else if (
        ArmyManager.Instance.army.baseHero.fightPos == this._backRowIndex &&
        this.armyPawn.fightPos == this._frontRowIndex
      ) {
        this.selectedPic.x = 724;
        this._type = 1;
      } else {
        this.selectedPic.x = 478;
        this._type = 0;
      }
    }
  }

  private get armyPawn(): ArmyPawn {
    return ArmyManager.Instance.army.armyPawns[0];
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private refreshView() {
    if (!this.ap) {
      this.ap = ArmyManager.Instance.army.getPawnByIndex(0);
    }
    if (!this.pawnFigureData) {
      this.pawnFigureData = new GameLoadNeedData();
    }
    this.pawnFigureData.urlPath = PathManager.solveRolePath(
      this.ap.templateInfo.Swf.toLocaleLowerCase(),
    );
    this.pawnFigureData.name = this.ap.templateInfo.PawnNameLang;
    this.pawnFigureData.grade = this.ap.templateInfo.Level;

    this.refreshRowBtnState();
    this.refreshArmyView();
    this.addEvent();
  }

  private refreshArmyView() {
    if (this._type == 1) {
      this.figureItem1.data = this.pawnFigureData;
      this.figureItem3.data = this.pawnFigureData;
      this.figureItem5.data = this.thane;
      this.figureItem2.data = null;
      this.figureItem4.data = null;
      this.figureItem6.data = null;
    } else {
      this.figureItem2.data = this.thane;
      this.figureItem4.data = this.pawnFigureData;
      this.figureItem6.data = this.pawnFigureData;
      this.figureItem1.data = null;
      this.figureItem3.data = null;
      this.figureItem5.data = null;
    }
  }

  public OnHideWind() {
    super.OnHideWind();
    this.offEvent();
  }

  public dispose() {
    for (let index = 1; index <= 6; index++) {
      this["figureItem" + index].dispose();
    }
    super.dispose();
  }
}
