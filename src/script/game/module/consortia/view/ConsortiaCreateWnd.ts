//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:31:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-08-02 17:18:28
 * @Description: 公会创建 v2.46 CreatConsortiaFrame 已调试
 */
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { ConsortiaControler } from "../control/ConsortiaControler";
import { ConsortiaModel } from "../model/ConsortiaModel";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import SoundManager from "../../../../core/audio/SoundManager";
import StringHelper from "../../../../core/utils/StringHelper";
import GoodsSonType from "../../../constant/GoodsSonType";
import { SoundIds } from "../../../constant/SoundIds";
import { FilterWordManager } from "../../../manager/FilterWordManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { ResourceData } from "../../../datas/resource/ResourceData";
import { ResourceManager } from "../../../manager/ResourceManager";
import LangManager from "../../../../core/lang/LangManager";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import ChatHelper from "../../../utils/ChatHelper";
import StringUtils from "../../../utils/StringUtils";
import { StringUtil } from "../../../utils/StringUtil";
import { YTextInput } from "../../common/YTextInput";
import Utils from "../../../../core/utils/Utils";
import { NotificationManager } from "../../../manager/NotificationManager";
import { LoginEvent } from "../../../constant/event/NotificationEvent";

export class ConsortiaCreateWnd extends BaseWindow {
  public txtName: fgui.GTextField;
  public tfSearch: YTextInput;
  public btnConfirm: fgui.GButton;
  public txtCondition: fgui.GTextField;
  public txtConditionValue: fgui.GTextField;
  public txtCoin: fgui.GTextField;
  private _contorller: ConsortiaControler;
  private _data: ConsortiaModel;
  private _txtChange: string = "";
  public frame: fgui.GComponent;
  public descTxt: fgui.GTextField;
  public OnInitWind() {
    super.OnInitWind();
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "ConsortiaCreateWnd.title",
    );
    this.txtName.text = LangManager.Instance.GetTranslation(
      "ConsortiaCreateWnd.txtNameTxt",
    );
    this.txtCondition.text = LangManager.Instance.GetTranslation(
      "ConsortiaCreateWnd.txtConditionTxt",
    );
    this.descTxt.text = LangManager.Instance.GetTranslation(
      "ConsortiaCreateWnd.descTxt",
    );
    this.txtConditionValue.text = LangManager.Instance.GetTranslation(
      "ConsortiaCreateWnd.txtConditionValue",
    );
    this.btnConfirm.title = LangManager.Instance.GetTranslation(
      "ConsortiaCreateWnd.btnConfirm.title",
    );
    this.tfSearch.tooltips = LangManager.Instance.GetTranslation(
      "ConsortiaContributeWnd.tfDiamond.text",
    );
    this.setCenter();
    this.initData();
    this.checkEnabled();
    this.initEvent();
    Utils.setDrawCallOptimize(this);
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private initData() {
    this._contorller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    this._data = this._contorller.model;
    this.txtCoin.text = "" + ConsortiaModel.CREAT_NEEDED_GOLD;
    this.tfSearch.requestFocus();
  }

  private initEvent() {
    this.tfSearch.fontSize = 22;
    this.tfSearch.txt_web.maxLength = 16;
    this.tfSearch.singleLine = true;
    this.tfSearch.valign = "middle";
    this.tfSearch.promptText = LangManager.Instance.GetTranslation(
      "ConsortiaContributeWnd.tfDiamond.text",
    );
    this.tfSearch.on(Laya.Event.INPUT, this, this.onChanged);
    this.btnConfirm.onClick(this, this.btnConfirmHandler);
    this.thane.addEventListener(
      PlayerEvent.THANE_LEVEL_UPDATE,
      this.onPlayInfoUpdata,
      this,
    );
    NotificationManager.Instance.addEventListener(
      LoginEvent.LOGIN_OTHER,
      this.onLoginOther,
      this,
    );
  }

