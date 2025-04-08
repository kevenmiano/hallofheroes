import LangManager from '../../../core/lang/LangManager';
import { FilterFrameText, eFilterFrameText } from '../../component/FilterFrameText';
/**
* @author:pzlricky
* @data: 2020-12-29 11:01
* @description *** 
*/
export default class GoodsProfile {
    // 白 绿 蓝 紫 橙 红
    static Level1 = 1;
    static Level2 = 2; 
    static Level3 = 3;
    static Level4 = 4;
    static Level5 = 5;
    static Level6 = 6;
    
    public static getGoodsProfileColor(profile: number): string {
        let color = FilterFrameText.Colors[eFilterFrameText.ItemQuality][profile - 1]
        if (!color) {
            return "#ffffff"
        }
        return color
    }
    public static getGoodsProfileLetter(profile: number): string {
        switch (profile) {
            case 1:
                return "D";
                break;
            case 2:
                return "C";
                break;
            case 3:
                return "B";
                break;
            case 4:
                return "A";
                break;
            case 5:
                return "S";
                break;
        }
        return LangManager.Instance.GetTranslation("yishi.datas.goods.GoodsProfile.profile01");
    }
    public static getGoodsProfileDescript(profile: number): string {
        //			粗糙、普通、优秀、精良、卓越
        switch (profile) {
            case 1:
                return LangManager.Instance.GetTranslation("yishi.datas.goods.GoodsProfile.profile02");
                break;
            case 2:
                return LangManager.Instance.GetTranslation("yishi.datas.goods.GoodsProfile.profile03");
                break;
            case 3:
                return LangManager.Instance.GetTranslation("yishi.datas.goods.GoodsProfile.profile04");
                break;
            case 4:
                return LangManager.Instance.GetTranslation("yishi.datas.goods.GoodsProfile.profile05");
                break;
            case 5:
                return LangManager.Instance.GetTranslation("yishi.datas.goods.GoodsProfile.profile06");
                break;
        }
        return LangManager.Instance.GetTranslation("yishi.datas.goods.GoodsProfile.profile01");
    }

}