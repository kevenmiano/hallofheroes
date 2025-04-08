import FUI_GameSetCom from "../../../../../fui/PersonalCenter/FUI_GameSetCom";
import { BattleEvent, SpaceEvent, SwitchEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SharedManager } from "../../../manager/SharedManager";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import BuildingManager from "../../../map/castle/BuildingManager";
import SettingData, { OptType, SettingType } from "../../setting/SettingData";
import LangManager from '../../../../core/lang/LangManager';
import SetItem from "../item/SetItem";
import { ConfigManager } from "../../../manager/ConfigManager";
import Utils from "../../../../core/utils/Utils";

/**
 * 个人中心里的游戏设置页面
 */
export default class GameSetCom extends FUI_GameSetCom {

    private listData: any[] = [];
    private listData1: any[] = [];

    onConstruct() {
        super.onConstruct();
        this.onInit();
        this.initData();
        this.btn_frame.selected = SharedManager.Instance.openHighFrame;
    }

    private onInit(): void {
        this.btn_frame.onClick(this, this.onFrame);
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list1.itemRenderer = Laya.Handler.create(this, this.renderListItem1, null, false);
        NotificationManager.Instance.addEventListener(SwitchEvent.COMPREHENSIVE_PUSH, this.onComprehensive, this);//综合入口页签
        this.onComprehensive();
    }

    private onComprehensive() {
        let push = ConfigManager.info.COMPREHENSIVE_PUSH;
        if ((Utils.isAndroid() || Utils.isIOS())) {
            this.pushsetting.visible = this.list1.visible = push;
        } else {
            this.pushsetting.visible = this.list1.visible = false;
        }
    }


    //高帧率模式 游戏默认关闭高帧率模式, 开启为60FPS, 关闭为30FPS
    private onFrame(): void {
        SharedManager.Instance.openHighFrame = this.btn_frame.selected;
        Laya.stage.frameRate = this.btn_frame.selected ? Laya.Stage.FRAME_FAST : Laya.Stage.FRAME_SLOW;
        SharedManager.Instance.save();
    }

    private initData() {
        this.listData = [];
        this.listData1 = [];
        let settingData = null;

        this.btn_frame.selected = SharedManager.Instance.openHighFrame;
        //场景特效
        // settingData = new SettingData();
        // settingData.Type = SettingType.SCENE_EFFECT;
        // settingData.Value = LangManager.Instance.GetTranslation("SettingWnd.settingData1");
        // settingData.Progress = SharedManager.Instance.allowSceneEffect;
        // this.listData.push(settingData);

        settingData = new SettingData();
        settingData.Type = SettingType.HIDE_FIGHTING_OBJECT;
        settingData.Value = LangManager.Instance.GetTranslation("SettingWnd.settingData4");
        settingData.Progress = SharedManager.Instance.allowAttactedEffect;
        this.listData.push(settingData);

        settingData = new SettingData();
        settingData.Type = SettingType.SHADOW_Effect;
        settingData.Value = LangManager.Instance.GetTranslation("SettingWnd.settingData3");
        settingData.Progress = SharedManager.Instance.shadowEffect;
        this.listData.push(settingData);

        settingData = new SettingData();
        settingData.Type = SettingType.BUILDING_NAME;
        settingData.Value = LangManager.Instance.GetTranslation("SettingWnd.settingData8");
        settingData.Progress = BuildingManager.Instance.isShowBuildingName;
        this.listData.push(settingData);

        // settingData = new SettingData();
        // settingData.Type = SettingType.HIDE_PLAYER_NAME;
        // settingData.Value = LangManager.Instance.GetTranslation("SettingWnd.settingData10");
        // settingData.Progress = SharedManager.Instance.hidePlayerName;
        // this.listData.push(settingData);

        settingData = new SettingData();
        settingData.Type = SettingType.HIDE_OTHER_PLAYER;
        settingData.Value = LangManager.Instance.GetTranslation("SettingWnd.settingData11");
        settingData.Progress = SharedManager.Instance.hideOtherPlayer;
        this.listData.push(settingData);

        //#####推送######
        if (Utils.isAndroid() || Utils.isIOS()) {
            let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
            settingData = new SettingData();
            settingData.Type = SettingType.PUSH_FARM;
            settingData.Value = LangManager.Instance.GetTranslation("SettingWnd.settingData20");
            settingData.Progress = playerInfo.pushFarm;
            this.listData1.push(settingData);

            settingData = new SettingData();
            settingData.Type = SettingType.PUSH_WORLDBOSS;
            settingData.Value = LangManager.Instance.GetTranslation("TopToolBar.btnText3");
            settingData.Progress = playerInfo.pushWorldBoss;
            this.listData1.push(settingData);

            settingData = new SettingData();
            settingData.Type = SettingType.PUSH_GUILD_TREE;
            settingData.Value = LangManager.Instance.GetTranslation("SettingWnd.settingData21");
            settingData.Progress = playerInfo.pushGuildTree;
            this.listData1.push(settingData);

            settingData = new SettingData();
            settingData.Type = SettingType.PUSH_GUILD_WAR;
            settingData.Value = LangManager.Instance.GetTranslation("gvg.view.ready.GvgReadyFrame.title");
            settingData.Progress = playerInfo.pushGuildWar;
            this.listData1.push(settingData);

            settingData = new SettingData();
            settingData.Type = SettingType.PUSH_MULTICAMP;
            settingData.Value = LangManager.Instance.GetTranslation("card.CardFrame.MultiCampaign");
            settingData.Progress = playerInfo.pushMultiCamp;
            this.listData1.push(settingData);

            settingData = new SettingData();
            settingData.Type = SettingType.PUSH_BUILD_ORDER;
            settingData.Value = LangManager.Instance.GetTranslation("SettingWnd.settingData22");
            settingData.Progress = playerInfo.pushBuildingOrder;
            this.listData1.push(settingData);

            settingData = new SettingData();
            settingData.Type = SettingType.Push_TEMPLE_REWARD;
            settingData.Value = LangManager.Instance.GetTranslation("hook.HookFrame.title");
            settingData.Progress = playerInfo.pushTempleReward;
            this.listData1.push(settingData);
        }


        this.list.numItems = this.listData.length;
        this.list1.numItems = this.listData1.length;
        this.picsetting && this.picsetting.ensureSizeCorrect();
        this.supersetting && this.supersetting.ensureSizeCorrect();
        this.mainGroup && this.mainGroup.ensureSizeCorrect();
        if(this.mainGroup.height < this.height) {
            this.scrollPane.touchEffect = false;
        } else {
            this.scrollPane.touchEffect = true;
        }
    }

