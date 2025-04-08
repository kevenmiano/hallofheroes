/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2024-01-03 11:14:26
 * @LastEditTime: 2024-04-10 12:21:36
 * @LastEditors: jeremy.xu
 * @Description: 增援
 */

import Logger from "../../../../core/logger/Logger";
import { BattleManager } from "../../../battle/BattleManager";
import { BattleModel } from "../../../battle/BattleModel";
import { EmPackName } from "../../../constant/UIDefine";
import FUIHelper from "../../../utils/FUIHelper";
import NewbieModule from "../../guide/NewbieModule";
import BattleWnd from "../BattleWnd";
import ReinforceWavePane from "../ui/reinforce/ReinforceWavePane";


export class ReinforceViewHandler {
    private wnd: BattleWnd;
    private view: ReinforceWavePane;
    private reinforcePos: fgui.GGraph;
    constructor(wnd: BattleWnd) {
        this.wnd = wnd;

        if (!NewbieModule.Instance.checkEnterCastle()) {
            return
        }
        this.initView()
        this.addEvent()
    }

    private addEvent() {
    }

    private removeEvent() {
    }

    private initView() {
        this.reinforcePos = this.wnd["reinforcePos"]
        this.setReinforceWaveInfo(this.battleModel.reinforceWave, this.battleModel.currentReinforceWave + 1);
    }

    public setReinforceWaveInfo(total: number, current: number) {
        if (!NewbieModule.Instance.checkEnterCastle()) {
            return
        }

        if (total <= 0) {
            return
        }

        if (!this.view) {
            this.view = FUIHelper.createFUIInstance(EmPackName.Battle, "ReinforceWavePane");
            let contentPanel = this.wnd.getContentPane();
            if (contentPanel) {
                contentPanel.addChild(this.view);
                Logger.battle("设置增援 ", current, total)
            } else {
                Logger.warn("设置增援失败 BattleWnd未创建或已销毁")
            }
            this.view.setXY(this.reinforcePos.x, this.reinforcePos.y);
        }
        this.view.setTotalWave(total);
        this.view.setCurrentWave(current);
    }

    public updateReinforceWave() {
        if (this.view) {
            this.view.showNextWave();
        }
    }

    private get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }

    public dispose() {
        this.removeEvent()
    }
}