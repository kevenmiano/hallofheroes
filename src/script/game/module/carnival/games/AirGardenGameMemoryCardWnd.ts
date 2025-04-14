import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_carnivalpointexchangeData } from "../../../config/t_s_carnivalpointexchange";
import AirGardenMemoryCardManager from "../../../manager/AirGardenMemoryCardManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { TimerEvent, TimerTicker } from "../../../utils/TimerTicker";
import CarnivalModel from "../model/CarnivalModel";
import MemoryCardData from "../model/memorycard/MemoryCardData";
import { AirGardenGameEvent } from "./AirGardenGameEvent";
import AirGardenGameMemoryCardItem from "./AirGardenGameMemoryCardItem";

/**
 * 记忆翻牌
 */
export default class AirGardenGameMemoryCardWnd extends BaseWindow {
  protected resizeContent: boolean = true;
  protected resizeFullContent: boolean = true;

  private gameState: fgui.Controller;
  private _btnWashCard: UIButton;
  private _btnUseBomb: UIButton;
  private _btnStart: UIButton;

  private txt_score: fgui.GTextField;
  private txt_myPoint: fgui.GTextField;
  private txt_time: fgui.GTextField;
  private txt_autoFlip: fgui.GTextField;
  private txt_drawCards: fgui.GTextField;
  public itemList: fgui.GList;

  private ROW: number = 4;
  private COLOME: number = 6;
  private cardItems: Map<number, AirGardenGameMemoryCardItem> = new Map();

