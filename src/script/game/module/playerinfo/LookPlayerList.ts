import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import Utils from "../../../core/utils/Utils";
import { EmWindow } from "../../constant/UIDefine";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { BaseCastle } from "../../datas/template/BaseCastle";
import { CampaignManager } from "../../manager/CampaignManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignArmyView } from "../../map/campaign/view/physics/CampaignArmyView";
import { NpcAvatarView } from "../../map/campaign/view/physics/NpcAvatarView";
import OutercityVehicleArmyView from "../../map/campaign/view/physics/OutercityVehicleArmyView";
import { PvpWarFightArmyView } from "../../map/campaign/view/physics/PvpWarFightArmyView";
import { WildLand } from "../../map/data/WildLand";
import { OuterCityArmyView } from "../../map/outercity/OuterCityArmyView";
import { MapPhysicsCastle } from "../../map/outercity/mapphysics/MapPhysicsCastle";
import { MapPhysicsField } from "../../map/outercity/mapphysics/MapPhysicsField";
import { OuterCityNpcView } from "../../map/outercity/mapphysics/OuterCityNpcView";
import { PosType } from "../../map/space/constant/PosType";
import { BaseArmy } from "../../map/space/data/BaseArmy";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { MapPhysics } from "../../map/space/data/MapPhysics";
import SpaceArmy from "../../map/space/data/SpaceArmy";
import { SpaceNode } from "../../map/space/data/SpaceNode";
import { MapPhysicsBase } from "../../map/space/view/physics/MapPhysicsBase";
import { SpaceArmyView } from "../../map/space/view/physics/SpaceArmyView";
import { SpaceNpcView } from "../../map/space/view/physics/SpaceNpcView";
import FUIHelper from "../../utils/FUIHelper";
import { WorldBossHelper } from "../../utils/WorldBossHelper";

/**
 * @author:zhihua.zhou
 * @data: 2021-11-25 18:18
 * @description 点击玩家重叠时要显示的多个重叠的玩家
 */
export default class LookPlayerList extends BaseWindow {

    title:fairygui.GTextField;
    private list: fgui.GList;

    public OnInitWind() {
        super.OnInitWind();
        this.title.text = LangManager.Instance.GetTranslation('LookPlayerList.chooseRoleTxt2');
        this.list.itemRenderer = Laya.Handler.create(this, this.onRenderList, null, false);
        this.list.on(fairygui.Events.CLICK_ITEM, this, this.onSelect);
        this.setCenter();
        let lineH = 64;
        let len = this.params.length;
        if (len <= 5) {//小于4单列，大于4双列 列表高度自适应，但最多显示2×5个玩家，可通过滑动列表查看更多玩家
            this.list.columnCount = 1;
            this.list.width = 180;
            this.list.height = lineH * len;
        } else {
            if (len > 10) {
                this.list.height = lineH * 5;
            } else {
                this.list.height = Math.ceil(len/2) * lineH;
            }
        }
        this.list.numItems = len;
    }

    protected createModel() {
        super.createModel();
        this.modelMask.alpha = 0;
    }

    OnShowWind() {
        super.OnShowWind();
    }

    public static Hide() {
        if (UIManager.Instance.isShowing(EmWindow.LookPlayerList)) {
            UIManager.Instance.HideWind(EmWindow.LookPlayerList);
        }
    }

