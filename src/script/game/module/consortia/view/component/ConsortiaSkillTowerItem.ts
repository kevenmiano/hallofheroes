import FUI_ConsortiaSkillTowerItem from "../../../../../../fui/Consortia/FUI_ConsortiaSkillTowerItem";
import { ConsortiaTempleteInfo } from "../../data/ConsortiaTempleteInfo";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { ConsortiaInfo } from "../../data/ConsortiaInfo";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import { ConsortiaUpgradeType } from "../../../../constant/ConsortiaUpgradeType";
import { t_s_consortialevelData } from "../../../../config/t_s_consortialevel";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import LangManager from "../../../../../core/lang/LangManager";
import { ConsortiaModel } from "../../model/ConsortiaModel";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/7/22 21:39
 * @ver 1.0
 *
 */

export class ConsortiaSkillTowerItem extends FUI_ConsortiaSkillTowerItem {
  private _info: ConsortiaTempleteInfo;
  private _consortiaControler: ConsortiaControler;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();

    this.initData();
    this.initEvent();
  }

  private initData() {
    this._consortiaControler = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
  }

  private initEvent() {}

  get info(): ConsortiaTempleteInfo {
    return this._info;
  }

  set info(value: ConsortiaTempleteInfo) {
    this._info = value;

    if (value) {
      let _temp = this.getTemp();
      if (_temp) {
        this.skillIcon.icon = IconFactory.getTecIconByIcon(_temp.Icon);
        this.txt_name.text = _temp.LevelNameLang;
        if (
          this._info.type >= ConsortiaModel.HIGH_SKILL_TYPE_MIN &&
          this._info.type <= ConsortiaModel.HIGH_SKILL_TYPE_MAX
        ) {
          let studyLevel: number =
            PlayerManager.Instance.currentPlayerModel.getConsortiaHighSkillLevel(
              this._info.type,
            );
          let consortiaLevel: number =
            this.consortiaInfo.getHighLevelByUpgradeType(this._info.type);
          this.txt_level.text = LangManager.Instance.GetTranslation(
            "public.level3",
            `${studyLevel}/${consortiaLevel}`,
          );
        } else {
          let studyLevel: number =
            PlayerManager.Instance.currentPlayerModel.getConsortiaSkillLevel(
              this._info.type,
            );
          let consortiaLevel: number = this.consortiaInfo.getLevelByUpgradeType(
            this._info.type,
          );
          this.txt_level.text = LangManager.Instance.GetTranslation(
            "public.level3",
            `${studyLevel}/${consortiaLevel}`,
          );
        }
      }
    }
  }

  private getTemp(): t_s_consortialevelData {
    if (
      this._info.type >= ConsortiaModel.HIGH_SKILL_TYPE_MIN &&
      this._info.type <= ConsortiaModel.HIGH_SKILL_TYPE_MAX
    ) {
      let studyLevel: number =
        PlayerManager.Instance.currentPlayerModel.getConsortiaHighSkillLevel(
          this._info.type,
        );
      let consortiaLevel: number = this.consortiaInfo.getHighLevelByUpgradeType(
        this._info.type,
      );
      let level: number =
        studyLevel < consortiaLevel ? studyLevel : consortiaLevel;
      if (level == 0) {
        return TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(
          this._info.type,
          level + 1,
        );
      } else {
        return TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(
          this._info.type,
          level,
        );
      }
    } else {
      let studyLevel: number =
        PlayerManager.Instance.currentPlayerModel.getConsortiaSkillLevel(
          this._info.type,
        );
      let consortiaLevel: number = this.consortiaInfo.getLevelByUpgradeType(
        this._info.type,
      );
      let level: number =
        studyLevel < consortiaLevel ? studyLevel : consortiaLevel;
      if (level == ConsortiaUpgradeType.MAX_LEVEL) {
        level -= 1;
      }
      return TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(
        this._info.type,
        level + 1,
      );
    }
  }

  private get consortiaInfo(): ConsortiaInfo {
    return this._consortiaControler.model.consortiaInfo;
  }

  dispose() {
    this._info = null;
    this._consortiaControler = null;
    super.dispose();
  }
}
