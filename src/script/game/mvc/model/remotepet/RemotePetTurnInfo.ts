import { RemotePetTurnItemInfo } from "./RemotePetTurnItemInfo";

export class RemotePetTurnInfo {
  public goodsList: string;
  /**
   *页关卡数量
   */
  public static MAX_TURN_NUM: number = 15;

  public static TOTAL_NUM: number = 15;

  public specialIndex: string;

  public currPage: number = 0;

  public currTurn: number = 0;

  public maxTurn: number = 0;

  public remotePetTurnList: RemotePetTurnItemInfo[];

  public showTurnList: RemotePetTurnItemInfo[];

  public currentPageNum: number = RemotePetTurnInfo.MAX_TURN_NUM;
  public constructor() {
    this.remotePetTurnList = [];
    this.showTurnList = [];
  }

  public updateShowTurnList() {
    let startIndex: number = (this.currPage - 1) * this.currentPageNum;
    let endIndex: number = startIndex + this.currentPageNum;
    if (endIndex > this.remotePetTurnList.length)
      endIndex = this.remotePetTurnList.length;
    this.showTurnList = this.remotePetTurnList.slice(startIndex, endIndex);
  }
  public reseData(curPage: number = 1) {
    this.currPage = Math.ceil(this.currTurn / RemotePetTurnInfo.TOTAL_NUM);
    if (this.currPage < 1) this.currPage = 1;
  }
  public get totalPage(): number {
    let total: number = Math.ceil(
      (this.maxTurn + 1) / RemotePetTurnInfo.TOTAL_NUM
    );
    if (total < 1) total = 1;
    return total;
  }

  public get specialIndexOfArray() {
    if (this.specialIndex) {
      return this.specialIndex.split(",");
    }
    return [];
  }

  public get maxTurnItemInfo() {
    return this.remotePetTurnList[this.maxTurn - 1];
  }

  public get curTurnItemInfo() {
    return this.remotePetTurnList[this.currTurn - 1];
  }
}
