/*
 * @Author: jeremy.xu
 * @Date: 2021-05-25 17:18:33
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-01-31 18:13:30
 * @Description: 星运tips
 */

import LangManager from "../../core/lang/LangManager";
import UIButton from "../../core/ui/UIButton";
import {
  eFilterFrameText,
  FilterFrameText,
} from "../component/FilterFrameText";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { t_s_startemplateData } from "../config/t_s_startemplate";
import { StarBagType, StarEvent } from "../constant/StarDefine";
import { PlayerModel } from "../datas/playerinfo/PlayerModel";
import { DataCommonManager } from "../manager/DataCommonManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { NotificationManager } from "../manager/NotificationManager";
import { StarManager } from "../manager/StarManager";
import StarInfo from "../module/mail/StarInfo";
import StarModel from "../module/star/StarModel";
import { StarHelper } from "../utils/StarHelper";
import BaseTips from "./BaseTips";
import { GoodAttributeItem } from "./GoodAttributeItem";

export class StarTips extends BaseTips {
  public tipData: StarInfo;

  public power: GoodAttributeItem;
  public agility: GoodAttributeItem;
  public intellect: GoodAttributeItem;
  public physique: GoodAttributeItem;
  public captain: GoodAttributeItem;
  public attack: GoodAttributeItem;
  public magicAttack: GoodAttributeItem;
  public defence: GoodAttributeItem;
  public magicDefence: GoodAttributeItem;
  public parry: GoodAttributeItem;
  public live: GoodAttributeItem;
  public forceHit: GoodAttributeItem;
  public conat: GoodAttributeItem;

  public txt_defSkill: fgui.GLabel;
  public txt_name: fgui.GLabel;
  public txt_useLevel: fgui.GLabel;
  public txt_price: fgui.GLabel;
  public txt_gp: fgui.GLabel;
  public cBagType: fgui.Controller;
  public cBagTempPos: fgui.Controller;
  public cSpecialType6: fgui.Controller; // 玩家背包Profile=6的星运没有装备与合成按钮
  public subBox1: fgui.GGroup;
  public subBox2: fgui.GGroup;

  public btnLock: UIButton;
  public btnEquip: UIButton;
  public btnPick: UIButton;

  private canPickUp: boolean;
  private locked: boolean;
  private type: StarBagType;

