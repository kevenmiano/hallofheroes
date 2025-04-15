import FUI_SFotruneHead from "../../../../fui/SBag/FUI_SFotruneHead";
import SoundManager from "../../../core/audio/SoundManager";
import LangManager from "../../../core/lang/LangManager";
import { SocketManager } from "../../../core/net/SocketManager";
import { IconFactory } from "../../../core/utils/IconFactory";
import BaseTipItem from "../../component/item/BaseTipItem";
import { BagType } from "../../constant/BagDefine";
import GoodsSonType from "../../constant/GoodsSonType";
import { SoundIds } from "../../constant/SoundIds";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import { FateGuardEvent } from "../../constant/event/NotificationEvent";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import { FateRotarySkillInfo } from "../../datas/FateRotarySkillInfo";
import { GoodsManager } from "../../manager/GoodsManager";
import { TempleteManager } from "../../manager/TempleteManager";
//@ts-expect-error: External dependencies
import FateEditMsg = com.road.yishi.proto.fate.FateEditMsg;

export class SFateRotarySkillItem extends FUI_SFotruneHead {
  private _firstSkill: FateRotarySkillInfo;

  public tipItem: BaseTipItem;
  public constructor() {
    super();
  }

  public get itemData(): FateRotarySkillInfo {
    return this._firstSkill;
  }

