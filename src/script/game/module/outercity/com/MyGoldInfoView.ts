//@ts-expect-error: External dependencies
import FUI_MyGoldInfoView from "../../../../../fui/OuterCity/FUI_MyGoldInfoView";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import StringHelper from "../../../../core/utils/StringHelper";
import Utils from "../../../../core/utils/Utils";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { WildLand } from "../../../map/data/WildLand";
import OutCityOneMineInfo from "../../../map/outercity/OutCityOneMineInfo";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
import MyGoldInfoItem from "./MyGoldInfoItem";
/**我的金矿*/
export default class MyGoldInfoView extends FUI_MyGoldInfoView {
  private _myGoldMineDataList: Array<OutCityOneMineInfo> = [];
  private _wild: WildLand;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this.initEvent();
  }

  private initEvent() {
    Utils.setDrawCallOptimize(this.list);
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
  }

  private removeEvent() {
    Utils.clearGListHandle(this.list);
  }

  private renderListItem(index: number, item: MyGoldInfoItem) {
    if (!item || item.isDisposed) return;
    item.position = this._wild.posX + "," + this._wild.posY;
    item.info = this._myGoldMineDataList[index];
  }

  public refreshView(node: WildLand) {
    this._wild = node;
    this.titleNameTxt.text = LangManager.Instance.GetTranslation(
      "MyGoldInfoView.titleNameTxt",
      this._wild.tempInfo.NameLang,
    );
    this.descTxt.text = LangManager.Instance.GetTranslation(
      "MyGoldInfoView.descTxt",
      this._wild.tempInfo.NameLang,
    );
    if (this.outerCityModel.occupyCount(this._wild) == 0) {
      //玩家在这个节点没有任何的占领金矿
      this.c1.selectedIndex = 0;
      this.countTxt.text = "0";
      this.list.numItems = 0;
    } else {
      this.c1.selectedIndex = 1;
      this._myGoldMineDataList = this._wild.selfOccpuyArr;
      this.list.numItems =
        this._myGoldMineDataList && this._myGoldMineDataList.length;
      this.countTxt.text =
        this.list.numItems + "/" + this._wild.tempInfo.Property1;
    }
    if (!StringHelper.isNullOrEmpty(this._wild.info.occupyLeagueName)) {
      //有人占领
      if (
        this._wild.info.occupyLeagueName ==
        PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaName
      ) {
        //自己公会
        //玩家在各个矿点占领的矿总数有没有达到上限
        if (this.outerCityModel.checkPlayerOccpuyNumberIsMax()) {
          //玩家占领总数量达到上限
          this.c2.selectedIndex = 1;
          this.descTxt2.text = LangManager.Instance.GetTranslation(
            "GoldMineInfoView.descTxt1",
          );
        } else {
          //总数量没有达到上限
          if (
            this.outerCityModel.occupyCount(this._wild) >=
            this._wild.tempInfo.Property1
          ) {
            //在这个矿点达到上限了不能占领
            this.c2.selectedIndex = 1;
            this.descTxt2.text = LangManager.Instance.GetTranslation(
              "GoldMineInfoView.descTxt2",
            );
          } else {
            this.c2.selectedIndex = 0;
          }
        }
      } else {
        this.c2.selectedIndex = 1;
        this.descTxt2.text = LangManager.Instance.GetTranslation(
          "GoldMineInfoView.descTxt4",
        );
      }
    } else {
      if (this.outerCityModel.checkPlayerOccpuyNumberIsMax()) {
        //玩家占领总数量达到上限
        this.c2.selectedIndex = 1;
        this.descTxt2.text = LangManager.Instance.GetTranslation(
          "GoldMineInfoView.descTxt1",
        );
      } else {
        //总数量没有达到上限
        if (
          this.outerCityModel.occupyCount(this._wild) >=
          this._wild.tempInfo.Property1
        ) {
          //在这个矿点达到上限了不能占领
          this.c2.selectedIndex = 1;
          this.descTxt2.text = LangManager.Instance.GetTranslation(
            "GoldMineInfoView.descTxt2",
          );
        } else {
          this.c2.selectedIndex = 0;
        }
      }
    }
  }

  private get outerCityModel(): OuterCityModel {
    return OuterCityManager.Instance.model;
  }
  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
