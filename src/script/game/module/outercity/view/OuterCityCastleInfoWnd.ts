import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import FUI_Dialog2 from "../../../../../fui/Base/FUI_Dialog2";
import UIButton from "../../../../core/ui/UIButton";
import { BaseCastle } from "../../../datas/template/BaseCastle";
import LangManager from "../../../../core/lang/LangManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { OuterCityEvent } from "../../../constant/event/NotificationEvent";
import SceneType from "../../../map/scene/SceneType";
import { SceneManager } from "../../../map/scene/SceneManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerInfoManager } from "../../../manager/PlayerInfoManager";
import { ArmyManager } from "../../../manager/ArmyManager";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import Point = Laya.Point;
import { JobType } from "../../../constant/JobType";

/**
 * @description 外城城堡信息
 * @author yuanzhan.yu
 * @date 2021/12/2 10:51
 * @ver 1.0
 */
export class OuterCityCastleInfoWnd extends BaseWindow {
    public frame: FUI_Dialog2;
    public txt_name: fgui.GRichTextField;
    public txt_lord: fgui.GTextField;
    public txt_consortia: fgui.GTextField;
    public btn_attack: UIButton;
    public btn_cancel: UIButton;

    private _info: BaseCastle;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();

        this.initData();
        this.initView();
        this.initEvent();
        this.setCenter();
    }

    private initData() {
        this._info = this.params as BaseCastle;
    }

    private initView() {
        if (this._info.info.occupyPlayerId == 0) {
            this.frame.title = LangManager.Instance.GetTranslation("map.internals.view.frame.CityInfoView.command08");
        }
        else {
            this.frame.title = LangManager.Instance.GetTranslation("map.internals.view.frame.CityInfoView.command09");
        }

        //{name=玩家名字}[color=#00f1ff]{pos=（234,234）}[/color]
        this.txt_name.text = this._info.info.names + "  " +"[color=#00f1ff](" + this._info.convertX + "," + this._info.convertY + ")[/color]";
        this.txt_lord.text = this._info.info.names;
        this.txt_consortia.text = this._info.info.occupyLeagueName ? this._info.info.occupyLeagueName : LangManager.Instance.GetTranslation("map.internals.view.frame.CityInfoView.politeText2.none");
        if (PlayerManager.Instance.currentPlayerModel.playerInfo.userId == this._info.info.occupyPlayerId) {
            this.btn_attack.title = LangManager.Instance.GetTranslation("map.internals.view.frame.CityInfoView.command06");
            return;
        }
        if (this._info.info.occupyPlayerId != 0) {
            this.btn_cancel.title = LangManager.Instance.GetTranslation("public.cancel");
            this.btn_attack.title = LangManager.Instance.GetTranslation("public.attack");
        }
        else if (this._info.info.occupyPlayerId == 0) {
            this.btn_cancel.title = LangManager.Instance.GetTranslation("public.cancel");
            this.btn_attack.title = LangManager.Instance.GetTranslation("map.internals.view.frame.CityInfoView.command07");
        }

    }

    private initEvent() {
        this.btn_attack.onClick(this, this.__attackHandler);
        this.btn_cancel.onClick(this, this.__moveHandler);
        this.txt_name.onClick(this, this.__playerNameClickHandler);
    }

    public OnShowWind() {
        super.OnShowWind();

    }

    protected OnBtnClose() {
        NotificationManager.Instance.dispatchEvent(OuterCityEvent.START_MOVE, new Point(this._info.x, this._info.y));
        super.OnBtnClose()
    }

    protected __moveHandler(): void {
        NotificationManager.Instance.dispatchEvent(OuterCityEvent.START_MOVE, new Point(this._info.x, this._info.y));
        this.hide();
    }

    protected __attackHandler(): void {
        if (this.btn_attack.title == LangManager.Instance.GetTranslation("map.internals.view.frame.CityInfoView.command06")) {
            SceneManager.Instance.setScene(SceneType.CASTLE_SCENE);
            this.hide();
        }
        else if (this.btn_attack.title == LangManager.Instance.GetTranslation("public.attack")) {
            OuterCityManager.Instance.controler.sendAttack(this._info.posX, this._info.posY);
            this.hide();
        }
        else if (this.btn_attack.title == LangManager.Instance.GetTranslation("map.internals.view.frame.CityInfoView.command07")) {
        }
    }

    private __playerNameClickHandler(): void {
        return;
        //fixme by yuyuanzhan 查看其他玩家
        if (this._info.info.occupyPlayerId >= 1300000000) {
            let str: string = LangManager.Instance.GetTranslation("map.internals.view.frame.CityInfoView.command05");
            MessageTipManager.Instance.show(str);
            return;
        }
        let playerInfo: PlayerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        if (this._info.info.occupyPlayerId == playerInfo.userId) {
            PlayerInfoManager.Instance.show(ArmyManager.Instance.thane);
        }
        else {
            let th: ThaneInfo = new ThaneInfo();
            th.userId = this._info.info.occupyPlayerId;
            th.nickName = this._info.info.occupyPlayerName;
            th.consortiaName = this._info.info.occupyLeagueName;
            th.job = JobType.HUNTER;
            PlayerInfoManager.Instance.show(th);
        }
    }

    private removeEvent() {
        this.btn_attack.offClick(this, this.__attackHandler);
        this.btn_cancel.offClick(this, this.__moveHandler);
        this.txt_name.offClick(this, this.__playerNameClickHandler);
    }

    public OnHideWind() {
        super.OnHideWind();

        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        this._info = null;
        super.dispose(dispose);
    }
}