    private renderListItem(index: number, item: any) {
        let itemData = this.listData[index];
        (item.getChild('txt_name').asTextField).text = itemData.Value;
        let btn_switch: fairygui.GButton = (item.getChild('btn_switch').asButton);
        btn_switch.selected = itemData.Progress;
        btn_switch.data = itemData;
        btn_switch.onClick(this, this.onSelectItem, [btn_switch])
    }

    private renderListItem1(index: number, item: SetItem) {
        let itemData = this.listData1[index];
        item.txt_name.text = itemData.Value;

        item.btn_switch.selected = itemData.Progress;
        item.btn_switch.data = itemData;
        item.btn_switch.onClick(this, this.onSelectItem, [item.btn_switch])
    }

    /**单击列表 */
    private onSelectItem(target: any) {
        let itemData = target.data;
        if (!itemData) return;
        let targetState = target.selected;
        // Logger.log('--------------itemData.TYPE',itemData.Type,'targetState',targetState)
        switch (itemData.Type) {
            case SettingType.SCENE_EFFECT://场景特效
                if (SharedManager.Instance.allowSceneEffect != targetState) {
                    SharedManager.Instance.allowSceneEffect = targetState;
                    NotificationManager.Instance.dispatchEvent(BattleEvent.SCENE_EFFECT_CLOSE, null);
                }

                break;

            case SettingType.HIDE_PLAYER_NAME://屏蔽玩家名字  需求干掉
                // SharedManager.Instance.hidePlayerName = targetState;
                // NotificationManager.Instance.dispatchEvent(SpaceEvent.HIDE_OTHER_NAME, targetState);
                break;

            case SettingType.HIDE_OTHER_PLAYER://隐藏其他玩家
                SharedManager.Instance.hideOtherPlayer = targetState;

                NotificationManager.Instance.dispatchEvent(SpaceEvent.HIDE_OTHERS, targetState);
                break;
            case SettingType.SHADOW_Effect://战斗幻影
                SharedManager.Instance.shadowEffect = targetState;

                break;
            case SettingType.HIDE_FIGHTING_OBJECT://技能特效
                SharedManager.Instance.allowAttactedEffect = targetState;

                break;
            case SettingType.BUILDING_NAME://建筑名称
                BuildingManager.Instance.isShowBuildingName = targetState;
                break;
            case SettingType.PUSH_FARM:
                SocketSendManager.Instance.reqPlayerSetting(OptType.push_farm, targetState ? 1 : 0);
                break;
            case SettingType.PUSH_WORLDBOSS:
                SocketSendManager.Instance.reqPlayerSetting(OptType.push_worldboss, targetState ? 1 : 0);
                break;
            case SettingType.PUSH_GUILD_TREE:
                SocketSendManager.Instance.reqPlayerSetting(OptType.push_guild_tree, targetState ? 1 : 0);
                break;
            case SettingType.PUSH_GUILD_WAR:
                SocketSendManager.Instance.reqPlayerSetting(OptType.push_guild_war, targetState ? 1 : 0);
                break;
            case SettingType.PUSH_MULTICAMP:
                SocketSendManager.Instance.reqPlayerSetting(OptType.push_multicamp, targetState ? 1 : 0);
                break;
            case SettingType.PUSH_BUILD_ORDER:
                SocketSendManager.Instance.reqPlayerSetting(OptType.push_building_order, targetState ? 1 : 0);
                break;
            case SettingType.Push_TEMPLE_REWARD:
                SocketSendManager.Instance.reqPlayerSetting(OptType.push_temple_reward, targetState ? 1 : 0);
                break;
            default: break;
        }
        SharedManager.Instance.save();
    }


    public removeEvent(): void {
        this.btn_frame.offClick(this, this.onFrame);
        for (let i = 0; i < this.list.numChildren; i++) {
            let btn_switch: fairygui.GButton = (this.list.getChildAt(i).asCom.getChild('btn_switch').asButton);
            btn_switch.offClick(this, this.onSelectItem);
        }
        // this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        for (let i = 0; i < this.list1.numChildren; i++) {
            let btn_switch: fairygui.GButton = (this.list1.getChildAt(i) as SetItem).asButton;
            btn_switch.offClick(this, this.onSelectItem);
        }
        // this.list1.itemRenderer.recover();
        Utils.clearGListHandle(this.list1);
        NotificationManager.Instance.removeEventListener(SwitchEvent.COMPREHENSIVE_PUSH, this.onComprehensive, this);//综合入口页签
    }

}