// @ts-nocheck
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { t_s_pluralpvpsegmentData } from "../../../config/t_s_pluralpvpsegment";
import ColorConstant from "../../../constant/ColorConstant";
import { ConfigType } from "../../../constant/ConfigDefine";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { CampaignArmy } from "../../../map/campaign/data/CampaignArmy";
import PvpPreviewItem from "./item/PvpPreviewItem";
import PvpRewardsItem from "./item/PvpRewardsItem";
import RankStarItem from "./item/RankStarItem";

export default class PvpRoomResultWnd extends BaseWindow {
    public cWin:fgui.Controller;
	public rankItem:RankStarItem;
	public txtClose:fgui.GTextField;
	public txtTitle:fgui.GTextField;
	public txtScore:fgui.GTextField;
	public txtChange:fgui.GTextField;
    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initText();
        if (this.frameData) {
            this.getController('cWin').selectedIndex = this.frameData.win ? 1 : 0;
            
            this.txtChange.color = this.frameData.win ? ColorConstant.GREEN_COLOR : ColorConstant.RED_COLOR;
            this.txtChange.text = (this.frameData.win ? '+' : '-') + this.frameData.change;
        }
        this.txtScore.text = this.playerInfo.mulSportScore + '';
        this.rankItem.setInfo(this.playerInfo.segmentId);
        this.addEvent();
    }

    initText() {
        this.txtClose.text = LangManager.Instance.GetTranslation('RoomList.pvp.result.txt1');
        this.txtTitle.text = LangManager.Instance.GetTranslation('RoomList.pvp.result.txt2');
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private addEvent() {
        this.on(Laya.Event.CLICK, this, this.OnBtnClose);
    }

    private offEvent() {
        this.off(Laya.Event.CLICK, this, this.OnBtnClose);
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
        this.offEvent();
    }
}