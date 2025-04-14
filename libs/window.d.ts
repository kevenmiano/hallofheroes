export declare global {
  interface Window {
    showMemTool?: () => void;
    canvasTopX?: number;
    canvasTopY?: number;
    useAstc: boolean;
    loaderCompleteHandler: (result: any) => void;
    Logger: any;
    Wx7ktx: any;
    DESKEY: string;
    Road_7: any;
    loadLib(url: string, callback: () => void): void;
    sourceId: string;
    gtag: any;
  }
}
