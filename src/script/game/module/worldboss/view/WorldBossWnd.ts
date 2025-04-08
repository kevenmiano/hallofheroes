import ConfigMgr from '../../../../core/config/ConfigMgr';
import { t_s_campaignData } from "../../../config/t_s_campaign";
import { WorldBossEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import WorldBossManager from "../../../manager/WorldBossManager";
import WorldBossStuntmanInfo from "../../../mvc/model/worldboss/WorldBossStuntmanInfo";
import WorldBossItem from "../component/WorldBossItem";
import BaseWindow from '../../../../core/ui/Base/BaseWindow';
import UIButton from '../../../../core/ui/UIButton';
import { ArrayConstant, ArrayUtils } from '../../../../core/utils/ArrayUtils';
export default class WorldBossWnd extends BaseWindow {
    public list: fgui.GList = null;
    public closeBtn: UIButton;
    private _dataList: Array<t_s_campaignData> = [];
    protected setSceneVisibleOpen = true;

    constructor() {
        super();
        this.resizeContent = true;
    }

    public OnInitWind() {
        super.OnInitWind();
        this.initEvent();
        this.init();
    }

    OnShowWind() {
        super.OnShowWind();
    }

    private init() {
        var worldBossDic = ConfigMgr.Instance.worldBossDic;
        for (const key in worldBossDic) {
            if (Object.prototype.hasOwnProperty.call(worldBossDic, key)) {
                const temp = worldBossDic[key] as t_s_campaignData;
                if (temp.Types != 1) continue;
                this._dataList.push(temp);
            }
        }
        this._dataList = ArrayUtils.sortOn(this._dataList, ["state"], [ArrayConstant.NUMERIC]);
        this.list.numItems = this._dataList.length;
    }

    private initEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.playerInfo.addEventListener(PlayerEvent.WORLDBOSSSTATE, this.__updateStateListHandler, this);
        NotificationManager.Instance.addEventListener(WorldBossEvent.UPDATE_WARFIGHT_STATE_LIST, this.__updateStateListHandler, this);
        this.stuntman.addEventListener(Laya.Event.CHANGE, this.__updateStateListHandler, this);
    }

    private removeEvent() {
        this.playerInfo.removeEventListener(PlayerEvent.WORLDBOSSSTATE, this.__updateStateListHandler, this);
        NotificationManager.Instance.removeEventListener(WorldBossEvent.UPDATE_WARFIGHT_STATE_LIST, this.__updateStateListHandler, this);
        this.stuntman.removeEventListener(Laya.Event.CHANGE, this.__updateStateListHandler, this);
    }

    /**关闭点击 */
    protected OnBtnClose() {
        this.hide();
    }

    renderListItem(index: number, item: WorldBossItem) {
        item.info = this._dataList[index];
    }

    private __updateStateListHandler() {
        for (let i = 0; i < this._dataList.length; i++) {
            let item: WorldBossItem = this.list.getChildAt(i) as WorldBossItem;
            item.updateState();
        }
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    /** 替身 */
    private get stuntman(): WorldBossStuntmanInfo {
        return WorldBossManager.Instance.stuntman;
    }

    /**
     * 关闭界面
     */
    OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }
}