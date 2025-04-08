import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { t_s_campaignData } from "../../../config/t_s_campaign";
import { t_s_mapData } from "../../../config/t_s_map";
import { BagType } from "../../../constant/BagDefine";
import { EmPackName } from "../../../constant/UIDefine";
import { BagEvent } from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { TowerInfo } from "../../../datas/playerinfo/TowerInfo";
import { CampaignManager } from "../../../manager/CampaignManager";
import { FriendManager } from "../../../manager/FriendManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { RoomManager } from "../../../manager/RoomManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { CampaignArmy } from "../../../map/campaign/data/CampaignArmy";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { RoomInfo } from "../../../mvc/model/room/RoomInfo";
import FUIHelper from "../../../utils/FUIHelper";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";
import { BagHelper } from "../../bag/utils/BagHelper";
import NewbieModule from "../../guide/NewbieModule";
import MainToolBar from "../MainToolBar";
import { EmMainToolBarBtnLocationType } from "./EmMainToolBarBtnLocationType";
import { EmMainToolBarBtnType } from "./EmMainToolBarBtnType";
import { MainToolBarButtonData } from "./MainToolBarButtonData";

/*
 * @Author: jeremy.xu
 * @Date: 2023-12-07 09:40:47
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-07 12:04:28
 * @Description: 
 */

export class MainToolBarData {
    private btnDataList: MainToolBarButtonData[] = []
    private btnDataListRow1: MainToolBarButtonData[] = []
    private btnDataListRow2: MainToolBarButtonData[] = []
    private btnDataListCow: MainToolBarButtonData[] = []

    initConfig() {
        this.initBtnDataList()
    }

    initReq() {
        FriendManager.getInstance().sendReqAddFriendList();
    }

    ///////////////////////////////////////////////////
    private _goodsList: Array<GoodsInfo> = [];
    private _newGoodsInfo: GoodsInfo;
    private _newGoodsCount: number = 0;
    private _popGoodsTimeId: any = 0;
    private _goodCountTimeFlag: boolean = false;
    private _goodCountTimeOnceFlag: boolean = false; // 已经执行过一次
    newGoodsHandler(data: Array<GoodsInfo>) {
        if (!NewbieModule.Instance.checkEnterCastle()) {
            return;
        }

        if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
            return;
        }

        if (this._goodCountTimeOnceFlag) {
            // Logger.xjy("[MainToolBar]__newGoodsHandler 3s内已经显示过一批")
            return;
        }

