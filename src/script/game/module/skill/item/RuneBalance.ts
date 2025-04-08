import FUI_RuneBalance from "../../../../../fui/Skill/FUI_RuneBalance";
import { FormularySets } from "../../../../core/utils/FormularySets";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { BagEvent, ResourceEvent, RuneEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { GoodsManager } from "../../../manager/GoodsManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import HomeWnd from "../../home/HomeWnd";
import RunesUpgradeWnd from "../RunesUpgradeWnd";

export class RuneBalance extends FUI_RuneBalance {
    //@ts-ignore
    public tipItem1:BaseTipItem;
     //@ts-ignore
    public tipItem2:BaseTipItem;
    onConstruct() {
        super.onConstruct();
    }

    public initView(){
        this.addEvent();
        this.__playerDataUpdate();
        this.updateRune();
        this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND);
        this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_FUWEN_STONE);
    }

    private addEvent() {
        PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__playerDataUpdate, this);  
        NotificationManager.Instance.addEventListener(RuneEvent.RUNE_UPGRADE, this.updateRune, this);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdate, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__bagItemUpdate, this);
    }
 
    private removeEvent() {
        PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__playerDataUpdate, this);
        NotificationManager.Instance.removeEventListener(RuneEvent.RUNE_UPGRADE, this.updateRune, this);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdate, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__bagItemUpdate, this);
    }

    private __playerDataUpdate() {
        this.giftTxt.text = FormularySets.toStringSelf(PlayerManager.Instance.currentPlayerModel.playerInfo.point, HomeWnd.STEP);
    }

    __bagItemUpdate(){
        this.updateRune();
    }

    private updateRune(){
        let tempMax = GoodsManager.Instance.getGoodsNumByTempId(RunesUpgradeWnd.LOW_RUNE_TEMPID);
        let _max = tempMax ? tempMax : 0;
        this.txt_rune.text = _max.toString();
    }

    onHide(){
        this.removeEvent();
    }
    dispose(): void {
        super.dispose();
    }

}