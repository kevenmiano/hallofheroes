import FUI_GoldMineInfoView from "../../../../../fui/OuterCity/FUI_GoldMineInfoView";
import Utils from "../../../../core/utils/Utils";
import {
  NotificationEvent,
  OuterCityEvent,
} from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import GoldMineInfoItem from "./GoldMineInfoItem";
import MineItem from "./MineItem";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { t_s_mapmineData } from "../../../config/t_s_mapmine";
import OutCityMineNode from "../../../map/outercity/OutCityMineNode";
import { WildLand } from "../../../map/data/WildLand";
import OutCityOneMineInfo from "../../../map/outercity/OutCityOneMineInfo";
import LangManager from "../../../../core/lang/LangManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import StringHelper from "../../../../core/utils/StringHelper";
/**
 * 选中某一个金矿左侧信息显示
 */
export default class GoldMineInfoView extends FUI_GoldMineInfoView {
  private _listData: Array<OutCityOneMineInfo> = [];
  private _len: number = 0;
  private _info: OutCityMineNode;
  private _wild: WildLand;
  public pageCapicity: number = 50; //初始展示数量
  public pageAddCapicity: number = 10; //每一页增加的邮件数量
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
    this.tab.on(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
    NotificationManager.Instance.addEventListener(
      NotificationEvent.OUTERCITY_SELECTE_MINEITEM,
      this.updateSelectedInfo,
      this,
    );
    this.backBtn.onClick(this, this.backBtnHandler);
    this.list.on(fgui.Events.PULL_UP_RELEASE, this, this.onPullUpToRefresh);
  }

  private removeEvent() {
    Utils.clearGListHandle(this.list);
    this.list.numItems = 0;
    this.tab.off(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.OUTERCITY_SELECTE_MINEITEM,
      this.updateSelectedInfo,
      this,
    );
    this.backBtn.offClick(this, this.backBtnHandler);
    this.list.off(fgui.Events.PULL_UP_RELEASE, this, this.onPullUpToRefresh);
  }

  private backBtnHandler() {
    NotificationManager.Instance.dispatchEvent(
      OuterCityEvent.OUTERCITY_SELECTE_CANCEL,
    );
  }

  public updateView(info: OutCityMineNode) {
    this._info = info;
    this.onTabChanged(null);
  }

  /**
   * 更新选中的金矿项信息
   * @param mineItem
   */
  private updateSelectedInfo(mineItem: MineItem) {
    if (mineItem) {
      this._info = mineItem.info;
      this.noResDescTxt.text = LangManager.Instance.GetTranslation(
        "GoldMineInfoView.noResDescTxt",
        this.outerCityModel.currentSelectMine.tempInfo.NameLang,
      );
      let mapMineData: t_s_mapmineData = this.outerCityModel.getNodeByNodeId(
        mineItem.info.nodeId,
      );
      if (mapMineData) {
        this.goldNameTxt.text = this.outerCityModel.getSonNodeNameTxt(
          mapMineData.Grade,
        );
        this.titleNameTxt.text = LangManager.Instance.GetTranslation(
          "GoldMineInfoView.titleTxt",
        );
        if (mineItem.info.nodeAllMineInfoDic.length == 0) {
          //这个子节点没有矿
          this.c1.selectedIndex = 1;
        } else {
          //子节点有矿
          this.c1.selectedIndex = 0;
          this.tab.selectedIndex = 0;
          this.onTabChanged(null);
        }
      }
    }
  }

  private renderListItem(index: number, item: GoldMineInfoItem) {
    if (!item || item.isDisposed) return;
    item.wild = this._wild;
    item.info = this._listData[index];
  }

  private onPullUpToRefresh() {
    Laya.timer.once(500, this, this.callRefresh);
  }

  private callRefresh() {
    let self = this;
    if (self.list.numItems >= this._listData.length) {
      self.list.numItems += 0;
    } else {
      let leftCount = this._listData.length - self.list.numItems;
      //后续每次增加10条
      self.list.numItems +=
        leftCount > this.pageAddCapicity ? this.pageAddCapicity : leftCount;
    }
    self.list.scrollPane.lockFooter(0);
  }

  private onTabChanged(e: Laya.Event) {
    if (this.tab.selectedIndex == 0) {
      //看空位置
      this._listData = this.outerCityModel.noOccpuySonNodeArr(this._info);
      this._len = this._listData.length;
      if (this._len > this.pageCapicity) {
        this.list.numItems = this.pageCapicity;
      } else {
        this.list.numItems = this._len;
      }
      this.leftCountTxt.text = this._len.toString();
      this.c1.selectedIndex = this._len > 0 ? 0 : 1;
    } else if (this.tab.selectedIndex == 1) {
      //已经被占领的
      this._listData = this.outerCityModel.hasOccpuySonNode(this._info);
      this._len = this._listData.length;
      this.list.numItems = this._len;
      this.c1.selectedIndex = this._len > 0 ? 0 : 1;
    }
    if (!StringHelper.isNullOrEmpty(this._wild.info.occupyLeagueName)) {
      //有人占领
      if (
        this._wild.info.occupyLeagueName ==
        PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaName
      ) {
        //自己公会的
        //玩家在各个矿点占领的矿总数有没有达到上限
        if (this.outerCityModel.checkPlayerOccpuyNumberIsMax()) {
          //玩家占领总数量达到上限
          this.c2.selectedIndex = 1;
          this.descTxt.text = LangManager.Instance.GetTranslation(
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
            this.descTxt.text = LangManager.Instance.GetTranslation(
              "GoldMineInfoView.descTxt2",
            );
          } else {
            this.c2.selectedIndex = 0;
          }
        }
      } else {
        this.c2.selectedIndex = 2;
        this.descTxt.text = LangManager.Instance.GetTranslation(
          "GoldMineInfoView.descTxt4",
        );
      }
    } else {
      //无人占领
      if (this.outerCityModel.checkPlayerOccpuyNumberIsMax()) {
        //玩家占领总数量达到上限
        this.c2.selectedIndex = 1;
        this.descTxt.text = LangManager.Instance.GetTranslation(
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
          this.descTxt.text = LangManager.Instance.GetTranslation(
            "GoldMineInfoView.descTxt2",
          );
        } else {
          this.c2.selectedIndex = 0;
        }
      }
    }
  }

  public refrehView(wild: WildLand) {
    this._wild = wild;
  }

  private get outerCityModel(): OuterCityModel {
    return OuterCityManager.Instance.model;
  }

  dispose() {
    this.removeEvent();
    Laya.timer.clear(this, this.callRefresh);
    super.dispose();
  }
}
