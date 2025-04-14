//@ts-expect-error: External dependencies
import FUI_MazeShopView from "../../../../../../fui/Shop/FUI_MazeShopView";
import { BaseItem } from "../../../../component/item/BaseItem";
import { ShopGoodsInfo } from "../../model/ShopGoodsInfo";
import MazeModel from "../../../maze/MazeModel";
import { NumericStepper } from "../../../../component/NumericStepper";
import BaseTipItem from "../../../../component/item/BaseTipItem";
import LangManager from "../../../../../core/lang/LangManager";
import {
  BagEvent,
  NotificationEvent,
  ShopEvent,
} from "../../../../constant/event/NotificationEvent";
import { GoodsManager } from "../../../../manager/GoodsManager";
import { ShopManager } from "../../../../manager/ShopManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import TemplateIDConstant from "../../../../constant/TemplateIDConstant";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import ConfigMgr from "../../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../../constant/ConfigDefine";
import GoodsSonType from "../../../../constant/GoodsSonType";
import StringHelper from "../../../../../core/utils/StringHelper";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import AudioManager from "../../../../../core/audio/AudioManager";
import { SoundIds } from "../../../../constant/SoundIds";
import { C2SProtocol } from "../../../../constant/protocol/C2SProtocol";
import { WildSoulInfo } from "../../../mount/model/WildSoulInfo";
import { MountsManager } from "../../../../manager/MountsManager";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { GoodsCheck } from "../../../../utils/GoodsCheck";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { GoodsType } from "../../../../constant/GoodsType";
import { t_s_suitetemplateData } from "../../../../config/t_s_suitetemplate";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { BagType } from "../../../../constant/BagDefine";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { MazeShopItemII } from "./MazeShopItemII";
import {
  FilterFrameText,
  eFilterFrameText,
} from "../../../../component/FilterFrameText";
import Utils from "../../../../../core/utils/Utils";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/6/12 12:10
 * @ver 1.0
 */
export class MazeShopView extends FUI_MazeShopView {
  public icon1: BaseItem;

  public tipItem2: BaseTipItem;

  private openType: number = 0; //入口类别 (0地下迷宫 1深渊迷宫)
  private _selectedItemData: ShopGoodsInfo;
  private _model: MazeModel;
  private mazeCoinCount: number = 0;
  private MaxCanBuyCount: number = 0; //最大可购买数量

  public stepper: NumericStepper;
  private _handler: Laya.Handler;
  private _limitMaxCount: number = Number.MAX_VALUE;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  public init() {
    this.resetUI();
    this.initData();
    this.initEvent();
    this.initView();
  }

  private resetUI() {}

  private initData() {
    this._model = MazeModel.instance;
  }

