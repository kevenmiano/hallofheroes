import { t_s_remotepettemplateData } from "../../../config/t_s_remotepet";

export class RemotePetTurnTemplateInfo extends t_s_remotepettemplateData {
  public get Index() {
    return this.Count;
  }

  public set Index(v: number) {}
}
