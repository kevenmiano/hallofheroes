//@ts-expect-error: External dependencies
export default class OutyardAttackInfo {
  public fromPos: number = 0;
  public toPos: number = 0;
  public totalCount: number = 0;
  public changeCount: number = 0;

  constructor($fromPos: number, $toPos: number) {
    this.fromPos = $fromPos;
    this.toPos = $toPos;
  }

  public get key(): string {
    return this.fromPos + "_" + this.toPos;
  }
}
