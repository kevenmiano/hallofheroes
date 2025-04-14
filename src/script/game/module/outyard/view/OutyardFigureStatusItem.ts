//@ts-expect-error: External dependencies
import FUI_OutyardFigureStatusItem from "../../../../../fui/OutYard/FUI_OutyardFigureStatusItem";
export default class OutyardFigureStatusItem extends FUI_OutyardFigureStatusItem {
  private _count: number = 0;
  private _fromeType: number = 0;
  private _toX: number = 0;
  private _toY: number = 0;
  private _initX: number = 0;
  private _initY: number = 0;
  constructor() {
    super();
    this.type = this.getController("type");
    this.status = this.getController("status");
  }

  protected onConstruct() {
    super.onConstruct();
    this.type.selectedIndex = 4;
    this.status.selectedIndex = 0;
  }

  public setPoint(x: number, y: number) {
    this._toX = x;
    this._toY = y;
  }

  public setFromType(fromeType: number = 0) {
    this._fromeType = fromeType;
  }

  public changeCount(value: number, totalCount: number) {
    this._count = totalCount;
    if (value < 0) {
      //失败的, 要减去数字的, 不播放动画
      this.refreshView();
    } else {
      //如果这个点已经有人在打了, 不播放动画, 只是改变数字
      if (totalCount > value) {
        this.refreshView();
      } else {
        this.showAddIntergal();
      }
    }
  }

  public initCount(fromX: number, fromY: number, totalCount: number) {
    this._count = totalCount;
    this._initX = fromX;
    this._initY = fromY;
    if (this._count > 0) {
      this.countTxt.text = "X " + this._count.toString();
      this.status.selectedIndex = 1;
      this.x = this._toX;
      this.y = this._toY;
      this.type.selectedIndex = this._fromeType - 1;
    }
  }

  private showAddIntergal() {
    this.type.selectedIndex = this._fromeType - 1;
    this.status.selectedIndex = 0;
    this._initX = this.x;
    this._initY = this.y;
    TweenMax.to(this, 2, {
      x: this._toX,
      y: this._toY,
      onComplete: this.onShowAddComplete.bind(this),
    });
  }

  private onShowAddComplete() {
    this.refreshView();
  }

  private refreshView() {
    if (this._count > 0) {
      this.countTxt.text = "X " + this._count.toString();
      this.status.selectedIndex = 1;
      this.type.selectedIndex = this._fromeType - 1;
    } else {
      this.status.selectedIndex = 0;
      this.type.selectedIndex = 4;
      this.x = this._initX;
      this.y = this._initY;
    }
  }

  public dispose() {
    super.dispose();
  }
}
