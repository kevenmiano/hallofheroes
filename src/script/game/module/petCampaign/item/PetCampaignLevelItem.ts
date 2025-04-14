//@ts-expect-error: External dependencies
import FUI_PetCampaignLevelItem from "../../../../../fui/PetCampaign/FUI_PetCampaignLevelItem";
import LangManager from "../../../../core/lang/LangManager";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { t_s_uiplaylevelData } from "../../../config/t_s_uiplaylevel";
import { PetCampaignManager } from "../../../manager/PetCampaignManager";
import { PetCampaignEvent } from "../enum/PetCampaignEnum";
import PetCampaignModel from "../PetCampaignModel";

export default class PetCampaignLevelItem extends FUI_PetCampaignLevelItem {
  private _vdata: t_s_uiplaylevelData;
  private _index: number;
  public set vdata(value: t_s_uiplaylevelData) {
    this._vdata = value;
    if (this._vdata) {
      this.txtLevel.text = LangManager.Instance.GetTranslation(
        "petCampaign.Level",
        value.UiLevelSort,
      );
      if (this.petCampaignModel) {
        if (
          this.petCampaignModel.levelSort ==
          PetCampaignManager.Instance.model.getCurLevelList().length
        ) {
          if (this.petCampaignModel.levelSort == this._index + 1) {
            //设置默认选择项目
            this.setSelect(true);
          } else {
            this.setSelect(false);
          }
          this.setLock(false);
        } else {
          if (this.petCampaignModel.levelSort == this._index) {
            //设置默认选择项目
            this.setSelect(true);
          } else {
            this.setSelect(false);
          }
          if (this.petCampaignModel.levelSort < this._index) {
            this.setLock(true);
          } else {
            this.setLock(false);
          }
        }
      }
    } else {
      this.txtLevel.text = "";
      this.setSelect(false);
      this.setLock(false);
    }
    PetCampaignManager.Instance.model.addEventListener(
      PetCampaignEvent.PET_CAMPAIGN_TREE_SELECT,
      this.onSelect,
      this,
    );
  }

  public get petCampaignModel(): PetCampaignModel {
    return PetCampaignManager.Instance.model;
  }

  onSelect(index: number) {
    this.setSelect(index == this._index);
  }

  public setIndex(index: number) {
    this._index = index;
  }

  public get index(): number {
    return this._index;
  }

  private setSelect(select: boolean) {
    this.isSelect.selectedIndex = select ? 1 : 0;
    if (select) {
      PetCampaignManager.Instance.setTreeSelectIndex(this._index);
    }
  }

  private setLock(lock: boolean) {
    this.isLock.selectedIndex = lock ? 1 : 0;
  }
}
