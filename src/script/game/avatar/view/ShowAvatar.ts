// @ts-nocheck
import Dictionary from "../../../core/utils/Dictionary";
import StringHelper from "../../../core/utils/StringHelper";
import { Disposeable } from "../../component/DisplayObject";
import { JobType } from "../../constant/JobType";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { PathManager } from "../../manager/PathManager";
import { ShowAvatarLoader } from "../load/ShowAvatarLoader";
import { ShowWeaponAvatar } from "./ShowWeaponAvatar";
import { GameLoadNeedData } from "../../battle/data/GameLoadNeedData";
import Logger from '../../../core/logger/Logger';
import { ActionLabesType, HeroMovieClipRefType } from "../../constant/BattleDefine";
import { HeroLoadDataFactory } from '../../battle/utils/HeroLoadDataFactory';
import { HeroMovieClipRef } from "./HeroMovieClipRef";


export class ShowAvatarPositon {
    public static FRONT_HAIR: string = "army";
    public static FRONT_CLOAK: string = "body";
    public static BODY: string = "hairup";
    public static ARMS: string = "hairdown";
    public static BACK_CLOAK: string = "cloak";
    public static BACK_HAIR: string = "mount";
    public static WING: string = "wing";
    public static PET: string = "pet";
}

/**
 * 角色模型展示（UI）  使用资源animation/equip_show
 */
export class ShowAvatar extends Laya.Sprite implements Disposeable {
    public static PetX: number = 40;
    public static PetY: number = 120;
    public petHeadY: number = 60;

    private _frontHair: ShowAvatarLoader;//前面头发
    private _frontCloak: ShowAvatarLoader;//前面披风
    private _body: ShowAvatarLoader;//身体
    private _arms: ShowAvatarLoader;//武器
    private _backCloak: ShowAvatarLoader;//后面披风
    private _backHair: ShowAvatarLoader;//后面头发
    private _wing: ShowAvatarLoader;//翅膀
    private _pet: HeroMovieClipRef;//宠物

    private _frontHairPath: string;//前面头发路径
    private _frontCloakPath: string;//前面披风路径
    private _bodyPath: string;//身体路径
    private _armysPath: string;//武器路径
    private _backHairPath: string;//后面披风路径
    private _backCloakPath: string;//后面头发路径
    private _wingPath: string;//翅膀路径
    private _petPath: string;//宠物路径

    private _data: ThaneInfo;
    private _bodyLoadComplete: Function;
    private _defaultDic: Dictionary;
    private _showPet: boolean = false;
    public set showPet(value: boolean) {
        this._showPet = value;
    }
    public get showPet(): boolean {
        return this._showPet;
    }

    constructor(showEffect: boolean = false, callBack: Function = null, showPet: boolean = false) {
        super()
        this._showPet = showPet;
        this._bodyLoadComplete = callBack;
        this.initView();
    }

    private initView() {
        this._frontHair = new ShowAvatarLoader(this.loadComplete.bind(this));
        this._frontCloak = new ShowAvatarLoader(this.loadComplete.bind(this));
        this._body = new ShowAvatarLoader(this.bodyloadComplete.bind(this));
        this._arms = new ShowWeaponAvatar(this.loadComplete.bind(this));
        this._backCloak = new ShowAvatarLoader(this.loadComplete.bind(this));
        this._backHair = new ShowAvatarLoader(this.loadComplete.bind(this));
        this._wing = new ShowAvatarLoader(this.loadComplete.bind(this));
        if (this._showPet) {
            this._pet = new HeroMovieClipRef(HeroMovieClipRefType.UI_PANEL);
            this._pet.completeFunc = this.loadPetComplete.bind(this);
        }

        this._defaultDic = new Dictionary();
        this._defaultDic[JobType.HUNTER] = "equip_show/hunter_default";
        this._defaultDic[JobType.WIZARD] = "equip_show/wizard_default";
        this._defaultDic[JobType.WARRIOR] = "equip_show/warrior_default";
    }

