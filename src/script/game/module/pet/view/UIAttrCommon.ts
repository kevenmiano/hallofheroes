/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2023-09-13 20:17:21
 * @LastEditors: jeremy.xu
 * @Description: 共用属性界面
 */

import LangManager from "../../../../core/lang/LangManager";
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import UIButton from "../../../../core/ui/UIButton";
import UIManager from "../../../../core/ui/UIManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { BagType } from "../../../constant/BagDefine";
import { FarmOperateType } from "../../../constant/FarmOperateType";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { BagEvent } from "../../../constant/event/NotificationEvent";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { FarmManager } from "../../../manager/FarmManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { TipsShowType } from "../../../tips/ITipedDisplay";
import FUIHelper from "../../../utils/FUIHelper";
import PetLandInfo from "../../farm/data/PetLandInfo";
import PetCtrl from "../control/PetCtrl";
import { PetData } from "../data/PetData";
import ArtifactCell from "./item/ArtifactCell";

export default class UIAttrCommon extends BaseFguiCom {
  private txtPhysicsAttackValue: fgui.GLabel;
  private txtMagicAttackValue: fgui.GLabel;
  private txtPhysicsDefenseValue: fgui.GLabel;
  private txtMagicDefenseValue: fgui.GLabel;
  private txtHpValue: fgui.GLabel;

  public btnJoinWar: UIButton;
  private btnCancelWar: UIButton;
  private btnCancelPractice: UIButton;
  private btnPetType: UIButton;
  private btnStage: UIButton;
  private btnSacrifice: UIButton;
  private btnAttrBase: UIButton;
  private _type: number = 0; //0属性技能界面 1潜能界面
  private _data: PetData;
  private c1: fgui.Controller;

  private txtPhysicsAttackValue1: fgui.GLabel;
  private txtPhysicsDefenseValue1: fgui.GLabel;
  private txtMagicAttackValue1: fgui.GLabel;
  private txtMagicDefenseValue1: fgui.GLabel;
  private txtHpValue1: fgui.GLabel;
  private txtArtifactPhysicsAttackValue1: fgui.GLabel;
  private txtArtifactPhysicsDefenseValue1: fgui.GLabel;
  private txtArtifactMagicAttackValue1: fgui.GLabel;
  private txtArtifactMagicDefenseValue1: fgui.GLabel;
  private txtArtifactHpValue1: fgui.GLabel;
  private potencyTxt: fgui.GLabel;
  private titleTxt1: fgui.GLabel;
  private titleTxt2: fgui.GLabel;
  private titleTxt3: fgui.GLabel;
  private titleTxt4: fgui.GLabel;
  private titleTxt5: fgui.GLabel;

  public artifactTxt: fgui.GTextField;
  public titleArtifactTxt1: fgui.GTextField;
  public titleArtifactTxt2: fgui.GTextField;
  public titleArtifactTxt3: fgui.GTextField;
  public titleArtifactTxt4: fgui.GTextField;
  public titleArtifactTxt5: fgui.GTextField;
  public artifact1: ArtifactCell;
  public artifact2: ArtifactCell;
  public btnAttrHelp2: UIButton;
  public btnAttrHelp1: UIButton;
  public descTxt1: fgui.GTextField;
  public descTxt2: fgui.GTextField;

  public get data(): PetData {
    return this._data;
  }
  public set type(value: number) {
    this._type = value;
  }

  public set data(value: PetData) {
    this.c1.selectedIndex = this._type;
    if (value) {
      this._data = value;
      this.refresh();
    } else {
      this.resetView();
    }
  }

  private _state: number = 0;
  public get state(): number {
    return this._state;
  }
  public set state(value: number) {
    this._state = value;
    if (value == 1 || value == 2) {
    }
  }

  constructor(comp: fgui.GComponent) {
    super(comp);
    this.c1 = this.getController("c1");
    this.initTitleTxt();
    this.addEvent();
  }

