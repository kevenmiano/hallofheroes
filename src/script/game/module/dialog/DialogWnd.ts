//@ts-expect-error: External dependencies
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import { getdefaultLangageCfg } from "../../../core/lang/LanguageDefine";
import Logger from "../../../core/logger/Logger";
import ResMgr from "../../../core/res/ResMgr";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import Dictionary from "../../../core/utils/Dictionary";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import StringHelper from "../../../core/utils/StringHelper";
import Utils from "../../../core/utils/Utils";
import { ConfigType } from "../../constant/ConfigDefine";
import { EmPackName } from "../../constant/UIDefine";
import { CampaignManager } from "../../manager/CampaignManager";
import { PathManager } from "../../manager/PathManager";
import { PlayerManager } from "../../manager/PlayerManager";
import FUIHelper from "../../utils/FUIHelper";
import AutoNewbieMgr from "../guide/auto/AutoNewbieMgr";
import { DialogConstInfo } from "./data/DialogConstInfo";
import { DialogMessageInfo } from "./data/DialogMessageInfo";
import { DialogControl } from "./DialogControl";
import { DialogModel } from "./DialogModel";
import DialogWordHandler from "./DialogWordHandler";

/**
 * @author:pzlricky
 * @data: 2021-06-01 10:49
 * @description 剧情对话框
 */
export default class DialogWnd extends BaseWindow {
  private bottomBg: fgui.GImage;
  private leftImage: fgui.GLoader;
  private rightImage: fgui.GLoader;
  private autoClickTipText: fgui.GTextField;
  private typerRichtext: fgui.GRichTextField;
  private _urlDic: Dictionary = new Dictionary();

  private _isAuto: boolean = false;
  private _autoTimeId: any = 0;
  private _control: DialogControl;
  private _showBg: boolean;
  private curInfo: DialogMessageInfo;
  private rightRoles: Dictionary;
  private leftRoles: Dictionary;
  private nextCom: fgui.GComponent;
  private bottomBg2: fgui.GImage;
  protected resizeContent: boolean = true;
  public c1: fgui.Controller;

  public OnShowWind() {
    super.OnShowWind();
    AutoNewbieMgr.Instance.onDialogShow();
    let paramData = this.params;
    this._isAuto = paramData.isAuto;
    this._control = paramData.contro;
    this._showBg = paramData.showBg;
    this.rightRoles = paramData.rightRoles;
    this.leftRoles = paramData.leftRoles;
    this.c1 = this.getController("c1");
    this.init();
  }

  OnHideWind() {
    this.offEvent();
    super.OnHideWind();
    AutoNewbieMgr.Instance.onDialogHide();
  }

  private init() {
    this.bottomBg.visible = this._showBg;
    this.leftImage.alpha = this.rightImage.alpha = 1;
    this.setRoles(this.rightRoles, this.leftRoles);
    this.addEvent();
  }

  private addEvent() {
    this.contentPane && this.contentPane.onClick(this, this.__onClickHandler);
  }

  private setRoles(rightRoles: Dictionary, leftRoles: Dictionary) {
    this.loadRoleImages(rightRoles);
    this.loadRoleImages(leftRoles);
  }

  /**
   * 加载人物形象.
   * @param arr
   */
  public loadRoleImages(dic: Dictionary) {
    dic.forEach((info) => {
      if (info.roleId <= 0) {
        info.roleId = 1;
      } //这里只是设置默认值
      var url: string = PathManager.solveHeadPath(info.roleId);
      this._urlDic[info.roleId] = url;
    });
  }

  private swapHeadImg(curInfo: DialogMessageInfo) {
    if (!curInfo) {
      return;
    }
    var tempSp: fgui.GLoader;
    if (curInfo.direction == DialogConstInfo.LEFT) {
      tempSp = this.leftImage;
      this.c1.selectedIndex = 0;
      Laya.Tween.to(this.rightImage, { alpha: 0 }, 0.5);
    } else {
      tempSp = this.rightImage;
      this.c1.selectedIndex = 1;
      this.bottomBg2.x = this.width;
      Laya.Tween.to(this.leftImage, { alpha: 0 }, 0.5);
    }

    let url = this._urlDic[curInfo.roleId];
    ResMgr.Instance.loadRes(url, () => {
      // 原生iOS上getRes获取的单张图片, 需要改后缀 对话框人物头像
      if (Utils.useAstc) {
        if (url.includes(".png")) {
          url = url.replace(".png", ".ktx");
        } else if (url.includes(".jpg")) {
          url = url.replace(".jpg", ".ktx");
        }
      }
      let res = ResMgr.Instance.getRes(url);
      if (res && tempSp && !tempSp.isDisposed) {
        tempSp.url = url;
        Laya.Tween.to(
          tempSp,
          { alpha: 1, colorTransform: { tint: 0x000000, tintAmount: 0.01 } },
          0.5,
        );
        if (curInfo.roleId == 21) {
          //特殊图片特殊处理
          this.rightImage.x = 1020 + this.rightImage.width;
        }
      }
    });
  }

  public showMessage(info: DialogMessageInfo) {
    this.clearTimeID();

    this.curInfo = info;
    this._isPlay = true;
    Laya.Tween.clearTween(this.bottomBg);
    Laya.Tween.to(this.bottomBg, { alpha: 1 }, 0.5);

    this.swapHeadImg(info);
    this.setSentence(info.txtLang, info.roleNameLang);

    if (this._isAuto) {
      this._autoTimeId = setTimeout(
        this.defAutoClickToNextHandler.bind(this),
        this.delayTime * 1000,
      );
    }
  }