    private initDefPath() {
        if (!this._data) {
            return;
        }

        this._frontHairPath = this.getDefaultPathByString("_hair/front/");
        this._frontCloakPath = this.getDefaultPathByString("_body_cloak/front/");
        this._bodyPath = this.getDefaultPathByString("_body/");
        this._armysPath = this.getDefaultPathByString("_arms/");
        this._backHairPath = this.getDefaultPathByString("_hair/back/");
        this._backCloakPath = this.getDefaultPathByString("_body_cloak/back/");
        this._wingPath = "";
        this._petPath = "";

        if ((this._data.templateId % 3) == 2) {
            this.addChild(this._backHair);
            this.addChild(this._wing);
            this.addChild(this._backCloak);
            this.addChild(this._body);
            this.addChild(this._arms);
            this.addChild(this._frontCloak);
            this.addChild(this._frontHair);
            if (this._showPet && this._pet) {
                this.addChild(this._pet);
            }
        }
        else {
            this.addChild(this._backHair);
            this.addChild(this._wing);
            this.addChild(this._backCloak);
            this.addChild(this._arms);
            this.addChild(this._body);
            this.addChild(this._frontCloak);
            this.addChild(this._frontHair);
            if (this._showPet && this._pet) {
                this.addChild(this._pet);
            }
        }
    }

    private initPath() {
        this._frontCloakPath = StringHelper.isNullOrEmpty(this._data.bodyAvata) ? this._frontCloakPath : this.getPathByStr(this._data.bodyAvata + "_cloak/front/");
        this._backHairPath = StringHelper.isNullOrEmpty(this._data.hairAvata) ? this._backHairPath : this.getPathByStr(this._data.hairAvata + "/back/");
        this._backCloakPath = StringHelper.isNullOrEmpty(this._data.bodyAvata) ? this._backCloakPath : this.getPathByStr(this._data.bodyAvata + "_cloak/back/");
        this._wingPath = StringHelper.isNullOrEmpty(this._data.wingAvata) ? this._wingPath : this.getWingPath(this._data.wingAvata + "/");
        if (!this._data.hideFashion && this._data.hairFashionAvata != "" && this._data.hairFashionAvata != null) {
            this._frontHairPath = StringHelper.isNullOrEmpty(this._data.hairAvata) ? this._frontHairPath : this.getWingPath(this._data.hairAvata + "/front/");
        }
        else {
            this._frontHairPath = StringHelper.isNullOrEmpty(this._data.hairEquipAvata) ? this._frontHairPath : this.getPathByStr(this._data.hairEquipAvata + "/front/");
        }
        if (!this._data.hideFashion && this._data.bodyFashionAvata != "" && this._data.bodyFashionAvata != null) {
            this._bodyPath = StringHelper.isNullOrEmpty(this._data.bodyAvata) ? this._bodyPath : this.getWingPath(this._data.bodyAvata + "/");
        }
        else {
            this._bodyPath = StringHelper.isNullOrEmpty(this._data.bodyEquipAvata) ? this._bodyPath : this.getPathByStr(this._data.bodyEquipAvata + "/");
        }
        if (!this._data.hideFashion && this._data.armsFashionAvata != "" && this._data.armsFashionAvata != null) {
            this._armysPath = StringHelper.isNullOrEmpty(this._data.armsAvata) ? this._armysPath : this.getWingPath(this._data.armsAvata + "/");
        }
        else {
            this._armysPath = StringHelper.isNullOrEmpty(this._data.armsEquipAvata) ? this._armysPath : this.getPathByStr(this._data.armsEquipAvata + "/");
        }
        if (this._data.petTemplate) {
            this._petPath = PathManager.solveHeroAvatarPath(this._data.petTemplate.PetAvatar + "_follow", 2);
        }
        else {
            this._petPath = "";
        }
    }

    public get data(): ThaneInfo {
        return this._data;
    }

