// @ts-nocheck
import FUI_CommonFrame3 from "../../../../fui/Base/FUI_CommonFrame3";
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { IconFactory } from "../../../core/utils/IconFactory";
import { t_s_campaignData } from "../../config/t_s_campaign";
import t_s_levelupprompt, { t_s_leveluppromptData } from "../../config/t_s_levelupprompt";
import t_s_systemopentips, { t_s_systemopentipsData } from "../../config/t_s_systemopentips";
import { t_s_upgradetemplateData } from "../../config/t_s_upgradetemplate";
import { ConfigType } from "../../constant/ConfigDefine";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import GTabIndex from "../../constant/GTabIndex";
import {EmPackName, EmWindow} from "../../constant/UIDefine";
import { UpgradeType } from "../../constant/UpgradeType";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import FunOpenManager from "../../manager/FunOpenManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { SharedManager } from "../../manager/SharedManager";
import { TempleteManager } from "../../manager/TempleteManager";
import SpaceManager from "../../map/space/SpaceManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import FunOpenItem from "./FunOpenItem";
import FUIHelper from "../../utils/FUIHelper";

//功能开放
export default class FunOpenWnd extends BaseWindow {


    public backDialog: fgui.GLabel;
    public npcView: fgui.GLoader;
    public list: fgui.GList;
    public btn_go: fgui.GButton;
    c1:fgui.Controller;
    frame:FUI_CommonFrame3
    private listdata: t_s_systemopentipsData[];
    item:FunOpenItem;
    /** 是否开启新功能 */
    private newFunData:t_s_systemopentipsData[];


    public OnInitWind() {
        this.setCenter();
        this.c1 = this.contentPane.getControllerAt(0);
        
        this.npcView.url = IconFactory.getNPCIcon(2);
        this.addListenerEvent();
        this.parseData();
    }


    //功能预览数据
    private parseData() {
        this.newFunData = FunOpenManager.Instance.newFunData;
        if(this.newFunData && this.newFunData.length > 0){
            this.c1.selectedIndex = 1;
            this.frame.getChild('title').asTextField.text = LangManager.Instance.GetTranslation('FunOpen.title');
            this.item.getControllerAt(0).selectedIndex = 1;
            this.frame.showContentBg.selectedIndex = 2;
            let curFun = this.newFunData[0];
            for (let i = 0; i < this.newFunData.length; i++) {
                const element = this.newFunData[i];
                if(SharedManager.Instance.newFunOpenType != element.Type){
                    // if(element.Order >= SharedManager.Instance.newFunOpenOrder){
                        curFun = element;
                        break;
                    // } 
                }
            }
            this.item.setData(curFun);
            this.list.height = 284;
            SharedManager.Instance.saveFunOpenType(curFun.Type,curFun.Order,curFun.Grade);
        }else{
            this.listdata = FunOpenManager.Instance.nextOpenArr;
            this.list.numItems = this.listdata.length;
            this.c1.selectedIndex = 0;
            this.frame.showContentBg.selectedIndex = 0;
            if(this.listdata.length){
                this.frame.getChild('title').asTextField.text = LangManager.Instance.GetTranslation('funpreview.openLevelTxt',this.listdata[0].Grade);
            }
            let H = 110 * this.listdata.length;
            this.list.height = Math.min(H,284);
        }
        this.list.scrollPane.scrollTop();
    }

  
    //功能预览Item渲染
    private renderListItem(index: number, item: FunOpenItem) {
        if (!item || item.isDisposed) return;
        let itemData = this.listdata[index];
        item.setData(itemData);
    }
  