  private get delayTime() {
    if (!this.curInfo) return 0;
    return this.curInfo.delayTime ? this.curInfo.delayTime : 10;
  }

  /**
   * 设置对话的内容.
   * @param sentence 对话的句子.
   * @param endHandler 句子显示完成后的处理函数.
   * @param name 说话人的名称.
   */
  private _name: string;

  public setSentence(sentence: string, name: string = "") {
    this._sentence = sentence;
    this._name = name;
    this.addSentenceTxt();
  }

  /**
   * 添加对白内容文本
   */
  private _sentence: string = "";
  private _speakHandler: DialogWordHandler;
  private _guardImge: fgui.GImage;

  private addSentenceTxt() {
    var reg: RegExp = new RegExp("&%", "g");
    if (
      PlayerManager.Instance.currentPlayerModel.playerInfo.nickName ==
      PlayerManager.Instance.currentPlayerModel.userInfo.userId + "$"
    ) {
      this._sentence = this._sentence.replace(
        reg,
        LangManager.Instance.GetTranslation("public.nickName"),
      );
    } else {
      this._sentence = this._sentence.replace(
        reg,
        PlayerManager.Instance.currentPlayerModel.playerInfo.nickName,
      );
    }
    this._sentence = StringHelper.repHtmlTextToFguiText(this._sentence);
    this.typerRichtext.text = this._sentence;

    let list = ConfigMgr.Instance.getSync(ConfigType.t_s_novicedialogue);
    let storyXmlList = [];
    if (list) {
      storyXmlList = list.mDataList;
      let langKey = "zhcn";
      let cfg = getdefaultLangageCfg();
      if (cfg) {
        langKey = cfg.key;
      }
      if (this._sentence == storyXmlList[0].txts.item[1]["txt_" + langKey]) {
        if (this._guardImge) {
          ObjectUtils.disposeObject(this._guardImge);
          this._guardImge = null;
        }
        this._guardImge = FUIHelper.createFUIInstance(
          EmPackName.Dialog,
          "asset.novice.GuardImage",
        );
        if (CampaignManager.Instance.controller) {
          var myArmy = CampaignManager.Instance.controller.getArmyView(
            CampaignManager.Instance.mapModel.selfMemberData,
          );
          if (myArmy && this._guardImge && !this._guardImge.isDisposed) {
            myArmy.addChild(this._guardImge.displayObject);
            this._guardImge.x = -this._guardImge.width / 2 - 10;
            this._guardImge.y = -160;
          }
        }
      }
    }

    this._speakHandler = new DialogWordHandler(
      this.typerRichtext,
      "[color=#ffc68f][size=22]" +
        this._name +
        "[/size][/color]<br><br><br><br>" +
        "",
      this._sentence,
      this.speakEndHandler.bind(this),
    );
    this._speakHandler.start();
  }

  private _isPlay: boolean;

  /**
   * 说话内容显示完成后的处理函数.
   */
  private speakEndHandler() {
    this._isPlay = false;
    if (this.nextCom && !this.nextCom.isDisposed) {
      this.nextCom.visible = true;
    }
  }

  public completeSpeak(): boolean {
    if (this._speakHandler) {
      return this._speakHandler.canStop();
    }
    return true;
  }

  private __onClickHandler(evt: Event = null) {
    if (this.completeSpeak()) {
      return;
    }
    this.clearTimeID();
    if (this._control) {
      this._control.gotoAndNextMessage();
    }
  }

  private autoClickToNextHandler() {
    this.__onClickHandler();
  }

  private defAutoClickToNextHandler() {
    if (DialogModel.isQuickAuto) {
      Logger.info("正在快速自动对话, 不执行默认自动对话");
      return;
    }
    this.__onClickHandler();
  }

  public triggerAutoClick() {
    DialogModel.isQuickAuto = true;
    Laya.timer.clear(this, this.autoClickToNextHandler);
    Laya.timer.loop(
      DialogModel.QuickAutoTime,
      this,
      this.autoClickToNextHandler,
    );
    this.autoClickToNextHandler();
  }

  public setAutoClickTip(str: string) {
    this.autoClickTipText.text = str;
    // this.autoClickTipText.text = AutoNewbieMgr.Instance.getAutoDialogueTip(time);
  }

  public showAutoClickTip(b: boolean) {
    this.autoClickTipText.visible = b;
  }

  offEvent() {
    this.contentPane.offClick(this, this.__onClickHandler);
  }

  private clearTimeID() {
    if (this._autoTimeId > 0) {
      clearTimeout(this._autoTimeId);
    }
    this._autoTimeId = 0;
  }

  public dispose() {
    DialogModel.isQuickAuto = false;
    this.clearTimeID();
    Laya.timer.clearAll(this);
    Laya.Tween.clearAll(this.bottomBg);
    Laya.Tween.clearAll(this.leftImage);
    Laya.Tween.clearAll(this.rightImage);
    for (const key in this._urlDic) {
      if (Object.prototype.hasOwnProperty.call(this._urlDic, key)) {
        let imgUrl = this._urlDic[key];
        ResMgr.Instance.cancelLoadByUrl(imgUrl);
      }
    }
    if (this.leftImage) {
      this.leftImage.url = "";
      this.leftImage.dispose();
    }
    this.leftImage = null;
    if (this.rightImage) {
      this.rightImage.url = "";
      this.rightImage.dispose();
    }
    this.rightImage = null;
    if (this.nextCom) {
      this.nextCom.dispose();
    }
    this.nextCom = null;
    if (this._guardImge) {
      this._guardImge.dispose();
    }
    super.dispose();
  }
}
