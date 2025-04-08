// @ts-nocheck
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { RoleModel } from "../model/RoleModel";
import { GoodsManager } from "../../../manager/GoodsManager";
import { CommonConstant } from "../../../constant/CommonConstant";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import LangManager from "../../../../core/lang/LangManager";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { PackageIn } from "../../../../core/net/PackageIn";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import UIButton from "../../../../core/ui/UIButton";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import StringHelper from "../../../../core/utils/StringHelper";
import { FilterWordManager } from "../../../manager/FilterWordManager";
import { PathManager } from "../../../manager/PathManager";
import HttpUtils from "../../../../core/utils/HttpUtils";
import Logger from "../../../../core/logger/Logger";
import ByteArray from "../../../../core/net/ByteArray";
import XmlMgr from "../../../../core/xlsx/XmlMgr";
import StringUtils from "../../../utils/StringUtils";
import { YTextInput } from "../../common/YTextInput";
import { StringUtil } from "../../../utils/StringUtil";
import PlayerRenameRspMsg = com.road.yishi.proto.player.PlayerRenameRspMsg;

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/4/6 20:27
 * @ver 1.0
 *
 */

export class RenameWnd extends BaseWindow {
    public c1: fgui.Controller;
    public titleTxt: fgui.GTextField;
    public btn_cancel: UIButton;
    public btn_confirm: UIButton;
    public txt_name: YTextInput;
    public txt_prompt: fgui.GTextField;

    private _type: number;
    private _data: GoodsInfo;
    private _txtChange: string = "";
    private _nickName: string;

