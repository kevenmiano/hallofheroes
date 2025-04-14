//@ts-expect-error: External dependencies
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { IconFactory } from "../../../core/utils/IconFactory";
import {
  ResourceEvent,
  TechnologyItemEvent,
} from "../../constant/event/NotificationEvent";
import { PlayerEffectInfo } from "../../datas/playerinfo/PlayerEffectInfo";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { TempleteManager } from "../../manager/TempleteManager";
import BuildingManager from "../../map/castle/BuildingManager";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import { BaseIcon } from "../../component/BaseIcon";
import { BuildingOrderInfo } from "../../datas/playerinfo/BuildingOrderInfo";
import { VIPManager } from "../../manager/VIPManager";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import { t_s_buildingtemplateData } from "../../config/t_s_buildingtemplate";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
/**
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2021-04-27 10:47
 */
export default class SeminaryUpWnd extends BaseWindow {
  private skillIcon: BaseIcon; //兵种头像
  public com: fgui.GComponent;
  public nameTxt: fgui.GTextField;
  public LevelTxt: fgui.GTextField;
  public currentLevelTxt: fgui.GTextField;
  public nextLevelTxt: fgui.GTextField;
  public descTxt1: fgui.GTextField;
  public descTxt2: fgui.GTextField;
  public costTxt: fgui.GTextField;
  public costValueTxt: fgui.GTextField;
  public conditionTxt: fgui.GTextField;
  public reduceTxt: fgui.GTextField;
  public reduceTimeTxt: fgui.GTextField;
  public BtnUpgrade: fgui.GButton;
  public btnSpeedup: fgui.GButton;
  private _data: BuildInfo;
  private _temp: t_s_buildingtemplateData;
  private _nTemp: t_s_buildingtemplateData;
  public tipItem: BaseTipItem;
  public OnInitWind() {
    super.OnInitWind();
    this.currentLevelTxt.text = LangManager.Instance.GetTranslation(
      "yishi.view.tips.TechnologyTip.currentGrade",
    );
    this.nextLevelTxt.text = LangManager.Instance.GetTranslation(
      "yishi.view.tips.TechnologyTip.nextEffect.text",
    );
    this.costTxt.text = LangManager.Instance.GetTranslation(
      "CasernRecruitWnd.costResourceTxt",
    );
    this._data = this.params;
    this.addEvent();
    this.setCenter();
    this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
  }

  OnShowWind() {
    super.OnShowWind();
    this.initData();
  }

  private addEvent() {
    this.BtnUpgrade.onClick(this, this.__upgradeClickHandler.bind(this));
    this.btnSpeedup.onClick(this, this.onSpeedUp.bind(this));
    NotificationManager.Instance.addEventListener(
      TechnologyItemEvent.UPDATA,
      this.__onDataUpdateHandler,
      this,
    );
    ResourceManager.Instance.waterCrystal.addEventListener(
      ResourceEvent.RESOURCE_UPDATE,
      this.onCrystalUpdate,
      this,
    );
  }

  private removeEvent() {
    this.btnSpeedup.offClick(this, this.onSpeedUp.bind(this));
    this.BtnUpgrade.offClick(this, this.__upgradeClickHandler.bind(this));
    NotificationManager.Instance.removeEventListener(
      TechnologyItemEvent.UPDATA,
      this.__onDataUpdateHandler,
      this,
    );
    ResourceManager.Instance.waterCrystal.removeEventListener(
      ResourceEvent.RESOURCE_UPDATE,
      this.onCrystalUpdate,
      this,
    );
  }

  private initData() {
    if (this._data) {
      this._temp = this.getTemp(this._data);
      if (!this._temp) return;
      this.skillIcon.icon = IconFactory.getTecIconByIcon(this._temp.Icon);
      if (this._temp.BuildingGrade) {
        this.LevelTxt.text = LangManager.Instance.GetTranslation(
          "fish.FishFrame.levelText",
          this._temp.BuildingGrade,
        );
      } else {
        this.LevelTxt.text = "";
      }
      this.nameTxt.text = this._temp.BuildingNameLang;
      this.descTxt1.text = this._temp.ActivityLang;
      this._nTemp = this.getNextGrade(this._temp);
      if (!this._nTemp) {
        this.descTxt2.text = LangManager.Instance.GetTranslation(
          "yishi.view.tips.TechnologyTip.topGrade",
        );
      } else {
        this.descTxt2.text = this._nTemp.ActivityLang;
        this.refreshPreBuild(this._nTemp);
        this.refreshResource(this._nTemp);
        this.reduceTxt.text = LangManager.Instance.GetTranslation(
          "yishi.view.tips.TechnologyTip.needTime.text",
        );
        var time: number = this.playerEffect.getBuildTimeAdditionValue(
          this._nTemp.UpgradeTime,
        );
        this.reduceTimeTxt.text = DateFormatter.getCountDate(time);
      }
    }
  }

