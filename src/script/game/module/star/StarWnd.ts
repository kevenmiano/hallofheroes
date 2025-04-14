/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-21 10:43:29
 * @LastEditTime: 2024-01-04 10:34:45
 * @LastEditors: jeremy.xu
 * @Description: 占星主界面
 */
import AudioManager from "../../../core/audio/AudioManager";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import { UIFilter } from "../../../core/ui/UIFilter";
import UIManager from "../../../core/ui/UIManager";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import BaseTipItem from "../../component/item/BaseTipItem";
import OpenGrades from "../../constant/OpenGrades";
import { SoundIds } from "../../constant/SoundIds";
import { StarBagType } from "../../constant/StarDefine";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import { EmWindow } from "../../constant/UIDefine";
import { VipPrivilegeType } from "../../constant/VipPrivilegeType";
import { ResourceEvent } from "../../constant/event/NotificationEvent";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ResourceData } from "../../datas/resource/ResourceData";
import { ArmyManager } from "../../manager/ArmyManager";
import { DataCommonManager } from "../../manager/DataCommonManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { SharedManager } from "../../manager/SharedManager";
import { StarManager } from "../../manager/StarManager";
import { VIPManager } from "../../manager/VIPManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import StarInfo from "../mail/StarInfo";
import { ShopModel } from "../shop/model/ShopModel";
import StarModel from "./StarModel";
import PlanetItem from "./item/PlanetItem";
import StarItem from "./item/StarItem";

export default class StarWnd extends BaseWindow {
  private canClose: boolean = true;
  private arrowList: fgui.GList;
  private planetList: fgui.GList;
  private pointText: fgui.GRichTextField;
  private moveDstPos: Laya.Point = new Laya.Point();
  private starBagBtn: UIButton;
  private oKstarBtn: UIButton;
  private tipItem: BaseTipItem;
  private _displayStarDic: SimpleDictionary = new SimpleDictionary();
  private _displayStarPosDic: SimpleDictionary = new SimpleDictionary();
  private goldTxt: fgui.GLabel;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this.planetList.on(fgui.Events.CLICK_ITEM, this, this.__onPlanetClickItem);
    this.gold.addEventListener(
      ResourceEvent.RESOURCE_UPDATE,
      this.resourcesUpdateHandler,
      this,
    );
    this.initPlanet();
    this.initStarList();
    this.refreshStarList();
    this.__starPointUpdateHandler();

