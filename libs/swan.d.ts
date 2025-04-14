declare const swan: {
  [x: string]: any;
  onShow: (callback: () => void) => void;
  onHide: (callback: () => void) => void;
  vibrateShort: () => void;
  showToast: (options: { title: string }) => void;
  previewImage: (options: { current: string; urls: string[] }) => void;
  navigateToMiniProgram: (options: {
    appKey: string;
    success?: () => void;
    fail?: () => void;
  }) => void;
  createRewardedVideoAd?: (options?: any) => any;
};
