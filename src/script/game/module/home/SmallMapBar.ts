import BaseFguiCom from "../../../core/ui/Base/BaseFguiCom";
import UIButton from "../../../core/ui/UIButton";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { SpaceSocketOutManager } from "../../map/space/SpaceSocketOutManager";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import Utils from "../../../core/utils/Utils";
import LangManager from "../../../core/lang/LangManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { CampaignManager } from "../../manager/CampaignManager";
import { CampaignSocketOutManager } from "../../manager/CampaignSocketOutManager";
import { ArmyManager } from "../../manager/ArmyManager";
import SpaceManager from "../../map/space/SpaceManager";
import { TaskManage } from "../../manager/TaskManage";
import { UIConstant } from "../../constant/UIConstant";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { SharedManager } from "../../manager/SharedManager";
import {
  OuterCityEvent,
  SpaceEvent,
} from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import CustomerServiceManager from "../../manager/CustomerServiceManager";
import OpenGrades from "../../constant/OpenGrades";
import { OuterCityManager } from "../../manager/OuterCityManager";
import { BaseCastle } from "../../datas/template/BaseCastle";
import QuickLookCastleItem from "./item/QuickLookCastleItem";
import { EmOuterCityWarCastlePeriodType } from "../../constant/OuterCityWarDefine";
import { OuterCityWarModel } from "../outercityWar/model/OuterCityWarModel";
import { GlobalConfig } from "../../constant/GlobalConfig";

export default class SmallMapBar extends BaseFguiCom {
  private state: fgui.Controller;
  private spaceBtn: UIButton;
  private castleBtn: UIButton;
  private outercityBtn: UIButton;
  public mapBtn: UIButton;
  public mapBtn2: UIButton;
  public opBtn: UIButton;
  public editBtn: UIButton;
  public castleBtn2: UIButton;
  public showBtn: UIButton;
  public hideBtn: UIButton;
  private ReplyBtn: UIButton;

  private title1: fgui.GTextField;
  private title2: fgui.GTextField;
  public txt_pos: fgui.GTextField;

  private _curState: number = 0;
  private _BigMap_X: number = 0;
  private _BigMap_Y: number = 0;

  public static SPACE_SMALL_MAP_STATE: number = 1; //天空之城模式
  public static CAMPAIGN_SMALL_MAP_STATE: number = 2; //副本地图
  public static CAMPAIGN_SMALL_MAP_STATE2: number = 3; //副本小地图显示为大地图样式
  public static CASTLE_SMALL_MAP_STATE: number = 4; //内城模式
  public static HOOKROOM_SMALL_MAP_STATE: number = 5; //修行神殿模式
  public static OUTERCITY_SMALL_MAP_STATE: number = 6; //外城模式

  public static SPACE: number = 1; //天空之城
  public static CASTLE: number = 2; //内城
  public static OUTERCITY: number = 2; //外城
  public static LOCATEARMY: number = 4; //定位英雄
  public static RETURNCASTLE: number = 5; //定位内城
  public static OPBTN: number = 10; //定位操作按钮
  private btnInternalState: boolean = false;
  private btnInternal: number = 2000;

  constructor(container?: fgui.GComponent) {
    super(container);
    this.state = this.getController("state");
    this.title1 = this.spaceBtn.view.getChild("n4").asTextField;
    this.title2 = this.castleBtn.view.getChild("n4").asTextField;
    this.addEvent();
  }

  public OnShowWind() {
    this.__castleInfo();
    this.__hideOthersHandler();
    this.__newServiceReplyHandler();
  }

  private addEvent() {
    this.mapBtn.onClick(this, this.openSmallMap);
    this.mapBtn2.onClick(this, this.openMap);
    this.spaceBtn.onClick(this, this.enterHome);
    this.castleBtn.onClick(this, this.enterInnerHome);
    this.outercityBtn.onClick(this, this.enterOuterCity);
    this.opBtn.onClick(this, this.showOperateMenu);
    this.castleBtn2.onClick(this, this.enterInnerHome);
    this.showBtn.onClick(this, this.showOther);
    this.hideBtn.onClick(this, this.hideOther);
    this.ReplyBtn.onClick(this, this.onReplyClick.bind(this));
    NotificationManager.Instance.addEventListener(
      SpaceEvent.HIDE_OTHERS,
      this.__hideOthersHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.CASTLE_INFO,
      this.__castleInfo,
      this,
    );
    CustomerServiceManager.Instance.addEventListener(
      CustomerServiceManager.NEW_REPLY,
      this.__newServiceReplyHandler,
      this,
    );
  }

