// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:31:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-14 10:05:12
 * @Description: 英灵重新命名 【v2.46 PetRenameView】
 */

import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import ByteArray from "../../../../core/net/ByteArray";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import HttpUtils from "../../../../core/utils/HttpUtils";
import StringHelper from "../../../../core/utils/StringHelper";
import XmlMgr from "../../../../core/xlsx/XmlMgr";
import { FilterWordManager } from "../../../manager/FilterWordManager";
import { PathManager } from "../../../manager/PathManager";
import ChatHelper from "../../../utils/ChatHelper";
import StringUtils from "../../../utils/StringUtils";
import { PetData } from '../data/PetData';
import PetCtrl from '../control/PetCtrl';
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { PackageIn } from '../../../../core/net/PackageIn';
import { MessageTipManager } from "../../../manager/MessageTipManager";

import PlayerPetOpRes = com.road.yishi.proto.pet.PlayerPetOpRes
import { StringUtil } from "../../../utils/StringUtil";
import { YTextInput } from "../../common/YTextInput";


export class PetRenameWnd extends BaseWindow {

    private txtTip: fgui.GLabel;
    private tfRename: YTextInput;
    private txtTipLimit: fgui.GLabel;
    private retTips: fgui.GTextField;
    private c1: fgui.Controller;
    private btnConfirm: UIButton;

    private MAX_LIMIT_WORDS: number = 12;
    private MIN_LIMIT_WORDS: number = 4;

    private _nickName: string = "";
    private petData: PetData;

    public OnInitWind() {
        super.OnInitWind();
        this.c1 = this.getUIController("c1");
        if (this.params) {
            this.petData = this.params.frameData;
            this._nickName = this.petData.name;
        }
        this.initView();
        this.setCenter();
    }

    private initView() {
        this.btnConfirm.enabled = false;
        this.tfRename.on(Laya.Event.INPUT, this, this.__onTxtChange);
        this.tfRename.on(Laya.Event.BLUR, this, this.__onTxtBlur);
        // 添加监听
        ServerDataManager.listen(S2CProtocol.U_C_PET_OP_RESULT, this, this.__petOptRet);
    }

    __petOptRet(pkg: PackageIn) {
        let msg = pkg.readBody(PlayerPetOpRes) as PlayerPetOpRes;
        let opt = msg.opType;
        if (opt == 14) {//修改昵称
            var msgTips: string = "";
            if (msg.result == 1) {
                msgTips = LangManager.Instance.GetTranslation("pet.renameFrame.describt08");
                MessageTipManager.Instance.show(msgTips);
            } else {
                msgTips = LangManager.Instance.GetTranslation("noviceII.node.AddUserNameFrame.describt06");
                MessageTipManager.Instance.show(msgTips);
                return;
            }
            this.hide();
        }
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    /**
     * 
     * @param state 展示文字状态  0 红色, 1绿色
     * @param text 文本内容
     */
    setStateText(state: number = 0, text: string) {
        this.retTips.text = text;
        this.c1.selectedIndex = state;
        if (state == 0) {
            this.btnConfirm.enabled = true;
        }
    }

    private __onTxtBlur() {
        this.tfRename.text = ChatHelper.parasMsgs(this.tfRename.text);
    }

    private __onTxtChange() {
        let vStr: string = this.tfRename.text;
        vStr = StringUtil.trim(vStr);
        vStr = StringUtil.replaceSpicalWord(vStr);
        if (StringHelper.isNullOrEmpty(vStr)) {
            this.btnConfirm.enabled = false;
        } else {
            let length: number = this.getNameLength(vStr);
            if (length > this.MAX_LIMIT_WORDS || length < this.MIN_LIMIT_WORDS) {
                this.btnConfirm.enabled = false;
            } else {
                this.btnConfirm.enabled = true;
            }
        }
        this.tfRename.text = vStr;
    }

    public getNameLength(str: string): number {
        var len: number = 0;
        for (var i: number = 0; i < str.length; i++) {
            if (str.charCodeAt(i) >= 0x4e00 && str.charCodeAt(i) <= 0x9fa5) {
                len += 2;
            } else {
                len += 1;
            }
        }
        return len;
    }

    private btnConfirmClick() {
        if (StringHelper.trim(this.tfRename.text) == "") {
            this.setStateText(0, LangManager.Instance.GetTranslation("pet.renameFrame.describt02"));
            return;
        }
        if (this._nickName == this.tfRename.text) {
            this.setStateText(0, LangManager.Instance.GetTranslation("pet.renameFrame.describt09"));
            return false;
        }
        if (StringUtils.checkEspicalWorld(this.tfRename.text)) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("special.words"));
            return;
        }
        if (FilterWordManager.containUnableChar(this.tfRename.text) || FilterWordManager.filterWrod(this.tfRename.text) != this.tfRename.text) {
            this.setStateText(0, LangManager.Instance.GetTranslation("pet.renameFrame.describt05"));
            return;
        }
        this.btnConfirm.enabled = false;
        this.serverCheck(this.tfRename.text);
    }

    private serverCheck(_nickName) {
        let self = this;
        var args = new Object();
        args["nickname"] = _nickName;
        args["rnd"] = Math.random();
        args["type"] = 1;

        let params: string = `nickname=${args["nickname"]}&rnd=${args["rnd"]}&type=${args["type"]}`;
        return HttpUtils.httpRequest(PathManager.info.REQUEST_PATH, "nicknamecheck", params, 'POST', "arraybuffer").then((data) => {
            let ContentTxt: string;
            if (data) {
                try {
                    let content: ByteArray = new ByteArray();
                    content.writeArrayBuffer(data);
                    if (content && content.length) {
                        content.position = 0;
                        ContentTxt = content.readUTFBytes(content.bytesAvailable);
                        content.clear();
                    }
                } catch (error) {
                    Logger.error(LangManager.Instance.GetTranslation(error.message));
                    self.setStateText(0, LangManager.Instance.GetTranslation(error.message));
                    return;
                }
                if (ContentTxt) {
                    try {
                        let retData: any = XmlMgr.Instance.decode(ContentTxt);
                        Logger.log('retData:', retData);
                        let Result = retData.Result;
                        if (Result && Result.value == "true") {
                            self.setStateText(1, LangManager.Instance.GetTranslation(Result.message));
                            PetCtrl.reNamePet(self.petData.petId, _nickName);
                        } else {
                            self.setStateText(0, LangManager.Instance.GetTranslation(Result.message));
                        }
                    } catch (e) {
                        Logger.error(e.message);
                        self.setStateText(0, LangManager.Instance.GetTranslation(e.message));
                    }
                } else {
                    Logger.error("retData is null");
                }
            }
        });
    }



    dispose(dispose?: boolean) {
        ServerDataManager.cancel(S2CProtocol.U_C_PET_OP_RESULT, this, this.__petOptRet);
        super.dispose(dispose);
    }
}