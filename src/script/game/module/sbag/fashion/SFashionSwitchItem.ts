import FUI_SFashionSwitchItem from "../../../../../fui/SBag/FUI_SFashionSwitchItem";
import LangManager from "../../../../core/lang/LangManager";
import { getDefaultLanguageIndex } from "../../../../core/lang/LanguageDefine";
import { FashionBagCell } from "../../../component/item/FashionBagCell";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { FashionEvent } from "../../../constant/event/NotificationEvent";
import GoodsSonType from "../../../constant/GoodsSonType";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { FashionManager } from "../../../manager/FashionManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { FashionModel } from "../../bag/model/FashionModel";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";


/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/4/21 20:52
 * @ver 1.0
 *
 */
export class SFashionSwitchItem extends FUI_SFashionSwitchItem {
    //@ts-ignore
    public item: FashionBagCell;

    private _data: t_s_itemtemplateData;
    private profileRes: string[] = ["Lab_S", "Lab_A", "Lab_B", "Lab_C", "Lab_D"];

    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this.language.selectedIndex =getDefaultLanguageIndex();
        this.initEvent();
    }

    private initEvent() {
        this.onClick(this, this.__clickHandler);
    }

    //@ts-ignore
    public get data(): t_s_itemtemplateData {
        return this._data;
    }

    public set data(info: t_s_itemtemplateData) {
        this._data = info;
        this.refreshView();
    }

    private refreshView() {
        if (this._data) {
            this.btn_identity.getChild('redDot').visible =false;
            let goodsInfo: GoodsInfo = new GoodsInfo();
            goodsInfo.templateId = this._data.TemplateId;
            let skillInfo: t_s_skilltemplateData = this.fashionModel.getFashionObjectSkillTemplate(this._data);
            let tip: string = (skillInfo != null ? skillInfo.SkillTemplateName : "");
            let starNum: number = (skillInfo != null ? skillInfo.Grades : 0);
            goodsInfo.appraisal_skill = (skillInfo != null ? skillInfo.TemplateId : 0);

            this.item.info = goodsInfo;
            if (this._data.Property2 > 0 && this._data.Property2 < 6) {
                this.profile.url = fgui.UIPackage.getItemURL(EmPackName.Base, this.profileRes[this._data.Property2 - 1]);
            }
            this.txt_name.text = this._data.TemplateNameLang;
            this.txt_name.color = GoodsSonType.getColorByProfile(this._data.Profile);
            this.img_star.fillAmount = starNum / 5;
            this.limitImg.visible = this._data.Limited == 1?true:false;
            
            let count: number = 0;//消耗量
            if (this.fashionModel.hasIdentityedBook(this._data.TemplateId))//鉴定过
            {
                if (this.fashionModel.hasRefreshFull(this._data.TemplateId)) {
                    //满星
                    this.c1.selectedIndex = 4;
                    this.txt_property.text = tip;
                }
                else {
                    //可洗练
                    this.c1.selectedIndex = 3;
                    // count = this.fashionModel.getCountForRefresh(this._data);
                    // this.btn_identity.text = LangManager.Instance.GetTranslation("fashion.FashionSwitchItem.refreshTxt");
                    // this.btn_identity.data = LangManager.Instance.GetTranslation("fashion.FashionSwitchItem.refreshTipTxt", count, "");
                }
            }
            else {
                // count = this.fashionModel.getCountForIdentityBook(this._data);
                // let rate:number = this.fashionModel.getSuccessRateForIdentityBook(this._data);
                // this.btn_identity.text = LangManager.Instance.GetTranslation("fashion.FashionSwitchItem.noIdentity");
                // this.btn_identity.data = LangManager.Instance.GetTranslation("fashion.FashionSwitchItem.identityTipTxt", count, "") + "\n   " + LangManager.Instance.GetTranslation("fashion.view.compose.composeRate") + rate + "%";
                if (this._data.TemplateId in this.fashionModel.bookList) {
                    if (this.fashionModel.bookList[this._data.TemplateId] == false) {
                        this.c1.selectedIndex = 1;//New
                    }else {
                        this.c1.selectedIndex = 2;//可鉴定
                    }
                    if(this.fashionModel.preconditions){
                        count = (6 - this._data.Property2) * 200000;
                        this.btn_identity.getChild('redDot').visible = ResourceManager.Instance.gold.count >= count;
                    }
                }
                else {
                    //不可鉴定
                    this.c1.selectedIndex = 0;
                }
            }
            this.btn_identity.enabled = this.c1.selectedIndex != 0;
        }
    }

    private __clickHandler(e: Laya.Event) {
        if (!this._data) {
            return;
        }

        if (this._data.TemplateId in this.fashionModel.bookList && this.fashionModel.bookList[this._data.TemplateId] == false)//新的  带New标志的
        {
            FashionManager.Instance.disenableNewIcon(this._data.TemplateId);
        }

        if (e.target["$owner"] == this.btn_identity) {
            this.identityBtnClickHandler();
        }
        // else {
            let book = (this._data.TemplateId in this.fashionModel.bookList);
            NotificationManager.Instance.sendNotification(FashionEvent.FASHION_BOOK_WEAR, book, this._data);
        // }
    }


    private identityBtnClickHandler() {
        if (!this._data) {
            return;
        }
        let thaneInfo: ThaneInfo = ArmyManager.Instance.thane;
        let msg: string = "";
        let count: number = 0;//鉴定或者洗练消耗数量
        let content: string = "";//鉴定或者洗练
        if (this.fashionModel.hasRefreshFull(this._data.TemplateId)) //洗练到顶
        {
            msg = LangManager.Instance.GetTranslation("fashion.FashionSwitchItem.identityedFull");
        }
        else if (thaneInfo.grades < FashionModel.INDENTITY_OPEN_GRADE) {
            msg = LangManager.Instance.GetTranslation("BattleGuardView.needGrade", FashionModel.INDENTITY_OPEN_GRADE);
        }
        if (msg) {
            MessageTipManager.Instance.show(msg);
            return;
        }
        if (!this.fashionModel.hasIdentityedBook(this._data.TemplateId))//未鉴定过
        {
            //消耗黄金公式为: (6-时装等级)*20W（时装等级: t_s_itemtemplate字段Property2(参数2)所配置的值）
            // count = this.fashionModel.getCountForIdentityBook(this._data);
            let skillData:t_s_skilltemplateData = TempleteManager.Instance.getSkillIdByTypeAndGrade(this._data.SonType * 10,this._data.Property2,1)
            let str;
            if(skillData){
                str = skillData.TemplateNameLang + "~" + this.getMaxValue(skillData);
            }
            count = (6 - this._data.Property2) * 200000;
            content = LangManager.Instance.GetTranslation("fashion.FashionSwitchItem.identityContent", count,str);
            let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            let title: string = LangManager.Instance.GetTranslation("public.prompt");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, [this._data, count], title, content, confirm, cancel, this.indentityCallBack.bind(this))
        }
        else//鉴定过未洗练到最高级
        {
            //	先修改为原本掉落ID删除, 直接读取配置表t_s_skilltemplate中字段MasterType为时装类型*10的ID段, 字段sontype对应配置表t_s_itemtemplate字段 Property2(参数2)
            //字段Grades为当前时装洗练等级
            // let skillInfo: t_s_skilltemplateData = this.fashionModel.getFashionObjectSkillTemplate(this._data);
            // skillInfo.tem

            // count = this.fashionModel.getCountForRefresh(this._data);
            count = 6 - this._data.Property2;
            //消耗时装之魄数量根据公式: 6-时装等级扣除（时装等级: t_s_itemtemplate字段Property2(参数2)所配置的值）
            let skillInfo: t_s_skilltemplateData = this.fashionModel.getFashionObjectSkillTemplate(this._data);
            let skillData:t_s_skilltemplateData 
            let str;
            if(skillInfo){
                skillData = TempleteManager.Instance.getSkillIdByTypeAndGrade(this._data.SonType * 10,this._data.Property2,skillInfo.Grades+1);
                if(skillData){
                    if(skillInfo.Grades == 4){
                        str = skillData.TemplateNameLang;
                    }else{
                        str = skillData.TemplateNameLang + "~" + this.getMaxValue(skillData);
                    }
                }
            }
            let title: string = LangManager.Instance.GetTranslation("public.prompt");
            let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            content = LangManager.Instance.GetTranslation("fashion.FashionSwitchItem.refreshContent", count,str);
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, [this._data, count], title, content, confirm, cancel, this.indentityCallBack.bind(this))
        }
    }

    private getMaxValue(skillData:t_s_skilltemplateData):number{
        let number = 0;
        if(skillData.SonType == 1){
            number = 20*(skillData.Grades +1);
        }else if(skillData.SonType == 2){
            number = 8*(skillData.Grades +1);
        }else if(skillData.SonType == 3){
            number = 6*(skillData.Grades +1);
        }else if(skillData.SonType == 4){
            number = 4*(skillData.Grades +1);
        }else if(skillData.SonType == 5){
            number = 2*(skillData.Grades +1);
        }
        return number;
    }

    private indentityCallBack(result: boolean, flag: boolean, params: any) {
        if (!result) {
            return;
        }

        let data: t_s_itemtemplateData = params[0];
        let value: number = params[1];

        if (!this.fashionModel.hasIdentityedBook(data.TemplateId))//未鉴定过
        {
            if (value > ResourceManager.Instance.gold.count) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("public.gold"));
                return;
            }
        }
        else {
            let bagCount: number = GoodsManager.Instance.getGoodsNumByTempId(FashionModel.FASHION_SOUL);
            let needCount: number = value - bagCount;
            if (needCount > 0) {
                // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("fashion.view.compose.noFashionSoul"));
                //时装之魄快捷购买
                this.quickUIcallback([FashionModel.FASHION_SOUL, needCount]);
                return;
            }
        }
        this.fashionModel.isIdentify = true;
        FashionManager.Instance.identityBook(data.TemplateId);
    }

    private quickUIcallback(data: any[]) {
        let info: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(data[0]);
        if (info) {
            FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info, count: data[1] });
        }
    }

    public get fashionModel(): FashionModel {
        return FashionManager.Instance.fashionModel;
    }

    private removeEvent() {
        this.offClick(this, this.__clickHandler);
    }

    dispose() {
        this.removeEvent();

        super.dispose();
    }
}