  private removeEvent() {
    this.mapBtn.offClick(this, this.openSmallMap);
    this.mapBtn2.offClick(this, this.openMap);
    this.spaceBtn.offClick(this, this.enterHome);
    this.castleBtn.offClick(this, this.enterInnerHome);
    this.outercityBtn.offClick(this, this.enterOuterCity);
    this.opBtn.offClick(this, this.showOperateMenu);
    this.castleBtn2.offClick(this, this.enterInnerHome);
    this.showBtn.offClick(this, this.showOther);
    this.hideBtn.offClick(this, this.hideOther);
    this.ReplyBtn.offClick(this, this.onReplyClick.bind(this));
    NotificationManager.Instance.removeEventListener(
      SpaceEvent.HIDE_OTHERS,
      this.__hideOthersHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.CASTLE_INFO,
      this.__castleInfo,
      this,
    );
    CustomerServiceManager.Instance.removeEventListener(
      CustomerServiceManager.NEW_REPLY,
      this.__newServiceReplyHandler,
      this,
    );
  }

  private __hideOthersHandler() {
    this.showBtn.visible = SharedManager.Instance.hideOtherPlayer;
    this.hideBtn.visible = !SharedManager.Instance.hideOtherPlayer;
  }

  private __castleInfo() {
    let model = OuterCityManager.Instance.model;
    if (!model) return;

    let nodeIdList = GlobalConfig.OuterCity.CastleNodeIdList;
    for (let index = 1; index <= nodeIdList.length; index++) {
      let item = this["itemLookCastle" + index] as QuickLookCastleItem;
      item.visible = false;
    }
    let itemIdx = 1;
    for (let index = 0; index < nodeIdList.length; index++) {
      let castleId = nodeIdList[index];
      let castleInfo = model.getCastleById(castleId);
      if (!castleInfo) continue;
      // if (castleId == 803108) {
      //     castleInfo.state = EmOuterCityWarCastlePeriodType.DeclaringWar
      // }
      if (
        castleInfo.state == EmOuterCityWarCastlePeriodType.DeclaringWar ||
        castleInfo.state == EmOuterCityWarCastlePeriodType.Fighting
      ) {
        let item = this["itemLookCastle" + itemIdx] as QuickLookCastleItem;
        if (item) {
          item.visible = true;
          item.info = castleInfo;
          itemIdx++;
        }
      }
    }
  }

  private showOther() {
    this.hide(false);
    this.showBtn.visible = false;
    this.hideBtn.visible = true;
  }

  private hideOther() {
    this.hide(true);
    this.showBtn.visible = true;
    this.hideBtn.visible = false;
  }

  onReplyClick() {
    UIManager.Instance.ShowWind(EmWindow.ServiceReplyWnd);
  }

  __newServiceReplyHandler() {
    if (CustomerServiceManager.Instance.model.receiveMessageList.length > 0) {
      this.ReplyBtn.visible = true;
      this.ReplyBtn.view.getController("c1").selectedIndex = 1;
    } else {
      this.ReplyBtn.view.getController("c1").selectedIndex = 0;
      this.ReplyBtn.visible = false;
    }
  }

  private hide(flag: boolean) {
    SharedManager.Instance.hideOtherPlayer = flag;
    NotificationManager.Instance.dispatchEvent(SpaceEvent.HIDE_OTHERS, flag);
  }

  public set iconContainerX(value: number) {
    this._BigMap_X = value;
    this.coordinates();
  }

  public set iconContainerY(value: number) {
    this._BigMap_Y = value;
    this.coordinates();
  }

  private coordinates(): void {
    let posX: number = Math.floor(
      (StageReferance.stageWidth / 2 -
        this._BigMap_X * UIConstant.SMALL_MAP_SCALE) /
        50,
    );
    let posY: number = Math.floor(
      (StageReferance.stageHeight / 2 -
        this._BigMap_Y * UIConstant.SMALL_MAP_SCALE) /
        50,
    );
    posX = posX < 0 ? 0 : posX;
    posY = posY < 0 ? 0 : posY;
    this.txt_pos.text = `【${posX},${posY}】`;
  }

