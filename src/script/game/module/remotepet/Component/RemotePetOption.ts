//@ts-expect-error: External dependencies
import FUI_RemotePetOption from "../../../../../fui/RemotePet/FUI_RemotePetOption";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import ItemID from "../../../constant/ItemID";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import ConfigInfoManager from "../../../manager/ConfigInfoManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { RemotePetManager } from "../../../manager/RemotePetManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { RemotePetTurnItemInfo } from "../../../mvc/model/remotepet/RemotePetTurnItemInfo";
import { PetData } from "../../pet/data/PetData";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";
import { RemotePetItem } from "./RemotePetItem";

export class RemotePetOption extends FUI_RemotePetOption {
  private pets: PetData[];
  private _remoteWearyCost: number = 0;
  private curTurnInfo: RemotePetTurnItemInfo;

  protected onConstruct(): void {
    super.onConstruct();
    this._mountBtn.onClick(this, this.onMonupTap);
    this._challengeBtn.onClick(this, this.onChallengeTap);
    this._btnAdjust.onClick(this, this.onAdjustTap);
    this.petList.itemRenderer = Laya.Handler.create(
      this,
      this.onRender,
      null,
      false,
    );
    this._remoteWearyCost = parseInt(
      ConfigInfoManager.Instance.getPetRemoteWeary(),
    );
  }

  public updateView() {
    let model = this.model;
    let tempPets = model.petListInfo.petList;
    this.pets = [];
    for (let pet of tempPets) {
      pet && this.pets.push(pet);
    }
    this.updateMonup();
    this.petList.numItems = this.pets.length;
    //自己英灵战力
    let petFight = 0;
    for (let i in this.pets) {
      if (this.pets[i] && +i != 7) {
        petFight += this.pets[i].fightPower;
      }
    }
    this.petNum.text = petFight + "";
  }

  public updateMonup() {
    let model = this.model;
    let turnInfo = model.turnInfo;
    let weary = +ConfigInfoManager.Instance.getPetRemoteWeary();
    let maxTurnInfo = turnInfo.maxTurnItemInfo;
    let monupMaxLevel = 0;
    if (maxTurnInfo) {
      monupMaxLevel = turnInfo.maxTurnItemInfo.tempInfo.Sweep;
    }
    this.mopupLab.setVar("level", monupMaxLevel + "").flushVars();
    this.costLab.setVar("cost", weary + "").flushVars();
    let monupCount = monupMaxLevel - this.model.turnInfo.currTurn + 1;
    this._mountBtn.enabled = monupCount > 0;
  }

  public setTurnInfo(v: RemotePetTurnItemInfo) {
    this.curTurnInfo = v;
    let tempInfo = this.curTurnInfo.tempInfo;
    let challenge = tempInfo.Index == this.model.turnInfo.currTurn;
    this._challengeBtn.enabled = challenge;
  }

  private onRender(index: number, box: RemotePetItem) {
    box.petData = this.pets[index];
  }

  private onMonupTap() {
    let weary = +ConfigInfoManager.Instance.getPetRemoteWeary();

    if (!this.checkWeary(weary)) {
      return;
    }

    FrameCtrlManager.Instance.open(EmWindow.RemoteMopupWnd);
  }

  private onChallengeTap() {
    if (!this.curTurnInfo) {
      return;
    }
    if (!this.checkPetCount()) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "remotepet.views.RemotePetInfoView.tip",
        ),
      );
      return;
    }

    if (!this.checkWeary(this._remoteWearyCost)) {
      return;
    }

    RemotePetManager.Instance.sendFight(this.curTurnInfo.tempInfo.Index, false);
  }

  private checkWeary(wearyCost: number) {
    let hasEnergy: number =
      PlayerManager.Instance.currentPlayerModel.playerInfo.weary;
    //体力不足
    if (hasEnergy < wearyCost) {
      if (this.hasWearyMedicine()) {
        //背包拥有体力药水时,弹出体力补充弹窗
        FrameCtrlManager.Instance.open(EmWindow.WearySupplyWnd, { type: 1 });
      } else if (!this.hasWearyMedicine()) {
        //背包无体力药水时
        if (this.todayCanBuyWearyMedicine()) {
          //今日还能购买, 弹出高级体力药水快捷购买弹窗
          let info: ShopGoodsInfo =
            TempleteManager.Instance.getShopTempInfoByItemId(
              ItemID.WEARY_MEDICINE3,
            );
          if (info) {
            FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info });
          }
        } else {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation("petCampaign.challengeTips1"),
          );
        }
      }
      return false;
    }

    return true;
  }

  private hasWearyMedicine(): boolean {
    let num0: number = GoodsManager.Instance.getGoodsNumByTempId(
      ItemID.WEARY_MEDICINE0,
    );
    let num1: number = GoodsManager.Instance.getGoodsNumByTempId(
      ItemID.WEARY_MEDICINE1,
    );
    let num2: number = GoodsManager.Instance.getGoodsNumByTempId(
      ItemID.WEARY_MEDICINE2,
    );
    let num3: number = GoodsManager.Instance.getGoodsNumByTempId(
      ItemID.WEARY_MEDICINE3,
    );
    return num0 > 0 || num1 > 0 || num2 > 0 || num3 > 0;
  }

  //今日是否还能购买高级体力药水
  private todayCanBuyWearyMedicine(): boolean {
    let flag: boolean = false;
    let shopGoodsInfo: any = TempleteManager.Instance.getShopTempInfoByItemId(
      ItemID.WEARY_MEDICINE3,
    );
    let num: number = shopGoodsInfo.canOneCount;
    if (num > 0) {
      flag = true;
    }
    return flag;
  }

  private checkPetCount(): boolean {
    let flag: boolean = false;
    let indexArr: Array<string> =
      this.playerInfo.petChallengeIndexFormation.split(",");
    if (!indexArr) return flag;
    let len: number = indexArr.length;
    for (let i: number = 0; i < len; i++) {
      if (parseInt(indexArr[i]) > 0) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  private onAdjustTap() {
    UIManager.Instance.ShowWind(EmWindow.RemotePetAdjustWnd);
  }

  private get model() {
    return RemotePetManager.Instance.model;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }
}
