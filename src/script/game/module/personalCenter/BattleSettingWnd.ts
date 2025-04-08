// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2023-03-29 15:45:13
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-04 10:10:09
 * @Description: 
 */
import AudioManager from '../../../core/audio/AudioManager';
import LangManager from '../../../core/lang/LangManager';
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from '../../../core/ui/UIButton';
import { BattleManager } from '../../battle/BattleManager';
import { BattleModel } from '../../battle/BattleModel';
import OpenGrades from '../../constant/OpenGrades';
import { BattleEvent } from '../../constant/event/NotificationEvent';
import { ArmyManager } from '../../manager/ArmyManager';
import { BaseManager } from '../../manager/BaseManager';
import { NotificationManager } from '../../manager/NotificationManager';
import { SharedManager } from '../../manager/SharedManager';
import { SocketSendManager } from '../../manager/SocketSendManager';
import BattleWnd from '../battle/BattleWnd';
import { SettingType } from '../setting/SettingData';


export default class BattleSettingWnd extends BaseWindow {
    private settingItem1: fgui.GComponent;
    private settingItem2: fgui.GComponent;

    public musicSlider: fgui.GSlider;
    public soundSlider: fgui.GSlider;
    public musicCbx: fgui.GButton;
    public soundCbx: fgui.GButton;
    public btnWithdraw: UIButton;
    public txt_pro0: fgui.GTextField;
    public txt_pro1: fgui.GTextField;

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.setBtnWithdrawState();
    }


    private addEvent() {
        this.musicCbx.onClick(this, this.onMusic);
        this.soundCbx.onClick(this, this.onSound);
        this.musicSlider.on(fairygui.Events.STATE_CHANGED, this, this.onMusicPro);
        this.soundSlider.on(fairygui.Events.STATE_CHANGED, this, this.onSoundPro);
    }

    private offEvent() {

    }

    OnShowWind() {
        super.OnShowWind();
        this.addEvent();

        this.musicSlider.min = 0;
        this.musicSlider.max = 100;
        this.soundSlider.min = 0;
        this.soundSlider.max = 100;

        this.musicCbx.selected = SharedManager.Instance.allowMusic;
        this.soundCbx.selected = SharedManager.Instance.allowSound;
        this.musicSlider.value = SharedManager.Instance.musicVolumn;
        this.soundSlider.value = SharedManager.Instance.soundVolumn;
        this.txt_pro0.text = this.musicSlider.value.toFixed(0) + '%';
        this.txt_pro1.text = this.soundSlider.value.toFixed(0) + '%';

        this.musicSlider.enabled = this.musicCbx.selected;
        this.soundSlider.enabled = this.soundCbx.selected;

        (this.settingItem1.getChild('txt_name').asTextField).text = LangManager.Instance.GetTranslation("SettingWnd.settingData4");
        let btn_switch1: fairygui.GButton = (this.settingItem1.getChild('btn_switch').asButton);
        btn_switch1.selected = SharedManager.Instance.allowAttactedEffect;
        btn_switch1.onClick(this, this.onSelectItem, [btn_switch1, SettingType.HIDE_FIGHTING_OBJECT]);

        (this.settingItem2.getChild('txt_name').asTextField).text = LangManager.Instance.GetTranslation("GameSetCom.hightFPSTxt");
        let btn_switch2: fairygui.GButton = (this.settingItem2.getChild('btn_switch').asButton);
        btn_switch2.selected = SharedManager.Instance.openHighFrame;
        btn_switch2.onClick(this, this.onSelectItem, [btn_switch2, SettingType.HIGH_FRAME])
    }

    private btnWithdrawClick() {
        // let battleModel: BattleModel = BattleManager.Instance.battleModel;
        // if (battleModel && battleModel.battleType == BattleType.PET_PK || battleModel.battleType == BattleType.REMOTE_PET_BATLE) {
        //     let battleModel: BattleModel = BattleManager.Instance.battleModel;
        //     BattleCtrl.sendEndBattle(battleModel.battleId);
        // } else {
        SocketSendManager.Instance.sendWithDrawBattle(0);
        // }

        this.hide();
    }

    private onMusic(): void {
        BaseManager.isMusicOn = this.musicCbx.selected;
        SharedManager.Instance.allowMusic = this.musicCbx.selected;
        AudioManager.Instance.allowMusic = this.musicCbx.selected;
        NotificationManager.Instance.dispatchEvent(BattleEvent.BATTLE_MUSIC_ON_OFF, null);
        SharedManager.Instance.save();
        this.musicSlider.enabled = this.musicCbx.selected;
    }

    private onSound(): void {
        BaseManager.isSoundOn = this.soundCbx.selected;
        SharedManager.Instance.allowSound = this.soundCbx.selected;
        AudioManager.Instance.allowSound = this.soundCbx.selected;
        SharedManager.Instance.save();
        this.soundSlider.enabled = this.soundCbx.selected;
    }

    private onMusicPro(): void {
        let val = Number(this.musicSlider.value);
        SharedManager.Instance.musicVolumn = val;
        AudioManager.Instance.musicVolume = val / 100;
        this.txt_pro0.text = val.toFixed(0) + '%';
        SharedManager.Instance.save();
    }

    private onSoundPro(): void {
        let val = Number(this.soundSlider.value);
        SharedManager.Instance.soundVolumn = val;
        AudioManager.Instance.soundVolume = val / 100;
        this.txt_pro1.text = val.toFixed(0) + '%';
        SharedManager.Instance.save();
    }

    /**单击列表 */
    private onSelectItem(target: any, settingType: SettingType) {
        let targetState = target.selected;
        switch (settingType) {
            case SettingType.HIGH_FRAME:
                SharedManager.Instance.openHighFrame = targetState;
                Laya.stage.frameRate = targetState ? Laya.Stage.FRAME_FAST : Laya.Stage.FRAME_SLOW;
                break;
            case SettingType.HIDE_FIGHTING_OBJECT:
                SharedManager.Instance.allowAttactedEffect = targetState;
                break;
            default: break;
        }
        SharedManager.Instance.save();
    }

    private setBtnWithdrawState() {
        if (ArmyManager.Instance.thane.grades < OpenGrades.BATTLE_WITHDRAW) return this.btnWithdraw.visible = false;
        let battleModel = BattleManager.Instance.battleModel as BattleModel;
        if (!battleModel) return;

        let battleUIView = BattleManager.Instance.battleUIView as BattleWnd;
        if (!battleUIView) return;
        this.btnWithdraw.enabled = !battleUIView.withdrawHandler.showWithdrawVote && battleModel.isEnableWithdraw;
    }

    OnHideWind() {
        super.OnHideWind();
        this.offEvent();
    }
}