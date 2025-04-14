import FUI_MonopolyFinishColumnView from "../../../../../fui/Monopoly/FUI_MonopolyFinishColumnView";
import FUI_MonopolyFinishRewardItem from "../../../../../fui/Monopoly/FUI_MonopolyFinishRewardItem";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { IconFactory } from "../../../../core/utils/IconFactory";
import SinglePassCardStateInfo from "../../singlepass/model/SinglePassCardStateInfo";
import MonopolyFinishRewardItem from "./MonopolyFinishRewardItem";
import TempMsg = com.road.yishi.proto.campaign.TempMsg;

/**
 * 老虎机抽奖ITEM列
 */
export default class MonopolyFinishColumnView extends FUI_MonopolyFinishColumnView {
  static _blurFilterHigh: Laya.Filter = new Laya.BlurFilter(5);
  static _blurFilterMedium: Laya.Filter = new Laya.BlurFilter(4);
  static _blurFilterLow: Laya.Filter = new Laya.BlurFilter(3);
  /**
   * 动画播放延迟时间数组
   */
  private _delayTimes: Array<number> = [0.1, 0.2, 0.3, 0.4, 0.6, 0.8, 1.0];
  /**
   * 动画播放次数
   */
  private _delayCount: number = 7;
  /**
   * 轮盘里出现的所有奖励数组
   */
  private _infos: Array<any>;
  /**
   * 奖励物品在奖励数组中的位置
   */
  private _rewardIndex: number = 0;

  /**
   * 动画播放前, 模糊切换时间
   */
  private _blurCount: number = 4;
  private _mediumCount: number = 3;
  private _lowCount: number = 2;
  // private  _playing:boolean = false;
  // private  _blurIndex:number = 0;
  private _infoIndex: number = 0;
  /** 滚动次数 */
  private _turnIndex: number = 0;
  private _turnCompleteCount: number = 0;
  private _turnCompleteMax: number = 4;

  private _itemView1: MonopolyFinishRewardItem;
  private _itemView2: MonopolyFinishRewardItem;
  private _itemView3: MonopolyFinishRewardItem;
  private _itemView4: MonopolyFinishRewardItem;
  private _itemView5: MonopolyFinishRewardItem;

  private _itemState1: SinglePassCardStateInfo;
  private _itemState2: SinglePassCardStateInfo;
  private _itemState3: SinglePassCardStateInfo;
  private _itemState4: SinglePassCardStateInfo;
  private _itemState5: SinglePassCardStateInfo;

  private _callBack: Function;

  onConstruct() {
    super.onConstruct();
    this._itemState1 = new SinglePassCardStateInfo(
      0,
      0,
      295,
      0.8,
      SinglePassCardStateInfo.LEFT,
    );
    this._itemState2 = new SinglePassCardStateInfo(
      0.3,
      0,
      295,
      0.8,
      SinglePassCardStateInfo.LEFT,
    );
    this._itemState3 = new SinglePassCardStateInfo(
      1,
      0,
      147,
      1.0,
      SinglePassCardStateInfo.CENTER,
    );
    this._itemState4 = new SinglePassCardStateInfo(
      0.3,
      0,
      0,
      0.7,
      SinglePassCardStateInfo.RIGHT,
    );
    this._itemState5 = new SinglePassCardStateInfo(
      0,
      0,
      0,
      0.7,
      SinglePassCardStateInfo.RIGHT,
    );

    this._itemView1 = this.item1 as MonopolyFinishRewardItem;
    this._itemView2 = this.item2 as MonopolyFinishRewardItem;
    this._itemView3 = this.item3 as MonopolyFinishRewardItem;
    this._itemView4 = this.item4 as MonopolyFinishRewardItem;
    this._itemView5 = this.item5 as MonopolyFinishRewardItem;
  }

  public initInfos(infos: any): void {
    this._infos = infos;
    this.initInfo();
    this.initState();
  }

  /**
   * 显示道具图标
   */
  private initInfo() {
    let currenIndex: number = this._infoIndex % this._infos.length;
    // console.log('test----------initInfo  currenIndex',currenIndex)
    this._itemView1.setData(this.getInfo(currenIndex - 2));
    this._itemView2.setData(this.getInfo(currenIndex - 1));
    this._itemView3.setData(this.getInfo(currenIndex));
    this._itemView4.setData(this.getInfo(currenIndex + 1));
    this._itemView5.setData(this.getInfo(currenIndex + 2));
  }

  /**
   * 设置道具位置
   */
  private initState(): void {
    this.setItemState(this._itemView1, this._itemState1);
    this.setItemState(this._itemView2, this._itemState2);
    this.setItemState(this._itemView3, this._itemState3);
    this.setItemState(this._itemView4, this._itemState4);
    this.setItemState(this._itemView5, this._itemState5);
  }

