import BaseWindow from "../../core/ui/Base/BaseWindow";
import { BaseItem } from "../component/item/BaseItem";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import GoodsSonType from "../constant/GoodsSonType";
import LangManager from "../../core/lang/LangManager";
import { GoodsCheck } from "../utils/GoodsCheck";
import { ArmyManager } from "../manager/ArmyManager";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { BagHelper } from "../module/bag/utils/BagHelper";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../manager/PlayerManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { SocketSendManager } from "../manager/SocketSendManager";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { PlayerBufferInfo } from "../datas/playerinfo/PlayerBufferInfo";
import { PlayerBufferManager } from "../manager/PlayerBufferManager";
import ConfigMgr from "../../core/config/ConfigMgr";
import { ConfigType } from "../constant/ConfigDefine";
import UIManager from "../../core/ui/UIManager";
import { EmWindow } from "../constant/UIDefine";
import { t_s_composeData } from "../config/t_s_compose";
import { GoodsType } from "../constant/GoodsType";
import BaseTips from "./BaseTips";
import { MountsManager } from "../manager/MountsManager";
import { WildSoulInfo } from "../module/mount/model/WildSoulInfo";
import { ToolTipsManager } from "../manager/ToolTipsManager";

/**
 * @description 合成公式tips
 * @author yuanzhan.yu
 * @date 2021/8/11 18:26
 * @ver 1.0
 */
export class ComposeTip extends BaseTips {
  public bg: fgui.GLoader;
  public item: BaseItem;
  public txt_name: fgui.GTextField;
  public txt_useLevel: fgui.GTextField;
  public txt_bind: fgui.GTextField;
  public txt_study: fgui.GTextField;
  public subBox1: fgui.GGroup;
  public txt_desc: fgui.GRichTextField;
  public txt_need: fgui.GRichTextField;
  public txt_time: fgui.GTextField;
  public txt_price: fgui.GTextField;
  public group_price: fgui.GGroup;
  public btn_use: fgui.GButton;
  public btn_batchUse: fgui.GButton;
  public group_oprate: fgui.GGroup;
  public subBox2: fgui.GGroup;
  public totalBox: fgui.GGroup;

  private _info: GoodsInfo;
  private _canOperate: boolean;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();

    this.initData();
    this.initView();
    this.addEvent();

