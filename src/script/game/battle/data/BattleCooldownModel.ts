export class BattleCooldownModel {
  public templateId: number = 0;
  public cooldown: number = 0;
  public appearCoolDown: number = 0;
  public coolType: number = 0;

  public start() {
    Laya.timer.loop(1000, this, this.onTimer);
  }

  private onTimer() {
    if (this.cooldown > 1) {
      this.cooldown--;
    }
    if (this.appearCoolDown > 1) {
      this.appearCoolDown--;
    }
    if (this.cooldown <= 1 && this.appearCoolDown <= 1) {
      this.stop();
    }
  }

  public stop() {
    Laya.timer.clearAll(this);
  }
}
