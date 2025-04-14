import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import LangManager from "../../../../core/lang/LangManager";
import LayerMgr from "../../../../core/layer/LayerMgr";
import ResMgr from "../../../../core/res/ResMgr";
import UIButton from "../../../../core/ui/UIButton";
import { EmLayer } from "../../../../core/ui/ViewInterface";
import { IconFactory } from "../../../../core/utils/IconFactory";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import GoldFlyEff from "../../../component/GoldFlyEff";
import { t_s_honorequipData } from "../../../config/t_s_honorequip";
import { t_s_upgradetemplateData } from "../../../config/t_s_upgradetemplate";
import { BagType } from "../../../constant/BagDefine";
import GoodsSonType from "../../../constant/GoodsSonType";
import OpenGrades from "../../../constant/OpenGrades";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { EmWindow } from "../../../constant/UIDefine";
import { UpgradeType } from "../../../constant/UpgradeType";
import {
  RuneEvent,
  TipsEvent,
} from "../../../constant/event/NotificationEvent";
import { FateRotarySkillInfo } from "../../../datas/FateRotarySkillInfo";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import CarnivalManager from "../../../manager/CarnivalManager";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";
import { FashionManager } from "../../../manager/FashionManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";
import { ConsortiaControler } from "../../consortia/control/ConsortiaControler";
import { ConsortiaStorageWnd } from "../../consortia/view/building/ConsortiaStorageWnd";
import FarmCtrl from "../../farm/control/FarmCtrl";
import FarmWnd from "../../farm/view/FarmWnd";
import HomeWnd from "../../home/HomeWnd";
import { EmMainToolBarBtnType } from "../../home/mainToolBar/EmMainToolBarBtnType";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";

export class BagHelper extends GameEventDispatcher {
  private static _Instance: BagHelper;

  constructor() {
    super();
  }

  public static get Instance(): BagHelper {
    if (!BagHelper._Instance) {
      BagHelper._Instance = new BagHelper();
    }
    return BagHelper._Instance;
  }

  public isSelling: boolean = false;

  /**
   * 是否可以使用的物品
   * */
  public static checkCanUseGoods(type: number): boolean {
    switch (type) {
      case GoodsSonType.SONTYPE_BUFFER:
      case GoodsSonType.SONTYPE_USEABLE:
      case GoodsSonType.SONTYPE_OPENBOX:
      case GoodsSonType.SONTYPE_BLOOD:
      case GoodsSonType.SONTYPE_COMPOSE:
      case GoodsSonType.SONTYPE_NOVICE_BOX:
      case GoodsSonType.SONTYPE_REWARD_CARD:
      case GoodsSonType.SONTYPE_RENAME_CARD:
      case GoodsSonType.SONTYPE_CONSORTIATIME_CARD:
      case GoodsSonType.SONTYPE_ROSE:
      case GoodsSonType.SONTYPE_MOUNT_CARD:
      case GoodsSonType.SONTYPE_PASSIVE_SKILL:
      case GoodsSonType.SONTYPE_PET_CARD:
      case GoodsSonType.SONTYPE_PET_EXP_BOOK:
      case GoodsSonType.SONTYPE_BOX:
      case GoodsSonType.SONTYPE_TREASURE_MAP:
      case GoodsSonType.SONTYPE_PET_LAND_TRANSFER:
      case GoodsSonType.SONTYPE_SINGLE_PASS_PROP:
      case GoodsSonType.SONTYPE_SINGLE_PASS_BUGLE:
      case GoodsSonType.SONTYPE_FIREWORK:
      // case GoodsSonType.SONTYPE_MAGIC_CARD:
      case GoodsSonType.SONTYPE_GEMMAZE_TREASURE_MAP:
      case GoodsSonType.OUTER_CITY_MAP_GOODS:
      case GoodsSonType.SONTYPE_SEX_CHANGE_CARD:
      case GoodsSonType.RESIST_GEM:
      case GoodsSonType.SONTYPE_SOUL_CRYSTAL: //灵魂水晶
      case GoodsSonType.SONTYPE_MOUNT_FOOD: //兽灵石
      case GoodsSonType.SONTYPE_PET_COST: //英灵凝神珠
      case GoodsSonType.SONTYPE_LEVEL_BOX: //等级宝箱
      case GoodsSonType.SONTYPE_APPELL: //称号
      case GoodsSonType.SONTYPE_MULTI_BOX: //多选宝箱
      case GoodsSonType.SONTYPE_POINT_CARD: //积分卡
      case GoodsSonType.SONTYPE_POINT_CUP: //
      case GoodsSonType.SONTYPE_HEADFRAME: //头像框
        return true;
      case GoodsSonType.SONTYPE_VIP_BOX:
        return true;
    }
    return false;
  }

