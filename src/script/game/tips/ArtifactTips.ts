import LangManager from "../../core/lang/LangManager";
import UIManager from "../../core/ui/UIManager";
import { IconFactory } from "../../core/utils/IconFactory";
import StringHelper from "../../core/utils/StringHelper";
import SimpleAlertHelper, { AlertBtnType } from "../component/SimpleAlertHelper";
import { t_s_petartifactpropertyData } from "../config/t_s_petartifactproperty";
import { BagType } from "../constant/BagDefine";
import ColorConstant from "../constant/ColorConstant";
import { CommonConstant } from "../constant/CommonConstant";
import { EmPackName, EmWindow } from "../constant/UIDefine";
import { NotificationEvent } from "../constant/event/NotificationEvent";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { GoodsManager } from "../manager/GoodsManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { NotificationManager } from "../manager/NotificationManager";
import { PlayerManager } from "../manager/PlayerManager";
import { ResourceManager } from "../manager/ResourceManager";
import { TempleteManager } from "../manager/TempleteManager";
import { BagHelper } from "../module/bag/utils/BagHelper";
import PetCtrl from "../module/pet/control/PetCtrl";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { GoodsCheck } from "../utils/GoodsCheck";
import BaseTips from "./BaseTips";

export default class ArtifactTips extends BaseTips {
    public isIdentify: fgui.Controller;
    public isEquip: fgui.Controller;
    public selectCtr: fgui.Controller;
    public isInbag: fgui.Controller;
    public bg: fgui.GLoader;
    public profile: fgui.GLoader;
    public goodsIcon: fgui.GLoader;
    public txt_name: fgui.GTextField;
    public desctxt1: fgui.GTextField;
    public desctxt2: fgui.GTextField;
    public desctxt3: fgui.GTextField;
    public levelTxt: fgui.GTextField;
    public subBox1: fgui.GGroup;
    public txt_addition: fgui.GRichTextField;
    public btn_identify: fgui.GButton;
    public btn_reset: fgui.GButton;
    public btn_select: fgui.GButton;
    public btn_cancel: fgui.GButton;
    public btn_equip: fgui.GButton;
    public btn_moveOut: fgui.GButton;
    public btn_putIn: fgui.GButton;
    public btn_getOut: fgui.GButton;
    public totalBox: fgui.GGroup;
    public btnGroup: fgui.GGroup;
    private _fromeType: number = 0;//大类 通过BaseItem里面进来的
    private _info: GoodsInfo;
    private _templateData: t_s_petartifactpropertyData;
    public static OTHER_TYPE: number = 999;
    //0重铸左边格子 1重铸右边格子 2 背包已鉴定 3背包未鉴定 4英灵界面未鉴定 5英灵界面已经鉴定未装备 6英灵界面已装备 7 其他
    public OnInitWind() {
        super.OnInitWind();
        this.initData();
        this.initView();
        this.addEvent()
        this.totalBox.ensureBoundsCorrect();
    }

    private initData() {
        this._info = this.params[0][0];
        this._fromeType = this.params[0][1];
        this.isEquip = this.getController("isEquip");
        this.isIdentify = this.getController("isIdentify");
        this.isInbag = this.getController("isInbag");
        if (this._info) {
            this._templateData = TempleteManager.Instance.getArtifactTemplate(this._info.templateId);
            if (this._fromeType == ArtifactTips.OTHER_TYPE) {//从背包和其他地方打开的
                if (this._info.bagType == BagType.Player) {
                    if (PlayerManager.Instance.currentPlayerModel.bagWndIsOpen) {
                        this._fromeType = 7;
                    } else {
                        if (GoodsCheck.hasIdentify(this._info)) {//已经鉴定
                            this._fromeType = 2;
                        } else {
                            this._fromeType = 3;
                        }
                    }
                } else if (this._info.bagType == BagType.Storage) {//取出
                    this._fromeType = 8;
                } else {
                    this._fromeType = 9;
                }
            }
        }
    }

    private initView() {
        if (this._info && this._info.templateInfo) {
            this.desctxt1.text = LangManager.Instance.GetTranslation("ArtifactCell.descTxt");
            this.txt_name.text = this._info.templateInfo.TemplateNameLang;
            this.levelTxt.text = LangManager.Instance.GetTranslation("public.level3", this._templateData.Level);
            let res = CommonConstant.QUALITY_RES[this._info.templateInfo.Profile - 1];
            this.goodsIcon.icon = IconFactory.getGoodsIconByTID(this._info.templateInfo.TemplateId);
            this.profile.icon = fgui.UIPackage.getItemURL(EmPackName.Base, res);
            this.txt_name.color = this._info.templateInfo.profileColor;
            this.isEquip.selectedIndex = GoodsCheck.hasEquipArtifact(this._info) ? 1 : 0;
            this.isIdentify.selectedIndex = GoodsCheck.hasIdentify(this._info) ? 1 : 0;
            this.isInbag.selectedIndex = this._fromeType;
            if (this._fromeType == 9) {
                this.btnGroup.visible = false;
            } else {
                this.btnGroup.visible = true;
            }
            if (GoodsCheck.hasIdentify(this._info)) {//已经鉴定过的
                this.txt_addition.text = this.getAddTxt(this._info);
            } else {
                this.txt_addition.text = this.getDescTxt(this._info);
            }
        }
    }

