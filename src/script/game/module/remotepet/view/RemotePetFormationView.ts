import FUI_RemotePetFormationView from "../../../../../fui/RemotePet/FUI_RemotePetFormationView";
import { RemotePetEvent } from "../../../../core/event/RemotePetEvent";
import { RemotePetManager } from "../../../manager/RemotePetManager";
import { RemotePetModel } from "../../../mvc/model/remotepet/RemotePetModel";
import { PetData } from "../../pet/data/PetData";
import { RemotePetFormationItemView } from "./RemotePetFormationItemView";

export class RemotePetFormationView extends FUI_RemotePetFormationView {
  private formationItemsView: RemotePetFormationItemView[];

  private defaultPos = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

  // [
  // 1,  2,  3,
  // 4,  5,  6,
  // 7,  8,  9,
  // 10, 11, 12
  // ]

  private posIndex = [2, 5, 8, 3, 6, 9];

  private firstSelItemView: RemotePetFormationItemView;

  protected onConstruct(): void {
    super.onConstruct();
    this.initView();
    this.addEvent();
  }

  private initView() {
    this.formationItemsView = [
      this.p3 as RemotePetFormationItemView,
      this.p4 as RemotePetFormationItemView,
      this.p5 as RemotePetFormationItemView,
      this.p0 as RemotePetFormationItemView,
      this.p1 as RemotePetFormationItemView,
      this.p2 as RemotePetFormationItemView,
    ];
    for (let i = 0; i < this.formationItemsView.length; i++) {
      this.formationItemsView[i].pos = this.posIndex[i];
      this.formationItemsView[i].onClick(this, this.onClickItemView, [
        this.formationItemsView[i],
      ]);
    }
  }

  private addEvent(): void {
    this.model.addEventListener(
      RemotePetEvent.COMMIT,
      this.commitHandler,
      this,
    );
    this.model.addEventListener(
      RemotePetEvent.PET_CHANGE,
      this.petChangeHandler,
      this,
    );
  }

  private removeEvent(): void {
    this.model.removeEventListener(
      RemotePetEvent.COMMIT,
      this.commitHandler,
      this,
    );
    this.model.removeEventListener(
      RemotePetEvent.PET_CHANGE,
      this.petChangeHandler,
      this,
    );
  }
  private commitHandler() {
    this.refresh();
  }

  private petChangeHandler(petsData: PetData[]) {
    if (!petsData) return;
    if (petsData.length == 1) {
      this.addPet(petsData[0]);
    } else {
      this.changePet(petsData);
    }
    this.endDragHandler();
  }

  private addPet(p: PetData) {
    if (!p) return;
    let arr = this.model.petListInfo.remotePetFormationOfArray;
    let pos = arr.indexOf(p.petId + "");
    //已经有位置了, 更新当前位置
    if (pos >= 0) {
      this.formationItemsView[pos > 2 ? pos - 1 : pos].petData = p;
      return;
    }
    //找一个空的位置
    for (let item of this.formationItemsView) {
      if (item && !item.petData) {
        item.petData = p;
        break;
      }
    }
  }

  private changePet(value: PetData[]) {
    if (value[0]) {
      for (var item2 of this.formationItemsView) {
        if (item2.petData == value[0]) {
          item2.petData = value[1];
        }
      }
    } else {
      this.addPet(value[1]);
    }
  }

  private refresh() {
    let arr = this.model.petListInfo.remotePetFormationOfArray;
    let formation = arr;
    let petId: number = 0;
    for (let item2 of this.formationItemsView) {
      petId = +formation[item2.pos];
      item2.petData = this.model.petListInfo.getPet(petId);
    }
  }

  private onClickItemView(v: RemotePetFormationItemView) {
    let first = false;
    if (!this.firstSelItemView && v.petData) {
      this.firstSelItemView = v;
      first = true;
    }

    if (!this.firstSelItemView) return;
    for (let view of this.formationItemsView) {
      view.enabledSelectAvatar(false);
      if (view == this.firstSelItemView) {
        continue;
      }
      view.selected = first;
    }

    if (!first && this.firstSelItemView) {
      let temp = v.petData;
      v.petData = this.firstSelItemView.petData;
      this.firstSelItemView.petData = temp;
      this.firstSelItemView = null;
      this.endDragHandler();
    }
  }

  private endDragHandler() {
    let arr = this.defaultPos.concat();
    for (let item of this.formationItemsView) {
      if (item.petData) {
        arr[item.pos] = item.petData.petId;
      }
      item.enabledSelectAvatar(true);
    }
    this.model.petListInfo.formationString = arr.join(",");
  }

  private get model(): RemotePetModel {
    return RemotePetManager.Instance.model;
  }

  public dispose() {
    this.removeEvent();
    if (this.formationItemsView) {
      for (let item of this.formationItemsView) {
        item.dispose();
      }
    }

    this.formationItemsView = null;
  }
}
