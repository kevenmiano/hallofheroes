import FUI_BattleFallGoodsItem from '../../../../../../fui/Battle/FUI_BattleFallGoodsItem';
import ConfigMgr from '../../../../../core/config/ConfigMgr';
import { IconFactory } from '../../../../../core/utils/IconFactory';
import Utils from '../../../../../core/utils/Utils';
import { t_s_itemtemplateData } from '../../../../config/t_s_itemtemplate';
import { ConfigType } from '../../../../constant/ConfigDefine';
import { GoodsInfo } from '../../../../datas/goods/GoodsInfo';
/**
* @author:shujin.ou
* @email:1009865728@qq.com
* @data: 2021-04-06 18:20
*/
export default class BattleFallGoodsItem extends FUI_BattleFallGoodsItem {

    private goodsInfo: GoodsInfo;

    protected onConstruct() {
        Utils.setDrawCallOptimize(this);
    }

    public set vData(value: GoodsInfo) {
        if (!value) this.clear();
        if (this.goodsInfo == value) return;
        this.goodsInfo = value;
        this.refreshView();
    }

    public get vData(): GoodsInfo {
        return this.goodsInfo;
    }

    private refreshView() {
        var temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this.goodsInfo.templateId.toString());
        if (temp) {
            this.GoodsIcon.url = IconFactory.getGoodsIconByTID(temp.TemplateId);
            this.GoodsNumTxt.text = this.goodsInfo.count.toString();
            this.GoodsNameTxt.text = temp.TemplateNameLang;
        }
    }

    private clear() {
        this.GoodsIcon.url = "";
        this.GoodsNumTxt.text = "";
        this.GoodsNameTxt.text = "";
    }

}