  private removeEvent() {
    this.tfSearch.off(Laya.Event.INPUT, this, this.onChanged);
    this.btnConfirm.offClick(this, this.btnConfirmHandler);
    this.thane.removeEventListener(
      PlayerEvent.THANE_LEVEL_UPDATE,
      this.onPlayInfoUpdata,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      LoginEvent.LOGIN_OTHER,
      this.onLoginOther,
      this,
    );
  }

  private onLoginOther() {
    if (!this.destroyed) {
      this.tfSearch.focus = false;
    }
  }

  private onChanged() {
    let vStr = this.tfSearch.text;
    var length: number = StringHelper.getStringLength(vStr);
    if (length > 10) {
      this.tfSearch.text = this._txtChange;
      return;
    }
    this._txtChange = vStr;
    this.tfSearch.text = vStr;
  }

  private btnConfirmHandler() {
    SoundManager.Instance.play(SoundIds.CONFIRM_SOUND);
    //过滤非法字符
    let retStr = ChatHelper.parasMsgs(this.tfSearch.text);
    retStr = StringUtil.trim(retStr);

    if (StringUtils.checkEspicalWorld(retStr)) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("special.words"),
      );
      this.tfSearch.text = retStr;
      return;
    }

    this.btnConfirm.enabled = false;
    if (this.canCreat()) {
      this._contorller.creatConsortia(retStr);
      this.OnBtnClose();
    } else {
      this.btnConfirm.enabled = true;
    }
  }

  private onPlayInfoUpdata() {
    this.checkEnabled();
  }

  private checkEnabled() {
    var goods: any[] = GoodsManager.Instance.getGoodsBySonType(
      GoodsSonType.SONTYPE_CONSORTIA_CARD,
    );
    if (
      this.gold.count < ConsortiaModel.CREAT_NEEDED_GOLD &&
      goods.length == 0
    ) {
      this.txtConditionValue.color = "#FF0000";
      this.txtCoin.color = "#FF0000";
    } else {
      this.txtConditionValue.color = "#FFECC6";
      this.txtCoin.color = "#FFECC6";
    }
    if (this.thane.grades < ConsortiaModel.CREAT_NEEDED_GRADES) {
      this.txtConditionValue.color = "#FF0000";
    } else {
      this.txtConditionValue.color = "#FFECC6";
    }
  }

  private canCreat(): boolean {
    var str: string = "";
    this.txtCoin.color = "#FFECC6";
    if (this.gold.count < ConsortiaModel.CREAT_NEEDED_GOLD) {
      str = LangManager.Instance.GetTranslation(
        "consortia.view.club.CreatConsortiaFrame.command08",
        ConsortiaModel.CREAT_NEEDED_GOLD,
      );
      MessageTipManager.Instance.show(str);
      this.txtCoin.color = "#FF0000";
      return false;
    }
    if (this.thane.grades < ConsortiaModel.CREAT_NEEDED_GRADES) {
      str = LangManager.Instance.GetTranslation(
        "consortia.view.club.CreatConsortiaFrame.command09",
        ConsortiaModel.CREAT_NEEDED_GRADES,
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    this.tfSearch.text = StringHelper.trim(this.tfSearch.text);
    if (StringHelper.isNullOrEmpty(this.tfSearch.text)) {
      str = LangManager.Instance.GetTranslation(
        "consortia.view.club.CreatConsortiaFrame.command10",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    if (
      FilterWordManager.isGotForbiddenWords(this.tfSearch.text, "name") ||
      FilterWordManager.isGotForbiddenWords(this.tfSearch.text, "chat")
    ) {
      str = LangManager.Instance.GetTranslation(
        "consortia.view.club.CreatConsortiaFrame.command11",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    var length: number = this.tfSearch.text.replace(
      /[^\x00-\xff]/g,
      "xx",
    ).length;
    if (length > 10 || length < 4) {
      str = LangManager.Instance.GetTranslation(
        "consortia.view.club.CreatConsortiaFrame.command12",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    return true;
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private get gold(): ResourceData {
    return ResourceManager.Instance.gold;
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
