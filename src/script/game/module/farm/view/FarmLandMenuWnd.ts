/*
 * @Author: jeremy.xu
 * @Date: 2021-08-13 17:44:06
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-03-29 14:52:08
 * @Description: 农场土地操作菜单
 * 包含加速、铲除按钮  作物信息
 */

import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { FilterFrameText, eFilterFrameText } from "../../../component/FilterFrameText";
import { BaseItem } from "../../../component/item/BaseItem";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { FarmOperateType } from "../../../constant/FarmOperateType";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { FarmManager } from "../../../manager/FarmManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import ComponentSetting from "../../../utils/ComponentSetting";
import FarmLandInfo from "../data/FarmLandInfo";


export class FarmLandMenuWnd extends BaseWindow {
	public static Colors = FilterFrameText.Colors[eFilterFrameText.ItemQuality]

	private _info: FarmLandInfo;

	private btnAccelerate: UIButton;
	private btnUpRoot: UIButton;
	private txtName: fgui.GLabel;
	private txtTimeValue: fgui.GLabel;
	private txt_profit: fgui.GTextField;
	private prog: fgui.GProgressBar;
	private cHasFaded: fgui.Controller;
	private baseItem: BaseItem;
	private clickRect:fairygui.GComponent;

	OnShowWind() {
		super.OnShowWind();
		this.setCenter();
		this.cHasFaded = this.getUIController("cHasFaded")
		if (this.frameData) {
			this.info = this.frameData
		}
		this.clickRect.on(Laya.Event.CLICK, this,this.OnClickModal);
	}

	OnHideWind(): void {
		this.clickRect.off(Laya.Event.CLICK, this,this.OnClickModal);
		super.OnHideWind();
	}

    /** 点击蒙版区域 (可重写) */
    protected OnClickModal() {
        // if (this.modelEnable)
            this.OnBtnClose();
    }
	/**
	 * 点击加速 
	 */
	private btnAccelerateClick() {
		if (this._info) {
			if (this._info.hasAccelerate)//检测是否已加速
			{
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("farm.view.FarmOperMenu.hasAccelerateTip"));
				this.dispose();
				return;
			}
			var tip: string = LangManager.Instance.GetTranslation("farm.view.FarmOperMenu.accelerateTip", FarmManager.Instance.model.acceleratePay);
			SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, { oper: FarmOperateType.ACCELERATE, land: this._info }, null, tip, null, null, this.operResponse.bind(this));
		}
		this.dispose();
	}
	/**
	 * 点击铲除 
	 */
	private btnUpRootClick() {
		if (this._info) {
			var tip: string = LangManager.Instance.GetTranslation("farm.view.FarmOperMenu.clearTip");
			SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, { oper: FarmOperateType.CLEAR, land: this._info }, null, tip, null, null, this.operUpRoot.bind(this));
		}
		this.dispose();
	}

	private btnCloseClick() {

	}

	/**
	 * 操作确认框
	 * @param b（确定、取消）
	 * @param oper（类型: 加速、铲除）
	 * @param land （农场土地信息）
	 * 
	 */
	private operResponse(b: boolean, flag: boolean, data: any) {
		if (b && data) {
			let selfPoint: number = PlayerManager.Instance.currentPlayerModel.playerInfo.point;
			if (selfPoint < FarmManager.Instance.model.acceleratePay) {
				RechargeAlertMannager.Instance.show();
				return;
			}
			FarmManager.Instance.sendFarmOper(data.land.userId, data.oper, data.land.pos, 0, 0, flag);
		}
	}

	private operUpRoot(b: boolean, flag: boolean, data: any) {
		if (b && data) {
			FarmManager.Instance.sendFarmOper(data.land.userId, data.oper, data.land.pos, 0, 0, flag);
		}
	}

	public get info(): FarmLandInfo {
		return this._info;
	}

	public set info(value: FarmLandInfo) {
		if (this._info == value) return;
		this._info = value;
		if (value) {
			let goodInfo = new GoodsInfo();
			goodInfo.templateId = value.cropTempId;
			this.baseItem.info = goodInfo;
			this.cHasFaded.selectedIndex = value.isDie ? 1 : 0
			this.btnAccelerate.enabled = !value.hasAccelerate
			this.btnAccelerate.title = LangManager.Instance.GetTranslation(value.hasAccelerate ? "yishi.view.tips.CropTip.accelerated" : "farm.view.FarmOperMenu.accelerate")
			let pvalue = Math.floor((value.growTime / value.totalMatureTimeUnAccelerate) * 100);
			this.prog.value = (isNaN(pvalue) || !pvalue) ? 0 : pvalue;
			this.txtTimeValue.text = DateFormatter.getStopDateString(value.remainMatureTime);
			
			let _tempStr:string='';
			var gTemp: t_s_itemtemplateData = goodInfo.templateInfo;
            if (gTemp) {
                let arr = gTemp.TemplateNameLang.split('-')
                this.txtName.text = arr[0];
                this.txtName.color = ComponentSetting.setFarmItemColor(gTemp.Profile);
               
                if (parseInt((gTemp.Property1 / 60).toString()) <= 0)
                    _tempStr = LangManager.Instance.GetTranslation("public.needMinutes", gTemp.Property1 % 60);
                else if (gTemp.Property1 % 60 == 0)
                    _tempStr = parseInt((gTemp.Property1 / 60).toString()) + LangManager.Instance.GetTranslation("public.time.hour");
                else
                    _tempStr = LangManager.Instance.GetTranslation("public.needHM", parseFloat((gTemp.Property1 / 60).toString()), gTemp.Property1 % 60);
    
                var outputTemp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, gTemp.Property2);
                if (outputTemp)
                    _tempStr = gTemp.Property3 + " " + outputTemp.TemplateNameLang;
                else
                    _tempStr = gTemp.Property3.toString();
                this.txt_profit.setVar('value', _tempStr).flushVars();
            }
		} else {
			this.baseItem.info = null
			this.prog.value = 0;
			this.txtName.text = "--";
			this.txtTimeValue.text = "--";
		}
	}
}