  private refreshPreBuild(temp: t_s_buildingtemplateData) {
    this.conditionTxt.text = "";
    this.BtnUpgrade.y = this.btnSpeedup.y = 450;
    var preList: Array<t_s_buildingtemplateData> =
      BuildingManager.Instance.getPreBuildingList(temp);
    if (preList.length == 0) {
      return;
    }
    var bTemp: t_s_buildingtemplateData = preList[0];
    var bInfo: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(
      bTemp.SonType,
    );
    if (!bInfo || bInfo.templeteInfo.BuildingGrade < bTemp.BuildingGrade) {
      this.conditionTxt.text = LangManager.Instance.GetTranslation(
        "SeminaryUpWnd.condition",
        bTemp.BuildingNameLang,
        bTemp.BuildingGrade,
      );
      this.BtnUpgrade.y = this.btnSpeedup.y = 465;
    }
  }

  private refreshResource(nextTemp: t_s_buildingtemplateData) {
    if (!nextTemp) {
      this.costValueTxt.color = "#FFECC6";
      this.costValueTxt.text =
        ResourceManager.Instance.waterCrystal.count + "/0";
      return;
    }
    var dic: Map<string, number> = this._data.getNextNeedResource(nextTemp);
    if (dic) {
      let res: string = "GoldConsume";
      let needValue: number = dic[res];
      if (needValue > ResourceManager.Instance.waterCrystal.count) {
        this.costValueTxt.color = "#ff2e2e";
      } else {
        this.costValueTxt.color = "#FFECC6";
      }
      this.costValueTxt.text =
        ResourceManager.Instance.waterCrystal.count + "/" + needValue;
    }
  }

  private getNextGrade(
    temp: t_s_buildingtemplateData,
  ): t_s_buildingtemplateData {
    if (temp.NextGradeTemplateId != 0) {
      return TempleteManager.Instance.getBuildTemplateByID(
        temp.NextGradeTemplateId,
      );
    }
    return null;
  }

  private __onDataUpdateHandler(data: BuildInfo) {
    var build: BuildInfo = data;
    if (build && this._data && build.sonType == this._data.sonType) {
      this._data = build;
      this.initData();
    }
  }

  private onCrystalUpdate() {
    this.refreshResource(this._nTemp);
  }

  private getTemp(value: BuildInfo): t_s_buildingtemplateData {
    var t: t_s_buildingtemplateData;
    if (value.templateId != 0) {
      t = value.templeteInfo;
    } else {
      t = TempleteManager.Instance.getMinGradeBuildTemplate(value.sonType);
    }
    return t;
  }

  private get order(): BuildingOrderInfo {
    return BuildingManager.Instance.model.tecOrderList[0];
  }

  private onSpeedUp() {
    let back: Function;
    if (this.order.remainTime > 0) {
      back = BuildingManager.Instance.allCoolBack;
      var point: number = Math.ceil(this.order.remainTime / 600);
      if (VIPManager.Instance.model.vipCoolPrivilege) {
        back(true, this.order.orderId);
      } else {
        UIManager.Instance.ShowWind(EmWindow.VipCoolDownFrameWnd, {
          orderId: this.order.orderId,
          pointNum: point,
          backFun: back.bind(BuildingManager.Instance),
        });
      }
    } else {
      var str: string = LangManager.Instance.GetTranslation("seminary.cool");
      MessageTipManager.Instance.show(str);
    }
  }
  private __upgradeClickHandler() {
    if (BuildingManager.Instance.checkTecList(this._data)) {
      var isMaxLevel: boolean = false;
      if (this._data.buildingId != 0) {
        //升级科技
        isMaxLevel = BuildingManager.Instance.model.isMaxLevel(
          this._data.buildingId,
        );
        if (isMaxLevel) {
          var isMaxLevelTip: string = LangManager.Instance.GetTranslation(
            "buildings.seminary.view.SeminaryFrameBottomView.isMaxLevelTip",
          );
          MessageTipManager.Instance.show(isMaxLevelTip);
          return;
        }
        if (BuildingManager.Instance.isUpgradeAvaliable(this._data))
          BuildingManager.Instance.upgradeBuildingByBuildingInfo(this._data);
      } else {
        //激活科技
        BuildingManager.Instance.creatBuilding(
          this.getTemp(this._data).SonType,
        );
      }
    }
  }

  private get playerEffect(): PlayerEffectInfo {
    return PlayerManager.Instance.currentPlayerModel.playerEffect;
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }
}
