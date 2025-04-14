// qq.d.ts
declare namespace qq {
  function onShow(callback: () => void): void;
  function onHide(callback: () => void): void;

  export function showShareMenu(options: {
    withShareTicket: boolean;
    success?: () => void;
    fail?: () => void;
    complete?: () => void;
  }): void;

  export function updateShareMenu(options: {
    withShareTicket: boolean;
    success?: () => void;
    fail?: () => void;
    complete?: () => void;
  }): void;

  export function onShareAppMessage(
    callback: () => {
      title: string;
      imageUrl?: string;
      query?: string;
    },
  ): void;

  //  const loadTask = qq.loadSubpackage({
  //       name: subname, // name 可以填 name 或者 root
  //       success: (res) => {
  //         // 分包加载成功后通过 success 回调
  //         callback(ResultState.YES, null);
  //       },
  //       fail: (res) => {
  //         // 分包加载失败通过 fail 回调
  //         callback(ResultState.NO, null);
  //       },
  //     });

  export function loadSubpackage(options: {
    name: string;
    success?: () => void;
    fail?: () => void;
    complete?: () => void;
  }): {
    onProgressUpdate: (callback: (res: { progress: number }) => void) => void;
  };

  export function saveImageToPhotosAlbum(options: {
    filePath: string;
    success?: () => void;
    fail?: () => void;
    complete?: () => void;
  }): void;

  export function getShareInfo(options: {
    shareTicket: string;
    success?: (res: any) => void;
    fail?: () => void;
    complete?: () => void;
  }): void;

  export function shareAppMessage(options: {
    title: string;
    imageUrl?: string;
    query?: string;
    success?: () => void;
    fail?: () => void;
    complete?: () => void;
  }): void;

  interface BannerAd {
    show(): Promise<void>;
    hide(): void;
    destroy(): void;
    onLoad(callback: () => void): void;
    onError?(callback: (err: any) => void): void;
    onResize?(callback: (res: { width: number; height: number }) => void): void;
    offLoad?(callback: () => void): void;
    offError?(callback: (err: any) => void): void;
    offResize?(
      callback: (res: { width: number; height: number }) => void,
    ): void;
  }

  export function getSystemInfoSync(): {
    screenWidth: number;
    screenHeight: number;
    windowWidth: number;
    windowHeight: number;
  };

  interface RewardedVideoAd {
    show(): Promise<void>;
    onLoad(callback: () => void): void;
    onError(callback: (err: any) => void): void;
    onClose(callback: (res: { isEnded: boolean }) => void): void;
    load(): Promise<void>;
  }

  interface AppBox {
    load(): void;
    show(): void;
    onClose(callback: () => void): void;
    destroy?(): void;
  }

  function showToast(options: {
    title: string;
    icon?: string;
    duration?: number;
  }): void;
  function vibrateShort(): void;

  function previewImage(options: {
    current: string;
    urls: string[];
    success?: () => void;
    fail?: () => void;
    complete?: () => void;
  }): void;

  function navigateToMiniProgram(options: {
    appId: string;
    path?: string;
    extraData?: Record<string, any>;
    envVersion?: "develop" | "trial" | "release";
    success?: () => void;
    fail?: () => void;
    complete?: () => void;
  }): void;

  function createInterstitialAd(options: {
    adUnitId: string;
  }): QQInterstitialAdInstance;
  function createRewardedVideoAd(options: {
    adUnitId: string;
  }): QQRewardedVideoAdInstance;
  function createBannerAd(options: {
    adUnitId: string;
    style: {
      top?: number;
      left?: number;
      width?: number;
    };
  }): QQBannerAdInstance;

  function createAppBox(options: { adUnitId: string }): QQAppBoxAdInstance;
}

// Tipagens básicas para Ads
interface QQInterstitialAdInstance {
  load(): Promise<void>;
  show(): Promise<void>;
  onLoad(callback: () => void): void;
  onError(callback: (err: any) => void): void;
  onClose(callback: (res: { isEnded: boolean }) => void): void;
}

type QQRewardedVideoAdInstance = QQInterstitialAdInstance;

interface QQBannerAdInstance {
  show(): Promise<void>;
  hide(): void;
  destroy(): void;
  onLoad(callback: () => void): void;
  onError(callback: (err: any) => void): void;
}

interface QQAppBoxAdInstance {
  load(): Promise<void>;
  show(): Promise<void>;
  onClose(callback: () => void): void;
}