  private setItemState(
    itemView: MonopolyFinishRewardItem,
    itemState: SinglePassCardStateInfo,
  ): void {
    itemView.x = itemState.x;
    itemView.y = itemState.y;
    // console.log('test---------x',itemView.x,' y ',itemView.y)
    // itemView.alpha = itemState.alpha;
    // itemView.scaleX = itemState.scale;
    // itemView.scaleY = itemState.scale;
  }

  private getInfo(index: number): TempMsg {
    if (index < 0) {
      index = index + this._infos.length;
    } else if (index >= this._infos.length) {
      index = index - this._infos.length;
    }
    return this._infos[index] as TempMsg;
  }

  public start(
    callBack: Function = null,
    rewardIndex: number = 0,
    blurCount: number = 4,
  ): void {
    this._callBack = callBack;
    this._rewardIndex = rewardIndex;
    this._blurCount = blurCount;
    this._infoIndex =
      this._rewardIndex -
      ((this._blurCount + this._delayCount) % this._infos.length);
    // this._blurIndex = 0;
    this._turnIndex = 0;
    // this._playing = true;

    // this.killTweens();
    this.filters = [UIFilter.blurFilter];
    this.initInfo();
    this.initState();
    this.turnNext();
  }
  /**
   * 滚动一次
   * @param delayTime
   */
  private turnNext(delayTime: number = 50): void {
    // console.log('test---------turnNext ---  滚动一次');
    this.tweenCard(this._itemView2, this._itemState1, delayTime);
    this.tweenCard(this._itemView3, this._itemState2, delayTime);
    this.tweenCard(this._itemView4, this._itemState3, delayTime);
    this.tweenCard(this._itemView5, this._itemState4, delayTime);
  }

  private tweenCard(
    itemView: MonopolyFinishRewardItem,
    stateInfo: SinglePassCardStateInfo,
    delayTime: number,
  ): void {
    let tweenVars: object = new Object();
    // tweenVars["alpha"] = stateInfo.alpha;
    tweenVars["x"] = stateInfo.x;
    tweenVars["y"] = stateInfo.y;
    // tweenVars["scaleX"] = stateInfo.scale;
    // tweenVars["scaleY"] = stateInfo.scale;
    tweenVars["onCompleteListener"] = this.tweenCardCompleteHandler.bind(this);
    // TweenMax.to(itemView, delayTime, tweenVars);
    Laya.Tween.to(
      itemView,
      { y: stateInfo.y },
      delayTime,
      Laya.Ease.sineOut,
      Laya.Handler.create(this, this.tweenCardCompleteHandler, [itemView]),
    );
  }

  private tweenCardCompleteHandler(itemView): void {
    // Laya.Tween.clear(itemView);
    // var itemView:MonopolyFinishRewardItem = evt.target.target as MonopolyFinishRewardItem;
    // TweenMax.killTweensOf(itemView);

    this._turnCompleteCount++;
    // console.log('test---------tweenCardCompleteHandler --- _turnCompleteCount',this._turnCompleteCount,'  this._turnCompleteMax',this._turnCompleteMax);
    if (this._turnCompleteCount >= this._turnCompleteMax) {
      this._turnCompleteCount = 0;
      this._turnIndex++;
      this._infoIndex++;
      // console.log('test---------tweenCardCompleteHandler --- _turnIndex',this._turnIndex,'  this._infoIndex',this._infoIndex,'_blurCount',this._blurCount);
      if (this._turnIndex < this._blurCount) {
        this.filters = [MonopolyFinishColumnView._blurFilterHigh];
        this.initInfo();
        this.initState();
        this.turnNext();
      } else if (this._turnIndex < this._blurCount + this._delayCount) {
        if (this._turnIndex < this._blurCount + this._mediumCount) {
          this.filters = [MonopolyFinishColumnView._blurFilterMedium];
        } else if (
          this._turnIndex <
          this._blurCount + this._mediumCount + this._lowCount
        ) {
          this.filters = [MonopolyFinishColumnView._blurFilterLow];
        } else {
          this.filters = [];
        }
        let _delayTime: number =
          this._delayTimes[this._turnIndex - this._blurCount];
        this.initInfo();
        this.initState();
        this.turnNext(_delayTime);
      } else {
        if (this._callBack != null) {
          // console.log('test---------tweenCardCompleteHandler --- _callBack');
          this._callBack();
        }
      }
    }
  }

  // private killTweens():void
  // {
  //     TweenMax.killTweensOf(this._itemView2);
  //     TweenMax.killTweensOf(this._itemView3);
  //     TweenMax.killTweensOf(this._itemView4);
  //     TweenMax.killTweensOf(this._itemView5);
  // }

  public dispose(): void {
    // this.killTweens();
    super.dispose();
  }
}
