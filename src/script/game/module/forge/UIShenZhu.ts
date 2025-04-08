import FUI_starCom from "../../../../fui/Forge/FUI_starCom";
import LangManager from "../../../core/lang/LangManager";
import { PackageIn } from "../../../core/net/PackageIn";
import BaseFguiCom from "../../../core/ui/Base/BaseFguiCom";
import Dictionary from "../../../core/utils/Dictionary";
import StringHelper from "../../../core/utils/StringHelper";
import { StoreIntensifyCell } from "../../component/item/StoreIntensifyCell";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { BagType } from "../../constant/BagDefine";
import GoodsSonType from "../../constant/GoodsSonType";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import ConfigInfoManager from "../../manager/ConfigInfoManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import RechargeAlertMannager from "../../manager/RechargeAlertMannager";
import { ResourceManager } from "../../manager/ResourceManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { GoodsCheck } from "../../utils/GoodsCheck";
import { GoodsHelp } from "../../utils/GoodsHelp";
import ForgeCtrl from "./ForgeCtrl";
import ForgeData from "./ForgeData";
import StoreRspMsg = com.road.yishi.proto.store.StoreRspMsg
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import FUI_BaseTipItem from "../../../../fui/Base/FUI_BaseTipItem";
import UIButton from "../../../core/ui/UIButton";
import FUIHelper from "../../utils/FUIHelper";
/**
 * 神铸
 */
export default class UIShenZhu extends BaseFguiCom 
{
    public castBtn: fgui.GButton
    private equip1: StoreIntensifyCell
    private material1: StoreIntensifyCell
    private material2: StoreIntensifyCell
    private _itemDic: Dictionary = new Dictionary;
    public c1:fairygui.Controller;
    private txt1: fgui.GLabel;
    private txt2: fgui.GLabel;
    private txt_max: fgui.GLabel;
    private txt3: fgui.GLabel;
    private txt4: fgui.GLabel;
    private txt_bar: fgui.GLabel;
    private txt_rate: fgui.GLabel;
    private txtCost: fgui.GLabel;
    private txt_max80: fgui.GLabel;
    // private star1:FUI_starCom;
    // private star2:FUI_starCom;
    // private moon_com:FUI_starCom;
    private item01: fgui.GComponent;
    private img_textbg0: fgui.GComponent;
    private img_textbg1: fgui.GComponent;
    private imgArrow: fgui.GComponent;
    private item02: fgui.GComponent;
    private gMaxGrade: fgui.GGroup
    private bar: fgui.GProgressBar
    private tipItem: BaseTipItem;
    constructor(comp: fgui.GComponent) {
        super(comp)
        this.c1 = this.getController('c1');
        // this.equip1.item.pos = 0;
        // this.equip2.item.pos = 1;
        this._itemDic["0_0_" + BagType.Hide] = this.equip1;
        this._itemDic["1_0_" + BagType.Hide] = this.material1;
        this._itemDic["2_0_" + BagType.Hide] = this.material2;
        this.castBtn.onClick(this, this.onBtnConfirm)
        this.txt3.text = LangManager.Instance.GetTranslation('store.cast.CastView.BlessTxt')+':';
        this.txt4.text = LangManager.Instance.GetTranslation('fashion.view.compose.composeRate')+':';
        this.txt_max80.text = LangManager.Instance.GetTranslation('faterotary.LevelMax');
        this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
        this.resetTarget();
        this.updateView();
    }

