import PetPKSkillItemListView from "../skill/PetPKSkillItemListView";

export class PetPKBattleBar {
  private _skillListView: PetPKSkillItemListView;

  public constructor(skillListView: PetPKSkillItemListView) {
    this._skillListView = skillListView;
    this._skillListView.init();
  }

  public getSkillList(): PetPKSkillItemListView {
    return this._skillListView;
  }

  public dispose() {
    this._skillListView.dispose();
    this._skillListView = null;
  }
}
