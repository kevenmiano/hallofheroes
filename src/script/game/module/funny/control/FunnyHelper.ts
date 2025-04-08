// @ts-nocheck
import { TempleteManager } from '../../../manager/TempleteManager';
import { GoodsManager } from "../../../manager/GoodsManager";
import DayGuideCatecory from "../../welfare/data/DayGuideCatecory";
import DayGuideManager from "../../../manager/DayGuideManager";
import { BagType } from "../../../constant/BagDefine";

export default class FunnyHelper {

    public static getGoodsName(tid: number): string {
        return TempleteManager.Instance.getGoodsTemplatesByTempleteId(tid).TemplateNameLang;
    }

    public static getBagCount(tid: number): number {
        return GoodsManager.Instance.getBagCountByTempId(BagType.Player, tid);
    }

    public static get dayGuideCate(): DayGuideCatecory {
        return DayGuideManager.Instance.cate;
    }

}