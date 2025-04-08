// @ts-nocheck
import LangManager from '../../core/lang/LangManager';
/**
* @author:pzlricky
* @data: 2020-12-29 10:59
* @description *** 
*/
export default class SexType {

    public static getSexDescript(sex: number): string {
        switch (sex) {
            case 0:
                return LangManager.Instance.GetTranslation("sns.SNSModel.sex02");
                break;
            case 1:
                return LangManager.Instance.GetTranslation("sns.SNSModel.sex01");
                break;
            case 2:
                return LangManager.Instance.GetTranslation("yishi.datas.consant.JobType.Name01");
                break;
        }
        return LangManager.Instance.GetTranslation("yishi.datas.goods.GoodsProfile.profile01");
    }

} 