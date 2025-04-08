// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2023-08-16 10:36:53
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-20 11:07:46
 * @Description: 
 */
import ConfigMgr from '../../core/config/ConfigMgr';
import GameEventDispatcher from '../../core/event/GameEventDispatcher';
import Logger from '../../core/logger/Logger';
import t_s_systemopentips, { t_s_systemopentipsData } from '../config/t_s_systemopentips';
import { ConfigType } from '../constant/ConfigDefine';
import OpenGrades from '../constant/OpenGrades';
import { EmPackName } from '../constant/UIDefine';
import { FunOpenEvent } from '../constant/event/NotificationEvent';
import { PlayerEvent } from '../constant/event/PlayerEvent';
import { ThaneInfo } from '../datas/playerinfo/ThaneInfo';
import NewbieModule from '../module/guide/NewbieModule';
import NewbieBaseActionMediator from '../module/guide/mediators/NewbieBaseActionMediator';
import HomeWnd from '../module/home/HomeWnd';
import { EmMainToolBarBtnType } from '../module/home/mainToolBar/EmMainToolBarBtnType';
import FUIHelper from '../utils/FUIHelper';
import UIHelper from '../utils/UIHelper';
import { WorldBossHelper } from '../utils/WorldBossHelper';
import { ArmyManager } from './ArmyManager';
import { CampaignManager } from './CampaignManager';
import { NotificationManager } from './NotificationManager';
import { SharedManager } from './SharedManager';


export default class FunOpenManager extends GameEventDispatcher {
	private static _instance: FunOpenManager;
	public static get Instance(): FunOpenManager {
		if (!this._instance) this._instance = new FunOpenManager();
		return this._instance;
	}
	public static symbol: string = "_";
	public funOpening: boolean = false;

	preSetup(t?: any) {

	}

	public setup() {
		this.addEvent();
	}

