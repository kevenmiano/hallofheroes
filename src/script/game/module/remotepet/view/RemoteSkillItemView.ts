//@ts-expect-error: External dependencies
import FUI_RemoteSkillItemView from "../../../../../fui/RemotePet/FUI_RemoteSkillItemView";
import LangManager from "../../../../core/lang/LangManager";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { EmWindow } from "../../../constant/UIDefine";
import { SkillInfo } from "../../../datas/SkillInfo";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";

export class RemoteSkillItemView extends FUI_RemoteSkillItemView {
  private skillInfo: SkillInfo;

  protected onConstruct(): void {
    super.onConstruct();
    this.onClick(this, this.onItemClick);
  }

  public dataChange(skillInfo: SkillInfo) {
    if (!skillInfo) return;
    if (skillInfo == this.skillInfo) return;
    this.skillInfo = skillInfo;
    this.refreshView();
  }

  private refreshView() {
    // this._levelTxt.text = LangManager.Instance.GetTranslation("public.level2", this.skillInfo.templateInfo.Grades);
    // this._levelTxt.visible = true;
    this._icon.url = IconFactory.getCommonIconPath(
      this.skillInfo.templateInfo.Icons,
    );
    this._locked.visible = false;
    if (this.skillInfo.grade == 0) {
      // this._levelTxt.visible = false;
      this._locked.visible = true;
    }
  }

  private onItemClick() {
    if (!this.skillInfo) return;
    FrameCtrlManager.Instance.open(
      EmWindow.RemotePetSkillLevelUp,
      this.skillInfo,
    );
  }
}
