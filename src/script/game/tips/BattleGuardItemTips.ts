import BaseWindow from "../../core/ui/Base/BaseWindow";
import { BattleGuardSocketInfo } from "../datas/playerinfo/BattleGuardSocketInfo";
import LangManager from "../../core/lang/LangManager";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import BaseTips from "./BaseTips";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/4/13 20:31
 * @ver 1.0
 *
 */
export class BattleGuardItemTips extends BaseTips {
    public img_bg: fgui.GImage;
    public txt_name: fgui.GTextField;
    public icon_0: fgui.GLoader;
    public txt_0: fgui.GTextField;
    public icon_1: fgui.GLoader;
    public txt_1: fgui.GTextField;
    public icon_2: fgui.GLoader;
    public txt_2: fgui.GTextField;

    private _data: BattleGuardSocketInfo;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this._data = this.params[0];
        this.updateTransform();
        this.contentPane.ensureBoundsCorrect();
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    private updateTransform() {
        let name: string[] = LangManager.Instance.GetTranslation("BattleGuardItemNames").split(",");
        let pos: number = 0;
        if (this._data.type == 1) {
            pos = this._data.pos + 7;
            this.txt_name.text = name[0];
        }
        else {
            pos = this._data.pos + 1;
            this.txt_name.text = name[pos];
        }

        if (pos == 6) {
            //国王
            this.txt_name.text = LangManager.Instance.GetTranslation("public.unopen");
        }
        else {
            for (let i = 0; i < 3; i++) {
                let temp: t_s_itemtemplateData = this._data.getTempByPos(i);
                if (temp) {
                    let grade: number = temp.Property2;//parseInt(temp.TemplateName);
                    let content: string = LangManager.Instance.GetTranslation("public.level4_space2", grade);
                    if (grade > 9) {
                        content += " " + temp.DescriptionLang;
                    }
                    else {
                        content += "  " + temp.DescriptionLang;
                    }
                    (this["txt_" + i] as fgui.GTextField).text = content;
                    (this["icon_" + i] as fgui.GLoader).icon = temp.iconPath;
                }
                else {
                    (this["txt_" + i] as fgui.GTextField).text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.InlayItem.value02");
                    (this["icon_" + i] as fgui.GLoader).icon = fgui.UIPackage.getItemURL("Base", "Icon_GemBox");
                }
            }
        }

    }

    protected OnClickModal() {
        super.OnClickModal();
        this.OnBtnClose();
    }

    public OnHideWind() {
        super.OnHideWind();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}