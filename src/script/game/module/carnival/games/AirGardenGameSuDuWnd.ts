import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import OpSuDuCellGroup from "./OpSuDuCellGroup";
import SuDuCellGroup from "./SuDuCellGroup";

//@ts-expect-error: External dependencies

import ICell = com.road.yishi.pb.minigame.ICell;
//@ts-expect-error: External dependencies

import IValueNum = com.road.yishi.pb.minigame.IValueNum;
//@ts-expect-error: External dependencies

import SudokuGameMsg = com.road.yishi.pb.minigame.SudokuGameMsg;
import AirGardenGameSuDuItem from "./AirGardenGameSuDuItem";
import { AirGardenSudokuManager } from "../../../manager/AirGardenSudokuManager";
import LangManager from "../../../../core/lang/LangManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import CarnivalModel from "../model/CarnivalModel";
import { PlayerManager } from "../../../manager/PlayerManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";

export default class AirGardenGameSuDuWnd extends BaseWindow {
  protected setSceneVisibleOpen: boolean = true;
  protected resizeContent: boolean = true;
  protected resizeFullContent: boolean = true;

  public ptxt: fgui.GTextField;
  public ptxtShade: fgui.GTextField;
  public _targetScoreTxt: fgui.GTextField;
  public _txtMyScore: fgui.GTextField;
  public _txtTime: fgui.GTextField;
  public _txtRule: fgui.GTextField;
  public startBtn: fgui.GButton;
  public cellGroup: SuDuCellGroup;
  public opCellGroup: OpSuDuCellGroup;
  public deleteBtn: fgui.GButton;
  public undoBtn: fgui.GButton;
  public useToolBtn: fgui.GButton;
  public gbBtn: fgui.GButton;
  public _txtTimeAdd: fgui.GTextField;
  public _ruleTitle: fgui.GTextField;
  public _toolTitle: fgui.GTextField;

  private startTime: number = 0;
  private totalTime = 0;

  private startGame = false;

  public OnInitWind() {
    super.OnInitWind();
    this.addEvent();
    this.initTranslate();
    this.initView();
  }

  private addEvent() {
    this.startBtn.onClick(this, this.onStartGameClick);
    this.deleteBtn.onClick(this, this.onDeleteClick);
    this.undoBtn.onClick(this, this.onUnDoClick);
    this.useToolBtn.onClick(this, this.onAutoClick);
    this.cellGroup.onClick(this, this.onSelectBoardCell);
    AirGardenSudokuManager.Instance.addEventListener(
      AirGardenSudokuManager.RECEIVE_MESSAGE,
      this.updateView,
      this,
    );
    this.gbBtn.onClick(this, this.onCloseBtn);
  }

  private initTranslate() {
    this._targetScoreTxt.text = LangManager.Instance.GetTranslation(
      "Carnival.AirGardenGameSuDu.targetScoreTxt",
    );
    this._txtMyScore.text = LangManager.Instance.GetTranslation(
      "Carnival.AirGardenGameSuDu.txtMyScore",
    );
    this._txtTime.text = LangManager.Instance.GetTranslation(
      "Carnival.AirGardenGameSuDu.txtTime",
    );

    this._ruleTitle.text = LangManager.Instance.GetTranslation(
      "Carnival.AirGardenGameSuDu.ruleTitle",
    );
    this._toolTitle.text = LangManager.Instance.GetTranslation(
      "Carnival.AirGardenGameSuDu.toolTitle",
    );
    this._txtTimeAdd.text = LangManager.Instance.GetTranslation(
      "Carnival.AirGardenGameSuDu.txtTimeAdd",
    );

    this.useToolBtn.title = LangManager.Instance.GetTranslation(
      "Carnival.AirGardenGameSuDu.useToolBtn",
    );
    this.startBtn.title = LangManager.Instance.GetTranslation(
      "Carnival.AirGardenGameSuDu.startBtn",
    );
    this.ptxt.text = LangManager.Instance.GetTranslation(
      "AirGardenGame.sudoku.title",
    );
    this.ptxtShade.text = LangManager.Instance.GetTranslation(
      "AirGardenGame.sudoku.title",
    );
  }

  private initView() {
    this.startBtn.visible = true;
    this.cellGroup.visible = false;
    this.useToolBtn.enabled = false;
    this.deleteBtn.enabled = false;
    this.undoBtn.enabled = false;
    this._txtRule.text = LangManager.Instance.GetTranslation(
      "AirGardenGame.sudoku.rule",
    );
  }

  private enableOption() {
    this.useToolBtn.enabled = true;
    this.deleteBtn.enabled = true;
    this.undoBtn.enabled = true;
  }

  private onStartGameClick() {
    AirGardenSudokuManager.Instance.sendGameOption(1);
    this.startBtn.visible = false;
    this.cellGroup.visible = true;
  }

  private onDeleteClick() {
    AirGardenSudokuManager.Instance.sendGameOption(5);
  }

  private onUnDoClick() {
    AirGardenSudokuManager.Instance.sendGameOption(4);
  }

  private onAutoClick() {
    AirGardenSudokuManager.Instance.sendGameOption(3);
  }