  private addEvent() {
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.onPutonEquip,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.DELETE_BAG,
      this.onPutonEquip,
      this,
    );
  }

  private onPutonEquip() {
    if (this.c1.selectedIndex == 2 || this.c1.selectedIndex == 1) {
      //潜能
      this.txtArtifactPhysicsAttackValue1.text =
        this._data.artifactAtrArr[0].toString(); //物攻
      this.txtArtifactMagicAttackValue1.text =
        this._data.artifactAtrArr[1].toString(); //魔攻
      this.txtArtifactPhysicsDefenseValue1.text =
        this._data.artifactAtrArr[2].toString(); //物防
      this.txtArtifactMagicDefenseValue1.text =
        this._data.artifactAtrArr[3].toString(); //魔防
      this.txtArtifactHpValue1.text = this._data.artifactAtrArr[4].toString(); //生命
      this.updateArtifactInfo();
    }
  }

  private initTitleTxt() {
    this.potencyTxt.text = LangManager.Instance.GetTranslation(
      "UIAttrCommon.potencyTxt",
    );
    for (let j: number = 1; j <= 5; j++) {
      this["titleTxt" + j].text = LangManager.Instance.GetTranslation(
        "petWnd.potency.itemTitle" + j,
      );
    }

    this.artifactTxt.text = LangManager.Instance.GetTranslation(
      "UIArtifact.titleTxt",
    );
    for (let j: number = 1; j <= 5; j++) {
      this["titleArtifactTxt" + j].text = LangManager.Instance.GetTranslation(
        "petWnd.potency.itemTitle" + j,
      );
    }
  }

  refresh() {
    if (this._data.template) {
      let value = this._data;
      this.btnPetType.icon = FUIHelper.getItemURL(
        EmPackName.Base,
        "Icon_PetType" + value.template.PetType,
      );
      this.btnPetType.title = value.petTypeLanguage;
      this.btnStage.icon = FUIHelper.getItemURL(
        EmPackName.Base,
        "Icon_PetStage" + value.template.Property2,
      );
      this.btnStage.title = value.petStageLanguage;

      this.txtPhysicsAttackValue.text = (
        value.physicalAttack + value.bagAttack
      ).toString();
      this.txtPhysicsDefenseValue.text = (
        value.physicalDefense + value.bagDefence
      ).toString();
      this.txtMagicAttackValue.text = (
        value.magicAttack + value.bagMagicattack
      ).toString();
      this.txtMagicDefenseValue.text = (
        value.magicDefense + value.bagMagicdefence
      ).toString();
      this.txtHpValue.text = (value.hp + value.bagLiving).toString();

      FUIHelper.setTipData(
        this.btnAttrBase.view,
        EmWindow.PetAttrTip,
        this._data,
        new Laya.Point(-22, 50),
      );
    }
    if (this.c1.selectedIndex == 1) {
      //潜能
      this.txtPhysicsAttackValue1.text = this._data.potencyAtrArr[0].toString(); //物攻
      this.txtMagicAttackValue1.text = this._data.potencyAtrArr[1].toString(); //魔攻
      this.txtPhysicsDefenseValue1.text =
        this._data.potencyAtrArr[2].toString(); //物防
      this.txtMagicDefenseValue1.text = this._data.potencyAtrArr[3].toString(); //魔防
      this.txtHpValue1.text = this._data.potencyAtrArr[4].toString(); //生命
      let str1: string = LangManager.Instance.GetTranslation(
        "UIAttrCommon.content1",
      );
      FUIHelper.setTipData(
        this.btnAttrHelp1.view,
        EmWindow.CommonTips,
        str1,
        new Laya.Point(0, 50),
      );
      this.descTxt1.text = LangManager.Instance.GetTranslation(
        "UIAttrCommon.descTxt1",
      );
      this.updateArtifactInfo();
    } else if (this.c1.selectedIndex == 2) {
      //神器
      this.txtArtifactPhysicsAttackValue1.text =
        this._data.artifactAtrArr[0].toString(); //物攻
      this.txtArtifactMagicAttackValue1.text =
        this._data.artifactAtrArr[1].toString(); //魔攻
      this.txtArtifactPhysicsDefenseValue1.text =
        this._data.artifactAtrArr[2].toString(); //物防
      this.txtArtifactMagicDefenseValue1.text =
        this._data.artifactAtrArr[3].toString(); //魔防
      this.txtArtifactHpValue1.text = this._data.artifactAtrArr[4].toString(); //生命
      let str2: string = LangManager.Instance.GetTranslation(
        "UIAttrCommon.content2",
      );
      FUIHelper.setTipData(
        this.btnAttrHelp2.view,
        EmWindow.CommonTips,
        str2,
        new Laya.Point(0, 50),
      );
      this.updateArtifactInfo();
      this.descTxt2.text = LangManager.Instance.GetTranslation(
        "UIAttrCommon.descTxt2",
      );
    }
    this.refreshBtnView();
  }

  private updateArtifactInfo() {
    this.artifact1.info = null;
    this.artifact1.c1.selectedIndex = 0;
    this.artifact2.info = null;
    this.artifact2.c1.selectedIndex = 0;
    let equipArr = GoodsManager.Instance.getGoodsByBagType(
      BagType.PET_EQUIP_BAG,
    );
    for (let i = 0; i < equipArr.length; i++) {
      const goodsInfo = equipArr[i];
      //判断英灵是否有穿戴装备
      if (goodsInfo.objectId == this._data.petId) {
        if (goodsInfo.pos == 6) {
          this.artifact1.type = 6;
          this.artifact1.info = goodsInfo;
        } else if (goodsInfo.pos == 7) {
          this.artifact2.type = 6;
          this.artifact2.info = goodsInfo;
        }
      }
    }
  }

  private refreshBtnView() {
    if (!this._data) return;

    this.btnJoinWar.visible = false;
    this.btnCancelWar.visible = false;
    this.btnCancelPractice.visible = false;

    if (this._data.isPractice) {
      this.btnCancelPractice.visible = true;
    } else {
      this.btnJoinWar.visible = !this._data.isEnterWar;
      this.btnCancelWar.visible = this._data.isEnterWar;
    }
  }

  private btnSacrificeClick() {
    if (!this._data) return;
    //被献祭英灵已穿戴装备, 需要拆除后才能献祭

    if (this._data.isEquiped()) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("petEquip.xianji"),
      );
      return;
    }
    if (this._data.isPractice) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("pet.inPractice"),
      );
      return;
    }

    if (this._data.isEnterWar) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "PetShowView.checkEnterWarForSacrifice",
        ),
      );
      return;
    }

    if (
      this.playerInfo.petChallengeFormationOfArray.indexOf(
        this._data.petId + "",
      ) >= 0
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("pet.inPetChanglle"),
      );
      return;
    }

    if (this._data.isRemote) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("pet.inRemotePet"),
      );
      return;
    }

    if (this._data.quality < 3) {
      //蓝色品质以下
      if (this._data.isDefenser) {
        let state: string =
          LangManager.Instance.GetTranslation("PetShowView.state1");
        let content: string = LangManager.Instance.GetTranslation(
          "PetShowView.inGuard",
          state,
        );
        content += "<br/>" + this.getSacrificeTip();

        SimpleAlertHelper.Instance.Show(
          null,
          null,
          null,
          content,
          null,
          null,
          this.__btnSacrificeClick.bind(this),
        );
        return;
      }
      SimpleAlertHelper.Instance.Show(
        null,
        null,
        null,
        this.getSacrificeTip(),
        null,
        null,
        this.__btnSacrificeClick.bind(this),
      );
    } else {
      let content: string =
        this.getStarHtmlName(this._data.name, this._data.quality) +
        "\n" +
        this.getSacrificeTip();
      SimpleAlertHelper.Instance.Show(
        null,
        null,
        null,
        content,
        null,
        null,
        this.__btnSacrificeClick.bind(this),
      );
    }
  }

  private __btnSacrificeClick(b: boolean, flag: boolean): void {
    if (b && this._data) {
      PetCtrl.sacrifice(this._data.petId);
    }
  }

  private getStarHtmlName(name: string, q: number): string {
    let profileColors: any[] = [
      "#ffffff",
      "#999999",
      "#59cd41",
      "#32a2f8",
      "#c300ff",
      "#ff8000",
      "#ce0f0f",
      "#ce0f0f",
    ];
    let color: string = profileColors[q];
    if (!color) color = profileColors[0];
    return LangManager.Instance.GetTranslation(
      "PetShowView.tempTxt",
      color,
      name,
    );
  }

  private getSacrificeTip(): string {
    //当品质=1时, 献祭有50%的几率获得一个资质丹。
    //当品质>2时, 数量=(品质-1)^4
    let tempStr: string;
    let count: number;
    if (this._data.quality <= 1) {
      tempStr = LangManager.Instance.GetTranslation(
        "PetShowView.sacrificeBtnTip2",
        "1-2",
      );
    } else if (this._data.quality == 2) {
      tempStr = LangManager.Instance.GetTranslation(
        "PetShowView.sacrificeBtnTip2",
        "2-3",
      );
    } else {
      count = Math.pow(this._data.quality - 1, 4);
      tempStr = LangManager.Instance.GetTranslation(
        "PetShowView.sacrificeBtnTip",
        count,
      );
    }
    return tempStr;
  }

  private btnJoinWarClick() {
    if (!this._data) return;
    let msg: string = "";

    if (this._data.isPractice) {
      msg = LangManager.Instance.GetTranslation("PetShowView.isPractice");
      MessageTipManager.Instance.show(msg);
      return;
    }

    let thaneGrade: number = ArmyManager.Instance.thane.grades;
    if (this._data.template && thaneGrade < this._data.template.NeedGrade) {
      msg = LangManager.Instance.GetTranslation(
        "PetShowView.needPlayerGrade",
        this._data.template.NeedGrade,
      );
      MessageTipManager.Instance.show(msg);
      return;
    }

    if (this._data.grade > ArmyManager.Instance.thane.grades) {
      msg = LangManager.Instance.GetTranslation("PetShowView.bigPlayerGrade");
      MessageTipManager.Instance.show(msg);
      return;
    }

    PetCtrl.enterWar(this._data.petId);
  }

  private btnCancelWarClick() {
    PetCtrl.rest(this._data.petId);
  }

  private btnCancelPracticeClick() {
    if (!this._data) return;
    let content: string = LangManager.Instance.GetTranslation(
      "FarmPetLandView.cancelPet",
    );
    SimpleAlertHelper.Instance.Show(
      null,
      null,
      null,
      content,
      null,
      null,
      (result: boolean, flag: boolean) => {
        if (!this._data) return;
        if (!result) return;

        let petLands: PetLandInfo[] =
          FarmManager.Instance.model.myFarm.getPetLandList();
        for (let index = 0; index < petLands.length; index++) {
          const petLandInfo = petLands[index];
          if (petLandInfo && petLandInfo.petId == this._data.petId) {
            FarmManager.Instance.sendFarmOper(
              this._data.userId,
              FarmOperateType.PET_PRACTICE_CANCEL,
              petLandInfo.pos,
              petLandInfo.petId,
              0,
            );
            return;
          }
        }
      },
    );
  }

  private btnAttrHelpClick() {
    let title: string = LangManager.Instance.GetTranslation("public.help");
    let content: string =
      LangManager.Instance.GetTranslation("pet.attribute.help");
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public get ctrl(): PetCtrl {
    let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Pet) as PetCtrl;
    return ctrl;
  }

  public resetView() {
    this.txtPhysicsAttackValue.text = "";
    this.txtPhysicsDefenseValue.text = "";
    this.txtMagicAttackValue.text = "";
    this.txtMagicDefenseValue.text = "";
    this.txtHpValue.text = "";
  }

  public dispose() {
    super.dispose();
  }
}
