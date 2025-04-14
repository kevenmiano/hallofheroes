import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import FrameDataBase from "../../mvc/FrameDataBase";
import MazeOrderInfo from "./MazeOrderInfo";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { ConfigType } from "../../constant/ConfigDefine";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { PlayerManager } from "../../manager/PlayerManager";
import { ShopEvent } from "../../constant/event/NotificationEvent";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";

export enum EmMazeType {
  GroundMaze = 0,
  AbyssMaze,
}

export default class MazeModel extends FrameDataBase {
  /** 迷宫硬币模板id */
  public static SHOP_MAZE_COIN_TEMPID: number = 208009;
  /** 迷宫钥匙模板id */
  public static MAZE_STONE: number = 208008;
  /** 扫荡开启层 */
  public static OPEN_SWEEP_LEVEL = 11;
  /** 地下迷宫钥匙每次使用量 */
  public static MAZE_STONE_USE = 1;
  /** 深渊迷宫钥匙每次使用量 */
  public static MAZE2_STONE_USE = 3;

  public static MAZE_MAX_LEVEL = 100;
  public static MAZE2_MAX_LEVEL = 30;

  private currentPageNum: number = 0;
  private curMaxIndex: number = 0;
  private _currentPage: number = 1;
  private _totalPage: number = 1;
  private curA: number = 0;
  private curB: number = 0;
  private _currentGoodsList: Array<ShopGoodsInfo>;
  private _showGoodsList: Array<ShopGoodsInfo>;
  private static _instance: MazeModel;
  private _selectedItem: ShopGoodsInfo;

  public static get instance(): MazeModel {
    if (!MazeModel._instance) MazeModel._instance = new MazeModel();
    return MazeModel._instance;
  }

  constructor() {
    super();
    this.initData();
  }

  private initData() {
    this._mazeOrderList = [];
  }

  /**
   *地下迷宫排行榜列表
   */
  private _mazeOrderList: Array<MazeOrderInfo>;
  public get mazeOrderList(): Array<MazeOrderInfo> {
    return this._mazeOrderList;
  }

  public initMazeShopFrame() {
    this.currentPage = 1;
    this.currentPageNum = 8;
    let goodsList: Array<ShopGoodsInfo> = [];
    let goodsList2: Array<ShopGoodsInfo> = [];
    let heroJob: number = this.thane.templateInfo.Job;
    let gInfo: ShopGoodsInfo;
    let cfgm = ConfigMgr.Instance;
    let mazeShopTemplateDic = cfgm.mazeShopTemplateDic;

    let t1 = PlayerManager.Instance.currentPlayerModel.towerInfo1.maxIndex;
    let t2 = PlayerManager.Instance.currentPlayerModel.towerInfo2.maxIndex;

    //优化标记 数据量不大就算了
    for (const key in mazeShopTemplateDic) {
      if (Object.prototype.hasOwnProperty.call(mazeShopTemplateDic, key)) {
        gInfo = mazeShopTemplateDic[key];
        if (
          this.isJobFix(
            heroJob,
            cfgm.getTemplateByID(ConfigType.t_s_itemtemplate, gInfo.ItemId),
          )
        ) {
          if (gInfo.MazeLayers > t1 || gInfo.MazeLayers2 > t2) {
            goodsList2.push(gInfo);
          } else {
            goodsList.push(gInfo);
          }
        }
      }
    }

    goodsList.sort((a, b) => {
      return a.Sort - b.Sort;
    });
    goodsList2.sort((a, b) => {
      return a.Sort - b.Sort;
    });
    goodsList.push(...goodsList2);

    // goodsList.sort(this.mazeShopSortFunc.bind(this));
    this.totalPage = Math.ceil(goodsList.length / this.currentPageNum);
    this.currentGoodsList = goodsList;
    this.showGoodsList = this.getShopShowList();
  }

  public get currentPage(): number {
    return this._currentPage;
  }

  public set currentPage(value: number) {
    value = value <= 0 ? 1 : value;
    this._currentPage = value;
    this.dispatchEvent(ShopEvent.PAGE_UPDATE);
  }

  public get currentGoodsList(): Array<ShopGoodsInfo> {
    return this._currentGoodsList;
  }

