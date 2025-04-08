// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2023-04-24 19:58:04
 * @LastEditors: jeremy.xu
 * @Description: 炼化
 */

import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import LangManager from '../../../../core/lang/LangManager';
import { BaseItem } from '../../../component/item/BaseItem';
import { t_s_composeData } from '../../../config/t_s_compose';
import UIButton from '../../../../core/ui/UIButton';
import { PetData } from "../data/PetData";
import PetModel from '../data/PetModel';
import { t_s_pettemplateData } from "../../../config/t_s_pettemplate";
import { ShowPetAvatar } from "../../../avatar/view/ShowPetAvatar";
import PetCtrl from '../control/PetCtrl';
import BaseTipItem from "../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";


export default class UIRefining extends BaseFguiCom {
    private payType: number = -1;
    private petId: number = 0;
    private txtName: fgui.GLabel;
    private txtNameAdvance: fgui.GLabel;
    private _mainPetView: ShowPetAvatar; //主英灵
    private _composedPreView: ShowPetAvatar;  //预览
    private _mainPetData: PetData;
    private _composedPetData: PetData;
    private txtTip: fgui.GLabel;
    public set mainData(data: PetData) {
        this._mainPetData = data;
        if (data) {
            this._mainPetView.data = data.template;
        } else {
            this._mainPetView.data = null;
        }
    }
    public set composedData(data: PetData) {
        this._composedPetData = data;
        if (data) {
            this._composedPreView.data = data.template;
        } else {
            this._composedPreView.data = null;
        }
    }
    public get composedData(): PetData {
        return this._composedPetData
    }
    private _composeTemplate: t_s_composeData;

    private txtCost: fgui.GLabel;
    private btnRefining: UIButton;
    private metaList: fgui.GList;
    private cRefining: fgui.Controller;

    public dragCallBack: Function;
    public tipItem:BaseTipItem;
    constructor(comp: fgui.GComponent) {
        super(comp)
        this.txtCost.text = LangManager.Instance.GetTranslation("public.defaultnumber");
        this.cRefining = this.getController("cRefining");
        this.txtTip.text = LangManager.Instance.GetTranslation("UIRefining.txtTips2")
        this._mainPetView = new ShowPetAvatar()
        comp.displayObject.addChild(this._mainPetView)
        this._composedPreView = new ShowPetAvatar()
        comp.displayObject.addChild(this._composedPreView)
        this._composedPreView.x = 768
        this._composedPreView.y = 556
        this._mainPetView.x = 280
        this._mainPetView.y = 556
        this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    }

    private _data: PetData;
    public get data(): PetData {
        return this._data;
    }

    public set data(value: PetData) {
        if (!PetModel.checkCanComposeAndTip(value)) {
            this.dragCallBack && this.dragCallBack(null);
            return;
        }

        this._data = value;

        this.updateView();
    }

    private updateView() {
        this._composeTemplate = this.getComposeTemplate(this._data);
        if (!this._composeTemplate) {
            this.txtTip.text = LangManager.Instance.GetTranslation("UIRefining.txtTips1");
            this.mainData = this._data;
            return;
        }
       
        this.cRefining.selectedIndex = 1;
        this.txtTip.text = "";
        //更新黄金
        this.txtCost.text = this._composeTemplate.NeedGold + "";
        this.txtCost.color = (this._composeTemplate.NeedGold > ResourceManager.Instance.gold.count) ? "#ff0000" : "#FFECC6";

        //更新材料, Material2, Material3, Material4
        for (let i: number = 0; i < 4; i++) {
            let item: BaseItem = this.metaList.getChildAt(i) as BaseItem;
            let index: number = i + 2;
            if (this._composeTemplate.hasOwnProperty("Material" + index) && this._composeTemplate["Material" + index] > 0) {
                item.visible = true;
                let goodsInfo: GoodsInfo = item.info;
                if (!goodsInfo) {
                    goodsInfo = new GoodsInfo();
                }
                goodsInfo.templateId = this._composeTemplate["Material" + index];
                let ownNum = GoodsManager.Instance.getGoodsNumByTempId(goodsInfo.templateId);
                let needNum = this._composeTemplate["Count" + index];
                item.info = goodsInfo;
                item.title = ownNum + "/" + needNum;
                item.isLack.selectedIndex = ownNum < needNum ? 1 : 0;
            } else {
                item.info = null;
                item.visible = false;
            }
        }

        //更新预览
        let composeTmp = this.getComposedPetData(this._data, this._composeTemplate);
        this.composedData = composeTmp;
        this.mainData = this._data;

        this.txtName.text = this._data.name;
        this.txtNameAdvance.text = composeTmp.name;
        this.txtName.color = PetData.getQualityColor(this._data.quality - 1)
        this.txtNameAdvance.color = PetData.getQualityColor(composeTmp.quality - 1)

        //融合按钮
        this.btnRefining.enabled = this.hasEnoughMaterial();
    }

