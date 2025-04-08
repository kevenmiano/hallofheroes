import ByteArray from "../../core/net/ByteArray";
import LoaderInfo from "../datas/LoaderInfo";

/**
* @author:pzlricky
* @data: 2020-11-26 11:22
* @description *** 
*/
export default class DisplayLoader {

    private static _isDebug: boolean = false;
    public static Context: any;

    private static _tempContext: any;
    private static _tempContainer: Laya.Sprite;

    /**
     * 决定是取本地文件还是取服务器文件
     */
    public static get isDebug(): boolean {
        return DisplayLoader._isDebug;
    }

    /**
     * @private
     */
    public static set isDebug(value: boolean) {
        DisplayLoader._isDebug = value;
    }

    public static get tempContext(): any {
        if (!DisplayLoader._tempContext) {
            // DisplayLoader._tempContext = new LoaderContext(false, new ApplicationDomain(ApplicationDomain.currentDomain));
            if (DisplayLoader.isDebug)
                DisplayLoader._tempContext.allowCodeImport = true;
            DisplayLoader._tempContainer = new Laya.Sprite();
            DisplayLoader._tempContext.requestedContentParent = DisplayLoader._tempContainer;
            DisplayLoader._tempContext.allowCodeImport = true;
        }
        return DisplayLoader._tempContext;
    }

    protected _displayLoader: any;

    protected _info: LoaderInfo;
    public get info(): LoaderInfo {
        return this._info;
    }
    public DisplayLoader() {
        // this._displayLoader = new Loader();
        // this._displayLoader.contentLoaderInfo.addEventListener(Event.COMPLETE, this.__onContentLoadComplete);
        // this._displayLoader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR, this.__ioErrorHandler);
    }

    public loadFromBytes(data: ByteArray, $info: LoaderInfo) {
        this._info = $info;
        data.position = 0;
        this._displayLoader.loadBytes(data, DisplayLoader.tempContext);
    }

    private __ioErrorHandler(evt: Event) {
        // dispatchEvent(new LoaderEventII(LoaderEventII.COMPLETE, this.info, null));
    }

    protected __onContentLoadComplete(event: Event) {
        // dispatchEvent(new LoaderEventII(LoaderEventII.COMPLETE, this.info, this._displayLoader.content));
    }

    public get content(): any {
        if (this._displayLoader.content instanceof Laya.MovieClip) {
            this._displayLoader.content["biaoji"] = this.info.url;
            return this._displayLoader.content;
        }
        else if (this._displayLoader.content instanceof Laya.Bitmap) {
            return (this._displayLoader.content as Laya.Bitmap);
        }
    }

    public dispose() {
        if (this._displayLoader && this._displayLoader.contentLoaderInfo) {
            // this._displayLoader.contentLoaderInfo.removeEventListener(Event.COMPLETE, this.__onContentLoadComplete);
            // this._displayLoader.contentLoaderInfo.removeEventListener(IOErrorEvent.IO_ERROR, this.__ioErrorHandler);
        }
        //			_displayLoader.unloadAndStop(false);
        this._displayLoader = null;
        this._info = null;
    }

}