    this.moveDstPos.x = this.starBagBtn.x + this.starBagBtn.width / 2;
    this.moveDstPos.y = this.starBagBtn.y + (this.starBagBtn.height * 1) / 4;
    this.resourcesUpdateHandler();
    this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
  }

  private resourcesUpdateHandler() {
    this.goldTxt.text = ResourceManager.Instance.gold.count.toString();
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
  }

  private initStarList() {
    for (let index = 0; index < StarModel.MAX_DISPLAY_STAR; index++) {
      let item = this["starItem" + index] as StarItem;
      item.bagType = StarBagType.TEMP;
      item.index = index;
      this._displayStarPosDic.add(index, { x: item.x, y: item.y });
    }
  }

  private refreshStarList() {
    let listData = this.starManager.tempStarList.getList();
    if (listData.length == 0) return;
    for (let index = 0; index < StarModel.MAX_DISPLAY_STAR; index++) {
      let item = this["starItem" + index] as StarItem;
      const sInfo = listData[index] as StarInfo;
      item.info = sInfo;
      if (sInfo) {
        this._displayStarDic.add(sInfo.pos, item);
      }
    }
  }

  private initPlanet() {
    for (let index: number = 0; index < StarModel.MAKE_STAR_CNT; index++) {
      let item = this.planetList.getChildAt(index) as PlanetItem;
      item.txtCostGold.text = String(StarModel.MAKE_STAR_COSTS[index]);
      item.setAniCtrl(index == 0 ? 1 : 0);
      item.setEnabled(index == 0);
    }
    this.__randomPosHandler();
  }

  public getCrystalByIndex(idx: number): PlanetItem {
    return this.planetList.getChildAt(idx) as PlanetItem;
  }

  ///////////////////////////////
  public __addDisplayStar(data: any) {
    Logger.xjy("[StarWnd]__addDisplayStar", data, this.starModel.openCrystal);
    let sInfo = data[0] as StarInfo;
    let addStarTip: string = LangManager.Instance.GetTranslation(
      "star.view.DisplayStarView.addStarTip01",
      sInfo.template.TemplateNameLang,
      sInfo.grade,
    );
    // if (this.starModel.openCrystal > 0 && this.starManager.randomPosList[this.starModel.openCrystal] == 1) {
    //     addStarTip += LangManager.Instance.GetTranslation("star.view.DisplayStarView.addStarTip02", this.starModel.getNameByIndex(this.starModel.openCrystal));
    // }
    MessageTipManager.Instance.show(addStarTip);

    let tmpList = this.starManager.tempStarList.getList();
    let item = this["starItem" + (tmpList.length - 1)] as StarItem;
    if (item) {
      item.info = sInfo;
      this._displayStarDic.add(sInfo.pos, item);
    }
  }

  public __delDisplayStar(data: any) {
    if (!data) return;
    Logger.xjy("[StarWnd]__delDisplayStar", data, this.starModel.delWay);
    let sInfo = data[1] as StarInfo;
    if (!sInfo) return;
    let displayStar: StarItem = this._displayStarDic[sInfo.pos];
    if (!displayStar || displayStar.isDisposed) return;

    this.canClose = false;
    let time = 0;
    let timeAdd = 0.3;
    if (this.starModel.delWay == StarModel.PICK_UP) {
      let rate: number =
        this.moveDstPos.distance(displayStar.x, displayStar.y) /
        this.moveDstPos.distance(0, 0);
      time = 1.5 * rate;
      timeAdd = 1;
      TweenMax.to(displayStar, time, {
        x: this.moveDstPos.x,
        y: this.moveDstPos.y,
        onComplete: this.__moveComplete.bind(this),
        onCompleteParams: [displayStar, sInfo.pos],
      });
    } else if (this.starModel.delWay == StarModel.SELL) {
      time = 1;
      TweenMax.to(displayStar, time, {
        scaleX: 1.5,
        scaleY: 1.5,
        alpha: 0,
        onComplete: this.__moveComplete.bind(this),
        onCompleteParams: [displayStar, sInfo.pos],
      });
    } else {
      this.__moveComplete(displayStar, sInfo.pos);
      Laya.timer.frameLoop(1, this, this.refreshStarList);
    }

    Laya.timer.clear(this, this.refreshStarList);
    Laya.timer.once((time + timeAdd) * 1000, this, this.refreshStarList);
  }

  public __moveComplete(displayStar: StarItem, pos: number) {
    this.canClose = true;
    displayStar.alpha = 1;
    displayStar.scaleX = 1;
    displayStar.scaleY = 1;
    displayStar.info = null;
    // 移动完之后设置到原始位置
    let srcPos = this._displayStarPosDic[displayStar.index];
    if (srcPos) {
      displayStar.x = srcPos.x;
      displayStar.y = srcPos.y;
    }
    this._displayStarDic.del(pos);
    // let tempStarNum: number = this.starManager.tempStarList.getList().length;
    // if (tempStarNum == 0 && _mask.alpha != 0) TweenMax.to(_mask, 1, { alpha: 0 });  //如果临时星运数量为0, 则移除黑色蒙板
  }

  public __starComposeHandler(sInfo: StarInfo) {
    Logger.xjy("[StarWnd]__starComposeHandler", sInfo);
    if (
      sInfo &&
      sInfo.bagType == StarBagType.TEMP &&
      this._displayStarDic[sInfo.pos]
    ) {
      this._displayStarDic[sInfo.pos].data = sInfo;
    }

    this.refreshStarList();
  }

  // 刷新星球
  public __randomPosHandler() {
    let siteList: any[] = this.starManager.randomPosList;
    let siteListLen: number = siteList ? siteList.length : 0;
    Logger.xjy("[StarWnd]__randomPosHandler", siteList);
    if (siteListLen == 0) return;

    let maxOpenIndex = 0;
    for (let index: number = 0; index < siteListLen; index++) {
      let item = this.planetList.getChildAt(index) as PlanetItem;
      item.txtCostGold.text = String(StarModel.MAKE_STAR_COSTS[index]);
      item.setAniCtrl(0);
      item.setEnabled(siteList[index] == 1);
      if (siteList[index] == 1) {
        maxOpenIndex = index;
        if (index >= 1)
          UIFilter.normal(this.arrowList.getChildAt(index - 1).asCom);
      } else {
        if (index >= 1)
          UIFilter.gray(this.arrowList.getChildAt(index - 1).asCom);
      }
    }
    let shineItem = this.planetList.getChildAt(maxOpenIndex) as PlanetItem;
    shineItem.setAniCtrl(1);
  }

  // public __starFreeCountChangeHandler() {
  //     this.countText.text = LangManager.Instance.GetTranslation("StarWnd.TodayFreeTip", DataCommonManager.playerInfo.starFreeCount);
  // }

  public __starPointUpdateHandler() {
    this.pointText.text =
      LangManager.Instance.GetTranslation(
        "public.colon",
        LangManager.Instance.GetTranslation("answer.view.rank.score"),
      ) + String(DataCommonManager.playerInfo.starPoint);
  }

  // 一键拾取
  private oKreceiveBtnClick() {
    let playerStarNum: number = this.starManager.getPlayerStarListNum();
    if (
      playerStarNum >=
      PlayerModel.ORIGINAL_OPEN_BAG_COUNT +
        DataCommonManager.playerInfo.starBagCount
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("star.view.StarIconView.command01"),
      );
    } else {
      this.starModel.quickPickupClick();
    }
  }
  // 一键卖出
  private oKsaleBtnClick() {
    if (this.oKsaleBtnClickAlert()) {
      FrameCtrlManager.Instance.open(
        EmWindow.StarOperate,
        this.oKsaleBtnClickAlertBack.bind(this),
      );
    } else {
      let type = StarManager.Instance.starModel.starQuickSellType;
      StarManager.Instance.starModel.quickSellClick(type);
    }
  }

  private oKsaleBtnClickAlert(): boolean {
    return StarModel.needOpenQuickSellWnd;
    // let preDate: Date = new Date(SharedManager.Instance.starQuickSellCheckDate);
    // let now: Date = new Date();
    // let outdate: boolean = false;
    // let check: boolean = SharedManager.Instance.starQuickSell;
    // if (!check || preDate.getDate() < now.getDate()) {
    //     outdate = true;
    // }
    // return outdate;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private oKsaleBtnClickAlertBack(b: boolean, check: boolean) {
    if (check) {
      StarModel.needOpenQuickSellWnd = false;
    }
    // if (b) {
    // SharedManager.Instance.starQuickSell = check;
    // SharedManager.Instance.starQuickSellCheckDate = new Date();
    // SharedManager.Instance.saveStarQuickSellCheck();
    // }
  }

  // 一键占星
  private oKstarBtnClick() {
    let userGrade = this.thane.grades;
    // let hasVipPrevilige = VIPManager.Instance.model.isOpenPrivilege(VipPrivilegeType.STAR, VIPManager.Instance.model.vipInfo.VipGrade);
    // if (!hasVipPrevilige && userGrade < OpenGrades.ONEKEY_STAR) {
    //     let needGrade: number = VIPManager.Instance.model.getMinGradeHasPrivilege(VipPrivilegeType.STAR);
    //     let str: string = "";
    //     if (!hasVipPrevilige) {
    //         if (needGrade == 0) {
    //             str = LangManager.Instance.GetTranslation("armyII.viewII.rune.FastRuneItem.OpenTipTxt1");
    //         } else {
    //             str = LangManager.Instance.GetTranslation("star.view.DisplayStarView.VIPcommand02", OpenGrades.ONEKEY_STAR, needGrade);
    //         }
    //     } else {
    //         str = LangManager.Instance.GetTranslation("star.view.DisplayStarView.VIPcommand02", OpenGrades.ONEKEY_STAR, needGrade);
    //     }
    //     MessageTipManager.Instance.show(str);
    //     return;
    // }

    // if (userGrade < OpenGrades.ONEKEY_STAR) {
    //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", OpenGrades.ONEKEY_STAR))
    //     return;
    // }
    if (
      this.starManager.tempStarList.getList().length >=
      StarModel.MAX_DISPLAY_STAR
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "star.view.DisplayStarView.command01",
        ),
      );
      return;
    }
    if (ResourceManager.Instance.gold.count < StarModel.MAKE_STAR_COSTS[0]) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("star.view.MakeStarView.command02"),
      );
      return;
    }
    this.starManager.sendRandomStar(-1);
  }

  // 一键合成
  private oKcomposeBtnClick() {
    this.starManager.oneKeyCompose(StarBagType.TEMP);
  }

  private exchangeBtnClick() {
    if (this.canClose)
      FrameCtrlManager.Instance.open(
        EmWindow.ShopCommWnd,
        { shopType: ShopModel.STAR_SHOP, returnToWin: EmWindow.Star },
        null,
        EmWindow.Star,
      );
  }

  private starBagBtnClick() {
    if (this.canClose)
      FrameCtrlManager.Instance.open(
        EmWindow.StarBag,
        { returnToWin: EmWindow.Star },
        null,
        EmWindow.Star,
      );
  }

  private helpBtnClick() {
    let title: string = LangManager.Instance.GetTranslation(
      "star.view.StarHelpFrame.title",
    );
    let content: string = LangManager.Instance.GetTranslation(
      "star.view.StarHelpFrame.helpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private isCooling: boolean = false; //避免疯狂频繁点击导致的bug
  private __onPlanetClickItem(item: PlanetItem) {
    if (this.isCooling) return;
    this.isCooling = true;
    setTimeout(() => {
      this.isCooling = false;
    }, 600);
    Logger.xjy("[StarWnd]onPlanetClickItem", item);
    if (!item.getEnabled()) return;

    let site: number = this.planetList.getChildIndex(item);
    let goldCnt = ResourceManager.Instance.gold.count;
    if (goldCnt < StarModel.MAKE_STAR_COSTS[site]) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("star.view.MakeStarView.command02"),
      );
      return;
    }
    if (
      this.starManager.tempStarList.getList().length >=
      StarModel.MAX_DISPLAY_STAR
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("star.view.MakeStarView.command03"),
      );
      return;
    }
    AudioManager.Instance.playSound(SoundIds.STAR_SOUND);
    if (goldCnt < StarModel.MAKE_STAR_COSTS[0]) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("star.view.MakeStarView.command02"),
      );
      return;
    }

    this.starManager.sendRandomStar(site);
  }

  /**自动占星 */
  private autoStarBtnClick() {
    let vipPrevilige = VIPManager.Instance.model.isOpenPrivilege(
      VipPrivilegeType.AUTO_STAR,
    );
    if (!vipPrevilige) {
      let minGrade: number = VIPManager.Instance.model.getMinGradeHasPrivilege(
        VipPrivilegeType.AUTO_STAR,
      );
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "star.view.autoStar.command",
          minGrade.toString(),
        ),
      );
    } else {
      let selfData: any = SharedManager.Instance.getAutoStarSetting();
      let costValue = 0;
      let sellMaxQuality = 0;
      let composeMaxQuality = 0;
      if (selfData) {
        costValue = StarModel.AUTO_COST[selfData.autoCost];
        sellMaxQuality = StarModel.AUTO_SELL[selfData.autoSell];
        composeMaxQuality = StarModel.AUTO_COMPOSE[selfData.autoCompose];
      } else {
        costValue = StarModel.AUTO_COST[0];
        sellMaxQuality = StarModel.AUTO_SELL[0];
        composeMaxQuality = StarModel.AUTO_COMPOSE[0];
      }
      this.starManager.sendBtnAutoStar(
        costValue,
        sellMaxQuality,
        composeMaxQuality,
      );
    }
  }

  /**自动占星设置 */
  private autoSettingBtnClick() {
    FrameCtrlManager.Instance.open(EmWindow.StarAutoSetting);
  }

  private get gold(): ResourceData {
    return ResourceManager.Instance.gold;
  }

  protected OnBtnClose() {
    if (this.canClose) {
      super.OnBtnClose();
    }
  }

  private get starManager() {
    return StarManager.Instance;
  }

  private get starModel() {
    return StarManager.Instance.starModel;
  }

  dispose() {
    Laya.timer.clear(this, this.refreshStarList);
    this.planetList.off(fgui.Events.CLICK_ITEM, this, this.__onPlanetClickItem);
    this.gold.removeEventListener(
      ResourceEvent.RESOURCE_UPDATE,
      this.resourcesUpdateHandler,
      this,
    );
    super.dispose();
    // this.starModel.quickPickupClick(); //自动拾取
  }
}