  public OnInitWind() {
    super.OnInitWind();

    this.tipData = this.params[0];
    this.canPickUp = this.tipData.template.Profile > 1;
    this.locked = this.tipData.composeLock;
    this.type = this.tipData.bagType;
    this.cBagType = this.getController("cBagType");
    this.cBagTempPos = this.getController("cBagTempPos");
    this.cSpecialType6 = this.getController("cSpecialType6");
    this.initView();
    this.initAttribute(this.tipData, this.tipData.template);
    this.contentPane.ensureBoundsCorrect();
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  protected OnClickModal() {
    super.OnClickModal();

    this.hide();
  }

  private initView() {
    this.cSpecialType6.selectedIndex = 0;
    switch (this.type) {
      case StarBagType.TEMP:
        this.cBagType.selectedIndex = 0;
        this.cBagTempPos.selectedIndex = this.canPickUp ? 0 : 1;
        this.btnLock.title = LangManager.Instance.GetTranslation("public.sell");
        this.btnEquip.title =
          LangManager.Instance.GetTranslation("public.pickUp");
        break;
      case StarBagType.THANE:
      case StarBagType.PLAYER:
        this.cBagType.selectedIndex = this.type == StarBagType.THANE ? 2 : 1;
        if (this.tipData.template.Profile == 6) {
          this.cSpecialType6.selectedIndex = 1;
        }
        this.btnLock.title = LangManager.Instance.GetTranslation(
          this.locked ? "public.unLock" : "public.lock"
        );
        this.btnEquip.title = LangManager.Instance.GetTranslation(
          this.type == StarBagType.THANE ? "public.unEquip" : "public.equip"
        );
        break;
      case StarBagType.SHOP:
      case StarBagType.SYS:
        this.cBagType.selectedIndex = 3;
        break;
    }

    this.txt_name.text = this.tipData.template.TemplateNameLang;
    this.txt_useLevel.text = LangManager.Instance.GetTranslation(
      "public.level2",
      String(this.tipData.grade)
    );
    let color =
      FilterFrameText.Colors[eFilterFrameText.StarQuality][
        this.tipData.template.Profile - 1
      ];
    this.txt_name.color = color;
    this.txt_price.text = this.tipData.template.SellGold + "";
    this.subBox2.ensureBoundsCorrect();
    this.subBox1.ensureBoundsCorrect();
  }

  private initAttribute(info: StarInfo, template: t_s_startemplateData) {
    let str: string = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip01"
    );
    this.updateAttributeTxt(this.power, str, template.Power * info.grade);
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip02"
    );
    this.updateAttributeTxt(this.agility, str, template.Agility * info.grade);
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip03"
    );
    this.updateAttributeTxt(
      this.intellect,
      str,
      template.Intellect * info.grade
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip04"
    );
    this.updateAttributeTxt(this.physique, str, template.Physique * info.grade);
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip05"
    );
    this.updateAttributeTxt(this.captain, str, template.Captain * info.grade);
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip13"
    );
    this.updateAttributeTxt(this.attack, str, template.Attack * info.grade);
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip14"
    );
    this.updateAttributeTxt(this.defence, str, template.Defence * info.grade);
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip15"
    );
    this.updateAttributeTxt(
      this.magicAttack,
      str,
      template.MagicAttack * info.grade
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip16"
    );
    this.updateAttributeTxt(
      this.magicDefence,
      str,
      template.MagicDefence * info.grade
    );
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip10"
    );
    this.updateAttributeTxt(this.forceHit, str, template.ForceHit * info.grade);
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip19"
    );
    this.updateAttributeTxt(this.parry, str, template.Parry * info.grade);
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip11"
    );
    this.updateAttributeTxt(this.live, str, template.Live * info.grade);
    str = LangManager.Instance.GetTranslation(
      "armyII.ThaneAttributeView.Tip17"
    );
    this.updateAttributeTxt(this.conat, str, template.Conat * info.grade);
    if (template.DefaultSkill) {
      this.txt_defSkill.text = StarHelper.getStarBufferName(info);
    }
    this.txt_defSkill.visible = Boolean(template.DefaultSkill);

    if (this.type == StarBagType.SYS) {
      this.txt_gp.visible = false;
      this.subBox2.x -= 15;
      this.txt_defSkill.x -= 15;
      return;
    }
    this.txt_gp.visible = this.tipData.template.Profile >= 2;
    if (this.tipData.template.Profile >= 2) {
      let maxGrade = StarHelper.getStarMaxGradeByProfile(
        this.tipData.template.Profile
      );
      if (this.tipData.grade >= maxGrade) {
        this.txt_gp.text = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.StarTip.gp01"
        );
      } else {
        let nextGradeExp = StarHelper.getStarExp(
          this.tipData.grade + 1,
          this.tipData.template.Profile
        );
        if (this.tipData.template.Profile == 6)
          this.txt_gp.text = LangManager.Instance.GetTranslation(
            "yishi.view.tips.goods.StarTip.gp02",
            this.tipData.gp
          );
        else
          this.txt_gp.text = LangManager.Instance.GetTranslation(
            "yishi.view.tips.goods.StarTip.gp02",
            this.tipData.gp + "/" + nextGradeExp
          );
      }
    }
  }

  private updateAttributeTxt(
    item: GoodAttributeItem,
    proper: string,
    val: number
  ) {
    item.visible = val > 0;
    if (val > 0) {
      item.updateText(proper, "+" + val);
    }
  }

  private btnNewComposeClick() {
    if (
      this.tipData.grade >=
      StarHelper.getStarMaxGradeByProfile(this.tipData.template.Profile)
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "starTip.ComposeMaxLevel",
          this.tipData.template.TemplateNameLang
        )
      );
    } else {
      NotificationManager.Instance.dispatchEvent(StarEvent.STAR_NEW_COMPOSE, {
        pos: this.tipData.pos,
        compose: true,
      });
    }

    this.OnClickModal();
  }

  private btnLockClick() {
    if (!this.tipData || !this.tipData.template) return;

    switch (this.type) {
      case StarBagType.THANE:
      case StarBagType.PLAYER:
        //加锁或解锁
        this.starManager.sendStarComposeLock(
          this.tipData.bagType,
          this.tipData.pos
        );
        break;
    }
    this.hide();
  }

  private btnEquipClick() {
    if (!this.tipData || !this.tipData.template) return;

    switch (this.type) {
      case StarBagType.THANE:
        //卸下
        let unEquipPos = this.starManager.getStarPlayerBagIdlePos();
        if (unEquipPos < 0) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "cell.view.starbag.StarBagCell.command04"
            )
          );
        } else {
          StarManager.Instance.starMove(
            this.tipData.pos,
            StarBagType.THANE,
            unEquipPos,
            StarBagType.PLAYER
          );
        }
        break;
      case StarBagType.PLAYER:
        //装备
        if (this.tipData.template.Profile == 6) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "cell.view.starbag.StarBagCell.command01"
            )
          );
        } else {
          // let flag: boolean = this.starManager.checkHasSameType(this.tipData)[0];
          // if (flag) {//存在同类型的星运, 弹窗提示替换
          //     let equipPos: number = this.starManager.checkHasSameType(this.tipData)[1];
          //     let sourceName: string = this.tipData.template.TemplateName;
          //     let equipName: string = this.starManager.checkHasSameType(this.tipData)[2]
          //     let content: string = LangManager.Instance.GetTranslation("starTips.showAlert", sourceName, equipName);
          //     SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b: boolean) => {
          //         if (b) {
          //             StarManager.Instance.starMove(this.tipData.pos, StarBagType.PLAYER, equipPos, StarBagType.THANE);
          //         }
          //     });
          // }
          // else {
          //     //不存在相同的星运
          // }
          NotificationManager.Instance.dispatchEvent(StarEvent.STAR_EXCHANGE, {
            starInfo: this.tipData,
          });
        }
        break;
    }

    this.OnClickModal();
  }

  //合成
  private btnComposeClick() {
    if (
      this.tipData.grade >=
      StarHelper.getStarMaxGradeByProfile(this.tipData.template.Profile)
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "starTip.ComposeMaxLevel",
          this.tipData.template.TemplateNameLang
        )
      );
    } else {
      NotificationManager.Instance.dispatchEvent(StarEvent.STAR_COMPOSE, {
        pos: this.tipData.pos,
        compose: true,
      });
    }

    this.OnClickModal();
  }

  //替换
  private btnExchangeClick() {
    NotificationManager.Instance.dispatchEvent(StarEvent.STAR_LEFT_EXCHANGE, {
      starInfo: this.tipData,
    });
    this.OnClickModal();
  }

  private btnPickClick() {
    // 拾取
    let playerStarNum: number = this.starManager.getPlayerStarListNum();
    if (
      playerStarNum >=
      PlayerModel.ORIGINAL_OPEN_BAG_COUNT +
        DataCommonManager.playerInfo.starBagCount
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("star.view.StarIconView.command01")
      );
    } else {
      this.starModel.delWay = StarModel.PICK_UP;
      this.starManager.sendStarPick(this.tipData.pos, 1);
    }
    this.OnClickModal();
  }

  private btnSellClick() {
    this.sell();
    this.OnClickModal();
  }

  private btnSellPlayerBagClick() {
    this.sell(true);
    this.OnClickModal();
  }

  private btnSellPlayerBag2Click() {
    this.sell(true);
    this.OnClickModal();
  }

  private sell(isPlayBag: boolean = false) {
    if (this.tipData.grade > 1 || this.tipData.gp > 0) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "star.view.StarIconView.composedTip"
        )
      );
      return;
    }

    if (this.tipData.composeLock) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("vicepassword.description11")
      );
      return;
    }

    // if (this.tipData.template.Profile >= 5 && this.tipData.template.Profile != 6) {
    //     let content: string = LangManager.Instance.GetTranslation("star.view.StarIconView.confirmSellTip", StarHelper.getStarHtmlName(this.tipData.template))
    //     SimpleAlertHelper.Instance.Show(null, isPlayBag, null, content, null, null, this.sellBack.bind(this));
    //     return;
    // }

    let content = LangManager.Instance.GetTranslation(
      "StarBagWnd.SellStarTip",
      this.tipData.template.SellGold
    );
    SimpleAlertHelper.Instance.Show(
      null,
      null,
      null,
      content,
      null,
      null,
      (b: boolean) => {
        if (b) {
          this.sellBack(true, true, isPlayBag);
        }
      }
    );
  }

  private sellBack(b: boolean, flag: boolean, isPlayBag: boolean) {
    if (b && this.tipData) {
      this.starModel.delWay = StarModel.SELL;
      if (isPlayBag) {
        this.starManager.sendBatchOpt(1, undefined, [this.tipData.pos]);
      } else {
        this.starManager.sendStarPick(this.tipData.pos, 2);
      }
    }
  }

  private get starManager(): StarManager {
    return StarManager.Instance;
  }

  private get starModel(): StarModel {
    return StarManager.Instance.starModel;
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
