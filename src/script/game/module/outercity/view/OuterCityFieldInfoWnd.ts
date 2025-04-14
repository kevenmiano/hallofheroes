import FUI_Dialog2 from "../../../../../fui/Base/FUI_Dialog2";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_mapData } from "../../../config/t_s_map";
import { ConfigType } from "../../../constant/ConfigDefine";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { WildLand } from "../../../map/data/WildLand";

/**
 * @description 野矿信息面板
 * @author yuanzhan.yu
 * @date 2021/11/30 16:44
 * @ver 1.0
 */
export class OuterCityFieldInfoWnd extends BaseWindow {
  public frame: FUI_Dialog2;
  public txt_name: fgui.GTextField;
  public txt_occupation: fgui.GTextField;
  public txt_power: fgui.GTextField;
  public txt_gold: fgui.GTextField;
  public txt_leftTime: fgui.GTextField;
  public btn_operate: UIButton;
  public btn_cancel: UIButton;

  private _wildLand: WildLand;
  private _countDown: number = 0; //倒计时

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();

    this.initData();
    this.initView();
    this.initEvent();
    this.setCenter();
  }

  private initData() {
    this._wildLand = this.params as WildLand;
  }

  private initView() {
    this.frame.title =
      this._wildLand.tempInfo.NameLang +
      " " +
      LangManager.Instance.GetTranslation(
        "public.level3",
        this._wildLand.tempInfo.Grade,
      );
    this.txt_name.text =
      this._wildLand.tempInfo.NameLang +
      "(" +
      this._wildLand.convertX +
      "," +
      this._wildLand.convertY +
      ")\n" +
      this.mapName;

    this.frame.title = LangManager.Instance.GetTranslation(
      "public.level.name",
      this._wildLand.tempInfo.NameLang,
      this._wildLand.tempInfo.Grade,
    );

    this.txt_name.text =
      this._wildLand.tempInfo.NameLang +
      "(" +
      this._wildLand.convertX +
      "," +
      this._wildLand.convertY +
      ")\n" +
      this.mapName;

    if (this._wildLand.info.occupyPlayerId == 0) {
      this.txt_occupation.text = LangManager.Instance.GetTranslation(
        "map.internals.view.frame.FieldInfoView.occupationLordsFrameText2Text1",
      );
      this.btn_operate.title =
        LangManager.Instance.GetTranslation("public.attack");
    } else {
      let occupationLordsFrameText2Text2: string =
        LangManager.Instance.GetTranslation(
          "map.internals.view.frame.FieldInfoView.occupationLordsFrameText2Text2",
        );
      this.txt_occupation.text =
        this._wildLand.info.occupyPlayerName || occupationLordsFrameText2Text2;
      if (this._wildLand.info.occupyPlayerId == this.thane.userId) {
        this.btn_operate.title = LangManager.Instance.GetTranslation(
          "map.internals.view.frame.FieldInfoView.attackBtnText1",
        );
      } else {
        this.btn_operate.title =
          LangManager.Instance.GetTranslation("public.attack");
      }
    }
    // this.txt_gold.text = "+" + this._wildLand.tempInfo.Property4 + "/" + LangManager.Instance.GetTranslation("public.time.hour");
    let curTime: number =
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond * 1000;
    let createTime: number = this._wildLand.createDate.getTime();
    createTime = curTime - createTime;
    // let reTime: number = this._wildLand.tempInfo.RefreshTime;
    // this._countDown = reTime - createTime / 1000;
    // if (reTime > 0) {
    //     Laya.timer.loop(1000, this, this.updateCountDown)
    //     this.updateCountDown();
    // }
  }

  private initEvent() {
    this.btn_operate.onClick(this, this.onBtnOperateClick);
    this.btn_cancel.onClick(this, this.onBtnCancelClick);
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private updateCountDown() {
    if (this._countDown > 0) {
      this.txt_leftTime.text = DateFormatter.getConsortiaCountDate(
        this._countDown,
      );
      this._countDown--;
    } else {
      this.txt_leftTime.text = "00:00:00";
      Laya.timer.clear(this, this.updateCountDown);
    }
  }

  private onBtnCancelClick() {
    this.hide();
  }

  private onBtnOperateClick() {
    if (this.thane.userId == this._wildLand.info.occupyPlayerId) {
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation(
        "map.FieldInfoFrame.prompt",
      );
      let content: string = LangManager.Instance.GetTranslation(
        "map.FieldInfoFrame.content",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        prompt,
        content,
        confirm,
        cancel,
        this.__giveUpCall.bind(this),
      );
    } else {
      OuterCityManager.Instance.controler.sendAttack(
        this._wildLand.posX,
        this._wildLand.posY,
      );
      this.hide();
    }
  }

  private __giveUpCall(b: boolean): void {
    if (b) {
      OuterCityManager.Instance.controler.sendGiveUp(this._wildLand);
      this.hide();
    }
  }

  private get mapName(): string {
    let map: t_s_mapData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_map,
      this._wildLand.info.mapId,
    );
    return map.MapNameLang;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private removeEvent() {
    this.btn_operate.offClick(this, this.onBtnOperateClick);
    this.btn_cancel.offClick(this, this.onBtnCancelClick);
  }

  public OnHideWind() {
    super.OnHideWind();

    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    this._wildLand = null;
    Laya.timer.clear(this, this.updateCountDown);
    super.dispose(dispose);
  }
}