	private addEvent() {
		ArmyManager.Instance.thane.addEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this.__heroLevelUpdate, this);
	}
	private removeEvent() {
		ArmyManager.Instance.thane.removeEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this.__heroLevelUpdate, this);
	}

	private __taskComplete() {

	}

	private __heroLevelUpdate(thane:ThaneInfo) {
		UIHelper.closeWindows()
		this.refreshFunOpen(1)
		this.checkNewFunOpen(thane.grades);
	}

	public refreshFunOpen(aniType: number = 0) {
		FunOpenManager.Instance.funOpening = true;
		HomeWnd.Instance.showMapBtn();

		let arr = []
		let grade = ArmyManager.Instance.thane.grades

		if (grade >= OpenGrades.BAG) {
			arr.push(EmMainToolBarBtnType.BAG)
		}
		if (grade >= OpenGrades.RANK) {
			arr.push(EmMainToolBarBtnType.RANK)
		}
		if (grade >= OpenGrades.FRIEND) {
			arr.push(EmMainToolBarBtnType.FRIEND)
		}
		if (grade >= OpenGrades.ARMY) {
			arr.push(EmMainToolBarBtnType.ARMY)
		}
		if (grade >= OpenGrades.RETURN) {
			arr.push(EmMainToolBarBtnType.RETURN)
		}
		if (grade >= OpenGrades.PVE_CAMPAIGN) {
			arr.push(EmMainToolBarBtnType.PVE)
		}
		if (grade >= OpenGrades.SKILL) {
			arr.push(EmMainToolBarBtnType.SKILL)
		}
		if (grade >= OpenGrades.SHOP) {
			arr.push(EmMainToolBarBtnType.SHOP)
		}
		if (grade >= OpenGrades.INTENSIFY) {
			arr.push(EmMainToolBarBtnType.STORE)
		}
		if (grade >= OpenGrades.FARM) {
			arr.push(EmMainToolBarBtnType.FARM)
		}
		if (grade >= OpenGrades.CONSORTIA) {
			arr.push(EmMainToolBarBtnType.CONSORTIA)
		}
		if (grade >= OpenGrades.STAR) {
			arr.push(EmMainToolBarBtnType.STAR)
		}
		if (grade >= OpenGrades.MOUNT) {
			arr.push(EmMainToolBarBtnType.MOUNT)
		}
		if (grade >= OpenGrades.PET) {
			arr.push(EmMainToolBarBtnType.PET)
		}
		// 新手本不显示
		if (!WorldBossHelper.checkIsNoviceMap(CampaignManager.Instance.mapModel && CampaignManager.Instance.mapModel.mapId)) {
			// arr.push(EmMainToolBarBtnType.FUNPREVIEW)
			arr.push(EmMainToolBarBtnType.MAIL)
			arr.push(EmMainToolBarBtnType.SETTING)
		}

		let addShow = 0
		if (aniType != 0) {
			switch (grade) {
				case OpenGrades.RANK:
					addShow = EmMainToolBarBtnType.RANK
					break;
				case OpenGrades.FRIEND:
					addShow = EmMainToolBarBtnType.FRIEND
					break;
				case OpenGrades.ARMY:
					addShow = EmMainToolBarBtnType.ARMY
					break;


				case OpenGrades.BAG:
					addShow = EmMainToolBarBtnType.BAG
					break;
				case OpenGrades.RETURN: // 多个功能在同等级开启
				case OpenGrades.PVE_CAMPAIGN:
					addShow = EmMainToolBarBtnType.PVE
					break;
				case OpenGrades.SKILL:
					addShow = EmMainToolBarBtnType.SKILL
					break;
				case OpenGrades.SHOP:
					addShow = EmMainToolBarBtnType.SHOP
					break;
				case OpenGrades.INTENSIFY:
					addShow = EmMainToolBarBtnType.STORE
					break;
				case OpenGrades.FARM:
					addShow = EmMainToolBarBtnType.FARM
					break;
				case OpenGrades.CONSORTIA:
					addShow = EmMainToolBarBtnType.CONSORTIA
					break;
				case OpenGrades.STAR:
					addShow = EmMainToolBarBtnType.STAR
					break;
				case OpenGrades.MOUNT:
					addShow = EmMainToolBarBtnType.MOUNT
					break;
				case OpenGrades.PET:
					addShow = EmMainToolBarBtnType.PET
					break;
				default:
					break;
			}
		}


		let showArgs = ""
		for (let index = 0; index < arr.length; index++) {
			const btnIndex = arr[index];
			if (btnIndex != addShow) {
				showArgs += btnIndex + FunOpenManager.symbol
			}
		}

		if (!NewbieModule.Instance.checkEnterCastle()) {
			showArgs = ""
		}
		Logger.info("FunOpenManager.showArgs", showArgs)
		NewbieBaseActionMediator.setMainToolBarBtn(this.funOpenCallBack, null, showArgs, addShow, aniType)
	}

	private funOpenCallBack() {
		FunOpenManager.Instance.funOpening = false;
	}


	private _newFunData:t_s_systemopentipsData[];
	public get newFunData() : t_s_systemopentipsData[] {
		return this._newFunData
	}
	private _nextOpenArr:t_s_systemopentipsData[];
	public get nextOpenArr() : t_s_systemopentipsData[] {
		return this._nextOpenArr
	}
	/**
	 * 功能开放提示
	 * true: 达到功能开放等级 false:未达到, 显示下次开放的所有功能
	 */
	public checkNewFunOpen(grade:number):boolean {
		let hasNewFun:boolean=false;
        let storys: t_s_systemopentips = ConfigMgr.Instance.getSync(ConfigType.t_s_systemopentips);
        if (storys) {
			this._newFunData = [];
			this._nextOpenArr = [];
              //功能预览=>查找并跳转至当前等级功能
			for (let itemData of storys.mDataList) {
				if (itemData.Grade == grade) {
					//达到功能开放等级时显示: 功能图标+转圈特效+提示文本“已开放”
					if(itemData.Grade >SharedManager.Instance.newFunOpenGrade){
						if(itemData.Type != SharedManager.Instance.newFunOpenType){
							this._newFunData.push(itemData);
							hasNewFun = true;
						}
					}else if(itemData.Grade ==SharedManager.Instance.newFunOpenGrade){
						if(itemData.Type != SharedManager.Instance.newFunOpenType){
							if(itemData.Order >SharedManager.Instance.newFunOpenOrder){
								this._newFunData.push(itemData);
								hasNewFun = true;
							}
						}
					}
				}else if(itemData.Grade > grade){//下一级是否有开启新功能
					if(this._nextOpenArr.length == 0){
						this._nextOpenArr.push(itemData);
					}else{
						if(this._nextOpenArr[0].Grade == itemData.Grade){
							this._nextOpenArr.push(itemData);
						}else{
							break;
						}
					}
				}
			}
        }
		NotificationManager.Instance.dispatchEvent(FunOpenEvent.UPDATE_FUNOPEN_STATE);
		return hasNewFun;
	}

	private getNextOpen(){

	}

	getFunIconUrl(type:number):string{
		// return FUIHelper.getItemURL(EmPackName.Home, 'Btn_Main_Sylph');
        let url:string = '';
        switch (type) {
            case 1://农场
                url = FUIHelper.getItemURL(EmPackName.Home, 'Btn_MyFarm');
                break;
            case 2://单人挑战
            case 11://多人竞技
				url = FUIHelper.getItemURL(EmPackName.Dialog, 'Btn_Eve_Arena');
                break;
            case 3://悬赏
				url = FUIHelper.getItemURL(EmPackName.Home, 'Btn_BountyCard');
                break;
            case 4://多人副本
                url = FUIHelper.getItemURL(EmPackName.Home, 'Btn_Eve_HallOfHeroes');
                break;
            case 5://世界Boss
                url = FUIHelper.getItemURL(EmPackName.Home, 'Btn_Eve_WorldBOSS');
                break;
            case 6://地下迷宫
                url = FUIHelper.getItemURL(EmPackName.Home, 'Img_Pre_Crypt');
                break;
            case 7://占星
            case 10://新星运槽
                url = FUIHelper.getItemURL(EmPackName.Home, 'Btn_Main_Astro');
                break;
            case 8://荣誉勋章
                url = FUIHelper.getItemURL(EmPackName.Home, 'Btn_honor');
                break;
            case 9://战场
                url = FUIHelper.getItemURL(EmPackName.Home, 'Btn_Eve_Battle');
                break;
            case 12://坐骑
                url = FUIHelper.getItemURL(EmPackName.Home,  'Btn_Main_Mount');
                break;
            case 13://符文
                url = FUIHelper.getItemURL(EmPackName.Home, 'Btn_rune');
                break;
            case 14://符孔
                url = FUIHelper.getItemURL(EmPackName.Home, 'runegem_point');
                break;
            case 16://跑环
                url = FUIHelper.getItemURL(EmPackName.Home, 'Btn_Eve_Task');
                break;
            case 15://灵魂刻印
                url = FUIHelper.getItemURL(EmPackName.Home, 'Img_Pre_Engrave');
                break;
            case 17://王者之塔
            case 22://试炼之塔
                url = FUIHelper.getItemURL(EmPackName.Home, 'Btn_Eve_HallOfHeroes');
                break;
            case 18://英灵
            case 19://英灵战役
            case 21://英灵远征
            case 24://英灵竞技
                url = FUIHelper.getItemURL(EmPackName.Home, 'Btn_Main_Sylph');
                break;
            case 20://兵种领悟
                url = FUIHelper.getItemURL(EmPackName.Home, 'Img_Pre_Enlighten');
                break;
            case 23://天赋
                url = FUIHelper.getItemURL(EmPackName.Base, 'Icon_Talents');
                break;
            case 25://龙纹
                url = FUIHelper.getItemURL(EmPackName.Base, 'Icon_Tattoo_Stats');
                break;
            case 26://命运守护
                url = FUIHelper.getItemURL(EmPackName.Home, 'Btn_FateGuardian');
                break;
            case 27://专精
                url = FUIHelper.getItemURL(EmPackName.Home, 'Btn_Mastery_Stats');
                break;
            case 28://秘境
                url = FUIHelper.getItemURL(EmPackName.Home, 'Btn_Main_Campaign');
                break;
			case 29://时装
                url = FUIHelper.getItemURL(EmPackName.Home, 'Btn_Eve_Fashion');
                break;
        }
		return url;
    }

	dispose() {
		this.removeEvent()
	}
}