import AudioManager from '../../../core/audio/AudioManager';
import Logger from '../../../core/logger/Logger';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIManager from '../../../core/ui/UIManager';
import OpenGrades from '../../constant/OpenGrades';
import { SoundIds } from '../../constant/SoundIds';
import { EmWindow } from '../../constant/UIDefine';
import { ArmyManager } from '../../manager/ArmyManager';
import { PlayerManager } from '../../manager/PlayerManager';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import SkillWndCtrl from '../skill/SkillWndCtrl';
/**
* @author:pzlricky
* @data: 2021-03-03 11:40
* @description 升级
*/
export default class LevelUpWnd extends BaseWindow {

    public static open: boolean = false;
    protected resizeContent: boolean = true;
    private level: fgui.GTextField;//等级


    /**初始化 */
    public OnInitWind() {
        super.OnInitWind();
        this.level.text = ArmyManager.Instance.thane.grades.toString();
        this.addEvent()
        Laya.timer.once(3000, this, this.onTime5)
    } 

    private onTime5() {
        if (!this.destroyed) {
            Laya.timer.clearAll(this);
            this.hide();
        }
    }

    OnShowWind() {
        super.OnShowWind();
    }

    /**关闭 */
    OnHideWind() {
        Logger.xjy("[LevelUpWnd]OnHideWind")
        LevelUpWnd.open = false;
        this.offEvent();
        super.OnHideWind();
        if(ArmyManager.Instance.thane.grades >= OpenGrades.VEHICEL){
            if(PlayerManager.Instance.currentPlayerModel.playerInfo.runePowerPoint <=0){
                let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
                ctrl &&ctrl.reqRuneGemLottery(1);
            }  
        }
    }

    /**关闭窗口 */
    closeWnd() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        UIManager.Instance.HideWind(EmWindow.LevelUp);
    }

    private addEvent() {
        this.on(Laya.Event.CLICK, this, this.closeWnd);
    }

    private offEvent() {
        this.off(Laya.Event.CLICK, this, this.closeWnd);
    }

    public dispose(dispose?: boolean): void {
        Logger.xjy("[LevelUpWnd]dispose")
        LevelUpWnd.open = false
        super.dispose(dispose)
    }
}