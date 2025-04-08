// @ts-nocheck
import GameEventDispatcher from '../../../core/event/GameEventDispatcher';
import { SimpleDictionary } from '../../../core/utils/SimpleDictionary';
import { AppellEvent } from '../../constant/event/NotificationEvent';
import { t_s_appellData } from '../../config/t_s_appell';
import { TempleteManager } from '../../manager/TempleteManager';
import { ThaneInfo } from '../../datas/playerinfo/ThaneInfo';
import { ArmyManager } from '../../manager/ArmyManager';
import LangManager from '../../../core/lang/LangManager';
import ConfigMgr from '../../../core/config/ConfigMgr';
import { ConfigType } from '../../constant/ConfigDefine';
import Utils from '../../../core/utils/Utils';

export class AppellPowerInfo {
    public static ATTR_NUM = 14;
    public Power: number = 0;
    public Agility: number = 0;
    public Intellect: number = 0;
    public Physique: number = 0;
    public Captain: number = 0;
    public Attack: number = 0;
    public Defence: number = 0;
    public MagicAttack: number = 0;
    public MagicDefence: number = 0;
    public ForceHit: number = 0;
    public Penetrate: number = 0;
    public Parry: number = 0;
    public Live: number = 0;
    public Conat: number = 0;
    public PowerName: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01");
    public AgilityName: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02");
    public IntellectName: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03");
    public PhysiqueName: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04");
    public CaptainName: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip05");
    public AttackName: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip06");
    public DefenceName: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip07");
    public MagicAttackName: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip08");
    public MagicDefenceName: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip09");
    public ForceHitName: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip10");
    public PenetrateName: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip011"); // 穿透
    public ParryName: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip19");  //格挡
    public LiveName: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip11");   //生命
    public ConatName: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip17");  // 带兵
}


export default class AppellModel extends GameEventDispatcher {

    public static TYPE_GET: number = 0;
    public static TYPE_SELF: number = 1;
    public static TYPE_PVP: number = 2;
    public static TYPE_PVE: number = 3;
    public static TYPE_OTHER: number = 4;

    public static Colors = {
        [1]: ["#fdff56", "#ff7d03"],
        [2]: ["#ff9cf9", "#ce06ff"],
        [3]: ["#f8f8f8", "#717171"],
        [4]: ["#ffffff", "#ff3ba5"],
        [5]: ["#99ffff", "#0099ff"],
        [6]: ["#d9ffd1", "#0c8609"],
        [7]: ["#fdacac", "#b30f0f"],
        [8]: ["#ffffff", "#dfb595"],
        [9]: ["#f6f7ff", "#a2a6c0"],
        [10]: ["#fbf570", "#deac2e"],
        [11]: ["#fee6e3", "#fee6e3"],
        [12]: ["#fdff6c", "#e20000"],
        [13]: ["#fffc00", "#ff5a00"],
        [14]: ["#ffffff", "#ffffff"],
        [15]: ["#ffffff", "#fffc00"]
    }

    private _currentPage: number = 0;
    public get currentPage(): number {
        return this._currentPage;
    }

    public set currentPage(value: number) {
        this._currentPage = value;
    }

    private _infos: SimpleDictionary;
    public get infos(): SimpleDictionary {
        return this._infos;
    }

    public set infos(value: SimpleDictionary) {
        this._infos = value;
    }

    private _appells: SimpleDictionary;
    public get appells(): SimpleDictionary {
        return this._appells;
    }

    public set appells(value: SimpleDictionary) {
        this._appells = value;
        this.dispatchEvent(AppellEvent.APPELL_DATA_UPDATA);
    }

    private sortFun(item1: t_s_appellData, item2: t_s_appellData): number {
        if (item1.isGet && !item2.isGet) {
            return -1;
        } else if (!item1.isGet && item2.isGet) {
            return 1;
        } else {
            if (item1.TemplateId < item2.TemplateId) {
                return -1;
            }
            else if (item1.TemplateId > item2.TemplateId) {
                return 1;
            }
            else {
                return 0;
            }
        }
    }

    public getListByType(type: number = AppellModel.TYPE_GET): t_s_appellData[] {
        var list: t_s_appellData[] = [];
        for (const key in this.appells) {
            if (Object.prototype.hasOwnProperty.call(this.appells, key)) {
                var item: t_s_appellData = this.appells[key];
                if (type != AppellModel.TYPE_GET && type != item.Type) {
                    continue;
                }
                let hasAppells = this._appells.get(item.TemplateId);
                let isActive: boolean = false;
                if (hasAppells) {
                    isActive = item.Activation == 1 ? hasAppells.isGet : true;
                }
                if (isActive)
                    list.push(item);
            }
        }
        list.sort(this.sortFun);
        return list;
    }

