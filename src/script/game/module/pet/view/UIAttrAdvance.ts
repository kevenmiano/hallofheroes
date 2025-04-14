/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2023-10-10 15:54:36
 * @LastEditors: jeremy.xu
 * @Description: 进阶
 */

import LangManager from "../../../../core/lang/LangManager";
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import { t_s_pettemplateData } from "../../../config/t_s_pettemplate";
import { BagEvent } from "../../../constant/event/NotificationEvent";
import ConfigInfosTempInfo from "../../../datas/ConfigInfosTempInfo";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { SharedManager } from "../../../manager/SharedManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { GoodsCheck } from "../../../utils/GoodsCheck";
import { PetData } from "../data/PetData";
import { t_s_upgradetemplateData } from "../../../config/t_s_upgradetemplate";
import PetCtrl from "../control/PetCtrl";
import UIButton from "../../../../core/ui/UIButton";
import FUI_PetAttrItem from "../../../../../fui/Pet/FUI_PetAttrItem";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import UIManager from "../../../../core/ui/UIManager";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import PetModel from "../data/PetModel";
import { ConfigManager } from "../../../manager/ConfigManager";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import FUIHelper from "../../../utils/FUIHelper";
import BaseTipItem from "../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { NumericStepper } from "../../../component/NumericStepper";

export default class UIAttrAdvance extends BaseFguiCom {
  public simBox: NumericStepper;
  /**开启数量变更处理 */
  private _openNumberChangeHandler: Laya.Handler;
  private txtNextDesc: fgui.GLabel;
  private txtMaxLevelDesc: fgui.GLabel;
  private txtBlessAdd: fgui.GLabel;
  private txtBlessProg: fgui.GLabel;
  private txtCost: fgui.GLabel;
  private txtCostAdvanced: fgui.GLabel;
  private txtCurColor: fgui.GLabel;
  private txtNextColor: fgui.GLabel;
  private btnAdvanced: UIButton;
  private btnNormal: UIButton;
  private btnLastClick: UIButton; //记录最后一次点击 是普通 还是高级

  private gNextStarInfo: fgui.GGroup;
  private progBless: fgui.GProgressBar;
  private curList: fgui.GList;
  private nextList: fgui.GList;
  private itemQualification0: FUI_PetAttrItem;
  private itemQualification1: FUI_PetAttrItem;
  private itemQualification2: FUI_PetAttrItem;
  private itemQualification3: FUI_PetAttrItem;
  private itemQualification4: FUI_PetAttrItem;

  // private txtCurrMaxMes: fgui.GLabel;
  // private _critMc: MovieClip;    //暴击动画
  // private _priticeMc: MovieClip; //粒子动画
  // private _upgradeMc: MovieClip; //升阶动画
  // private _lightMc: MovieClip;
  // private _fightMc: MovieClip;
  // private _playFightMc: boolean = false;
  // private _petFight: number;

  private _NumOfAdvanced: number = 10;

  private _OneOfAdvanced: number = 1;
  public tipItem1: BaseTipItem;
  public tipItem2: BaseTipItem;
  private get NumOfAdvanced(): number {
    return this._NumOfAdvanced * this._OneOfAdvanced;
  }

  private OnceExp: number = 1; //一次培养经验
  private MaxEverNum: number = 5;

  private _isCrit: boolean;
  private _canPlayMovie: boolean;
  private _isUpgrade: boolean = false;
  private _critValue: number = 0;
  private _lastGp: number;
  private _lastGrade: number = 0;
  private _tempObj: any;

  constructor(comp: fgui.GComponent) {
    super(comp);
    this.initView();
    this.addEvent();
  }

