//@ts-expect-error: External dependencies
/*
 * @Description: 战斗编辑选择英灵列表头像Item
 */

import FUI_EditPetItem from "../../../../../../fui/SkillEdit/FUI_EditPetItem";
import Logger from "../../../../../core/logger/Logger";
import { UIFilter } from "../../../../../core/ui/UIFilter";
import { BaseItem } from "../../../../component/item/BaseItem";
import { PetEvent } from "../../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { TipsShowType } from "../../../../tips/ITipedDisplay";
import { PetData } from "../../../pet/data/PetData";

export class EditPetItem extends FUI_EditPetItem {
  // 吞噬宠物item展示类型
  public static PetRefining: number = 0;
  // 宠物列表类型
  public static PetList: number = 1;
  // 吞噬宠物选择列表类型
  public static PetSelList: number = 2;

  /** 0: 锁定 1: 开放无英灵 2: 有英灵*/
  public static ItemLock: number = 0;
  public static ItemFree: number = 1;
  public static ItemUsing: number = 2;

  // tipType: EmWindow = EmWindow.CommonTips;
  // tipData: any;
  public isGray: boolean;
  private _state: number = EditPetItem.ItemLock;
  private _type: number = EditPetItem.PetRefining;
  private _info: PetData;

  public get info(): PetData {
    return this._info;
  }

  public set info(value: PetData) {
    this._info = value;
    if (value) {
      // this.tipData = value

      // var url:string;
      // if (value.templateId != 0) {
      // 	url = IconFactory.getPetHeadBigIcon(value.templateId);
      // }
      // if (this.item.icon != url) {
      // 	// this.item.icon = "res/animation/icon/pet/104101/item.png";
      // 	this.item.icon = url;
      // }
      let gInfo = new GoodsInfo();
      gInfo.petData = value;
      let baseItem = this.item as BaseItem;
      baseItem.info = gInfo;

      this.imgEnterWar.visible = value.isEnterWar;
      this.txtPractice.visible = value.isPractice;

      this.txtLevel.text = value.grade.toString();
      this.imgStarBg.setScale(1, 1);
      this.showStar();
    } else {
      this.hideStar();
      (this.item as BaseItem).info = null;
      this.txtLevel.text = "";
      this.imgEnterWar.visible = false;
      this.txtPractice.visible = false;
      this.imgStarBg.setScale(0, 0);
      // this.tipData = null;
    }
  }

  onConstruct() {
    super.onConstruct();
    (this.item as BaseItem).showType = TipsShowType.onLongPress;
    // this.playerInfo.addEventListener(PetEvent.PET_UPDATE, this.__updatePetHandler, this);
  }

  // private __updatePetHandler(value: PetData) {
  //     Logger.xjy("[PetItem]__updatePetHandler", value)
  //     if (this._info && this._info.petId == value.petId) {
  //         this.info = value
  //     }
  // }

  private showStar() {
    this.list.visible = true;
    this.imgStarBg.visible = true;
    var mod: number = this._info.temQuality % 5;
    if (this._info.temQuality == 21) {
      //顶级英灵不显示;
      this.list.visible = false;
      this.imgStarBg.visible = false;
    } else if (mod == 0) {
      this.list.numItems = 5;
    } else {
      this.list.numItems = mod;
    }
  }

  private hideStar() {
    this.list.visible = false;
  }

  public get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public get state(): number {
    return this._state;
  }

  public set state(value: number) {
    this._state = value;
    this.cState.selectedIndex = value;
  }

  public get type(): number {
    return this._type;
  }

  public set type(value: number) {
    this._type = value;
    this.cSelectBgType.selectedIndex = value;
  }

  public gray() {
    this.filters = [UIFilter.gray];
    this.isGray = true;
  }

  public normal() {
    this.filters = [];
    this.isGray = false;
  }

  public dispose() {
    super.dispose();
    // if (this.playerInfo) {
    //     this.playerInfo.removeEventListener(PetEvent.PET_UPDATE, this.__updatePetHandler, this);
    // }
  }
}