    public getAcquiredList(): Array<t_s_appellData> {
        var list: Array<t_s_appellData> = [];
        for (const key in this.appells) {
            if (Object.prototype.hasOwnProperty.call(this.appells, key)) {
                var item: t_s_appellData = this.appells[key];
                if (item.isGet != true) {
                    continue;
                }
                let hasAppells = this._appells.get(item.TemplateId);
                let isActive: boolean = false;
                if (hasAppells) {
                    isActive = item.Activation == 1 ? hasAppells.isGet : true;
                }
                if (isActive)
                    list.push(item);
            }
        }
        list.sort(this.sortFun);
        return list;
    }

    /**是否添加QQ大厅称号 */
    public isQQHallAppell(templetelID: number): boolean {
        if (templetelID >= 128 && templetelID <= 131) {
            return true;
        }
        return false;
    }

    public getCurrentList(): Array<t_s_appellData> {
        if (this.currentPage == AppellModel.TYPE_GET) {
            return this.getAcquiredList();
        } else {
            return this.getListByType(this.currentPage);
        }
    }

    public getAppellInfo(appellId: number): t_s_appellData {
        if (appellId != 0) {
            return TempleteManager.Instance.getAppellInfoTemplateByID(appellId);
        }
        return new t_s_appellData(null);
    }

    public needShowProgress(condtionType: number): boolean {
        switch (condtionType) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 10:
            case 100:
                return true;
                break;
            default:
                return false;
                break;
        }
    }

    public getPerfixStyle(appellId: number): number {
        switch (appellId) {
            case 1:
                return 1;
                break;
            case 25:
                return 2;
                break;
            case 35:
                return 3;
                break;
            case 37:
                return 4;
                break;
            case 40:
                return 5;
                break;
            case 41:
                return 6;
                break;
            case 42:
                return 7;
                break;
            case 46:
                return 8;
                break;
            case 47:
                return 9;
                break;
            default:
                return 9;
                break;
        }
    }

    public getAppellPowerInfo(list: t_s_appellData[] = null): AppellPowerInfo {
        let info = new AppellPowerInfo();
        if (!list) {
            list = this.getAcquiredList() as t_s_appellData[]
        }
        list.forEach((ele: t_s_appellData) => {
            for (let index = 0; index < ele.Skills.length; index++) {
                const id = ele.Skills[index];
                let skillPropTmp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skillpropertytemplate, id);
                if (skillPropTmp) {
                    if (skillPropTmp.Power > 0) {
                        info.Power += skillPropTmp.Power;
                    }
                    if (skillPropTmp.Agility > 0) {
                        info.Agility += skillPropTmp.Agility;
                    }
                    if (skillPropTmp.Intellect > 0) {
                        info.Intellect += skillPropTmp.Intellect;
                    }
                    if (skillPropTmp.Physique > 0) {
                        info.Physique += skillPropTmp.Physique;
                    }
                    if (skillPropTmp.Captain > 0) {
                        info.Captain += skillPropTmp.Captain;
                    }
                    if (skillPropTmp.Attack > 0) {
                        info.Attack += skillPropTmp.Attack;
                    }
                    if (skillPropTmp.Defence > 0) {
                        info.Defence += skillPropTmp.Defence;
                    }
                    if (skillPropTmp.MagicAttack > 0) {
                        info.MagicAttack += skillPropTmp.MagicAttack;
                    }
                    if (skillPropTmp.MagicDefence > 0) {
                        info.MagicDefence += skillPropTmp.MagicDefence;
                    }
                    if (skillPropTmp.ForceHit > 0) {
                        info.ForceHit += skillPropTmp.ForceHit;
                    }
                    if (skillPropTmp.Penetrate > 0) {
                        info.Penetrate += skillPropTmp.Penetrate;
                    }
                    if (skillPropTmp.Conat > 0) {
                        info.Parry += skillPropTmp.Parry;
                    }
                    if (skillPropTmp.Live > 0) {
                        info.Live += skillPropTmp.Live;
                    }
                    if (skillPropTmp.Conat > 0) {
                        info.Conat += skillPropTmp.Conat;
                    }
                }
            }
        });
        return info
    }


    /***
    * A, B两种色做shader效果
    */
    public static getTextColorA(textColorIdx: number): string {
        let colorArr = AppellModel.Colors[textColorIdx]
        let color = "#ffffff"
        if (colorArr) {
            color = colorArr[0]
        }
        return color;
    }

    public static getTextColorB(textColorIdx: number): string {
        let colorArr = AppellModel.Colors[textColorIdx]
        let color = "#ffffff"
        if (colorArr) {
            color = colorArr[1]
        }
        return color;
    }

    /**
    * 设置文本color为 color1&color2 可直接纵向渐变
    */
    public static getTextColorAB(textColorIdx: number): string {
        let colorArr = AppellModel.Colors[textColorIdx]
        let color = "#ffffff"
        if (colorArr) {
            color = colorArr[0] + '&' + colorArr[1];
        }
        return color;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.army.baseHero;
    }

}