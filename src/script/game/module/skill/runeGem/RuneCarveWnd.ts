//@ts-expect-error: External dependencies

import FUI_PropTip from "../../../../../fui/Skill/FUI_PropTip";
//@ts-expect-error: External dependencies

import FUI_RuneHole from "../../../../../fui/Skill/FUI_RuneHole";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import UIManager from "../../../../core/ui/UIManager";
import { BaseItem } from "../../../component/item/BaseItem";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_runeholeData } from "../../../config/t_s_runehole";
import { t_s_runetemplateData } from "../../../config/t_s_runetemplate";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { BagType } from "../../../constant/BagDefine";
import { CommonConstant } from "../../../constant/CommonConstant";
import { BagEvent, RuneEvent } from "../../../constant/event/NotificationEvent";
import { RuneOperationCode } from "../../../constant/RuneOperationCode";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { RuneInfo } from "../../../datas/RuneInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import SkillWndCtrl from "../SkillWndCtrl";
import SkillWndData from "../SkillWndData";
import { RuneGemItem } from "./RuneGemItem";

/**
 * @author:zhihua.zhou
 * @data: 2022-07-20
 * @description 符文雕刻
 */
export default class RuneCarveWnd extends BaseWindow {
  public frame: fgui.GComponent;
  public click_rect0: fgui.GComponent;
  public click_rect1: fgui.GComponent;
  public descCom: fgui.GComponent;
  public descCom1: fgui.GComponent;
  img_select: fgui.GComponent;
  c1: fairygui.Controller;
  c2: fairygui.Controller;
  txt_desc0: fairygui.GTextField;
  txt_desc_h0: fairygui.GTextField;
  txtCost: fairygui.GTextField;
  txt_desc1: fairygui.GTextField;
  txt_desc_h1: fairygui.GTextField;
  btn_carve: fairygui.GButton;
  btn_prop: fairygui.GButton;
  btn_replace: fairygui.GButton;
  btn_select: fairygui.GButton;
  checkBtn0: UIButton;
  checkBtn1: UIButton;
  runeInfo: RuneInfo;
  private cost: number = 1;
  private hasNum: number = 0;
  private hasInlayGem: boolean = false;
  private isClickCarve: boolean = false;
  private prop: BaseItem;
  propTip: FUI_PropTip;
  /** 当前符孔组合的孔的个数 */
  private holeNum: number = 1;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.txt_desc1 = this.descCom.getChild("txt_desc1").asRichTextField;
    this.txt_desc_h1 = this.descCom1.getChild("txt_desc_h1").asRichTextField;
    this.runeInfo = this.frameData.runeInfo;
    this.hasInlayGem = this.frameData.hasInlayGem;
    this.c1 = this.contentPane.getControllerAt(0);
    this.c2 = this.contentPane.getControllerAt(1);
    this.frame.getChild("title").text =
      LangManager.Instance.GetTranslation("runeGem.str2");
    this.frame.getChild("helpBtn").asButton.icon = fgui.UIPackage.getItemURL(
      EmPackName.Base,
      "Btn_Dia2_Warn",
    );
    this.txt_desc0.text = LangManager.Instance.GetTranslation("runeGem.str10");
    this.txt_desc_h0.text =
      LangManager.Instance.GetTranslation("runeGem.str10");
    this.btn_select.title =
      LangManager.Instance.GetTranslation("runeGem.str19");
    this.btn_replace.title = LangManager.Instance.GetTranslation(
      "tasktracetip.view.OpenBagTipView.btnTxt",
    );
    this.btn_select.visible = false;
    this.addEvent();
  }

  OnShowWind() {
    super.OnShowWind();
    for (let i = 1; i < 5; i++) {
      const role = this.contentPane.getChild("hole_" + i) as FUI_RuneHole;
      role.getControllerAt(0).setSelectedIndex(i - 1);
    }
    //消耗道具ID, 消耗数量
    let str =
      TempleteManager.Instance.getConfigInfoByConfigName(
        "runehole_use",
      ).ConfigValue;
    let arr = str.split(",");
    this.hasNum = GoodsManager.Instance.getGoodsNumByTempId(Number(arr[0]));
    this.cost = Number(arr[1]);
    this.txtCost.text = this.cost + "/" + this.hasNum;
    this.initRuneHole(this.runeInfo.runeHole);
    if (this.runeInfo.tempHole) {
      this.updateTempHole(this.runeInfo.tempHole);
      this.checkBtn0.selected = false;
      this.btn_replace.enabled = false;
    }

    let goodsInfo: GoodsInfo = new GoodsInfo();
    goodsInfo.templateId = CommonConstant.RUNE_HOLE_CARVE;
    // this.prop.info = goodsInfo;
    this.propTip.getChild("txt_tip0").text =
      goodsInfo.templateInfo.TemplateNameLang;
    this.propTip.getChild("txt_tip1").text =
      goodsInfo.templateInfo.DescriptionLang;
    (this.propTip.getChild("tip_item") as BaseItem).info = goodsInfo;
  }

  OnBtnClose() {
    if (!this.isClickCarve) {
      super.OnBtnClose();
      return;
    }
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let content: string = LangManager.Instance.GetTranslation("runeGem.str20");
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.confirmFunc1.bind(this),
    );
  }

  private confirmFunc1(result: boolean) {
    if (result) {
      this.hide();
    }
  }

  /**
   * 初始化随机获得的符文孔
   * @param runelHole   符文孔id|形状id  1002,1004,1001|2,4,1
   */
  public initRuneHole(runelHole: string) {
    this.getInayedGemTotalLevel();

    let arr = runelHole.split("|");
    let holeIdArr = arr[0].split(",");
    let shapeIdArr = arr[1].split(",");
    this.holeNum = shapeIdArr.length;
    let holeData: t_s_runeholeData;
    let index: number = 0;
    let gemEffectDesc: string = ""; //符石效果描述
    let skillEffectDesc: string = ""; //技能效果描述
    let effNum: number = 0; //效果数量
    for (let i = 0; i < holeIdArr.length; i++) {
      const holeId = Number(holeIdArr[i]);
      holeData = TempleteManager.Instance.getRuneHoleTemplateByTid(holeId);
      if (holeData) {
        for (let j = 0; j < holeData.Length; j++) {
          const sid = Number(shapeIdArr[index]);
          index++;
          let holeCom = this["hole_" + index] as FUI_RuneHole;
          if (holeCom) {
            holeCom.getChild("txt_name").asTextField.text =
              LangManager.Instance.GetTranslation("runeGem.holeType" + sid);
            //判断是否连线
            (holeCom.getController("c1") as fairygui.Controller).selectedIndex =
              sid - 1;
            holeCom.visible = true;
            if (holeData.Length > 1 && j > 0) {
              this["img_pro" + j].visible = true;
            }
          }
        }
        if (holeData.Condition1 > 0 || holeData.Condition2 > 0) {
          //EffectType = 2技能效果, 1符石效果
          if (holeData.EffectType1 == 1) {
            effNum++;
            gemEffectDesc = this.getGemEffDesc(
              effNum,
              holeData.Condition1,
              holeData.ConditionParam1,
              holeData.AttributeType1,
              holeData.ValueType1,
              holeData.ValueParam1,
              holeData.RuneType1,
            );
          } else if (holeData.EffectType1 == 2) {
            effNum++;
            if (effNum == 2) {
              skillEffectDesc +=
                "<br>" +
                this.getSkillEffDesc(
                  effNum,
                  holeData,
                  holeData.Condition1,
                  holeData.ConditionParam1,
                  holeData.RuneType1,
                );
            } else {
              skillEffectDesc = this.getSkillEffDesc(
                effNum,
                holeData,
                holeData.Condition1,
                holeData.ConditionParam1,
                holeData.RuneType1,
              );
            }
          }
          if (holeData.EffectType2 == 1) {
            effNum++;
            if (effNum == 2) {
              gemEffectDesc +=
                "<br>" +
                this.getGemEffDesc(
                  effNum,
                  holeData.Condition2,
                  holeData.ConditionParam2,
                  holeData.AttributeType2,
                  holeData.ValueType2,
                  holeData.ValueParam2,
                  holeData.RuneType2,
                );
            } else {
              gemEffectDesc = this.getGemEffDesc(
                effNum,
                holeData.Condition2,
                holeData.ConditionParam2,
                holeData.AttributeType2,
                holeData.ValueType2,
                holeData.ValueParam2,
                holeData.RuneType2,
              );
            }
          } else if (holeData.EffectType2 == 2) {
            effNum++;
            if (effNum == 2) {
              skillEffectDesc +=
                "<br>" +
                this.getSkillEffDesc(
                  effNum,
                  holeData,
                  holeData.Condition2,
                  holeData.ConditionParam2,
                  holeData.RuneType2,
                );
            } else {
              skillEffectDesc = this.getSkillEffDesc(
                effNum,
                holeData,
                holeData.Condition2,
                holeData.ConditionParam2,
                holeData.RuneType2,
              );
            }
          }
        }
      }
    }
    this.txt_desc1.text = gemEffectDesc + skillEffectDesc;
  }

  getGemEffDesc(
    effNum: number,
    Condition: number,
    ConditionParam: number,
    AttributeType: number,
    ValueType: number,
    ValueParam: string,
    RuneType: string,
  ): string {
    let str: string = "";
    // let isActive = false;
    //判断激活条件-----------------------------------------------------------------------------------------
    if (Condition == 99) {
      str += LangManager.Instance.GetTranslation(
        "runeGem.str25",
        ConditionParam,
      );
      // isActive = this.totalLevel >= ConditionParam;
    } else {
      let attriKey = SkillWndData.getAttributeType(Condition);
      str += LangManager.Instance.GetTranslation(
        "runeGem.str35",
        attriKey,
        ConditionParam,
      ); ////激活条件参数ConditionParam1
      // isActive = this.checkIsActive(Condition,ConditionParam);
    }
    if (RuneType != "0") {
      // let type = this.runeInfo.templateInfo.RuneType.toString();
      // let typeArr = RuneType.split(',');
      // if(typeArr.indexOf(type) == -1){
      //     isActive = false;
      // }else{
      //     isActive = isActive && true;
      // }
    }
    // if(!isActive){
    //     str = effNum +'.'+LangManager.Instance.GetTranslation('runeGem.str31')+ str;
    // }else{
    str = effNum + "." + str;
    // }
    //---------------------------------------------------------------------------------------------------

    str += "；" + LangManager.Instance.GetTranslation("runeGem.str32");
    //获得的属性-------------------------------------------------------------------------------------------
    let attriKey = SkillWndData.getAttributeType(AttributeType);
    if (ValueType == 0) {
      //固定值
      str += attriKey + "+" + ValueParam;
      // if(!isActive){
      //     str = '[color=#666666]' + str + '[/color]';
      // }
    } else if (ValueType == 1) {
      //百分比 【ValueParam1】会有两个值, 前者为属性类型, 后者为百分比的值
      let arr = ValueParam.split(",");
      // if(!isActive){
      str +=
        attriKey +
        "=" +
        SkillWndData.getAttributeType(Number(arr[0]), true) +
        "*" +
        arr[1] +
        "%";
      //     str = '[color=#666666]' + str + '[/color]';
      // }else
      // {
      //属性类型(该属性类型对应的值从服务器读取)
      // let val = this.getSvrProperty(Number(arr[0]))
      // str +=  attriKey + '+'+ val * (Number(arr[1])/100);
      // }
    } //----------------------------------------------------------------------------------------------------

    return str;
  }

  /**
   * 显示符孔的符石效果
   * @param holeCfg
   */
  getSkillEffDesc(
    effNum: number,
    holeData: t_s_runeholeData,
    Condition: number,
    ConditionParam: number,
    RuneType: string,
  ): string {
    let str: string = "";
    // let isActive = false;
    //判断激活条件-----------------------------------------------------------------------------------------
    if (Condition == 99) {
      str += LangManager.Instance.GetTranslation(
        "runeGem.str25",
        ConditionParam,
      );
      // isActive = this.totalLevel >= ConditionParam;
    } else {
      let attriKey = SkillWndData.getAttributeType(Condition);
      str += LangManager.Instance.GetTranslation(
        "runeGem.str35",
        attriKey,
        ConditionParam,
      ); ////激活条件参数ConditionParam1
      // isActive = this.checkIsActive(Condition,ConditionParam);
    }
    // if(!isActive){
    str =
      effNum + "." + LangManager.Instance.GetTranslation("runeGem.str31") + str;
    // }else{
    //     str= effNum+ '.'+str;
    // }

    //---------------------------------------------------------------------------------------------------

    //决定该技能生效的符文
    if (RuneType != "0") {
      // let tempStr:string='';
      // let arr = RuneType.split(',');
      // for (let i = 0; i < arr.length; i++) {
      //     const element = Number(arr[i]);
      //     let info:t_s_runetemplateData = TempleteManager.Instance.getRuneTemplateInfoByRuneType(element);
      //     if(info){
      //         // if(i <= arr.length-1){
      //         //     tempStr += LangManager.Instance.GetTranslation('runeGem.str29',info.TemplateName);
      //         // }
      //     }
      // }
      // str += tempStr;
      // let type = this.runeInfo.templateInfo.RuneType.toString();
      // let typeArr = RuneType.split(',');
      // if(typeArr.indexOf(type) == -1){
      //     isActive = false;
      // }else{
      //     isActive = isActive && true;
      // }
    }

    str +=
      "；" +
      LangManager.Instance.GetTranslation("runeGem.str32") +
      holeData.DescriptionLang;
    // if(!isActive){
    //     str = '[color=#666666]' + str + '[/color]';
    // }
    return str;
  }

  private totalLevel: number = 0;

  /**
   * 获得已镶嵌符石的总等级
   */
  getInayedGemTotalLevel() {
    this.totalLevel = 0;
    let runeType = this.runeInfo.templateInfo.RuneType;
    let bagData = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE_EQUIP);
    if (bagData.length > 0) {
      for (let i = 0; i < bagData.length; i++) {
        const goodsInfo = bagData[i];
        let index = goodsInfo.pos - (runeType - 1) * 10;
        if (index >= 0 && index <= 4) {
          this.totalLevel += goodsInfo.strengthenGrade;
        }
      }
    }
  }

  /**
   * 判断符孔上是否镶嵌有符石
   * @param holeIndex
   * @returns
   */
  // checkHoleInayGem(holeIndex:number):boolean{
  //     let result:boolean = false;
  //     let runeType= this.runeInfo.templateInfo.RuneType
  //     let bagData = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE_EQUIP);
  //     if(bagData.length > 0){
  //         for (let i = 0; i < bagData.length; i++) {
  //             const goodsInfo = bagData[i];
  //             let index = goodsInfo.pos - (runeType -1) * 10
  //             if(index == holeIndex){
  //                 return true;
  //             }
  //         }
  //     }
  //     return result;
  // }

  getSvrProperty(attriType: number): number {
    let result: number = 0;
    switch (attriType) {
      case 1:
        result = this.runeInfo.baseProperties["power"];
        break;
      case 2:
        result = this.runeInfo.baseProperties["agility"];
        break;
      case 3:
        result = this.runeInfo.baseProperties["intel"];
        break;
      case 4:
        result = this.runeInfo.baseProperties["physi"];
        break;
      case 5:
        result = this.runeInfo.baseProperties["captain"];
        break;
      case 6:
        result = this.runeInfo.baseProperties["attack"];
        break;
      case 7:
        result = this.runeInfo.baseProperties["defence"];
        break;
      case 8:
        result = this.runeInfo.baseProperties["magicattack"];
        break;
      case 9:
        result = this.runeInfo.baseProperties["magicdefence"];
        break;
      case 10:
        result = this.runeInfo.baseProperties["live"];
        break;
      case 11:
        result = this.runeInfo.baseProperties["conat"];
        break;

      default:
        break;
    }
    return result;
  }

  /**
   * 某种属性符石的等级
   * @param attriType
   * @param val
   * @returns
   */
  checkIsActive(attriType: number, val: number): boolean {
    if (!this.runeInfo.baseProperties) return false;
    let result: boolean = false;
    let level = 0;
    let runeType = this.runeInfo.templateInfo.RuneType;
    let bagData = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE_EQUIP);
    if (bagData.length > 0) {
      for (let i = 0; i < bagData.length; i++) {
        const goodsInfo = bagData[i];
        let index = goodsInfo.pos - (runeType - 1) * 10;
        if (index >= 0 && index <= 4) {
          if (Number(goodsInfo.templateInfo.Property1) == attriType) {
            level += goodsInfo.strengthenGrade;
          }
        }
      }
    }
    result = level >= val;
    return result;
  }
  /**
   * 显示孔上镶嵌的符石
   */
  // private showInlayGem(){
  //     for (let i = 1; i <= 5; i++) {
  //         let gem = this['rune_gem_'+i] as RuneGemItem;
  //         gem.touchable = false;
  //         gem.visible = false;
  //     }
  //     let bagData = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE_EQUIP);
  //     if(bagData.length > 0){
  //         for (let i = 0; i < bagData.length; i++) {
  //             const goodsInfo = bagData[i];
  //             let index = goodsInfo.pos - (this.runeInfo.templateInfo.RuneType -1) * 10
  //             let gem = this['rune_gem_'+ (index+1)] as RuneGemItem;
  //             if(gem){
  //                 gem.getChild('txt_name').asTextField.text = goodsInfo.templateInfo.TemplateName;
  //                 gem.info = goodsInfo;
  //                 gem.visible = true;
  //                 this.hasInlayGem = true;
  //             }
  //         }
  //     }
  // }

  /**
   * 雕刻
   * @param runeInfo
   */
  private __runeRefreshHandler(runeInfo: RuneInfo) {
    if (runeInfo.runeId == this.runeInfo.runeId) {
      this.updateTempHole(runeInfo.tempHole);
      this.checkBtn1.selected = false;
      this.checkBtn0.selected = false;
      let str =
        TempleteManager.Instance.getConfigInfoByConfigName(
          "runehole_use",
        ).ConfigValue;
      let arr = str.split(",");
      this.hasNum = GoodsManager.Instance.getGoodsNumByTempId(Number(arr[0]));
      this.cost = Number(arr[1]);
      this.txtCost.text = this.cost + "/" + this.hasNum;
    }
  }

  private resetTempHole() {
    for (let j = 1; j <= 5; j++) {
      let holeCom = this["rune_hole_" + j] as FUI_RuneHole;
      if (holeCom) {
        holeCom.visible = false;
        if (this["img_pro_h" + j]) {
          this["img_pro_h" + j].visible = false;
        }
      }
    }
  }

  private updateTempHole(tempHole: string) {
    this.txt_desc_h1.text = "";
    this.resetTempHole();
    this.c1.setSelectedIndex(1);
    let arr = tempHole.split("|");
    let holeIdArr = arr[0].split(",");
    let shapeIdArr = arr[1].split(",");
    let holeData: t_s_runeholeData;
    let index: number = 0;
    let effNum: number = 0;
    let gemEffectDesc: string = ""; //符石效果描述
    let skillEffectDesc: string = ""; //技能效果描述
    for (let i = 0; i < holeIdArr.length; i++) {
      const holeId = Number(holeIdArr[i]);
      holeData = TempleteManager.Instance.getRuneHoleTemplateByTid(holeId);
      if (holeData) {
        for (let j = 0; j < holeData.Length; j++) {
          const sid = Number(shapeIdArr[index]);
          index++;
          let holeCom = this["rune_hole_" + index] as FUI_RuneHole;
          if (holeCom) {
            holeCom.getChild("txt_name").asTextField.text =
              LangManager.Instance.GetTranslation("runeGem.holeType" + sid);
            //判断是否连线
            if (holeData.Length > 1 && j > 0) {
              this["img_pro_h" + j].visible = true;
            }
            holeCom.visible = true;
            holeCom.getControllerAt(0).setSelectedIndex(sid - 1);
          }
        }
        if (holeData.Condition1 > 0 || holeData.Condition2 > 0) {
          //EffectType = 2技能效果, 1符石效果
          if (holeData.EffectType1 == 1) {
            effNum++;
            gemEffectDesc = this.getGemEffDesc(
              effNum,
              holeData.Condition1,
              holeData.ConditionParam1,
              holeData.AttributeType1,
              holeData.ValueType1,
              holeData.ValueParam1,
              holeData.RuneType1,
            );
          } else if (holeData.EffectType1 == 2) {
            effNum++;
            if (effNum == 2) {
              skillEffectDesc +=
                "<br>" +
                this.getSkillEffDesc(
                  effNum,
                  holeData,
                  holeData.Condition1,
                  holeData.ConditionParam1,
                  holeData.RuneType1,
                );
            } else {
              skillEffectDesc = this.getSkillEffDesc(
                effNum,
                holeData,
                holeData.Condition1,
                holeData.ConditionParam1,
                holeData.RuneType1,
              );
            }
          }
          if (holeData.EffectType2 == 1) {
            effNum++;
            if (effNum == 2) {
              gemEffectDesc +=
                "<br>" +
                this.getGemEffDesc(
                  effNum,
                  holeData.Condition2,
                  holeData.ConditionParam2,
                  holeData.AttributeType2,
                  holeData.ValueType2,
                  holeData.ValueParam2,
                  holeData.RuneType2,
                );
            } else {
              gemEffectDesc = this.getGemEffDesc(
                effNum,
                holeData.Condition2,
                holeData.ConditionParam2,
                holeData.AttributeType2,
                holeData.ValueType2,
                holeData.ValueParam2,
                holeData.RuneType2,
              );
            }
          } else if (holeData.EffectType2 == 2) {
            effNum++;
            if (effNum == 2) {
              skillEffectDesc +=
                "<br>" +
                this.getSkillEffDesc(
                  effNum,
                  holeData,
                  holeData.Condition2,
                  holeData.ConditionParam2,
                  holeData.RuneType2,
                );
            } else {
              skillEffectDesc = this.getSkillEffDesc(
                effNum,
                holeData,
                holeData.Condition2,
                holeData.ConditionParam2,
                holeData.RuneType2,
              );
            }
          }
        }
      }
    }
    this.txt_desc_h1.text = gemEffectDesc + skillEffectDesc;
  }

  private addEvent() {
    this.btn_carve.onClick(this, this.onCarve);
    this.btn_replace.onClick(this, this.onReplace);
    this.btn_select.onClick(this, this.onSelect);
    this.checkBtn0.onClick(this, this.onSelect0);
    this.checkBtn1.onClick(this, this.onSelect1);
    this.click_rect0.onClick(this, this.onRect0);
    this.click_rect1.onClick(this, this.onRect1);
    this.btn_prop.onClick(this, this.onProp);
    NotificationManager.Instance.addEventListener(
      RuneEvent.CARVE_RUNE,
      this.__runeRefreshHandler,
      this,
    );
    // GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__bagItemUpdate, this);
  }

  private removeEvent() {
    this.btn_carve.offClick(this, this.onCarve);
    this.btn_replace.offClick(this, this.onReplace);
    this.checkBtn0.offClick(this, this.onSelect0);
    this.checkBtn1.offClick(this, this.onSelect1);
    this.click_rect0.offClick(this, this.onRect0);
    this.click_rect1.offClick(this, this.onRect1);
    this.btn_prop.offClick(this, this.onProp);
    NotificationManager.Instance.removeEventListener(
      RuneEvent.CARVE_RUNE,
      this.__runeRefreshHandler,
      this,
    );
    // GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__bagItemUpdate, this);
  }

  private onProp() {
    this.propTip.visible = true;
    Laya.timer.clear(this, this.hideTip);
    Laya.timer.once(3000, this, this.hideTip);
  }

  private hideTip() {
    this.propTip.visible = false;
  }

  // private __bagItemUpdate(info: GoodsInfo){
  //     this.showInlayGem();
  // }

  onRect0() {
    this.checkBtn0.selected = true;
    this.onSelect0();
    this.btn_select.enabled = true;
    this.c2.setSelectedIndex(0);
    this.img_select.visible = true;
  }

  onRect1() {
    this.checkBtn1.selected = true;
    this.onSelect1();
    this.btn_replace.enabled = true;
    this.c2.setSelectedIndex(1);
    this.img_select.visible = true;
  }

  onSelect0() {
    this.checkBtn1.selected = false;
    this.btn_replace.visible = false;
    this.btn_select.visible = true;
    this.btn_select.enabled = !this.checkBtn0.selected;
    if (this.checkBtn0.selected) {
      if (this.c2.selectedIndex == 0) {
        this.img_select.visible = false;
      }
    } else {
      this.img_select.visible = true;
      this.c2.selectedIndex = 0;
    }
  }

  onSelect1() {
    this.checkBtn0.selected = false;
    this.btn_replace.visible = true;
    this.btn_select.visible = false;
    this.btn_replace.enabled = !this.checkBtn1.selected;
    if (this.checkBtn1.selected) {
      if (this.c2.selectedIndex == 1) {
        this.img_select.visible = false;
      }
    } else {
      this.img_select.visible = true;
      this.c2.selectedIndex = 1;
    }
  }

  onCarve() {
    if (this.hasNum < this.cost) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("lackCarveProp"),
      );
      return;
    }
    this.btn_replace.enabled = this.btn_select.enabled = false;
    this.controler.reqRuneHoleOpt(
      this.runeInfo.runeId,
      RuneOperationCode.RUNE_HOLE_CARVE,
    );
    this.isClickCarve = true;
  }

  private confirmFunc(result: boolean) {
    if (result) {
      //当前镶嵌的符石自动卸下, 若背包位置不足则取消操作并二级确定框提示: 符石背包空间不足
      //若背包空间足够, 成功卸下符石并扣除材料进行一次雕刻
      if (this.hasInlayGem) {
        this.controler.reqRuneGemUnload(this.runeInfo.runeId, 101);
      }
      this.controler.reqRuneHoleOpt(
        this.runeInfo.runeId,
        RuneOperationCode.RUNE_HOLE_REPLACE,
      );
      this.hide();
    }
  }

  private confirmFunc2(result: boolean) {
    if (result) {
      this.hide();
    }
  }

  /**
   * 保留
   */
  onSelect() {
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let content: string = LangManager.Instance.GetTranslation("runeGem.str22");
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.confirmFunc2.bind(this),
    );
  }

  onReplace() {
    //玩家当前符孔≥4孔时, 弹出二次确认窗口, 是否替换当前符孔组
    if (this.holeNum > 3) {
      //当玩家点击替换时 优先弹出二级确认框: 雕刻需要卸下当前符石
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      let content: string =
        LangManager.Instance.GetTranslation("runeGem.str40");
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        prompt,
        content,
        confirm,
        cancel,
        this.confirmFunc.bind(this),
      );
    } else {
      this.confirmFunc(true);
    }
  }

  private helpBtnClick() {
    UIManager.Instance.ShowWind(EmWindow.RuneHoleHelpWnd);
  }

  private get controler(): SkillWndCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
  }

  OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }
}
