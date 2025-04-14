import FUI_RuneGemItem from "../../../../../fui/Skill/FUI_RuneGemItem";
import FUI_RuneHoleHelpItem from "../../../../../fui/Skill/FUI_RuneHoleHelpItem";

//@ts-expect-error: External dependencies
import FUI_RuneHole_s from "../../../../../fui/Skill/FUI_RuneHole_s";
import LangManager from "../../../../core/lang/LangManager";
import { BaseItem } from "../../../component/item/BaseItem";
import { t_s_runeholeData } from "../../../config/t_s_runehole";
import { t_s_runetemplateData } from "../../../config/t_s_runetemplate";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { TempleteManager } from "../../../manager/TempleteManager";
import { TipsShowType } from "../../../tips/ITipedDisplay";
import SkillWndData from "../SkillWndData";

/**
 *
 */
export class RuneHoleHelpItem extends FUI_RuneHoleHelpItem {
  private _info: t_s_runeholeData;
  public item: BaseItem;

  get info(): t_s_runeholeData {
    return this._info;
  }

  set info(holeData: t_s_runeholeData) {
    this._info = holeData;
    this.initRuneHole();
    let shapeIdArr = [
      holeData.Hole1,
      holeData.Hole2,
      holeData.Hole3,
      holeData.Hole4,
      holeData.Hole5,
    ];
    if (holeData) {
      for (let i = 0; i < holeData.Length; i++) {
        const sid = Number(shapeIdArr[i]);
        let holeCom = this["rune_hole_" + (i + 1)] as FUI_RuneHole_s;
        if (holeCom) {
          //判断是否连线
          if (holeData.Length > 1 && i > 0) {
            this["img_pro" + i].visible = true;
          }
          holeCom.visible = true;
          holeCom.getControllerAt(0).setSelectedIndex(sid - 1);
        }
      }
    }
    this.updateDesc(holeData);
  }

  initRuneHole() {
    for (let i = 1; i <= 5; i++) {
      let hole = this.getChild("rune_hole_" + i) as FUI_RuneHole_s;
      hole.getControllerAt(0).setSelectedIndex(i - 1);
      hole.visible = false;
      if (this["img_pro" + i]) {
        this["img_pro" + i].visible = false;
        this["img_probg" + i].visible = false;
      }
    }
  }

  private conditionDesc: string = ""; //条件描述
  private effectDesc: string = ""; //效果描述
  private updateDesc(holeData: t_s_runeholeData) {
    this.conditionDesc = "";
    this.effectDesc = "";
    if (holeData && (holeData.Condition1 > 0 || holeData.Condition2 > 0)) {
      if (holeData.EffectType1 == 1) {
        this.getGemEffDesc(
          holeData.Condition1,
          holeData.ConditionParam1,
          holeData.AttributeType1,
          holeData.ValueType1,
          holeData.ValueParam1,
        );
      } else if (holeData.EffectType1 == 2) {
        this.getSkillEffDesc(
          holeData,
          holeData.Condition1,
          holeData.ConditionParam1,
        );
      }
      if (holeData.EffectType2 == 1) {
        this.getGemEffDesc(
          holeData.Condition2,
          holeData.ConditionParam2,
          holeData.AttributeType2,
          holeData.ValueType2,
          holeData.ValueParam2,
        );
      } else if (holeData.EffectType2 == 2) {
        this.getSkillEffDesc(
          holeData,
          holeData.Condition2,
          holeData.ConditionParam2,
        );
      }
      this.txt_desc1.text = this.conditionDesc;
      this.txt_desc2.text = this.effectDesc;

      this.txt_desc1.div.height = 85;
    }
  }

