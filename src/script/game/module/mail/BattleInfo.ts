// @ts-nocheck
import { TempleteManager } from "../../manager/TempleteManager";
import { t_s_mapData } from '../../config/t_s_map';

/**
* @author:pzlricky
* @data: 2021-04-13 16:20
* @description *** 
*/
export default class BattleInfo {

    public type: number;
    public content: string;
    public camp: number;
    public result: number;//1自己赢
    private _time: string;
    public playerName: string;
    public siteName: string;
    public pos: string;
    public mapId: number;
    public selfHeroId: number;
    public selfSite1Name: string;
    public selfSite1Count: number;
    public selfSite2Name: string;
    public selfSite2Count: number;
    public selfStrengry: number;
    public selfGold: number;
    public selfFight: string;
    public selfGrade: number;
    public selfCrystal: number;
    public enemyHeroId: number;
    public enemySite1Name: string;
    public enemySite1Count: number;
    public enemySite2Name: string;
    public enemySite2Count: number;
    public enemyStrengry: number;
    public enemyGold: number;
    public enemyFight: string;
    public enemyGrade: number;
    public enemyCrystal: number;

    public static ATTACKED: number = 1;//遭到你的讨伐

    public get time(): string {
        return this._time;
    }

    public set time(value: string) {
        this._time = value;
    }

    public get mapName(): string {
        let mTemp: t_s_mapData = TempleteManager.Instance.getMapTemplateDataByID(this.mapId);
        return mTemp ? mTemp.MapNameLang : "";
    }

}