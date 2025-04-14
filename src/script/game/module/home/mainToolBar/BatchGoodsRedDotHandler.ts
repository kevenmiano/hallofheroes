import { BagType } from "../../../constant/BagDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../manager/GoodsManager";

export class BatchGoodsRedDotHandler {
  public isShowRedDot = false;
  //记录批量使用道具Id
  private batchGoodesTempId: { [key: number]: boolean };
  public constructor() {
    this.batchGoodesTempId = {};
    //先更新一下
    this.updateBatchGoods(
      GoodsManager.Instance.getGoodsByBagType(BagType.Player),
    );
  }

  public updateBatchGoods(goodes: GoodsInfo[]) {
    for (let goodInfo of goodes) {
      if (goodInfo.templateInfo.IsCanBatch == 1) {
        if (!this.batchGoodesTempId[goodInfo.templateId]) {
          this.batchGoodesTempId[goodInfo.templateId] = false;
        }
      }
    }

    this.isShowRedDot = !this.isAllSeened();
  }

  public setAllSeened() {
    for (let tmp in this.batchGoodesTempId) {
      this.batchGoodesTempId[tmp] = true;
    }
    this.isShowRedDot = false;
  }

  private isAllSeened() {
    for (let tmp in this.batchGoodesTempId) {
      if (!this.batchGoodesTempId[tmp]) {
        return false;
      }
    }
    return true;
  }
}