  private initEvent() {
    this.ItemList.setVirtual();
    this.ItemList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    this.ItemList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this._model.addEventListener(
      ShopEvent.GOODS_LIST_UPDATE,
      this.__refreshGoods,
      this,
    );
    this._model.addEventListener(
      ShopEvent.GOODS_SELECT_UPDATE,
      this._refreshRight,
      this,
    );
    this._model.addEventListener(
      ShopEvent.PAGE_UPDATE,
      this.__refreshPage,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.__updateMazeCoin,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.DELETE_BAG,
      this.__updateMazeCoin,
      this,
    );
    this.Btn_Buy.onClick(this, this._buyHander);
    if (ShopManager.Instance.model) {
      ShopManager.Instance.model.addEventListener(
        ShopEvent.GOODS_INFO_UPDATE,
        this._refreshRight,
        this,
      );
    }
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SHOP_TIME_BUY_REFRESH,
      this._refreshRight,
      this,
    );
  }

  private initView() {
    this.BuyNumDescTxt.text = LangManager.Instance.GetTranslation(
      "MazeShopWnd.BuyNumDescTxt",
    );
    // this.ItemList.scrollPane.mouseWheelEnabled = false;
    this.refresDescribeTxt("");
    this.CostMoneyTxt.text = "";
    this.SelectedGoodsTxt.text = "";
    this.specialGroup.visible = false;
    this.itemTips.getChild("content").text = "";
    this.HasNumValueTxt.text = "";
    MazeModel.instance.initMazeShopFrame();
    this.ItemList.selectedIndex = 0; //默认选中第0个
    let vdata = this._model.currentGoodsList[0]
      ? this._model.currentGoodsList[0]
      : null;
    MazeModel.instance.selectedItem = vdata;
    this._selectedItemData = vdata;
    this.__updateMazeCoin();
    this._refreshRight();
    this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_MAZE);
  }

  private renderListItem(index: number, item: MazeShopItemII) {
    if (
      !this._model.currentGoodsList ||
      this._model.currentGoodsList.length <= 0
    ) {
      return;
    }
    let vdata = this._model.currentGoodsList[index]
      ? this._model.currentGoodsList[index]
      : null;
    item.vdata = vdata;
  }

  private onClickItem(item: MazeShopItemII) {
    MazeModel.instance.selectedItem = item.vdata;
    this._selectedItemData = item.vdata;
    this._refreshRight();
  }

  private __refreshGoods() {
    this.ItemList.numItems = this._model.currentGoodsList.length;
  }

  private __refreshPage() {
    // this.PageNumTxt.text = this._model.currentPage + "/" + this._model.totalPage;
  }

  private __updateMazeCoin() {
    this.mazeCoinCount = GoodsManager.Instance.getGoodsNumByTempId(
      MazeModel.SHOP_MAZE_COIN_TEMPID,
    );
    // this.ComMoneyText.text = this.mazeCoinCount.toString();
  }

  /**购买物品 */
  private _buyHander() {
    if (this._selectedItemData) {
      let itemid: number = this._selectedItemData.ItemId;
      if (
        GoodsManager.Instance.getGoodsNumByTempId(
          MazeModel.SHOP_MAZE_COIN_TEMPID,
        ) < this._selectedItemData.price
      ) {
        //钱不够
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "shop.view.frame.BuyFrameI.MazeCoinLack",
          ),
        );
        return;
      }
      let goods: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_itemtemplate,
        itemid,
      );
      if (
        GoodsSonType.EQUIP_SONTYPE_LIST.indexOf(goods.SonType) >= 0 &&
        GoodsManager.Instance.checkExistGoodsByTempIdInAllBag(goods.TemplateId)
      ) {
        this.showAlert(); //物品时装备 背包中已存在
        return;
      }
      let msg: string = this.checkExist(itemid);
      if (!StringHelper.isNullOrEmpty(msg)) {
        MessageTipManager.Instance.show(msg);
        return;
      }
      this.showBuyAlert();
    } else {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("MazeShopWnd.buyTips"),
      );
      return;
    }
  }

  showBuyAlert() {
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let prompt: string = LangManager.Instance.GetTranslation("BuyFrameI.tip01");
    let totalCost: number = this.stepper.value * this._selectedItemData.price;
    let content: string = LangManager.Instance.GetTranslation(
      "mazeshop.buy.alert",
      totalCost,
      this.stepper.value,
      this.SelectedGoodsTxt.text,
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.result.bind(this),
    );
  }

  private showAlert() {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let prompt: string = LangManager.Instance.GetTranslation("BuyFrameI.tip01");
    let content: string =
      LangManager.Instance.GetTranslation("BuyFrameI.tip02");
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.result.bind(this),
    );
  }

  private result(b: boolean, flag: boolean) {
    if (b) {
      this.buy(false);
    }
  }

  private buy(useBind: boolean = true) {
    let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      this._selectedItemData.ItemId,
    );
    if (this.isFashionGoods(temp)) {
      ShopManager.Instance.sendShoping(
        this._selectedItemData.Id,
        this.stepper.value,
        this.playerInfo.userId,
        false,
        C2SProtocol.C_FASHION_SHOP_BUY,
        useBind,
      );
    } else {
      ShopManager.Instance.sendShoping(
        this._selectedItemData.Id,
        this.stepper.value,
        this.playerInfo.userId,
        false,
        C2SProtocol.U_C_SHOP_BUY,
        useBind,
      );
    }
  }

  private checkExist(tId: number): string {
    let goods: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      tId,
    );
    if (goods.SonType != GoodsSonType.SONTYPE_MOUNT_CARD) {
      return "";
    }
    let exist: WildSoulInfo = MountsManager.Instance.avatarList.getWildSoulInfo(
      goods.Property1,
    );
    if (goods.Property2 > 0) {
      exist = null;
    }
    if (exist) {
      return LangManager.Instance.GetTranslation(
        "shop.view.frame.BuyFrameI.mopupexitst",
      );
    } else {
      return "";
    }
  }

  protected get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private isFashionGoods(temp: t_s_itemtemplateData): boolean {
    if (
      temp.SonType == GoodsSonType.FASHION_CLOTHES ||
      temp.SonType == GoodsSonType.FASHION_HEADDRESS ||
      temp.SonType == GoodsSonType.FASHION_WEAPON ||
      temp.SonType == GoodsSonType.SONTYPE_WING
    ) {
      return true;
    }
    return false;
  }

  private _refreshRight() {
    this._selectedItemData = this._model.selectedItem;
    if (this._selectedItemData) {
      this.SelectedGoodsTxt.text = this.getName();
      this.HasNumValueTxt.text =
        GoodsManager.Instance.getGoodsNumByTempId(
          this._selectedItemData.ItemId,
        ) + "";
      this.MaxCanBuyCount = Math.floor(
        this.mazeCoinCount / this._selectedItemData.price,
      );
      if (this.MaxCanBuyCount <= 0 || !this.isMaxLayers) {
        this.MaxCanBuyCount = 1;
      }
      this._handler && this._handler.recover();
      this._handler = Laya.Handler.create(
        this,
        this.stepperChangeHandler,
        null,
        false,
      );
      let weekLimitCount: number = this._selectedItemData.WeeklyLimit; //周限购
      let dayLimitCount: number = this._selectedItemData.OneDayCount; //日限购
      let leftCount = 0;
      if (weekLimitCount > 0) {
        //有周限购优先显示周限购
        let weekHasBuyCount = this._selectedItemData.weekCount;
        leftCount = weekLimitCount - weekHasBuyCount;
      } else if (dayLimitCount > 0) {
        //有日限购
        let dayHasBuyCount = this._selectedItemData.OneCurrentCount;
        leftCount = dayLimitCount - dayHasBuyCount;
      } else {
        leftCount = 999;
      }
      this.MaxCanBuyCount = Math.min(this.MaxCanBuyCount, leftCount);
      let value: number =
        this.MaxCanBuyCount > this._limitMaxCount
          ? this._limitMaxCount
          : this.MaxCanBuyCount;
      this.stepper.show(0, 1, 1, value, value, 1, this._handler);
      this.CostMoneyTxt.text = (
        this.stepper.value * this._selectedItemData.price
      ).toString();
      this.updateLimit();
      this.updateBuyBtnStatus();
    } else {
      this.CostMoneyTxt.text = "";
    }
  }

  private get isMaxLayers(): boolean {
    let value = true;
    if (
      this._selectedItemData.MazeLayers >
      PlayerManager.Instance.currentPlayerModel.towerInfo1.maxIndex
    ) {
      value = false;
    }
    if (
      this._selectedItemData.MazeLayers2 >
      PlayerManager.Instance.currentPlayerModel.towerInfo2.maxIndex
    ) {
      value = false;
    }
    return value;
  }

  private updateBuyBtnStatus() {
    this.Btn_Buy.enabled = this.isMaxLayers;
  }

  private updateLimit() {
    let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      this._selectedItemData.ItemId,
    );
    if (GoodsCheck.isEquip(temp)) {
      //如果为装备
      this.limitCtr.selectedIndex = 0;
      this.limitCounTxt.text = "";
      this._limitMaxCount = Number.MAX_VALUE;
    } else {
      let weekLimitCount: number = this._selectedItemData.WeeklyLimit; //周限购
      let dayLimitCount: number = this._selectedItemData.OneDayCount; //日限购
      this.limitCtr.selectedIndex = 1;
      let leftTxt = "";
      if (weekLimitCount > 0) {
        //有周限购优先显示周限购
        let weekHasBuyCount = this._selectedItemData.weekCount;
        this.limitDescTxt.text = LangManager.Instance.GetTranslation(
          "Shop.Promotion.weeklimit",
        );
        leftTxt =
          (weekLimitCount - weekHasBuyCount > 0
            ? "[color=#FFECC6]"
            : "[color=#FF0000]") +
          (weekLimitCount - weekHasBuyCount) +
          "[/color]";
        this.limitCounTxt.text = leftTxt + "/" + weekLimitCount;
        this._limitMaxCount = weekLimitCount - weekHasBuyCount;
      } else if (dayLimitCount > 0) {
        //有日限购
        let dayHasBuyCount = this._selectedItemData.OneCurrentCount;
        this.limitDescTxt.text = LangManager.Instance.GetTranslation(
          "Shop.Promotion.daylimit",
        );
        leftTxt =
          (dayLimitCount - dayHasBuyCount > 0
            ? "[color=#FFECC6]"
            : "[color=#FF0000]") +
          (dayLimitCount - dayHasBuyCount) +
          "[/color]";
        this.limitCounTxt.text =
          dayLimitCount - dayHasBuyCount + "/" + dayLimitCount;
        this._limitMaxCount = dayLimitCount - dayHasBuyCount;
      } else {
        this.limitDescTxt.text = LangManager.Instance.GetTranslation(
          "shop.view.GoodsItem.limited07",
        );
        this.limitCounTxt.text = leftTxt;
        this._limitMaxCount = Number.MAX_VALUE;
      }
    }
  }

  private stepperChangeHandler(value: number) {
    this.CostMoneyTxt.text = (
      this.stepper.value * this._selectedItemData.price
    ).toString();
  }

  private getName(): string {
    let goodsInfo: GoodsInfo = new GoodsInfo();
    goodsInfo.templateId = this._selectedItemData.ItemId;
    this.icon1.info = goodsInfo;
    let goodsTempInfo: t_s_itemtemplateData =
      ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_itemtemplate,
        this._selectedItemData.ItemId,
      );
    if (!goodsTempInfo) {
      this._selectedItemData = null;
      let noFindGoods: string = LangManager.Instance.GetTranslation(
        "consortia.view.myConsortia.building.ConsortiaShopGoodsItem.noFindGoods",
      );
      return noFindGoods;
    }
    if (
      goodsTempInfo.MasterType == GoodsType.EQUIP ||
      goodsTempInfo.MasterType == GoodsType.HONER
    ) {
      this.specialGroup.visible = true;
      this.txtIntensifyLevel.text =
        goodsTempInfo.StrengthenMax == 0
          ? ""
          : LangManager.Instance.GetTranslation(
              "yishi.view.tips.goods.EquipTipsContent.intensify",
              goodsTempInfo.StrengthenMax,
            );
      this.txtJob.text =
        goodsTempInfo.jobName + " " + goodsTempInfo.sonTypeName;
      this.txtLevel.text = LangManager.Instance.GetTranslation(
        "public.level4_space2",
        goodsTempInfo.NeedGrades,
      );
      this.refreshItemTips(goodsInfo, goodsTempInfo);
      this.refresDescribeTxt("");
    } else {
      this.specialGroup.visible = false;
      this.refresDescribeTxt(goodsTempInfo.DescriptionLang);
    }
    this.SelectedGoodsTxt.color =
      FilterFrameText.Colors[eFilterFrameText.ItemQuality][
        goodsInfo.templateInfo.Profile - 1
      ];
    return goodsTempInfo.TemplateNameLang;
  }

  private refreshItemTips(info: GoodsInfo, temp: t_s_itemtemplateData) {
    let tempStr = "";
    tempStr += this.initAttribute(info, temp);
    tempStr += this.initSuit(info, temp);
    tempStr += this.initScore(info, temp);
    if (tempStr == "") {
      tempStr =
        "[color=#ffc68f]" + info.templateInfo.DescriptionLang + "[/color]";
    }
    this.itemTips.getChild("content").text = tempStr;
  }

  private refresDescribeTxt(txt: string) {
    this.DescribleTxt.getChild("content").text = txt;
  }

  private initAttribute(info: GoodsInfo, temp: t_s_itemtemplateData): string {
    let tempStr = "";
    let str: string = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip01",
    );
    tempStr += this.updateAttributeTxt(
      str,
      temp.Power,
      this.getAdd(temp.Power, info),
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip02",
    );
    tempStr += this.updateAttributeTxt(
      str,
      temp.Agility,
      this.getAdd(temp.Agility, info),
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip03",
    );
    tempStr += this.updateAttributeTxt(
      str,
      temp.Intellect,
      this.getAdd(temp.Intellect, info),
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip04",
    );
    tempStr += this.updateAttributeTxt(
      str,
      temp.Physique,
      this.getAdd(temp.Physique, info),
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip05",
    );
    tempStr += this.updateAttributeTxt(
      str,
      temp.Captain,
      this.getAdd(temp.Captain, info),
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip10",
    );
    tempStr += this.updateAttributeTxt(
      str,
      temp.ForceHit,
      this.getAdd(temp.ForceHit, info),
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip11",
    );
    tempStr += this.updateAttributeTxt(
      str,
      temp.Live,
      this.getAdd(temp.Live, info),
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip13",
    );
    tempStr += this.updateAttributeTxt(
      str,
      temp.Attack,
      this.getAdd(temp.Attack, info),
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip14",
    );
    tempStr += this.updateAttributeTxt(
      str,
      temp.Defence,
      this.getAdd(temp.Defence, info),
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip15",
    );
    tempStr += this.updateAttributeTxt(
      str,
      temp.MagicAttack,
      this.getAdd(temp.MagicAttack, info),
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip16",
    );
    tempStr += this.updateAttributeTxt(
      str,
      temp.MagicDefence,
      this.getAdd(temp.MagicDefence, info),
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip17",
    );
    tempStr += this.updateAttributeTxt(
      str,
      temp.Conat,
      this.getAdd(temp.Conat, info),
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip19",
    );
    tempStr += this.updateAttributeTxt(
      str,
      temp.Parry,
      this.getAdd(temp.Parry, info),
    );
    return tempStr;
  }

  private updateAttributeTxt(
    property: string,
    value: number,
    addValue: number,
  ): string {
    if (value > 0) {
      let tempStr = "[color=#ffc68f]" + property + "[/color]";
      tempStr += "[color=#ffecc6]&nbsp;" + value + "[/color]";
      if (addValue > 0) {
        tempStr += "&nbsp;+" + addValue;
      }
      return tempStr + "<br>";
    }
    return "";
  }

  private getAdd(preValue: number, gInfo: GoodsInfo): number {
    return (
      Math.floor(preValue * gInfo.strengthenGrade * 0.1) +
      gInfo.strengthenGrade * 5
    );
  }

  private initSuit(info: GoodsInfo, temp: t_s_itemtemplateData) {
    let tempStr: string = "";
    let skillStr: string = "";
    let suitTemp: t_s_suitetemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_suitetemplate,
      temp.SuiteId,
    );
    if (suitTemp) {
      let heroId: number = info.objectId;
      let baseHero = ArmyManager.Instance.thane;
      let current: number = 0;
      let suitCount: number = suitTemp.suitCount;
      if (baseHero.id == heroId) {
        let list: GoodsInfo[] = [];
        if (info.bagType == BagType.HeroEquipment) {
          list = GoodsManager.Instance.getHeroEquipListById(heroId).getList();
        } else if (info.bagType == BagType.Honer) {
          list = GoodsManager.Instance.getHeroHonorListById(heroId).getList();
        }
        current = suitTemp.existCount(list);
      } else {
        current = info.suitCount;
      }

      let ownCount = current > 0 ? current : 0;
      let color = ownCount > 0 ? "[color=#39a82d]" : "[color=#ffc68f]";
      let title =
        "[color=#ffc68f]" +
        suitTemp.TemplateNameLang +
        " (" +
        "[/color]" +
        color +
        ownCount +
        "[/color]" +
        "[color=#ffc68f]/" +
        suitCount +
        ")[/color]";
      if (suitCount > 1) {
        tempStr += title + "<br>";
      }
      for (let k: number = 1; k < 9; k++) {
        //每套最大8件套装单件
        let suitGood: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          suitTemp["Template" + k],
        );
        let info: GoodsInfo = GoodsManager.Instance.getGoodsByObjectIdAndGoodID(
          heroId,
          suitTemp["Template" + k],
        );
        if (!info) {
          info = GoodsManager.Instance.getGoodsByObjectIdAndGoodID(
            heroId,
            suitTemp["Template" + k + "S"],
          );
        }
        if (suitGood) {
          if (suitCount > 1) {
            color = info && current > 0 ? "[color=#39a82d]" : "[color=#aaaaaa]";
            tempStr +=
              "<font style='fontSize:18'>" +
              color +
              suitGood.TemplateNameLang +
              "[/color]" +
              "</font>" +
              "<br>";
          }
          //property 1-8为集齐对应套装数量的技能
          skillStr += suitTemp["Property" + k] + ",";
        }
      }
      tempStr += this.initSuitSkill(suitCount, skillStr, current);
    }
    return tempStr;
  }

  //套装技能
  private initSuitSkill(
    suitCount: number,
    skillIds: string,
    current: number,
  ): string {
    let tempStr = "";
    let skillList: t_s_skilltemplateData[] =
      TempleteManager.Instance.getSkillTemplateInfoByIds(skillIds);
    for (let count: number = 0; count < skillList.length; count++) {
      let skillTemp = skillList[count];
      if (skillTemp) {
        tempStr +=
          suitCount <= 1 || count < current
            ? "[color=#39a82d]"
            : "[color=#aaaaaa]";
        if (suitCount > 1) {
          tempStr += "(" + (count + 1) + ")" + skillTemp.SkillTemplateName;
        } else {
          tempStr += skillTemp.SkillTemplateName;
        }
      }
      tempStr += "[/color]<br>";
    }
    return tempStr;
  }

  private initScore(info: GoodsInfo, temp: t_s_itemtemplateData) {
    let num = info.getEquipBaseScore();
    let additionScore = info.getEquipAdditionScore();
    let scoreStr: string;
    if (additionScore > 0) {
      scoreStr = num + " (+" + additionScore + ")";
    } else {
      scoreStr = num + "";
    }

    let tempStr =
      "[color=#ffc68f]" +
      LangManager.Instance.GetTranslation(
        "fighting.FightingEquipAndGemFrame.title.text01",
      ) +
      "[/color]";
    tempStr += "[color=#ffecc6]&nbsp;" + scoreStr + "[/color]";

    return tempStr;
  }

  private removeEvent() {
    this.ItemList.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
    // this.ItemList.itemRenderer && this.ItemList.itemRenderer.recover();
    Utils.clearGListHandle(this.ItemList);
    this._model &&
      this._model.removeEventListener(
        ShopEvent.GOODS_LIST_UPDATE,
        this.__refreshGoods,
        this,
      );
    this._model &&
      this._model.removeEventListener(
        ShopEvent.GOODS_SELECT_UPDATE,
        this._refreshRight,
        this,
      );
    this._model &&
      this._model.removeEventListener(
        ShopEvent.PAGE_UPDATE,
        this.__refreshPage,
        this,
      );
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.__updateMazeCoin,
      this,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.DELETE_BAG,
      this.__updateMazeCoin,
      this,
    );
    this.Btn_Buy.offClick(this, this._buyHander);
    if (ShopManager.Instance.model) {
      ShopManager.Instance.model.removeEventListener(
        ShopEvent.GOODS_INFO_UPDATE,
        this._refreshRight,
        this,
      );
    }
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SHOP_TIME_BUY_REFRESH,
      this._refreshRight,
      this,
    );
  }

  dispose(destroy = true) {
    this.removeEvent();
    destroy && super.dispose();
  }
}
