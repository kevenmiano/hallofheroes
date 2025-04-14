declare namespace tt {
  //  createBannerAd?: (options: any) => any;
  // createRewardedVideoAd?: (options: any) => any;
  // createInterstitialAd?: (options: any) => any;
  // getGameRecorderManager?: () => any;
  // shareAppMessage?: (options?: any) => void;
  // vibrateShort: (options?: {
  //   success?: (res?: any) => void;
  //   fail?: (res?: any) => void;
  // }) => void;
  // showToast: (options: { title: string; icon?: string }) => void;
  // previewImage: (options: { current: string; urls: string[] }) => void;
  // getUpdateManager?: () => {
  //   onCheckForUpdate: (cb: (res: { hasUpdate: boolean }) => void) => void;
  //   onUpdateReady: (cb: () => void) => void;
  //   onUpdateFailed: (cb: () => void) => void;
  //   applyUpdate: () => void;
  // };
  // showModal: (options: {
  //   title: string;
  //   content: string;
  //   success?: (res: { confirm: boolean }) => void;
  // }) => void;

  export function checkSession(options: {
    success: (res: any) => void;
    fail: (res: any) => void;
  }): void;

  export function login(options: {
    force?: boolean;
    success: (res: { code: string; anonymousCode: string }) => void;
    fail: (res: any) => void;
  }): void;

  export function saveImageToPhotosAlbum(options: {
    filePath: string;
    success: (res: any) => void;
    fail: (res: any) => void;
  }): void;

  export function showShareMenu(options: {
    withShareTicket: boolean;
    success: (res: any) => void;
    fail: (res: any) => void;
  }): void;

  export function updateShareMenu(options: {
    withShareTicket: boolean;
    success: (res: any) => void;
    fail: (res: any) => void;
  }): void;

  export function getUserInfo(options: {
    withCredentials: string;
    lang: string;
    success: (res: { userInfo: any }) => void;
    fail: (res: any) => void;
  }): void;

  export function getSystemInfoSync(): {
    appName: string;
    screenWidth: number;
    screenHeight: number;
    windowWidth: number;
    windowHeight: number;
    safeArea: {
      left: number;
      right: number;
      top: number;
      bottom: number;
      width: number;
      height: number;
    };
  };

  export function createBannerAd(options: {
    adUnitId: string;
    style: {
      top?: number;
      left?: number;
      width?: number;
      height?: number;
    };
  }): BannerAd;

  export function createRewardedVideoAd(options: {
    adUnitId: string;
  }): RewardedVideoAd;

  interface RewardedVideoAd {
    show(): Promise<void>;
    onLoad(callback: () => void): void;
    onError(callback: (err: any) => void): void;
    onClose(callback: (res: { isEnded: boolean }) => void): void;
    load(): Promise<void>;
  }

  export function getGameRecorderManager(): {
    onStart(callback: () => void): void;
    onStop(callback: () => void): void;
    onError(callback: (err: any) => void): void;
    start(): void;
    stop(): void;
  };

  export function shareAppMessage(options?: {
    imageUrlId?: string;
    desc?: string;
    channel?: string;
    title?: string;
    imageUrl?: string;
    query?: string;
    extra?: {
      videoPath?: string;
    };

    success?: (res: any) => void;
    fail?: (err: any) => void;
  }): void;

  export function getShareInfo(options: {
    shareTicket: string;
    success: (res: any) => void;
    fail: (err: any) => void;
  }): void;

  export function createInterstitialAd(options: {
    adUnitId: string;
  }): InterstitialAd;

  export function vibrateShort(options?: {
    success?: (res?: any) => void;
    fail?: (res?: any) => void;
  }): void;

  export function showToast(options: {
    title: string;
    icon?: string;
    duration?: number;
  }): void;

  export function previewImage(options: {
    current: string;
    urls: string[];
  }): void;

  export function getUpdateManager(): {
    onCheckForUpdate(cb: (res: { hasUpdate: boolean }) => void): void;
    onUpdateReady(cb: () => void): void;
    onUpdateFailed(cb: () => void): void;
    applyUpdate(): void;
  };

  export function showModal(options: {
    title: string;
    content: string;
    success?: (res: { confirm: boolean }) => void;
  }): void;
}