  private enterInnerHome() {
    let self = this;
    if (this.btnInternalState) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.view.ActivityItem.command01",
        ),
      );
      return;
    }
    Utils.delay(this.btnInternal).then(() => {
      self.btnInternalState = false;
    });
    this.btnInternalState = true;
    if (ArmyManager.Instance.army.onVehicle) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"),
      );
      return;
    }
    SceneManager.Instance.setScene(SceneType.CASTLE_SCENE);
  }

  private enterHome() {
    if (ArmyManager.Instance.thane.grades < OpenGrades.ENTER_SPACE) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("smallMapBar.enterHome.tips"),
      );
      return;
    }
    if (ArmyManager.Instance.army.onVehicle) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"),
      );
      return;
    }
    let self = this;
    if (this.btnInternalState) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.view.ActivityItem.command01",
        ),
      );
      return;
    }
    Utils.delay(this.btnInternal).then(() => {
      self.btnInternalState = false;
    });
    this.btnInternalState = true;

    if (WorldBossHelper.checkPetLand(CampaignManager.Instance.mapId)) {
      let content = LangManager.Instance.GetTranslation(
        "MainToolBar.extPetIsland",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        null,
        content,
        null,
        null,
        (b: boolean) => {
          if (b) {
            SpaceManager.ClickEnterHome = true;
            this.returnCampaignRoom();
          }
        },
      );
      return;
    }

    SpaceManager.ClickEnterHome = true;
    if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
      this.returnCampaignRoom();
    } else {
      SpaceSocketOutManager.Instance.enterSpace();
    }
  }

  private returnCampaignRoom() {
    CampaignSocketOutManager.Instance.sendReturnCampaignRoom(
      this.currentArmyId,
    );
  }

  private enterOuterCity() {
    let self = this;
    if (this.btnInternalState) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.view.ActivityItem.command01",
        ),
      );
      return;
    }
    Utils.delay(this.btnInternal).then(() => {
      self.btnInternalState = false;
    });
    this.btnInternalState = true;

    let str: string;
    if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
      str = LangManager.Instance.GetTranslation(
        "mainBar.MainToolBar.command01",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (!TaskManage.Instance.IsTaskFinish(TaskManage.SETARMY_TASK)) {
      str = LangManager.Instance.GetTranslation("newbie.needfinishTask");
      MessageTipManager.Instance.show(str);
      return;
    }
    SceneManager.Instance.setScene(SceneType.OUTER_CITY_SCENE);
  }

  private showOperateMenu() {
    UIManager.Instance.ShowWind(EmWindow.OuterCityOperateMenu);
  }

  private get currentArmyId(): number {
    let bArmy: any = ArmyManager.Instance.army;
    if (bArmy) {
      return bArmy.id;
    }
    return 0;
  }

  private openSmallMap() {
    if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
      UIManager.Instance.ShowWind(EmWindow.SmallMapWnd);
    }
  }

  private openMap() {
    if (
      SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE &&
      WorldBossHelper.checkPetLand(CampaignManager.Instance.mapId)
    ) {
      UIManager.Instance.ShowWind(EmWindow.CampaignMapWnd);
    } else if (
      SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE
    ) {
      FrameCtrlManager.Instance.open(EmWindow.OuterCityMapWnd);
    }
  }

  public mopupIng() {
    if (this.spaceBtn) this.spaceBtn.enabled = false;
    if (this.outercityBtn) this.outercityBtn.enabled = false;
    if (this.castleBtn) this.castleBtn.enabled = false;
  }

  public mopupEnd() {
    if (this.spaceBtn) this.spaceBtn.enabled = true;
    if (this.outercityBtn) this.outercityBtn.enabled = true;
    if (this.castleBtn) this.castleBtn.enabled = true;
  }

  public switchSmallMapState(state: number) {
    this._curState = state;

    switch (this._curState) {
      case SmallMapBar.SPACE_SMALL_MAP_STATE:
        this.state.selectedIndex = 0;
        this.title1.text = this.title2.text =
          SpaceManager.Instance.model.mapTempInfo.MapNameLang;
        break;
      case SmallMapBar.CASTLE_SMALL_MAP_STATE:
        this.state.selectedIndex = 1;
        this.title1.text = this.title2.text =
          LangManager.Instance.GetTranslation(
            "mainBar.SmallMapBar.castleTitle",
          );
        break;
      case SmallMapBar.CAMPAIGN_SMALL_MAP_STATE:
      case SmallMapBar.CAMPAIGN_SMALL_MAP_STATE2:
        this.state.selectedIndex = 2;
        this.title1.text = this.title2.text =
          CampaignManager.Instance.mapModel.mapTempInfo.MapNameLang;
        break;
      case SmallMapBar.OUTERCITY_SMALL_MAP_STATE:
        this.state.selectedIndex = 3;
        this.title1.text = this.title2.text =
          LangManager.Instance.GetTranslation(
            "mainBar.SmallMapBar.outercityTitle",
          );
        break;
      default:
        break;
    }
  }

  public getButtonByType(type: number): fgui.GButton {
    switch (type) {
      case SmallMapBar.SPACE:
        return this.spaceBtn.view.asButton;
      case SmallMapBar.CASTLE:
        return this.castleBtn.view.asButton;
      case SmallMapBar.OUTERCITY:
        return this.castleBtn.view.asButton;
      case SmallMapBar.OPBTN:
        return this.opBtn.view.asButton;
    }
  }

  public dispose() {
    this.removeEvent();
    super.dispose();
  }
}
