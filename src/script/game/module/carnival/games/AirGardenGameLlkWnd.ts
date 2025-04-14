import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import StringHelper from "../../../../core/utils/StringHelper";
import Utils from "../../../../core/utils/Utils";
import { HintTips } from "../../../component/HintTips";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_carnivalpointexchangeData } from "../../../config/t_s_carnivalpointexchange";
import { EmWindow } from "../../../constant/UIDefine";
import AirGardenGameLlkManager from "../../../manager/AirGardenGameLlkManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { MsgMan } from "../../../manager/MsgMan";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import CarnivalModel from "../model/CarnivalModel";
import LlkDeleteData from "../model/llk/LlkDeleteData";
import LlkModel from "../model/llk/LlkModel";
import { AirGardenGameLLKGroup } from "./AirGardenGameLLKGroup";
import AirGardenGameLLKItem from "./AirGardenGameLLKItem";

/**
 * 连连看主界面
 */
export default class AirGardenGameLLKWnd extends BaseWindow {
  protected setSceneVisibleOpen: boolean = true;
  protected resizeContent: boolean = true;
  protected resizeFullContent: boolean = true;

  private txt_Title: fgui.GTextField;
  private txt_score: fgui.GTextField;
  private txt_myPoint: fgui.GTextField;
  private txt_time: fgui.GTextField;
  private txt_wash_card: fgui.GTextField;
  private txt_bomb: fgui.GTextField;

  private _btnStart: UIButton;
  private _btnWashCard: UIButton;
  private _btnUseBomb: UIButton;

  private _selected: AirGardenGameLLKItem; //第一次选中的

  // private list: fgui.GList;

  private tickTime: number = 0;

  public itemGroup: AirGardenGameLLKGroup;