  private initView() {
    let colon = LangManager.Instance.GetTranslation("public.colon2");
    this.itemQualification0.title.text =
      LangManager.Instance.GetTranslation("pet.growthRate") + colon;
    this.itemQualification1.title.text =
      LangManager.Instance.GetTranslation("pet.strengthCoe") + colon;
    this.itemQualification2.title.text =
      LangManager.Instance.GetTranslation("pet.armorCoe") + colon;
    this.itemQualification3.title.text =
      LangManager.Instance.GetTranslation("pet.intellectCoe") + colon;
    this.itemQualification4.title.text =
      LangManager.Instance.GetTranslation("pet.staminaCoe") + colon;
    this.tipItem1.setInfo(
      TemplateIDConstant.TEMP_ID_PET_GROWTH_STONE,
      true,
      FUIHelper.getItemURL("Base", "Icon_Unit_Sylph_L"),
    );
    // this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_PET_GROWTH_STONE);
    this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_PET_GROWTH_STONE);
  }

  private addEvent() {
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.__updateNumberHandler,
      this,
    );
  }

  private removeEvent() {
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.__updateNumberHandler,
      this,
    );
  }

  private _lastCickTime1: number = 0;
  private btnNormalClick() {
    let time: number = new Date().getTime();
    if (time - this._lastCickTime1 < 400) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.view.ActivityItem.command01",
        ),
      );
      return;
    } else {
      this._lastCickTime1 = time;
    }
    if (!PetModel.hasPet) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("pet.PetFrame.notHasPet"),
      );
    }
    if (!this.data) return;
    if (!this.data.qualityUpgradeTemplateInfo) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("PetAdvancedView.tipCommand04"),
      );
      return;
    }

    this.checkPointForNormal();
  }

  private checkPointForNormal() {
    if (!this.checkGrowthStone(this.NumOfAdvanced)) {
      return;
    }

    this.checkPointForNormalBack(true, true, false);

    // if (SharedManager.Instance.checkIsExpired(SharedManager.Instance.petNormalAdvancedAlertDate)) {
    // 	let cost: number = this.getOnceAdvancedCost();
    // 	let content: string = LangManager.Instance.GetTranslation("PetAdvancedView.tipCommand00", this.NumOfAdvanced, this.NumOfAdvanced);
    // 	let state = 2;
    // 	UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
    // 		state: state,
    // 		content: content,
    // 		backFunction: (check1: boolean, check2: boolean) => {
    // 			this.checkPointForNormalBack(true, check1, false);
    // 		},
    // 		closeFunction: () => {
    // 			this.checkPointForNormalBack(false, false, false);
    // 		},
    // 	});
    // } else {
    // 	this.checkWillBeBindForNormal(SharedManager.Instance.petNormalAdvanceUseBind);
    // }
  }

  private checkPointForNormalBack(
    b: boolean,
    check1: boolean,
    useBindPoint: boolean,
  ) {
    if (b) {
      if (check1) {
        SharedManager.Instance.petNormalAdvancedAlertDate = new Date();
        SharedManager.Instance.savePetNormalAdvancedAlertDate();

        SharedManager.Instance.petNormalAdvanceUseBind = useBindPoint;
        SharedManager.Instance.savePetNormalAdvanceUseBind();

        SharedManager.Instance.petNormalAdvanceCanUsePetStrong =
          ConfigManager.info.PET_STRONG;
        SharedManager.Instance.savePetNormalAdvanceCanUsePetStrong();
      } else {
      }

      this.checkWillBeBindForNormal(useBindPoint);
    }
  }

  private checkWillBeBindForNormal(useBindPoint: boolean) {
    this._tempObj = { useBindPoint: useBindPoint, useGoodsType: 0, useFlag: 0 };

    this.doNormal(this._tempObj.useBindPoint, this._tempObj.useGoodsType);
  }

  /**
   *  [普通进阶] 检测是否会使用到绑定钻石
   * @param useBind 玩家是否选择使用绑定钻石
   *
   */
  private willUsedBindForNormal(useBind: boolean): number {
    let result: number = 0;
    let allGoods: any[] = GoodsManager.Instance.getBagGoodsByTemplateId(
      GoodsCheck.PET_GROWTH_STONE,
    );
    let useBindGoods: boolean = false;
    for (let index = 0; index < allGoods.length; index++) {
      const info = allGoods[index] as GoodsInfo;
      if (info.isBinds) {
        useBindGoods = true;
        break;
      }
    }
    if (useBindGoods) {
      result = 1; //优先使用物品 先对物品进行判断
    }
    if (
      useBind &&
      PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken > 0
    ) {
      result = 2;
    }
    return result;
  }

  /** [普通进阶] 玩家确认使用绑定物品  1.绑定物品 2.绑钻 */
  private checkUseBindForNoraml(useFlag: number) {
    this._tempObj.useFlag = useFlag;

    if (
      SharedManager.Instance.checkIsExpired(
        SharedManager.Instance.petadvanceWillbeBindCheckDate1,
      )
    ) {
      let content: string;
      if (useFlag == 1) {
        content = LangManager.Instance.GetTranslation(
          "GrowthInfoView.useBindGoodsTip",
        );
        content +=
          "\n" +
          LangManager.Instance.GetTranslation(
            "mainBar.view.VipCoolDownFrame.useGood",
          );
      } else {
        // 2
        content = LangManager.Instance.GetTranslation(
          "PetAdvancedView.useBindPointTip",
        );
      }

      SimpleAlertHelper.Instance.Show(
        null,
        null,
        null,
        content,
        null,
        null,
        this.checkUseBindForNoramlBack.bind(this),
      );
    } else {
      this.doNormal(
        this._tempObj.useBindPoint,
        SharedManager.Instance.petadvanceWillbeBindCheck1,
      );
    }
  }

  private checkUseBindForNoramlBack(result: boolean, flag: boolean) {
    if (!this._tempObj) return;
    if (this._tempObj.useFlag == 1 && !flag) {
      //使用物品
      this._tempObj.useGoodsType = 2;
    }
    this.doNormal(this._tempObj.useBindPoint, this._tempObj.useGoodsType);

    if (result) {
      SharedManager.Instance.petadvanceWillbeBindCheckDate1 = new Date();
      SharedManager.Instance.petadvanceWillbeBindCheck1 =
        this._tempObj.useGoodsType;

      SharedManager.Instance.savePetadvanceWillbeBindCheck1();
    }
  }

  private doNormal(useBindPoint: boolean, useGoodsType: number = 0) {
    if (!this.data) return;
    if (useGoodsType == 2) {
      //2表示只使用未绑定的物品
      useBindPoint = false;
    }
    let goodsCount: number = this.getGoodsCount(useGoodsType);
    if (goodsCount < 1) {
      // if (goodsCount < 1 && ConfigManager.info.PET_STRONG) {
      let cost: number = this.getOnceAdvancedCost();
      let hasMoney: number =
        PlayerManager.Instance.currentPlayerModel.playerInfo.point;
      if (useBindPoint) {
        hasMoney =
          PlayerManager.Instance.currentPlayerModel.playerInfo.allPoint;
      }
      if (hasMoney < cost) {
        RechargeAlertMannager.Instance.show();
        return;
      }
    }

    PetCtrl.trainGrowthRate(
      this.data.petId,
      this._NumOfAdvanced,
      useBindPoint,
      useGoodsType,
    );
    this.btnLastClick = this.btnNormal;
  }

  //===================================高级====================================//
  private _lastCickTime2: number = 0;
  private btnAdvancedClick() {
    let time: number = new Date().getTime();
    if (time - this._lastCickTime2 < 400) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.view.ActivityItem.command01",
        ),
      );
      return;
    } else {
      this._lastCickTime2 = time;
    }

    if (!PetModel.hasPet) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("pet.PetFrame.notHasPet"),
      );
    }
    if (!this.data) return;
    if (!this.data.qualityUpgradeTemplateInfo) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("PetAdvancedView.tipCommand04"),
      );
      return;
    }

    this.checkPointForSenior();
  }

  /**高级 */
  private checkPointForSenior() {
    // let switchChange = SharedManager.Instance.petSeniorAdvanceCanUsePetStrong != ConfigManager.info.PET_STRONG
    // let switchChange = SharedManager.Instance.petSeniorAdvanceCanUsePetStrong;
    if (
      SharedManager.Instance.checkIsExpired(
        SharedManager.Instance.petSeniorAdvancedAlertDate,
      )
    ) {
      let oneCost: number = this.getOnceAdvancedCost();
      let content: string = LangManager.Instance.GetTranslation(
        "PetAdvancedView.tipCommand01",
        this.NumOfAdvanced,
        this.NumOfAdvanced,
      );
      let state = 2;
      // if (ConfigManager.info.PET_STRONG) {
      //     content = LangManager.Instance.GetTranslation("PetAdvancedView.tipCommand03", oneCost * this.NumOfAdvanced, this.NumOfAdvanced);
      //     content += "\n" + LangManager.Instance.GetTranslation("PetAdvancedView.firstShenghunShi");
      //     state = 0
      // }
      UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
        state: state,
        content: content,
        backFunction: (check1: boolean, check2: boolean) => {
          this.checkPointForSeniorBack(true, check1, false);
        },
        closeFunction: () => {
          this.checkPointForSeniorBack(false, false, false);
        },
      });
    } else {
      this.checkWillBeBindForSenior(
        SharedManager.Instance.petSeniorAdvancedUseBind,
      );
    }
  }

  private checkPointForSeniorBack(
    b: boolean,
    check1: boolean,
    useBindPoint: boolean,
  ) {
    if (b) {
      if (check1) {
        SharedManager.Instance.petSeniorAdvancedAlertDate = new Date();
        SharedManager.Instance.savePetSeniorAdvancedAlertDate();

        SharedManager.Instance.petSeniorAdvancedUseBind = useBindPoint;
        SharedManager.Instance.savePetSeniorAdvancedUseBind();

        SharedManager.Instance.petSeniorAdvanceCanUsePetStrong =
          ConfigManager.info.PET_STRONG;
        SharedManager.Instance.savePetSeniorAdvanceCanUsePetStrong();
      }

      this.checkWillBeBindForSenior(useBindPoint);
    }
  }

  private checkWillBeBindForSenior(useBindPoint: boolean) {
    if (!this.checkGrowthStone(this.NumOfAdvanced)) {
      return;
    }
    this._tempObj = { useBindPoint: useBindPoint, useGoodsType: 0, useFlag: 0 };

    // //检测是否会变为绑定
    // let useFlag: number = this.willUsedBindForSenior(useBindPoint);
    // if (!this._data.isBind && useFlag > 0) {
    //     this.checkUseBindForSenior(useFlag);
    //     return;
    // }
    this.doSenior(this._tempObj.useBindPoint, this._tempObj.useGoodsType);
  }

  private willUsedBindForSenior(useBind: boolean): number {
    let result: number = 0;
    let allGoods: any[] = GoodsManager.Instance.getBagGoodsByTemplateId(
      GoodsCheck.PET_GROWTH_STONE,
    );
    let useBindGoods: boolean = false;
    for (let index = 0; index < allGoods.length; index++) {
      const info = allGoods[index] as GoodsInfo;
      if (info.isBinds) {
        useBindGoods = true;
        break;
      }
    }
    if (useBindGoods) {
      result = 1; //优先使用物品 先对物品进行判断
    }
    if (
      useBind &&
      PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken > 0
    ) {
      result = 2;
    }
    return result;
  }

  /** [高级进阶] 玩家确认使用绑定钻石 */
  private checkUseBindForSenior(useFlag: number) {
    this._tempObj.useFlag = useFlag;

    if (
      SharedManager.Instance.checkIsExpired(
        SharedManager.Instance.petadvanceWillbeBindCheckDate2,
      )
    ) {
      let content: string;
      if (useFlag == 1) {
        content = LangManager.Instance.GetTranslation(
          "GrowthInfoView.useBindGoodsTip",
        );
        content +=
          "\n" +
          LangManager.Instance.GetTranslation(
            "mainBar.view.VipCoolDownFrame.useGood",
          );
      } else {
        // 2
        content = LangManager.Instance.GetTranslation(
          "PetAdvancedView.useBindPointTip",
        );
      }
      SimpleAlertHelper.Instance.Show(
        null,
        null,
        null,
        content,
        null,
        null,
        this.checkUseBindForSeniorBack.bind(this),
      );
    } else {
      this.doSenior(
        this._tempObj.useBindPoint,
        SharedManager.Instance.petadvanceWillbeBindCheck2,
      );
    }
  }

  /** [高级进阶] 玩家确认使用绑定钻石回调 */
  private checkUseBindForSeniorBack(result: boolean, useBind: boolean) {
    if (!this._tempObj) return;
    if (this._tempObj.useFlag == 1 && !useBind) {
      //使用物品
      this._tempObj.useGoodsType = 2;
    }
    this.doSenior(this._tempObj.useBindPoint, this._tempObj.useGoodsType);

    if (result) {
      SharedManager.Instance.petadvanceWillbeBindCheckDate2 = new Date();
      SharedManager.Instance.petadvanceWillbeBindCheck2 =
        this._tempObj.useGoodsType;

      SharedManager.Instance.savePetadvanceWillbeBindCheck2();
    }
  }

  private doSenior(useBindPoint: boolean, useBindGoodsType: number) {
    if (useBindGoodsType == 2) {
      useBindPoint = false;
    }
    let goodsCount: number = this.getGoodsCount(useBindGoodsType);
    if (goodsCount < this.NumOfAdvanced) {
      // if (goodsCount < this.NumOfAdvanced && ConfigManager.info.PET_STRONG) {
      let oneCost: number = this.getOnceAdvancedCost();
      let cost: number = oneCost * (this.NumOfAdvanced - goodsCount);
      let hasMoney: number =
        PlayerManager.Instance.currentPlayerModel.playerInfo.point;
      if (useBindPoint) {
        hasMoney =
          PlayerManager.Instance.currentPlayerModel.playerInfo.allPoint;
      }
      if (hasMoney < cost) {
        RechargeAlertMannager.Instance.show();
        return;
      }
    }
    PetCtrl.trainGrowthRate(this.data.petId, 2, useBindPoint, useBindGoodsType);
    this.btnLastClick = this.btnAdvanced;
  }

  /**当前圣魂石数量 */
  private get growthStoneCount(): number {
    let num: number = GoodsManager.Instance.getGoodsNumByTempId(
      GoodsCheck.PET_GROWTH_STONE,
    );
    return num;
  }

  private __updateNumberHandler() {
    this.txtCost.text = this._OneOfAdvanced.toString();
    this.txtCostAdvanced.text = this.NumOfAdvanced.toString();

    this._openNumberChangeHandler && this._openNumberChangeHandler.recover();
    this._openNumberChangeHandler = Laya.Handler.create(
      this,
      this.onOpenNumberChangeHandler,
      null,
      false,
    );

    this._NumOfAdvanced =
      this.growthStoneCount < this._NumOfAdvanced
        ? this.growthStoneCount < 1
          ? 1
          : this.growthStoneCount
        : this._NumOfAdvanced;
    this.simBox.show(
      0,
      this._NumOfAdvanced,
      1,
      this.growthStoneCount < 1 ? 1 : this.growthStoneCount,
      this.growthStoneCount < 1 ? 1 : this.growthStoneCount,
      10,
      this._openNumberChangeHandler,
    );
  }

  private _data: PetData;

  public get data(): PetData {
    return this._data;
  }

  public set data(value: PetData) {
    if (value && this._data && value.petId != this._data.petId) {
      this._NumOfAdvanced = 10;
    }

    if (this._data && this._data == value && this.btnLastClick) {
      this._canPlayMovie = true;
      let oldExp: number = this.calcTotalExp(this._lastGrade, this._lastGp);
      let newExp: number = this.calcTotalExp(value.quality, value.qualityGp);
      let dExp: number = newExp - oldExp;
      if (dExp != 0) {
        this._isCrit = false;
        if (this.btnLastClick == this.btnNormal) {
          this._isCrit = dExp > this.OnceExp;
        } else if (this.btnLastClick == this.btnAdvanced) {
          this._isCrit = dExp > this.OnceExp * this.NumOfAdvanced;
        }
        this._critValue = dExp;
        this._isUpgrade = this._lastGrade != this._data.quality;
      } else {
        this.btnLastClick = null;
        this._canPlayMovie = false;
        this._isCrit = false;
      }
    } else {
      this.btnLastClick = null;
      this._canPlayMovie = false;
      this._isCrit = false;
      this._lastGp = 0;
      this._lastGrade = 0;
    }
    this._data = value;
    if (this._data) {
      this.refresh();
    } else {
      this.resetView();
    }

    this._openNumberChangeHandler && this._openNumberChangeHandler.recover();
    this._openNumberChangeHandler = Laya.Handler.create(
      this,
      this.onOpenNumberChangeHandler,
      null,
      false,
    );
    this.simBox.show(
      0,
      this._NumOfAdvanced,
      1,
      this.growthStoneCount < 1 ? 1 : this.growthStoneCount,
      this.growthStoneCount < 1 ? 1 : this.growthStoneCount,
      10,
      this._openNumberChangeHandler,
    );
  }

  /**数量变更处理 */
  private onOpenNumberChangeHandler(value: number) {
    this._NumOfAdvanced = value;
  }

  private calcTotalExp(grade: number, curExp: number): number {
    let arr: any[] =
      PetData.qualityUpgradeTemplates[this.data.template.Property2];
    let gp: number = curExp;
    for (let i: number = 0; i < grade; i++) {
      if (i >= arr.length) continue;
      gp += Number(arr[i].Data);
    }
    return gp;
  }

  private refresh() {
    let current: t_s_upgradetemplateData =
      this._data.currentQualityUpgradeTemplateInfo;
    let next: t_s_upgradetemplateData = this._data.qualityUpgradeTemplateInfo;

    if (next && current) {
      // if (this._data.temQuality % 5 == 0) {
      //     this._oldAttrView.frame = this._data.quality;
      //     this._newAttrView.frame = this._data.quality + 1;
      // }
      // else {
      //     this._newAttrView.frame = this._oldAttrView.frame = this._data.quality;
      // }

      let nextQuality: number = this._data.temQuality + 1;
      let temp: t_s_pettemplateData = this._data.template;
      let nextCoeStrengthLimit: number = PetData.calculateCoeLimit(
        temp,
        nextQuality,
        "PowerCoeLimit",
      );
      let nextCoeArmorLimit: number = PetData.calculateCoeLimit(
        temp,
        nextQuality,
        "ArmorCoeLimit",
      );
      let nextCoeIntellectLimit: number = PetData.calculateCoeLimit(
        temp,
        nextQuality,
        "IntelCoeLimit",
      );
      let nextCoeStaminaLimit: number = PetData.calculateCoeLimit(
        temp,
        nextQuality,
        "PhysiCoeLimit",
      );

      let nextCoeStrength: number = PetData.calculateCoeLimitMin(
        this._data.coeStrength,
        temp,
        nextQuality,
        "CoeStrength",
      );
      let nextCoeArmor: number = PetData.calculateCoeLimitMin(
        this._data.coeArmor,
        temp,
        nextQuality,
        "CoeArmor",
      );
      let nextCoeIntellect: number = PetData.calculateCoeLimitMin(
        this._data.coeIntellect,
        temp,
        nextQuality,
        "CoeIntellect",
      );
      let nextCoeStamina: number = PetData.calculateCoeLimitMin(
        this._data.coeStamina,
        temp,
        nextQuality,
        "CoeStamina",
      );

      this.itemQualification0.txtCurValue.text =
        this._data.growthRate.toString();
      this.itemQualification1.txtCurValue.text =
        this._data.coeStrength + " / " + this._data.coeStrengthLimit;
      this.itemQualification2.txtCurValue.text =
        this._data.coeArmor + " / " + this._data.coeArmorLimit;
      this.itemQualification3.txtCurValue.text =
        this._data.coeIntellect + " / " + this._data.coeIntellectLimit;
      this.itemQualification4.txtCurValue.text =
        this._data.coeStamina + " / " + this._data.coeStaminaLimit;

      this.itemQualification0.txtNextValue.text = this._data
        .getGrowthRate(nextQuality)
        .toString();
      this.itemQualification1.txtNextValue.text =
        nextCoeStrength + " / " + nextCoeStrengthLimit;
      this.itemQualification2.txtNextValue.text =
        nextCoeArmor + " / " + nextCoeArmorLimit;
      this.itemQualification3.txtNextValue.text =
        nextCoeIntellect + " / " + nextCoeIntellectLimit;
      this.itemQualification4.txtNextValue.text =
        nextCoeStamina + " / " + nextCoeStaminaLimit;
    } else {
      //满级已经没有模板了
      this.itemQualification0.txtCurValue.text =
        this._data.growthRate.toString();
      this.itemQualification1.txtCurValue.text =
        this._data.coeStrength + " / " + this._data.coeStrengthLimit;
      this.itemQualification2.txtCurValue.text =
        this._data.coeArmor + " / " + this._data.coeArmorLimit;
      this.itemQualification3.txtCurValue.text =
        this._data.coeIntellect + " / " + this._data.coeIntellectLimit;
      this.itemQualification4.txtCurValue.text =
        this._data.coeStamina + " / " + this._data.coeStaminaLimit;

      this.itemQualification0.txtNextValue.text = "";
      this.itemQualification1.txtNextValue.text = "";
      this.itemQualification2.txtNextValue.text = "";
      this.itemQualification3.txtNextValue.text = "";
      this.itemQualification4.txtNextValue.text = "";
    }

    this.checkReachMaxLevel(Boolean(next));

    this.curList.removeChildrenToPool();
    this.nextList.removeChildrenToPool();
    if (next) {
      this.refreshStarList(this._data, this._data.temQuality % 5, 1);
      if (this._data.temQuality <= PetData.MAX_TEM_QUALITY - 1) {
        this.refreshStarList(this._data, (this._data.temQuality + 1) % 5, 2);
      }

      this.txtBlessProg.text = this._data.qualityGp + " / " + next.Data;
      this.progBless.value = Math.floor(
        (this._data.qualityGp / next.Data) * 100,
      );
    } else {
      this.refreshStarList(this._data, 0, 1);
      this.txtBlessProg.text = "Max";
      this.progBless.value = 100;
    }

    this.txtCurColor.text = PetData.getQualityDesc(this._data.quality - 1);
    this.txtCurColor.color = PetData.getQualityColor(this._data.quality - 1);

    let bReachNextLevel = this._data.temQuality % 5 == 0;
    let quality = bReachNextLevel ? this._data.quality : this._data.quality - 1;
    this.txtNextColor.text = PetData.getQualityDesc(quality);
    this.txtNextColor.color = PetData.getQualityColor(quality);

    // if (this._isUpgrade) {
    //     this._upgradeMc.visible = true;
    //     this._upgradeMc.gotoAndPlay(1);
    //     this._isUpgrade = false;
    // }
    this._lastGrade = this._data.quality;
    this._lastGp = this._data.qualityGp;

    // if (this._canPlayMovie) {
    //     this.playMovieClip(frame, this._isCrit, this._critValue);
    //     this._isCrit = false;
    //     this._critValue = 0;
    //     this.btnLastClick = null;
    // } else {
    //     // this._blessBar.setFrame(frame);
    // }

    this.__updateNumberHandler();
    // this.fightChange(this._data.fightPower);
  }

  private refreshStarList(petData: PetData, mod: number, type?: number) {
    let starIcon = PetData.getQualityStarIcon(petData.quality);
    if (mod != 0) {
      for (let i: number = 0; i < this.MaxEverNum; i++) {
        let item;
        if (type == 1) {
          item = this.curList.addItemFromPool().asCom;
          item.getController("cShowStar").selectedIndex = i < mod ? 0 : 1;
        } else if (type == 2) {
          if (mod == 1) {
            starIcon = PetData.getQualityStarIcon(petData.quality + 1);
          }
          // 紫色5星 进阶 显示橙色5星
          if (petData.temQuality == PetData.MAX_TEM_QUALITY - 1) {
            mod = 5;
          }
          item = this.nextList.addItemFromPool().asCom;
          item.getController("cShowStar").selectedIndex = i < mod ? 0 : 1;
        }
        if (item && starIcon) {
          item.getChild("imgIcon").icon = FUIHelper.getItemURL(
            EmPackName.Base,
            starIcon,
          );
        }
      }
    } else {
      for (let i: number = 0; i < this.MaxEverNum; i++) {
        let item;
        if (type == 1) {
          item = this.curList.addItemFromPool().asCom;
          item.getController("cShowStar").selectedIndex = 0;
        } else if (type == 2) {
          item = this.nextList.addItemFromPool().asCom;
          item.getController("cShowStar").selectedIndex = 0;
        }
        if (item && starIcon) {
          item.getChild("imgIcon").icon = FUIHelper.getItemURL(
            EmPackName.Base,
            starIcon,
          );
        }
      }
    }
  }

  private _currentTimeLine: TimelineMax;
  private _timerId: number = 0;
  private _lastFrame: number = -1;
  public playMovieClip(frame: number, isCrit: boolean, value: number = 0) {
    // this.killTween();
    // if (this._timerId != 0) clearTimeout(this._timerId);
    // this._timerId = 0;
    // if (frame == 100 && frame == this._blessBar.movie.currentFrame) return;
    // if (this._lastFrame != -1) {
    //     this._blessBar.setFrame(this._lastFrame);
    //     this._lastFrame = frame;
    // }
    // let dx: number = 213 * frame / 100;
    // let bar: MovieClip = this._blessBar.movie;
    // let flicker: MovieClip = bar["flicker"] as MovieClip;
    // let light: MovieClip = flicker["light"] as MovieClip;
    // this._blessBar.addChild(bar);
    // if (this._priticeMc.parent) this._priticeMc.parent.removeChild(this._priticeMc);
    // if (this._critMc.parent) this._critMc.parent.removeChild(this._critMc);
    // if (this._lightMc.parent) this._lightMc.parent.removeChild(this._lightMc);
    // if (bar["pos"]) {
    //     if (isCrit) {
    //         bar["pos"].addChild(this._priticeMc);
    //         bar["pos"].addChild(this._critMc);
    //     } else {
    //         bar["pos"].addChild(this._lightMc);
    //     }
    // }
    // this._lightMc.gotoAndStop(1);
    // flicker.gotoAndStop(1);
    // this._critMc.gotoAndStop(1);
    // this._critMc["numberContainer"]["con"].addChild(this._numContainer);
    // this._critMc.visible = false;
    // this._priticeMc.gotoAndStop(1);
    // this._priticeMc.visible = false;
    // light.visible = false;
    // light.x = -40;
    // light.alpha = 1;
    // ObjectUtils.disposeAllChildren(this._numContainer);
    // if (isCrit) {
    //     NumberViewUtils.refreshValue(value, this._numContainer, this._critNumBitmapData, 32, 32, 20, 29, "0123456789");
    //     //				this.fightChange(value);
    //     //1.高亮进度条,  移动光片, 完成之后播放粒子 和暴击
    //     flicker.gotoAndPlay(1);
    //     light.visible = true;
    //     this._currentTimeLine = new TimelineMax({ onComplete: this.playCritMc });
    //     this._currentTimeLine.append(TweenMax.to(bar, 0.4, { frame: frame }));
    //     this._currentTimeLine.append(TweenMax.to(light, 0.4, { x: dx }), -0.4);
    //     this._currentTimeLine.append(TweenMax.to(light, 0.2, { alpha: 0 }), -0.2);
    // } else {
    //     //1.增长进度条  2.播放粒子动画
    //     this._currentTimeLine = new TimelineMax({ onComplete: this.removeLightMc });
    //     if (frame < this._blessBar.movie.currentFrame) {
    //         this._currentTimeLine.append(TweenMax.to(bar, 0.2, { frame: 100 }));
    //         this._currentTimeLine.append(TweenMax.fromTo(bar, 0.2, { frame: 1 }, { frame: frame }));
    //     }
    //     else {
    //         this._currentTimeLine.append(TweenMax.to(bar, 0.4, { frame: frame }));
    //     }
    //     this._lightMc.play();
    // }
    // this._currentTimeLine.play();
  }

  // private playParticeMc() {
  //     this.killTween();
  //     if (this._priticeMc) {
  //         this._priticeMc.visible = true;
  //         this._priticeMc.gotoAndPlay(1);
  //     }
  // }

  // private playCritMc() {
  //     this.killTween();
  //     this.playParticeMc();
  //     if (this._critMc) {
  //         this._critMc.visible = true;
  //         this._critMc.gotoAndPlay(1);
  //     }
  // }

  // private removeLightMc() {
  //     this.killTween();
  //     if (this._lightMc && this._lightMc.parent) {
  //         this._lightMc.gotoAndStop(1);
  //         this._lightMc.parent.removeChild(this._lightMc);
  //     }
  // }

  // private killTween() {
  //     if (this._currentTimeLine) {
  //         this._currentTimeLine.kill();
  //         this._currentTimeLine = null;
  //     }
  // }

  /**
   * @param type 0 所有 , 1 绑定, 2 未绑定
   * @return
   */
  private getGoodsCount(type: number = 0): number {
    let arr: any[] = GoodsManager.Instance.getBagGoodsByTemplateId(
      GoodsCheck.PET_GROWTH_STONE,
    );
    let count: number = 0;
    for (let index = 0; index < arr.length; index++) {
      const info = arr[index] as GoodsInfo;
      if (type == 0) {
        count += info.count;
      } else if (type == 1 && info.isBinds) {
        count += info.count;
      } else if (type == 2 && !info.isBinds) {
        count += info.count;
      }
    }
    return count;
  }

  private getOnceAdvancedCost(): number {
    let cost: number = 10;
    let temp: ConfigInfosTempInfo =
      TempleteManager.Instance.getConfigInfoByConfigName("pet_up_quality");
    if (temp) {
      cost = parseInt(temp.ConfigValue);
    }
    return cost;
  }

  public fightChange(value: number) {
    // if (this._petFight == value) return;
    // if (!this._playFightMc) {
    //     this._fightMc.gotoAndStop(24);
    //     NumberViewUtils.refreshValue(value, this._fightMc["new_power"], this._fightCapacityNumBD, 19, 25, 15, 19, "0123456789");
    //     this._petFight = value;
    //     this._playFightMc = true;
    //     return;
    // }
    // if (this._petFight > 0) {
    //     NumberViewUtils.refreshValue(this._petFight, this._fightMc["old_power"], this._fightCapacityNumBD, 19, 25, 15, 19, "0123456789");
    // }
    // NumberViewUtils.refreshValue(value, this._fightMc["new_power"], this._fightCapacityNumBD, 19, 25, 15, 19, "0123456789");
    // this._fightMc["shine1"].x = this._fightMc["shine2"].x = this._fightMc["new_power"].width / 2;
    // this._fightMc.gotoAndPlay(1);
    // this._petFight = value;
  }

  private checkReachMaxLevel(value: boolean) {
    this.txtMaxLevelDesc.visible = !value;
    this.gNextStarInfo.visible = value;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private checkGrowthStone(value: number): boolean {
    let userCount = this.growthStoneCount;
    if (userCount < value) {
      let info: ShopGoodsInfo =
        TempleteManager.Instance.getShopTempInfoByItemId(
          ShopGoodsInfo.PET_GROWTH_STONE_TEMPID,
          ShopGoodsInfo.PROP_GOODS,
        );
      if (info) {
        FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, {
          info: info,
          count: value,
        });
      } else {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("pet.lackProps"),
        );
      }
      return false;
    }
    return true;
  }

  public resetView() {
    this.btnLastClick = null;
    this.txtBlessAdd.text = "";
    this.progBless.value = 0;
    this.curList.removeChildrenToPool();
    this.nextList.removeChildrenToPool();

    this.itemQualification0.txtCurValue.text = "";
    this.itemQualification1.txtCurValue.text = "";
    this.itemQualification2.txtCurValue.text = "";
    this.itemQualification3.txtCurValue.text = "";
    this.itemQualification4.txtCurValue.text = "";
    this.itemQualification0.txtNextValue.text = "";
    this.itemQualification1.txtNextValue.text = "";
    this.itemQualification2.txtNextValue.text = "";
    this.itemQualification3.txtNextValue.text = "";
    this.itemQualification4.txtNextValue.text = "";
  }

  public dispose() {
    if (this._timerId != 0) clearTimeout(this._timerId);
    this._timerId = 0;
    this.removeEvent();
    super.dispose();
  }
}
