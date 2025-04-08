// @ts-nocheck
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { GvgEvent } from "../../../constant/event/NotificationEvent";
import { GvgReadyController } from "../control/GvgReadyController";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { GuildGroupIndex } from "../data/gvg/GuildGroupIndex";
import { GuildGroupInfo } from "../data/gvg/GuildGroupInfo";
import { ConsortiaRankItem } from "./component/ConsortiaRankItem";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import Utils from "../../../../core/utils/Utils";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/10/19 17:29
 * @ver 1.0
 */
export class ConsortiaRankWnd extends BaseWindow {
    public frame: fgui.GLabel;
    public list: fgui.GList;
    public txt_time: fgui.GTextField;

    private _curDay: number;
    private _controller: GvgReadyController;
    private _guildGroupInfos: GuildGroupInfo[];

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initData();
        this.initEvent();
        this.initView();
    }

    private initData() {
        this._controller = FrameCtrlManager.Instance.getCtrl(EmWindow.GvgRankListWnd) as GvgReadyController;
        this._curDay = GuildGroupIndex.group10;
    }

    private initEvent() {
        this.playerInfo.addEventListener(PlayerEvent.CONSORTIA_CHANGE, this.__existConsortiaHandler, this);
        this._controller.model.addEventListener(GvgEvent.UPDATE_GUILD_GROUP, this.__updateGuildGroupHandler, this);
    }

    private initView() {
        this.list.itemRenderer = Laya.Handler.create(this, this.onListItemRender, null, false);
        this.list.setVirtual();
    }

    public OnShowWind() {
        super.OnShowWind();

        this.refreshView();
    }

    private refreshView() {
        if (this._curDay == GuildGroupIndex.group10) {
            let datalist = this._controller.model.getGroupByIndex(this._curDay);
            this._guildGroupInfos = [];
            for (let index = 0; index < datalist.length; index++) {
                let element = datalist[index];
                if (element.consortiaName != "" && element.consortiaId != 0) {
                    this._guildGroupInfos.push(element);
                }
            }
            this.list.numItems = this._guildGroupInfos.length;
            this.txt_time.text = this._controller.model.guildOrderDate ? DateFormatter.format(this._controller.model.guildOrderDate, "YYYY-MM-DD hh:mm") : "";
        }
    }

    private onListItemRender(index: number, item: ConsortiaRankItem) {
        item.info = this._guildGroupInfos[index];
    }

    private __existConsortiaHandler() {
        if (this.playerInfo.consortiaID == 0) {
            this.hide();
        }
    }

    private __updateGuildGroupHandler() {
        this.refreshView();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private removeEvent() {
        this.playerInfo.removeEventListener(PlayerEvent.CONSORTIA_CHANGE, this.__existConsortiaHandler, this);
        this._controller.model.removeEventListener(GvgEvent.UPDATE_GUILD_GROUP, this.__updateGuildGroupHandler, this);
    }

    dispose(dispose?: boolean) {
        this._controller = null;
        this._guildGroupInfos = null;
        // this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);

        super.dispose(dispose);
    }
}