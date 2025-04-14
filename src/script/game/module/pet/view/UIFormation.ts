//@ts-expect-error: External dependencies
import LangManager from "../../../../core/lang/LangManager";
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import { PetEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { PetData } from "../data/PetData";
import PetModel from "../data/PetModel";
import FormationItem from "./item/FormationItem";
import PetformationItem from "./item/PetformationItem";

export default class UIFormation extends BaseFguiCom {
  public p1: PetformationItem;
  public p2: PetformationItem;
  public p3: PetformationItem;
  public p4: PetformationItem;
  public p5: PetformationItem;
  public p6: PetformationItem;
  public battleNumItem1: PetformationItem;
  public battleNumItem2: PetformationItem;
  public battleNumItem3: PetformationItem;

  //前排
  public figureItem1: FormationItem;
  public figureItem2: FormationItem;
  public figureItem3: FormationItem;
  //后排
  public figureItem4: FormationItem;
  public figureItem5: FormationItem;
  public figureItem6: FormationItem;

  public petFormationDescTxt2: fgui.GTextField;
  public petFormationDescTxt3: fgui.GTextField;
  public petFormationDescTxt1: fgui.GTextField;
  public petFormationDescTxt4: fgui.GTextField;
  public petFormationDescTxt5: fgui.GTextField;
  public petFormationDescTxt6: fgui.GTextField;

  private petFormationViews: PetformationItem[];
  private petIndexViews: PetformationItem[];
  private avataViews: FormationItem[];
  private posIndex = [2, 5, 8, 3, 6, 9];
  private defaultPos = [0, -1, -1, -1, -1, -1, -1, -1, -1, -1];
  private formationString: string;
  private formationIndexString: string;
  private posIndex2 = [0, 1, 2];
  private _selectedPetData: PetData;
  /**构造函数 */
  constructor(comp: fgui.GComponent) {
    super(comp);
    if (this.playerInfo)
      this.playerInfo.addEventListener(
        PlayerEvent.PLAYER_PET_LIST_CHANGE,
        this.__petformationChangeHandler,
        this,
      );
    this.initView();
  }

  private __petformationChangeHandler() {
    let arr: any[];
    let indexArr: any[];
    this.petFormationViews = [
      this.p1,
      this.p2,
      this.p3,
      this.p4,
      this.p5,
      this.p6,
    ];
    if (this.playerInfo.petChallengeFormation) {
      arr = this.playerInfo.petChallengeFormation.split(",");
      indexArr = this.playerInfo.petChallengeIndexFormation.split(",");
    } else {
      arr = ["-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1"];
      indexArr = ["-1", "-1", "-1"];
    }
    let formation = [
      -1,
      -1,
      arr[0],
      arr[3],
      -1,
      arr[1],
      arr[4],
      -1,
      arr[2],
      arr[5],
    ];
    let petId: number = 0;
    let petView: PetformationItem;
    for (let i = 0; i < this.petFormationViews.length; i++) {
      petView = this.petFormationViews[i];
      petView.pos = this.posIndex[i];
      petId = formation[petView.pos];
      petView.petData = this.playerInfo.getPet(petId);
    }
    this.formationString = arr.join(",");
    PetModel.saveFormationStr = this.formationString;
    PetModel.saveFormationArray = arr;
    this.petIndexViews = [
      this.battleNumItem1,
      this.battleNumItem2,
      this.battleNumItem3,
    ];
    let formationIndex = [indexArr[0], indexArr[1], indexArr[2]];
    for (let i = 0; i < this.petIndexViews.length; i++) {
      petView = this.petIndexViews[i];
      petView.pos = this.posIndex2[i];
      petId = formationIndex[petView.pos];
      petView.petData = this.playerInfo.getPet(petId);
    }
    this.formationIndexString = indexArr.join(",");
    PetModel.saveFormationIndexStr = this.formationIndexString;
    this.avataViews = [
      this.figureItem1,
      this.figureItem2,
      this.figureItem3,
      this.figureItem4,
      this.figureItem5,
      this.figureItem6,
    ];
    this.setFigureData();
  }

  private initView() {
    for (let i: number = 1; i <= 6; i++) {
      let str = "UIFormation.descTxt" + i;
      this["petFormationDescTxt" + i].text =
        LangManager.Instance.GetTranslation(str);
    }

    let arr: any[];
    let indexArr: any[];
    this.petFormationViews = [
      this.p1,
      this.p2,
      this.p3,
      this.p4,
      this.p5,
      this.p6,
    ];
    if (this.playerInfo.petChallengeFormation) {
      arr = this.playerInfo.petChallengeFormation.split(",");
      indexArr = this.playerInfo.petChallengeIndexFormation.split(",");
    } else {
      arr = ["-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1", "-1"];
      indexArr = ["-1", "-1", "-1"];
    }
    let formation = [
      -1,
      -1,
      arr[0],
      arr[3],
      -1,
      arr[1],
      arr[4],
      -1,
      arr[2],
      arr[5],
    ];
    let petId: number = 0;
    let petView: PetformationItem;
    for (let i = 0; i < this.petFormationViews.length; i++) {
      petView = this.petFormationViews[i];
      petView.pos = this.posIndex[i];
      petId = formation[petView.pos];
      petView.petData = this.playerInfo.getPet(petId);
      petView.on(fgui.Events.DRAG_START, this, this.onPetChallengeDragStart);
      petView.on(fgui.Events.DROP, this, this.onPetDrop);
      petView.draggable = true;
    }
    this.formationString = arr.join(",");
    PetModel.saveFormationStr = this.formationString;
    PetModel.saveFormationArray = arr;
    this.petIndexViews = [
      this.battleNumItem1,
      this.battleNumItem2,
      this.battleNumItem3,
    ];
    let formationIndex = [indexArr[0], indexArr[1], indexArr[2]];
    for (let i = 0; i < this.petIndexViews.length; i++) {
      petView = this.petIndexViews[i];
      petView.pos = this.posIndex2[i];
      petId = formationIndex[petView.pos];
      petView.petData = this.playerInfo.getPet(petId);
      petView.on(fgui.Events.DRAG_START, this, this.onPetChallengeDragStart);
      petView.on(fgui.Events.DROP, this, this.onPetIndexDrop);
      petView.draggable = true;
    }
    this.formationIndexString = indexArr.join(",");
    PetModel.saveFormationIndexStr = this.formationIndexString;
    this.avataViews = [
      this.figureItem1,
      this.figureItem2,
      this.figureItem3,
      this.figureItem4,
      this.figureItem5,
      this.figureItem6,
    ];
    this.setFigureData();
  }

  private setFigureData() {
    let formationItem: any;
    let formation = [
      -1,
      -1,
      this.avataViews[0],
      this.avataViews[3],
      -1,
      this.avataViews[1],
      this.avataViews[4],
      -1,
      this.avataViews[2],
      this.avataViews[5],
    ];
    for (let item of this.avataViews) {
      item.info = null;
    }
    for (let item of this.petFormationViews) {
      if (item.petData) {
        //存在数据
        formationItem = formation[item.pos];
        formationItem.info = item.petData;
      }
    }
  }

  private onPetChallengeDragStart(evt: Laya.Event) {
    let btn: PetformationItem = <PetformationItem>(
      fgui.GObject.cast(evt.currentTarget)
    );
    //取消对原目标的拖动, 换成一个替代品
    btn.stopDrag();
    fgui.DragDropManager.inst.startDrag(btn, btn.petIcon.icon, btn);
  }

  private onPetDrop(otherView: PetformationItem, evt: Laya.Event) {
    if (
      !(otherView instanceof PetformationItem) ||
      otherView.isIndex.selectedIndex == 1
    )
      return;
    let btn: PetformationItem = <PetformationItem>(
      fgui.GObject.cast(evt.currentTarget)
    );
    let temp: PetData = otherView.petData;
    otherView.petData = btn.petData;
    btn.petData = temp;
    this.formatPetFormation();
  }

  private onPetIndexDrop(otherView: PetformationItem, evt: Laya.Event) {
    if (
      !(otherView instanceof PetformationItem) ||
      otherView.isIndex.selectedIndex == 0
    )
      return;
    let btn: PetformationItem = <PetformationItem>(
      fgui.GObject.cast(evt.currentTarget)
    );
    let temp: PetData = otherView.petData;
    otherView.petData = btn.petData;
    btn.petData = temp;
    this.formatPetIndexFormation();
  }

  private formatPetIndexFormation() {
    let arr = [-1, -1, -1];
    for (let item of this.petIndexViews) {
      if (item.petData) {
        arr[item.pos] = item.petData.petId;
      }
    }
    this.formationIndexString = arr.join(",");
    PetModel.needSaveFormation = true;
    PetModel.saveFormationIndexStr = this.formationIndexString;
  }

  private formatPetFormation() {
    let arr = this.defaultPos.concat();
    for (let item of this.petFormationViews) {
      if (item.petData) {
        arr[item.pos] = item.petData.petId;
      }
    }
    let res: number[] = [arr[2], arr[5], arr[8], arr[3], arr[6], arr[9]];
    this.formationString = res.join(",");
    PetModel.needSaveFormation = true;
    PetModel.saveFormationStr = this.formationString;
    PetModel.saveFormationArray = res;
    NotificationManager.Instance.dispatchEvent(
      PetEvent.PET_SELECT_FORMATION_CHANGE,
    );
    this.setFigureData();
  }

  public set data(value: PetData) {
    if (value) {
      if (PetModel.isClickPetList) {
        //点击英灵列表，如果这个英灵在阵型里面就移除，否则上阵
        this._selectedPetData = value;
        let arr = this.formationString.split(",");
        let pos = arr.indexOf(this._selectedPetData.petId + "");
        //休息
        if (pos >= 0) {
          let count: number = 0;
          arr.forEach((ele) => {
            if (parseInt(ele) > 0) count++;
          });
          if (count <= 1) {
            let tip: string = LangManager.Instance.GetTranslation(
              "PetFormationFrame.noPetInFormation",
            );
            MessageTipManager.Instance.show(tip);
            return;
          }
          for (let item of this.petFormationViews) {
            if (
              item.petData &&
              item.petData.petId == this._selectedPetData.petId
            ) {
              item.petData = null;
              break;
            }
          }
          this.formatPetFormation();
          for (let item of this.petIndexViews) {
            if (
              item.petData &&
              item.petData.petId == this._selectedPetData.petId
            ) {
              item.petData = null;
              break;
            }
          }
          this.formatPetIndexFormation();
          return;
        }

        //添加到第一个空位
        let counter = 0;
        let firstEmpty: PetformationItem;
        for (let item of this.petFormationViews) {
          if (item.petData) {
            counter++;
          } else {
            !firstEmpty && (firstEmpty = item);
          }
        }
        //不做替换, 弹提示
        if (counter >= 3) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation("remotepet.adjust.replace"),
          );
          return;
        } else {
          let firstEmptyIndex: PetformationItem;
          for (let item of this.petIndexViews) {
            if (item.petData) {
            } else {
              !firstEmptyIndex && (firstEmptyIndex = item);
            }
          }
          //增加
          firstEmpty.petData = this._selectedPetData;
          firstEmptyIndex.petData = this._selectedPetData;
        }
        this.formatPetFormation();
        this.formatPetIndexFormation();
      }
    }
  }

  /**重置视图 */
  public resetView() {
    // this.removeEvent();
    // this.comp_sourceDetail.comb_starList._children = [];
    // this.comp_sourceDetail.comb_starList.numItems = 0;
    // this.comp_targetDetail.comb_starList._children = [];
    // this.comp_targetDetail.comb_starList.numItems = 0;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public dispose(destred?: boolean) {
    if (this.playerInfo)
      this.playerInfo.removeEventListener(
        PlayerEvent.PLAYER_PET_LIST_CHANGE,
        this.__petformationChangeHandler,
        this,
      );
  }
}