  getGemEffDesc(
    Condition: number,
    ConditionParam: number,
    AttributeType: number,
    ValueType: number,
    ValueParam: string,
  ) {
    let str: string = "";
    //判断激活条件-----------------------------------------------------------------------------------------
    if (Condition == 99) {
      str += LangManager.Instance.GetTranslation(
        "runeGem.str25",
        ConditionParam,
      );
    } else {
      let attriKey = SkillWndData.getAttributeType(Condition);
      str += LangManager.Instance.GetTranslation(
        "runeGem.str35",
        attriKey,
        ConditionParam,
      ); ////激活条件参数ConditionParam1
    }

    if (this.conditionDesc.length > 0) {
      this.conditionDesc += "<br>" + str;
    } else {
      this.conditionDesc += str;
    }
    str = "";
    //获得的属性-------------------------------------------------------------------------------------------
    let attriKey = SkillWndData.getAttributeType(AttributeType, false);
    if (ValueType == 0) {
      //固定值
      str += attriKey + "+" + ValueParam;
    } else if (ValueType == 1) {
      //百分比 【ValueParam1】会有两个值, 前者为属性类型, 后者为百分比的值
      let arr = ValueParam.split(",");
      //属性类型(该属性类型对应的值从服务器读取)
      str +=
        attriKey +
        "=" +
        SkillWndData.getAttributeType(Number(arr[0]), true) +
        "*" +
        arr[1] +
        "%";
      // let val = this.getSvrProperty(Number(arr[0]))
      // str +=  ',' + attriKey + '+'+ val * (Number(arr[1])/100);
    } //----------------------------------------------------------------------------------------------------
    if (this.effectDesc.length > 0) {
      this.effectDesc += "<br>" + str;
    } else {
      this.effectDesc += str;
    }
  }

  /**
   * 显示符孔的符石效果
   * @param holeCfg
   */
  getSkillEffDesc(
    holeData: t_s_runeholeData,
    Condition: number,
    ConditionParam: number,
  ) {
    let str: string = "";
    //判断激活条件-----------------------------------------------------------------------------------------
    if (Condition == 99) {
      str += LangManager.Instance.GetTranslation(
        "runeGem.str25",
        ConditionParam,
      );
    } else {
      let attriKey = SkillWndData.getAttributeType(Condition);
      str += LangManager.Instance.GetTranslation(
        "runeGem.str35",
        attriKey,
        ConditionParam,
      ); ////激活条件参数ConditionParam1
    }
    if (this.conditionDesc.length > 0) {
      this.conditionDesc += "<br>" + str;
    } else {
      this.conditionDesc += str;
    }
    str = "";
    //---------------------------------------------------------------------------------------------------

    //决定该技能生效的符文
    // if(holeData.RuneType1 != '0'){
    //     let tempStr:string='';
    //     let arr = holeData.RuneType1.split(',');
    //     for (let i = 0; i < arr.length; i++) {
    //         const element = Number(arr[i]);
    //         let info:t_s_runetemplateData = TempleteManager.Instance.getRuneTemplateInfoByRuneType(element);
    //         if(info){
    //             if(i <= arr.length-1){
    //                 tempStr += LangManager.Instance.GetTranslation('runeGem.str29',info.TemplateName);
    //             }
    //         }
    //     }
    //     str += tempStr;
    // }
    // if(holeData.RuneType2 != '0'){
    //     let tempStr:string='';
    //     let arr = holeData.RuneType2.split(',');
    //     for (let i = 0; i < arr.length; i++) {
    //         const element = Number(arr[i]);
    //         let info:t_s_runetemplateData = TempleteManager.Instance.getRuneTemplateInfoByRuneType(element);
    //         if(info){
    //             if(i <= arr.length-1){
    //                 tempStr += LangManager.Instance.GetTranslation('runeGem.str29',info.TemplateName);
    //             }
    //         }
    //     }
    //     str += tempStr;
    // }
    str += holeData.DescriptionLang;
    if (this.effectDesc.length > 0) {
      this.effectDesc += "<br>" + str;
    } else {
      this.effectDesc += str;
    }
  }
}
