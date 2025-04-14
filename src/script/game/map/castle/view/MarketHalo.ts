//@ts-expect-error: External dependencies
import MarketManager from "../../../manager/MarketManager";
import ComponentSetting from "../../../utils/ComponentSetting";

/**
 ** 市场提取光圈
 **/
export class MarketHalo extends Laya.Sprite {
  private _haloImg: Laya.Image;
  private _cashImg: Laya.Image;

  private offset = 11;

  private oy = 0;

  constructor() {
    super();
    this._haloImg = new Laya.Image();
    this._cashImg = new Laya.Image();

    this._haloImg.skin = ComponentSetting.CASTEL_BUILD_MARKET_HALO;
    this._cashImg.skin = ComponentSetting.CASTEL_BUILD_MARKET_CASH;
    this._cashImg.y = this._cashImg.x = this.offset;
    this.addChild(this._haloImg);
    this.addChild(this._cashImg);
  }

  public init() {
    this.oy = this.y;
    MarketManager.Instance.addEventListener(
      MarketManager.OnMineOrderList,
      this.OnMineOrderList,
      this,
    );
    this.OnMineOrderList();
    TweenMax.to(this, 0.35, {
      y: this.oy - 14,
      repeat: -1,
      yoyo: true,
      ease: Quad.easeInOut,
    });
  }

  private OnMineOrderList() {
    MarketManager.Instance.haveCash ? this.show() : this.hide();
  }

  private show() {
    this.visible = true;
  }

  private hide() {
    this.visible = false;
  }

  public clearn() {
    MarketManager.Instance.removeEventListener(
      MarketManager.OnMineOrderList,
      this.OnMineOrderList,
      this,
    );
    TweenMax.killTweensOf(this);
  }
}
