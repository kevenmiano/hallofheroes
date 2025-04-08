// @ts-nocheck
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { ConfigType } from "../../constant/ConfigDefine";
import { t_s_runetemplateData } from "../../config/t_s_runetemplate";
import { RuneInfo } from "../RuneInfo";
import { TempleteManager } from "../../manager/TempleteManager";
import ComponentSetting from "../../utils/ComponentSetting";
import { GoodsManager } from "../../manager/GoodsManager";
import GoodsSonType from "../../constant/GoodsSonType";
import { GoodsInfo } from "../goods/GoodsInfo";
import { ArmyManager } from "../../manager/ArmyManager";

export class RuneCategory {
    private _job: number = 0;
    public runeScript: string = "-1,-1,-1";
    public allRuneList: SimpleDictionary;
    public studiedRuneList: SimpleDictionary;

    constructor() {
        this.allRuneList = new SimpleDictionary();
        this.studiedRuneList = new SimpleDictionary();
    }

    /**
     * 根据职业初始化该职业的所有符文模板
     * @param job
     *
     */
    public initAllRune(job: number) {
        this._job = job;
        let dic = TempleteManager.Instance.getMinRuneTemplateInfoByJob(this._job);
        let runeInfo: RuneInfo = null;
        for (let info of dic) {        
            if (!info.TemplateId)
                continue;
            runeInfo = this.existRune(info);
            if (!runeInfo) {
                runeInfo = new RuneInfo();
                runeInfo.runeId = info.TemplateId;
                runeInfo.grade = 0;
            }
            if (runeInfo.runeId)
                this.allRuneList.add(runeInfo.templateInfo.RuneIndex, runeInfo);
        }
    }

    public existRune(info: t_s_runetemplateData): RuneInfo {
        return this.studiedRuneList[info.RuneType];
    }

    public getInfoByIndex(index: number): RuneInfo {
        for (const key in this.allRuneList) {
            let info: RuneInfo = this.allRuneList[key];
            if (info && info.templateInfo && info.templateInfo.RuneIndex == index) {
                return info;
            }
        }
        return null;
    }

    /**
     * 根据符文类型取得符文信息
     * @param runeType
     * @return
     *
     */
    public getRuneInfoByRuneType(runeType: number): RuneInfo {
        for (const key in this.allRuneList) {
            let info: RuneInfo = this.allRuneList[key];
            if (info && info.templateInfo && runeType == info.templateInfo.RuneType) {
                return info;
            }
        }
        return null;
    }

    public getMaxGradeRuneInfo(): RuneInfo {
        var max: number = -1;
        var maxInfo: RuneInfo;

        for (const key in this.allRuneList) {
            let info: RuneInfo = this.allRuneList[key];
            if (info && info.grade > max) {
                maxInfo = info;
                max = info.grade;
            }
        }
        return maxInfo;
    }

    /**
     * 取得当前已经学习符文的数量
     *
     */
    public getCurrentStudyCount(): number {
        var count: number = 0;
        for (const key in this.allRuneList) {
            let info: RuneInfo = this.allRuneList[key];
            if (info && info.grade >= 1) {
                count++;
            }
        }
        return count;
    }

    public getStudiedRuneByRuneType(runeType: number): RuneInfo {
        return this.studiedRuneList[runeType];
    }

    public hasCarryed(runeType: number): boolean {
        let strlist: string[] = this.runeScript.split(",");
        for (const key in strlist) {
            let id: string = strlist[key];
            var temp: t_s_runetemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_runetemplate, id);
            if (temp && temp.RuneType == runeType) {
                return true;
            }
        }
        return false;
    }

    public get runeScriptLength(): number {
        var count: number = 0;
        let strlist: string[] = this.runeScript.split(",");
        for (const key in strlist) {
            let id: string = strlist[key];
            if (~~id > 0) {
                count++;
            }
        }
        return count;
    }

    hasActiveRune():boolean{
        var runeList: Array<RuneInfo> = this.allRuneList.getList();
        for (let key in runeList) {
            if (Object.prototype.hasOwnProperty.call(runeList, key)) {
                let info: RuneInfo = runeList[key];
                if(this.canStudy(info)){
                    if(info.grade < 1){
                        return true;
                    }
                }
            }   
        }
        return false;
    }

    private  checkCanAdd(info): boolean {
        if(!info.nextTemplateInfo) return false;
        if (ArmyManager.Instance.thane.grades >= info.nextTemplateInfo.NeedGrade) {
            return true;
        }
        return false;
    }

    private  canStudy(info:RuneInfo): boolean {
        var arr: Array<any> = GoodsManager.Instance.getGeneralBagGoodsBySonType(GoodsSonType.SONTYPE_PASSIVE_SKILL);
        var gInfo: GoodsInfo;
        let _runeGInfo = null;
        for (var i: number = 0; i < arr.length; i++) {
            gInfo = arr[i] as GoodsInfo;
            if (gInfo.templateInfo.Property1 == info.templateInfo.RuneType) {
                if (gInfo.isBinds) {
                    _runeGInfo = gInfo;
                    return true;
                } else if (!_runeGInfo) {
                    _runeGInfo = gInfo;
                }
            }
        }
        if (_runeGInfo) {
            return true;
        }
        return false;
    }


    clear() {
        this.studiedRuneList && this.studiedRuneList.clear();
    }



}