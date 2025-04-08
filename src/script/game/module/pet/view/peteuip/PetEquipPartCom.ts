// @ts-nocheck
import FUI_PetEquipPartCom from "../../../../../../fui/Pet/FUI_PetEquipPartCom";
import LangManager from "../../../../../core/lang/LangManager";
import Logger from "../../../../../core/logger/Logger";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { t_s_attributeData } from "../../../../config/t_s_attribute";
import { t_s_petequipsuitData } from "../../../../config/t_s_petequipsuit";
import { BagType } from "../../../../constant/BagDefine";
import { BagEvent, PetEvent } from "../../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../../constant/UIDefine";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../../manager/GoodsManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { GoodAttributeItem } from "../../../../tips/GoodAttributeItem";
import PetCtrl from "../../control/PetCtrl";
import { PetData } from "../../data/PetData";
import { PetEquipCell } from "./PetEquipCell";

/**
 * 英灵装备部位
 */
export class PetEquipPartCom extends FUI_PetEquipPartCom {

    private _petData: PetData;
    private equipArr: GoodsInfo[];
    private bagArr: GoodsInfo[];
    private strArr = ['Icon_Box_Earrings1', 'Icon_Box_Earrings2', 'Icon_Box_Accessory1', 'Icon_Box_Accessory2', 'Icon_Box_Artifact', 'Icon_Box_Belt'];
    private attriMap = {};
    private suitMap = {};//{suitId:[]}
    /** 当前选中的部位 */
    private curPart: PetEquipCell;

    protected onConstruct() {
        super.onConstruct();
        this.initView();
        this.addEvent();
    }

    private initView() {
        for (let j = 0; j < 6; j++) {
            let cell = this['part' + j] as PetEquipCell;
            cell.info = null;
            (cell.getChild('part_icon') as fgui.GLoader).url = fgui.UIPackage.getItemURL(EmWindow.Pet, this.strArr[j]);
        }
        this.add_attri_tip.getChild('txt1').text = LangManager.Instance.GetTranslation('petEuip.tip01');
        this.btn_suit_attri.title = LangManager.Instance.GetTranslation('petEuip.tip02');
    }


    /**
     * 切换英灵的时候更新装备显示
     * @param data 
     */
    updateView(data: PetData) {
        this._petData = data;

        this.bagArr = GoodsManager.Instance.getGoodsByBagType(BagType.PET_BAG);
        this.updateAttr();
    }

    private addAttriNum: number = 0;
    private clearAttr() {
        this.addAttriNum = 0;
        for (let i = 1; i <= 10; i++) {
            let attri_item = this.add_attri_tip.getChild('attri_item' + i) as GoodAttributeItem;
            if (attri_item) {
                attri_item.visible = false;
            }
            let cell = this['part' + (i - 1)] as PetEquipCell;
            if (cell) {
                cell.info = null;
            }
        }
        let cell = this['part5'] as PetEquipCell;
        cell.info = null;
        this.btn_suit_attri.visible = false;
        this.curPetSuitIdArr.length = 0;
        // this.btn_suit1.visible = false;
        // this.btn_suit2.visible = false;
        // this.btn_suit3.visible = false;
        this.attriMap = {};
    }

