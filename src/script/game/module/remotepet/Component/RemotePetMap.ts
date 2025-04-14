import FUI_RemotePetMap from "../../../../../fui/RemotePet/FUI_RemotePetMap";
import FUI_RemotePetRewardItem from "../../../../../fui/RemotePet/FUI_RemotePetRewardItem";
import LangManager from "../../../../core/lang/LangManager";
import { BaseItem } from "../../../component/item/BaseItem";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { RemotePetManager } from "../../../manager/RemotePetManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { RemotePetTurnInfo } from "../../../mvc/model/remotepet/RemotePetTurnInfo";
import { RemotePetTurnItemInfo } from "../../../mvc/model/remotepet/RemotePetTurnItemInfo";
import FUIHelper from "../../../utils/FUIHelper";
import { RemotePetTurnInfoItemView } from "../view/RemotePetTurnInfoItemView";

export class RemotePetMap extends FUI_RemotePetMap {
  private curTurnInfo: RemotePetTurnItemInfo;

  private rewards: GoodsInfo[];

  private turnItemViews: RemotePetTurnInfoItemView[];

  private turnInfos: RemotePetTurnItemInfo[];

  private curPage = -1;

  protected onConstruct(): void {
    super.onConstruct();
    this.turnItemViews = [
      this.t1 as RemotePetTurnInfoItemView,
      this.t2 as RemotePetTurnInfoItemView,
      this.t3 as RemotePetTurnInfoItemView,
      this.t4 as RemotePetTurnInfoItemView,
      this.t5 as RemotePetTurnInfoItemView,
      this.t6 as RemotePetTurnInfoItemView,
      this.t7 as RemotePetTurnInfoItemView,
      this.t8 as RemotePetTurnInfoItemView,
      this.t9 as RemotePetTurnInfoItemView,
      this.t10 as RemotePetTurnInfoItemView,
      this.t11 as RemotePetTurnInfoItemView,
      this.t12 as RemotePetTurnInfoItemView,
      this.t13 as RemotePetTurnInfoItemView,
      this.t14 as RemotePetTurnInfoItemView,
      this.t15 as RemotePetTurnInfoItemView,
    ];
    this._btnReward.onClick(this, this.onRewardTap);
    this.fgoodsList.itemRenderer = Laya.Handler.create(
      this,
      this.onGoodsRenderer,
      null,
      false,
    );
  }

  public updateView() {
    let model = this.model;
    let now = model.turnInfo.currTurn;
    if (now > 100) now = 100;
    this._curLvNum.text = now + "";
    this._maxLvNum.text = model.turnInfo.maxTurn + "";
  }

  public setTurnInfo(v: RemotePetTurnItemInfo) {
    this.curTurnInfo = v;
    this.curLevelLab
      .setVar("level", this.curTurnInfo.tempInfo.IndexID + "")
      .flushVars();
    this.rewards = this.getItems(this.curTurnInfo.tempInfo.DropItems);
    this.fgoodsList.numItems = this.rewards.length;
    this.updateMap(v.tempInfo.IndexID - 1);
  }

  private updateMap(index: number) {
    let curPage = (index / RemotePetTurnInfo.MAX_TURN_NUM) >> 0;
    // if (curPage == this.curPage) return;
    this.curPage = curPage;
    this.updatePage(curPage + 1);

    let startIndex = curPage * RemotePetTurnInfo.MAX_TURN_NUM;
    let endIndex = startIndex + RemotePetTurnInfo.MAX_TURN_NUM;
    let remotePetTurnList = this.model.turnInfo.remotePetTurnList;
    if (endIndex > remotePetTurnList.length)
      endIndex = remotePetTurnList.length;
    this.turnInfos = remotePetTurnList.slice(startIndex, endIndex);
    for (let i = 0; i < this.turnItemViews.length; i++) {
      this.turnItemViews[i].info = this.turnInfos[i];
    }
  }

  public updatePage(page: number) {
    this._map.url = FUIHelper.getItemURL(
      "RemotePet",
      `Img_SylphExpedition_Map_${page}`,
    );
    // this.mapCtrl.selectedIndex = page >= 7 ? 1 : 0;
  }

  private getItems(dropItems: string) {
    let goodsList: GoodsInfo[] = [];
    let itemsInfo = dropItems.split(",");
    for (let item of itemsInfo) {
      let info = item.split("|");
      let itemId = +info[0];
      let count = +info[1];
      let goodsInfo = new GoodsInfo();
      goodsInfo.templateId = itemId;
      goodsInfo.count = count;
      goodsList.push(goodsInfo);
    }
    return goodsList;
  }

  private onGoodsRenderer(index: number, item: FUI_RemotePetRewardItem) {
    let goodsItem = item._item as BaseItem;
    goodsItem.info = this.rewards[index];
  }

  private onRewardTap() {
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

  public get model() {
    return RemotePetManager.Instance.model;
  }
}
