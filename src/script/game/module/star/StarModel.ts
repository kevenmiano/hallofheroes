//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-21 10:43:29
 * @LastEditTime: 2023-04-20 10:49:33
 * @LastEditors: jeremy.xu
 * @Description:
 */

import LangManager from "../../../core/lang/LangManager";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import { StarBagType } from "../../constant/StarDefine";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { SharedManager } from "../../manager/SharedManager";
import { StarManager } from "../../manager/StarManager";
import FrameDataBase from "../../mvc/FrameDataBase";
import { StarHelper } from "../../utils/StarHelper";
import StarInfo from "../mail/StarInfo";
import { DataCommonManager } from "../../manager/DataCommonManager";
import OpenGrades from "../../constant/OpenGrades";

export default class StarModel extends FrameDataBase {
  public static MAX_DISPLAY_STAR: number = 16;
  public static BASE_OPEN_EQUIP_GRID: number = 4;
  public static ADD_GRID_LEVEL: number = 5;

  public static MAKE_STAR_CNT = 5;
  public static MAKE_STAR_COSTS = [4000, 5000, 6000, 8000, 10000];

  public static AUTO_COST: number[] = [100000, 1000000, 10000000]; //花费金额
  public static AUTO_SELL: number[] = [1, 2, 3]; //品质
  public static AUTO_COMPOSE: number[] = [4, 5, 6]; //合成

  public static PICK_UP: number = 1;
  public static SELL: number = 2;
  public static COMPOSE: number = 3;
  public static QUICK_SELL: number = 4;
  public static QUICK_COMPOSE: number = 5;
  private _randomStarName: any[] = null;

  public delWay: number = 0;
  public openCrystal: number = 0;
  public preIndex: number = 0;
  public static needOpenQuickSellWnd: boolean = true;

  /**
   * 一键卖出类型
   */
  public get starQuickSellType(): number {
    return SharedManager.Instance.starQuickSellType;
  }

  public set starQuickSellType(value: number) {
    if (SharedManager.Instance.starQuickSellType == value) return;
    SharedManager.Instance.starQuickSellType = value;
    SharedManager.Instance.save();
  }

  ///////////////////////////////////////////////////////////////
  /**
   * 获得星力值
   */
  public getStarPow(): number {
    let starPow: number = 0;
    let equipStarList: SimpleDictionary =
      StarManager.Instance.getStarListByBagType(StarBagType.THANE);
    equipStarList.getList().forEach((info: StarInfo) => {
      starPow += StarHelper.getStarTotalExp(info);
    });
    starPow = Math.floor(starPow / 10);
    return starPow;
  }

  /**
   * 通过index取得水晶球名
   */
  public getNameByIndex(indeX: number): string {
    if (!this._randomStarName) {
      this._randomStarName = [
        LangManager.Instance.GetTranslation(
          "star.view.MakeStarView.greenCrystal.name",
        ),
        LangManager.Instance.GetTranslation(
          "star.view.MakeStarView.whiteCrystal.name",
        ),
        LangManager.Instance.GetTranslation(
          "star.view.MakeStarView.yellowCrystal.name",
        ),
        LangManager.Instance.GetTranslation(
          "star.view.MakeStarView.redCrystal.name",
        ),
        LangManager.Instance.GetTranslation(
          "star.view.MakeStarView.blueCrystal.name",
        ),
      ];
    }
    return this._randomStarName[indeX];
  }

  /**
   * 一键拾取
   */
  public quickPickupClick() {
    if (this.checkAction(StarModel.PICK_UP)) {
      this.delWay = StarModel.PICK_UP;
      StarManager.Instance.sendStarPick(-2);
    }
  }
  /**
   * 操作界面一键卖出
   */
  public quickSellClick(type: number) {
    if (this.checkAction(StarModel.SELL, type)) {
      this.delWay = StarModel.SELL;
      StarManager.Instance.sendStarPick(-1, type);
    }
  }
  /**
   * 检测星运界面的可操作性(一键拾取、一键卖出)
   * @param action
   * @param value
   * @return
   */
  public checkAction(action: number, value: number = 0): boolean {
    let tempStarList: SimpleDictionary = StarManager.Instance.tempStarList;
    let tempStarNum: number = tempStarList.getList().length;
    if (tempStarNum <= 0) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "star.view.DisplayStarView.command02",
        ),
      );
      return false;
    }

    switch (action) {
      case StarModel.PICK_UP:
        let playerStarNum: number = StarManager.Instance.getPlayerStarListNum();
        if (
          playerStarNum + this.currentStarNum >
          PlayerModel.ORIGINAL_OPEN_BAG_COUNT +
            DataCommonManager.playerInfo.starBagCount
        ) {
          if (this.currentStarNum > 0) {
            MessageTipManager.Instance.show(
              LangManager.Instance.GetTranslation(
                "star.view.DisplayStarView.command03",
              ),
            );
          }
        }
        if (
          playerStarNum >=
          PlayerModel.ORIGINAL_OPEN_BAG_COUNT +
            DataCommonManager.playerInfo.starBagCount
        ) {
          if (this.currentStarNum > 0) {
            MessageTipManager.Instance.show(
              LangManager.Instance.GetTranslation(
                "star.view.DisplayStarView.command03",
              ),
            );
          }
          return false;
        }
        for (let index = 0; index < tempStarList.getList().length; index++) {
          const sInfo: StarInfo = tempStarList.getList()[index];
          if (sInfo.template.Profile > 1) {
            return true;
          }
        }
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "star.view.DisplayStarView.command04",
          ),
        );
        return false;
      case StarModel.SELL:
        for (let index = 0; index < tempStarList.getList().length; index++) {
          const sInfo: StarInfo = tempStarList.getList()[index];
          if (
            sInfo.template.Profile <= value &&
            sInfo.grade == 1 &&
            sInfo.gp == 0
          ) {
            return true;
          }
        }
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "star.view.DisplayStarView.command05",
          ),
        );
        return false;
    }
    return false;
  }
  /**
   * 星运临时界面中的非白色星运数量
   * @return
   */
  private get currentStarNum(): number {
    let num: number;
    StarManager.Instance.tempStarList.getList().forEach((sInfo: StarInfo) => {
      if (sInfo.template.Profile > 1) {
        num++;
      }
    });
    return num;
  }

  public openEquipGridNum() {
    let extraOpenGrid = Math.floor(
      (DataCommonManager.thane.grades - OpenGrades.STAR) / 5,
    );
    let openGrid = StarModel.BASE_OPEN_EQUIP_GRID + extraOpenGrid;

    if (openGrid > PlayerModel.EQUIP_STAR_BAG_COUNT) {
      openGrid = PlayerModel.EQUIP_STAR_BAG_COUNT;
    }
    return openGrid;
  }

  public dispose() {
    super.dispose();
  }
}
