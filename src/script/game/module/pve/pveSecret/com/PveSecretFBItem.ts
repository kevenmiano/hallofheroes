import FUI_PveSecretFBItem from "../../../../../../fui/PveSecret/FUI_PveSecretFBItem";
import LangManager from "../../../../../core/lang/LangManager";
import { t_s_secretData } from "../../../../config/t_s_secret";
import { PathManager } from "../../../../manager/PathManager";

/*
 * @Author: jeremy.xu
 * @Date: 2024-02-26 17:41:31
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-20 11:41:12
 * @Description:
 */
export class PveSecretFBItem extends FUI_PveSecretFBItem {
  protected onConstruct(): void {
    super.onConstruct();
    this.txtPass.text = LangManager.Instance.GetTranslation("public.pass");
  }

  private _info: t_s_secretData;
  get info(): t_s_secretData {
    return this._info;
  }

  set info(value: t_s_secretData) {
    this._info = value;
    if (value) {
      this.title = LangManager.Instance.GetTranslation(
        "public.format.concat2word",
        value.TemplateNameLang,
        LangManager.Instance.GetTranslation("public.level3", value.NeedGrade),
      );
      this.icon = PathManager.getSecretSelectBgPath(value.ImgPath);
    } else {
      this.title = "";
      this.icon = "";
    }
  }

  setOpen(b: boolean) {
    this.setPass(false);
    this.gRecord.visible = false;
    this.grayed = !b;
  }

  setRecord(level: number, keep?: boolean) {
    this.gRecord.visible = Boolean(level);
    if (level) {
      this.setPass(false);
      let key = keep ? "Pve.secret.curLevel" : "Pve.secret.levelRecord";
      this.txtRecord.text = LangManager.Instance.GetTranslation(key, level);
    }
  }

  setPass(b: boolean) {
    this.gPass.visible = b;
  }
}
