/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-05 11:00:47
 * @LastEditTime: 2023-03-31 18:07:34
 * @LastEditors: jeremy.xu
 * @Description: 常用滤镜类
 */

export class UIFilter {
  static normalMat: Array<number> = [
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0,
  ];
  static lightMat: Array<number> = [
    1 + 0.2,
    0,
    0,
    0,
    0,
    0,
    1 + 0.2,
    0,
    0,
    0,
    0,
    0,
    1 + 0.2,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
  ];
  static light2Mat: Array<number> = [
    1 + 0.5,
    0,
    0,
    0,
    0,
    0,
    1 + 0.5,
    0,
    0,
    0,
    0,
    0,
    1 + 0.5,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
  ];
  static darkMat: Array<number> = [
    1 - 0.2,
    0,
    0,
    0,
    0,
    0,
    1 - 0.2,
    0,
    0,
    0,
    0,
    0,
    1 - 0.2,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
  ];
  static darkMat2: Array<number> = [
    1 - 0.8,
    0,
    0,
    0,
    0,
    0,
    1 - 0.8,
    0,
    0,
    0,
    0,
    0,
    1 - 0.8,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
  ];
  static darkMat3: Array<number> = [
    1 - 0.5,
    0,
    0,
    0,
    0,
    0,
    1 - 0.5,
    0,
    0,
    0,
    0,
    0,
    1 - 0.5,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
  ];
  static grayMat: Array<number> = [
    0.3086, 0.6094, 0.082, 0, 0, 0.3086, 0.6094, 0.082, 0, 0, 0.3086, 0.6094,
    0.082, 0, 0, 0, 0, 0, 1, 0,
  ];
  static redMat: Array<number> = [
    1,
    0,
    0,
    0,
    0, //R
    0,
    0,
    0,
    0,
    0, //G
    0,
    0,
    0,
    0,
    0, //B
    0,
    0,
    0,
    1,
    0,
  ];
  static yellowMat: Array<number> = [
    1,
    0,
    0,
    0,
    60, // red
    0,
    1,
    0,
    0,
    60, // green
    0,
    0,
    1,
    0,
    60, // blue
    0,
    0,
    0,
    1,
    0, // alpha
  ];

  static battleDannyMat: Array<number> = [
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
  ];
  static battle_ATTACK_trans: Array<number> = [1, 1, 1, 1, 55];
  static battle_DEFENSE_trans: Array<number> = [1, 1, 1, 1, 0, 0, 55];

  static normalFilter: Laya.Filter = new Laya.ColorFilter(UIFilter.normalMat);
  static lightFilter: Laya.Filter = new Laya.ColorFilter(UIFilter.lightMat);
  static light2Filter: Laya.Filter = new Laya.ColorFilter(UIFilter.light2Mat);
  static darkFilter: Laya.Filter = new Laya.ColorFilter(UIFilter.darkMat);
  static darkFilter2: Laya.Filter = new Laya.ColorFilter(UIFilter.darkMat2);
  static darkFilter3: Laya.Filter = new Laya.ColorFilter(UIFilter.darkMat3);
  static grayFilter: Laya.Filter = new Laya.ColorFilter(UIFilter.grayMat);
  static redFilter: Laya.Filter = new Laya.ColorFilter(UIFilter.redMat);
  static yellowFilter: Laya.Filter = new Laya.ColorFilter(UIFilter.yellowMat);
  static glowFilter: Laya.GlowFilter = new Laya.GlowFilter("0xFFFF00", 1, 5, 5);

  static normalGlowFilter: Laya.Filter = new Laya.GlowFilter("#FFFFFF");
  static lightGlowFilter: Laya.Filter = new Laya.GlowFilter("");
  static darkGlowFilter: Laya.Filter = new Laya.GlowFilter("");
  static darkGlowFilter2: Laya.Filter = new Laya.GlowFilter("");
  static grayGlowFilter: Laya.Filter = new Laya.GlowFilter("#999999");
  static redGlowFilter: Laya.Filter = new Laya.GlowFilter("#FF0000");
  static yellowGlowFilter: Laya.Filter = new Laya.GlowFilter("#FFFF00");
  static blurFilter: Laya.Filter = new Laya.BlurFilter(8);

  static BattleModel_ATTACK_TRANSFORM = new Laya.ColorFilter(
    UIFilter.battle_ATTACK_trans,
  );
  static BattleModel_DEFENSE_TRANSFORM = new Laya.ColorFilter(
    UIFilter.battle_DEFENSE_trans,
  );
  static battleDannyFilter = new Laya.ColorFilter(UIFilter.battleDannyMat);

  static normal(node: Laya.Sprite | fgui.GObject, recursive?: boolean) {
    if (!node) return;
    node.filters = [UIFilter.normalFilter];
  }

  static light(node: Laya.Sprite | fgui.GComponent, recursive?: boolean) {
    if (!node) return;
    node.filters = [UIFilter.lightFilter];
  }

  static gray(node: Laya.Sprite | fgui.GObject, recursive?: boolean) {
    if (!node) return;
    node.filters = [UIFilter.grayFilter];
  }

  static dark(node: Laya.Sprite | fgui.GComponent, recursive?: boolean) {
    if (!node) return;
    node.filters = [UIFilter.darkFilter];
  }

  static yellow(node: Laya.Sprite | fgui.GComponent, recursive?: boolean) {
    if (!node) return;
    node.filters = [UIFilter.yellowFilter];
  }
}
