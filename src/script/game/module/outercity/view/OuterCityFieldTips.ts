import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import {WildLand} from "../../../map/data/WildLand";
import LangManager from "../../../../core/lang/LangManager";
import {PlayerManager} from "../../../manager/PlayerManager";
import {DateFormatter} from "../../../../core/utils/DateFormatter";
import {ArmyManager} from "../../../manager/ArmyManager";
import UIManager from "../../../../core/ui/UIManager";
import {EmWindow} from "../../../constant/UIDefine";
import StringHelper from "../../../../core/utils/StringHelper";
import {MessageTipManager} from "../../../manager/MessageTipManager";
import BuildingManager from "../../../map/castle/BuildingManager";
import {NotificationManager} from "../../../manager/NotificationManager";
import {OuterCityEvent} from "../../../constant/event/NotificationEvent";

/**
 * @description 外城金矿tips
 * @author yuanzhan.yu
 * @date 2021/12/3 21:15
 * @ver 1.0
 */
export class OuterCityFieldTips extends BaseWindow
{
    public bg:fgui.GLoader;
    public txt_name:fgui.GTextField;
    public txt_lv:fgui.GTextField;
    public txt_occupyPlayerName:fgui.GTextField;
    public txt_power:fgui.GTextField;
    public txt_assets:fgui.GTextField;
    public txt_leftTime:fgui.GTextField;
    public btn_attack:UIButton;

    private _info:WildLand;
    private _countDown:number = 0;//倒计时

    constructor()
    {
        super();
    }

    public OnInitWind()
    {
        super.OnInitWind();

        this.initData();
        this.initView();
        this.initEvent();
    }

    private initData()
    {
        [this._info] = this.params;
    }

    private initView()
    {
        // this.txt_name.text = this._info.tempInfo.MapPhysicsTempNameLang;
        // this.txt_lv.text = " Lv" + this._info.tempInfo.Grades;
        // this.txt_occupyPlayerName.text = this._info.info.occupyPlayerName ? this._info.info.occupyPlayerName : LangManager.Instance.GetTranslation("public.notHave");
        // this.txt_power.text = "" + this._info.fightCapaity;

        // let property:number = (this._info.tempInfo.Property3 == 0) ? this._info.tempInfo.Property4 : this._info.tempInfo.Property3;
        // let houtTip:string = LangManager.Instance.GetTranslation("public.time.hour");
        // this.txt_assets.text = property + "/" + houtTip;

        // let curTime:number = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
        // let createTime:number = this._info.createDate.getTime();
        // createTime = curTime * 1000 - createTime;
        // let reTime:number = this._info.tempInfo.RefreshTime;
        // this._countDown = reTime - createTime / 1000;
        // if(reTime > 0)
        // {
        //     Laya.timer.loop(1000, this, this.updateCountDown)
        //     this.updateCountDown();
        // }

        if(this._info.info.occupyPlayerId == ArmyManager.Instance.thane.userId)
        {
            this.btn_attack.title = LangManager.Instance.GetTranslation("map.internals.view.frame.FieldInfoView.attackBtnText1");
        }
        else
        {
            this.btn_attack.title = LangManager.Instance.GetTranslation("public.attack");
        }
    }

    private initEvent()
    {
        this.btn_attack.onClick(this, this.onAttack);
    }

    protected createModel()
    {
        super.createModel();
        this.modelMask.alpha = 0;
    }

    public OnShowWind()
    {
        super.OnShowWind();

    }

    private updateCountDown()
    {
        if(this._countDown > 0)
        {
            this.txt_leftTime.text = DateFormatter.getConsortiaCountDate(this._countDown);
            this._countDown--;
        }
        else
        {
            this.txt_leftTime.text = "00:00:00";
            Laya.timer.clear(this, this.updateCountDown);
        }
    }

    private onAttack()
    {
        let olName:string = this._info.info.occupyLeagueName;
        let str:string;
        if(ArmyManager.Instance.thane.grades >= 6)
        {
            if(ArmyManager.Instance.thane.userId == this._info.info.occupyPlayerId)
            {
                UIManager.Instance.ShowWind(EmWindow.OuterCityFieldInfoWnd, this._info);
            }
            else if (BuildingManager.Instance.model.fieldArray.length >= 2) {
                str = LangManager.Instance.GetTranslation("map.outercity.view.mapphysics.MapPhysicsField.txt");
                MessageTipManager.Instance.show(str);
                this.hide();
                return;
            }
            else if(!StringHelper.isNullOrEmpty(olName) && olName == PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaName)
            {
                str = LangManager.Instance.GetTranslation("map.outercity.view.mapphysics.MapPhysicsField.AttackConsortiaMember");
                MessageTipManager.Instance.show(str);
                this.hide();
                return;
            }
            else
            {
                if(BuildingManager.Instance.model.fieldArray.length >= 2)
                {
                    str = LangManager.Instance.GetTranslation("map.outercity.view.mapphysics.MapPhysicsField.txt");
                    MessageTipManager.Instance.show(str);
                    this.hide();
                    return;
                }
                NotificationManager.Instance.dispatchEvent(OuterCityEvent.START_MOVE, this._info);
            }
            this.hide();
        }
    }

    private removeEvent()
    {
        this.btn_attack.offClick(this, this.onAttack);
    }

    public OnHideWind()
    {
        super.OnHideWind();

        this.removeEvent();
    }

    dispose(dispose?:boolean)
    {
        Laya.timer.clear(this, this.updateCountDown);
        this._info = null;
        super.dispose(dispose);
    }
}