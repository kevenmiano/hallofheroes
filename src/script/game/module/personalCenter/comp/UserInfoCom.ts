import FUI_UserInfoCom from "../../../../../fui/PersonalCenter/FUI_UserInfoCom";
import LangManager from "../../../../core/lang/LangManager";
import SDKManager from "../../../../core/sdk/SDKManager";
import UIManager from "../../../../core/ui/UIManager";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import Utils from "../../../../core/utils/Utils";
import { AppellView } from "../../../avatar/view/AppellView";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_honorequipData } from "../../../config/t_s_honorequip";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { CommonConstant } from "../../../constant/CommonConstant";
import {
  NotificationEvent,
  SNSEvent,
} from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { JobType } from "../../../constant/JobType";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SNSManager } from "../../../manager/SNSManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import IconAvatarFrame from "../../../map/space/view/physics/IconAvatarFrame";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { RoleModel } from "../../bag/model/RoleModel";
import HeadIconModel from "../../bag/view/HeadIconModel";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";

/**
 * 个人中心里的个人信息页面
 */
export default class UserInfoCom extends FUI_UserInfoCom {
  protected _honerView: AppellView;

  public icon_head: IconAvatarFrame;
  onConstruct() {
    super.onConstruct();
    this.initUserInfo();
    this.addEvent();
  }

  private addEvent() {
    this.btn_name.onClick(this, this.onBtnNameClick);
    this.btn_role.onClick(this, this.onChangeRole);
    if (Utils.isWxMiniGame()) {
      this.btn_login.visible =
        wx && typeof wx.restartMiniProgram === "function";
    }
    this.btn_login.onClick(this, this.onBackToLogin);
    this.btn_modify.onClick(this, this.onIconClick);
    this.btn_chatbubble.onClick(this, this.onBtnChatAirBuggleClick);
    SNSManager.Instance.addEventListener(
      SNSEvent.SNSINFO_UPDATE,
      this.updateHeadImg,
      this,
    );
    PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(
      PlayerEvent.NICKNAME_UPDATE,
      this.updateName,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.UPDATE_HEADFRAME_INFO,
      this.updateHead,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.UPDATE_HEADFRAME_ACTIVE,
      this.updateHeadRedStatus,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.UPDATE_HEADFRAME_CLICK_STATUS,
      this.removeHeadRedStatus,
      this,
    );
  }

  private removeHeadRedStatus() {
    this.redStatus.selectedIndex = 0;
  }

  private updateHeadRedStatus() {
    if (HeadIconModel.instance.checkHasAllClick()) {
      //所有激活的都被点击过了
      this.redStatus.selectedIndex = 0;
    } else {
      this.redStatus.selectedIndex = 1;
    }
  }

