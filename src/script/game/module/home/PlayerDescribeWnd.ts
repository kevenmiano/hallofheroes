import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { TempleteManager } from "../../manager/TempleteManager";

/**
 * 个人信息详细说明窗口
 */
export default class PlayerDescribeWnd extends BaseWindow {
  private txt_gameName: fgui.GTextField;
  private txt_gold: fgui.GTextField;
  private txt_head: fgui.GTextField;
  private txt_stamina: fgui.GTextField;
  private txt_level: fgui.GTextField;
  private txt_fight: fgui.GTextField;
  private txt_diamond: fgui.GTextField;
  private txt_blood: fgui.GTextField;
  private txt_solider: fgui.GTextField;
  private txt_buff: fgui.GTextField;
  private txt_exp: fgui.GTextField;

  private txt_gold_des: fgui.GTextField;
  private txt_head_des: fgui.GTextField;
  private txt_stamina_des: fgui.GTextField;
  private txt_level_des: fgui.GTextField;
  private txt_fight_des: fgui.GTextField;
  private txt_diamond_des: fgui.GTextField;
  private txt_blood_des: fgui.GTextField;
  private txt_solider_des: fgui.GTextField;
  private txt_buff_des: fgui.GTextField;
  private txt_exp_des: fgui.GTextField;

  public OnInitWind(): void {
    super.OnInitWind();
    this.initData();
    this.setCenter();
    this.addEvent();
  }

  private initData() {
    this.txt_gameName.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.title.01",
    );
    this.txt_gold.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.title.02",
    );
    this.txt_head.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.title.03",
    );
    this.txt_stamina.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.title.04",
    );
    this.txt_level.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.title.05",
    );
    this.txt_fight.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.title.06",
    );
    this.txt_diamond.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.title.07",
    );
    this.txt_exp.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.title.08",
    );
    this.txt_blood.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.title.09",
    );
    this.txt_solider.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.title.10",
    );
    this.txt_buff.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.title.11",
    );

    this.txt_gold_des.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.des.01",
    );
    this.txt_head_des.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.des.02",
    );

    let cfgValue: number = 20;
    let cfg =
      TempleteManager.Instance.getConfigInfoByConfigName("Weary_Restore");
    if (cfg) {
      cfgValue = Number(cfg.ConfigValue);
    }
    this.txt_stamina_des.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.des.03",
      cfgValue,
    );
    this.txt_level_des.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.des.04",
    );
    this.txt_fight_des.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.des.05",
    );
    this.txt_diamond_des.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.des.06",
    );
    this.txt_exp_des.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.des.07",
    );
    this.txt_blood_des.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.des.08",
    );
    this.txt_solider_des.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.des.09",
    );
    this.txt_buff_des.text = LangManager.Instance.GetTranslation(
      "PlayerDescribeWnd.des.10",
    );
  }

  private addEvent() {
    this.on(Laya.Event.CLICK, this, this.OnBtnClose);
  }

  private offEvent() {
    this.off(Laya.Event.CLICK, this, this.OnBtnClose);
  }

  public OnHideWind(): void {
    this.offEvent();
    super.OnHideWind();
  }
}