        if (this._goodsList.length > 0) {
            this._goodsList = this._goodsList.concat(data)
        } else {
            this._goodsList = data;
            this._popGoodsTimeId = setInterval(this.popGoods.bind(this), 500);
        }
    }

    private popGoods() {
        if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
            //进入战斗, 取消弹物品
            this.resetPopGoods()
            this.resetGoodCountTimeInfo()
            return;
        }

        this._newGoodsInfo = this._goodsList.pop();
        this._newGoodsCount += 1;
        if (this._newGoodsInfo && this._newGoodsInfo.bagType != BagType.Bottle && MainToolBar.FLASH_NEW_GOODS) {
            BagHelper.Instance.playNewGoodsEffect(this._newGoodsInfo);
        }
        if (this._goodsList.length == 0) {
            this.resetPopGoods()
        }
        if (this._newGoodsCount >= 3 && this._goodCountTimeFlag) {
            Logger.xjy("[MainToolBar]popGoods显示数量太多 只显示三个")
            this.resetPopGoods()
            this._goodCountTimeOnceFlag = true
        }

        if (!this._goodCountTimeFlag) {
            // Logger.xjy("[MainToolBar]popGoods开始计时")
            this._goodCountTimeFlag = true
            Laya.timer.once(3000, this, this.resetGoodCountTimeInfo)
        }
    }

    private resetPopGoods() {
        clearInterval(this._popGoodsTimeId);
        this._goodsList = [];
        this._newGoodsCount = 0;
    }

    private resetGoodCountTimeInfo() {
        this._goodCountTimeFlag = false;
        this._goodCountTimeOnceFlag = false;
        Laya.timer.clear(this, this.resetGoodCountTimeInfo)
    }
    /////////////////////////////////////////////////


    private initBtnDataList() {
        //////////////////////Cow//////////////////////
        let data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.SHOP;
        data.locationType = EmMainToolBarBtnLocationType.Cow;
        data.name = LangManager.Instance.GetTranslation("HomeWnd.btnTitle.shop");
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Shop");
        data.sort = 20;
        data.open = false;
        this.btnDataList.push(data);

        data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.PVE;
        data.locationType = EmMainToolBarBtnLocationType.Cow;
        data.name = LangManager.Instance.GetTranslation("HomeWnd.btnTitle.pveCampaign");
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_PveCampaign");
        data.sort = 0;
        data.open = false;
        this.btnDataList.push(data);

        data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.RETURN;
        data.locationType = EmMainToolBarBtnLocationType.Cow;
        data.name = LangManager.Instance.GetTranslation("HomeWnd.btnTitle.return");
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Back");
        data.sort = 0;
        data.open = false;
        this.btnDataList.push(data);

        //////////////////////Row1//////////////////////
        data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.BAG;
        data.locationType = EmMainToolBarBtnLocationType.Row1;
        data.name = LangManager.Instance.GetTranslation("HomeWnd.btnTitle.bag");
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Inventory");
        data.sort = 100;
        data.open = false;
        this.btnDataList.push(data);

        data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.PET;
        data.locationType = EmMainToolBarBtnLocationType.Row1;
        data.name = LangManager.Instance.GetTranslation("HomeWnd.btnTitle.pet");
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Sylph");
        data.sort = 90;
        data.open = false;
        this.btnDataList.push(data);

        data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.MOUNT;
        data.locationType = EmMainToolBarBtnLocationType.Row1;
        data.name = LangManager.Instance.GetTranslation("HomeWnd.btnTitle.mount");
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Mount");
        data.sort = 80;
        data.open = false;
        this.btnDataList.push(data);

        data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.STORE;
        data.locationType = EmMainToolBarBtnLocationType.Row1;
        data.name = LangManager.Instance.GetTranslation("HomeWnd.btnTitle.store");
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Blacksmith");
        data.sort = 70;
        data.open = false;
        this.btnDataList.push(data);

        data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.STAR;
        data.locationType = EmMainToolBarBtnLocationType.Row1;
        data.name = LangManager.Instance.GetTranslation("HomeWnd.btnTitle.star");
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Astro");
        data.sort = 60;
        data.open = false;
        this.btnDataList.push(data);

        data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.SKILL;
        data.locationType = EmMainToolBarBtnLocationType.Row1;
        data.name = LangManager.Instance.GetTranslation("HomeWnd.btnTitle.skill");
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Skills");
        data.sort = 50;
        data.open = false;
        this.btnDataList.push(data);

        data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.FARM;
        data.locationType = EmMainToolBarBtnLocationType.Row1;
        data.name = LangManager.Instance.GetTranslation("HomeWnd.btnTitle.farm");
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_MyFarm");
        data.sort = 40;
        data.open = false;
        this.btnDataList.push(data);

        data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.CONSORTIA;
        data.locationType = EmMainToolBarBtnLocationType.Row1;
        data.name = LangManager.Instance.GetTranslation("HomeWnd.btnTitle.guild");
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Guild");
        data.sort = 0;
        data.open = false;
        this.btnDataList.push(data);

        //////////////////////Row2//////////////////////
        data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.ARMY;
        data.locationType = EmMainToolBarBtnLocationType.Row2;
        data.name = "兵营";
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_Sim_Troops");
        data.sort = 100;
        data.open = false;
        this.btnDataList.push(data);

        data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.FRIEND;
        data.locationType = EmMainToolBarBtnLocationType.Row2;
        data.name = "好友";
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_Sim_Friend");
        data.sort = 90;
        data.open = false;
        this.btnDataList.push(data);

        data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.RANK;
        data.locationType = EmMainToolBarBtnLocationType.Row2;
        data.name = "排行";
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_Sim_Ranking");
        data.sort = 80;
        data.open = false;
        this.btnDataList.push(data);

        data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.MAIL;
        data.locationType = EmMainToolBarBtnLocationType.Row2;
        data.name = "邮件";
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_Sim_Mail_Nor");
        data.sort = 70;
        data.open = false;
        this.btnDataList.push(data);
        data.prefabName = "Btn_Mail";

        data = new MainToolBarButtonData()
        data.buttonType = EmMainToolBarBtnType.SETTING;
        data.locationType = EmMainToolBarBtnLocationType.Row2;
        data.name = "设置";
        data.url = FUIHelper.getItemURL(EmPackName.Home, "Btn_Sim_System");
        data.sort = 0;
        data.open = false;
        this.btnDataList.push(data);

        this.initBtnDataListSubdivide()
        this.initBtnLimitShowFunc()
    }

    initBtnLimitShowFunc() {
        let btn = this.getBtnDataByButtonType(EmMainToolBarBtnType.RETURN)
        btn.limitShowfunc = () => {
            let currentType = SceneManager.Instance.currentType;
            switch (currentType) {
                case SceneType.WARLORDS_ROOM:
                case SceneType.PVE_ROOM_SCENE:
                case SceneType.PVP_ROOM_SCENE:
                case SceneType.CAMPAIGN_MAP_SCENE:
                    return true;
                case SceneType.OUTER_CITY_SCENE:
                case SceneType.SPACE_SCENE:
                case SceneType.CASTLE_SCENE:
                    return false;
                default:
                    return false;
            }
        }
        btn = this.getBtnDataByButtonType(EmMainToolBarBtnType.PVE)
        btn.limitShowfunc = () => {
            let currentType = SceneManager.Instance.currentType;
            switch (currentType) {
                case SceneType.WARLORDS_ROOM:
                case SceneType.PVE_ROOM_SCENE:
                case SceneType.PVP_ROOM_SCENE:
                case SceneType.CAMPAIGN_MAP_SCENE:
                    return false;
                case SceneType.OUTER_CITY_SCENE:
                case SceneType.SPACE_SCENE:
                case SceneType.CASTLE_SCENE:
                    return true;
                default:
                    return false;
            }
        }
    }

    initBtnDataListSubdivide() {
        for (let index = 0; index < this.btnDataList.length; index++) {
            const element = this.btnDataList[index];
            switch (element.locationType) {
                case EmMainToolBarBtnLocationType.Row1:
                    this.btnDataListRow1.push(element)
                    break
                case EmMainToolBarBtnLocationType.Row2:
                    this.btnDataListRow2.push(element)
                    break
                case EmMainToolBarBtnLocationType.Cow:
                    this.btnDataListCow.push(element)
                    break
                default:
                    break
            }
        }

        this.btnDataListRow1 = ArrayUtils.sortOn(this.btnDataListRow1, ["sort"], [ArrayConstant.NUMERIC])
        this.btnDataListRow2 = ArrayUtils.sortOn(this.btnDataListRow2, ["sort"], [ArrayConstant.NUMERIC])
        this.btnDataListCow = ArrayUtils.sortOn(this.btnDataListCow, ["sort"], [ArrayConstant.NUMERIC])
    }

    /** 获取某按钮数据 */
    getBtnDataByButtonType(buttonType: EmMainToolBarBtnType): MainToolBarButtonData {
        for (let index = 0; index < this.btnDataList.length; index++) {
            const btnData = this.btnDataList[index];
            if (btnData.buttonType == buttonType) {
                return btnData
            }
        }
        return null;
    }
    /** 获取某类型位置的所有按钮数据 */
    getBtnDataListByLocaltionType(locationType?: EmMainToolBarBtnLocationType) {
        switch (locationType) {
            case EmMainToolBarBtnLocationType.Row1:
                return this.btnDataListRow1
            case EmMainToolBarBtnLocationType.Row2:
                return this.btnDataListRow2
            case EmMainToolBarBtnLocationType.Cow:
                return this.btnDataListCow
            default:
                return this.btnDataList
        }
    }

    getGapByLocaltionType(locationType: EmMainToolBarBtnLocationType) {
        switch (locationType) {
            case EmMainToolBarBtnLocationType.Row1:
                return 90
            case EmMainToolBarBtnLocationType.Row2:
                return 83
            case EmMainToolBarBtnLocationType.Cow:
                return 88
            default:
                return 0
        }
    }
    /** 根据可见性(开放、其他显示条件)获取某类型位置的所有按钮数据 */
    getVisibleBtnListByLocationType(locationType: EmMainToolBarBtnLocationType) {
        let temp = []
        let dataList = this.getBtnDataListByLocaltionType(locationType)
        for (let index = 0; index < dataList.length; index++) {
            const btnData = dataList[index];
            if (btnData.getVisible()) {
                temp.push(btnData)
            }
        }
        return temp
    }

    /**
     * 获得对应副本的退出提示语
     * @return 如果返回空值, 则不用弹出确认框
     */
    getExitCampaignMessage(): string {
        var str = LangManager.Instance.GetTranslation("mainBar.MainToolBar.campaignMsg");
        var mapId = CampaignManager.Instance.mapModel.mapId;
        var b = WorldBossHelper.checkWorldBoss(mapId);
        if (b) {
            str = LangManager.Instance.GetTranslation("mainBar.MainToolBar.str01");
            return str;
        }
        b = WorldBossHelper.checkHoodRoom(mapId);
        if (b) {
            str = LangManager.Instance.GetTranslation("mainBar.MainToolBar.str02");
            return str;
        }
        b = WorldBossHelper.checkCrystal(mapId);
        if (b) {
            str = LangManager.Instance.GetTranslation("mainBar.MainToolBar.str03");
            return str;
        }
        b = WorldBossHelper.checkMaze(mapId);
        if (b) {
            if (this.selfMemberData && this.selfMemberData.isDie == 1) {
                if (this.towerInfo.freeEnterCount - this.towerInfo.enterCount > 0) {
                    str = LangManager.Instance.GetTranslation("map.campaign.view.ui.MazeRiverView.content05");
                } else {
                    str = LangManager.Instance.GetTranslation("map.campaign.view.ui.MazeRiverView.content02");
                }
                return str;
            }
            str = LangManager.Instance.GetTranslation("mainBar.MainToolBar.str04");
            return str;
        }
        b = WorldBossHelper.checkMaze2(mapId);
        if (b) {
            if (this.selfMemberData && this.selfMemberData.isDie == 1) {
                if (this.towerInfo.freeEnterCount - this.towerInfo.enterCount > 0) {
                    str = LangManager.Instance.GetTranslation("map.campaign.view.ui.MazeRiverView.content05");
                } else {
                    str = LangManager.Instance.GetTranslation("map.campaign.view.ui.MazeRiverView.content02");
                }
                return str;
            }
            str = LangManager.Instance.GetTranslation("mainBar.MainToolBar.str06");
            return str;
        }
        b = WorldBossHelper.checkConsortiaSecretLand(mapId);
        if (b) {
            str = LangManager.Instance.GetTranslation("mainBar.MainToolBar.str07");
            return str;
        }
        b = WorldBossHelper.checkConsortiaDemon(mapId);
        if (b) {
            str = LangManager.Instance.GetTranslation("mainBar.MainToolBar.str08");
            return str;
        }
        b = WorldBossHelper.checkPvp(mapId);
        if (b) {
            str = LangManager.Instance.GetTranslation("mainBar.MainToolBar.str05");
            return str;
        }
        b = WorldBossHelper.checkGvg(mapId);
        if (b) {
            str = LangManager.Instance.GetTranslation("MainToolBar.extGvg");
        }
        b = WorldBossHelper.checkPetLand(mapId);
        if (b) {
            str = LangManager.Instance.GetTranslation("MainToolBar.extPetIsland");
        }
        b = WorldBossHelper.checkSecretFb(mapId);
        if (b) {
            str = LangManager.Instance.GetTranslation("mainBar.MainToolBar.str09");
        }
        b = WorldBossHelper.checkMineral(mapId) || WorldBossHelper.checkConsortiaBoss(mapId);
        if (b) {
            str = null;
        }

        let mapTemp: t_s_mapData = TempleteManager.Instance.getMapTemplateById(CampaignManager.Instance.mapId);
        let campaignTemp: t_s_campaignData;
        if (mapTemp) campaignTemp = ConfigMgr.Instance.campaignTemplateDic[mapTemp.CampaignId];
        if (this.roomInfo && this.roomInfo.isCross && this.roomInfo.playerCount > 1 && campaignTemp && campaignTemp.Capacity == 4 && (campaignTemp.DungeonId == 1 || campaignTemp.DungeonId == 2) && campaignTemp.Types == 0)//多人本
        {
            str = LangManager.Instance.GetTranslation("mainBar.MainToolBar.leaving crossCampaign");
        }
        return str;
    }

    public getBtnPos(starPos: Laya.Point, locationType: EmMainToolBarBtnLocationType, index: number): Laya.Point {
        let gap = this.getGapByLocaltionType(locationType);
        let pos = new Laya.Point()
        switch (locationType) {
            case EmMainToolBarBtnLocationType.Row1:
                pos.x = starPos.x - gap * (index + 1)
                pos.y = starPos.y
                break;
            case EmMainToolBarBtnLocationType.Row2:
                pos.x = -32 + starPos.x - gap * (index + 1)
                pos.y = -120 + starPos.y
                break;
            case EmMainToolBarBtnLocationType.Cow:
                pos.x = starPos.x
                pos.y = -6 + starPos.y - gap * (index + 1)
                break;
        }
        return pos
    }

    private get towerInfo(): TowerInfo {
        return PlayerManager.Instance.currentPlayerModel.towerInfo;
    }

    private get selfMemberData(): CampaignArmy {
        return CampaignManager.Instance.mapModel.selfMemberData;
    }

    private get roomInfo(): RoomInfo {
        return RoomManager.Instance.roomInfo;
    }
}