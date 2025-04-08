export class ResInfo {
    public url: string = "";
    public type: string = ""
    public isKeepMemory: boolean = false;
    public isFGUIPack = false
    public refCount: number = 0
    public group: string = ""
    public aniCacheName: string[] = []

    constructor(url?: string, type?: string, isKeepMemory?: boolean, isFGUIPack?: boolean, group?: string) {
        this.url = url
        this.type = type
        this.isKeepMemory = isKeepMemory
        this.isFGUIPack = isFGUIPack
        this.group = group
    }

    public reset() {
        this.url = "";
        this.type = ""
        this.isKeepMemory = false;
        this.isFGUIPack = false
        this.refCount = 0
        this.group = ""
        this.aniCacheName = []
    }

    public get fullUrl() {
        if (this.isFGUIPack) {
            return this.url.replace("." + fairygui.UIConfig.packageFileExtension, "")
        }
        return this.url
    }
}