    public get ctrl(): ForgeCtrl {
        let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Forge) as ForgeCtrl
        return ctrl
    }

    refresh(tag: string, data: any) {
        switch (tag) {
            case "MouldResult":
                this.__onIntensifyResult(data)
                break;
            case "BagItemUpdate":
                this.__bagItemUpdateHandler(data)
                break;
            case "BagItemDelete":
                this.__bagItemDeleteHandler(data)
                break;
            default:
                break;
        }
    }
    
    /**
     * 强化结果 
     */
    protected __onIntensifyResult(pkg: PackageIn) {
        let msg = pkg.readBody(StoreRspMsg) as StoreRspMsg;
        if(msg.strengResult)
        {
            let info:GoodsInfo = GoodsManager.Instance.getHideBagItemByPos(msg.pos);
            info.objectId	= msg.objectId;
            info.bagType	= msg.bagType;
            info.mouldGrade = msg.strengthenGrade;
            let item:StoreIntensifyCell = this._itemDic[info.pos+"_"+info.objectId+"_"+info.bagType];
            if(item)
            {
                item.info = info;
                if(info.objectId == 0 && info.bagType == 0){
                    this.equip1.item.tipType = EmWindow.ForgeEquipTip
                }
            }
            // let str = LangManager.Instance.GetTranslation("store.cast.CastView.MouldTips01");
            // MessageTipManager.Instance.show(str);
        }else
        {
            // let str = LangManager.Instance.GetTranslation("store.cast.CastView.MouldTips02", 5);
            // MessageTipManager.Instance.show(str);
        }
        this.updateView();
    }

    protected __bagItemUpdateHandler(info: GoodsInfo) {
        // Logger.log("[UIQiangHua]__bagItemUpdateHandler", info.pos + "_" + info.objectId + "_" + info.bagType)
        let item: StoreIntensifyCell = this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
        if (item) {
            item.info = info;
            if (info.pos == 0) {
                this.equip1.item.tipType = EmWindow.ForgeEquipTip
            } else {
                this.equip1.item.tipType = EmWindow.ForgePropTip
            }
            this.updateView();
        }
    }

    private __bagItemDeleteHandler(info: GoodsInfo) {
        // Logger.log("[UIQiangHua]__bagItemDeleteHandler", info.pos + "_" + info.objectId + "_" + info.bagType)
        let item: StoreIntensifyCell = this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
        if (item) {
            item.info = null;
            this.updateView();
        }
    }

    private updateView() {
        this.castBtn.enabled = false;
        this.item01.visible = this.item02.visible = false;
        this.item01.getChild("rTxtName").text = '';
        this.item02.getChild("rTxtName").text ='';
        let id1:number = ForgeData.MOULD_NEED_MATERIAL1;
        let id2:number = ForgeData.MOULD_NEED_MATERIAL2;
        let needMaterialCount1:number = 0;
        let needMaterialCount2:number = 0;
        let ownNum1:number = 0;
        let ownNum2:number = 0;
        let mouldGrade:number = 0;
        this.gMaxGrade.visible = false;
        this.txt_rate.text 	= "--";
        this.txtCost.text = "--/--";
        this.txt_bar.text = "--/--";
        this.txtCost.color = '#FFECC6';
        this.txt1.visible =this.txt2.visible =false;
        this.img_textbg1.visible =this.img_textbg0.visible = this.imgArrow.visible = false;
        // this.setStar(this.star1,0);
        // this.setStar(this.star2,0);
        if(!this.equip1){
            return;
        } 
        let info:GoodsInfo = this.equip1.info;
        if(info)
		{
            ownNum1 = GoodsManager.Instance.getGoodsNumByTempId(info.MOULD_NEED_MATERIAL1);
            ownNum2 = GoodsManager.Instance.getGoodsNumByTempId(info.MOULD_NEED_MATERIAL2);
            this.txt1.visible =this.txt2.visible =true;
            this.img_textbg1.visible =this.img_textbg0.visible = this.imgArrow.visible = true;
            if(info.mouldGrade < info.MOULD_MAX_GRADE)//未达满级 
            {
                mouldGrade = info.mouldGrade;
                this.c1.setSelectedIndex(0);
                if(info.templateInfo.SonType == GoodsSonType.SONTYPE_RELIC || info.templateInfo.SonType == GoodsSonType.SONTYPE_HERALDRY)
                {
                    if(info.mouldGrade >= ForgeData.MOULD_MAX_GRADE)
                    {
                        //神铸等级大于80
                        needMaterialCount1 = info.getMouldNeedCount(1) * 3;
                        needMaterialCount2 = info.getMouldNeedCount(2) * 3;
                    }else
                    {
                        needMaterialCount1 = 10;
                        needMaterialCount2 = 30;
                    }
                }else
                {
                    needMaterialCount1 = info.getMouldNeedCount(1);
                    needMaterialCount2 = info.getMouldNeedCount(2);
                }
                // let successRate:number=ForgeData.getMouldSuccessRate(info);
                let cost = GoodsCheck.getMouldGold(info);
                this.txtCost.text 	= ResourceManager.Instance.gold.count + '/'+ cost;
                this.txt_bar.text = info.blessValue + " / " + ForgeData.MOULD_MAX_BLESS;
                this.bar.value = info.blessValue;
                // successRate+=info.blessValue;
                // if(successRate>100)
                // {
                //     successRate=100;
                // }
                this.txt_rate.text = this.calcuRate()+'%';
                let color = ResourceManager.Instance.gold.count > cost ? '#FFECC6' :'#FF0000';
                this.txtCost.color = color;
                id1 = info.MOULD_NEED_MATERIAL1;
                id2 = info.MOULD_NEED_MATERIAL2;

                //暂时没有月阶
                if(info.mouldGrade == ForgeData.MOULD_MAX_GRADE){
                    this.txt_max80.visible = true;
                    this.txt2.visible = this.img_textbg1.visible = false;
                }else{
                    this.txt_max80.visible = false;
                    this.txt2.visible = this.img_textbg1.visible = true; 
                }  
            }else
            {
                mouldGrade = info.mouldGrade;
                this.gMaxGrade.visible = true;
                this.castBtn.enabled = this.txt_max80.visible = false;
                this.c1.setSelectedIndex(1);
                this.txt_max.y = 214;
                this.txt_max.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.castSelected.text2",info.mouldRankShow,info.mouldStar);
            }
		}
        let goods:GoodsInfo = new GoodsInfo();
        goods.templateId = id1;
        this.material1.info = goods;
        if(info && !this.gMaxGrade.visible){
            this.material1.item.text	= ownNum1 + " / " + needMaterialCount1;
            this.material1.item.titleColor = ownNum1 >= needMaterialCount1 ? "#ffffff" : "#ff2e2e"
        }else{
            this.material1.item.text	='--/--';
        }
        let goods2:GoodsInfo = new GoodsInfo();
        goods2.templateId = id2;
        this.material2.info = goods2;
        if(info&& !this.gMaxGrade.visible){
           
            this.material2.item.text =  ownNum2 + "/" + needMaterialCount2;
            this.material2.item.titleColor = ownNum2 >= needMaterialCount2 ? "#ffffff" : "#ff2e2e"
        }else{
            this.material2.item.text	='--/--';
        }
        this.castBtn.enabled = ownNum1 >= needMaterialCount1 && ownNum2 >= needMaterialCount2 && ownNum1>0&& ownNum2>0;
        this.setData(info, mouldGrade);
        this.setData(info, mouldGrade+1,true);
        // this.resetView()
    }

    private isActive:boolean = true;
    private _mouldGrade1:number=0;
    private _mouldGrade2:number=0;

    /**
     * 
     * @param goodsInfo 
     * @param mouldGrade 
     * @param isnext 是否下一阶
     */
    private setData(goodsInfo:GoodsInfo, mouldGrade:number, isnext:boolean = false){
        let tempInfo:GoodsInfo = new GoodsInfo();
        tempInfo.mouldGrade = mouldGrade;
        if(isnext){
            this._mouldGrade2 = mouldGrade;
        }else{
            this._mouldGrade1 = mouldGrade;
        }
        this.isActive = true;
        // this._mouldGrade = mouldGrade;
        if(goodsInfo && mouldGrade <= goodsInfo.MOULD_MAX_GRADE)
        {
            if(mouldGrade > 0)
			{
                let str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.MouldItem.Tips03", tempInfo.mouldRankShow,tempInfo.mouldStar);
                if(isnext){
                    this.txt2.text =  str;
                    // this.setStar(this.star2,tempInfo.mouldStar);
                }else{
                    this.txt1.text =  str;
                    // this.setStar(this.star1,tempInfo.mouldStar);
                }

                if(tempInfo.mouldRank >16)
                {
                    // if(isnext){
                    //     this.star2.visible = false;
                    // }else{
                    //     this.star1.visible = false;
                    // }
                    // _mouldMoon.visible = false;
                    // _mouldDay.visible = true;
                }
                else if(tempInfo.mouldRank > 8)
                {
                    // if(isnext){
                    //     this.star2.visible = false;
                    // }else{
                    //     this.star1.visible = false;
                    // }
                    // _mouldMoon.visible = true;
                    // _mouldDay.visible = false;
                }else
				{
                    // if(isnext){
                    //     this.star2.visible = true;
                    // }else{
                    //     this.star1.visible = true;
                    // }
                    // _mouldMoon.visible = false;
                    // _mouldDay.visible = false;
				}
                this.initAttribute(goodsInfo, goodsInfo.templateInfo,isnext);
            }else
            {
                this.isActive = false;
                this.txt1.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.MouldItem.Tips02");
                // this.star1.visible = false;
                // _mouldMoon.visible = false;
                // _mouldDay.visible = false;
                this.initAttribute(goodsInfo, goodsInfo.templateInfo,isnext);
                // setItemFrame(1);
                // _subBox.y = 21;
            }
        }else
        {
            // _mouldTitle.text = "";
            // _mouldStar.visible = false;
            // _mouldMoon.visible = false;
            // _mouldDay.visible = false;
            // _subBox.removeAllChild();
        }
    }

    private setStar(star:FUI_starCom,starNum:number){
        for (let i = 1; i <= 10; i++) {
            const element = star.getChild('star'+i);
            element.visible = false;
        }

        for (let i = 1; i <= starNum; i++) {
            const element = star.getChild('star'+i);
            element.visible = true;
        }
    }

    private initAttribute(info: GoodsInfo, temp: t_s_itemtemplateData,isnext) {
        let bMaxGrade = false;

        let str: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01");
        this.updateAttributeTxt(str, temp.Power, this.getAdd(temp.Power, info,isnext), bMaxGrade,this.getAdd(temp.Power, info,false));

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02") + ":";
        this.updateAttributeTxt(str, temp.Agility,  this.getAdd(temp.Agility, info,isnext), bMaxGrade,this.getAdd(temp.Agility, info,false));

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03");
        this.updateAttributeTxt(str, temp.Intellect,  this.getAdd(temp.Intellect, info,isnext), bMaxGrade,this.getAdd(temp.Intellect, info,false));

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04");
        this.updateAttributeTxt(str, temp.Physique,this.getAdd(temp.Physique, info,isnext), bMaxGrade,this.getAdd(temp.Physique, info,false));

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip05");
        this.updateAttributeTxt(str, temp.Captain,  this.getAdd(temp.Captain, info,isnext), bMaxGrade,this.getAdd(temp.Captain, info,false));

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip13");
        this.updateAttributeTxt(str, temp.Attack, this.getAdd(temp.Attack, info,isnext), bMaxGrade,this.getAdd(temp.Attack, info,false));

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip15");
        this.updateAttributeTxt(str, temp.MagicAttack, this.getAdd(temp.MagicAttack, info,isnext), bMaxGrade,this.getAdd(temp.MagicAttack, info,false));

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip14");
        this.updateAttributeTxt(str, temp.Defence, this.getAdd(temp.Defence, info,isnext), bMaxGrade,this.getAdd(temp.Defence, info,false));

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip16");
        this.updateAttributeTxt(str, temp.MagicDefence,this.getAdd(temp.MagicDefence, info,isnext), bMaxGrade,this.getAdd(temp.MagicDefence, info,false));

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip19");
        this.updateAttributeTxt(str, temp.Parry, this.getAdd(temp.Parry, info,isnext), bMaxGrade,this.getAdd(temp.Parry, info,false));

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip11");
        this.updateAttributeTxt(str, temp.Live, this.getAdd(temp.Live, info,isnext), bMaxGrade,this.getAdd(temp.Live, info,false));

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip10");
        this.updateAttributeTxt(str, temp.ForceHit, this.getAdd(temp.ForceHit, info,isnext), bMaxGrade,this.getAdd(temp.ForceHit, info,false));

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip17");
        this.updateAttributeTxt(str, temp.Conat, this.getAdd(temp.Conat, info,isnext), bMaxGrade,this.getAdd(temp.Conat, info,false));
    }

    private getAdd(preValue:number, gInfo:GoodsInfo,isnext:boolean) : number
    {
        let curr:number = GoodsHelp.getMouldAddition(preValue, this.getPropertyMouldGrade(gInfo,isnext));
        return curr;
    }

    private getPropertyMouldGrade(gInfo:GoodsInfo,isnext:boolean):number
    {
        if(isnext){
            if(this._mouldGrade2 < 1)
            {
                return 1;
            }
            else if(this._mouldGrade2 > gInfo.MOULD_MAX_GRADE)
            {
                return gInfo.MOULD_MAX_GRADE;
            }
            return this._mouldGrade2;
        }else
        { 
            if(this._mouldGrade1 < 1)
            {
                return 1;
            }
            else if(this._mouldGrade1 > gInfo.MOULD_MAX_GRADE)
            {
                return gInfo.MOULD_MAX_GRADE;
            }
            return this._mouldGrade1;
        } 
    }
    
    private updateAttributeTxt(property: string, base: number,  addNex: number, bMaxGrade: boolean,cur:number) {
        // Logger.log("[UIQiangHua]updateAttributeTxt", "property=" + property + ", value=" + value)
        if (base != 0) {
            let curVal = 0;
            if(this.isActive){
                curVal = cur;
            }
            addNex = Math.floor(base * 0.3);
            let curStr = bMaxGrade ? "" : String(base + curVal);
            let nextStr = bMaxGrade ? "[color=#FFECC6]" + (base+curVal) + "[/color][color=#71FF00]"  + "[/color]" : "[color=#FFECC6]" + (base+curVal ) + "[/color][color=#71FF00]" + "（+" + addNex + "）" + "[/color]";
            if (!this.item01.visible) {
                this.item01.visible = true;
                this.updateItem(this.item01, property, curStr, nextStr)
            } else {
                let t1 =this.item01.getChild("rTxtName").text;
                let t2 =this.item02.getChild("rTxtName").text;
                if ( t1 != property && t2 != property) {
                    this.item02.visible = true;
                    this.updateItem(this.item02, property, curStr, nextStr)
                }
            }
        }
    }

    private get playerInfo():PlayerInfo
    {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private onBtnConfirm() {
        let str:string;
        if(ResourceManager.Instance.gold.count < parseInt(StringHelper.trim(this.txtCost.text)))
        {
            str = LangManager.Instance.GetTranslation("public.gold");
            MessageTipManager.Instance.show(str);
            return;
        }
        if(this.playerInfo.vocationLevel < PlayerInfo.VOCATION_LEVEL_MAX &&
            this.equip1.info.mouldRank == this.playerInfo.vocationLevel &&
            this.equip1.info.mouldStar == 10 ||
            this.playerInfo.vocationLevel == PlayerInfo.VOCATION_LEVEL_MAX &&
            this.equip1.info.mouldRank == this.equip1.info.MOULD_MAX_RANK && 
            this.equip1.info.mouldStar == 10) 
        {
            str = LangManager.Instance.GetTranslation("store.cast.CastView.MouldTips03");
            MessageTipManager.Instance.show(str);
            return;
        }
        let info:GoodsInfo = this.equip1.info;
        // let pointListIndex:Array<number> = [2120100,2120101,2120102,2120103,2120106,2120107];
        // let ownNum1:number = GoodsManager.Instance.getGoodsNumByTempId(info.MOULD_NEED_MATERIAL1);
        // let ownNum2:number = GoodsManager.Instance.getGoodsNumByTempId(info.MOULD_NEED_MATERIAL2);
        // let posIndex1:number = pointListIndex.indexOf(info.MOULD_NEED_MATERIAL1);
        // let posIndex2:number = pointListIndex.indexOf(info.MOULD_NEED_MATERIAL2);
        let needMaterialCount1:number = 5;
        let needMaterialCount2:number = 15;
        if(info.templateInfo.SonType == GoodsSonType.SONTYPE_RELIC || info.templateInfo.SonType == GoodsSonType.SONTYPE_HERALDRY)
        {
            if(info.mouldGrade >= ForgeData.MOULD_MAX_GRADE)
            {
                //神铸等级大于80
                needMaterialCount1 = info.getMouldNeedCount(1) * 3;
                needMaterialCount2 = info.getMouldNeedCount(2) * 3;
            }else
            {
                needMaterialCount1 = 10;
                needMaterialCount2 = 30;
            }
        }else
        {
            needMaterialCount1 = info.getMouldNeedCount(1);
            needMaterialCount2 = info.getMouldNeedCount(2);
        }
        this.ctrl.sendItemMould(0);

        // if(ownNum1 < needMaterialCount1 || ownNum2 < needMaterialCount2)
        // {
        //     if(info.mouldGrade >= ForgeData.MOULD_MAX_GRADE_SENIOR)//日阶段的神铸材料没投放, 暂时不让花费钻石神铸, 策划要求
        //     {
        //         MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("store.cast.mould.tips"));
        //         return;
        //     }else
        //     {
        //         let pointList:Array<any> = ConfigInfoManager.Instance.getEquipAdvPoint();
        //         let point1:number = (needMaterialCount1-ownNum1)*pointList[posIndex1];
        //         point1 = point1<0?0:point1;
        //         let point2:number = (needMaterialCount2-ownNum2)*pointList[posIndex2];
        //         point2 = point2<0?0:point2;
        //         let point:number = point1+point2;
        //         this.showPromptAlertBack(true,true,point);
        //         return;
        //     }
        // }
    }

    // private showPromptAlert(point:number):void
    // {
    //     SimpleAlertHelper.Instance.data = [this.showPromptAlertBack,point];
    //     let confirm:string = LangManager.Instance.GetTranslation("public.confirm");
    //     let cancel:string = LangManager.Instance.GetTranslation("public.cancel");
    //     let prompt:string = LangManager.Instance.GetTranslation("public.prompt");
    //     let content:string = LangManager.Instance.GetTranslation("store.cast.CastView.MouldTips04",point);
    //     SimpleAlertHelper.Instance.popAlerFrame(prompt,content,confirm,cancel,null);
    // }

    // private showPromptAlertBack(b:Boolean,flag:Boolean,payPoint:number):void
    // {
    //     if(b)
    //     {
    //         let point:number = 0;
    //         if(flag) point = PlayerManager.Instance.currentPlayerModel.playerInfo.allPoint;
    //         else point = PlayerManager.Instance.currentPlayerModel.playerInfo.point;
    //         if(point < payPoint)
    //         {
    //             RechargeAlertMannager.Instance.show();
    //         }
    //         else
    //         {
    //             let payType:number = flag?0:1;
    //             this.ctrl.sendItemMould(payType);
    //         }
    //     }
    // }

    private updateItem(item: fgui.GComponent, name: string, cur: string, next: string, profile: number = null)
    {
        let rTxtName = item.getChild("rTxtName") as fgui.GRichTextField
        rTxtName.text = name
        if (profile && ForgeData.Colors[profile - 1]) {
            rTxtName.color = ForgeData.Colors[profile - 1]
        }
        item.getChild("rTxtCur").text = cur
        item.getChild("rTxtNext").text = next
    }

    public resetView() 
    {
        
    }

    public resetTarget() {
        if(this.equip1){
            this.equip1.info = null
        }
        if(this.material2){
            let goods:GoodsInfo = new GoodsInfo();
            goods.templateId = ForgeData.MOULD_NEED_MATERIAL2;
            this.material2.info = goods;
            this.material2.item.text	= " --/--";
        }
        if(this.material1){
            let goods:GoodsInfo = new GoodsInfo();
            goods.templateId = ForgeData.MOULD_NEED_MATERIAL1;
            this.material1.info = goods;
            // this.material1.info = null
            this.material1.item.text	= " --/--";
        }
        this.updateView();
    }

    refreshResources() {
        // this.updateView();
    }

    private calcuRate():number{
        let result:number=0;
        let rate = (this.equip1.info.mouldGrade % 10) + 1; // 下一级星级(1~10星)
        let baseRandom = 0; // 基础成功率
        if (rate <= 5) { // 计算升到1~5星的基础概率
                baseRandom = 50 - 10 * (rate - 1);
        } else {
                baseRandom = 5;
        }
        result=this.equip1.info.blessValue + baseRandom;
        return result > 100 ? 100 : result;
    }


    public dispose(destroy = true) {       
        this.castBtn.offClick(this, this.onBtnConfirm.bind(this))
        super.dispose(destroy);
    }
}