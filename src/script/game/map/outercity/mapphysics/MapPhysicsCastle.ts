// @ts-nocheck

import { ArmyManager } from "../../../manager/ArmyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { PhysicsCastleView } from "./PhysicsCastleView";
import LangManager from "../../../../core/lang/LangManager";
import { EmWindow } from "../../../constant/UIDefine";
import { TipsShowType } from "../../../tips/ITipedDisplay";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { BaseCastle } from "../../../datas/template/BaseCastle";

/**
 * @description    外城城堡 村庄
 * @author yuanzhan.yu
 * @date 2021/11/17 16:05
 * @ver 1.0
 */
export class MapPhysicsCastle extends PhysicsCastleView// implements ITipedDisplay
{
    tipData: any;
    tipType: EmWindow;
    alphaTest: boolean = true;
    showType: TipsShowType = TipsShowType.onClick;
    startPoint: Laya.Point;
    protected initView() {
        super.initView();

        // 村庄太小, 不开启像素检测
        if ((this.info as BaseCastle).info.occupyPlayerId == 0) {
            this.alphaTest = false;
        }
    }

    protected setFireView(): void {
        super.setFireView();
        this._attacking.y = -110;
        this.addChild(this._attacking.displayObject);
    }

    protected layouCallBack(): void {
        super.layouCallBack();
        let width = this.sizeInfo["width"];
        let height = this.sizeInfo["height"];
        if (width > 0 && height > 0) {
            let x = parseInt((width / 2).toString()) + 75;
            let y = parseInt((height/4 - 10).toString());
            ToolTipsManager.Instance.register(this);
            this.tipType = EmWindow.OuterCityCastleTips;
            this.startPoint = new Laya.Point(-x, -y);
            this.tipData = this.info;
        }
    }

    public mouseClickHandler(evt: Laya.Event): boolean {
        // if ((ArmyManager.Instance.thane.grades < 8) && (this.castleInfo.info.occupyPlayerId != PlayerManager.Instance.currentPlayerModel.userInfo.userId)) {
        //     let str: string = LangManager.Instance.GetTranslation("map.outercity.view.mapphysics.MapPhysicsCastle.command01");
        //     MessageTipManager.Instance.show(str);
        //     return false;
        // }
        return true;
    }

    public async attackFun()
    {
        let event:Laya.Event = new Laya.Event();
        event.currentTarget = this;
        ToolTipsManager.Instance.showTip(event);
    }
    
    dispose() {
        ToolTipsManager.Instance.unRegister(this);
        super.dispose();
    }
}