    private btnRefiningClick() {
        if (!this._data) return;
        if (!this._composeTemplate) return;
        if (!this._composedPetData) return;
        // if (!this.hasEnoughMaterial()) return;

        // let msg: string;
        // let thaneInfo: ThaneInfo = ArmyManager.Instance.thane;
        // if (thaneInfo.grades < this._composedPetData.template.NeedGrade) {
        //     msg = LangManager.Instance.GetTranslation("petCompose.playerGrade");
        // }
        // else if (this._data.isEnterWar) {
        //     msg = LangManager.Instance.GetTranslation("petCompose.isEnterWar");
        // }
        // else if (this._data.isPractice) {
        //     msg = LangManager.Instance.GetTranslation("petCompose.isPractice");
        // }
        // else if (PlayerManager.Instance.currentPlayerModel.playerInfo.petChallengeFormationOfArray.indexOf(this._data.petId + "") >= 0) {
        //     msg = LangManager.Instance.GetTranslation("pet.inPetChanglle3");
        // }
        // else if (this._data.isRemote) {
        //     msg = LangManager.Instance.GetTranslation("pet.inRemotePet3");
        // }

        // if (msg) {
        //     MessageTipManager.Instance.show(msg);
        //     return;
        // }

        let content: string = LangManager.Instance.GetTranslation("petCompose.confirm3");
        SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b: boolean, flag: boolean) => {
            if (!b) return;
            if (this._data) {
                let petId = this._data.petId;
                this.payType = -1;
                this.btnRefining.enabled = false;

                if (petId != 0) {
                    PetCtrl.composePet(petId);
                    this.resetView();
                }
            }
        });
    }

    private btnResetClick() {
        this.resetView();
    }

    private hasEnoughMaterial(): boolean {
        let result: boolean = true;
        if (ResourceManager.Instance.gold.count < this._composeTemplate.NeedGold) {
            result = false;
            return result;
        }

        for (let i: number = 0; i < this.metaList.numChildren; i++) {
            let item: BaseItem = this.metaList.getChildAt(i) as BaseItem;
            let goodsInfo: GoodsInfo = item.info;

            let index: number = i + 2;
            if (this._composeTemplate.hasOwnProperty("Material" + index) && this._composeTemplate["Material" + index] > 0) {
                if (GoodsManager.Instance.getGoodsNumByTempId(goodsInfo.templateId) < this._composeTemplate["Count" + index]) {
                    result = false;
                    break;
                }
            }
        }
        return result;
    }

    /**
     * 获取融合模板 
     * @param petData
     */
    public getComposeTemplate(petData: PetData): t_s_composeData {
        if (!petData) return null;
        let list: t_s_composeData[] = PetModel.getComposePetTemplateList();
        for (let index = 0; index < list.length; index++) {
            const info = list[index] as t_s_composeData;
            if (info.Material1 == petData.template.PetType &&
                info.Count1 == petData.template.Property2) {
                return info;
            }
        }
        return null;
    }

    /**
     * 获得预览英灵 
     * @param target 融合英灵
     * @param composeTemplate 融合模板
     * @return 
     */
    private getComposedPetData(target: PetData, composeTemplate: t_s_composeData): PetData {
        let p: PetData = target.clone();

        //换模板
        let list: t_s_pettemplateData[] = TempleteManager.Instance.getPetTemplatesByType(composeTemplate.Material1);
        for (let index = 0; index < list.length; index++) {
            const temp: t_s_pettemplateData = list[index];
            if (composeTemplate.NewMaterial == temp.Property2 && temp.Quality == p.quality) {
                p.templateId = temp.TemplateId;
                break;
            }
        }

        //更新战斗力
        p.intellect = p.intellectBase;
        p.strength = p.strengthBase;
        p.stamina = p.staminaBase;
        p.armor = p.armorBase;
        p.remainPoint = (p.grade - 1) * PetData.EACH_LEVEL_POINT;
        p.fightPower = PetData.calculatefightPower(p);
        p.name = p.template.TemplateNameLang;

        return p;
    }

    public resetView(hasCallBack: boolean = true) {
        this.txtCost.text = LangManager.Instance.GetTranslation("public.defaultnumber");
        let num: number = this.metaList.numChildren;
        for (let i: number = 0; i < num; i++) {
            let item: BaseItem = this.metaList.getChildAt(i) as BaseItem;
            item.info = null;
            item.title = "";
        }
        this.btnRefining.enabled = false;
        this._data = null;
        this.mainData = null;
        this.composedData = null;
        this._composeTemplate = null;
        this.txtName.text = "";
        this.txtNameAdvance.text = "";

        this.cRefining.selectedIndex = 0;
        if (hasCallBack) {
            this.dragCallBack && this.dragCallBack(null);
        }
    }

    public dispose() {
        this._mainPetView.dispose()
        this._composedPreView.dispose()
        super.dispose();
    }
}