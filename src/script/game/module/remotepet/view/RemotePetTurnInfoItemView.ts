import FUI_RemotePetTurnInfoItemView from "../../../../../fui/RemotePet/FUI_RemotePetTurnInfoItemView";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { RemotePetManager } from "../../../manager/RemotePetManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { RemotePetModel } from "../../../mvc/model/remotepet/RemotePetModel";
import { RemotePetTurnItemInfo } from "../../../mvc/model/remotepet/RemotePetTurnItemInfo";

export class RemotePetTurnInfoItemView extends FUI_RemotePetTurnInfoItemView {

    private _data: RemotePetTurnItemInfo;

    protected onConstruct(): void {
        super.onConstruct();
        this.onClick(this, this.__clickHandler)
    }

    public set info(v: RemotePetTurnItemInfo) {
        this._data = v;
        this.freshView();
    }

    public get info() {
        return this._data;
    }

    public freshView() {
        this.visible = false;
        if (!this._data) return;
        this.visible = true;
        this._minboss_box.visible = false;
        this._boss_box.visible = false;
        this._normal_box.visible = false;
        this._challenge.visible = false;
        this._number.visible = false;

        let _icon = this._icon.getChild("_icon");
        _icon.icon = null;
        if (this._data.tempInfo.Index == this.model.turnInfo.currTurn) {
            this._challenge.visible = true;
        }

        // if (this._data.tempInfo.Type == 2) {
        //     this._minboss_box.visible = true;
        //     this._icon.setSize(54, 54);
        //     _icon.icon = IconFactory.getRemotePetIconPath(this._data.tempInfo.Icon2);
        //     if (this.model.turnInfo.specialIndexOfArray.indexOf(this._data.tempInfo.Index + "") >= 0) {
        //         // _ownerImg.visible = true;
        //     }
        // }

        if (this._data.tempInfo.Index % 5 == 0) {
            // _back.setFrame(3);
            _icon.icon = IconFactory.getRemotePetIconPath(this._data.tempInfo.Icon2);
            this._boss_box.visible = true;
            this._minboss_box.visible = false;
            this._icon.setSize(78, 78);
        }

        if (this._data.tempInfo.Index == this.model.turnInfo.currTurn && this._data.tempInfo.Index % 5 == 0) {
            // _mc = ComponentFactory.Instance.creatCustomObject("asset.remotepet.bossEffect");
            // addChild(_mc);
        }

        if (this._data.tempInfo.Index < this.model.turnInfo.currTurn ) {
            // _filter.setGrayFilter(this);
            // this.displayObject.filters = [UIFilter.grayFilter];
        }

        if (this._data.tempInfo.Index % 5 != 0) {
            this._number.text = this._data.tempInfo.Index + "";
            this._number.visible = true;
            this._normal_box.visible = true;
        }

    }

    private __clickHandler() {
        let _data = this._data;
        if (!_data) return;

        FrameCtrlManager.Instance.open(EmWindow.RemotePetChallengeWnd, this._data);

        let model = this.model;
        // if (_data.tempInfo.Type == 2) {
        //     if (model.turnInfo.specialIndexOfArray.indexOf(_data.tempInfo.Index + "") >= 0) {
        //         // MessageTipManager.instance().show(LanguageMgr.GetTranslation("remotepet.RemotePetTurnInfoItemView.command03"));
        //         return;
        //     }
        // }

        if (_data.tempInfo.Index < model.turnInfo.currTurn ) {
            // MessageTipManager.instance().show(LanguageMgr.GetTranslation("remotepet.RemotePetTurnInfoItemView.command01"));
            return;
        }

        if (_data.tempInfo.Index > model.turnInfo.currTurn) {
            // MessageTipManager.instance().show(LanguageMgr.GetTranslation("remotepet.RemotePetTurnInfoItemView.command02"));
            return;
        }

        if ((_data.tempInfo.Index == model.turnInfo.currTurn) ||  _data.tempInfo.Index <= model.turnInfo.maxTurn) {
            // let t: int = getTimer();
            // if (t - _lastClickTime < 1000) {
            //     MessageTipManager.instance().show(LanguageMgr.GetTranslation("activity.view.ActivityItem.command01"));
            //     return;
            // }
            // _lastClickTime = t;
            // if (_data.tempInfo.Type == 1) {
            //     if (model.turnInfo.currTurn < model.maxMopupTurn) {
            //         FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.MOPUP, 5, 1);
            //         return;
            //     }
            // }

            // let flag = _data.tempInfo.Type == 2;
            // RemotePetManager.Instance.sendFight(_data.tempInfo.IndexID, flag);
        }
    }


    private get model(): RemotePetModel {
        return RemotePetManager.Instance.model;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    public dispose(): void {
    }
}