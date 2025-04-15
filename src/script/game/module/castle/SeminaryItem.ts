import FUI_SeminaryItem from "../../../../fui/Castle/FUI_SeminaryItem";
import LangManager from "../../../core/lang/LangManager";
import { IconFactory } from "../../../core/utils/IconFactory";
import { TempleteManager } from "../../manager/TempleteManager";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { TechnologyItemEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import { BaseIcon } from "../../component/BaseIcon";
import { t_s_buildingtemplateData } from "../../config/t_s_buildingtemplate";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { PlayerEffectInfo } from "../../datas/playerinfo/PlayerEffectInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import BuildingManager from "../../map/castle/BuildingManager";
import { VipPrivilegeType } from "../../constant/VipPrivilegeType";
import { VIPManager } from "../../manager/VIPManager";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import UIButton from "../../../core/ui/UIButton";
import BaseTipItem from "@/script/game/component/item/BaseTipItem";
export default class SeminaryItem extends FUI_SeminaryItem {
  public newIcon: BaseIcon;

  private _vdata: BuildInfo;
  private _isShowName: boolean;
  private _isShowNewIcon: boolean;
  private _temp: t_s_buildingtemplateData;
  private _nTemp: t_s_buildingtemplateData;

  public tipItem: BaseTipItem;

  private btnUpgrade: UIButton;

  onConstruct() {
    super.onConstruct();

    this.btnUpgrade = new UIButton(this.Btn_upgrade);
    this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    this.addEvent();
  }

  private addEvent() {
    this.btnUpgrade.onClick(this, this.onUpgrade);
    NotificationManager.Instance.addEventListener(
      TechnologyItemEvent.UPDATA,
      this.__onDataUpdateHandler,
      this,
    );
  }

  private removeEvent() {
    this.btnUpgrade.offClick(this, this.onUpgrade);
    NotificationManager.Instance.removeEventListener(
      TechnologyItemEvent.UPDATA,
      this.__onDataUpdateHandler,
      this,
    );
  }

  protected __onDataUpdateHandler(data: BuildInfo) {
    var build: BuildInfo = data;
    if (build && this._vdata && build.sonType == this._vdata.sonType) {
      this._vdata = build;
      this.refreshView();
    }
  }

  private onUpgrade() {
    if (BuildingManager.Instance.checkTecList(this._vdata)) {
      var isMaxLevel: boolean = false;
      if (this._vdata.buildingId != 0) {
        //升级科技
        isMaxLevel = BuildingManager.Instance.model.isMaxLevel(
          this._vdata.buildingId,
        );
        if (isMaxLevel) {
          var isMaxLevelTip: string = LangManager.Instance.GetTranslation(
            "buildings.seminary.view.SeminaryFrameBottomView.isMaxLevelTip",
          );
          MessageTipManager.Instance.show(isMaxLevelTip);
          return;
        }
        if (BuildingManager.Instance.isUpgradeAvaliable(this._vdata))
          BuildingManager.Instance.upgradeBuildingByBuildingInfo(this._vdata);
      } else {
        //激活科技
        BuildingManager.Instance.creatBuilding(
          this.getTemp(this._vdata).SonType,
        );
      }
    }
  }

  public get vdata(): BuildInfo {
    return this._vdata;
  }

  public set vdata(value: BuildInfo) {
    this._vdata = value;
    this.refreshView();
  }

  private refreshView() {
    if (!this._vdata) {
      this.newIcon.icon = null;
      this.isShowName = false;
      this.isShowNewIcon = false;
      return;
    }
    this.isShowName = true;
    this._temp = this.getTemp(this._vdata);
    this.descTxt1.text = this._temp.ActivityLang;

    this._nTemp = this.getNextTemp(this._temp);
    this.newIcon.icon = IconFactory.getTecIconByIcon(this._temp.Icon);
    if (this._vdata.templeteInfo.BuildingGrade == 0) {
      this.isShowNewIcon = true;
      this.Img_new.visible = this.isShowNewIcon;
    } else {
      this.Img_new.visible = false;
    }
    if (this.isShowName) {
      if (this._temp.BuildingGrade) {
        this.Leveltxt.text = LangManager.Instance.GetTranslation(
          "fish.FishFrame.levelText",
          this._temp.BuildingGrade,
        );
      } else {
        this.Leveltxt.text = "";
      }
      this.nameTxt.text = this._temp.BuildingNameLang;
    }
    if (!this._nTemp) {
      this.descTxt2.text = LangManager.Instance.GetTranslation(
        "yishi.view.tips.TechnologyTip.topGrade",
      );
      this.isMax.selectedIndex = 1;
    } else {
      this.descTxt2.text = this._nTemp.ActivityLang;
      let time: number = this.playerEffect.getBuildTimeAdditionValue(
        this._nTemp.UpgradeTime,
      );
      let grade = VIPManager.Instance.model.vipInfo.VipGrade;
      let param1 = VIPManager.Instance.model.getPrivilegeParam1ByGrade(
        VipPrivilegeType.TECHNOLOGY_COOLDOWN,
        grade,
      );
      let value = time - param1 > 0 ? time - param1 : 0;
      this.reduceTimeTxt.text = DateFormatter.getCountDate(value);
      this.isMax.selectedIndex = 0;
      this.refreshResource(this._nTemp);
    }
  }

  public set isShowName(b: boolean) {
    this.Leveltxt.visible = b;
    this.nameTxt.visible = b;
    this.btnUpgrade.visible = b;
    this._isShowName = b;
  }

  public get isShowName(): boolean {
    return this._isShowName;
  }

  public set isShowNewIcon(value: boolean) {
    this._isShowNewIcon = value;
    this.Img_new.visible = this._isShowNewIcon;
  }

  public get isShowNewIcon(): boolean {
    return this._isShowNewIcon;
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

  private getNextTemp(
    temp: t_s_buildingtemplateData,
  ): t_s_buildingtemplateData {
    if (temp.NextGradeTemplateId != 0) {
      return TempleteManager.Instance.getBuildTemplateByID(
        temp.NextGradeTemplateId,
      );
    }
    return null;
  }

  private refreshResource(nextTemp: t_s_buildingtemplateData) {
    var dic: Map<string, number> = this._vdata.getNextNeedResource(nextTemp);
    if (dic) {
      let res: string = "GoldConsume";
      let needValue: number = dic[res];
      if (needValue > ResourceManager.Instance.waterCrystal.count) {
        this.costValueTxt.color = "#ff2e2e";
      } else {
        this.costValueTxt.color = "#FFECC6";
      }
      this.costValueTxt.text = needValue.toString();
    }
  }

  private get playerEffect(): PlayerEffectInfo {
    return PlayerManager.Instance.currentPlayerModel.playerEffect;
  }

  public dispose() {
    this.removeEvent();
    ObjectUtils.disposeAllChildren(this);
    super.dispose();
  }
}