    public set data(value: ThaneInfo) {
        this.visible = Boolean(value);
        this.active = Boolean(value);
        if (!value) { return };

        // this._arms.first = !this._data;
        this._data = value;
        this.initDefPath();

        // Logger.info("[ShowAvatar]initDefPath", value.nickName, this._frontHairPath, this._frontCloakPath, this._bodyPath, this._armysPath,
        // this._backHairPath, this._backCloakPath, this._wingPath)
        this.initPath();

        // Logger.info("[ShowAvatar]initPath", value.nickName, this._frontHairPath, this._frontCloakPath, this._bodyPath, this._armysPath,
        //     this._backHairPath, this._backCloakPath, this._wingPath)

        if (this._frontHair.fullUrl != this._frontHairPath) {
            this._frontHair.data = new GameLoadNeedData(this._frontHairPath, undefined, undefined, undefined, ShowAvatarPositon.FRONT_HAIR);
        }
        if (this._body.fullUrl != this._bodyPath) {
            this._body.data = new GameLoadNeedData(this._bodyPath, undefined, undefined, undefined, ShowAvatarPositon.BODY);
        }
        if (this._arms.fullUrl != this._armysPath) {
            this._arms.data = new GameLoadNeedData(this._armysPath, undefined, undefined, undefined, ShowAvatarPositon.ARMS);
        }
        if (this._backHair.fullUrl != this._backHairPath) {
            this._backHair.data = new GameLoadNeedData(this._backHairPath, undefined, undefined, undefined, ShowAvatarPositon.BACK_HAIR);
        }

        //翅膀披风只能出现一个
        if (this._wingPath) {
            this._frontCloak.data = new GameLoadNeedData("");
            this._backCloak.data = new GameLoadNeedData("");
            if (this._wing.fullUrl != this._wingPath) {
                this._wing.data = new GameLoadNeedData(this._wingPath, undefined, undefined, undefined, ShowAvatarPositon.WING);
            }
        } else {
            this._wing.data = new GameLoadNeedData("");
            if (this._frontCloak.fullUrl != this._frontCloakPath) {
                this._frontCloak.data = new GameLoadNeedData(this._frontCloakPath, undefined, undefined, undefined, ShowAvatarPositon.FRONT_CLOAK);
            }
            if (this._backCloak.fullUrl != this._backCloakPath) {
                this._backCloak.data = new GameLoadNeedData(this._backCloakPath, undefined, undefined, undefined, ShowAvatarPositon.BACK_CLOAK);
            }
        }


        if (this._pet) {
            if (this._showPet) {
                this._pet.updateParts([new GameLoadNeedData(this._petPath, undefined, HeroLoadDataFactory.LEVEL, undefined, ShowAvatarPositon.PET)]);
            } else {
                this._pet.clearParts();
            }
        }
    }

    private loadPetComplete(data: GameLoadNeedData) {
        this._pet.gotoAndPlay(1, true, ActionLabesType.STAND);

        this._pet.x = ShowAvatar.PetX;
        this._pet.y = ShowAvatar.PetY;
        if (this._pet.pos_head && this._pet.pos_leg) {
            this.petHeadY = this._pet.pos_head.y - this._pet.pos_leg.y
        }
        this.bodyloadComplete();
    }

    private loadComplete(data: GameLoadNeedData) {
        Logger.xjy("[ShowAvatar]loadComplete", data.urlPath)

        this._backHair.gotoAndPlay();
        this._backCloak.gotoAndPlay();
        this._arms.gotoAndPlay();
        this._body.gotoAndPlay();
        this._frontCloak.gotoAndPlay();
        this._frontHair.gotoAndPlay();
        this._wing.gotoAndPlay();
    }

    private bodyloadComplete() {
        if (this._bodyLoadComplete != null) {
            this._bodyLoadComplete();
        }
        this.loadComplete(this.body.data);
    }

    public get body(): ShowAvatarLoader {
        return this._body;
    }

    public get petAvatar(): HeroMovieClipRef {
        return this._pet;
    }

    private getDefaultPathByString(str: string): string {
        return PathManager.resourcePath + this._defaultDic[this._data.templateInfo.Job] + str + this._data.templateInfo.Sexs + "/" + this._data.templateInfo.Sexs + ".json"
    }

    private getPathByStr(str: string): string {
        return PathManager.resourcePath + "equip_show" + str + this._data.templateInfo.Sexs + "/" + this._data.templateInfo.Sexs + ".json";
    }

    private getWingPath(str: string): string {
        return PathManager.resourcePath + "equip_show" + str + this._data.templateInfo.Job + "_" + this._data.templateInfo.Sexs + "/" + this._data.templateInfo.Job + "_" + this._data.templateInfo.Sexs + ".json";
    }

    public dispose() {
        if (this._frontHair) {
            this._frontHair.dispose();
        }
        this._frontHair = null;
        if (this._frontCloak) {
            this._frontCloak.dispose();
        }
        this._frontCloak = null;
        if (this._body) {
            this._body.dispose();
        }
        this._body = null;
        if (this._arms) {
            this._arms.dispose();
        }
        this._arms = null;
        if (this._backCloak) {
            this._backCloak.dispose();
        }
        this._backCloak = null;
        if (this._backHair) {
            this._backHair.dispose();
        }
        this._backHair = null;
        if (this._wing) {
            this._wing.dispose();
        }
        this._wing = null;
        if (this._pet) {
            this._pet.dispose();
        }
        this._pet = null;

        // Logger.xjy(">>>onPartComplete framesMap dispose", Laya.Animation.framesMap)
        // Logger.xjy(">>>onPartComplete atlasMap dispose", Laya.Loader.atlasMap)
        // Logger.xjy(">>>onPartComplete textureMap dispose", Laya.Loader.textureMap)

        this._bodyLoadComplete = null;
    }
}