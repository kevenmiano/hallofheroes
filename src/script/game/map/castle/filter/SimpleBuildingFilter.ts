import IBuildingFilter from "../../space/interfaces/IBuildingFilter";

/**
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2020-11-23 15:23
 */
export default class SimpleBuildingFilter implements IBuildingFilter {
  protected lightingFilter: Laya.ColorFilter;
  protected glow: Laya.GlowFilter;
  protected orangeGlow: Laya.GlowFilter;
  protected grayFilter: Laya.ColorFilter;
  protected lightFilter: Laya.ColorFilter;
  constructor() {
    this.setupGrayFilter();
    this.setupLightingFilter();
    this.setupLightFilter();
    this.setupGlowFilter();
  }

  private setupGrayFilter() {
    let matrix: number[] = [
      0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0.3, 0.6, 0.1, 0, 0, 0, 0, 0, 1,
      0,
    ];
    this.grayFilter = new Laya.ColorFilter(matrix);
  }

  private setupLightingFilter() {
    let matrix: number[] = [];
    matrix = matrix.concat([1, 0, 0, 0, 60]); // red
    matrix = matrix.concat([0, 1, 0, 0, 60]); // green
    matrix = matrix.concat([0, 0, 1, 0, 60]); // blue
    matrix = matrix.concat([0, 0, 0, 1, 0]); // alpha
    this.lightingFilter = new Laya.ColorFilter(matrix);
    this.glow = new Laya.GlowFilter("0xFFFF00", 1, 5, 5);
  }

  private setupLightFilter() {
    let matrix: number[] = [];
    matrix = matrix.concat([1, 0, 0, 0, 50]); // red
    matrix = matrix.concat([0, 1, 0, 0, 50]); // green
    matrix = matrix.concat([0, 0, 1, 0, 50]); // blue
    matrix = matrix.concat([0, 0, 0, 1, 0]); // alpha
    this.lightFilter = new Laya.ColorFilter(matrix);
  }

  private setupGlowFilter() {
    this.orangeGlow = new Laya.GlowFilter("0xF3CF23", 1, 2, 2);
  }

  public setLightFilter(display: Laya.Sprite) {
    display.filters = [this.lightFilter];
  }
  public setLightingFilter(display: Laya.Sprite) {
    display.filters = [this.lightingFilter, this.glow];
  }
  public setGlowFilter(display: Laya.Sprite) {
    display.filters = [this.orangeGlow];
  }

  public setBuildingOverFilter(display: Laya.Sprite) {
    this.setLightingFilter(display);
  }

  public setGrayFilter(display: Laya.Sprite) {
    display.filters = [this.grayFilter];
  }

  public setBuildingOutFilter(display: Laya.Sprite) {
    this.setNormalFilter(display);
  }

  public setNormalFilter(display: Laya.Sprite) {
    display.filters = [];
  }

  public setBuildingBuildingFilter(display: Laya.Sprite) {
    this.setGrayFilter(display);
  }

  public setBuildingFinishFilter(display: Laya.Sprite) {
    this.setNormalFilter(display);
  }

  public setRedFilter(display: Laya.Sprite) {}
}
