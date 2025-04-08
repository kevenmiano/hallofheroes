import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import { LoginSocketManager } from "../../../../core/net/LoginSocketManager";
import SDKManager from "../../../../core/sdk/SDKManager";
import { RPT_EVENT } from "../../../../core/thirdlib/RptEvent";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import StringHelper from "../../../../core/utils/StringHelper";
import Utils from "../../../../core/utils/Utils";
import { EmModel } from "../../../constant/model/modelDefine";
import { UserModelAttribute } from "../../../constant/model/UserModelParams";
import { EmWindow } from "../../../constant/UIDefine";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import ModelMgr from "../../../manager/ModelMgr";
import { NamesLibManager } from "../../../manager/NamesLibManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import ChatHelper from "../../../utils/ChatHelper";
import ComponentSetting from "../../../utils/ComponentSetting";
import { StringUtil } from "../../../utils/StringUtil";
import StringUtils from "../../../utils/StringUtils";
import { LoginManager } from "../LoginManager";
import { YTextInput } from "../../common/YTextInput";
import { GameEventCode, TrackEventNode } from "../../../constant/GameEventCode";
import { getdefaultLangageCfg } from "../../../../core/lang/LanguageDefine";
import { PathManager } from "../../../manager/PathManager";
import HttpUtils from "../../../../core/utils/HttpUtils";
import ByteArray from "../../../../core/net/ByteArray";
import XmlMgr from "../../../../core/xlsx/XmlMgr";
import { NotificationManager } from "../../../manager/NotificationManager";
import { NativeEvent } from "../../../constant/event/NotificationEvent";


/**
 * 新版注册UI
 */
export default class RegisterSWnd extends BaseWindow {

    public selectRole: fgui.Controller;
    public c1: fgui.Controller;
    public subController: fgui.Controller;
    public TextBox: fgui.GComponent;
    public Btn_Dice: UIButton;
    public Btn_Enter: UIButton;
    public inputGroup: fgui.GGroup;
    public Btn_Back: UIButton;
    public Btn_EnterGame: UIButton;
    public userName: YTextInput;
    private selfRename: boolean = false;

    private roleItems: Array<fgui.GComponent> = [];
    public roleItem_0: fgui.GComponent;
    public roleItem_1: fgui.GComponent;
    public roleItem_2: fgui.GComponent;

    /**
     * 1:男战
     * 2:男弓
     * 3:男法
     * 4:女战
     * 5:女弓
     * 6:女法
     */
    private mainIndex = 0;//职业
    private subSexIndex = 0;//性别

    constructor() {
        super();
        this.resizeContent = true;
    }

    public OnInitWind() {
        this.initView();
        this.addEvent();
        SDKManager.Instance.getChannel().trackEvent(0, TrackEventNode.Node_30003, "openRegisterWnd", "看到创角界面", "创角界面", "准备创建角色了");
    }

    private initView() {
        this.c1 = this.getController("c1");
        this.selectRole = this.getController("selectRole");
        this.roleItems = [
            this.roleItem_0,
            this.roleItem_1,
            this.roleItem_2,
        ];
        this.initProfessionDesc();
        this.randomIndex();

        this.userName.fontSize = 24;
        this.userName.singleLine = true;
        this.userName.stroke = 1;
        this.userName.strokeColor = "#000000";
        this.userName.promptText = LangManager.Instance.GetTranslation("login.pleaseEnterNickname");

        let active = true;
        this.Btn_Dice.visible = active;
        this.userName.text = active ? this.getRandomName() : "";
        this.selfRename = false;
        this.Btn_EnterGame.btnInternal = 1000;
        this.Btn_EnterGame.enabled = true;
    }

    private initProfessionDesc(): void {
        let obj: fgui.GObject = this.roleItem_0.getChild("professionDescTxt");
        if (obj) {
            obj.text = LangManager.Instance.GetTranslation("RegisterSWnd.professionDesc0");;
        }

        obj = this.roleItem_1.getChild("professionDescTxt");
        if (obj) {
            obj.text = LangManager.Instance.GetTranslation("RegisterSWnd.professionDesc1");;
        }

        obj = this.roleItem_2.getChild("professionDescTxt");
        if (obj) {
            obj.text = LangManager.Instance.GetTranslation("RegisterSWnd.professionDesc2");;
        }
    }

    private randomIndex() {
        let mainIndex = Utils.randomInt(0, 2);
        mainIndex = 0;//默认战士
        let subIndex = Utils.randomInt(0, 1);
        this.c1.selectedIndex = mainIndex;
        let element = this.roleItems[mainIndex];
        if (element) {
            let subController = element.getController('c3');
            let selectController = element.getController('c2');
            selectController.selectedIndex = 1;
            subController.selectedIndex = subIndex;
        }
        this.selectRole.selectedIndex = mainIndex * 2 + subIndex;
    }

