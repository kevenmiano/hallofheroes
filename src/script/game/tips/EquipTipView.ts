import FUI_EquipTipView from "../../../fui/Base/FUI_EquipTipView";
import { EquipTipsContent } from "./EquipTipsContent";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import LangManager from "../../core/lang/LangManager";
import { t_s_skilltemplateData } from "../config/t_s_skilltemplate";
import { TempleteManager } from "../manager/TempleteManager";
import { ConfigManager } from "../manager/ConfigManager";
import StringHelper from "../../core/utils/StringHelper";
import GoodsSonType from "../constant/GoodsSonType";
import { GoodsCheck } from "../utils/GoodsCheck";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { GoodsManager } from "../manager/GoodsManager";
import AudioManager from "../../core/audio/AudioManager";
import { SoundIds } from "../constant/SoundIds";
import { BagType } from "../constant/BagDefine";
import { GoodsType } from "../constant/GoodsType";
import { ArrayConstant, ArrayUtils } from "../../core/utils/ArrayUtils";
import { PlayerManager } from "../manager/PlayerManager";
import { FashionModel } from "../module/bag/model/FashionModel";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { EmWindow } from "../constant/UIDefine";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { EquipTip } from "./EquipTip";
import { NotificationManager } from "../manager/NotificationManager";
import { FashionEvent, TipsEvent } from "../constant/event/NotificationEvent";
import { MessageTipManager } from "../manager/MessageTipManager";
import { RoleCtrl } from "../module/bag/control/RoleCtrl";
// import { RoleWnd } from "../module/bag/view/RoleWnd";
import Logger from "../../core/logger/Logger";
import { FashionManager } from "../manager/FashionManager";
import { BagHelper } from "../module/bag/utils/BagHelper";
import { SimpleDictionary } from "../../core/utils/SimpleDictionary";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { SRoleWnd } from "../module/sbag/SRoleWnd";
import { t_s_obtainData } from "../config/t_s_obtain";
import { SwitchPageHelp } from "../utils/SwitchPageHelp";
import { ShopGoodsInfo } from "../module/shop/model/ShopGoodsInfo";
import UIManager from "../../core/ui/UIManager";
import { ShowAvatar } from "../avatar/view/ShowAvatar";
import ObjectUtils from "../../core/utils/ObjectUtils";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/20 16:55
 * @ver 1.0
 *
 */
export class EquipTipView extends FUI_EquipTipView {
  private _info: GoodsInfo;
  protected addPropertyArray: any[] = [
    "0",
    "20-100",
    "8-40",
    "6-30",
    "4-20",
    "2-10",
  ];
  private _equipType: number;
  canOperate: boolean = false;
  private isFashion: boolean = false; //时装合成
  private _toPos: number = -1;
  public showObtain: boolean = true;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();

