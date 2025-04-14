//@ts-expect-error: External dependencies
import Resolution from "../../../../core/comps/Resolution";
import { RemotePetEvent } from "../../../../core/event/RemotePetEvent";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { SkillInfo } from "../../../datas/SkillInfo";
import { RemotePetManager } from "../../../manager/RemotePetManager";
import { RemotePetModel } from "../../../mvc/model/remotepet/RemotePetModel";
import { RemotePetSkillLevelUpItem } from "./RemotePetSkillLevelUpItem";

export class RemotePetSkillLevelUp extends BaseWindow {
  public mainItem: RemotePetSkillLevelUpItem;
  // public subItem: RemotePetSkillLevelUpItem;
  public container: fgui.GGroup;

  private skillInfo: SkillInfo;

  public OnInitWind(): void {
    super.OnInitWind();
    // this.setCenter();
    this.addEvent();
    // this.subItem.setSub();
    this.skillInfo = this.frameData;
  }

  public OnShowWind(): void {
    super.OnShowWind();
    this.updateView();
  }

  public updateView() {
    //最高等级
    // let showSub = this.skillInfo.grade >= this.skillInfo.remotePetMaxGrade || this.skillInfo.grade != 0;
    // let showSub = true;
    // this.subItem.visible = showSub;
    this.mainItem.info = this.skillInfo;
    // if (showSub) {
    //     let nexttemp = this.skillInfo.nextTemplateInfo;
    //     if (nexttemp) {
    //         let nextSkillInfo = new SkillInfo();
    //         nextSkillInfo.templateId = nexttemp.TemplateId;
    //         nextSkillInfo.grade = nexttemp.Grades;
    //         // this.subItem.info = nextSkillInfo;
    //     } else {
    //         // this.subItem.visible = false;
    //     }

    // }
    this.container.ensureBoundsCorrect();
    this.contentPane.ensureBoundsCorrect();
    this.setCenter();
  }

  protected setCenter() {
    this.x = (Resolution.gameWidth - this.contentPane.actualWidth) / 2;
    this.y = (Resolution.gameHeight - this.contentPane.actualHeight) / 2;
  }

  private addEvent() {
    this.model.addEventListener(
      RemotePetEvent.SKILLEVELUP,
      this.updateView,
      this,
    );
  }
  private removeEvent() {
    this.model.removeEventListener(
      RemotePetEvent.SKILLEVELUP,
      this.updateView,
      this,
    );
  }

  public get model(): RemotePetModel {
    return RemotePetManager.Instance.model;
  }

  public dispose(dispose?: boolean): void {
    this.removeEvent();
    super.dispose();
  }
}
