/**
 * @author:jeremy.xu
 * @data: 2020-11-20 18:00
 * @description  士兵角色视图
 **/

import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { eFilterFrameText } from "../../../component/FilterFrameText";
import { MovieClip } from "../../../component/MovieClip";
import { FaceType, InheritRoleType } from "../../../constant/BattleDefine";
import { PathManager } from "../../../manager/PathManager";
import { GameLoadNeedData } from "../../data/GameLoadNeedData";
import { PawnRoleInfo } from "../../data/objects/PawnRoleInfo";
import { RoleUnit } from "../RoleUnit";
import { BaseRoleView } from "./BaseRoleView";

export class PawnRoleView extends BaseRoleView {
  public inheritType: InheritRoleType = InheritRoleType.Pawn;

  public get bodyMc(): MovieClip {
    return this._rolePart.content;
  }

  //BaseRoleInfo
  public constructor(info) {
    super(info);
    // // 测试
    // var img: Laya.Sprite = new Laya.Sprite();
    // img.loadImage("res/game/common/blank2.png");
    // img.pos(0, 0)
    // this.addChild(img)
  }

  private __onLoadComplete(target: RoleUnit) {
    if (!this._info) {
      return;
    }
    let mc = this._rolePart.content;
    this._info.actionMovieClip = mc;
    this._loadingState = PawnRoleView.LOAD_COMPLETE_STATE;
    this._info.isLoadComplete = true;
    this.removeLoadingView();

    let mcWidth = mc.getBounds().width;
    this.initShadeScale(mcWidth);
    this.onLoadComplete();
  }

  public load() {
    super.load();
    let gameLoadData: GameLoadNeedData = new GameLoadNeedData(
      PathManager.solveRolePath(this._info.effectId),
    );
    this._rolePart = new RoleUnit();
    this._rolePart.completeFunc = this.__onLoadComplete.bind(this);
    this._rolePart.data = gameLoadData;
    if (this._movieContainer)
      this._movieContainer.addChild(this._info.actionMovie);
    if (this._movieContainer)
      this._movieContainer.scaleX =
        this._info.face == FaceType.RIGHT_TEAM ? -1 : 1;
  }

  protected delayInitView() {
    if (this._disposed) {
      return;
    }
    super.delayInitView();

    if (this.roleInfoView && this._info.tempInfo) {
      // let nameStr = LangManager.Instance.GetTranslation("public.level.name", this._info.tempInfo.PawnNameLang,  this._info.tempInfo.Level);
      let nameStr = this._info.tempInfo.PawnNameLang;
      this.setHeroNameTxtValue(nameStr);
    }
  }

  public updateShadowPos() {
    if (this._disposed) {
      return;
    }
    if (!this._info.actionMovie.movie || !this._shadow) {
      return;
    }
    let posMc: Laya.Point = this._info.actionMovie.movie.pos_leg;
    if (posMc) {
      this._shadow.x = posMc.x;
      this._shadow.y = posMc.y;
      this._shadow.x = 0;
      this._shadow.y = 0;
    }
  }

  private get pawnInfo(): PawnRoleInfo {
    return this._info as PawnRoleInfo;
  }

  public dispose() {
    super.dispose();
  }
}
