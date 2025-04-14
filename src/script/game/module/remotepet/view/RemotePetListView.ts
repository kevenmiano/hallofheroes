import FUI_RemotePetListView from "../../../../../fui/RemotePet/FUI_RemotePetListView";
import { RemotePetEvent } from "../../../../core/event/RemotePetEvent";
import LangManager from "../../../../core/lang/LangManager";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { RemotePetManager } from "../../../manager/RemotePetManager";
import { RemotePetFriendInfo } from "../../../mvc/model/remotepet/RemotePetFriendInfo";
import { RemotePetModel } from "../../../mvc/model/remotepet/RemotePetModel";
import { PetData } from "../../pet/data/PetData";
import { RemotePetFriendView } from "./RemotePetFriendView";
import { RemotePetHeadItemView } from "./RemotePetHeadItemView";
import { RemotePetHeadSelectView } from "./RemotePetHeadSelectView";
import { RemotePetSkillsView } from "./RemotePetSkillsView";

export class RemotePetListView extends FUI_RemotePetListView {
  private _selectPetView: RemotePetHeadSelectView;

  // private _selectFriendView: RemotePetFriendView;

  public _curSelectItem: RemotePetHeadItemView;

  private headItemsView: RemotePetHeadItemView[];

  private skillItemsView: RemotePetSkillsView[];

  protected onConstruct(): void {
    super.onConstruct();
    this.addEvent();
    this.initView();
  }

  public init(
    selectPetView: RemotePetHeadSelectView,
    selectFriendView: RemotePetFriendView,
  ) {
    this._selectPetView = selectPetView;
    // this._selectFriendView = selectFriendView;
    this.initData();
  }

  private initView() {
    this.headItemsView = [
      this.h1 as RemotePetHeadItemView,
      this.h2 as RemotePetHeadItemView,
      this.h3 as RemotePetHeadItemView,
    ];
    this.skillItemsView = [
      this.s1 as RemotePetSkillsView,
      this.s2 as RemotePetSkillsView,
      this.s3 as RemotePetSkillsView,
    ];

    for (let i = 0; i < this.headItemsView.length; i++) {
      //7 为好友英灵
      this.headItemsView[i].pos = i == 3 ? 7 : i + 1;
      this.headItemsView[i].onClick(this, this.onHeadClick, [
        this.headItemsView[i],
      ]);
      this.skillItemsView[i].delBtn.onClick(this, this.onDeleteClick, [i]);
    }
  }

  private initData() {
    let model = this.model;
    // this.skillItemsView[4].isfriend = true;
    //好友英灵战力
    let friend = 0;
    if (model.petListInfo.petList[7]) {
      friend = model.petListInfo.petList[7].fightPower;
    }

    //自己英灵战力
    let petFight = 0;
    for (let i in model.petListInfo.petList) {
      if (model.petListInfo.petList[i] && +i != 7) {
        petFight += model.petListInfo.petList[i].fightPower;
      }
    }
    this.petNum.text = petFight + "";
  }

  private petChangeHandler() {
    let petList = this.model.petListInfo.petList;
    for (let i = 0; i < this.headItemsView.length; i++) {
      this.headItemsView[i].petData = petList[this.headItemsView[i].pos];
      this.skillItemsView[i].petData = petList[this.headItemsView[i].pos];
    }
  }

  private onHeadClick(head: RemotePetHeadItemView) {
    // if (!this._selectFriendView) return;
    this._selectPetView.hide();
    // this._selectFriendView.hide();
    this._curSelectItem = head;
    this.updateSelectFlag();
    // if (head.pos == 7) {
    //     //好友英灵不能更改
    //     if (this.model.petListInfo.petList[7]) { MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("remotepet.RemotePetFriend.notmove")); return; }
    //     this._selectFriendView.show(this.selectFriendPet.bind(this));
    //     return
    // }

    this._selectPetView.show(
      this.playerInfo.petList,
      head.petData,
      this.selectPet.bind(this),
    );
  }

  private onDeleteClick(index: number) {
    //好友英灵 无法更改
    if (index == 3) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "remotepet.RemotePetFriend.notmove",
        ),
      );
      return;
    }
    let skillView = this.skillItemsView[index];
    let headView = this.headItemsView[index];

    let petData = headView.petData;

    skillView.petData = null;
    headView.petData = null;
    this.model.petListInfo.petList[headView.pos] = null;
    let value: PetData[] = [];
    if (petData) {
      value.push(petData);
    }
    value.push(null);
    this.model.petChange(value);
    this.model.commit();
  }

  private selectPet(p: PetData) {
    if (p == null) this.updateSelectFlag(null);
    if (!this._curSelectItem) return;
    let petData: PetData;
    if (this._curSelectItem.petData == p) {
      petData = p;
      this._curSelectItem.petData = null;
      p = null;
    } else {
      petData = this._curSelectItem.petData;
      this._curSelectItem.petData = p;
    }

    this.model.petListInfo.petList[this._curSelectItem.pos] = p;

    if (this._curSelectItem.pos <= 3) {
      let value: PetData[] = [];
      if (petData) {
        value.push(petData);
      }
      value.push(p);
      this.model.petChange(value);
    }
    this.model.commit();
  }

  private selectFriendPet(p: RemotePetFriendInfo) {
    if (p == null) this.updateSelectFlag(null);
    if (!this._curSelectItem) return;
    if (this._curSelectItem.pos != 7) return;
    RemotePetManager.sendFriendPetInfo(p.friendId, p.petId);
  }

  private addEvent() {
    this.model.addEventListener(
      RemotePetEvent.PET_CHANGE,
      this.petChangeHandler,
      this,
    );
    this.model.addEventListener(
      RemotePetEvent.COMMIT,
      this.petChangeHandler,
      this,
    );
  }

  private removeEvent() {
    this.model.removeEventListener(
      RemotePetEvent.PET_CHANGE,
      this.petChangeHandler,
      this,
    );
    this.model.removeEventListener(
      RemotePetEvent.COMMIT,
      this.petChangeHandler,
      this,
    );
  }

  private updateSelectFlag(
    selectItem: RemotePetHeadItemView = this._curSelectItem,
  ) {
    for (let head of this.headItemsView) {
      head.sel.visible = head == selectItem;
    }
    if (selectItem == null) this._curSelectItem = null;
  }

  public get model(): RemotePetModel {
    return RemotePetManager.Instance.model;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  dispose(): void {
    this.removeEvent();
  }
}
