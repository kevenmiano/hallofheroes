import FUI_RemotePetTurnDownView from "../../../../../fui/RemotePet/FUI_RemotePetTurnDownView";
import { RemotePetEvent } from "../../../../core/event/RemotePetEvent";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { RemotePetManager } from "../../../manager/RemotePetManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { RemotePetModel } from "../../../mvc/model/remotepet/RemotePetModel";
import { PetData } from "../../pet/data/PetData";
import { RemotePetTurnSingleItemView } from "./RemotePetTurnSingleItemView";

export class RemotePetTurnDownView extends FUI_RemotePetTurnDownView {
  protected onConstruct() {
    super.onConstruct();
    this.displayObject.mouseThrough = true;
    this._petList.itemRenderer = Laya.Handler.create(
      this,
      this.onPetRender,
      null,
      false,
    );
    this.addEvent();
    this.commitHandler();
  }

  private petsData: PetData[];

  private addEvent() {
    this._btnMopup.onClick(this, this.onMopupClick);
    this._btnReward.onClick(this, this.onRewardClick);
    this._btnRank.onClick(this, this.onRankClick);
    this._btnAdjust.onClick(this, this.onAdjustClick);
  }

  private removeEvent() {
    this._btnMopup.offClick(this, this.onMopupClick);
    this._btnReward.offClick(this, this.onRewardClick);
    this._btnRank.offClick(this, this.onRankClick);
    this._btnAdjust.offClick(this, this.onAdjustClick);
  }

  public commitHandler() {
    let model = this.model;
    let now = model.turnInfo.currTurn;
    if (now >= 100) {
      now = 100;
    }
    this._curLvNum.text = now + "";
    this._maxLvNum.text = model.turnInfo.maxTurn + "";

    this.petsData = [];
    let petListInfo = this.model.petListInfo.petList;
    for (let pet of petListInfo) {
      pet && this.petsData.push(pet);
    }
    this._petList.numItems = this.petsData.length;
  }

  private onMopupClick() {
    FrameCtrlManager.Instance.open(EmWindow.RemoteMopupWnd);
  }

  private onAdjustClick() {
    UIManager.Instance.HideWind(EmWindow.RemotePetTurnWnd);
    UIManager.Instance.ShowWind(EmWindow.RemotePetReadyWnd);
  }

  private onRewardClick() {
    let _goodsList: GoodsInfo[] = [];
    let goodlist = this.model.turnInfo.goodsList;
    let arr = goodlist.split("|");
    if (goodlist) {
      for (var i: number = 0; i < arr.length; i++) {
        let good = arr[i].split(",");
        let temp: GoodsInfo = new GoodsInfo();
        temp.templateId = +good[0];
        temp.count = +good[1];
        _goodsList.push(temp);
      }
    }
    FrameCtrlManager.Instance.open(EmWindow.DisplayItems, {
      itemInfos: _goodsList,
      title: LangManager.Instance.GetTranslation("remotepet.goodsTxt"),
    });
  }

  private onPetRender(index: number, box: RemotePetTurnSingleItemView) {
    box.info = this.petsData[index];
  }

  private onRankClick() {
    FrameCtrlManager.Instance.open(EmWindow.RemotePetOrderWnd);
  }

  public get model(): RemotePetModel {
    return RemotePetManager.Instance.model;
  }

  public dispose(): void {
    this.removeEvent();
  }
}