  private gameState: fgui.Controller;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initEvent();
    this.initView();
    this.initNode();
  }

  private initView() {
    //用xml 多语言文字大小
    // this.txt_Title.text = LangManager.Instance.GetTranslation("AirGardenGame.llk.title");
    this.gameState = this.getController("gameState");

    var temp: t_s_carnivalpointexchangeData[] =
      TempleteManager.Instance.getCarnivalByType(CarnivalModel.GAME_TYPE_1);
    if (temp && temp.length) {
      this.txt_score.text = LangManager.Instance.GetTranslation(
        "samll.game.score",
        temp[0].Target,
      );
    }
    //x 请放入语言包里面
    this.txt_myPoint.text = LangManager.Instance.GetTranslation(
      "carnival.awardpoint.point",
      "0",
    );
    this.txt_time.text = LangManager.Instance.GetTranslation(
      "openBox.tip.countdown",
      0,
    );
    this.txt_bomb.text = LangManager.Instance.GetTranslation(
      "llk.view.LlkGoodsItem.GoodsName1",
      "" + 0,
    );
    this.txt_wash_card.text = LangManager.Instance.GetTranslation(
      "llk.view.LlkGoodsItem.GoodsName2",
      "" + 0,
    );

    this.gameState.selectedIndex = 0;
  }

  private initNode() {
    let totalCount = LlkModel.ROW * LlkModel.COLUMN;
    // this.list.numItems = totalCount;
    this.renderItemGroup();
  }

  private renderItemGroup() {
    for (let i = 0; i < this.llkModel.list.length; i++) {
      let data = this.llkModel.list[i];
      let item = this.itemGroup.getItemAt(i);
      item.NodeData = data;
    }
  }

  renderListItem(index: number, item: AirGardenGameLLKItem) {
    if (item && !item.isDisposed) {
      let data = this.llkModel.list[index];
      item.NodeData = data;
    }
  }

  private initEvent() {
    // this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
    // this.list.on(fairygui.Events.CLICK_ITEM, this, this.__clickHandler);
    this.itemGroup.onClick(this, this.__clickHandler);
    this._btnStart.onClick(this, this.__clickStart);
    this._btnWashCard.onClick(this, this.__useClickHandler2);
    this._btnUseBomb.onClick(this, this.__useClickHandler1);
    MsgMan.addObserver(LlkModel.LLK_INFO, this, this.__infoHandler);
    Laya.stage.timerLoop(1000, this, this.tick);
  }

  private removeEvent() {
    // if (this.list.itemRenderer) {
    //     this.list.itemRenderer.recover();
    //     this.list.itemRenderer = null;
    // }
    // this.list.off(fairygui.Events.CLICK_ITEM, this, this.__clickHandler);
    this._btnStart.offClick(this, this.__clickStart);
    this._btnWashCard.offClick(this, this.__useClickHandler2);
    this._btnUseBomb.offClick(this, this.__useClickHandler1);
    MsgMan.removeObserver(LlkModel.LLK_INFO, this, this.__infoHandler);
    Laya.stage.clearTimer(this, this.tick);
  }

  private requestInfo(b: boolean = false, payType: boolean = false) {
    AirGardenGameLlkManager.Instance.llkOp(AirGardenGameLlkManager.START);
  }

  private tick() {
    if (this.llkModel.info.time == 0) return;
    var remain: number = this.llkModel.info.time - this.tickTime;
    this.txt_time.text = LangManager.Instance.GetTranslation(
      "openBox.tip.countdown",
      remain,
    );
    this.tickTime++;
    if (remain <= 0) {
      this.dispose();
    }
  }

  private __infoHandler(msg: string, body: object) {
    while (this.llkModel.info.deleteList.length > 0) {
      this.deleteNode(this.llkModel.info.deleteList.shift());
    }
    let count = LlkModel.ROW * LlkModel.COLUMN;
    for (var i: number = 0; i < count; i++) {
      let nodeItem = this.itemGroup.getItemAt(i);
      if (nodeItem) {
        nodeItem.NodeData = this.llkModel.list[i];
      }
    }
    if (StringHelper.isNullOrEmpty(this.llkModel.info.points)) {
      //空地图
      this.gameState.selectedIndex = 0;
    } else {
      this.gameState.selectedIndex = 1;
    }
    //"x" 请放入 语言包里面
    this.txt_myPoint.text = LangManager.Instance.GetTranslation(
      "carnival.awardpoint.point",
      this.llkModel.info.score + "",
    );
    this.txt_bomb.text = LangManager.Instance.GetTranslation(
      "llk.view.LlkGoodsItem.GoodsName1",
      "" + this.llkModel.info.bombCount,
    );
    this.txt_wash_card.text = LangManager.Instance.GetTranslation(
      "llk.view.LlkGoodsItem.GoodsName2",
      "" + this.llkModel.info.resetCount,
    );
  }

  private deleteNode(value: LlkDeleteData) {
    if (
      AirGardenGameLlkManager.Instance.model.checkByPos(
        value.node1,
        value.node2,
        true,
      )
    ) {
      let count: number = 0;
      let nodeIndex1: number =
        value.node1.row * LlkModel.COLUMN + value.node1.col;
      let nodeIndex2: number =
        value.node2.row * LlkModel.COLUMN + value.node2.col;
      this.llkModel.list[nodeIndex1].mcType = 3;
      this.llkModel.list[nodeIndex2].mcType = 4;
      let targetPos = new Laya.Point();
      count = this.llkModel.list.length;
      for (var i: number = 0; i < count; i++) {
        let indexValue = i;
        let nodeItem = this.itemGroup.getItemAt(indexValue);
        if (nodeItem && !nodeItem.isDisposed) nodeItem.play();
        if (indexValue == nodeIndex2) {
          targetPos = nodeItem.localToGlobal();
        }
      }

      this.playScore(value.addScore, targetPos);
      if (value.combCount > 0) {
        Utils.delay(250).then(() => {
          this.playCombox(value.combCount, targetPos);
        });
      }
    }
  }

  /**播放连击 */
  private playCombox(value: number, point: Laya.Point) {
    HintTips.showHintLabel(
      HintTips.createLabLLk(
        LangManager.Instance.GetTranslation(
          "airGardenGameLLKWnd.combot.tip",
          value,
        ),
        point,
      ),
    );
  }

  /**播放获得积分 */
  private playScore(value: number, point: Laya.Point) {
    HintTips.showHintLabel(
      HintTips.createLabLLk(
        LangManager.Instance.GetTranslation(
          "airGardenGameLLKWnd.score.tip",
          value,
        ),
        point,
      ),
    );
  }

  /**
   *最后一对消除完后, 显示开始关卡按钮
   */
  private checkNullMap() {
    if (this.isNullMap) {
      //空地图
      // MonopolySocketOutManager.sendTriggerConfirm();
      FrameCtrlManager.Instance.exit(EmWindow.AirGardenGameLLK);
    }
  }

  private get isNullMap(): boolean {
    if (StringHelper.isNullOrEmpty(this.llkModel.info.points)) return true; //空地图
    var arr: Array<string> = [];
    var result: boolean = true;
    arr = this.llkModel.info.points.split(",");
    let i: number = 0;
    let count = arr.length;
    for (i = 0; i < count; i++) {
      if (Number(arr[i]) != 0) result = false;
    }
    return result;
  }

  OnBtnClose() {
    this.check();
  }

  private check() {
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
      this.dispose();
    }
  }

  private __clickStart() {
    this._btnStart.enabled = false;
    this.requestInfo();
  }

  private __useClickHandler1() {
    this.__useClickHandler(1);
  }

  private __useClickHandler2() {
    this.__useClickHandler(2);
  }

  private __useClickHandler(type: number): void {
    if (type == 1) {
      //炸弹
      if (this.llkModel.info.bombCount <= 0) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("AirGardenGame.hint1"),
        );
      } else if (this.isNullMap) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "llk.view.LlkGoodsItem.gateNotStart",
          ),
        );
      } else {
        AirGardenGameLlkManager.Instance.llkOp(
          AirGardenGameLlkManager.USE_BOMB,
        );
      }
    } else if (type == 2) {
      //洗牌
      if (this.llkModel.info.resetCount <= 0) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("AirGardenGame.hint2"),
        );
      } else if (this.isNullMap) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "llk.view.LlkGoodsItem.gateNotStart",
          ),
        );
      } else {
        AirGardenGameLlkManager.Instance.llkOp(AirGardenGameLlkManager.RESET);
      }
    }
  }

  private __clickHandler(e) {
    let target = e.target;
    if (target.$owner && target.$owner instanceof AirGardenGameLLKItem) {
      let targetItem = target.$owner;
      if (targetItem) {
        var current: AirGardenGameLLKItem = targetItem;
        if (!current.NodeData || current.NodeData.val <= 0) return;
        if (this._selected) {
          this._selected.selected = false;
          if (
            this.llkModel.checkByPos(this._selected.NodeData, current.NodeData)
          ) {
            AirGardenGameLlkManager.Instance.llkDelete(
              this._selected.NodeData,
              current.NodeData,
            );
            this._selected = null;
          } else {
            this._selected = current;
            current.selected = true;
          }
        } else {
          this._selected = current;
          current.selected = true;
        }
      }
    }
  }

  public get llkModel(): LlkModel {
    return AirGardenGameLlkManager.Instance.model;
  }

  public OnHideWind(): void {
    this.llkModel.info.time = 0;
    this.llkModel.clear();
    AirGardenGameLlkManager.Instance.llkOp(AirGardenGameLlkManager.CLOSE);
    this.removeEvent();
    super.OnHideWind();
  }

  dispose() {
    this.llkModel.info.time = 0;
    this.llkModel.clear();
    AirGardenGameLlkManager.Instance.llkOp(AirGardenGameLlkManager.CLOSE);
    this.removeEvent();
    super.dispose();
  }
}