  protected onConstruct() {
    super.onConstruct();
    this.costTxt.text = LangManager.Instance.GetTranslation(
      "armyII.viewII.equip.JewelFrame.JewelCostTxt",
    );
    this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_STONE);
  }

  public refreshRunCircleView() {
    if (this._firstSkill) {
      let goodsCount = GoodsManager.Instance.getCountBySontypeAndBagType(
        GoodsSonType.SONTYPE_FATE_STONE,
        BagType.Player,
      );
      this.peiYbtn.enabled = goodsCount > 0;

      this.fotruneName.text = this._firstSkill.template.SkillTemplateName;
      let temp = this._firstSkill.template;
      let nextTemp = this._firstSkill.nextUpgradeTemp;
      this.skillIcon.icon = IconFactory.getCommonIconPath(temp.Icons);
      this.fotruneName.color = temp.SonType == 2000 ? "#c580ff" : "#00fff6";
      if (temp.SkillDescription) {
        this.buffDesc.text = this.formateColor(
          temp.SkillDescription,
          "#FFECC6",
        );
        this.buffDesc.x = 28;
        this.buffDesc.y = 162;
      } else {
        this.buffDesc.text = LangManager.Instance.GetTranslation(
          "faterotary.LevelMin",
        );
        this.buffDesc.x = 28 + 30;
        this.buffDesc.y = 162 + 30;
      }
      this.levelLab.text = LangManager.Instance.GetTranslation(
        "public.level3",
        this._firstSkill.grades,
      );

      if (nextTemp) {
        let nextSkillTemp =
          TempleteManager.Instance.getSkillTemplateInfoBySonTypeAndGrade(
            temp.SonType,
            temp.Grades + 1,
          );
        let need = nextTemp.Data - this._firstSkill.currentGp;
        this.costInput.text = need + "";
        this.peiYbtn.getChild("redDot").visible = goodsCount >= need;

        this.nextBuffDesc.text = this.formateColor(
          nextSkillTemp.SkillDescription,
          "#71F000",
        );
        let process = this._firstSkill.currentGp / nextTemp.Data;
        this.progress.value = process * 100;
        this.txt_bar.text = this._firstSkill.currentGp + "/" + nextTemp.Data;
      } else {
        this.costInput.text = "0";
        this.peiYbtn.enabled = this.peiYbtn.getChild("redDot").visible = false;
        // this.nextBuffDesc.x = 297;
        this.nextBuffDesc.y = 162 + 30;
        this.nextBuffDesc.text = LangManager.Instance.GetTranslation(
          "faterotary.LevelMax",
        );
        this.progress.value = 100;
        // let currentTemp = TempleteManager.Instance.getTemplateByTypeAndLevel(this._firstSkill.grades, UpgradeType.UPGRADE_TYPE_FATE_GUARD);
        // this.txt_bar.text = currentTemp.Data + "/" + currentTemp.Data;
        this.txt_bar.text = "MAX";
        this.maxTitle.visible = true;
        this.costInput.visible = false;
        this.tipItem.visible = false;
        this.costTxt.visible = false;
        this.peiYbtn.visible = false;
      }
      let grade = this._firstSkill.grades;
      if (grade >= 15) {
        this.newSkillLight.text = LangManager.Instance.GetTranslation(
          "faterotary.FateRotaryFrame.GetFateStoneMax",
        );
      } else {
        let lightLevel = grade < 5 ? "5" : grade < 10 ? "10" : "15";
        this.newSkillLight.text = LangManager.Instance.GetTranslation(
          "faterotary.FateRotaryFrame.GetFateStone1",
          lightLevel,
        );
      }
    }
  }

  private __trainHandler() {
    SoundManager.Instance.play(SoundIds.CONFIRM_SOUND);
    let goodsCount = GoodsManager.Instance.getCountBySontypeAndBagType(
      GoodsSonType.SONTYPE_FATE_STONE,
      BagType.Player,
    );
    let need = +this.costInput.text;
    if (need > goodsCount) {
      need = goodsCount;
    }
    //没有命运石, 按钮应该是不能点击
    if (need == 0) {
      return;
    }
    this.sendFateEditMsg(need);
  }

  public setData(value: FateRotarySkillInfo) {
    this._firstSkill = value;
    if (!this._firstSkill) {
    } else {
      this.initEvent();
    }
  }

  private initEvent() {
    this.peiYbtn.onClick(this, this.__trainHandler);
    this._firstSkill.addEventListener(
      FateGuardEvent.FATE_GUARD_GP,
      this.__skillChangeHandler,
      this,
    );
  }

  private __textChangeHandler() {
    let max = GoodsManager.Instance.getCountBySontypeAndBagType(
      GoodsSonType.SONTYPE_FATE_STONE,
      BagType.Player,
    );
    this.peiYbtn.enabled = max > 0;
    let value = +this.costInput.text;
    if (value >= max) {
      value = max;
    }
    this.costInput.text = value + "";
    var nextTemp = this._firstSkill.nextUpgradeTemp;
    this.peiYbtn.enabled = value > 0 && !!nextTemp;
  }

  public __skillChangeHandler() {
    this.refreshRunCircleView();
  }
  public getData(): FateRotarySkillInfo {
    return this._firstSkill;
  }

  private sendFateEditMsg(itemCount: number) {
    if (itemCount <= 0) {
      return;
    }
    if (isNaN(itemCount)) {
      return;
    }
    let msg: FateEditMsg = new FateEditMsg();
    msg.skillSonType = this._firstSkill.fateTypes;
    msg.useItemCount = itemCount;
    SocketManager.Instance.send(C2SProtocol.U_C_FATE_TRAIN, msg);
  }

  dispose() {
    if (!this.isDisposed) {
      TweenMax.killTweensOf(this);
      this.removeEvent();
    }
    super.dispose();
  }

  private removeEvent() {
    this.peiYbtn && this.peiYbtn.offClick(this, this.__trainHandler);
    this._firstSkill &&
      this._firstSkill.removeEventListener(
        FateGuardEvent.FATE_GUARD_GP,
        this.__skillChangeHandler,
        this,
      );
  }

  private formateColor(str: string, color: string) {
    let temp = "";
    let content = "+0123456789%";
    let replaceList: string[] = [];
    for (let i = 0, length = str.length; i < length; i++) {
      if (content.indexOf(str[i]) >= 0) {
        temp += str[i];
        if (i != length - 1) continue;
      }
      temp && replaceList.push(temp);
      temp = "";
    }
    let i = 0;
    for (let s of replaceList) {
      str = str.replace(s, `{${i}}`);
      i++;
    }
    i = 0;
    for (let s of replaceList) {
      str = str.replace(`{${i}}`, `<font color="${color}">${s}</font>`);
      i++;
    }
    return str;
  }
}