    /**
     * 当前英灵已装备的套装
     */
    private curPetSuitIdArr: Array<GoodsInfo> = []
    private updateAttr() {
        if(!this._petData) return;
        this.clearAttr();
        this.equipArr = GoodsManager.Instance.getGoodsByBagType(BagType.PET_EQUIP_BAG);
        for (let i = 0; i < this.equipArr.length; i++) {
            const goodsInfo = this.equipArr[i];
            //判断英灵是否有穿戴装备
            if (goodsInfo.objectId == this._petData.petId) {
                let cell = this['part' + goodsInfo.pos] as PetEquipCell;
                if (cell) {
                    this.curPetSuitIdArr.push(goodsInfo);
                    cell.info = goodsInfo;
                    this.btn_suit_attri.visible = true;
                }

                if (goodsInfo.masterAttr) {
                    let tempArr = goodsInfo.masterAttr.split(';');
                    for (let i = 0; i < tempArr.length; i++) {
                        const element = tempArr[i];
                        if (element.length > 0) {
                            let arr = element.split(':');
                            let attId = Number(arr[0]);
                            let val = this.calAttr(attId, Number(arr[1]));
                            if (this.attriMap[attId]) {
                                this.attriMap[attId] += val;
                            } else {
                                this.attriMap[attId] = val;
                            }
                        }
                    }
                }

                if (goodsInfo.sonAttr) {
                    let tempArr = goodsInfo.sonAttr.split(';');
                    for (let i = 0; i < tempArr.length; i++) {
                        const element = tempArr[i];
                        if (element.length > 0) {
                            let arr = element.split(':');
                            let attId = Number(arr[0]);
                            // let val0 = (Number(arr[1]) + Number(arr[2]));
                            let val = this.calAttr(attId, Number(arr[1]));
                            if (this.attriMap[attId]) {
                                this.attriMap[attId] += val;
                            } else {
                                this.attriMap[attId] = val;
                            }
                        }
                    }
                }
            }
        }
        this.checkActiveSuit();
        let i: number = 0;
        for (const attId in this.attriMap) {
            if (this.attriMap.hasOwnProperty(attId)) {
                let val = this.attriMap[attId];
                let cfg: t_s_attributeData = TempleteManager.Instance.getPetEquipAttri(Number(attId));
                if (cfg) {
                    i++;
                    let attri_item = this.add_attri_tip.getChild('attri_item' + i) as GoodAttributeItem;
                    if (attri_item) {
                        attri_item.getChild('txt_attributeName').text = cfg.AttributeNameLang + ':';
                        attri_item.getChild('txt_attributeValue').text = '+' + val;
                        attri_item.visible = true;
                        this.addAttriNum++;
                    }
                }
            }
        }


        if (!this.curPart) {
            this.curPart = this.part0 as PetEquipCell;
            this.onClickPart(this.curPart, 0);
        } else {
            this.petCtrl.curPartInfo = this.curPart.info;
            NotificationManager.Instance.dispatchEvent(PetEvent.PET_EUIP_PART, this.petCtrl.selectPart);
        }
    }

    /**
     * 套装属性要显示在加成里面
     */
    // private getSuitAttr(AttributeId) {
    //     let result: number = 0;
    //     let cfgData = this.btn_suit1.data as t_s_petequipsuitData;
    //     if (cfgData) {
    //         if (cfgData.AttributeId == AttributeId && cfgData.ValueParam > 0) {
    //             result += cfgData.ValueParam;
    //         }
    //     }
    //     cfgData = this.btn_suit2.data as t_s_petequipsuitData;
    //     if (cfgData) {
    //         if (cfgData.AttributeId == AttributeId && cfgData.ValueParam > 0) {
    //             result += cfgData.ValueParam;
    //         }
    //     }
    //     cfgData = this.btn_suit3.data as t_s_petequipsuitData;
    //     if (cfgData) {
    //         if (cfgData.AttributeId == AttributeId && cfgData.ValueParam > 0) {
    //             result += cfgData.ValueParam;
    //         }
    //     }
    //     return result;
    // }