  /**
   * 切换角色
   */
  private onChangeRole() {
    //1)	点击“切换角色”时, 弹出确认页面, 点击确认后, 返回至选服页面
    let cb: Function = function (b: boolean) {
      if (b) {
        Laya.LocalStorage.setItem("switchRole", "1");
        SDKManager.Instance.getChannel().logout(false);
      }
    };
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      LangManager.Instance.GetTranslation("public.prompt"),
      LangManager.Instance.GetTranslation("PersonalCenter.userInfo0"), //'是否重新选择角色',
      LangManager.Instance.GetTranslation("public.confirm"),
      LangManager.Instance.GetTranslation("public.cancel1"),
      cb,
    );
  }

  /**
   * 返回登录
   */
  private onBackToLogin() {
    let cb: Function = function (b: boolean) {
      if (b) {
        SimpleAlertHelper.Instance.Hide();
        FrameCtrlManager.Instance.open(EmWindow.Waiting); //点击登陆返回, 添加转圈等待窗口
        SDKManager.Instance.getChannel().logout();
      }
    };
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      LangManager.Instance.GetTranslation("public.prompt"),
      LangManager.Instance.GetTranslation("PersonalCenter.userInfo1"), //        '是否返回登录界面',
      LangManager.Instance.GetTranslation("public.confirm"),
      LangManager.Instance.GetTranslation("public.cancel1"),
      cb,
    );
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private initUserInfo() {
    let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
    this.txt_name.text = playerInfo.nickName;
    this.txt_job.text = JobType.getJobName(playerInfo.job);
    this.txt_consortia.text = playerInfo.consortiaName
      ? playerInfo.consortiaName
      : LangManager.Instance.GetTranslation(
          "armyII.viewII.attribute.PlayerAttributeView.Not",
        );
    this.txt_charm.text = playerInfo.charms.toString();
    this.txt_honor.text = playerInfo.honer.toString() + "/";
    let stage = this.thane.honorEquipStage;
    let cfg: t_s_honorequipData = TempleteManager.Instance.geHonorCfgByType(
      1,
      stage,
    );
    if (cfg) {
      this.txt_honorName.text = cfg.HonorequipnameLang;
    }
    this.txt_svr.text = playerInfo.serviceName;

    let info: ThaneInfo = this.thane;
    let value = info.appellInfo
      ? info.appellInfo.TitleLang
      : LangManager.Instance.GetTranslation(
          "armyII.viewII.attribute.PlayerAttributeView.Not",
        );
    this.txt_title.setVar("text", value).flushVars();
    if (info.appellInfo) {
      this._honerView = new AppellView(
        info.appellInfo.ImgWidth,
        info.appellInfo.ImgHeight,
        info.appellId,
      );

      this._honerView.x = this.txt_title.x;
      this._honerView.y = this.txt_title.y;
      this._honerView.fixOffset(this.txt_title.initHeight);

      this._honerView.visible = true;
      this.txt_title.visible = false;
      // this._honerView.scale(1.3,1.3);
      this.displayObject.addChild(this._honerView);
    } else {
      if (this._honerView) {
        this._honerView.visible = false;
      }
      this.txt_title.visible = true;
    }

    this.updateHeadImg(false);
    if (ArmyManager.Instance.thane) {
      this.txt_lv.text = ArmyManager.Instance.thane.grades.toString();
    } else {
      this.txt_lv.text = "0";
    }

    this.showChatBubble.selectedIndex = 0;
    this.updateHeadRedStatus();
  }

  /**
   * 更新头像
   */
  private updateHeadImg(isupdate: boolean = true) {
    this.updateHead();
    if (isupdate) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "armyII.viewII.information.InformationView.saveSucceed",
        ),
      );
    }
  }

  private updateHead() {
    this.icon_head.headId = ArmyManager.Instance.thane.snsInfo.headId;
    if (HeadIconModel.instance.currentEquipFrameId > 0) {
      let itemData: t_s_itemtemplateData =
        TempleteManager.Instance.getGoodsTemplatesByTempleteId(
          HeadIconModel.instance.currentEquipFrameId,
        );
      if (itemData) {
        this.icon_head.headFrame = itemData.Avata;
        this.icon_head.headEffect =
          Number(itemData.Property1) == 1 ? itemData.Avata : "";
      }
    } else {
      this.icon_head.headFrame = "";
      this.icon_head.headEffect = "";
    }
  }

  /**
   * 更新名称
   */
  private updateName(e: PlayerEvent) {
    this.txt_name.text =
      PlayerManager.Instance.currentPlayerModel.playerInfo.nickName;
  }

  /**
   * 修改头像
   */
  private onIconClick() {
    this.redStatus.selectedIndex = 0;
    FrameCtrlManager.Instance.open(EmWindow.HeadIconModifyWnd);
  }

  /**
   * 聊天气泡
   */
  private onBtnChatAirBuggleClick() {
    FrameCtrlManager.Instance.open(EmWindow.ChatAirBubbleWnd);
  }

  /**
   * 修改名字
   */
  private onBtnNameClick() {
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      LangManager.Instance.GetTranslation("public.prompt"),
      LangManager.Instance.GetTranslation("PersonalCenter.rename"),
      LangManager.Instance.GetTranslation("public.confirm"),
      LangManager.Instance.GetTranslation("public.cancel1"),
      this.checkHasCard.bind(this),
    );
  }

  private checkHasCard(b: boolean): boolean {
    if (!b) return;
    let goodsArr: GoodsInfo[] = GoodsManager.Instance.getBagGoodsByTemplateId(
      CommonConstant.RENAME_CARD_TEMPID,
    );
    goodsArr = ArrayUtils.sortOn(goodsArr, "isBinds", ArrayConstant.DESCENDING);
    if (goodsArr.length > 0) {
      UIManager.Instance.ShowWind(
        EmWindow.RenameWnd,
        RoleModel.TYPE_RENAME_CARD,
      );
      return true;
    } else {
      //todo 快捷购买改名卡
      // MessageTipManager.Instance.show("改名卡不足！");
      //需要知道改名卡的模板ID
      var data: ShopGoodsInfo =
        TempleteManager.Instance.getShopTempInfoByItemId(
          CommonConstant.RENAME_CARD_TEMPID,
        );
      let obj = {
        info: data,
        count: 1,
        callback: this.buySucCallback.bind(this),
        // param: [ShopGoodsInfo.BIG_BUGLE_TEMP_ID, itemList, starList, cardList]
      };
      FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, obj);
    }
    return;
  }

  /**
   * 快捷购买改名卡成功后回调
   */
  private buySucCallback() {}

  public removeEvent() {
    this.btn_name.offClick(this, this.onBtnNameClick);
    this.btn_role.offClick(this, this.onChangeRole);
    this.btn_login.offClick(this, this.onBackToLogin);
    this.btn_modify.offClick(this, this.onIconClick);
    SNSManager.Instance.removeEventListener(
      SNSEvent.SNSINFO_UPDATE,
      this.updateHeadImg,
      this,
    );
    PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(
      PlayerEvent.NICKNAME_UPDATE,
      this.updateName,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.UPDATE_HEADFRAME_INFO,
      this.updateHead,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.UPDATE_HEADFRAME_ACTIVE,
      this.updateHeadRedStatus,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.UPDATE_HEADFRAME_CLICK_STATUS,
      this.removeHeadRedStatus,
      this,
    );
  }

  dispose() {
    if (this._honerView) {
      ObjectUtils.disposeObject(this._honerView);
      this._honerView = null;
    }
    super.dispose();
  }
}