    private onRenderList(index: number, item: fairygui.GComponent) {
        let role = this.params[index];
        let txt = item.getChild('title').asTextField;
        if (role instanceof SpaceArmyView) {
            let itemData: SpaceArmy = role.data;
            item.data = itemData;
            txt.text = itemData.nickName;
            txt.color = '#ffffff';
        } else if (role instanceof CampaignArmyView) {
            let itemData: CampaignArmy = role.data;
            item.data = itemData;
            txt.text = itemData.nickName;
            txt.color = '#ffffff';
        } else if (role instanceof OuterCityArmyView) {
            let itemData: BaseArmy = role.data;
            item.data = role;
            txt.text = itemData.nickName;
            txt.color = '#ffffff';
        } else if (role instanceof SpaceNpcView) {
            let nodeInfo: SpaceNode = (role as SpaceNpcView).nodeInfo as SpaceNode;
            txt.text = nodeInfo.info.names;
            item.data = role;
            txt.color = '#FFFF00';
        } else if (role instanceof NpcAvatarView) {
            let nodeInfo: CampaignNode = (role as NpcAvatarView).nodeInfo as CampaignNode;
            txt.text = nodeInfo.info.names;
            item.data = role;
            txt.color = '#FFFF00';
        } else if (role instanceof OuterCityNpcView) {
            let nodeInfo = (role as OuterCityNpcView).nodeInfo as WildLand;
            txt.text = nodeInfo.tempInfo.NameLang;
            item.data = role;
            txt.color = '#FFFF00';
        } else if (role instanceof MapPhysicsField) { 
            let nodeInfo = (role.nodeInfo as WildLand);
            if (nodeInfo.info.types == PosType.TREASURE_MINERAL) {
                txt.text = nodeInfo.tempInfo.NameLang;
            } else {
                txt.text = nodeInfo.tempInfo.NameLang;
            }
            item.data = role;
            txt.color = '#FFFF00';
        }else if (role instanceof MapPhysicsCastle) { 
            let baseCastle = (role.nodeInfo as BaseCastle);
            if (baseCastle && baseCastle.tempInfo) {
                txt.text = baseCastle.tempInfo.NameLang;
            } 
            item.data = role;
            txt.color = '#FFFF00';
        }else if (role instanceof OutercityVehicleArmyView) { 
            let itemData: WildLand = role.wildInfo;
            item.data = role;
            txt.text = itemData.tempInfo.NameLang;
            txt.color = '#ffffff';
        }
        FUIHelper.textAutoSize(txt, 150)
    }

    private onSelect(targetItem) {
        if (targetItem.data instanceof SpaceArmy) {
            PlayerManager.Instance.currentPlayerModel.selectTarget = targetItem.data;
            PlayerManager.Instance.currentPlayerModel.reinforce = targetItem.data;
        } else if (targetItem.data instanceof CampaignArmy) {
            PlayerManager.Instance.currentPlayerModel.selectTarget = targetItem.data;
            PlayerManager.Instance.currentPlayerModel.reinforce = targetItem.data;
            if(WorldBossHelper.checkPvp(targetItem.data.mapId) || WorldBossHelper.checkMineral(targetItem.data.mapId)){
                NotificationManager.Instance.dispatchEvent(NotificationEvent.LOCK_PVP_WARFIGHT, targetItem.data);
            }
        } else if (targetItem.data instanceof OuterCityArmyView) {
            (targetItem.data as OuterCityArmyView).showTip();
        } else if (targetItem.data instanceof SpaceNpcView) {
            (targetItem.data as SpaceNpcView).attackFun();
        } else if (targetItem.data instanceof NpcAvatarView) {
            // 再次点击 NpcAvatarView 内部的.mouseX.mouseY已经改变 此时通过不了像素判断
            (targetItem.data as NpcAvatarView).attackFunEx();
        } else if (targetItem.data instanceof OuterCityNpcView) {
            (targetItem.data as OuterCityNpcView).attackFun();
        } else if (targetItem.data instanceof MapPhysicsField) {
            (targetItem.data as MapPhysicsField).attackFun();
        } else if (targetItem.data instanceof MapPhysicsCastle) {
            (targetItem.data as MapPhysicsCastle).attackFun();
        }else if (targetItem.data instanceof OutercityVehicleArmyView) {
            (targetItem.data as OutercityVehicleArmyView).attackFun();
        }
        this.hide();
    }

    OnHideWind() {
        super.OnHideWind();
        if (this.list) {
            this.list.off(fairygui.Events.CLICK_ITEM, this, this.onSelect);
            // this.list.itemRenderer.recover();
            Utils.clearGListHandle(this.list);
            this.list.numItems = 0;
        }

    }
}
