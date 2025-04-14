/*
 * @Author: jeremy.xu
 * @Date: 2023-10-24 17:30:22
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-08 10:13:17
 * @Description: 内城地图与城战地图共用一张图，但是图截取大小不一样，导致场景中建筑、场景动画位置不一样
 */

export enum EmCastlePos {
  Castle,
  OuterCityWar,
}

export class CastleBuildInfoStyle {
  zIndex: number = 1;
  buildEffectPos: Laya.Point[] = [];

  castlePos: Laya.Point;
  castleNamePos: Laya.Point;

  castleFightPos: Laya.Point;
  castleFightNamePos: Laya.Point;

  constructor(
    castlePos: Laya.Point,
    castleNamePos: Laya.Point,
    castleFightPos: Laya.Point,
    castleFightNamePos: Laya.Point,
  ) {
    this.castlePos = castlePos;
    this.castleNamePos = castleNamePos;

    this.castleFightPos = castleFightPos;
    this.castleFightNamePos = castleFightNamePos;
  }
}

export default class CastleConfigUtil {
  // 内城城战图 原大小
  public static MAP_RAW_WIDTH: number = 1953;
  public static MAP_RAW_HEIGHT: number = 1137;
  // 内城场景图 往右上角截取这么大图片座作为内城显示
  public static MAP_SCENE_WIDTH: number = 1334 * 1.2;
  public static MAP_SCENE_HEIGHT: number = 750 * 1.2;

  /**场景特效的摆放点 */
  public aniPos: Laya.Point[] = [
    new Laya.Point(1450 - 350, 30), //"bird_effect",
    new Laya.Point(1730 - 350, 50), // "cloud_effect_0",
    new Laya.Point(1180 - 350, -10), // "cloud_effect_1",
    new Laya.Point(420 - 350, 15), //"cloud_effect_2",
    new Laya.Point(180 - 350, 35), //"cloud_effect_3",
  ];

  /**建筑配置 */
  public buildConfig: Map<number, CastleBuildInfoStyle> = new Map();