    public MAX_LENGTH: number = 12;
    public MIN_LENGTH: number = 4;
    public namTxt: fgui.GTextField;
    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.c1 = this.contentPane.getController("c1");
        this._type = this.params;
        this.addEventListener();
    }

    private addEventListener() {
        this.btn_cancel.onClick(this, this.onBtnClick.bind(this, 0));
        this.btn_confirm.onClick(this, this.onBtnClick.bind(this, 1));
        this.txt_name.on(Laya.Event.INPUT, this, this.__onTxtChange);
        this.txt_name.on(Laya.Event.BLUR, this, this.onTxtNameBlur);
        ServerDataManager.listen(S2CProtocol.U_C_PLAYER_RENAME_RSP, this, this.__playerRenameRspHandler);
    }

    public OnShowWind() {
        super.OnShowWind();

        this.initView();
    }

    private initView() {
        this.txt_prompt.text = LangManager.Instance.GetTranslation("RenameWnd.promptTxt");// LangManager.Instance.GetTranslation("noviceII.node.AddUserNameFrame.describt01");
        this.txt_prompt.color = "#408e15";
        this.namTxt.text = LangManager.Instance.GetTranslation("RenameWnd.nameTxt");
        if (this._type == RoleModel.TYPE_RENAME_CARD) {
            this.c1.selectedIndex = 0;
            let goodsArr: GoodsInfo[] = GoodsManager.Instance.getBagGoodsByTemplateId(CommonConstant.RENAME_CARD_TEMPID);
            goodsArr = ArrayUtils.sortOn(goodsArr, "isBinds", ArrayConstant.DESCENDING);
            this._data = goodsArr[0];
        }
        else if (this._type == RoleModel.TYPE_COMPOSE) {
            this.c1.selectedIndex = 1;
        }
    }

    private onBtnClick(type: number) {

        if (type == 0) {//取消
            this.OnBtnClose()
            return;
        }

        if (StringUtils.checkEspicalWorld(this.txt_name.text)) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("special.words"));
            return;
        }

        if (type == 1) {
            this.loadCheckNickname();
        }
    }

    private loadCheckNickname() {
        let str: string = "";
        this._nickName = this.txt_name.text;
        this._nickName = StringHelper.trim(this._nickName.replace("\r", ""));
        let length: number = StringHelper.getStringLength(this._nickName);
        if (this._nickName == "") {
            str = LangManager.Instance.GetTranslation("noviceII.node.AddUserNameFrame.describt02");
            MessageTipManager.Instance.show(str);
            return;
        }
        if (length < this.MIN_LENGTH) {
            str = LangManager.Instance.GetTranslation("noviceII.node.AddUserNameFrame.describt03");
            MessageTipManager.Instance.show(str);
            return;
        }
        if (length > this.MAX_LENGTH) {
            str = LangManager.Instance.GetTranslation("noviceII.node.AddUserNameFrame.describt04");
            MessageTipManager.Instance.show(str);
            return;
        }
        this.btn_confirm.enabled = false;

        if (FilterWordManager.containUnableChar(this._nickName) || (FilterWordManager.filterWrod(this._nickName) != this._nickName)) {
            this.txt_prompt.text = LangManager.Instance.GetTranslation("noviceII.node.AddUserNameFrame.describt05");
            this.txt_prompt.color = "#ff0000";
            this.btn_confirm.enabled = true;
            return;
        }

        let args: any = {};
        args["nickname"] = this._nickName;
        args["rnd"] = Math.random();
        let path: string = PathManager.info.REQUEST_PATH + "nicknamecheck";
        //note 请求web服务器的nicknamecheck接口, http get请求, XML格式的, 然后转成Json结构

        let params: string = `nickname=${args["nickname"]}&rnd=${args["rnd"]}`;
        return HttpUtils.httpRequest(PathManager.info.REQUEST_PATH, "nicknamecheck", params, 'POST', "arraybuffer").then((data) => {
            Logger.yyz("获取到的nicknamecheck数据: ", data);
            if (data) {
                let checkContent: string = "";
                let content: ByteArray = new ByteArray();
                content.writeArrayBuffer(data);
                if (content && content.length) {
                    content.position = 0;
                    // content.uncompress();//原数据没有压缩, 此处不用解压
                    checkContent = content.readUTFBytes(content.bytesAvailable);
                    content.clear();
                }

                if (checkContent) {
                    let json: any = XmlMgr.Instance.decode(checkContent);
                    Logger.yyz("获取到的nicknamecheck数据: ", json);
                    if (json.Result.value == "true") {
                        switch (this._type) {
                            case RoleModel.TYPE_COMPOSE:
                                SocketSendManager.Instance.sendRename(this._nickName, RoleModel.TYPE_COMPOSE);
                                break;
                            case RoleModel.TYPE_RENAME_CARD:
                                if (this._data) {
                                    SocketSendManager.Instance.sendRename(this._nickName, RoleModel.TYPE_RENAME_CARD, this._data.pos);
                                } else {
                                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("RenameWnd.lackCard"));
                                }
                                break;
                        }
                    } else {
                        this.btn_confirm.enabled = true;
                        this.txt_prompt.text = LangManager.Instance.GetTranslation(json.Result.message);
                        this.txt_prompt.color = "#FF0000";
                    }
                } else {
                    Logger.error("nicknamecheck is null");
                }
            }
        });
    }

    private onTxtNameBlur() {
        // this.txt_name.text = ChatHelper.parasMsgs(this.txt_name.text);
    }

    private __onTxtChange(event: Laya.Event) {
        let nickName = this.txt_name.text;
        //去除左右空格
        let vStr: string = StringUtil.trim(nickName);
        vStr = StringUtil.replaceSpicalWord(vStr);
        if (StringHelper.getStringLength(this.txt_name.text) > 12) {
            this.txt_name.text = this._txtChange;
            return;
        }
        this._txtChange = vStr;
        this.txt_name.text = vStr;
        this.txt_prompt.text = LangManager.Instance.GetTranslation("RenameWnd.promptTxt");// LangManager.Instance.GetTranslation("noviceII.node.AddUserNameFrame.describt01");
        this.txt_prompt.color = "#408e15";
    }


    private __playerRenameRspHandler(pkg: PackageIn) {
        let msg: PlayerRenameRspMsg = pkg.readBody(PlayerRenameRspMsg) as PlayerRenameRspMsg;
        if (msg.result) {
            this.OnBtnClose();
        } else {
            this.btn_confirm.enabled = true;
        }
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEventListener();
    }

    private removeEventListener() {
        this.btn_cancel.offClick(this, this.onBtnClick.bind(this, 0));
        this.btn_confirm.offClick(this, this.onBtnClick.bind(this, 1));
        this.txt_name.off(Laya.Event.INPUT, this, this.__onTxtChange);
        this.txt_name.off(Laya.Event.BLUR, this, this.onTxtNameBlur);
        ServerDataManager.cancel(S2CProtocol.U_C_PLAYER_RENAME_RSP, this, this.__playerRenameRspHandler);
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}