    this.updateView();
    //note 调用ensureBoundsCorrect立即重排
    this.totalBox.ensureBoundsCorrect();
  }

  private initData() {
    [this._info, this._canOperate] = this.params;
  }

  private initView() {}

  private addEvent() {
    this.btn_use.onClick(this, this.onBtnUseClick.bind(this));
    this.btn_batchUse.onClick(this, this.onBtnBatchUseClick.bind(this));
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private updateView() {
    if (this._info) {
      this.item.info = this._info;
      this.item.text = "";
      this.txt_name.text = this._info.templateInfo.TemplateNameLang;
      this.txt_name.color = GoodsSonType.getColorByProfile(
        this._info.templateInfo.Profile,
      );
      ToolTipsManager.Instance.setMountActiveTxt(this._info, this.txt_bind);
      let player: PlayerInfo =
        PlayerManager.Instance.currentPlayerModel.playerInfo;
      if (player.composeList.indexOf(this._info.templateInfo.Property1) >= 0) {
        this.txt_study.text = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.ComposeTip.vStudy",
        );
      } else {
        this.txt_study.text = "";
      }

      this.txt_desc.text = this._info.templateInfo.DescriptionLang;

      let needStr: string = "";
      let composeTemp: t_s_composeData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_compose,
        this._info.templateInfo.Property1,
      );
      if (composeTemp) {
        let composeGoods: GoodsInfo = new GoodsInfo();
        composeGoods.templateId = composeTemp.NewMaterial;
        if (composeGoods.templateInfo.MasterType == GoodsType.EQUIP) {
          // _equipTipsContent.spacing = 0;
          // _equipTipsContent.data = composeGoods;
          // _totalBox.addChild(_equipTipsContent);
        }

        let materialTemp: t_s_itemtemplateData;
        for (let i: number = 1; i < 5; i++) {
          if (composeTemp["Material" + i] > 0) {
            materialTemp = ConfigMgr.Instance.getTemplateByID(
              ConfigType.t_s_itemtemplate,
              composeTemp["Material" + i],
            );
            needStr +=
              materialTemp.TemplateNameLang + "*" + composeTemp["Count" + i];
          }
        }
      }
      this.txt_need.text =
        LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.ComposeTip.need",
        ) + needStr;

      this.group_price.visible = this._info.templateInfo.SellGold > 0;
      let str: string =
        "" +
        this._info.templateInfo.SellGold * (1 + this._info.strengthenGrade * 2);
      this.txt_price.text = this._info.templateInfo.SellGold == 0 ? "" : str;

      if (this._info.templateInfo.NeedGrades > 1) {
        this.txt_useLevel.text = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTipsContent.grade",
          this._info.templateInfo.NeedGrades,
        );
        if (
          !GoodsCheck.isGradeFix(
            ArmyManager.Instance.thane,
            this._info.templateInfo,
            false,
          )
        ) {
          this.txt_useLevel.color = "#FF0000";
        }
      } else {
        this.txt_useLevel.text = "";
      }

      if (this._info.id != 0) {
        this.txt_bind.visible = true;
      } else {
        this.txt_bind.visible = false;
      }

      if (this._info.validDate > 0) {
        //加上时效性
        this.txt_time.visible = true;
      } else {
        this.txt_time.visible = false;
      }

      let timeStr: string;
      if (this._info.leftTime == -1) {
        timeStr = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTip.timeStr01",
        );
      } else if (this._info.leftTime < 0) {
        timeStr = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTip.timeStr02",
        );
      } else {
        timeStr = DateFormatter.getFullDateString(this._info.leftTime);
      }
      this.txt_time.text =
        LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTip.time.text",
        ) +
        ":" +
        timeStr;

      if (
        this._canOperate &&
        BagHelper.checkCanUseGoods(this._info.templateInfo.SonType)
      ) {
        this.group_oprate.visible = true;
        this.btn_batchUse.visible = this.showBatchUseBtn();
      } else {
        this.group_oprate.visible = false;
      }
      if (BagHelper.isOpenConsortiaStorageWnd()) {
        //在公会仓库中
        this.btn_batchUse.visible = false;
        this.btn_use.title = BagHelper.getText(this._info);
        this.group_oprate.visible = true;
      }
    }
  }

  private showBatchUseBtn(): boolean {
    let b: boolean = this._info.templateInfo.IsCanBatch == 1;
    return b;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private onBtnUseClick() {
    if (BagHelper.isOpenConsortiaStorageWnd()) {
      BagHelper.consortiaStorageOperate(this._info);
      this.hide();
    } else {
      this.onBtnUseClick2();
    }
  }

  private onBtnUseClick2() {
    if (this._info) {
      let str: string = "";
      if (
        this._info.templateInfo.SonType != GoodsSonType.SONTYPE_NOVICE_BOX &&
        !GoodsCheck.isGradeFix(
          ArmyManager.Instance.thane,
          this._info.templateInfo,
          false,
        )
      ) {
        let str: string = LangManager.Instance.GetTranslation(
          "cell.view.GoodsItemMenu.command01",
        );
        MessageTipManager.Instance.show(str);
        this.hide();
        return;
      } else if (this.check()) {
        let itemBuffer: PlayerBufferInfo =
          PlayerBufferManager.Instance.getItemBufferInfo(
            this._info.templateInfo.Property1,
          );
        if (itemBuffer) {
          if (this._info.templateInfo.Property3 < itemBuffer.grade) {
            str = LangManager.Instance.GetTranslation(
              "cell.view.GoodsItemMenu.command02",
            );
            MessageTipManager.Instance.show(str);
            this.hide();
            return;
          }
          SocketSendManager.Instance.sendUseItem(this._info.pos);
        } else {
          if (
            this._info.templateInfo.Property1 == 5 &&
            this._info.templateInfo.Property2 > 0
          ) {
            let wearyGet: number = this._info.templateInfo.Property2;
            let pos: number = this._info.pos;
            let itemCount: number = 1;
            if (!this.checkWearyCanGet(wearyGet, pos, itemCount)) {
              this.hide();
              return;
            } else {
              if (!this.checkWearyTodayCanGet(wearyGet, pos, itemCount)) {
                this.hide();
                return;
              }
            }
          }
          SocketSendManager.Instance.sendUseItem(this._info.pos);
        }
      }
    }
    this.hide();
  }

  private check(): boolean {
    let str: string = "";
    if (
      this._info.templateInfo.SonType == GoodsSonType.SONTYPE_COMPOSE &&
      this.playerInfo.composeList.indexOf(this._info.templateInfo.Property1) >=
        0
    ) {
      str = LangManager.Instance.GetTranslation(
        "cell.view.GoodsItemMenu.command04",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    return true;
  }

  private checkWearyCanGet(
    wearyGet: number,
    pos: number,
    count: number = 1,
  ): boolean {
    // let wearyCanGet: number = PlayerInfo.WEARY_MAX - this.playerInfo.weary;
    // if (wearyGet > wearyCanGet) {
    //     let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    //     let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    //     let prompt: string = LangManager.Instance.GetTranslation("map.campaign.view.frame.SubmitResourcesFrame.titleTextTip");
    //     let content: string = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command07", PlayerInfo.WEARY_MAX, wearyCanGet);
    //     SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, [wearyGet, pos, count], prompt, content, confirm, cancel, this.wearyCanGetCallBack.bind(this));
    //     return false;
    // }
    return true;
  }

  private checkWearyTodayCanGet(
    wearyGet: number,
    pos: number,
    count: number = 1,
  ): boolean {
    let wearyTodayCanGet: number =
      PlayerInfo.WEARY_GET_MAX - this.playerInfo.wearyLimit;
    if (wearyGet > wearyTodayCanGet) {
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation(
        "map.campaign.view.frame.SubmitResourcesFrame.titleTextTip",
      );
      let content: string = LangManager.Instance.GetTranslation(
        "cell.mediator.playerbag.PlayerBagCellClickMediator.command06",
        PlayerInfo.WEARY_GET_MAX,
        wearyTodayCanGet,
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        [wearyGet, pos, count, true],
        prompt,
        content,
        confirm,
        cancel,
        this.wearyTodayCanGetCallBack.bind(this),
      );
      return false;
    }
    return true;
  }

  private wearyCanGetCallBack(b: boolean, flag: boolean, data: any[]) {
    if (b) {
      let wearyGet: number = data[0],
        pos: number = data[1],
        count: number = data[2];
      if (this.checkWearyTodayCanGet(wearyGet, pos, count)) {
        SocketSendManager.Instance.sendUseItem(pos, count);
      }
    }
  }

  private wearyTodayCanGetCallBack(b: boolean, flag: boolean, data: any[]) {
    if (b) {
      let wearyGet: number = data[0],
        pos: number = data[1],
        count: number = data[2],
        today: boolean = data[3];
      SocketSendManager.Instance.sendUseItem(pos, count);
    }
  }

  private onBtnBatchUseClick() {
    if (
      this._info.templateInfo.SonType != GoodsSonType.SONTYPE_NOVICE_BOX &&
      !GoodsCheck.isGradeFix(
        ArmyManager.Instance.thane,
        this._info.templateInfo,
        false,
      )
    ) {
      let str: string = LangManager.Instance.GetTranslation(
        "cell.view.GoodsItemMenu.command01",
      );
      MessageTipManager.Instance.show(str);
      this.hide();
      return;
    }
    if (!BagHelper.Instance.checkCanMulUse(this._info) || !this.check()) {
      this.hide();
      return;
    }

    UIManager.Instance.ShowWind(EmWindow.BatchUseConfirmWnd, [this._info]);
    this.hide();
  }

  private removeEvent() {
    this.btn_use.offClick(this, this.onBtnUseClick.bind(this));
    this.btn_batchUse.offClick(this, this.onBtnBatchUseClick.bind(this));
  }

  protected OnClickModal() {
    this.hide();
  }

  public OnHideWind() {
    super.OnHideWind();

    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    this._info = null;
    super.dispose(dispose);
  }
}
