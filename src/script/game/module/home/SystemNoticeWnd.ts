import FUI_HomeBugleNoticeWnd from '../../../../fui/Home/FUI_HomeBugleNoticeWnd';
import FUI_SystemNoticeWnd from '../../../../fui/Home/FUI_SystemNoticeWnd';
import LangManager from '../../../core/lang/LangManager';
import UIManager from '../../../core/ui/UIManager';
import Utils from '../../../core/utils/Utils';
import XmlMgr from '../../../core/xlsx/XmlMgr';
import { AlertTipAction } from '../../battle/actions/AlertTipAction';
import { ChatEvent, NotificationEvent } from '../../constant/event/NotificationEvent';
import { PlayerEvent } from '../../constant/event/PlayerEvent';
import { EmWindow } from '../../constant/UIDefine';
import { ChatChannel } from '../../datas/ChatChannel';
import { ThaneInfo } from '../../datas/playerinfo/ThaneInfo';
import { ArmyManager } from '../../manager/ArmyManager';
import { ChatManager } from '../../manager/ChatManager';
import { NotificationManager } from '../../manager/NotificationManager';
import { SceneManager } from '../../map/scene/SceneManager';
import SceneType from '../../map/scene/SceneType';
import ChatData from '../chat/data/ChatData';
/**
* @author:zhihua.zhou
* @data: 2022-01-19
* @description 场景中间横幅系统广告
*/
export default class SystemNoticeWnd extends FUI_SystemNoticeWnd{

    private _list: Array<ChatData>;
    private content: fgui.GRichTextField;
    private _dwellTime: number = 2000;
    private _druation: number = 6000;

    onConstruct() {
        super.onConstruct();
        this._list = [];
        this.addEvent();
        this.content = this.scrollMsg.getChild('content').asRichTextField;
        this.visible = false;
        this._isPlaying = false;
        if (this.thane.grades < 6) {
            this.visible = false;
            this._isPlaying = false;
            this.thane.addEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this.__levelUpHandler, this);
        }
        this.touchable = false;
    }

    private __levelUpHandler(evt) {
        if (this.thane.grades >= 6) {
            this.thane.removeEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this.__levelUpHandler, this);
        }
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private moveOut() {
        if (this._isShowing) {
            Laya.Tween.to(this.content, { x: -this.content.width }, this._druation, undefined, Laya.Handler.create(this, this.outComplete));
        }
    }

    private outComplete() {
        this._isShowing = false;
        this._isPlaying = false;
        Laya.Tween.clearAll(this.content);
        this.playNext();
    }

    private moveIn() {
        this._isShowing = true;
        if (this._currentData.channel == ChatChannel.NOTICE) {
            let elementText: string = "";
            let elements = this._currentData.getAllElements();
            for (let index = 0; index < elements.length; index++) {
                let element = elements[index];
                elementText += element.text;
            }
            this.content.text = elementText;
            this._currentData.msg = ChatManager.Instance.analyzeExpressionAfterNormal(this._currentData.msg);
            // this._currentData.channel = ChatChannel.BIGBUGLE;
        } 
        //文本移动
        this.content.x = this.width;
        let centerPosX = 0;
        if (this.content.width > this.width - 40) {
            centerPosX = 0;
        } else {
            centerPosX = (this.width - 40 - this.content.width) / 2;
        }
        Laya.Tween.to(this.content, { x: centerPosX }, this._druation, undefined, Laya.Handler.create(this, this.inComplete))
    }

    private inComplete() {
        Laya.Tween.clearAll(this.content);
        Utils.delay(this._dwellTime).then(() => {
            this.moveOut();
        })
    }

    private _isShowing: boolean = false;
    private _currentData: ChatData = null;
    private playNext() {
        if (this._currentData) {
            this._currentData = null;
        }
        let cloneData = this._list.shift();
        if (cloneData) {
            this._currentData = new ChatData();
            this._currentData = this._currentData.clone(cloneData);
        }

        if (!this._currentData || this._currentData.msg == "" || this._currentData.msg == undefined || this.thane.grades < 6) {
            this._isPlaying = false;
            this.visible = false;
            return;
        }else
        {
            this.moveIn();
        }
    }
    
    private addEvent() {
        NotificationManager.Instance.addEventListener(NotificationEvent.SWITCH_SCENE, this.__onSceneChangeHandler, this);
        NotificationManager.Instance.addEventListener(ChatEvent.UPDATE_NOTICE_VIEW, this.__addDataHandler, this);
    }

    private _isPlaying: boolean = false;
    private __addDataHandler(evtData) {
        var chatData: ChatData = null;
        let tempData = (evtData as ChatData);
        chatData = Utils.deepCopy(tempData);//拷贝一份
        if (this.thane.grades < 6) return;
        if (chatData) {//将bigBugleType == 5的chatData, 即烟花大嗽叭放在队列最后
            this._list.push(chatData);
        }
        if (!this._isPlaying) {
            this._isPlaying = true;
            this.visible = true;
            this.playNext();
        }
    }

    private __onSceneChangeHandler(evt?: any) {
        if (this.__checkSceneShow()) {
            this.Show();
        } else {
            this.Hide();
        }
    }

    /**检查当前场景是否可以展示公告 */
    private __checkSceneShow(): boolean {
        if (this.checkScene()) {
            return this._currentData && (this._currentData.bigBugleType != 5);
        } else {
            return false;
        }
    }

    public Show() {
        let state = this.__checkSceneShow();
        this.visible = state;
    }

    public Hide() {
        this.visible = false;
    }


    private checkScene(): boolean {
        return SceneManager.Instance.currentType != SceneType.BATTLE_SCENE;
    }

    public dispose() {
        super.dispose();
        this._isShowing = false;
        this._isPlaying = false;
    }

}