// @ts-nocheck
import LangManager from '../../../core/lang/LangManager';
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import { ArrayConstant, ArrayUtils } from '../../../core/utils/ArrayUtils';
import { IconFactory } from "../../../core/utils/IconFactory";
import { t_s_pawntemplateData } from '../../config/t_s_pawntemplate';
import { ArmyPawn } from "../../datas/ArmyPawn";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { ResourceData } from "../../datas/resource/ResourceData";
import { PlayerManager } from "../../manager/PlayerManager";
import { ResourceManager } from "../../manager/ResourceManager";
import BuildingManager from "../../map/castle/BuildingManager";
import { BaseIcon } from "../../component/BaseIcon";
import StringHelper from '../../../core/utils/StringHelper';
import { MessageTipManager } from '../../manager/MessageTipManager';
import { t_s_buildingtemplateData } from '../../config/t_s_buildingtemplate';
import { EmWindow } from '../../constant/UIDefine';
import BaseTipItem from '../../component/item/BaseTipItem';
import TemplateIDConstant from '../../constant/TemplateIDConstant';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import AllocateCtrl from './control/AllocateCtrl';
import { ArmyManager } from '../../manager/ArmyManager';

/**
* @author:shujin.ou
* @data: 2021-02-19 20:37
* @description 招募
*/
export default class CasernRecruitWnd extends BaseWindow {
    private playerCom: BaseIcon;//兵种头像
    private NameTxt: fgui.GTextField;//名字
    private CostGoldNumTxt: fgui.GTextField;//消耗资源的数量
    public BtnConfirm: UIButton;//确定按钮

    private _pawn: ArmyPawn;
    private _maxNumber: number = 0;//所拥有的黄金最多可招募的士兵数量
    private _goldLimit: number;
    private _model: PlayerModel;
    private _pawnTemp: t_s_pawntemplateData;

    public btn_min: fgui.GButton;
    public btn_max: fgui.GButton;
    public btn_reduce: fgui.GButton;
    public btn_plus: fgui.GButton;
    public progressSlider: fgui.GSlider;
    public txt_num: fgui.GTextInput;
    private _soliderNumber: number = 0;
    private _min: number = 0;
    private _limit: number = 0;
    public tipItem: BaseTipItem;
    private _type: number = 0;
    private _initNumber:number = 200;
    public OnInitWind() {
        this.addEvent();
        this.setCenter();
        this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    }

    OnShowWind() {
        super.OnShowWind();
        this.Data();
    }

    private Data() {
        this._pawn = this.frameData;
        this._model = PlayerManager.Instance.currentPlayerModel;
        if (this._pawn != null) {
            let needpop: number = this._pawn.templateInfo.NeedPopulation;
            let popLimit: number = (this.population.limit - this.population.count) / needpop;
            this._goldLimit = this.getPopulationByGolds(this._pawn, this.gold.count);
            this._maxNumber = Math.min(popLimit, this._goldLimit);
            this._pawnTemp = this._pawn.templateInfo;
            this.NameTxt.text = this._pawn.templateInfo.PawnNameLang + " " + LangManager.Instance.GetTranslation("public.level4_space2", this._pawn.templateInfo.Level);

            this._limit = this._maxNumber;
            this._min = 1;
            if(this._maxNumber>this._initNumber){
                this.txt_num.text = this._initNumber.toString();
                this.progressSlider.value = Number(100 * this._initNumber / this._maxNumber);
                this.btn_max.enabled = true;
                this.btn_plus.enabled = true;
            }else{
                this.txt_num.text = this._maxNumber.toString();
                this.progressSlider.value = 100;
                this.btn_max.enabled = this.btn_plus.enabled = false;
            }
            if (this._maxNumber == 1) {
                this.btn_min.enabled = false;
            }
            else {
                this.btn_min.enabled = true;
            }
            this.refreshCost();
        }
        this.playerCom.setIcon(IconFactory.getSoldierIconByIcon(this._pawn.templateInfo.Icon));

    }

    private addEvent() {
        this.BtnConfirm.onClick(this, this.__onOKHandler.bind(this));
        this.txt_num.on(Laya.Event.INPUT, this, this.__buyNumChange);
        this.btn_min.onClick(this, this.minBtnHandler.bind(this));
        this.btn_max.onClick(this, this.maxBtnHandler.bind(this));
        this.btn_reduce.onClick(this, this.onReduce);
        this.btn_plus.onClick(this, this.onPlus);
        this.progressSlider.on(fairygui.Events.STATE_CHANGED, this, this.onChanged);
    }