    private calAttr(attId: number, val: number) {
        let petData: PetData = this._petData;
        let result: number = 0;
        switch (attId) {
            case 1006:
                if (petData) {
                    result = (petData.physicalAttack + petData.bagAttack) * (val / 10000);
                } else {
                    result = val / 10000;
                }
                break;
            case 1007:
                if (petData) {
                    result = (petData.magicAttack + petData.bagMagicattack) * (val / 10000);
                } else {
                    result = val / 10000;
                }
                break;
            case 1008:
                if (petData) {
                    result = (petData.physicalDefense + petData.bagDefence) * (val / 10000);
                } else {
                    result = (val / 10000);
                }
                break;
            case 1009:
                if (petData) {
                    result = (petData.magicDefense + petData.bagMagicdefence) * (val / 10000);
                } else {
                    result = (val / 10000);
                }
                break;
            case 1010:
                if (petData) {
                    result = (petData.hp + petData.bagLiving) * (val / 10000);
                } else {
                    result = (val / 10000);
                }
                break;

            default:
                result = val;
                break;
        }

        return Math.round(result);
    }

    /**
     * 检测是否激活哪个套装效果
     */
    checkActiveSuit() {
        this.suitMap = {};

        // for (let i = 0; i < this.curPetSuitIdArr.length; i++) {
        //     const suitId = this.curPetSuitIdArr[i];
        //     if(this.suitMap[suitId] > 0){
        //         this.suitMap[suitId] += 1;
        //     }else{
        //         this.suitMap[suitId] = 1;
        //     }
        // }

        for (let i = 0; i < this.curPetSuitIdArr.length; i++) {
            const gInfo = this.curPetSuitIdArr[i];
            const suitId = gInfo.suitId;
            if (!this.suitMap[suitId]) {
                this.suitMap[suitId] = [];
            }

            let cfg: t_s_petequipsuitData = TempleteManager.Instance.getPetEquipSuitData(gInfo.suitId);
            if (cfg && (gInfo.strengthenGrade >= cfg.StrengthenGrow)) {
                this.suitMap[suitId].push(gInfo);
            }
        }

        let activeNum: number = 0;
        let totalActiveIdx: number = 0;
        for (const suitId in this.suitMap) {
            if (this.suitMap.hasOwnProperty(suitId)) {
                let suitArr = this.suitMap[suitId]
                let val = suitArr.length;//套装对应的数量
                let cfg: t_s_petequipsuitData = TempleteManager.Instance.getPetEquipSuitData(Number(suitId));
                if (cfg) {
                    if (val >= cfg.Amount) {
                        //要考虑到多套相同的套装
                        activeNum = Math.floor(val / cfg.Amount);
                        for (let k = 0; k < activeNum; k++) {
                            let btn = this['btn_suit' + (1 + totalActiveIdx)];
                            if(btn){
                                btn.data = cfg;
                                // if (cfg.SuitIcon.length > 0) {//显示激活套装标签
                                //     btn.icon = IconFactory.getCommonIconPath1(cfg.SuitIcon);
                                // }
                                // btn.visible = true;
                            }
                            totalActiveIdx++;
                            if (cfg.AttributeId > 0 && cfg.ValueParam > 0) {
                                if (this.attriMap[cfg.AttributeId]) {
                                    this.attriMap[cfg.AttributeId] += cfg.ValueParam;
                                } else {
                                    this.attriMap[cfg.AttributeId] = cfg.ValueParam;
                                }
                            }
                        }
                    }
                }
            }
        }

    }

