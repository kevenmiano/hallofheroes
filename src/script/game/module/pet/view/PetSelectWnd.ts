import BaseWindow from "../../../../core/ui/Base/BaseWindow";

import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";

import Utils from "../../../../core/utils/Utils";
import { PetData } from "../data/PetData";
import { PetSelectItem } from "./petexchange/PetSelectItem";
import { PetSelectItemTitle } from "./petexchange/PetSelectItemTitle";
import LangManager from "../../../../core/lang/LangManager";

/**
 * 英灵选择
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年7月26日10:02:52
 */
export class PetSelectWnd extends BaseWindow {
  public frame: fgui.GLabel;
  /**支持转换英灵集合 */
  public contentList: fgui.GList;
  /**不支持转换英灵集合 */
  public discontentList: fgui.GList;

  /**来源英灵 */
  private _sourcePet: PetData;
  /**目标英灵 */
  private _targetPet: PetData;

  /**玩家英灵集合 */
  private _petList: PetData[] = [];
  /**转换英灵集合 */
  private _petExchangeList: PetData[] = [];
  /**支持转换英灵集合 */
  private _petCanExchangeList: PetData[] = [];
  /**不支持装换英灵集合 */
  private _petCannotExchangeList: PetData[] = [];

  /**初始化界面 */
  public OnInitWind(): void {
    super.OnInitWind();
    this.setCenter();
    this.initView();
    this.initEvent();
    this.refreshPetList();
  }

  /**显示界面 */
  public OnShowWind() {
    super.OnShowWind();
  }

  /**释放界面 */
  dispose(dispose?: boolean) {
    super.dispose(dispose);
    this.removeEvent();

    this._sourcePet = null;
    this._targetPet = null;

    this._petList = [];
    this._petCanExchangeList = [];
    this._petCannotExchangeList = [];
  }

  /**初始化视图 */
  private initView() {
    this.txtFrameTitle.text = LangManager.Instance.GetTranslation(
      "pet.exchange.select",
    );
    this.frame.getChild("helpBtn").visible = false;
    if (this.params) {
      this._sourcePet = this.params.frameData.sourcePet;
      this._targetPet = this.params.frameData.targetPet;
    }
  }

  /**初始化事件 */
  private initEvent() {
    this["list"].itemRenderer = Laya.Handler.create(
      this,
      this.onRenderPetItem,
      null,
      false,
    );
    this["list"].itemProvider = Laya.Handler.create(
      this,
      this.onRenderPetItemResource,
      null,
      false,
    );
  }

  /**移除事件 */
  private removeEvent() {
    this["list"] &&
      this["list"].itemRenderer &&
      this["list"].itemRenderer.recover();
    this["list"] &&
      this["list"].itemProvider &&
      this["list"].itemProvider.recover();
  }

  /**刷新英灵集合 */
  private refreshPetList(): void {
    let sourcePetId = this._sourcePet.petId; // 英灵标识
    let sourcePetType = this._sourcePet.template.PetType - 101; // 英灵属性
    let sourcePetStage = this._sourcePet.template.Property2; // 英灵阶级

    let normal = 0 <= sourcePetType && sourcePetType <= 3;

    this._petExchangeList = [];
    this._petCanExchangeList = [];
    this._petCannotExchangeList = [];
    this._petList = PlayerManager.Instance.currentPlayerModel.playerInfo
      .petList as PetData[];
    for (let index = 0; index < this._petList.length; index++) {
      const petInfo = this._petList[index];
      petInfo.remind = "";
      petInfo.ismind = false;
      if (petInfo.petId === sourcePetId) continue;
      if (petInfo.template.Property2 != sourcePetStage) {
        petInfo.ismind = true;
        petInfo.remind = LangManager.Instance.GetTranslation(
          "pet.exchange.levelCondition.lack",
        );
        this._petCannotExchangeList.push(petInfo);
      } else {
        this._petCanExchangeList.push(petInfo);
      }
    }
    this._petCanExchangeList = ArrayUtils.sortOn(
      this._petCanExchangeList,
      ["fightPower"],
      [ArrayConstant.NUMERIC | ArrayConstant.DESCENDING],
    );
    this._petCannotExchangeList = ArrayUtils.sortOn(
      this._petCannotExchangeList,
      ["fightPower"],
      [ArrayConstant.NUMERIC | ArrayConstant.DESCENDING],
    );

    if (this._petCanExchangeList.length > 0) {
      let canExchangeTitle = new PetData();
      canExchangeTitle.title = LangManager.Instance.GetTranslation(
        "pet.exchange.meet.condition",
      );
      this._petExchangeList.push(canExchangeTitle);
      this._petExchangeList = this._petExchangeList.concat(
        this._petCanExchangeList,
      );
    }

    if (this._petCannotExchangeList.length > 0) {
      let cannotExchangeTitle = new PetData();
      cannotExchangeTitle.title = LangManager.Instance.GetTranslation(
        "pet.exchange.notMeet.condition",
      );
      this._petExchangeList.push(cannotExchangeTitle);
      this._petExchangeList = this._petExchangeList.concat(
        this._petCannotExchangeList,
      );
    }

    this["list"].numItems = this._petExchangeList.length;
  }

  /**渲染列表数据项 */
  private onRenderPetItem(
    index: number,
    item: PetSelectItem | PetSelectItemTitle,
  ): void {
    if (item instanceof PetSelectItemTitle) {
      item.title.text = this._petExchangeList[index].title;
    } else if (item instanceof PetSelectItem) {
      item.info = this._petExchangeList[index];
      item.getController("petSelect").selectedIndex = 0;
      if (this._targetPet && this._targetPet.petId === item.info.petId)
        item.getController("petSelect").selectedIndex = 1;
      if (item.info.remind || item.info.ismind) {
        item["btn_discontent"].enabled = false;
        item["btn_discontent"].text = item.info.remind;
        Utils.strokeColor(item["btn_discontent"], false);
        item.getController("petSelect").selectedIndex = 2;
      }
    }
  }

  /**渲染列表资源项 */
  private onRenderPetItemResource(index: number): string {
    let petData = this._petExchangeList[index];
    if (petData.title || !petData.template) {
      return PetSelectItemTitle.URL;
    }
    return PetSelectItem.URL;
  }
}