    private addEvent() {
        this.btn_identify.onClick(this, this.onIdentifyClick.bind(this));
        this.btn_reset.onClick(this, this.onResetClick.bind(this));
        this.btn_select.onClick(this, this.onSelectClick.bind(this));
        this.btn_cancel.onClick(this, this.onCancelClick.bind(this));
        this.btn_equip.onClick(this, this.onEquipClick.bind(this));
        this.btn_moveOut.onClick(this, this.onMoveOutClick.bind(this));
        this.btn_putIn.onClick(this, this.onPutInClick.bind(this));
        this.btn_getOut.onClick(this, this.onGetOutClick.bind(this));
    }

    removeEvent() {
        this.btn_identify.offClick(this, this.onIdentifyClick.bind(this));
        this.btn_reset.offClick(this, this.onResetClick.bind(this));
        this.btn_select.offClick(this, this.onSelectClick.bind(this));
        this.btn_cancel.offClick(this, this.onCancelClick.bind(this));
        this.btn_equip.offClick(this, this.onEquipClick.bind(this));
        this.btn_moveOut.offClick(this, this.onMoveOutClick.bind(this));
        this.btn_putIn.offClick(this, this.onPutInClick.bind(this));
        this.btn_getOut.offClick(this, this.onGetOutClick.bind(this));
    }

