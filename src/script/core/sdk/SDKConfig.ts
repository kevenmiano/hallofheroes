// @ts-nocheck
import BaseNativeAdItemModel from "./base/BaseNativeAdItemModel";
export function isNull(obj: any): boolean {
  return obj == undefined || obj == null;
}

export function random(start: number, end?: number): number {
  if (end) {
    return Math.floor(Math.random() * (end - start) + start);
  } else {
    return Math.floor(Math.random() * start);
  }
}

export function compareVersion(v1, v2) {
  v1 = v1.split(".");
  v2 = v2.split(".");
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push("0");
  }
  while (v2.length < len) {
    v2.push("0");
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);

    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }

  return 0;
}

export type DataCallback = (result: ResultState, data: any) => void;
export type ResultCallback = (result: ResultState) => void;
export type NativeAdCallback = (list: BaseNativeAdItemModel[]) => void;
//广告名称, 对应SDKCOnfig中的key
export class ADName {
  static banner: string = "banner"; //bander 广告
  static reward: string = "reward"; //激励视频
  static insert: string = "insert"; //插屏广告
  static native: string = "native"; //原生广告
  static appbox: string = "appbox"; //盒子广告
  static shareTitle: string = "shareTitle"; //分享标题
  static shareImage: string = "shareImage"; //分享图片或者ID
}

//广告拉取失败是否使用分享
export let USE_SHARE: boolean = true;

export enum ResultState {
  NO,
  YES,
  PROGRESS,
}
/**
 * 广告状态
 *
 */
export enum SDKState {
  close, //关闭状态
  loading, //加载状态
  loadSucess, //加载成功
  loadFail, //加载失败
  open, //播放状态
}

/**
0	开发
1    H5
2	微信
3	QQ
4	头条
5	OPPO
6	VIVO
7	百度
 */
export enum ChannelID {
  DEV,
  WX,
  QQ,
  TT,
  OPPO,
  VIVO,
  BD, //百度
  NATIVE, //iOS和Andriod原生
  WEBVIEW, //iOS和Andriod WebView
  WEB_WAN, //玩平台
  FCC, //中控
  WEB_H5SDK, //h5dk
}

export enum ChannelSTR {
  DEV = "DEBUG",
  WX = "WX",
  QQ = "QQ",
  TT = "TT",
  OPPO = "OPPO",
  VIVO = "VIVO",
  BD = "BD", //百度
  NATIVE = "NATIVE", //iOS和Andriod原生
  WEBVIEW = "WEBVIEW", //iOS和Andriod WebView
  APP = "APP", //
  FCC = "FCC", //
  WEB_WAN = "WAN", //玩平台
  H5SDK = "H5SDK", //h5sdk
}

// 30010                 虎牙-混服
// 3001010        虎牙-专服
// 30020                斗鱼-混服
// 3002010        斗鱼-专服
export enum H5SDK_CHANNEL_ID {
  HY = "30010",
  HY_S = "3001010",
  DY = "30020",
  DY_S = "3002010",
  C_4399 = "30030",
  C_360 = "30040",
  QQHall = "30050",
  QQMobile = "30060",
  LABA = "70002",
  QQZone = "70005",
  HUAWEI_RY = "70012",
}

/** 大玩咖特权 Code */
export enum QQ_HALL_PRIVILEGE {
  CODE_1001 = 1001,
  CODE_1002 = 1002,
  CODE_1003 = 1003,
  CODE_1004 = 1004,
  CODE_1005 = 1005,
  CODE_1006 = 1006,
}

/**
 *  4001 - 4100 分享渠道（分享渠道范围）
 * FB、Twitter、Discord、Instagram、Telegram、Whatsapp、Youtube
 */
export enum SHARE_CHANNEL {
  FB = 4001,
  Twitter,
  Discord,
  Instagram,
  Telegram,
  Whatsapp,
  Youtube,
}

export let SDKConfig: any[] = [
  {
    //dev
  },
  {
    //H5
  },
  {
    //微信
    banner: ["adunit-30911f9f1c544641"],
    reward: ["adunit-a57ea0e6ae249c23"],
    shareTitle: ["[有人@你]来试试你的枪有多准"],
    shareImage: ["share4.jpg"],
  },
  {
    //qq
    banner: ["3dc6fcfee4628890315d17344b304198"],
    insert: ["eb6a8d5369ad7568ce03dc2941063bd4"],
    reward: ["1cbf2104918dc3fce3528e4e50d5de3f"],
    appbox: ["3c1dbaed966527bb40c4cfda9e9789d1"],
    shareTitle: ["[有人@你]来试试你的枪有多准"],
    shareImage: ["share4.jpg"],
  },
  {
    //tt
    banner: ["11kgdie55kae611xob"],
    reward: ["3dcflbcao8dh18g6ja"],
    insert: ["9406efbfk8eh2hccel"],
    shareTitle: ["[有人@你]来试试你的枪有多准"],
    shareImage: ["share4.jpg"],
  },
  {
    //oppo
    banner: ["184591"],
    reward: ["184600"],
    native: ["184599", "184598", "184597"],
    insert: ["184593"],
  },
  {
    //vivo
    banner: ["a0d995c8e3e945e89455612b15a2d24c"],
    reward: ["83c0e30bf7b0473c9cbfcf9b6644527c"],
    insert: ["4f9d9fff72b64f868e48a3be2674f344"],
    native: ["8e95b90220c04fa5934cd4a079ad8f53"],
  },
  {
    //baidu
    banner: [""],
    reward: [
      "7052091", //复活
    ],
  },
];