    this.addEvent();
  }

  private addEvent() {
    this.btn_use.onClick(this, this.onBtnUseClick);
  }

  get info(): GoodsInfo {
    return this._info;
  }

  set info(value: GoodsInfo) {
    this._info = value;
    this.rightBox.visible = false;
    this.updateTransform();
    this.equipTipsContent.totalBox.ensureBoundsCorrect();
    this.totalBox.ensureBoundsCorrect();
    this.leftBox.ensureBoundsCorrect();
    // this.rightBox.ensureBoundsCorrect();
    this.container.ensureBoundsCorrect();
  }

  protected updateTransform() {
    if (this._info) {
      this.clean();

      let temp: t_s_itemtemplateData = this._info.templateInfo;
      (this.equipTipsContent as EquipTipsContent).info = this._info;
      let num: number = this._info.getEquipBaseScore();
      let additionScore: number = this._info.getEquipAdditionScore();
      let scoreStr: string = "";
      if (additionScore > 0) {
        scoreStr = num + " (+" + additionScore + ")";
      } else {
        scoreStr = num + "";
      }

      let isfashion: boolean = this.fashionModel.isFashion(this._info);
      this.txt_gradeCount.text = LangManager.Instance.GetTranslation(
        "yishi.view.tips.goods.ChatEquipTips.gradeCount",
        "[color=#01F0ED]&nbsp;&nbsp;" + scoreStr + "[/color]"
      );
      if (!isfashion) {
        this.grade_group.visible = true;
        this.dot.visible = false;
        // 称号卡不显示评分
        if (this._info.templateInfo.SonType != GoodsSonType.SONTYPE_APPELL) {
          this.txt_gradeCount.visible = false;
        }
        this.txt_time.visible = this._info.validDate > 0;
        this.txt_time.text =
          LangManager.Instance.GetTranslation(
            "yishi.view.tips.goods.EquipTip.time.text"
          ) +
          ":" +
          DateFormatter.getFullDateString(this._info.validDate * 60);
      } else {
        this.showFasionState();
      }

      this.txt_price.text =
        temp.SellGold == 0 ? "" : GoodsCheck.getSellGold(this._info).toString();
      let timeStr: string = "";
      if (this._info.id != 0) {
        if (this._info.leftTime == -1) {
          timeStr = LangManager.Instance.GetTranslation(
            "yishi.view.tips.goods.EquipTip.timeStr01"
          );
        } else if (this._info.leftTime < 0) {
          timeStr = LangManager.Instance.GetTranslation(
            "yishi.view.tips.goods.EquipTip.timeStr02"
          );
        } else {
          timeStr = DateFormatter.getFullDateString(this._info.leftTime);
        }
        if (!isfashion) {
          this.txt_time.text =
            LangManager.Instance.GetTranslation(
              "yishi.view.tips.goods.EquipTip.time.text"
            ) +
            ":" +
            timeStr;
        }
        this.group_price.visible = temp.SellGold > 0;

        //判断是否已穿戴
        let equiped = false;
        if (this._info.bagType == BagType.HeroEquipment) {
          equiped = GoodsManager.Instance.isHeroGoods(
            this.thane.id,
            this._info
          );
        }
        if (this._info.bagType == BagType.Honer) {
          equiped = GoodsManager.Instance.isHonerGoods(
            this.thane.id,
            this._info
          );
        }

        this.equipType = equiped ? EquipTip.EQUIPED : 0;
        //操作按钮
        if (
          this.canOperate &&
          GoodsCheck.checkGoodsCanEquip(this._info, this.thane, false) &&
          GoodsCheck.isGradeFix(this.thane, this._info.templateInfo, false)
        ) {
          this.btn_use.visible = true;
          if (this._equipType == EquipTip.EQUIPED) {
            this.btn_use.text = LangManager.Instance.GetTranslation(
              "armyII.viewII.skill.btnEquipOff"
            ); //卸下
          } else {
            if (this.fashionModel.isFashion(this.info)) {
              this.btn_use.text = LangManager.Instance.GetTranslation(
                "tasktracetip.view.OpenBagTipView.btnTxt1"
              ); //
            } else {
              this.btn_use.text = LangManager.Instance.GetTranslation(
                "armyII.viewII.skill.btnEquipOn"
              ); //装备
            }
          }
        } else {
          this.btn_use.visible = false;
        }
      } else {
        this.btn_use.visible = false;
      }
      if (BagHelper.isOpenConsortiaStorageWnd()) {
        //是否打开公会宝箱
        this.btn_use.text = BagHelper.getText(this._info);
        this.btn_use.visible = true;
      }

      if (this._info.templateInfo.ObtainId && this.showObtain) {
        if (BagHelper.isOpenPlayerInfo() || BagHelper.isOpenBag()) {
          this.equipTipsContent.getChild("btn_obtain").visible = true;
          this.equipTipsContent
            .getChild("btn_obtain")
            .onClick(this, this.onObtain);
          this.list.itemRenderer = Laya.Handler.create(
            this,
            this.onRender,
            null,
            false
          );
          this.list.on(fairygui.Events.CLICK_ITEM, this, this.onClickObtain);
        }
      }
    }
  }

  private _figure: ShowAvatar;

  private showFasionState() {
    let temp: t_s_itemtemplateData = this._info.templateInfo;

    let skillInfo: t_s_skilltemplateData =
      this.fashionModel.getFashionObjectSkillTemplate(temp);
    // let tip: string = (skillInfo != null ? skillInfo.SkillTemplateName : "");
    let starNum: number = skillInfo != null ? skillInfo.Grades : 0;
    this._info.appraisal_skill = skillInfo != null ? skillInfo.TemplateId : 0;

    let identitySkill: t_s_skilltemplateData =
      TempleteManager.Instance.getSkillTemplateInfoById(
        this._info.appraisal_skill
      );
    let skillTip: string =
      identitySkill == null
        ? this.addPropertyTxt(temp)
        : identitySkill.SkillTemplateName;
    this.txt_fashionIdentity.color = "#ffecc6";
    if (this._info.appraisal_skill > 0) {
      this.txt_time.text =
        LangManager.Instance.GetTranslation(
          "fashion.FashionSwitchItem.Identity"
        ) + ":";
      this.txt_time.color = "#ffc68f";
      if (identitySkill.Grades >= 5) {
        this.txt_fashionIdentity.text = skillTip + "(MAX)";
      } else {
        let maxskillTip = this.addPropertyTxtMax(temp);
        //当鉴定后文字为: 鉴定: 力量+60（最大属性: 力量+100）
        this.txt_fashionIdentity.text =
          skillTip +
          LangManager.Instance.GetTranslation(
            "fashion.identity.max",
            maxskillTip
          );
      }
    } else {
      skillTip =
        identitySkill == null
          ? this.addPropertyTxtMax(temp)
          : identitySkill.SkillTemplateName;
      //当未鉴定时文字为: 未鉴定（最大属性: 力量+100）
      this.txt_time.text =
        LangManager.Instance.GetTranslation(
          "fashion.FashionSwitchItem.noIdentity"
        ) + ":";
      this.txt_time.color = "#666666";
      this.txt_fashionIdentity.text = LangManager.Instance.GetTranslation(
        "fashion.identity.max",
        skillTip
      );
    }
    this.txt_fashionIdentity.visible = true;
    if (identitySkill) {
      this.group_star.visible = true;
      this.addFashionStar(identitySkill.Grades);
    }
    //统一使用Property2(参数2)字段定义时装等级.
    let priority: any[] = [" ", "S", "A", "B", "C", "D"];
    let pStr: string = "";
    if (temp.Property2 > 0) {
      pStr = StringHelper.format(
        "[color={0}]{1}[/color]",
        GoodsSonType.getColorByProfile(6 - temp.Property2),
        //海外增加翻译
        LangManager.Instance.GetTranslation(
          "public.fashionProfile",
          priority[temp.Property2]
        )
      );
    }
    this.txt_fashionProfile.text = pStr;
    this.txt_gradeCount.text = LangManager.Instance.GetTranslation(
      "fashion.identity.tip"
    );
    this.dot.visible = true;
    this.grade_group.visible =
      this.txt_time.visible =
      this.txt_gradeCount.visible =
      this.txt_fashionProfile.visible =
        true;
    // this.totalBox.lineGap = 13;
    this.animationCom.visible = true;

    this._figure = new ShowAvatar();
    // this._figure.scaleX = this._figure.scaleY = 0.8;
    this._figure.x = 20;
    // this._figure.y = 30;
    this.animationCom.displayObject.addChild(this._figure);

    this._showThane = new ThaneInfo();
    this._showThane.templateId = this.thane.templateId;
    this._showThane.armsEquipAvata = this.thane.armsEquipAvata;
    this._showThane.bodyEquipAvata = this.thane.bodyEquipAvata;
    // this._showThane.wingAvata = this.thane.wingEquipAvata;

    let info = this._info;
    switch (info.templateInfo.SonType) {
      case GoodsSonType.FASHION_CLOTHES:
        this._showThane.bodyFashionAvata = info.templateInfo.Avata;
        break;
      case GoodsSonType.FASHION_HEADDRESS:
        this._showThane.hairFashionAvata = info.templateInfo.Avata;
        break;
      case GoodsSonType.FASHION_WEAPON:
        this._showThane.armsFashionAvata = info.templateInfo.Avata;
        break;
      case GoodsSonType.SONTYPE_WING:
        this._showThane.wingAvata = info.templateInfo.Avata;
        break;
    }

    this._figure.data = this._showThane;
  }

  private _showThane: ThaneInfo;
  private onRender(index: number, item: fairygui.GButton) {
    if (item) {
      let cfg: t_s_obtainData = this.obtainArr[index];
      if (cfg) {
        item.getChild("title").asTextField.text = cfg.NameLang;
        item.data = cfg;
      }
    }
  }

  private obtainArr: any;
  private onObtain() {
    if (this.rightBox.visible) {
      return;
    }
    this.obtainArr = [];
    let array = this._info.templateInfo.ObtainId.split(",");
    for (let i = 0; i < array.length; i++) {
      const obtainId = array[i];
      let cfg: t_s_obtainData = TempleteManager.Instance.getObtainCfg(obtainId);
      if (cfg) {
        this.obtainArr.push(cfg);
      }
    }
    this.list.numItems = this.obtainArr.length;
    this.list.resizeToFit();
    this.rightBox.visible = true;

    // this.rightBox.ensureBoundsCorrect();
    // this.container.ensureBoundsCorrect();
    // this.ensureBoundsCorrect();
    NotificationManager.Instance.sendNotification(TipsEvent.EQUIP_TIPS_OBTAIN);
    // this.contentPane.x -= this.rightBox.width;
    //TODO 判断边界
    // ToolTipsManager.Instance.setTipPos()
    // this.setCenter();
  }

  protected addFashionStar(value: number) {
    this.img_star.fillAmount = value / 5;
  }

  protected addPropertyTxt(info: t_s_itemtemplateData): string {
    switch (info.SonType) {
      case GoodsSonType.FASHION_WEAPON:
        return (
          LangManager.Instance.GetTranslation(
            "armyII.ThaneAttributeView.Tip01"
          ) + this.addPropertyArray[info.Property2]
        );
      case GoodsSonType.FASHION_CLOTHES:
        return (
          LangManager.Instance.GetTranslation(
            "armyII.ThaneAttributeView.Tip02"
          ) + this.addPropertyArray[info.Property2]
        );
      case GoodsSonType.FASHION_HEADDRESS:
        return (
          LangManager.Instance.GetTranslation(
            "armyII.ThaneAttributeView.Tip03"
          ) + this.addPropertyArray[info.Property2]
        );
      case GoodsSonType.SONTYPE_WING:
        return (
          LangManager.Instance.GetTranslation(
            "armyII.ThaneAttributeView.Tip04"
          ) + this.addPropertyArray[info.Property2]
        );
    }
    return "";
  }

  protected addPropertyTxtMax(info: t_s_itemtemplateData): string {
    let str = this.addPropertyArray[info.Property2];
    let arr = str.split("-");
    str = " +" + arr[1];
    switch (info.SonType) {
      case GoodsSonType.FASHION_WEAPON:
        return (
          LangManager.Instance.GetTranslation(
            "armyII.ThaneAttributeView.Tip01"
          ) + str
        );
      case GoodsSonType.FASHION_CLOTHES:
        return (
          LangManager.Instance.GetTranslation(
            "armyII.ThaneAttributeView.Tip02"
          ) + str
        );
      case GoodsSonType.FASHION_HEADDRESS:
        return (
          LangManager.Instance.GetTranslation(
            "armyII.ThaneAttributeView.Tip03"
          ) + str
        );
      case GoodsSonType.SONTYPE_WING:
        return (
          LangManager.Instance.GetTranslation(
            "armyII.ThaneAttributeView.Tip04"
          ) + str
        );
    }
    return "";
  }

  private onBtnUseClick() {
    if (BagHelper.isOpenConsortiaStorageWnd()) {
      BagHelper.consortiaStorageOperate(this._info);
      NotificationManager.Instance.sendNotification(TipsEvent.EQUIP_TIPS_HIDE);
      return;
    } else {
      this.onBtnUseClick1();
    }
  }

  private onBtnUseClick1() {
    if (
      this.btn_use.title ==
      LangManager.Instance.GetTranslation(
        "tasktracetip.view.OpenBagTipView.btnTxt1"
      )
    ) {
      NotificationManager.Instance.dispatchEvent(
        FashionEvent.SWALLOW,
        this._info.templateInfo.SonType
      );
      NotificationManager.Instance.sendNotification(TipsEvent.EQUIP_TIPS_HIDE);
      return;
    }
    if (this.isFashion) {
      this.putInFashinComposite();
      NotificationManager.Instance.sendNotification(TipsEvent.EQUIP_TIPS_HIDE);
      return;
    }
    if (this._equipType == EquipTip.EQUIPED) {
      //卸下
      let targetPos: number = GoodsManager.Instance.findEmputyPos();
      if (targetPos == -1) {
        let str: string = LangManager.Instance.GetTranslation(
          "cell.mediator.consortiabag.ConsortiaCaseCellClickMediator.command01"
        );
        MessageTipManager.Instance.show(str);
        return;
      }

      AudioManager.Instance.playSound(SoundIds.BAG_EQUIP_SOUND);

      let goodsInfo: GoodsInfo = this.getGoodsInfoByPos(this._info.pos);
      if (goodsInfo.existJewel()) {
        var content: string = LangManager.Instance.GetTranslation(
          "OpenBagTipView.exchange.content"
        );
        SimpleAlertHelper.Instance.Show(
          SimpleAlertHelper.SIMPLE_ALERT,
          null,
          null,
          content,
          null,
          null,
          (b: boolean) => {
            this.moveBagToBag(
              this._info.bagType,
              this._info.objectId,
              this._info.pos,
              BagType.Player,
              0,
              targetPos,
              1,
              b
            );
          }
        );
        Laya.timer.once(100, this, () => {
          NotificationManager.Instance.sendNotification(
            TipsEvent.EQUIP_TIPS_HIDE
          );
        });
      } else {
        this.moveBagToBag(
          this._info.bagType,
          this._info.objectId,
          this._info.pos,
          BagType.Player,
          0,
          targetPos,
          1
        );
      }
    } else {
      if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_RUNNES) {
        let existRunes: GoodsInfo =
          GoodsManager.Instance.getBattleRunesByTempId(this._info.templateId);
        this._toPos = GoodsManager.Instance.getEmputyBattleRunesPos();
        if (
          existRunes &&
          existRunes.count != existRunes.templateInfo.MaxCount
        ) {
          let count: number =
            existRunes.templateInfo.MaxCount - existRunes.count;
          count = this._info.count > count ? count : this._info.count;
          AudioManager.Instance.playSound(SoundIds.BAG_EQUIP_SOUND);
          this.moveBagToBag(
            this._info.bagType,
            this._info.objectId,
            this._info.pos,
            BagType.Battle,
            this.thane.id,
            existRunes.pos,
            count
          );
        } else if (this._toPos != -1) {
          AudioManager.Instance.playSound(SoundIds.BAG_EQUIP_SOUND);
          this.moveBagToBag(
            this._info.bagType,
            this._info.objectId,
            this._info.pos,
            BagType.Battle,
            this.thane.id,
            this._toPos,
            this._info.count
          );
        }
      } else if (this._info.templateInfo.MasterType == GoodsType.HONER) {
        this._toPos = GoodsManager.Instance.getEmputyHonerPos();
        if (this._toPos == -1) {
          this._toPos = 0;
        }
        AudioManager.Instance.playSound(SoundIds.BAG_EQUIP_SOUND);
        this.moveBagToBag(
          this._info.bagType,
          this._info.objectId,
          this._info.pos,
          BagType.Honer,
          this.thane.id,
          this._toPos,
          this._info.count
        );
      } else {
        let heroBag: GoodsInfo[] =
          GoodsManager.Instance.getHeroGoodsListByTypeAndId(
            this._info.templateInfo.MasterType,
            this.thane.id
          ).getList();
        let pos_arr: number[] = GoodsSonType.getSonTypePos(
          this._info.templateInfo.SonType
        );
        heroBag = ArrayUtils.sortOn(heroBag, "pos", ArrayConstant.NUMERIC);
        let t_index: number = 0;
        if (pos_arr.length > 1) {
          for (const key in heroBag) {
            if (heroBag.hasOwnProperty(key)) {
              let i: GoodsInfo = heroBag[key];
              if (
                i.templateInfo.SonType == this._info.templateInfo.SonType &&
                i.pos == pos_arr[0] + t_index
              ) {
                t_index++;
              }
            }
          }
          if (t_index >= pos_arr.length) {
            //多个同类型的（比如两个戒指、首饰）就替换一个评分低的
            let targetInfos: GoodsInfo[] = [];
            for (let i = 0, len = pos_arr.length; i < len; i++) {
              const pos = pos_arr[i];
              targetInfos.push(
                GoodsManager.Instance.getHeroEquipByPos(this.thane.id, pos)
              );
            }
            targetInfos.sort((a, b) => {
              return a.getEquipBaseScore() - b.getEquipBaseScore();
            });
            this._toPos = targetInfos[0].pos;
          } else {
            this._toPos = pos_arr[t_index];
          }
        } else {
          this._toPos = pos_arr[0];
        }
        if (this._toPos != -1) {
          AudioManager.Instance.playSound(SoundIds.BAG_EQUIP_SOUND);
          if (
            this.btn_use.text ==
            LangManager.Instance.GetTranslation(
              "armyII.viewII.skill.btnEquipExchange"
            )
          ) {
            let goodsInfo: GoodsInfo = this.getGoodsInfoByPos(this._toPos);
            if (!goodsInfo.existJewel()) {
              this.moveBagToBag(
                this._info.bagType,
                this._info.objectId,
                this._info.pos,
                BagType.HeroEquipment,
                this.thane.id,
                this._toPos,
                1
              );
            } else {
              //有宝石
              var confirm: string =
                LangManager.Instance.GetTranslation("public.confirm");
              var cancel: string =
                LangManager.Instance.GetTranslation("public.cancel");
              var prompt: string =
                LangManager.Instance.GetTranslation("public.prompt");
              var content: string = LangManager.Instance.GetTranslation(
                "OpenBagTipView.exchange.content"
              );
              SimpleAlertHelper.Instance.Show(
                SimpleAlertHelper.SIMPLE_ALERT,
                null,
                prompt,
                content,
                confirm,
                cancel,
                this.moveConfirm.bind(this)
              );
              Laya.timer.once(100, this, () => {
                NotificationManager.Instance.sendNotification(
                  TipsEvent.EQUIP_TIPS_HIDE
                );
              });
            }
          } else {
            this.moveBagToBag(
              this._info.bagType,
              this._info.objectId,
              this._info.pos,
              BagType.HeroEquipment,
              this.thane.id,
              this._toPos,
              1
            );
          }
        }
        //当玩家通过“背包”对背包内的时装进行“装备”或者“替换”操作时, 左侧分类列表将从“背包”自动跳转至“时装
        // if(this.fashionModel.isFashion(this._info)){
        //     NotificationManager.Instance.dispatchEvent(FashionEvent.SHOW_FASHION_TAB);
        // }
      }
    }
  }

  private moveConfirm(b: boolean, flag: boolean) {
    if (b) {
      //确定替换
      this.moveBagToBag(
        this._info.bagType,
        this._info.objectId,
        this._info.pos,
        BagType.HeroEquipment,
        this.thane.id,
        this._toPos,
        1,
        true
      );
    } else {
      this.moveBagToBag(
        this._info.bagType,
        this._info.objectId,
        this._info.pos,
        BagType.HeroEquipment,
        this.thane.id,
        this._toPos,
        1,
        false
      );
    }
  }

  private getGoodsInfoByPos(pos: number): GoodsInfo {
    let goods: GoodsInfo = new GoodsInfo();
    let dic: SimpleDictionary =
      GoodsManager.Instance.getHeroGoodsListByTypeAndId(
        GoodsType.EQUIP,
        this.thane.id
      );
    for (const key in dic) {
      if (dic.hasOwnProperty(key)) {
        let info: GoodsInfo = dic[key];
        if (info && info.pos == pos && info.bagType == BagType.HeroEquipment) {
          goods.templateId = info.templateId;
          goods.join1 = info.join1;
          goods.join2 = info.join2;
          goods.join3 = info.join3;
          goods.join4 = info.join4;
        }
      }
    }
    return goods;
  }

  private moveBagToBag(
    beginBagType: number,
    beginObjectId: number,
    beginPos: number,
    endBagType: number,
    endObjectId: number,
    endPos: number,
    count: number,
    isUnstail: boolean = false
  ) {
    let roleCtrl: RoleCtrl = FrameCtrlManager.Instance.getCtrl(
      EmWindow.SRoleWnd
    ) as RoleCtrl;
    let wnd: SRoleWnd = roleCtrl.view as SRoleWnd;
    if (wnd && wnd.isShowing) {
      wnd.changeBagWnd = false;
      if (this.fashionModel.isFashion(this.info)) {
        wnd.page.selectedIndex = 1;
      } else {
        wnd.page.selectedIndex = 0;
      }
      Logger.yyz("⚽触发角色面板切页: " + wnd.page.selectedIndex);
    }

    PlayerManager.Instance.moveBagToBag(
      beginBagType,
      beginObjectId,
      beginPos,
      endBagType,
      endObjectId,
      endPos,
      count,
      isUnstail
    );
    Laya.timer.once(100, this, () => {
      NotificationManager.Instance.sendNotification(TipsEvent.EQUIP_TIPS_HIDE);
    });
  }

  public initFashion() {
    let optTyp: string = FashionManager.Instance.getOptType(this._info);
    if (optTyp.length > 0) {
      this.btn_use.title = optTyp;
      this.isFashion = true;
    }
  }

  /**
   * 放入
   * @returns
   */
  protected putInFashinComposite() {
    FashionManager.Instance.putInOut(this._info);
  }

  protected get fashionModel(): FashionModel {
    return FashionManager.Instance.fashionModel;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  public set equipType(value: number) {
    this._equipType = value;
    this.img_equiped.visible = value == EquipTip.EQUIPED;
  }

  public get equipType(): number {
    return this._equipType;
  }

  private onClickObtain(item: fairygui.GButton) {
    NotificationManager.Instance.sendNotification(TipsEvent.EQUIP_TIPS_HIDE);
    if (!item.data) return;
    let obtainId = (item.data as t_s_obtainData).ObtainId;
    let campaignId = (item.data as t_s_obtainData).Param1;
    let difficult = (item.data as t_s_obtainData).Param2;
    if (obtainId > 10000 && obtainId < 20000) {
      //战役
      FrameCtrlManager.Instance.open(EmWindow.PveCampaignWnd, {
        CampaignId: campaignId,
      });
    } else if (obtainId > 20000 && obtainId < 30000) {
      //多人副本
      FrameCtrlManager.Instance.open(EmWindow.PveMultiCampaignWnd, {
        CampaignId: campaignId,
        difficult: difficult,
      });
    }
    FrameCtrlManager.Instance.exit(EmWindow.SRoleWnd);
    FrameCtrlManager.Instance.exit(EmWindow.PlayerInfoWnd);
    switch (obtainId) {
      case 30001: //商城
        SwitchPageHelp.gotoShopFrame();
        break;
      case 30002: //迷宫商店
        // FrameCtrlManager.Instance.open(EmWindow.MazeShopWnd, { returnToWinFrameData: 0 });
        FrameCtrlManager.Instance.open(EmWindow.ShopWnd, {
          page: 3,
          returnToWinFrameData: 0,
        });
        break;
      case 30003: //高级公会商城
        // FrameCtrlManager.Instance.open(EmWindow.ShopCommWnd, { shopType: ShopGoodsInfo.CONSORTIA_SHOP })
        FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 1 });
        break;
      case 30004: //公会商城
        // FrameCtrlManager.Instance.open(EmWindow.ShopCommWnd, { shopType: ShopGoodsInfo.CONSORTIA_SHOP })
        FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 1 });
        break;
      case 30005: //紫晶商店
        FrameCtrlManager.Instance.open(EmWindow.MineralShopWnd);
        break;
      case 30006: //英灵兑换商店
        UIManager.Instance.ShowWind(EmWindow.PetExchangeShopWnd);
        break;
      case 30007: //竞技商店
        // FrameCtrlManager.Instance.open(EmWindow.PvpShop);
        FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 2 });
        break;
      case 30008: //农场商店
        FrameCtrlManager.Instance.open(EmWindow.FarmShopWnd);
        break;

      default:
        break;
    }
  }

  private removeEvent() {
    if (this._info && this._info.templateInfo.ObtainId) {
      this.list.off(fairygui.Events.CLICK_ITEM, this, this.onClickObtain);
      this.equipTipsContent
        .getChild("btn_obtain")
        .offClick(this, this.onObtain);
    }
    this.btn_use.offClick(this, this.onBtnUseClick);
  }

  protected clean() {
    this.txt_time.visible = false;
    this.txt_gradeCount.visible = false;
    this.txt_fashionIdentity.visible = false;
    this.txt_fashionProfile.visible = false;
    this.group_price.visible = false;
    this.group_star.visible = false;
    this.img_equiped.visible = false;
  }

  dispose() {
    this.removeEvent();
    ObjectUtils.disposeObject(this._figure);
    super.dispose();
  }
}