  constructor() {
    this.buildConfig.set(
      101,
      new CastleBuildInfoStyle(
        new Laya.Point(680 - 350, 460),
        new Laya.Point(100, 100),
        new Laya.Point(680, 460),
        new Laya.Point(115, 100),
      ),
    ); //精炼炉
    this.buildConfig.set(
      301,
      new CastleBuildInfoStyle(
        new Laya.Point(860 - 350, 300),
        new Laya.Point(105, 130),
        new Laya.Point(860, 300),
        new Laya.Point(130, 135),
      ),
    ); //仓库
    this.buildConfig.set(
      402,
      new CastleBuildInfoStyle(
        new Laya.Point(950 - 350, 430),
        new Laya.Point(40, 130),
        new Laya.Point(950, 430),
        new Laya.Point(110, 140),
      ),
    ); //兵营
    this.buildConfig.set(
      501,
      new CastleBuildInfoStyle(
        new Laya.Point(1100 - 350, 210),
        new Laya.Point(70, 155),
        new Laya.Point(1100, 210),
        new Laya.Point(90, 180),
      ),
    ); //神学院
    this.buildConfig.set(
      901,
      new CastleBuildInfoStyle(
        new Laya.Point(1330 - 350, 0),
        new Laya.Point(40, 330),
        new Laya.Point(1330, 0),
        new Laya.Point(170, 305),
      ),
    ); //内政厅
    this.buildConfig.set(
      1201,
      new CastleBuildInfoStyle(
        new Laya.Point(1170 - 350, 550),
        new Laya.Point(55, 100),
        new Laya.Point(1170, 550),
        new Laya.Point(120, 100),
      ),
    ); //民居
    this.buildConfig.set(
      1504,
      new CastleBuildInfoStyle(
        new Laya.Point(1355 - 350, 400),
        new Laya.Point(20, 100),
        new Laya.Point(1355, 400),
        new Laya.Point(100, 120),
      ),
    ); //修行神殿
    this.buildConfig.set(
      1506,
      new CastleBuildInfoStyle(
        new Laya.Point(1010 - 350, 625),
        new Laya.Point(100, 100),
        new Laya.Point(1010, 625),
        new Laya.Point(130, 120),
      ),
    ); //市场

    this.buildConfig.set(
      1512,
      new CastleBuildInfoStyle(
        new Laya.Point(967 - 350, 50),
        new Laya.Point(90, 200),
        new Laya.Point(967, 50),
        new Laya.Point(90, 200),
      ),
    ); //占星塔
    this.buildConfig.set(
      1513,
      new CastleBuildInfoStyle(
        new Laya.Point(520 - 350, 580),
        new Laya.Point(80, 150),
        new Laya.Point(520, 580),
        new Laya.Point(80, 150),
      ),
    ); //堡垒
    this.buildConfig.set(
      1514,
      new CastleBuildInfoStyle(
        new Laya.Point(755 - 350, 540),
        new Laya.Point(100, 100),
        new Laya.Point(755, 540),
        new Laya.Point(100, 100),
      ),
    ); //城门
    this.buildConfig.set(
      1515,
      new CastleBuildInfoStyle(
        new Laya.Point(760 - 350, 730),
        new Laya.Point(80, 150),
        new Laya.Point(760, 730),
        new Laya.Point(80, 150),
      ),
    ); //训练场

    this.buildConfig.set(
      1519,
      new CastleBuildInfoStyle(
        new Laya.Point(750 - 350, 990),
        new Laya.Point(100, 100),
        new Laya.Point(730, 935),
        new Laya.Point(80, 105),
      ),
    ); //进攻营地1
    this.buildConfig.set(
      1518,
      new CastleBuildInfoStyle(
        new Laya.Point(590 - 350, 900),
        new Laya.Point(100, 100),
        new Laya.Point(570, 855),
        new Laya.Point(80, 105),
      ),
    ); //进攻营地2
    this.buildConfig.set(
      1517,
      new CastleBuildInfoStyle(
        new Laya.Point(430 - 350, 810),
        new Laya.Point(100, 100),
        new Laya.Point(400, 770),
        new Laya.Point(80, 105),
      ),
    ); //进攻营地3
    this.buildConfig.set(
      1516,
      new CastleBuildInfoStyle(
        new Laya.Point(280 - 350, 720),
        new Laya.Point(100, 100),
        new Laya.Point(255, 685),
        new Laya.Point(80, 105),
      ),
    ); //进攻营地4

    this.buildConfig.get(101).zIndex = 10;
    this.buildConfig.get(402).zIndex = 12;
    this.buildConfig.get(901).zIndex = 10;
    this.buildConfig.get(1201).zIndex = 10;

    //内政厅
    this.buildConfig.get(901).buildEffectPos = [new Laya.Point(30, 270)];
    //采矿场(精炼炉)
    this.buildConfig.get(101).buildEffectPos = [
      new Laya.Point(58, 48), //岩浆
      new Laya.Point(50, -75), //烟囱1
      new Laya.Point(20, -55), //烟囱2
      new Laya.Point(105, 70), //火盆1
      new Laya.Point(75, 70), //火盆2
      new Laya.Point(120, 55), //火盆3
    ];
  }

  private static _instance: CastleConfigUtil;
  public static get Instance(): CastleConfigUtil {
    if (!this._instance) this._instance = new CastleConfigUtil();
    return this._instance;
  }

  public getAniPos(
    index: number,
    type: number = EmCastlePos.Castle,
  ): Laya.Point {
    let pt = this.aniPos[index];
    if (pt) {
      if (type == EmCastlePos.Castle) {
        return pt;
      } else {
        return new Laya.Point(pt.x + 350, pt.y);
      }
    }
    return new Laya.Point(0, 0);
  }

  /** 建筑层级 */
  public getBuildZorder(sonType: number): number {
    let cfg = this.buildConfig.get(sonType);
    if (cfg) {
      return cfg.zIndex;
    }
    return 0;
  }

  /** 建筑上特效位置 */
  public getBuildEffectPos(sonType: number, index: number = 0): Laya.Point {
    let cfg = this.buildConfig.get(sonType);

    if (cfg && cfg.buildEffectPos.length > 0) {
      return cfg.buildEffectPos[index];
    }
    return new Laya.Point(0, 0);
  }

  /** 建筑位置 */
  public getBuildPos(
    sonType: number,
    type: number = EmCastlePos.Castle,
  ): Laya.Point {
    let cfg = this.buildConfig.get(sonType);
    if (cfg) {
      if (type == EmCastlePos.Castle) {
        return cfg.castlePos;
      } else {
        return cfg.castleFightPos;
      }
    }
    return new Laya.Point(0, 0);
  }

  /** 建筑名字位置 */
  public getBuildNamePos(
    sonType: number,
    type: number = EmCastlePos.Castle,
  ): Laya.Point {
    let cfg = this.buildConfig.get(sonType);
    if (cfg) {
      if (type == EmCastlePos.Castle) {
        return cfg.castleNamePos;
      } else {
        return cfg.castleFightNamePos;
      }
    }
    return new Laya.Point(0, 0);
  }
}
