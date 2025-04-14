/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-18 10:11:34
 * @LastEditTime: 2023-05-15 12:08:44
 * @LastEditors: jeremy.xu
 * @Description:
 */

export enum eFilterFrameText {
  Normal, //放一些常用的颜色
  AvatarName,
  PetQuality,
  ItemQuality,
  StarQuality,
  TreasureMapQuality,
}

export class FilterFrameText extends Laya.Text {
  static Colors = {
    // 白 蓝队 红队
    [eFilterFrameText.Normal]: ["#ffffff", "#00d8ff", "#ff2e2e"],
    // 路人(白), 同公会(绿), 自己(蓝), 天空之城npc(黄), 怪(红), 外城金矿/副本宝箱(黄)
    [eFilterFrameText.AvatarName]: [
      "#ffffff",
      "#9ffb4e",
      "#00f0ff",
      "#ffdc57",
      "#ff2e2e",
      "#fff600",
    ],
    // 白 绿 蓝 紫 橙 红
    [eFilterFrameText.PetQuality]: [
      "#ffffff",
      "#59cd41",
      "#32a2f8",
      "#c300ff",
      "#ff9600",
      "#ce0f0f",
    ],
    // 白 绿 蓝 紫 橙 红
    [eFilterFrameText.ItemQuality]: [
      "#ffffff",
      "#59cd41",
      "#32a2f8",
      "#a838f7",
      "#ff8000",
      "#ce0f0f",
      "#ce0f0f",
    ],
    // 白 绿 蓝 紫 橙 红
    [eFilterFrameText.StarQuality]: [
      "#ffffff",
      "#59cd41",
      "#32a2f8",
      "#a838f7",
      "#ff8000",
      "#ce0f0f",
      "#ce0f0f",
    ],
    // 绿 蓝 紫 橙
    [eFilterFrameText.TreasureMapQuality]: [
      "#59cd41",
      "#32a2f8",
      "#c300ff",
      "#ff9600",
    ],
  };

  //默认, 天空之城npc
  static baseStrokeColor = ["#000000", "#7a3b10"];

  constructor(
    w: number,
    h: number,
    font = Laya.Text.defaultFont,
    fontSize: number = 18,
    color = "#ffffff",
    align: string = "center",
    valign = "middle",
    anchorX = 0.5,
    anchorY = 0,
    defStroke: boolean = true,
    defGlow: boolean = true,
  ) {
    super();

    this.width = w;
    this.height = h;
    this.font = font;
    this.fontSize = fontSize;
    this.color = color;
    this.align = align;
    this.valign = valign;
    let privotX = w * anchorX;
    let privotY = h * anchorY;
    this.pivot(privotX, privotY);

    if (defStroke) {
      this.setStroke();
    }
    if (defGlow) {
      // this.setGlowFilter()
    }
    return this;
  }

  setStroke(colorIdx: number = 0, width: number = 2) {
    this.strokeColor = FilterFrameText.baseStrokeColor[colorIdx];
    this.stroke = width;
  }

  setGlowFilter(
    filter: Laya.Filter = new Laya.GlowFilter("#000000", 3.5, 0, 0),
  ) {
    this.filters = [filter];
  }

  // asset.core.BagProfileGreen,asset.core.BagProfileBlue,asset.core.BagProfilePurple,asset.core.BagProfileOrange,asset.core.BagProfileFashion"
  /**
   * @param index
   * @param type
   */
  setFrame(index: number, type = eFilterFrameText.Normal) {
    // Logger.log("[FilterFrameText]setFrame",  type, index, FilterFrameText.Colors[type], FilterFrameText.Colors[type][index])
    index = index - 1;
    if (!FilterFrameText.Colors[type]) return;
    if (!FilterFrameText.Colors[type][index]) return;

    this.color = FilterFrameText.Colors[type][index];
  }

  private _data: any;
  public set data(value: any) {
    this._data = value;
  }

  public get data(): any {
    return this._data;
  }

  dispose() {
    super.destroy(true);
  }
}
