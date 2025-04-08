// @ts-nocheck
import StringHelper from "../../../core/utils/StringHelper";
import { HeroLoadDataFactory } from "../utils/HeroLoadDataFactory";

/**
 * @author jeremy.xu
 * @data: 2020-11-20 18:00
 * @description 角色动画资源数据对象(战斗角色)
 */
export class GameLoadNeedData {
    public key: string;
    public name: string;
    public grade: number;
    public param1: any;
    public param2: any;
    public isBody: boolean;
    // 资源全路径 包括后缀名 eg:"res/animation/equip/hunter_default_body/0/1.json"
    private _urlPath: string;
    // 角色形象前缀路径  eg: aniCacheName = preUrl + levelFlag +"_"+ ActionLabesType.STAND  
    private _preUrl: string;
    // 帧图片名称的前缀用来区分动画  战斗角色中 levelFlag=level  eg: "level3_Walk_021.png",  levelFlag="level3"
    public levelFlag: string = "";
    // 战斗角色动画中的层级: 1 2 3 4
    public level: number = 0;
    public sPart: string = "";

    constructor(urlPath: string = "", preUrl: string = "", levelFlag: string = "", level: number = 0, part: string = "",) {
        this._urlPath = urlPath;
        this._preUrl = preUrl;
        this.levelFlag = levelFlag;
        this.level = level;
        this.sPart = part;
        this.key = urlPath + part + levelFlag;
        if (part.indexOf(HeroLoadDataFactory.PART_BODY) != -1) {
            this.isBody = true
        }
    }

    public set urlPath(value: string) {
        this._urlPath = value
    }

    public get urlPath(): string {
        return this._urlPath;
    }

    public set preUrl(value: string) {
        this._preUrl = value;
    }

    public get preUrl(): string {
        return this._preUrl;
    }

    /**
     * 获得缓存名称
     * @param name
     */
    getCacheName(name: string = ""): string {
        if (StringHelper.isNullOrEmpty(this.levelFlag)) {
            return this.preUrl + name
        }
        else {
            return this.preUrl + this.levelFlag + "_" + name
        }
    }
}