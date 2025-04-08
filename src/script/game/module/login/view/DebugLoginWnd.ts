import AudioManager from "../../../../core/audio/AudioManager";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { SoundIds } from "../../../constant/SoundIds";
import { EmWindow } from "../../../constant/UIDefine";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { SharedManager } from "../../../manager/SharedManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import StringUtils from "../../../utils/StringUtils";
import { isOversea } from "../manager/SiteZoneCtrl";


/**
* @author:pzlricky
* @data: 2021-08-09 21:13
* @description Debug登录窗口
*/
export default class DebugLoginWnd extends BaseWindow {

    private ITextPlatfrom: fgui.GTextInput;  //平台输入
    private ITextAccount: fgui.GTextInput;  //账号输入
    private ITextPassword: fgui.GTextInput; //密码输入
    private btnEnterGame: UIButton;
    private checkSaveAccount: UIButton; //保存账号
    private checkSavePwd: UIButton;     //保存密码
    private bSaveAccount: boolean = true;
    private bSavePwd: boolean = true;

    protected resizeContent: boolean = true;

    public isOversea: fgui.Controller;

    public OnInitWind() {
        super.OnInitWind();

        this.isOversea = this.getController("isOversea");
        this.isOversea.selectedIndex = isOversea() ? 1 : 0;

        let userName = '';
        let userPassword = '';
        userName = SharedManager.Instance.getProperty('userName');
        userPassword = SharedManager.Instance.getProperty('userPassword');
        this.initLocal();

        if (!userName || !this.bSaveAccount) {
            userName = '';
        }

        if (!userPassword || !this.bSavePwd) {
            userPassword = '';
        }
        if (this.params && this.params.config) {
            this.ITextPlatfrom.text = this.params.config.PLATFORM;
        } else {
            this.ITextPlatfrom.text = "1";
        }

        this.ITextAccount.text = userName;
        this.ITextPassword.text = userPassword;
        this.ITextAccount.on(Laya.Event.ENTER, this, this.loginGame);
        this.checkSaveAccount.onClick(this, this.checkAccountFunc);
        this.checkSavePwd.onClick(this, this.checkPwdFunc);
        this.btnEnterGame.onClick(this, this.loginGame);
    }

    OnShowWind() {
        //切换角色要回到选服界面
        if (Laya.LocalStorage.getItem('switchRole') == '1') {
            Laya.LocalStorage.setItem('switchRole', '0')
            this.loginGame();
        }
        super.OnShowWind();
    }

    OnHideWind() {
        super.OnHideWind();
        this.ITextAccount.off(Laya.Event.ENTER, this, this.loginGame);
        this.checkSaveAccount.offClick(this, this.checkAccountFunc);
        this.checkSavePwd.offClick(this, this.checkPwdFunc);
        this.btnEnterGame.offClick(this, this.loginGame);
    }

    checkAccountFunc() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        this.bSaveAccount = this.checkSaveAccount.selected;
        Logger.log('bSaveAccount', this.bSaveAccount);
    }

    checkPwdFunc() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        this.bSavePwd = this.checkSavePwd.selected;
        Logger.log('bSavePwd', this.bSavePwd)
    }

    loginGame() {
        let platform: number = Number(this.ITextPlatfrom.text)
        let userName: string = this.ITextAccount.text;
        let password: string = this.ITextPassword.text;

        if (!StringUtils.hasText(platform.toString())) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("login.platformNotEmpty"));
            this.btnEnterGame.enabled = true;
            return;
        }

        if (!StringUtils.isNumeric(platform.toString())) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("login.platformMustDigital"));
            this.btnEnterGame.enabled = true;
            return;
        }

        if (!StringUtils.hasText(userName)) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("login.usernameNotEmpty"));
            this.btnEnterGame.enabled = true;
            return;
        }

        // if (StringUtils.checkEspicalWorld(userName)) {
        //     this.btnEnterGame.enabled = true;
        //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("login.notSspecialCharacter"));
        //     return;
        // }
        //打开选服登录游戏界面
        let value = {
            user: userName,
            platform: platform
        };
        let nowDate = new Date().getTime();
        SharedManager.Instance.setProperty('userName', this.bSaveAccount ? userName : '', 'userNameDate', nowDate);
        SharedManager.Instance.setProperty('userPassword', this.bSavePwd ? password : '', 'userPasswordDate', nowDate);
        SharedManager.Instance.setProperty('bSaveAccount', this.bSaveAccount, 'bSaveAccountDate', nowDate);
        SharedManager.Instance.setProperty('bSavePwd', this.bSavePwd, 'bSavePwdDate', nowDate);
        let data: any = new Object();
        data.user = value;
        data.isDebug = true;
        data.isMobile = false;
        data.isWan = false;
        FrameCtrlManager.Instance.open(EmWindow.Login,data);
    }

    initLocal() {
        // 本地存储读取
        let saveAccount = SharedManager.Instance.getProperty('bSaveAccount');
        this.bSaveAccount = saveAccount;
        this.checkSaveAccount.selected = this.bSaveAccount;
        let bSavePwd = SharedManager.Instance.getProperty('bSavePwd');
        this.bSavePwd = bSavePwd;
        this.checkSavePwd.selected = this.bSavePwd;
    }



}