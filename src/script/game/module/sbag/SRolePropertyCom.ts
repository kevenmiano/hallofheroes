// @ts-nocheck
import FUI_SRolePropertyCom from "../../../../fui/SBag/FUI_SRolePropertyCom";
import LangManager from "../../../core/lang/LangManager";
import UIManager from "../../../core/ui/UIManager";
import { BagEvent } from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import GoodsSonType from "../../constant/GoodsSonType";
import { GoodsType } from "../../constant/GoodsType";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { GoodsManager } from "../../manager/GoodsManager";
import FUIHelper from "../../utils/FUIHelper";

/**
 * 新版背包
 * @description 属性界面
 * @author zhihua.zhou
 * @date 2022/12/2
 * @ver 1.3
 */
export class SRolePropertyCom extends FUI_SRolePropertyCom {
    private _data: ThaneInfo
    private _propertyNameList: string[];
    private _pointNameList_0: string[];
    private isInited: boolean = false;
    onConstruct() {
        super.onConstruct();
        let str = "[color=#ffc68f]{propertyName=力量}: [/color] [color=#ffecc6]{property=6543218}[/color]";
        for (let i = 0; i <= 7; i++) {
            const element = this["txt_point_" + i];
            if (element) {
                if(i<5){
                    element.text = str;
                }
            }
            const element1 = this["txt_property_" + i];
            if (element1) {
                if(i!=4 && i!=5){
                    element1.text = str;
                }
            }
        }
        
    }

    private setData(params: ThaneInfo) {
        this._data = params;
        let ins = LangManager.Instance;
        this._propertyNameList = [ins.GetTranslation("armyII.ThaneAttributeView.Tip06"),//物理攻击
        ins.GetTranslation("armyII.ThaneAttributeView.Tip07"),//物理防御
        ins.GetTranslation("armyII.ThaneAttributeView.Tip08"),//魔法攻击
        ins.GetTranslation("armyII.ThaneAttributeView.Tip09"),//魔法防御
        ins.GetTranslation("armyII.ThaneAttributeView.Tip31"),//暴击值
        ins.GetTranslation("armyII.ThaneAttributeView.Tip32"),//格挡值
        ins.GetTranslation("pet.hp"),//生命值
        ins.GetTranslation("armyII.ThaneAttributeView.Tip12"),//带兵数
        ];

        this._pointNameList_0 = [ins.GetTranslation("armyII.ThaneAttributeView.Tip01"),//力量
        ins.GetTranslation("armyII.ThaneAttributeView.Tip02"),//护甲
        ins.GetTranslation("armyII.ThaneAttributeView.Tip03"),//智力
        ins.GetTranslation("armyII.ThaneAttributeView.Tip04"),//体质
        ins.GetTranslation("armyII.ThaneAttributeView.Tip05"),//统帅
        ins.GetTranslation("armyII.ThaneAttributeView.Tip23"),//强度
        ins.GetTranslation("armyII.ThaneAttributeView.Tip24"),//韧性
        ];
        this.updateView();
    }

    onShow(params: ThaneInfo) {
        if (!this.isInited) {
            this.addEvent();
            this.isInited = true;
        }
        this.setData(params);
    }

    onHide() {
        if (this.isInited) {
            this.isInited = false;
            this.removeEvent();
        }
    }