    private addEvent() {
        this.c1 && this.c1.on(fgui.Events.STATE_CHANGED, this, this.onProfessionChange);
        this.Btn_Back && this.Btn_Back.onClick(this, this.onBackToLogin);
        this.Btn_Dice && this.Btn_Dice.onClick(this, this.onBtnDice);
        this.Btn_EnterGame && this.Btn_EnterGame.onClick(this, this.onEnterGame);
        //修改了引擎, 对Input事件进行了过滤
        //web pc端, 超过字数后, 就不能好好打中文字了； App端为弹出键盘, 键盘消失就会失去焦点, 失去焦点之前不会有任何限制；
        this.userName.on(Laya.Event.INPUT, this, this.__onTxtChange);
        for (let index = 0; index < 3; index++) {
            let element = this.roleItems[index];
            if (element) {
                let subController = element.getController('c3');
                subController && subController.on(fgui.Events.STATE_CHANGED, this, this.onSexChange);
            }
        }
        NotificationManager.Instance.addEventListener(NativeEvent.AFTER_STATUS_BAR_CHANGE, this.onAfterStatusBarChange, this);
    }

    private offEvent() {
        this.c1 && this.c1.off(fgui.Events.STATE_CHANGED, this, this.onProfessionChange);
        this.Btn_Back && this.Btn_Back.offClick(this, this.onBackToLogin);
        this.Btn_Dice && this.Btn_Dice.offClick(this, this.onBtnDice);
        this.Btn_EnterGame && this.Btn_EnterGame.offClick(this, this.onEnterGame);
        this.userName.off(Laya.Event.INPUT, this, this.__onTxtChange);
        for (let index = 0; index < 3; index++) {
            let element = this.roleItems[index];
            if (element) {
                let subController = element.getController('c3');
                subController && subController.off(fgui.Events.STATE_CHANGED, this, this.onSexChange);
            }
        }
        NotificationManager.Instance.removeEventListener(NativeEvent.AFTER_STATUS_BAR_CHANGE, this.onAfterStatusBarChange, this);
    }

    private _txtChange: string = "";
    //修改了引擎, 对Input事件进行了过滤
    //在中文输入法状态下, 前面输入的很可能都是临时字符
    private __onTxtChange(evt: Event) {
        let userNameInput = this.userName;
        let nickName: string = userNameInput.text;
        //去除左右空格
        let vStr: string = StringUtil.trim(nickName);
        vStr = StringUtil.replaceSpicalWord(vStr);
        while (StringHelper.getStringLength(vStr) > 12) {
            vStr = vStr.substring(0, vStr.length - 1)
        }

        this._txtChange = vStr;
        userNameInput.text = this._txtChange;
    }