    //鉴定
    onIdentifyClick() {
        this.hide();
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        let content: string = LangManager.Instance.GetTranslation("ArtifactTips.alertTxt", this._templateData.ActiveGold);
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, (b: boolean) => {
            if (b) {
                SimpleAlertHelper.Instance.Hide();
                if (this._templateData.ActiveGold > ResourceManager.Instance.gold.count) {//黄金不够，提示
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("public.gold"));
                    return;
                }
                PetCtrl.sendArtifactIndentify(this._info.pos);
            }
        }, AlertBtnType.OC, false, true);
    }

    //重铸
    onResetClick() {
        //打开重铸界面
        FrameCtrlManager.Instance.open(EmWindow.ArtifactResetWnd, this._info);
        this.hide();
    }

    //选择
    onSelectClick() {
        if (GoodsCheck.hasEquipArtifact(this._info)) {//已经装备了
            let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            let content: string = LangManager.Instance.GetTranslation("ArtifactTips.selectTips");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, (b: boolean) => {
                if (b) {
                    NotificationManager.Instance.dispatchEvent(NotificationEvent.ARTIFACT_SELECT_GOODS_UPDATE, this._info);
                    this.hide();
                }
                this.hide();
            }, AlertBtnType.OC, true, true);
        } else {
            NotificationManager.Instance.dispatchEvent(NotificationEvent.ARTIFACT_SELECT_GOODS_UPDATE, this._info);
            this.hide();
        }
    }

    //取消
    onCancelClick() {
        NotificationManager.Instance.dispatchEvent(NotificationEvent.ARTIFACT_CANCEL_GOODS_UPDATE, this._info);
        this.hide();
    }

    //装备
    onEquipClick() {
        let targetPos: number = this.getPos();
        if (targetPos == -1) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ArtifactTips.equipTips"))
            this.hide();
            return;
        }
        PlayerManager.Instance.moveBagToBag(this._info.bagType, this.petCtrl.selectedPet.petId, this._info.pos, BagType.PET_EQUIP_BAG, 0, targetPos, 1);
        this.hide();
    }

    //卸载
    onMoveOutClick() {
        let endPos: number = GoodsManager.Instance.findEmputyPos();
        if (endPos == -1) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Artifact.moveTips"))
            return;
        }
        PlayerManager.Instance.moveBagToBag(BagType.PET_EQUIP_BAG, this.petCtrl.selectedPet.petId, this._info.pos, BagType.Player, 0, endPos, 1);
        this.hide();
    }

    private onPutInClick(){
        BagHelper.moveRoleBagToConsortiaBag(this._info);
        this.hide();
    }

    private onGetOutClick(){
        BagHelper.moveConsortiaToRoleBag(this._info);
        this.hide();
    }
    
    private get petCtrl(): PetCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Pet) as PetCtrl;
    }

    private getPos(): number {
        let hasSix: boolean = false;
        let hasSeven: boolean = false;
        let equipArr = GoodsManager.Instance.getGoodsByBagType(BagType.PET_EQUIP_BAG);
        for (let i = 0; i < equipArr.length; i++) {
            let goodsInfo = equipArr[i];
            if (goodsInfo.pos == 6 && goodsInfo.objectId == this.petCtrl.selectedPet.petId) {
                hasSix = true;
            } else if (goodsInfo.pos == 7 && goodsInfo.objectId == this.petCtrl.selectedPet.petId) {
                hasSeven = true;
            }
        }
        if (!hasSix) {//6没有安装
            return 6;
        } else {
            if (!hasSeven) {
                return 7;
            } else {
                return -1;
            }
        }
    }

    private getAddTxt(info: GoodsInfo): string {
        let str: string;
        if (info) {
            if (info.randomSkill1 > 0) {
                if (!StringHelper.isNullOrEmpty(str)) {
                    str += LangManager.Instance.GetTranslation("ArtifactTips.itemTitle1", info.randomSkill1) + "<br/>";
                } else {
                    str = LangManager.Instance.GetTranslation("ArtifactTips.itemTitle1", info.randomSkill1) + "<br/>";
                }
            }
            if (info.randomSkill2 > 0) {
                if (!StringHelper.isNullOrEmpty(str)) {
                    str += LangManager.Instance.GetTranslation("ArtifactTips.itemTitle2", info.randomSkill2) + "<br/>";
                } else {
                    str = LangManager.Instance.GetTranslation("ArtifactTips.itemTitle2", info.randomSkill2) + "<br/>";
                }
            }
            if (info.randomSkill3 > 0) {
                if (!StringHelper.isNullOrEmpty(str)) {
                    str += LangManager.Instance.GetTranslation("ArtifactTips.itemTitle3", info.randomSkill3) + "<br/>";
                } else {
                    str = LangManager.Instance.GetTranslation("ArtifactTips.itemTitle3", info.randomSkill3) + "<br/>";
                }
            }
            if (info.randomSkill4 > 0) {
                if (!StringHelper.isNullOrEmpty(str)) {
                    str += LangManager.Instance.GetTranslation("ArtifactTips.itemTitle4", info.randomSkill4) + "<br/>";
                } else {
                    str = LangManager.Instance.GetTranslation("ArtifactTips.itemTitle4", info.randomSkill4) + "<br/>";
                }
            }
            if (info.randomSkill5 > 0) {
                if (!StringHelper.isNullOrEmpty(str)) {
                    str += LangManager.Instance.GetTranslation("ArtifactTips.itemTitle5", info.randomSkill5);
                } else {
                    str = LangManager.Instance.GetTranslation("ArtifactTips.itemTitle5", info.randomSkill5);
                }
            }
        }
        return str;
    }

    private getDescTxt(info: GoodsInfo): string {
        let str: string;
        if (info) {
            if (!this._templateData) return str;
            if (this._templateData.MinAtk > 0) {
                if (!StringHelper.isNullOrEmpty(str)) {
                    str += LangManager.Instance.GetTranslation("ArtifactTips.itemTitle6", this._templateData.MinAtk, this._templateData.MaxAtk) + "<br/>";
                } else {
                    str = LangManager.Instance.GetTranslation("ArtifactTips.itemTitle6", this._templateData.MinAtk, this._templateData.MaxAtk) + "<br/>";
                }
            }
            if (this._templateData.MinMat > 0) {
                if (!StringHelper.isNullOrEmpty(str)) {
                    str += LangManager.Instance.GetTranslation("ArtifactTips.itemTitle7", this._templateData.MinMat, this._templateData.MaxMat) + "<br/>";
                } else {
                    str = LangManager.Instance.GetTranslation("ArtifactTips.itemTitle7", this._templateData.MinMat, this._templateData.MaxMat) + "<br/>";
                }
            }
            if (this._templateData.MinDef > 0) {
                if (!StringHelper.isNullOrEmpty(str)) {
                    str += LangManager.Instance.GetTranslation("ArtifactTips.itemTitle8", this._templateData.MinDef, this._templateData.MaxDef) + "<br/>";
                } else {
                    str = LangManager.Instance.GetTranslation("ArtifactTips.itemTitle8", this._templateData.MinDef, this._templateData.MaxDef) + "<br/>";
                }
            }
            if (this._templateData.MinMdf > 0) {
                if (!StringHelper.isNullOrEmpty(str)) {
                    str += LangManager.Instance.GetTranslation("ArtifactTips.itemTitle9", this._templateData.MinMdf, this._templateData.MaxMdf) + "<br/>";
                } else {
                    str = LangManager.Instance.GetTranslation("ArtifactTips.itemTitle9", this._templateData.MinMdf, this._templateData.MaxMdf) + "<br/>";
                }
            }
            if (this._templateData.MinHp > 0) {
                if (!StringHelper.isNullOrEmpty(str)) {
                    str += LangManager.Instance.GetTranslation("ArtifactTips.itemTitle10", this._templateData.MinHp, this._templateData.MaxHp);
                } else {
                    str = LangManager.Instance.GetTranslation("ArtifactTips.itemTitle10", this._templateData.MinHp, this._templateData.MaxHp);
                }
            }
        }
        return str;
    }

    public dispose(dispose?: boolean): void {
        this.removeEvent();
        super.dispose();
    }
}