  private onCloseBtn() {
    // if (this.startGame) {
    //     this.sendClose();
    //     return;
    // }
    // //未开始游戏直接关闭
    // this.hide();

    this.confirmExit();
  }

  private removeEvent() {
    this.startBtn.offClick(this, this.onStartGameClick);
    this.deleteBtn.offClick(this, this.onDeleteClick);
    this.undoBtn.offClick(this, this.onUnDoClick);
    this.useToolBtn.offClick(this, this.onAutoClick);
    this.cellGroup.offClick(this, this.onSelectBoardCell);
    AirGardenSudokuManager.Instance.removeEventListener(
      AirGardenSudokuManager.RECEIVE_MESSAGE,
      this.updateView,
      this,
    );
    Laya.timer.clear(this, this.updateCd);
    this.gbBtn.offClick(this, this.onCloseBtn);
  }

  private updateView(msg: SudokuGameMsg) {
    if (!msg.result) return;

    //关闭
    if (msg.opType == 6 && msg.result) {
      this.hide();
      return;
    }

    let boards: ICell[] = [];

    this.totalTime = msg.totalTime;

    this.startTime = msg.startTime as number;

    if (msg.actCell) {
      //撤销,把值重置为0
      msg.opType == 4 && (msg.actCell.value = 0);

      boards.push(msg.actCell);
    }

    if (msg.board) {
      boards.push(...msg.board);
    }

    //1 开始游戏，5 重置游戏。
    this.updateBoard(boards, msg.opType == 1 || msg.opType == 5);
    //开始游戏时，默认不选中数字
    msg.valueNumList && this.updateValueNum(msg.valueNumList, msg.opType != 1);

    //下一题
    if (msg.opType == 1 && this.startGame) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("AirGardenGame.sudoku.next"),
      );
    }

    if (msg.opType == 1 || msg.opType == 3) {
      this._txtTimeAdd.setVar("count", msg.addTimeCount + "").flushVars();
      if (!this.startGame) {
        Laya.timer.loop(1000, this, this.updateCd);
      }

      this.startGame = true;
      this.updateCd();
    }

    if (msg.opType == 1) {
      this.enableOption();
      let temp = TempleteManager.Instance.getCarnivalByType(
        CarnivalModel.TYPE_GAME_SHPK,
      );
      if (temp.length) this.updateTargetPoints(temp[0].Target);
    }

    let lr = -1;
    let lc = -1;

    if (msg.lastAns) {
      lr = msg.lastAns.row;
      lc = msg.lastAns.col;
    }

    this.cellGroup.showSelected(lr, lc);
    this.updateMyPoints(msg.score);
  }

  private updateCd() {
    let curTime =
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000;
    let offtime = curTime - this.startTime;
    if (offtime < 0) {
      offtime = 0;
    }
    let cd = this.totalTime - offtime;
    if (cd < 0) {
      cd = 0;
      this.sendClose();
      Laya.timer.clear(this, this.updateCd);
    }
    cd = Math.floor(cd / 1000);
    this._txtTime.setVar("score", cd + "").flushVars();
  }

  private updateMyPoints(my: number) {
    this._txtMyScore.setVar("score", my + "").flushVars();
  }

  private updateTargetPoints(target: number) {
    this._targetScoreTxt.setVar("score", target + "").flushVars();
  }

  private updateBoard(cells: ICell[], first = false) {
    for (let cell of cells) {
      this.cellGroup.setCellItem(cell.row, cell.col, cell.value, first);
    }
  }

  private updateValueNum(valueNums: IValueNum[], isUpdateSelect = true) {
    for (let vn of valueNums) {
      this.opCellGroup.setNum(vn.value, vn.Num);
    }
    isUpdateSelect && this.opCellGroup.updateSelected();
  }

  private onSelectBoardCell(e) {
    let target = e.target;
    if (target.$owner && target.$owner instanceof AirGardenGameSuDuItem) {
      let item = target.$owner as AirGardenGameSuDuItem;
      if (item.value != 0) return;
      let select = this.opCellGroup.getCurSelected();
      if (!select) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "carnival.minigame.sudoku.select.tip",
          ),
        );
        return;
      }
      if (select.count <= 0) return;
      if (this.cellGroup.checkValue(item.row, item.col, select.value)) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("carnival.minigame.sudoku.tip"),
        );
        return;
      }
      AirGardenSudokuManager.Instance.sendGameOption(
        2,
        item.col,
        item.row,
        select.value,
      );
    }
  }

  private confirmExit() {
    var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    var str: string = LangManager.Instance.GetTranslation(
      "AirGardenGame.exit.hint",
    );
    SimpleAlertHelper.Instance.popAlerFrame(prompt, str, confirm, cancel, {
      callback: this.realDispose.bind(this),
    });
    return;
  }

  private realDispose(b: boolean, flag: boolean) {
    if (b) {
      this.sendClose();
    }
  }

  private sendClose() {
    AirGardenSudokuManager.Instance.sendGameOption(6);
  }

  public OnHideWind() {
    this.removeEvent();
  }
}