    private addListenerEvent() {
        this.btn_go.onClick(this, this.onGo);
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false)
        // this.thane.addEventListener(PlayerEvent.THANE_EXP_UPDATE, this.updateTaneInfo, this);
    }
  
   
    
    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    public OnHideWind() {
        if(this.c1.selectedIndex == 1){
            FunOpenManager.Instance.checkNewFunOpen(this.thane.grades);
        }
        super.OnHideWind();
        this.removeEvent();
        
    }

    private removeEvent() {
        // this.thane.removeEventListener(PlayerEvent.THANE_EXP_UPDATE, this.updateTaneInfo, this);
        this.btn_go.offClick(this, this.onGo);
    }

    private get playerInfo(): PlayerInfo {
		return PlayerManager.Instance.currentPlayerModel.playerInfo;
	}

    private  get worldFightState(): boolean {
		let dic = ConfigMgr.Instance.pvpWarFightDic;
		for (const key in dic) {
			if (Object.prototype.hasOwnProperty.call(dic, key)) {
				let bossTemp: t_s_campaignData = dic[key]
				if (bossTemp.state == 0 && WorldBossHelper.checkPvp(bossTemp.CampaignId)) {
					return true;
				}
			}
		}
		return false;
	}

    private onGo(){
        this.hide();
        switch (this.newFunData[0].Type) {
            case 1:
                SwitchPageHelp.gotoFarmFrame();
                break;
            case 2:
                if(CampaignManager.Instance.mapModel && CampaignManager.Instance.mapModel.mapId > 0){//单人挑战功能在副本中无法点击跳转, 修改为跳转至单人挑战界面, 但无法选择角色攻击
                    FrameCtrlManager.Instance.open(EmWindow.Colosseum);
                }else{
                    SwitchPageHelp.gotoColosseumFrame();
                }
                break;
            case 11:
                SwitchPageHelp.gotoPvpFrame();           
                break;
            case 3://悬赏
                if(CampaignManager.Instance.mapModel && CampaignManager.Instance.mapModel.mapId > 0){//单人挑战功能在副本中无法点击跳转, 修改为跳转至单人挑战界面, 但无法选择角色攻击
                    UIManager.Instance.ShowWind(EmWindow.OfferRewardWnd);
                }else{
                    SwitchPageHelp.gotoOfferRewardFrame();
                }
                break;
            case 4://多人副本
                SwitchPageHelp.gotoHeroDoor();
                break;
            case 5://世界Boss
                if (!this.playerInfo.worldbossState) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('FunOpen.wroldBoss'))
                }else{
                    SwitchPageHelp.gotoWorldBossFrame();
                }
                break;
            case 6://地下迷宫
                SwitchPageHelp.gotoMazeFrame();
                break;
            case 7://占星
                SwitchPageHelp.gotoStarFrame();
                break;
            case 10://新星运槽
                SwitchPageHelp.gotoStarBagFrame();
                break;
            case 8://荣誉勋章
                FrameCtrlManager.Instance.open(EmWindow.SRoleWnd, { openHonor: true });
                break;
            case 9://战场
                if (!this.worldFightState) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation('FunOpen.fight'));
                }else{
                    FrameCtrlManager.Instance.open(EmWindow.RvrBattleWnd);
                }
                break;
            case 12://坐骑
                SwitchPageHelp.gotoMounts();
                break;
            case 13://符文
                SwitchPageHelp.gotoRunnesSkill();
                break;
            case 14://符孔
                FrameCtrlManager.Instance.open(EmWindow.Skill, { tabIndex: GTabIndex.Skill_FK })
                break;
            case 16://跑环
                SwitchPageHelp.walkToCrossMapTarget("10000,17");//conRing[0].Para4
                break;
            case 15://灵魂刻印
                SwitchPageHelp.gotoBagFrame();
                break;
            case 17://王者之塔
            case 22://试炼之塔
                SwitchPageHelp.gotoHeroDoor();
                break;
            case 18://英灵
                FrameCtrlManager.Instance.open(EmWindow.Pet, { tabIndex: GTabIndex.Pet_AttrAdvance });
                break;
            case 19://英灵战役
                if(CampaignManager.Instance.mapModel && CampaignManager.Instance.mapModel.mapId > 0){//单人挑战功能在副本中无法点击跳转, 修改为跳转至单人挑战界面, 但无法选择角色攻击
                    let str: string = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip06");
                    MessageTipManager.Instance.show(str);
                }else{
                    SpaceManager.Instance.visitSpaceNPC(70);
                }
                break;
            case 21://英灵远征
                if(CampaignManager.Instance.mapModel && CampaignManager.Instance.mapModel.mapId > 0){//单人挑战功能在副本中无法点击跳转, 修改为跳转至单人挑战界面, 但无法选择角色攻击
                    let str: string = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip06");
                    MessageTipManager.Instance.show(str);
                }else{
                    SpaceManager.Instance.visitSpaceNPC(31);
                }
                break;
            case 24://英灵竞技
                if(CampaignManager.Instance.mapModel && CampaignManager.Instance.mapModel.mapId > 0){//单人挑战功能在副本中无法点击跳转, 修改为跳转至单人挑战界面, 但无法选择角色攻击
                    let str: string = LangManager.Instance.GetTranslation("worldboss.helper.WorldBossHelper.tip06");
                    MessageTipManager.Instance.show(str);
                }else{
                    SpaceManager.Instance.visitSpaceNPC(3);
                }
                break;
            case 20://兵种领悟
                let armyPawn = ArmyManager.Instance.army.getPawnByIndex(0);
                FrameCtrlManager.Instance.open(EmWindow.PawnLevelUp, armyPawn);
                break;
            case 23://天赋
                SwitchPageHelp.gotoMarkingSkill();
                break;
            case 25://龙纹
                FrameCtrlManager.Instance.open(EmWindow.SRoleWnd, { openTattoo: true });
                break;
            case 26://命运守护
                FrameCtrlManager.Instance.open(EmWindow.SRoleWnd, { openFortune: true });
                break;
            case 27://专精
                FrameCtrlManager.Instance.open(EmWindow.SRoleWnd, { tabIndex: 4});
                break;
            case 28://秘境
                FrameCtrlManager.Instance.open(EmWindow.PveSecretWnd);
                break;
            case 29://时装
                FrameCtrlManager.Instance.open(EmWindow.SRoleWnd, { tabIndex: 2 });
                break;
            default:
                break;
        }
        
    }

}

