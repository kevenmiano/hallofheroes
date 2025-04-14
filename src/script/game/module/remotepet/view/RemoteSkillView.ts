import FUI_RemoteSkillView from "../../../../../fui/RemotePet/FUI_RemoteSkillView";
import { RemotePetEvent } from "../../../../core/event/RemotePetEvent";
import { SkillInfo } from "../../../datas/SkillInfo";
import { RemotePetManager } from "../../../manager/RemotePetManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { RemotePetModel } from "../../../mvc/model/remotepet/RemotePetModel";
import { RemoteSkillItemView } from "./RemoteSkillItemView";

export class RemoteSkillView extends FUI_RemoteSkillView {
  private _remotePetSkills: SkillInfo[];
  protected onConstruct() {
    super.onConstruct();
    this._list.setVirtual();
    this._list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
  }

  public init() {
    this.initData();
    this.addEvent();
  }

  private initData() {
    //技能升级会更新远征信息协议, 已经初始化的情况下, 不需要初始化了;这样会导致和技能升级面板的技能对象不一致。
    if (this._remotePetSkills) return;
    this._remotePetSkills = [];
    let remotePetSkills = TempleteManager.Instance.getRemotePetSkill();
    let skillInfo: SkillInfo = null;
    for (let temp of remotePetSkills) {
      skillInfo = new SkillInfo();
      skillInfo.grade = 0;
      skillInfo.templateId = temp.TemplateId;
      this._remotePetSkills.push(skillInfo);
    }
    this.updateData();
  }

  private updateData() {
    let keyList = this.model.remotePetSkill;
    for (let i = 0; i < keyList.length; i++) {
      let temp = this._remotePetSkills[i];
      temp.templateId = +keyList[i];
      temp.grade = temp.templateInfo.Grades;
    }
    this._list.numItems = this._remotePetSkills.length;
    this.model.updateSkillLevelUp();
  }

  private renderListItem(index: number, obj: RemoteSkillItemView) {
    let skillInfo = this._remotePetSkills[index];
    obj.dataChange(skillInfo);
  }

  private addEvent() {
    this.model.addEventListener(RemotePetEvent.COMMIT, this.updateData, this);
  }
  private removeEvent() {
    this.model.removeEventListener(
      RemotePetEvent.COMMIT,
      this.updateData,
      this,
    );
  }

  public get model(): RemotePetModel {
    return RemotePetManager.Instance.model;
  }

  public dispose() {
    this.removeEvent();
  }
}