    private removeEvent() {
        this.BtnConfirm.offClick(this, this.__onOKHandler.bind(this));
        this.txt_num.off(Laya.Event.INPUT, this, this.__buyNumChange);
        this.btn_min.offClick(this, this.minBtnHandler.bind(this));
        this.btn_max.offClick(this, this.maxBtnHandler.bind(this));
        this.btn_reduce.offClick(this, this.onReduce);
        this.btn_plus.offClick(this, this.onPlus);
        this.progressSlider.off(fairygui.Events.STATE_CHANGED, this, this.onChanged);
    }

    private onChanged() {
        if (this._maxNumber == 1) {
            this.txt_num.text = "1";
            this.btn_min.enabled = false;
            this.btn_max.enabled = false;
        } else {
            let value: number = this.progressSlider.value;
            let num: number = parseInt((value * this._maxNumber / 100).toString());
            if (num == 0) {
                this.txt_num.text = "1";
                this.btn_min.enabled = this.btn_reduce.enabled = false;
                this.btn_max.enabled = this.btn_plus.enabled = true;
            }
            else if (num == this._maxNumber) {
                this.txt_num.text = this._maxNumber.toString();
                this.btn_min.enabled = this.btn_reduce.enabled = true;
                this.btn_max.enabled = this.btn_plus.enabled = false;
            }
            else {
                this.txt_num.text = num.toString();
                this.btn_min.enabled = this.btn_plus.enabled = true;
                this.btn_max.enabled = this.btn_reduce.enabled = true;
            }
        }
        this.refreshCost();
    }

    private minBtnHandler() {
        this.txt_num.text = "1";
        this.progressSlider.value = 0;
        this.btn_min.enabled = this.btn_reduce.enabled = false;
        this.btn_max.enabled = this.btn_plus.enabled = true;
        this.refreshCost();
    }

    private maxBtnHandler() {
        this.txt_num.text = this._maxNumber.toString()
        this.progressSlider.value = 100;
        this.btn_min.enabled = this.btn_reduce.enabled = true;
        this.btn_max.enabled = this.btn_plus.enabled = false;
        this.refreshCost();
    }

    private Unit: number = 200;

    private onReduce() {
        this._soliderNumber -= this.Unit;
        this.progressSlider.value -= (this.Unit / this._maxNumber) * 100;
        if (this._soliderNumber <= 1) {
            this._soliderNumber = 1;
            this.btn_reduce.enabled = this.btn_min.enabled = false;
        }
        this.btn_plus.enabled = this.btn_max.enabled = true;
        this.txt_num.text = this._soliderNumber.toString();
        this.refreshCost();
    }

    private onPlus() {
        this._soliderNumber += this.Unit;
        this.progressSlider.value += (this.Unit / this._maxNumber) * 100;
        if (this._soliderNumber >= this._maxNumber) {
            this._soliderNumber = this._maxNumber;
            this.btn_plus.enabled = this.btn_max.enabled = false;
        }
        this.btn_reduce.enabled = this.btn_min.enabled = true;
        this.txt_num.text = this._soliderNumber.toString();
        this.refreshCost();
    }

    private refreshCost() {
        this._soliderNumber = parseInt(this.txt_num.text);
        this.CostGoldNumTxt.text = this.gold.count + "/" + this.recruitGold;
    }

    private __buyNumChange() {
       
        if (!StringHelper.isNullOrEmpty(this.txt_num.text)) {
            this._soliderNumber = parseInt(this.txt_num.text);
            if(this._soliderNumber<1){
                this._soliderNumber = 1;
            }
            if (this._limit < this._soliderNumber) {
                this._soliderNumber = this._limit;
            }
            this._soliderNumber = Math.min(Math.max(this._soliderNumber, this._min), this._soliderNumber);
            this.txt_num.text = isNaN(this._soliderNumber) ? "1" : this._soliderNumber.toString();
            this._soliderNumber = isNaN(this._soliderNumber) ? this._min : this._soliderNumber;
            this.CostGoldNumTxt.text = this.gold.count + "/" + this.recruitGold;
            this.setProgressSliderValue();
            if (parseInt(this.txt_num.text) == 1) {
                this.btn_min.enabled = false;
            }
            else {
                this.btn_min.enabled = true;
            }
            if (parseInt(this.txt_num.text) < this._maxNumber) {
                this.btn_max.enabled = true;
            }
            else {
                this.btn_max.enabled = false;
            }
        }
        else {
            this._soliderNumber = 0;
            this.setProgressSliderValue();
            this.btn_min.enabled = false;
            this.btn_max.enabled = true;
            this.CostGoldNumTxt.text = this.gold.count + "/" + this.recruitGold;
        }
    }

