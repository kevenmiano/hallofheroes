// @ts-nocheck
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import { KingContractInfo } from "./KingContractInfo";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { ConfigType } from "../../constant/ConfigDefine";
import { t_s_kingcontractData } from "../../config/t_s_kingcontract";

/**
 * 精灵盟约
 */
export class KingContractModel {
    public static SHOP_BUFF: number = 1; //随意购
    public static REWARD_BUFF: number = 2;  //悬赏助手
    public static TREAT_BUFF: number = 3;  //治疗之力
    public static TIME_BUFF: number = 4;  //时间之神
    public static MOPUP_BUFF: number = 5;  //扫荡免费
    public static SPECIAL_BUFF: number = 6; //专属Buff

    private _kingContractInfos: SimpleDictionary;
    /** 界面显示的顺序 */
    public static SORT_ARR: any[] = [KingContractModel.TREAT_BUFF, KingContractModel.MOPUP_BUFF, KingContractModel.REWARD_BUFF, KingContractModel.TIME_BUFF, KingContractModel.SPECIAL_BUFF, KingContractModel.SHOP_BUFF];

    constructor() {
        this._kingContractInfos = new SimpleDictionary();
        for (let key of KingContractModel.SORT_ARR) {
            this.getInfoById(key);
        }
    }

    public getInfoById(id: number = 0): KingContractInfo {
        if (!this._kingContractInfos[id]) {
            let info: KingContractInfo = new KingContractInfo();
            let temp: t_s_kingcontractData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_kingcontract, id.toString());
            if(temp) {
                info.templateId = temp.Id;
                info.template = temp;
                this._kingContractInfos.add(info.templateId, info);
            }
        }
        return this._kingContractInfos[id] as KingContractInfo
    }

    public get kingContractInfos(): SimpleDictionary {
        return this._kingContractInfos;
    }
}