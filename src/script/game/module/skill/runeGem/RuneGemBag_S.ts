//@ts-expect-error: External dependencies
import FUI_RuneBagCom from "../../../../../fui/Skill/FUI_RuneBagCom";
import FUI_RuneBagCom_S from "../../../../../fui/Skill/FUI_RuneBagCom_S";
import LangManager from "../../../../core/lang/LangManager";
import {
  eFilterFrameText,
  FilterFrameText,
} from "../../../component/FilterFrameText";
import { RuneBagCell } from "../../../component/item/RuneBagCell";
import { BagType } from "../../../constant/BagDefine";
import { ItemSelectState } from "../../../constant/Const";
import { BagEvent, RuneEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { Enum_BagGridState } from "../../bag/model/Enum_BagState";
import SkillWndCtrl from "../SkillWndCtrl";

/**
 * 符文石镶嵌时的背包面板
 */
export default class RuneGemBag_S extends FUI_RuneBagCom_S {
  private typeArr = [];
  /** 背包列表数据 */
  private _bagData: GoodsInfo[];
  /** 背包中当前选中的品质的列表数据 */
  private _curListData: GoodsInfo[];
  /** 背包符石的拥有数量 */
  private ownNum: number = 0;
  /** 背包符石的数量上限 */
  private maxNum: number = 100;
  /** 当前筛选的品质 默认全选 */
  private profile: number = 0;

  /**默认开放背包格子数量 */
  private openGridNum: number = 10;
  /**背包最大上限格子数量 */
  private maxGridNum: number = 100;

  onConstruct() {
    super.onConstruct();
    this.addEvent();
    this.list.setVirtual();
    let Colors = FilterFrameText.Colors[eFilterFrameText.PetQuality];
    for (let i = 0; i < 6; i++) {
      let str = LangManager.Instance.GetTranslation("runeGem.color" + i);
      this.typeArr.push(str);
    }
    this.combox1.items = this.typeArr;
    for (let j = 0; j < 5; j++) {
      let txt = this.combox1.dropdown.getChildAt(0) as fairygui.GTextField;
      txt.color = Colors[j];
    }
    // this.txt_energy0.text = LangManager.Instance.GetTranslation('armyII.viewII.allocate.number')+':';
    // this.combox1.text = LangManager.Instance.GetTranslation('runeGem.str5');
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderListItem,
      null,
      false,
    );
    this.updateBagGrid();
    this.updateBagList();
  }

  updateBagList() {
    this._bagData = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE);
    if (this._shapeId > 0) {
      this.getGemByShape(this._shapeId);
    }
    this.ownNum = this._bagData.length;
    this.list.numItems = this.maxGridNum;
  }

  private addEvent() {
    this.btn_close_bag.onClick(this, this.onCloseBag);
    this.combox1.on(fairygui.Events.STATE_CHANGED, this, this.onSelectItem);
    PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(
      PlayerEvent.RUNE_GEM_BAG_CAPICITY,
      this.updateBag,
      this,
    );
  }

  private removeEvent() {
    this.btn_close_bag.offClick(this, this.onCloseBag);
    this.combox1.off(fairygui.Events.STATE_CHANGED, this, this.onSelectItem);
    PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(
      PlayerEvent.RUNE_GEM_BAG_CAPICITY,
      this.updateBag,
      this,
    );
  }

  private updateBagGrid() {
    //【符石背包】默认开放, 最大上限
    let str =
      TempleteManager.Instance.getConfigInfoByConfigName(
        "runehole_bag",
      ).ConfigValue;
    let arr = str.split(",");
    this.openGridNum =
      Number(arr[0]) +
      PlayerManager.Instance.currentPlayerModel.playerInfo.runeGemBagCount;
    this.maxGridNum = Number(arr[1]);
  }

  updateBag(playerInfo: PlayerInfo) {
    this.updateBagGrid();
    this.updateBagList();
  }

  /**
   * 列表渲染
   * @param index
   * @param item
   * @returns
   */
  private onRenderListItem(index: number, item: RuneBagCell) {
    if (!item) return;
    let itemData: any;
    if (this._curListData) {
      itemData = this._curListData[index];
    } else {
      itemData = this._bagData[index];
    }
    if (!itemData) {
      item.info = null;
      if (index < this.openGridNum) {
        //没道具的空格子
        item.state = Enum_BagGridState.Empty;
      } else {
        //未解锁的格子
        item.state = Enum_BagGridState.Lock;
      }
      return;
    } else {
      if (itemData.templateInfo.Profile > this.profile && this.profile != 0) {
        item.state = Enum_BagGridState.Empty;
        return;
      }
    }
    item.state = Enum_BagGridState.Item;
    item.selectState = ItemSelectState.Default;
    item.item.bagType = itemData.bagType;
    item.item.pos = itemData.pos;
    item.info = itemData;
  }

  /**
   * 符石品质筛选, 点击仅显示当前品质
   * @param index
   * @param combo
   */
  private onSelectItem(combo: fgui.GComboBox) {
    // if(this.combox1.selectedIndex == 0){
    //     this.onAll();
    //     return;
    // }
    this.profile = this.combox1.selectedIndex;
    this._curListData = this.getRuneGemsByProfile(this.profile);
    this.list.refreshVirtualList();
  }

  onAll() {
    if (this._curListData == null) {
      return;
    }
    this._curListData = null;
    this.profile = 0;
    this.list.refreshVirtualList();
  }

  onCloseBag() {
    NotificationManager.Instance.dispatchEvent(
      RuneEvent.SHOW_INLAY_RUNE_BAG,
      0,
    );
  }

  onBuy() {}

  dispose(): void {
    this.removeEvent();
    super.dispose();
  }

  /**
   * 符石品质筛选, 点击仅显示当前品质
   * @param profile
   * @returns
   */
  getRuneGemsByProfile(profile: number): GoodsInfo[] {
    let result: GoodsInfo[] = [];
    let array = this._bagData;
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (element.templateInfo.Profile == profile || profile == 0) {
        if (this._shapeId > 0) {
          if (element.templateInfo.Property1 == this._shapeId) {
            result.push(element);
          }
        } else {
          result.push(element);
        }
      }
    }
    return result;
  }

  private _shapeId: number = 0;
  /**
   * 获得指定形状的符文石
   * @param shapeId
   */
  getGemByShape(shapeId: number) {
    this._shapeId = shapeId;
    if (!this._curListData) {
      this._curListData = [];
    } else {
      this._curListData.length = 0;
    }
    for (let i = 0; i < this._bagData.length; i++) {
      const goodsInfo = this._bagData[i];
      if (goodsInfo.templateInfo.Property1 == shapeId) {
        if (this.profile > 0) {
          if (goodsInfo.templateInfo.Profile == this.profile) {
            this._curListData.push(goodsInfo);
          }
        } else {
          this._curListData.push(goodsInfo);
        }
      }
    }
    this.getControllerAt(0).selectedIndex = shapeId - 1;
    this.img_select.visible = true;
  }

  resetState(): void {
    this._shapeId = 0;
    if (this._curListData) {
      this._curListData.length = 0;
    }
    this.updateBagList();
    this.img_select.visible = false;
  }
}
