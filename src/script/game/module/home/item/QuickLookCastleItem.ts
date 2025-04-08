// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2023-10-27 16:07:58
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-03 10:07:48
 * @Description: 主界面  外城城战快速定位城堡  
 */

import FUI_QuickLookCastleItem from "../../../../../fui/Home/FUI_QuickLookCastleItem";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { BaseCastle } from "../../../datas/template/BaseCastle";
import { NotificationManager } from "../../../manager/NotificationManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { OuterCityMapCameraMediator } from "../../../mvc/mediator/OuterCityMapCameraMediator";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";

export default class QuickLookCastleItem extends FUI_QuickLookCastleItem {
    private _info: BaseCastle;

    public set info(value: BaseCastle) {
        this._info = value;
        this.refreshView();
    }

    public get info(): BaseCastle {
        return this._info
    }

    public onConstruct(): void {
        super.onConstruct()
        this.btnLookCastle.onClick(this, this.btnLookCastleClick)
    }

    public refreshView() {
        this.title.text = BaseCastle.getCastleStateName(this._info.state);
        this.title.color =  BaseCastle.getCastleStateColor(this._info.state);
    }

    btnLookCastleClick() {
        OuterCityManager.Instance.mapView.motionTo(new Laya.Point(this._info.posX * 20 - StageReferance.stageWidth / 2, this._info.posY * 20 - StageReferance.stageHeight / 2));
        NotificationManager.Instance.dispatchEvent(NotificationEvent.CLOSE_OUTERCITY_MAP_WND);
        OuterCityMapCameraMediator.lockMapCamera();
    }
}