    private addEvent() {
        // this.btn_suit1.onClick(this, this.onSuit1);
        // this.btn_suit2.onClick(this, this.onSuit2);
        // this.btn_suit3.onClick(this, this.onSuit3);
        this.btn_suit_attri.onClick(this, this.onSuit4);
        for (let i = 0; i < 6; i++) {
            const cell = this['part' + i] as PetEquipCell;
            cell.onClick(this, this.onClickPart, [cell, i]);
        }
        NotificationManager.Instance.addEventListener(PetEvent.PET_EUIP_BAG_PART, this.onBagPart, this);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.onPutonEquip, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.onPutoffEquip, this);
    }

    private removeEvent() {
        // this.btn_suit1.offClick(this, this.onSuit1);
        // this.btn_suit2.offClick(this, this.onSuit2);
        // this.btn_suit3.offClick(this, this.onSuit3);
        this.btn_suit_attri.offClick(this, this.onSuit4);
        for (let i = 0; i < 6; i++) {
            const cell = this['part' + i] as PetEquipCell;
            cell.offClick(this, this.onClickPart);
        }
        NotificationManager.Instance.removeEventListener(PetEvent.PET_EUIP_BAG_PART, this.onBagPart, this);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.onPutonEquip, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.onPutoffEquip, this);
    }

    onBagPart(part: number) {
        this.curPart = this['part' + part];
        this.onClickPart(this.curPart, part);
    }

    /**
     * 穿装备 从英灵背包27删除, 到英灵装备背包28
     * @param goods 
     */
    onPutonEquip(goodes: GoodsInfo[]) {
        let upd = false;
        for (let goods of goodes)
            if (goods.bagType == BagType.PET_EQUIP_BAG) {
                // let idx = goods.templateInfo.SonType-501;//物品模板的sonType 501-506  对应6个部位
                //要穿戴的装备是否能穿在当前选中的部位
                if(this.curPart){
                    this.curPart.info = goods;
                }
                if(this.petCtrl){
                    this.petCtrl.curPartInfo = goods;
                }
                upd = true;
            }
        upd && this.updateAttr();
    }

    /**
     * 卸下装备 从英灵装备背包28删除, 到英灵背包27
     * @param goods 
     */
    onPutoffEquip(goodes: GoodsInfo[]) {
        let upd = false;
        for (let goods of goodes) {
            if (goods.bagType == BagType.PET_EQUIP_BAG) {
                if(this.curPart){
                    this.curPart.info = null;
                }
                if(this.petCtrl){
                    this.petCtrl.curPartInfo = null;
                }
                upd = true;
            }
        }

        upd && this.updateAttr();

    }

    /**
     * 点击部位
     * @param part 
     */
    onClickPart(target: any, part: number) {
        if (this.petCtrl.selectPart == part) {
            return;
        }
        this.img_select.x = target.x - 5;
        this.img_select.y = target.y - 5;
        this.curPart = target;
        this.petCtrl.selectPart = part;
        this.petCtrl.curPartInfo = this.curPart.info;
        NotificationManager.Instance.dispatchEvent(PetEvent.PET_EUIP_PART, part);
    }

    private get petCtrl(): PetCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Pet) as PetCtrl;
    }

    // onSuit1() {
    //     this.showSuitTip(this.btn_suit1.data as t_s_petequipsuitData);
    // }

    // onSuit2() {
    //     this.showSuitTip(this.btn_suit2.data as t_s_petequipsuitData);
    // }

    // onSuit3() {
    //     this.showSuitTip(this.btn_suit3.data as t_s_petequipsuitData);
    // }

    /**
     * 显示激活套装效果
     */
    private showSuitTip(cfg: t_s_petequipsuitData) {
        if (!this.suit_tip.visible && cfg) {
            Logger.log('---------', cfg.AttributeId);
            this.suit_tip.visible = true;
            this.suit_tip.getChild('nameTxt').text = cfg.SuitName;
            this.suit_tip.getChild('txt1').text = LangManager.Instance.GetTranslation('petEuip.tip04', cfg.Amount);
            this.suit_tip.getChild('descTxt').text = cfg.DescriptionLang;
            this.suit_tip.getChild('img_loader').asLoader.url = IconFactory.getCommonIconPath1(cfg.SuitIcon);
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.__onClickHandler);
        }
    }

    onSuit4() {
        if (!this.add_attri_tip.visible) {
            this.add_attri_tip.visible = true;
            this.add_attri_tip.y = 15 * (15 - this.addAttriNum)
            Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.__onClickHandler);
        }
    }

    private __onClickHandler() {
        this.add_attri_tip.visible = false;
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.__onClickHandler);
        this.suit_tip.visible = false;
    }


    dispose(): void {
        this.petCtrl.selectPart = -1;
        this.removeEvent();
        super.dispose();
    }
}