    private setProgressSliderValue() {
        this.progressSlider.value = Number(100 * this._soliderNumber / this._maxNumber);
    }

    private __onOKHandler() {
        if (StringHelper.isNullOrEmpty(this.txt_num.text)) {
            this._soliderNumber = 0;
        }
        else {
            this._soliderNumber = parseInt(this.txt_num.text);
        }
        if (this._soliderNumber == 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("CasernRecruitWnd.moveconfig"));
            return;
        }
        else {
            let curPawn: ArmyPawn = ArmyManager.Instance.army.getPawnByIndex(0);
            let dstId = curPawn.templateId;
            let dstCount = curPawn.ownPawns;
            let totalCanStaffingPawn = ArmyManager.Instance.army.baseHero.attackProrerty.totalConatArmy;//可以带兵的总数量
            // 城堡中拥有的准备上阵的兵的数量
            let castleOwnPawnCount = this._pawn.ownPawns;
            // 实际编排士兵
            let actualStaffingCount: number = 0;

            let emputyPos: number = ArmyManager.Instance.army.getEmputyPos();
            let needAuto:boolean = false;
            if (emputyPos == 0) {//空位置
                this._type = 1;
                needAuto = true;
                if (this._soliderNumber + castleOwnPawnCount >= totalCanStaffingPawn) {
                    actualStaffingCount = totalCanStaffingPawn
                } else if (this._soliderNumber + castleOwnPawnCount < totalCanStaffingPawn) {
                    actualStaffingCount = this._soliderNumber + castleOwnPawnCount;
                }
            }
            else {
                let curPawn: ArmyPawn = ArmyManager.Instance.army.getPawnByIndex(0);
                dstId = curPawn.templateId;
                dstCount = curPawn.ownPawns;
                if ((curPawn.ownPawns > 0) && (curPawn.templateId == this._pawn.templateId)) {//加兵
                    if (curPawn.ownPawns >= totalCanStaffingPawn){
                        actualStaffingCount = 0;
                    }
                    this._type = 2;
                    needAuto = true;
                    if (this._soliderNumber + curPawn.ownPawns >= totalCanStaffingPawn) {
                        actualStaffingCount = totalCanStaffingPawn - curPawn.ownPawns;
                    } else if (this._soliderNumber + curPawn.ownPawns < totalCanStaffingPawn) {
                        actualStaffingCount = this._soliderNumber;
                    }
                }
                else {//换兵
                    this._type = 3;
                    if (this._soliderNumber + castleOwnPawnCount >= totalCanStaffingPawn) {
                        actualStaffingCount = totalCanStaffingPawn
                    } else if (this._soliderNumber < totalCanStaffingPawn) {
                        actualStaffingCount = this._soliderNumber + castleOwnPawnCount;
                    }
                }
            }
            this.allocateControler.sendRecruitPawn(this._type, this._pawn, this._soliderNumber, actualStaffingCount, dstId, dstCount,needAuto);
            this.OnBtnClose();
        }
    }

    private get allocateControler(): AllocateCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.AllocateWnd) as AllocateCtrl;
    }

    private getPopulationByGolds(pawn: ArmyPawn, gold: number): number {
        let pawnTemp: t_s_pawntemplateData = this._pawn.templateInfo;
        let arr: Array<t_s_buildingtemplateData> = BuildingManager.Instance.getMaxEffectBuildingTemplate(pawnTemp);
        if (!arr) return 0;
        arr = ArrayUtils.sortOn(arr, "Property4", ArrayConstant.NUMERIC);
        let buildTemp: t_s_buildingtemplateData = arr[0];
        let race: number = buildTemp.Property4 / 100;
        let goldValue: number = this._model.playerEffect.getRecruitPawnResourceAddition(pawnTemp.GoldConsume * (1 - race));
        return parseInt((gold / goldValue).toString());
    }

    private get recruitGold(): number {
        let arr: Array<t_s_buildingtemplateData> = BuildingManager.Instance.getMaxEffectBuildingTemplate(this._pawnTemp);
        if (!arr) return 0;
        arr = ArrayUtils.sortOn(arr, "Property4", ArrayConstant.NUMERIC);
        let buildTemp: t_s_buildingtemplateData = arr[0];
        let goldValue: number = this._model.playerEffect.getRecruitPawnResourceAddition(this._pawnTemp.GoldConsume * (1 - buildTemp.Property4 / 100));
        return Math.ceil(this._soliderNumber * goldValue);
    }

    private get gold(): ResourceData {
        return ResourceManager.Instance.gold;
    }

    private get population(): ResourceData {
        return ResourceManager.Instance.population;
    }

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose() {
        super.dispose();
    }
}
