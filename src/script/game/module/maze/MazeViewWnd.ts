import Resolution from "../../../core/comps/Resolution";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import LangManager from "../../../core/lang/LangManager";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { PlayerManager } from "../../manager/PlayerManager";
import { TowerInfo } from "../../datas/playerinfo/TowerInfo";
import { CampaignManager } from "../../manager/CampaignManager";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import StringHelper from "../../../core/utils/StringHelper";
import { UIAlignType } from "../../constant/UIAlignType";
import BaseFguiCom from "../../../core/ui/Base/BaseFguiCom";

export default class MazeViewWnd extends BaseWindow {
  protected resizeContent = true;

  private isMoving: boolean = false;
  private Btn_Fall: fgui.GButton;
  private Btn_Shop: fgui.GButton;
  private inOutBtn: fgui.GButton;
  public comMazeViewInfo: fgui.GComponent;
  public CampaignNameTxt: fgui.GTextField;
  public CurrentLayerDescTxt: fgui.GTextField;
  public TotalGpDescTxt: fgui.GTextField;
  public CurrentLayerValueTxt: fgui.GTextField;
  public TotalGpValueTxt: fgui.GTextField;

  public OnInitWind() {
    BaseFguiCom.autoGenerate(this.comMazeViewInfo, this);
    Resolution.addWidget(this.comMazeViewInfo.displayObject, UIAlignType.RIGHT);

    if (WorldBossHelper.checkMaze(CampaignManager.Instance.mapModel.mapId)) {
      this.CampaignNameTxt.text = LangManager.Instance.GetTranslation(
        "MazeFrameWnd.BtnGroupName0",
      );
    } else {
      this.CampaignNameTxt.text = LangManager.Instance.GetTranslation(
        "MazeFrameWnd.BtnGroupName1",
      );
    }
    this.CurrentLayerDescTxt.text = LangManager.Instance.GetTranslation(
      "map.campaign.view.ui.MazeView.current",
    );
    this.TotalGpDescTxt.text = LangManager.Instance.GetTranslation(
      "map.campaign.view.ui.MazeView.totalExp",
    );
    this.CurrentLayerValueTxt.text = "" + this.towerInfo.towerIndex;
    this.TotalGpValueTxt.text = "" + this.towerInfo.totalGp;

    this.addEvent();
  }

  private addEvent() {
    this.Btn_Fall.onClick(this, this.BtnFallHander.bind(this));
    this.Btn_Shop.onClick(this, this.BtnShopHander.bind(this));
    PlayerManager.Instance.addEventListener(
      PlayerEvent.UPDATE_TOWER_INFO,
      this.__onTowerChange,
      this,
    );
  }

  private removeEvent() {
    this.Btn_Fall.offClick(this, this.BtnFallHander.bind(this));
    this.Btn_Shop.offClick(this, this.BtnShopHander.bind(this));
    PlayerManager.Instance.removeEventListener(
      PlayerEvent.UPDATE_TOWER_INFO,
      this.__onTowerChange,
      this,
    );
  }

  private __onTowerChange() {
    this.CurrentLayerValueTxt.text =
      "" + PlayerManager.Instance.currentPlayerModel.towerInfo.towerIndex;
    this.TotalGpValueTxt.text =
      "" + PlayerManager.Instance.currentPlayerModel.towerInfo.totalGp;
  }

  private BtnFallHander() {
    let dataArray: Array<GoodsInfo> = [];
    let value: string =
      PlayerManager.Instance.currentPlayerModel.towerInfo.itemTempIds;
    if (!StringHelper.isNullOrEmpty(value)) {
      let arr: Array<string> = value.split("|");
      let len: number = arr.length;
      let item: GoodsInfo;
      let itemStr: string;
      for (let i: number = 0; i < len; i++) {
        itemStr = arr[i];
        item = new GoodsInfo();
        item.templateId = parseInt(itemStr.split(",")[0]);
        item.count = parseInt(itemStr.split(",")[1]);
        dataArray.push(item);
      }
    }
    FrameCtrlManager.Instance.open(EmWindow.DisplayItems, {
      itemInfos: dataArray,
      title: LangManager.Instance.GetTranslation(
        "map.campaign.view.frame.MazeFallItemsFrame.title",
      ),
    });
  }

  private BtnShopHander() {
    var mapId: number = CampaignManager.Instance.mapModel.mapId;
    if (WorldBossHelper.checkMaze(mapId)) {
      FrameCtrlManager.Instance.open(EmWindow.ShopWnd, {
        page: 3,
        returnToWinFrameData: 0,
      });
    } else {
      FrameCtrlManager.Instance.open(EmWindow.ShopWnd, {
        page: 3,
        returnToWinFrameData: 1,
      });
    }
  }

  /**
   *  根据当前的mapid返回地下迷宫还是深渊迷宫信息
   * @return
   *
   */
  private get towerInfo(): TowerInfo {
    var mapId: number = CampaignManager.Instance.mapModel.mapId;
    if (WorldBossHelper.checkMaze(mapId)) {
      return PlayerManager.Instance.currentPlayerModel.towerInfo1;
    } else if (WorldBossHelper.checkMaze2(mapId)) {
      return PlayerManager.Instance.currentPlayerModel.towerInfo2;
    }
    return PlayerManager.Instance.currentPlayerModel.towerInfo;
  }

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }
}