  private lockList: boolean = false;
  private _timer: TimerTicker;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initView();
    this.initEvent();
  }

  private initView() {
    this.gameState = this.getController("gameState");

    let temp: t_s_carnivalpointexchangeData[] =
      TempleteManager.Instance.getCarnivalByType(CarnivalModel.GAME_TYPE_2);
    if (temp && temp.length > 0)
      this.txt_score.text = LangManager.Instance.GetTranslation(
        "samll.game.score",
        Number(temp[0].Target),
      );

    this.txt_autoFlip.text = LangManager.Instance.GetTranslation(
      "AirGardenGame.memorycard.str1",
      "0",
    );
    this.txt_drawCards.text = LangManager.Instance.GetTranslation(
      "AirGardenGame.memorycard.str2",
      "0",
    );
    this.txt_myPoint.text = LangManager.Instance.GetTranslation(
      "carnival.awardpoint.point",
      0,
    );
    this.txt_time.text = LangManager.Instance.GetTranslation(
      "openBox.tip.countdown",
      0,
    );

    this.initCards();
    this.gameState.selectedIndex = 0;
  }

  private initCards() {
    for (let index = 0; index < this.itemList.numChildren; index++) {
      const item = this.itemList.getChildAt(
        index,
      ) as AirGardenGameMemoryCardItem;
      let idx = index + 1;
      item.onClick(this, this.__clickItem, [idx]);
      item.index = idx;
      item.showBack(true);
      this.cardItems.set(idx, item);
    }
  }

  private initEvent() {
    this._timer = new TimerTicker(1000);
    this._timer.addEventListener(TimerEvent.TIMER, this.__timerHandler, this);

    this._btnStart.onClick(this, this.onClickStart);
    this._btnWashCard.onClick(this, this.onClickUse1);
    this._btnUseBomb.onClick(this, this.onClickUse2);
    this.m.addEventListener(
      AirGardenGameEvent.INIT_MEMORY_CARD,
      this.initData,
      this,
    );
    this.m.addEventListener(
      AirGardenGameEvent.FLIP_MEMORY_CARD,
      this.flipCard,
      this,
    );
    this.m.addEventListener(
      AirGardenGameEvent.AUTO_MEMORY_CARD,
      this.autoCard,
      this,
    );
    this.m.addEventListener(
      AirGardenGameEvent.SHOW_MEMORY_CARD,
      this.showCard,
      this,
    );
    this.m.addEventListener(
      AirGardenGameEvent.UPDATE_DATA_MEMORY_CARD,
      this.updateData,
      this,
    );
  }

  private removeEvent() {
    if (this._btnStart) this._btnStart.offClick(this, this.onClickStart);
    if (this._btnWashCard) this._btnWashCard.offClick(this, this.onClickUse1);
    if (this._btnUseBomb) this._btnUseBomb.offClick(this, this.onClickUse2);
    this.m.removeEventListener(
      AirGardenGameEvent.INIT_MEMORY_CARD,
      this.initData,
      this,
    );
    this.m.removeEventListener(
      AirGardenGameEvent.FLIP_MEMORY_CARD,
      this.flipCard,
      this,
    );
    this.m.removeEventListener(
      AirGardenGameEvent.AUTO_MEMORY_CARD,
      this.autoCard,
      this,
    );
    this.m.removeEventListener(
      AirGardenGameEvent.SHOW_MEMORY_CARD,
      this.showCard,
      this,
    );
    this.m.removeEventListener(
      AirGardenGameEvent.UPDATE_DATA_MEMORY_CARD,
      this.updateData,
      this,
    );
    this._timer.removeEventListener(
      TimerEvent.TIMER,
      this.__timerHandler,
      this,
    );
  }

  public __clickItem(idx: number) {
    if (this.lockList) return;
    let item = this.cardItems.get(idx) as AirGardenGameMemoryCardItem;
    if (item.isResultOpen) {
      return;
    }

    if (this.m.model.openCardIdxs.length < 2) {
      if (
        this.m.model.openCardIdxs.length == 1 &&
        this.m.model.openCardIdxs[0] == idx
      ) {
        return;
      }
      this.m.model.openCardIdxs.push(idx);
      item.turnFront();
      if (this.m.model.openCardIdxs.length >= 2) {
        this.lockList = true;
        Laya.timer.once(
          AirGardenGameMemoryCardItem.TURN_HALF_TIME * 2 + 1000,
          this,
          () => {
            let index1 = this.m.model.openCardIdxs[0];
            let index2 = this.m.model.openCardIdxs[1];
            this.m.sendFlip(index1, index2);
            this.delayNotLockList();
          },
        );
      }
    }
  }

  private updateData(e: AirGardenGameEvent) {
    this.txt_autoFlip.text = LangManager.Instance.GetTranslation(
      "AirGardenGame.memorycard.str1",
      "" + this.m.model.leftAutoChance,
    );
    this.txt_drawCards.text = LangManager.Instance.GetTranslation(
      "AirGardenGame.memorycard.str2",
      "" + this.m.model.leftCheckChance,
    );
    this.txt_myPoint.text = LangManager.Instance.GetTranslation(
      "carnival.awardpoint.point",
      this.m.model.score.toString(),
    );
  }

  private __timerHandler() {
    let remain: number = this._timer.repeatCount - this._timer.currentCount;
    this.txt_time.text = LangManager.Instance.GetTranslation(
      "openBox.tip.countdown",
      remain,
    );
    if (remain <= 0) {
      this.hide();
    }
  }

  private onClickUse1() {
    this.onClickUse(1);
  }

  private onClickUse2() {
    this.onClickUse(2);
  }

  private onClickUse(type: number = 1) {
    if (this.lockList) return;

    if (type == 1) {
      if (this.m.model.leftAutoChance <= 0) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("AirGardenGame.memorycard.str5"),
        );
        return;
      }
    } else if (type == 2) {
      if (this.m.model.leftCheckChance <= 0) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("AirGardenGame.memorycard.str6"),
        );
        return;
      }
    }
    if (!this._timer.running) return;

    if (this.m.model.openCardIdxs.length == 1) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("AirGardenGame.memorycard.str3"),
      );
      return;
    }

    if (type == 1) {
      if (this.m.model.leftAutoChance > 0) {
        this.lockList = true;
        this.m.sendAuto();
        this.delayNotLockList(500 + 100);
      }
    } else if (type == 2) {
      if (this.m.model.leftCheckChance > 0) {
        this.lockList = true;
        this.m.sendShow();
        this.delayNotLockList(3000);
      }
    }
  }

  private showCard(event: AirGardenGameEvent) {
    Logger.info("嘉年华记忆翻牌showCard", this.m.model.cardShow);
    for (let i: number = 1; i <= this.ROW * this.COLOME; i++) {
      let data = this.m.model.cardShow.get(i) as MemoryCardData;
      if (data) {
        let tempCard = this.cardItems.get(
          data.index,
        ) as AirGardenGameMemoryCardItem;
        tempCard.showAndBack = true;
        tempCard.turnFront();
      }
    }
  }

  private autoCard(event: AirGardenGameEvent) {
    Logger.info("嘉年华记忆翻牌autoCard");
    let tempCard1: AirGardenGameMemoryCardItem = this.cardItems.get(
      this.m.model.cIndex1,
    ) as AirGardenGameMemoryCardItem;
    let tempCard2: AirGardenGameMemoryCardItem = this.cardItems.get(
      this.m.model.cIndex2,
    ) as AirGardenGameMemoryCardItem;

    // tempCard1.isClickFlip = true;
    // tempCard2.isClickFlip = true;
    tempCard1.isResultOpen = true;
    tempCard2.isResultOpen = true;
    tempCard1.turnFront(undefined, true);
    tempCard2.turnFront(undefined, true);
    this.playAddScoreEffect(tempCard2);
  }

  private flipCard(e: AirGardenGameEvent) {
    Logger.info("嘉年华记忆翻牌flipCard");
    let tempCard1: AirGardenGameMemoryCardItem = this.cardItems.get(
      this.m.model.openCardIdxs[0],
    );
    let tempCard2: AirGardenGameMemoryCardItem = this.cardItems.get(
      this.m.model.openCardIdxs[1],
    );

    tempCard1.imgSelect.visible = false;
    tempCard2.imgSelect.visible = false;
    if (this.m.model.result) {
      tempCard1.isResultOpen = true;
      tempCard2.isResultOpen = true;
      this.lockList = false;
      this.playAddScoreEffect(tempCard2);
    } else {
      tempCard1.turnBack();
      tempCard2.turnBack(() => {
        this.lockList = false;
      });
    }
    this.m.model.openCardIdxs = [];
  }

  private playAddScoreEffect(obj: AirGardenGameMemoryCardItem) {
    if (this.m.model.addScore2 > 0) {
      let str = LangManager.Instance.GetTranslation(
        "AirGardenGame.memorycard.addScore",
        this.m.model.addScore + this.m.model.addScore2,
      );
      str += "(+" + this.m.model.addScore2 + ")";
      MessageTipManager.Instance.show(str);
    } else {
      let str = LangManager.Instance.GetTranslation(
        "AirGardenGame.memorycard.addScore",
        this.m.model.addScore,
      );
      MessageTipManager.Instance.show(str);
    }

    // if (this._deleMc) {
    //     this._deleMc.dispose();
    //     this._deleMc = null;
    // }
    // let mc: MovieClip = ComponentFactory.Instance.creat("asset.llk.addScoreMc");//积分加成
    // NumberViewUtils.refreshValue(this.m.model.addScore + this.m.model.addScore2, mc["effect"]["sp2"], this._scoreNumRes, 11, 17, 11, 11, '0123456789');
    // if (this.m.model.addScore2 > 0) {
    //     NumberViewUtils.refreshValue(this.m.model.addScore2 / 10, mc["effect"]["sp1"], this._combNumRes, 13, 19, 13, 13, '0123456789');
    // } else {
    //     mc["effect"]["combTxt"].visible = false;
    // }
    // this._deleMc = new SimpleMovie(mc);
    // this._deleMc.x = obj.x;
    // this._deleMc.y = obj.y;
    // addToContent(this._deleMc);
  }

  private initData(e: AirGardenGameEvent) {
    this.gameState.selectedIndex = 1;
    for (let i: number = 1; i <= this.ROW * this.COLOME; i++) {
      let tempCard = this.cardItems.get(i) as AirGardenGameMemoryCardItem;
      tempCard.showBack();
      tempCard.isResultOpen = false;
      tempCard.info = this.m.model.cards.get(i) as MemoryCardData;
    }
    if (this.m.model.duration == 0) return;

    this._timer.repeatCount = this.m.model.duration;
    if (!this._timer.running) {
      this._timer.start();
    }
  }

  private onClickStart(e: MouseEvent) {
    this._btnStart.visible = false;
    this.m.sendStart();
  }

  private delayNotLockList(time: number = 100) {
    setTimeout(() => {
      this.lockList = false;
    }, time);
  }

  protected OnBtnClose(): void {
    let str: string = LangManager.Instance.GetTranslation(
      "AirGardenGame.exit.hint",
    );
    SimpleAlertHelper.Instance.popAlerFrame(
      null,
      str,
      null,
      null,
      { callback: this.realDispose.bind(this) },
      SimpleAlertHelper.SIMPLE_ALERT,
    );
  }

  private realDispose(b: boolean, flag: boolean) {
    if (b) {
      this.hide();
    }
  }

  public get m(): AirGardenMemoryCardManager {
    return AirGardenMemoryCardManager.Instance;
  }

  dispose() {
    this.removeEvent();
    this.m.sendClose();
    this.m.model.openCardIdxs = [];
    this.lockList = false;
    this.cardItems.clear();
    this.m.model.clear();
    super.dispose();
  }
}
