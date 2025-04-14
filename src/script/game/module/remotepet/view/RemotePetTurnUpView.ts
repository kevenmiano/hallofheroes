//@ts-expect-error: External dependencies
import FUI_RemotePetTurnUpView from "../../../../../fui/RemotePet/FUI_RemotePetTurnUpView";
import { RemotePetEvent } from "../../../../core/event/RemotePetEvent";
import { RemotePetManager } from "../../../manager/RemotePetManager";
import { RemotePetModel } from "../../../mvc/model/remotepet/RemotePetModel";
import { RemotePetController } from "../RemotePetController";
import { RemotePetTurnInfoItemView } from "./RemotePetTurnInfoItemView";

export class RemotePetTurnUpView extends FUI_RemotePetTurnUpView {
  private _turnList: RemotePetTurnInfoItemView[];

  private pos = [
    { x: 150, y: 150 },
    { x: 280, y: 120 },
    { x: 408, y: 182 },
    { x: 358, y: 286 },
    { x: 285, y: 205 },
    { x: 280, y: 417 },
    { x: 436, y: 448 },
    { x: 573, y: 341 },
    { x: 563, y: 241 },
    { x: 698, y: 188 },
    { x: 613, y: 138 },
    { x: 732, y: 330 },
    { x: 767, y: 439 },
    { x: 885, y: 441 },
    { x: 974, y: 406 },
    { x: 1035, y: 292 },
    { x: 999, y: 483 },
    { x: 1089, y: 183 },
  ];

  private pos2 = [
    { x: 187, y: 140 },
    { x: 290, y: 199 },
    { x: 282, y: 298 },
    { x: 215, y: 387 },
    { x: 380, y: 278 },
    { x: 290, y: 453 },
    { x: 406, y: 452 },
    { x: 495, y: 374 },
    { x: 623, y: 398 },
    { x: 622, y: 208 },
    { x: 718, y: 414 },
    { x: 785, y: 330 },
    { x: 761, y: 184 },
    { x: 861, y: 220 },
    { x: 1049, y: 499 },
    { x: 938, y: 202 },
    { x: 956, y: 292 },
    { x: 1019, y: 378 },
  ];

  protected onConstruct() {
    super.onConstruct();
    this.initView();
    this.addEvent();
  }

  private initView() {
    this._turnList = [];
    for (let i: number = 0; i < 18; i++) {
      let itemView: RemotePetTurnInfoItemView = fgui.UIPackage.createObject(
        "RemotePet",
        "RemotePetTurnInfoItemView",
      ) as RemotePetTurnInfoItemView;
      this._turnList.push(itemView);
    }
  }

  private listHandler() {
    let model = this.model;
    // if (model.turnInfo.currPage >= 7) {
    //     this._line1.visible = true;
    //     this._line2.visible = !this._line1.visible;
    // } else {
    this._line1.visible = false;
    this._line2.visible = !this._line1.visible;
    // }

    this._lastPageBtn.enabled = model.turnInfo.currPage != 1;
    this._nextPageBtn.enabled =
      model.turnInfo.currPage != model.turnInfo.totalPage;
    let showTurnList = model.turnInfo.showTurnList;
    if (!showTurnList) return;
    for (let view of this._turnList) {
      if (view.parent) view.parent.removeChild(view);
    }

    let i = 0;
    for (let item of showTurnList) {
      if (model.turnInfo.currPage >= 7) {
        this._turnList[i].x = this.pos[i].x;
        this._turnList[i].y = this.pos[i].y;
      } else {
        this._turnList[i].x = this.pos[i].x;
        this._turnList[i].y = this.pos[i].y;
      }
      this._turnList[i].info = item;
      this.addChild(this._turnList[i]);
      i++;
    }
  }

  private addEvent() {
    this.model.addEventListener(
      RemotePetEvent.Turn_LIST,
      this.listHandler,
      this,
    );
    this._lastPageBtn.onClick(this, this.onPageHandler, [true]);
    this._nextPageBtn.onClick(this, this.onPageHandler, [false]);
  }

  private removeEvent() {
    this.model.removeEventListener(
      RemotePetEvent.Turn_LIST,
      this.listHandler,
      this,
    );
    this._lastPageBtn.offClick(this, this.onPageHandler);
    this._nextPageBtn.offClick(this, this.onPageHandler);
  }

  public freshItemView() {
    if (!this._turnList) return;
    for (let turnView of this._turnList) {
      turnView.freshView();
    }
  }

  private onPageHandler(b: boolean) {
    RemotePetController.Instance.pageLookHandler(b);
  }

  private get model(): RemotePetModel {
    return RemotePetManager.Instance.model;
  }

  public dispose(): void {
    this.removeEvent();
    if (this._turnList)
      for (let item of this._turnList) {
        item.dispose();
      }
    this._turnList = null;
  }
}
