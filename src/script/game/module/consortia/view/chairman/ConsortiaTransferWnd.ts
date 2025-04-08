// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:31:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-07-21 16:22:07
 * @Description: 公会转让 v2.46 ConsortiaTransferFrame
 */
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import UIButton from '../../../../../core/ui/UIButton';
import StringHelper from "../../../../../core/utils/StringHelper";
import LangManager from '../../../../../core/lang/LangManager';
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { S2CProtocol } from '../../../../constant/protocol/S2CProtocol';
import { ServerDataManager } from "../../../../../core/net/ServerDataManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { PackageIn } from "../../../../../core/net/PackageIn";

import SimplePlayerSearchRspMsg = com.road.yishi.proto.simple.SimplePlayerSearchRspMsg;
export class ConsortiaTransferWnd extends BaseWindow {
    private _contorller: ConsortiaControler;
    private tfSearch: fgui.GTextInput;
    private btnConfirm: UIButton;
    private _tempStr: string;
    public frame: fgui.GLabel;
    public txtDesc:fgui.GTextField;
    public OnInitWind() {
        super.OnInitWind();
        this.frame.getChild("title").text = LangManager.Instance.GetTranslation("ConsortiaTransferWnd.title");
        this.txtDesc.text = LangManager.Instance.GetTranslation("ConsortiaTransferWnd.txtDesc");
        this.tfSearch.tooltips =  LangManager.Instance.GetTranslation("ConsortiaContributeWnd.tfDiamond.text");
        this.btnConfirm.title = LangManager.Instance.GetTranslation("ConsortiaTransferWnd.btnConfirm");
        this.initData();
        this.initEvent();
        this.initView();
        this.setCenter();
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_PLAYER_SEARCH, this, this.__getUserInfoHandler);
    }

    private initData() {
        this._contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
    }

    private initView() {
        this.tfSearch.on(Laya.Event.INPUT, this, this.__onTxtChange)
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    private __onTxtChange() {
        if (StringHelper.isNullOrEmpty(this.tfSearch.text)) {
            this.btnConfirm.enabled = false;
        }
        else {
            this.btnConfirm.enabled = true;
        }
    }

    private __getUserInfoHandler(pkg:PackageIn){
        let msg = pkg.readBody(SimplePlayerSearchRspMsg) as SimplePlayerSearchRspMsg;
        let str:string = "";
        if(msg.info && msg.info.nickName.toLowerCase() == this.tfSearch.text.toLowerCase())
        {
            if(msg.info.userId == PlayerManager.Instance.currentPlayerModel.playerInfo.userId)
            {
                str = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanPath.ConsortiaTransferFrame.command04");
                MessageTipManager.Instance.show(str);
                return;
            }
            if(msg.info.grades < ConsortiaModel.CREAT_NEEDED_GRADES)
            {
                str = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanPath.ConsortiaTransferFrame.command05");
                MessageTipManager.Instance.show(str);
                return;
            }
            this._contorller.consortiaTransfer(msg.info.userId);
            this.hide();
        }
        else
        {
            str = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanPath.ConsortiaTransferFrame.command06");
            MessageTipManager.Instance.show(str);
        }
    }

    private btnConfirmClick() {
        this.tfSearch.text = StringHelper.trim(this.tfSearch.text);
        if (StringHelper.isNullOrEmpty(this.tfSearch.text)) {
            var str: string = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanPath.ConsortiaTransferFrame.command03");
            MessageTipManager.Instance.show(str);
            return;
        }
        this._contorller.SearchPlayer(this.tfSearch.text);
    }

    private removeEvent() {
        ServerDataManager.cancel(S2CProtocol.U_C_PLAYER_SEARCH, this, this.__getUserInfoHandler);
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}