  /**
   * 是否可以批量使用
   * @param info
   * @return
   *
   */
  public checkCanMulUse(info: GoodsInfo): boolean {
    return info.count >= 1;
  }

  /**播放金币、钻石获得特效 */
  public static playGoldEffect(
    imgUrl: string,
    count: number = 1,
    startPoint: Laya.Point = new Laya.Point(667, 375),
  ) {
    let item = new GoldFlyEff();
    item.mGap = 5;
    item.mCount = count;
    item.mMax = 16;
    item.mSource = imgUrl;
    let targetPos = new Laya.Point(275, 65);
    let pos = new Laya.Point(startPoint.x, startPoint.y);
    item.Play(
      new Laya.Rectangle(
        pos.x,
        pos.y,
        Math.abs(startPoint.x - targetPos.x),
        Math.abs(startPoint.y - targetPos.y),
      ),
      targetPos.x,
      targetPos.y,
    );
  }

  private callBack: Function;

  public playNewGoodsEffect(info: GoodsInfo, $callBack: Function = null) {
    this.callBack = $callBack;
    let path: string = IconFactory.getGoodsIconByTID(info.templateId);
    ResMgr.Instance.loadRes(path, (content: Laya.Texture) => {
      if (!content) {
        return;
      }

      if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
        return;
      }

      let mainToolBar = HomeWnd.Instance.getMainToolBar();
      if (mainToolBar.bFold) {
        mainToolBar.playAction(0);
      }
      let icon = new Laya.Sprite();
      icon.graphics.clear();
      icon.graphics.loadImage(path, 0, 0, 60, 60);
      icon.size(60, 60);
      icon.x = StageReferance.stage.width / 2;
      icon.y = StageReferance.stage.height / 2;
      let starPoint: Laya.Point = new Laya.Point(icon.x, icon.y);
      icon.mouseEnabled = icon.mouseEnabled = false;
      LayerMgr.Instance.addToLayer(icon, EmLayer.STAGE_TOP_LAYER);

      let bagBtn = HomeWnd.Instance.getMainToolBar().getBtnByType(
        EmMainToolBarBtnType.BAG,
      );
      let bagPoint = bagBtn.localToGlobal(0, 0);
      let offsetX = -18;
      let offsetY = -18;
      TweenMax.to(icon, 3, {
        bezier: [
          { x: starPoint.x, y: starPoint.y },
          { x: starPoint.x, y: starPoint.y - 100 },
          { x: bagPoint.x + offsetX, y: bagPoint.y + offsetY },
        ],
        scaleX: 0.6,
        scaleY: 0.6,
        orientToBezier: false,
        //@ts-expect-error: External dependencies
        ease: Quart.easeOut,
        onComplete: this._moveComplete,
        onCompleteParams: [icon],
      });
    });
  }

  private _moveComplete(icon: Laya.Sprite) {
    if (!icon || icon.destroyed) return;
    TweenMax.to(icon, 0.5, {
      alpha: 0,
      onComplete: (icon: Laya.Sprite) => {
        if (!icon || icon.destroyed) return;

        if (this.callBack) {
          this.callBack();
        }
        this.callBack = null;
        icon.removeSelf();
        ObjectUtils.disposeObject(icon);
      },
      onCompleteParams: [icon],
    });
  }

  /**
   * 当前正在打开的符文石背包类型0镶嵌背包 1 分解背包
   */
  public static OPEN_RUNE_BAG_TYPE = -1;

  public static isOpenConsortiaStorageWnd(): boolean {
    return FrameCtrlManager.Instance.isOpen(EmWindow.ConsortiaStorageWnd);
  }

  public static isOpenFashionWnd(): boolean {
    return FashionManager.Instance.isopenFashion;
    // return FrameCtrlManager.Instance.isOpen(EmWindow.FashionWnd);
  }
  public static isOpenBag(): boolean {
    return FrameCtrlManager.Instance.isOpen(EmWindow.SRoleWnd);
  }
  public static isOpenPlayerInfo(): boolean {
    return FrameCtrlManager.Instance.isOpen(EmWindow.PlayerInfoWnd);
  }

  /**
   *
   * @param info
   * @returns 玩家背包移动到公会保管箱
   */
  public static moveRoleBagToConsortiaBag(info: GoodsInfo, count: number = 1) {
    let str: string;
    if (!ConsortiaManager.Instance.model.caseBagCanUse) {
      str = LangManager.Instance.GetTranslation(
        "cell.mediator.consortiabag.ConsortiaBagDoubleClickMediator.operateErrorTips",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (info.templateInfo.SonType == GoodsSonType.SONTYPE_NOVICE_BOX) {
      return;
    }
    if (
      GoodsManager.Instance.isSellPos(info.pos) &&
      info.bagType == BagType.Player
    ) {
      return;
    }
    let to_pos: number = -1;
    let num: number = (
      FrameCtrlManager.Instance.getCtrl(
        EmWindow.Consortia,
      ) as ConsortiaControler
    ).model.currentCasecellNum;
    to_pos = this.check(num, info);
    if (to_pos == -1) {
      for (let j: number = 0; j < num; j++) {
        if (
          !GoodsManager.Instance.goodsListByPos.hasOwnProperty(
            j + "_" + 0 + "_" + BagType.Storage,
          )
        ) {
          to_pos = j;
          break;
        }
      }
    }
    if (to_pos != -1) {
      PlayerManager.Instance.moveBagToBag(
        info.bagType,
        info.objectId,
        info.pos,
        BagType.Storage,
        0,
        to_pos,
        count,
      );
      Laya.timer.once(100, this, () => {
        NotificationManager.Instance.sendNotification(
          TipsEvent.EQUIP_TIPS_HIDE,
        );
      });
      return;
    }
    str = LangManager.Instance.GetTranslation(
      "cell.mediator.consortiabag.ConsortiaBagDoubleClickMediator.command01",
    );
    MessageTipManager.Instance.show(str);
  }

  public static check(num: number, data: GoodsInfo): number {
    let wnd: ConsortiaStorageWnd = FrameCtrlManager.Instance.getCtrl(
      EmWindow.ConsortiaStorageWnd,
    ).view;
    for (let i: number = num - 1; i >= 0; i--) {
      let item: GoodsInfo = wnd.itemList[i];
      if (item && this.canSuperposition(item, data)) {
        return i;
      }
    }
    return -1;
  }

  public static canSuperposition(item: GoodsInfo, data: GoodsInfo): boolean {
    if (
      item.templateId == data.templateId &&
      item.templateInfo.MaxCount >= item.count + data.count &&
      item.isBinds == data.isBinds
    ) {
      return true;
    }
    return false;
  }

  /**公会保管箱移到玩家背包 */
  public static moveConsortiaToRoleBag(info: GoodsInfo, count: number = 1) {
    let to_pos: number = GoodsManager.Instance.findEmputyPos();
    if (to_pos == -1) {
      let str: string = LangManager.Instance.GetTranslation(
        "cell.mediator.consortiabag.ConsortiaCaseCellClickMediator.command05",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    PlayerManager.Instance.moveBagToBag(
      info.bagType,
      info.objectId,
      info.pos,
      BagType.Player,
      0,
      to_pos,
      count,
    );
    Laya.timer.once(100, this, () => {
      NotificationManager.Instance.sendNotification(TipsEvent.EQUIP_TIPS_HIDE);
    });
  }

  /**公会保管箱放入取出操作 */
  public static consortiaStorageOperate(info: GoodsInfo) {
    if (info) {
      let count: number = 0;
      if (info.bagType == BagType.Storage) {
        //公会保管箱移到到玩家背包
        count = GoodsManager.Instance.getBagCountByTempIdAndPos(
          BagType.Storage,
          info.templateInfo.TemplateId,
          info.pos,
        );
        // if (count > 1) {
        //     FrameCtrlManager.Instance.open(EmWindow.ConsortiaSplitWnd, [info, BagType.Storage]);
        // }
        // else {
        //     BagHelper.moveConsortiaToRoleBag(info,count);
        // }
        BagHelper.moveConsortiaToRoleBag(info, count);
      } else {
        // count = GoodsManager.Instance.getBagCountByTempIdAndPos(BagType.Player, info.templateInfo.TemplateId, info.pos);
        // if (count > 1) {
        //     FrameCtrlManager.Instance.open(EmWindow.ConsortiaSplitWnd, [info, BagType.Player]);
        // }
        // else {
        //     BagHelper.moveRoleBagToConsortiaBag(info);
        // }
        BagHelper.moveRoleBagToConsortiaBag(info, count);
      }
    }
  }

  /**符文石背包分解、升级操作 */
  public static operateRuneGem(info: GoodsInfo, type: number = 0) {
    if (info) {
      if (type == 0) {
        NotificationManager.Instance.sendNotification(
          RuneEvent.RUNE_GEM_RESOLVE,
          info,
        );
      } else {
        NotificationManager.Instance.sendNotification(
          RuneEvent.RUNE_GEM_UPGRADE,
          info,
        );
      }
    }
  }
  /**设置按钮文字 */
  public static getText(info: GoodsInfo): string {
    let str: string = "";
    if (info) {
      if (info.bagType == BagType.Storage) {
        str = LangManager.Instance.GetTranslation("consortia.storage.getout");
      } else {
        str = LangManager.Instance.GetTranslation("consortia.storage.putInt");
      }
    }
    return str;
  }

  /**批量放入公会仓库 */
  public static oneKeyMoveToConsortiaBag(array: Array<GoodsInfo>) {
    if (!array || array.length == 0) return;
    let str: string;
    if (!ConsortiaManager.Instance.model.caseBagCanUse) {
      str = LangManager.Instance.GetTranslation(
        "cell.mediator.consortiabag.ConsortiaBagDoubleClickMediator.operateErrorTips",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    let needCount: number = array.length; //需要的空格子数量
    let leftCount = this.checkConsortiaStorageLeftNum();
    if (needCount > leftCount) {
      //格子数不足
      str = LangManager.Instance.GetTranslation(
        "bagwnd.consortia.storage.numberNotEnlogh",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    SocketSendManager.Instance.sendOneMoveBagToBag(array);
  }

  /**公会宝箱空余格子数量 */
  public static checkConsortiaStorageLeftNum(): number {
    let totalCount: number = (
      FrameCtrlManager.Instance.getCtrl(
        EmWindow.Consortia,
      ) as ConsortiaControler
    ).model.currentCasecellNum;
    let hasGoodsCount: number = 0; //有物品的格子数量
    let wnd: ConsortiaStorageWnd = FrameCtrlManager.Instance.getCtrl(
      EmWindow.ConsortiaStorageWnd,
    ).view;
    for (let i: number = totalCount - 1; i >= 0; i--) {
      let item: GoodsInfo = wnd.itemList[i];
      if (item) {
        hasGoodsCount++;
      }
    }
    return totalCount - hasGoodsCount;
  }

  /**
   * 获取用户道具数量
   * @param templeteId 道具ID
   * @returns
   */
  public getUserCount(templeteId: number): number {
    let count = 0;
    templeteId = Number(templeteId);
    if (templeteId > 0) {
      count = GoodsManager.Instance.getBagCountByTempId(
        BagType.Player,
        templeteId,
      ); //只显示领主背包里的道具数量
    } else {
      switch (templeteId) {
        case TemplateIDConstant.TEMP_ID_GOLD:
          count = ResourceManager.Instance.gold.count;
          break;
        case TemplateIDConstant.TEMP_ID_GIFT:
          count =
            PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken;
          break;
        case TemplateIDConstant.TEMP_ID_DIAMOND:
          count = PlayerManager.Instance.currentPlayerModel.playerInfo.point;
          break;
        case TemplateIDConstant.TEMP_ID_FUSHI_SUIPIAN:
          count = PlayerManager.Instance.currentPlayerModel.playerInfo.runeNum;
          break;
        case TemplateIDConstant.TEMP_ID_PET_ZIJIN:
          count = PlayerManager.Instance.currentPlayerModel.playerInfo.mineral;
          break;
        case TemplateIDConstant.TEMP_ID_CARNIVAL_POINT:
          count = CarnivalManager.Instance.model.score;
          break;
        case TemplateIDConstant.TEMP_ID_VIP_EXP:
          count = 0;
          break;
        case TemplateIDConstant.TEMP_ID_EXP:
          count = ArmyManager.Instance.thane.gp;
          break;
        case TemplateIDConstant.TEMP_ID_CONSORTIA:
          count =
            PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaCoin;
          break;
        case TemplateIDConstant.TEMP_ID_PET_JINHUN:
          count =
            PlayerManager.Instance.currentPlayerModel.playerInfo
              .petEquipStrengNum;
          break;
        case TemplateIDConstant.GUILD_CONTRIBUTION:
          count =
            PlayerManager.Instance.currentPlayerModel.playerInfo
              .consortiaJianse;
          break;
        default:
          break;
      }
    }
    return count;
  }

  public calcSkillPoint(lastGrade: number, currentGrade: number) {
    let sum = 0;
    for (let i = lastGrade; i < currentGrade; i++) {
      let result = (i + 1) % 2;
      if (result == 0) {
        sum += 1;
      }
    }
    return sum;
  }

  /**
   * 检测荣誉是否可以升级
   */
  checkHonorUpLevel(honorEquipLevel) {
    //功勋升级，需要满足荣誉等级条件
    let curCfg: t_s_honorequipData = TempleteManager.Instance.geHonorCfgByType(
      0,
      honorEquipLevel,
    );
    if (curCfg) {
      let nextCfg: t_s_honorequipData =
        TempleteManager.Instance.geHonorLevelByHonor(1, curCfg.Honor);
      if (nextCfg) {
        if (ArmyManager.Instance.thane.honorEquipStage < nextCfg.Level) {
          return false;
        }
      }
    }
    let nextCfg: t_s_honorequipData = TempleteManager.Instance.geHonorCfgByType(
      0,
      honorEquipLevel + 1,
    );
    if (nextCfg) {
      let own_num = GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.MEDAL_TEMPID,
      );
      return (
        own_num >= curCfg.ConsumeMedal &&
        ResourceManager.Instance.gold.count >= curCfg.ConsumeGold
      );
    }
    return false;
  }

  /**
   * 检测荣誉是否可以升阶
   */
  checkHonorUpStage(honorEquipStage) {
    let nextstage = honorEquipStage + 1;
    let nextCfg: t_s_honorequipData = TempleteManager.Instance.geHonorCfgByType(
      1,
      nextstage + 1,
    );
    if (!nextCfg) {
      return false;
    }
    nextCfg = TempleteManager.Instance.geHonorCfgByType(1, nextstage);
    if (nextCfg) {
      //荣誉值进度
      let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
      let val = (playerInfo.honer / nextCfg.Honor) * 100;
      return val >= 100;
    }
    return false;
  }

  checkJewelRedDot() {
    //是否开启灵魂刻印
    if (ArmyManager.Instance.thane.grades < OpenGrades.VEHICEL) {
      return false;
    }
    //是否最大等级
    let ownNum = GoodsManager.Instance.getCountBySontypeAndBagType(
      GoodsSonType.SONTYPE_SOUL_CRYSTAL,
      BagType.Player,
    );
    var temp: t_s_upgradetemplateData =
      TempleteManager.Instance.getTemplateByTypeAndLevel(
        ArmyManager.Instance.thane.jewelGrades + 2,
        UpgradeType.UPGRADE_TYPE_SOUL,
      );
    if (!temp) {
      return false;
    }
    temp = TempleteManager.Instance.getTemplateByTypeAndLevel(
      ArmyManager.Instance.thane.jewelGrades + 1,
      UpgradeType.UPGRADE_TYPE_SOUL,
    );
    if (temp) {
      let needNum = temp.Data - ArmyManager.Instance.thane.jewelGp;
      return ownNum > needNum;
    }
    return false;
  }

  checkFortuneRedDot() {
    let goodsCount = GoodsManager.Instance.getCountBySontypeAndBagType(
      GoodsSonType.SONTYPE_FATE_STONE,
      BagType.Player,
    );
    let array = ArmyManager.Instance.thane.fateRotarySkillList;
    let resultArr = [];
    for (let i = 0; i < array.length; i++) {
      const element: FateRotarySkillInfo = array[i];
      let temp = element.template;
      let nextTemp = element.nextUpgradeTemp;
      let nextSkillTemp =
        TempleteManager.Instance.getSkillTemplateInfoBySonTypeAndGrade(
          temp.SonType,
          temp.Grades + 2,
        );
      if (!nextSkillTemp) {
        resultArr[i] = false;
      } else {
        nextSkillTemp =
          TempleteManager.Instance.getSkillTemplateInfoBySonTypeAndGrade(
            temp.SonType,
            temp.Grades + 1,
          );
        if (nextSkillTemp) {
          let need = nextTemp.Data - element.currentGp;
          if (goodsCount >= need) {
            resultArr[i] = true;
          }
        }
      }
    }
    return resultArr[0] || resultArr[1];
  }
}
