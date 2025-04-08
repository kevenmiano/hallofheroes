// @ts-nocheck
import FUI_WarlordsCheckRewardItem from '../../../../../../fui/Warlords/FUI_WarlordsCheckRewardItem';
import { IconFactory } from '../../../../../core/utils/IconFactory';
import { t_s_mounttemplateData } from '../../../../config/t_s_mounttemplate';
import { TempleteManager } from '../../../../manager/TempleteManager';
import WarlordsRewardInfo from '../data/WarlordsRewardInfo';
import LangManager from '../../../../../core/lang/LangManager';
import { GoodsInfo } from '../../../../datas/goods/GoodsInfo';
import WarlordsModel from '../../WarlordsModel';
import WarlordsRewardItem from './WarlordsRewardItem';
import ObjectUtils from '../../../../../core/utils/ObjectUtils';
export default class WarlordsCheckRewardItem extends FUI_WarlordsCheckRewardItem {
    private _info: string;
    private _listData: Array<WarlordsRewardInfo>;
    private _index: number;
    private _selectedType: number = 0;//0选中战神之殿 1 选中勇者之殿
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }
    public set index(value: number) {
        this._index = value;
    }
    public set selectedType(value: number) {
        this._selectedType = value;
    }

    public set info(value: string) {
        this._info = value;
        if (this._info) {
            this.rewardList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
            this.updateView();
        }
        else {
            this.rankTxt.text = "";
        }
    }

    renderListItem(index: number, item: WarlordsRewardItem) {
        item.info = this._listData[index];
    }

    private updateView() {
        this.rankTxt.text = this._info;
        let num: number = Number(this._info.split("-")[0]);
        this._listData = [];
        let goodsInfo = new GoodsInfo();
        goodsInfo.templateId = -800;
        if (this._selectedType == 0) {//战神之殿
            if (num == 1 || num == 2 || num == 3) {
                let tempInfo: t_s_mounttemplateData = this.getWarlordMount(3002);
                var validityList: Array<number> = [20, 15, 10];
                tempInfo.validity = validityList[num - 1];
                let mountRewardInfo: WarlordsRewardInfo = new WarlordsRewardInfo();
                mountRewardInfo.picUrl = IconFactory.getCommonIconPath("/mount_lord.png")
                mountRewardInfo.tipData = tempInfo;
                mountRewardInfo.nameStr = LangManager.Instance.GetTranslation("warlords.WarlordsCheckRewardFrame.str05");
                mountRewardInfo.type = WarlordsModel.REWARD_TYPE_ONE;
                this._listData.push(mountRewardInfo);

                let goodsRewardInfo: WarlordsRewardInfo = new WarlordsRewardInfo();
                goodsRewardInfo.type = WarlordsModel.REWARD_TYPE_TWO;
                goodsRewardInfo.goodsInfo = goodsInfo;
                goodsRewardInfo.tipData = goodsInfo;
                goodsRewardInfo.nameStr = goodsInfo.templateInfo.TemplateNameLang + " x" + (5000 - 400 * (num - 1));
                this._listData.push(goodsRewardInfo);
                if (num == 1) {
                    let appellRewardInfo: WarlordsRewardInfo = new WarlordsRewardInfo();
                    appellRewardInfo.picUrl = IconFactory.getCommonIconPath("/lordappell.png");
                    appellRewardInfo.type = WarlordsModel.REWARD_TYPE_THREE;
                    appellRewardInfo.tipData = LangManager.Instance.GetTranslation("warlords.WarlordsCheckRewardFrame.str06");
                    appellRewardInfo.nameStr = LangManager.Instance.GetTranslation("warlords.WarlordsCheckRewardFrame.str06");
                    this._listData.push(appellRewardInfo);

                    let shenxiangInfo: WarlordsRewardInfo = new WarlordsRewardInfo();
                    shenxiangInfo.picUrl = IconFactory.getCommonIconPath("/warlordsavatar.png");
                    shenxiangInfo.type = WarlordsModel.REWARD_TYPE_FOUR;
                    shenxiangInfo.tipData = LangManager.Instance.GetTranslation("warlords.WarlordsCheckRewardFrame.str08");
                    shenxiangInfo.nameStr = LangManager.Instance.GetTranslation("warlords.WarlordsCheckRewardFrame.warlordsavatar");
                    this._listData.push(shenxiangInfo);
                }
            }
            else {//勇者之殿
                let goodsRewardInfo2: WarlordsRewardInfo = new WarlordsRewardInfo();
                goodsRewardInfo2.type = WarlordsModel.REWARD_TYPE_TWO;
                goodsRewardInfo2.goodsInfo = goodsInfo;
                goodsRewardInfo2.tipData = goodsInfo;
                goodsRewardInfo2.nameStr = goodsInfo.templateInfo.TemplateNameLang + " x" + (4000 - 200 * (this._index - 4));
                this._listData.push(goodsRewardInfo2);
            }
        }
        else {
            if (num == 1 || num == 2 || num == 3) {
                let goodsRewardInfo3: WarlordsRewardInfo = new WarlordsRewardInfo();
                goodsRewardInfo3.type = WarlordsModel.REWARD_TYPE_TWO;
                goodsRewardInfo3.goodsInfo = goodsInfo;
                goodsRewardInfo3.tipData = goodsInfo;
                goodsRewardInfo3.nameStr = goodsInfo.templateInfo.TemplateNameLang + " x" + (3200 - 200 * (num - 1));
                this._listData.push(goodsRewardInfo3);
            }
            else {
                let goodsRewardInfo4: WarlordsRewardInfo = new WarlordsRewardInfo();
                goodsRewardInfo4.type = WarlordsModel.REWARD_TYPE_TWO;
                goodsRewardInfo4.goodsInfo = goodsInfo;
                goodsRewardInfo4.tipData = goodsInfo;
                goodsRewardInfo4.nameStr = goodsInfo.templateInfo.TemplateNameLang + " x" + (2600 - 200 * (this._index - 4));
                this._listData.push(goodsRewardInfo4);
            }
        }
        this.rewardList.numItems = this._listData.length;
    }

    private getWarlordMount(tempId: number): t_s_mounttemplateData {
        var tempInfo: t_s_mounttemplateData = new t_s_mounttemplateData(null);
        var originalTempInfo: t_s_mounttemplateData = TempleteManager.Instance.getMountTemplateById(tempId);
        ObjectUtils.copyProperties(originalTempInfo, tempInfo)
        return tempInfo;
    }

    public dispose() {
        super.dispose();
    }
}