    private addEvent() {
        this.btn_help.onClick(this, this.onHelp);
        ArmyManager.Instance.army.baseHero.addEventListener(PlayerEvent.THANE_INFO_UPDATE, this.__thaneInfoChangeHandler, this);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__bagItemUpdateHandler, this);
        this.txt_point_value5.onClick(this,this.txtClickHander1);
    }

    private removeEvent() {
        this.btn_help.offClick(this, this.onHelp);
        ArmyManager.Instance.army.baseHero.removeEventListener(PlayerEvent.THANE_INFO_UPDATE, this.__thaneInfoChangeHandler, this);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__bagItemUpdateHandler, this);
    }

    private txtClickHander1(){

    }

    private __bagItemUpdateHandler(infos: GoodsInfo[]) {
        for (let info of infos)
            if (info.objectId == this._data.id && info.templateInfo.MasterType == GoodsType.EQUIP) {
                this.updateView();
            }
            else if (info.userId == this._data.userId && info.templateInfo.SonType == GoodsSonType.RESIST_GEM) {
                this.updateView();
            }
    }

    private __thaneInfoChangeHandler(thane: ThaneInfo) {
        if (!this._data) {
            return;
        }
        if (this._data.id == thane.id) {
            this.updateView();
        }
    }

    private updateView() {
        this.txt_point_0.setVar("propertyName", `${this._pointNameList_0[0]}`).setVar("property", `${this._data.baseProperty.totalPower /*+ model.addStrength*/}`).flushVars();
        this.txt_point_1.setVar("propertyName", `${this._pointNameList_0[1]}`).setVar("property", `${this._data.baseProperty.totalAgility /*+ model.addAgility*/}`).flushVars();
        this.txt_point_2.setVar("propertyName", `${this._pointNameList_0[2]}`).setVar("property", `${this._data.baseProperty.totalIntellect /*+ model.addAbility*/}`).flushVars();
        this.txt_point_3.setVar("propertyName", `${this._pointNameList_0[3]}`).setVar("property", `${this._data.baseProperty.totalPhysique /*+ model.addPhysique*/}`).flushVars();
        this.txt_point_4.setVar("propertyName", `${this._pointNameList_0[4]}`).setVar("property", `${this._data.baseProperty.totalCaptain /*+ model.addCaptain*/}`).flushVars();
        this.txt_point_value5.text = this._data.attackProrerty.totalIntensity.toString();
        this.txt_point_value6.text = this._data.attackProrerty.totalTenacity.toString();
        let value1:any= 0;
        let value2:any = 0;
        if(this._data.attackProrerty.totalIntensity>0){
            value1 = (100*this._data.attackProrerty.totalIntensity/(this._data.attackProrerty.totalIntensity+8000)).toFixed(2);
        }
        if(this._data.attackProrerty.totalTenacity>0){
            value2 = (100*this._data.attackProrerty.totalTenacity/(this._data.attackProrerty.totalTenacity+8000)).toFixed(2);
        }
        let point5Tips:string = LangManager.Instance.GetTranslation("SRolePropertyCom.tips1",value1);
        let point6Tips:string = LangManager.Instance.GetTranslation("SRolePropertyCom.tips2",value2);
        FUIHelper.setTipData(
            this.txt_point_5,
            EmWindow.CommonTips,
            point5Tips
        );
        FUIHelper.setTipData(
            this.txt_point_6,
            EmWindow.CommonTips,
            point6Tips
        );
        this.txt_property_0.setVar("propertyName", `${this._propertyNameList[0]}`).setVar("property", `${this._data.attackProrerty.totalPhyAttack}`).flushVars();
        this.txt_property_1.setVar("propertyName", `${this._propertyNameList[1]}`).setVar("property", `${this._data.attackProrerty.totalPhyDefence}`).flushVars();
        this.txt_property_2.setVar("propertyName", `${this._propertyNameList[2]}`).setVar("property", `${this._data.attackProrerty.totalMagicAttack}`).flushVars();
        this.txt_property_3.setVar("propertyName", `${this._propertyNameList[3]}`).setVar("property", `${this._data.attackProrerty.totalMagicDefence}`).flushVars();
        this.txt_property_value4.text = this._data.attackProrerty.totalForceHit.toString();
        this.txt_property_value5.text = this._data.attackProrerty.totalParry.toString();
        this.txt_property_6.setVar("propertyName", `${this._propertyNameList[6]}`).setVar("property", `${this._data.attackProrerty.totalLive}`).flushVars();
        this.txt_property_7.setVar("propertyName", `${this._propertyNameList[7]}`).setVar("property", `${this._data.attackProrerty.totalConatArmy}`).flushVars();
        let value4:any = 0;
        if(this._data.attackProrerty.totalForceHit >0){
            value4 = (this._data.attackProrerty.totalForceHit/ArmyManager.Instance.thane.grades/1.5).toFixed(2);
        }
        value4 = value4<=(ArmyManager.Instance.thane.grades*2+10)?value4:(ArmyManager.Instance.thane.grades*2+10);
        value4 = value4<=150?value4:150;
        let propertyTips4:string = LangManager.Instance.GetTranslation("SRolePropertyCom.tips3",value4);

        let value5:any = 0;
        if(this._data.attackProrerty.totalParry >0){
            value5 = (this._data.attackProrerty.totalParry/ArmyManager.Instance.thane.grades/1.5).toFixed(2);
        }
        value5 = value5<=(ArmyManager.Instance.thane.grades*2+10)?value5:(ArmyManager.Instance.thane.grades*2+10);
        value5 = value5<=150?value5:150;
        let propertyTips5:string = LangManager.Instance.GetTranslation("SRolePropertyCom.tips4",value5);

        FUIHelper.setTipData(
            this.txt_property_4,
            EmWindow.CommonTips,
            propertyTips4
        );
        FUIHelper.setTipData(
            this.txt_property_5,
            EmWindow.CommonTips,
            propertyTips5
        );
    }

    private onHelp() {
        let title = '';
        let content = '';
        title = LangManager.Instance.GetTranslation("public.help");
        content = LangManager.Instance.GetTranslation("role.roleProperty.helpContent");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    public dispose() {
        super.dispose();
    }
}