  public set currentGoodsList(value: Array<ShopGoodsInfo>) {
    this._currentGoodsList = value;
  }

  public get showGoodsList(): Array<ShopGoodsInfo> {
    return this._showGoodsList;
  }

  public set showGoodsList(value: Array<ShopGoodsInfo>) {
    this._showGoodsList = value;
    this.dispatchEvent(ShopEvent.GOODS_LIST_UPDATE);
  }

  public set selectedItem(value: ShopGoodsInfo) {
    this._selectedItem = value;
    this.dispatchEvent(ShopEvent.GOODS_SELECT_UPDATE);
  }

  public get selectedItem(): ShopGoodsInfo {
    return this._selectedItem;
  }

  public getShopShowList(): Array<ShopGoodsInfo> {
    var startIndex: number = (this.currentPage - 1) * this.currentPageNum;
    var endIndex: number = startIndex + this.currentPageNum;
    if (endIndex > this.currentGoodsList.length)
      endIndex = this.currentGoodsList.length;
    return this.currentGoodsList.slice(startIndex, endIndex);
  }

  private mazeShopSortFunc(a: ShopGoodsInfo, b: ShopGoodsInfo): number {
    if (PlayerManager.Instance.currentPlayerModel.towerInfo2.maxIndex > 0) {
      this.curMaxIndex =
        PlayerManager.Instance.currentPlayerModel.towerInfo2.maxIndex;
      this.curA = a.MazeLayers2;
      this.curB = b.MazeLayers2;
    } else {
      this.curMaxIndex =
        PlayerManager.Instance.currentPlayerModel.towerInfo1.maxIndex;
      this.curA = a.MazeLayers2 > 0 ? 100 : a.MazeLayers;
      this.curB = b.MazeLayers2 > 0 ? 100 : b.MazeLayers;
    }
    if (this.curMaxIndex >= this.curA && this.curMaxIndex >= this.curB) {
      if (a.Sort > 0 && b.Sort > 0) {
        if (a.Sort <= b.Sort) return -1;
        return 1;
      } else if (a.Sort == 0 && b.Sort == 0) {
        if (a.MazeLayers2 > b.MazeLayers2) return -1;
        if (a.MazeLayers2 == b.MazeLayers2) {
          if (a.MazeLayers > b.MazeLayers) return -1;
          if (a.MazeLayers == b.MazeLayers) {
            var at: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
              ConfigType.t_s_itemtemplate,
              a.ItemId,
            );
            var bt: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
              ConfigType.t_s_itemtemplate,
              b.ItemId,
            );
            if (!at || !bt) return 0;
            if (at.Profile > bt.Profile) return -1;
            if (at.Profile == bt.Profile) {
              if (at.TemplateId < bt.TemplateId) return -1;
            }
          }
        }
        return 1;
      } else {
        if (a.Sort > 0) return -1;
        if (b.Sort > 0) return 1;
        return 0;
      }
    } else if (this.curMaxIndex >= this.curA || this.curMaxIndex >= this.curB) {
      if (this.curMaxIndex >= this.curA) return -1;
      if (this.curMaxIndex >= this.curB) return 1;
    } else {
      if (a.MazeLayers2 < b.MazeLayers2) return -1;
      if (a.MazeLayers2 == b.MazeLayers2) {
        if (a.MazeLayers < b.MazeLayers) return -1;
        if (a.MazeLayers == b.MazeLayers) {
          if (a.ItemId > b.ItemId) return -1;
        }
      }
      return 1;
    }
    return 0;
  }

  public get totalPage(): number {
    return this._totalPage;
  }

  public set totalPage(value: number) {
    value = value <= this._currentPage ? this._currentPage : value;
    this._totalPage = value;
    this.dispatchEvent(ShopEvent.PAGE_UPDATE);
  }

  private isJobFix(heroJob: number, gInfo: t_s_itemtemplateData): boolean {
    if (!gInfo) return false;
    var arr: Array<number> = gInfo.Job;
    for (let i: number = 0; i < arr.length; i++) {
      let job: number = arr[i];
      if (job == 0 || job == heroJob) return true;
    }
    return false;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }
}
