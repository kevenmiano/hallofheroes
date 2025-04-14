//@ts-expect-error: External dependencies
import FUI_LoginMethodItem from "../../../../../fui/Login/FUI_LoginMethodItem";

export default class LoginMethodItem extends FUI_LoginMethodItem {
  private _key: number = 0;

  protected onConstruct(): void {
    super.onConstruct();
  }

  public set index(value: number) {
    this.method.selectedIndex = value;
  }

  public set key(value: number) {
    this._key = value;
  }

  public set titleName(value: string) {
    this.title = value;
  }

  public get index(): number {
    return this.method.selectedIndex;
  }

  public get key(): number {
    return this._key;
  }
}
