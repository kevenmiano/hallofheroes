/**
 * @author:jeremy.xu
 * @data: 2020-11-20 18:00
 * @description 宠物视图
 **/

import { eFilterFrameText } from "../../../component/FilterFrameText";
import { MovieClip } from "../../../component/MovieClip";
import {
  BattleType,
  FaceType,
  InheritRoleType,
} from "../../../constant/BattleDefine";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { PetAvatarView } from "../../../map/avatar/view/PetAvatarView";
import FUIHelper from "../../../utils/FUIHelper";
import { BattleManager } from "../../BattleManager";
import { BattleModel } from "../../BattleModel";
import { PetRoleInfo } from "../../data/objects/PetRoleInfo";
import { RoleUnit } from "../RoleUnit";
import { HeroLoadDataFactory } from "../../utils/HeroLoadDataFactory";
import { BaseRoleView } from "./BaseRoleView";
import { PetData } from "../../../module/pet/data/PetData";

export class PetRoleView extends BaseRoleView {
  public inheritType: InheritRoleType = InheritRoleType.Pet;

  private _battleModel: BattleModel;
  private _starCom: fgui.GComponent;

  public get bodyMc(): MovieClip {
    return this._rolePart.content;
  }
  public get petInfo(): PetRoleInfo {
    return this._info;
  }

  public constructor(info: any) {
    super(info);
    this._battleModel = BattleManager.Instance.battleModel;
  }

  // override
  public load() {
    if (!this.petInfo.template) return;
    if (!this.petInfo.heroRoleInfo) return;
    this.petInfo.heroRoleInfo.heroInfo.petTemplateId = this.petInfo.templateId;

    this._rolePart = new RoleUnit();
    this._rolePart.completeFunc = this.__onLoadComplete.bind(this);
    this._rolePart.data = HeroLoadDataFactory.create(
      this.petInfo.heroRoleInfo.heroInfo,
      HeroLoadDataFactory.PART_PET_FOLLOW,
    );

    if (this._movieContainer)
      this._movieContainer.addChild(this._info.actionMovie);
    this.y = this.info.point.y - 80;
    if (this._info.face == FaceType.RIGHT_TEAM) {
      if (this._movieContainer) this._movieContainer.scaleX = -1;
      this.x = 60 + this.info.point.x;
    } else {
      if (this._movieContainer) this._movieContainer.scaleX = 1;
      this.x = -60 + this.info.point.x;
    }
  }

  private __onLoadComplete(target: RoleUnit) {
    if (!this._battleModel) return;
    if (this._info) {
      this._info.actionMovieClip = target.content;
      this._info.isLoadComplete = true;
      this.removeLoadingView();
      this.setNamePos();
      this.setShadePos();
    }
  }

  // override
  protected delayInitView() {
    if (this._disposed) {
      return;
    }
    super.delayInitView();

    this._heroNameTxt.fontSize = 16;
    this._roleInfoUI.visible = true;
    this._roleInfoUI.active = true;
    if (this.petInfo.petName != null) {
      this.setHeroNameTxtValue(this.petInfo.petName);
      this.showStar(this.petInfo.temQuality);
      if (this.petInfo.quality > 0) {
        this._heroNameTxt.setFrame(
          this.petInfo.quality,
          eFilterFrameText.PetQuality,
        );
      }
    } else {
      this.setHeroNameTxtValue("");
    }
    this.setShadePos();
  }

  protected refreshHeroText() {}

  private setNamePos() {
    this._heroNameTxt.y = -100;
    let mc = this._rolePart.content;
    if (mc && mc.pos_leg && mc.pos_head) {
      let offsetY = mc.pos_leg.y - mc.pos_head.y;
      this._heroNameTxt.y = -offsetY - 10;
    }

    if (this._starCom) {
      this._starCom.y = this._heroNameTxt.y - 12;
    }
  }

  private setShadePos() {
    this._shadow.visible = false;
    this._shadow.active = false;

    // if (!this.petInfo) return;
    // if (!this.petInfo.template) return;
    // if (this.petInfo.template.Property1 == 0) return;
    // let battleModel: BattleModel = BattleManager.Instance.battleModel;
    // if (battleModel.battleType != BattleType.PET_PK && this.petInfo.template.Property1 == 0) {
    //     this._shadow.visible = false;
    // }
    // let mc: MovieClip = this.petInfo.actionMovieClip;
    // if (mc) {
    //     let rect = mc.getBounds();
    //     let a = (this.petInfo.side == this._battleModel.selfSide ? 1 : -1);
    //     if (this._shadow) this._shadow.x = a * (rect.x + rect.width / 2);
    //     if (this._roleInfoUI) this._roleInfoUI.x = a * (rect.x + rect.width / 2);
    // }
  }

  private showStar(temQuality: number) {
    if (!this._starCom) {
      this._starCom = FUIHelper.createFUIInstance(
        EmPackName.BaseCommon,
        PetAvatarView.STAR_QUALITY_RES,
      );
      this.addChild(this._starCom.displayObject);
      this._starCom.setScale(0.5, 0.5);
    }

    if (temQuality > 0) {
      let mod: number;
      if (temQuality > PetData.MAX_TEM_QUALITY - 1) {
        mod = 0;
      } else if (temQuality % 5 == 0) {
        mod = 5;
      } else {
        mod = temQuality % 5;
      }
      for (let j: number = 0; j < 5; j++) {
        this._starCom.getChild("star" + (j + 1)).visible = j < mod;
        this._starCom.getChild("star" + (j + 1)).displayObject.active = j < mod;
      }
      this._starCom.x = 0;
      this._starCom.y = this._heroNameTxt.y - 12;
    }
  }

  // override
  public setRoleInfoViewVisible(value: boolean) {
    super.setRoleInfoViewVisible(value);
    if (this._battleModel.battleType != BattleType.PET_PK) {
      this.setBloodStripVisible(false, true);
    }
  }

  // override
  public updateShadowPos() {
    super.updateShadowPos();
    if (!this.info) return;
    if (!this._battleModel) return;
    if (this._battleModel.isOver) return;
    if (!this.petInfo.template) return;
    if (this.petInfo.heroRoleInfo && this.petInfo.heroRoleInfo.isPetState) {
      this.petInfo.visible = false;
    }

    if (this.petInfo.template.Property1 == 0) {
      this.y = this.info.point.y - 80;
    } else {
      this.y = this.info.point.y;
    }

    if (this._info.face == FaceType.RIGHT_TEAM) {
      if (this._movieContainer) this._movieContainer.scaleX = -1;
      if (this.petInfo.template.Property1 == 0) {
        this.x = 60 + this.info.point.x;
      } else {
        this.x = 120 + this.info.point.x;
      }
    } else {
      if (this._movieContainer) this._movieContainer.scaleX = 1;
      if (this.petInfo.template.Property1 == 0) {
        this.x = -60 + this.info.point.x;
      } else {
        this.x = -120 + this.info.point.x;
      }
    }
  }

  public dispose() {
    super.dispose();
  }
}