    private isCooling: boolean = false;//避免疯狂频繁点击导致的bug
    private onEnterGame() {
        Logger.xjy("[RegisterSWnd]onEnterGame");
        SDKManager.Instance.getChannel().trackEvent(0, TrackEventNode.Node_30004, "registerEnterGame", "点击创角界面的进入游戏按钮（包括不成功）", "创角界面", "准备创建角色了");
        let userId: number = ModelMgr.Instance.getProperty(EmModel.USER_MODEL, UserModelAttribute.userId);
        let userName = ModelMgr.Instance.getProperty(EmModel.USER_MODEL, UserModelAttribute.userName);
        let nickName: string = this.userName.text;
        nickName = StringUtil.trim(nickName);//去掉左右空格
        nickName = ChatHelper.parasMsgs(nickName);
        if (nickName == "") {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("login.pleaseEnterNickname"));
            return;
        }
        if (StringUtils.checkEspicalWorld(nickName)) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("login.nicknameContainsIllegalCharacters"));
            return;
        }
        if (StringHelper.getStringLength(nickName) > 12) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("login.nicknameTooLong"));
            return;
        }
        SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.CREATE_ROLE, userName);
        FrameCtrlManager.Instance.open(EmWindow.Waiting);
        let args: any = {};
        args["nickname"] = nickName;
        args["rnd"] = Math.random();
        this.Btn_EnterGame.enabled = false;
        SDKManager.Instance.getChannel().postGameEvent(GameEventCode.Code_1040);
        //note 请求web服务器的nicknamecheck接口, http get请求, XML格式的, 然后转成Json结构
        let params: string = `nickname=${args["nickname"]}&rnd=${args["rnd"]}`;
        return HttpUtils.httpRequest(PathManager.info.REQUEST_PATH, "nicknamecheck", params, 'POST', "arraybuffer", () => {
            let msg = LangManager.Instance.GetTranslation("network.tip");
            MessageTipManager.Instance.show(msg);
            FrameCtrlManager.Instance.exit(EmWindow.Waiting);
            this.Btn_EnterGame.enabled = true;
        }).then((data) => {
            Logger.yyz("获取到的nicknamecheck数据: ", data);
            if (data) {
                let checkContent: string = "";
                let content: ByteArray = new ByteArray();
                content.writeArrayBuffer(data);
                if (content && content.length) {
                    content.position = 0;
                    checkContent = content.readUTFBytes(content.bytesAvailable);
                    content.clear();
                }

                if (checkContent) {
                    let json: any = XmlMgr.Instance.decode(checkContent);
                    Logger.yyz("获取到的nicknamecheck数据: ", json);
                    if (json.Result.value == "true") {
                        Logger.yyz("返回创角成功: ", json.Result.value);
                        this.Btn_EnterGame.enabled = false;
                        let sex: number = this.getSex();
                        let camp: number = 1;
                        let icon: number = this.getIcon();
                        let site: string = ModelMgr.Instance.getProperty(EmModel.USER_MODEL, UserModelAttribute.site);
                        let password: string = ModelMgr.Instance.getProperty(EmModel.USER_MODEL, UserModelAttribute.password);
                        LoginManager.Instance.c2s_register_role(userId, userName, nickName, sex, camp, icon, site, password);
                    } else {
                        this.Btn_EnterGame.enabled = true;
                        let msg = LangManager.Instance.GetTranslation(json.Result.message);
                        MessageTipManager.Instance.show(msg);
                        FrameCtrlManager.Instance.exit(EmWindow.Waiting);
                    }
                } else {
                    this.Btn_EnterGame.enabled = true;
                    FrameCtrlManager.Instance.exit(EmWindow.Waiting);
                    Logger.error("nicknamecheck is null");
                }
            }
        });
    }

    private getRandomName(): string {
        let langCfg = getdefaultLangageCfg();
        let randomNameTxt = NamesLibManager.newName(this.getSex());
        return randomNameTxt;
    }

    private onBtnDice() {
        this.userName.text = this.getRandomName();
    }

    /**获取性别  0女1男 */
    private getSex(): number {
        let selectIndex = this.selectRole.selectedIndex + 1;
        Logger.warn('sex:', selectIndex)
        return selectIndex % 2;
    }

    /**
     * 1-男战
     * 2-男射手
     * 3-男法师
     * 4-女战
     * 5-女射手
     * 6-女法师
    */
    private getIcon(): number {
        let selectIndex = this.selectRole.selectedIndex;
        let value = 1;
        switch (selectIndex) {
            case 0:
                value = 1;
                break;
            case 1:
                value = 4;
                break;
            case 2:
                value = 3;
                break;
            case 3:
                value = 6;
                break;
            case 4:
                value = 2;
                break;
            case 5:
                value = 5;
                break;

        }
        return value;
    }

    onBackToLogin() {
        SDKManager.Instance.getChannel().trackEvent(0, TrackEventNode.CLICK_REGISTER_BACK, "register_backto_login", "注册点击返回登陆界面", "", "");
        FrameCtrlManager.Instance.exit(EmWindow.RegisterS);
        Laya.LocalStorage.setItem('switchRole', '1');
        ComponentSetting.VERTION_PATH = '';
        ComponentSetting.IS_BACK_FROM_REGISTER = true;
        //关闭登录socket
        LoginSocketManager.Instance.close();
        FrameCtrlManager.Instance.open(EmWindow.Login, LoginManager.Instance.loginAccountParams);
    }

    /**切换职业 */
    private onProfessionChange(mainController: fgui.Controller) {
        let mainIndex = mainController.selectedIndex;
        Logger.error('mainIndex:', mainIndex);
        let subItem: fgui.GComponent = this['roleItem_' + mainIndex];
        if (!subItem) return;
        let subController = subItem.getController('c3');
        if (subController) {
            //默认选中男性角色
            subController.selectedIndex = 0;
            this.selectRole.selectedIndex = mainIndex * 2 + subController.selectedIndex;
        }
        // this.onBtnDice();
    }

    /**切换性别 */
    onSexChange(subController: fgui.Controller) {
        let mainIndex = 0;
        if (this.c1) {
            mainIndex = this.c1.selectedIndex;
        }
        let subIndex = subController.selectedIndex;
        this.selectRole.selectedIndex = mainIndex * 2 + subIndex;
        Logger.info('selectValue:', this.selectRole.selectedIndex);
        // this.onBtnDice();
    }


    public OnHideWind() {
        this.offEvent();
        LoginManager.Instance.clearRegisterTime();
    }

}