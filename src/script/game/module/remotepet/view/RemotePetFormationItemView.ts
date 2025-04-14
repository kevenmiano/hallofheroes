//@ts-expect-error: External dependencies
import FUI_RemotePetFormationItemView from "../../../../../fui/RemotePet/FUI_RemotePetFormationItemView";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { ShowPetAvatar } from "../../../avatar/view/ShowPetAvatar";
import { PetData } from "../../pet/data/PetData";

export class RemotePetFormationItemView extends FUI_RemotePetFormationItemView {
  public pos = 0;
  private _data: PetData = null;
  private _avatar: ShowPetAvatar;
  protected onConstruct(): void {
    super.onConstruct();
    this._avatar = new ShowPetAvatar();
    this._avatar.pos(20, 200);
    this.container.displayObject.addChild(this._avatar);
  }

  public get petData() {
    return this._data;
  }

  public set petData(v: PetData) {
    this._data = v;
    if (v) {
      this.refreshView();
    } else {
      this.resetView();
    }
  }

  private refreshView() {
    // this.bar.visible = true;
    this.txtName.text = this._data.name.toString();
    this.txtName.color = PetData.getQualityColor(this._data.quality - 1);
    this._avatar.data = this._data.template;
    // let hp = this._data.remoteHp;
    // this.bar.value = hp;
    // if (hp == 0) {
    //     this._avatar.filters = [UIFilter.grayFilter]
    // } else {
    //     this._avatar.filters && (this._avatar.filters = null);
    // }
  }

  private resetView() {
    // this.normal();
    this._avatar.data = null;
    this.txtName.text = "";
    // this.bar.visible = false;
  }

  public set selected(v: boolean) {
    this.normal_platform.visible = !v;
    this.sel_platform.visible = v;
    v ? this.blink() : this.stopBlink();
  }

  public get selected() {
    return this.sel_platform.visible;
  }
  //点击avatar是否可以选择
  public enabledSelectAvatar(b: boolean) {
    this.container.touchable = b;
  }

  private blink() {
    this.sel_platform.alpha = 1;
    TweenMax.to(this.sel_platform, 0.5, {
      alpha: 0.2,
      repeat: -1,
      yoyo: true,
      ease: Sine.easeInOut,
    });
  }

  private stopBlink() {
    TweenMax.killTweensOf(this.sel_platform);
  }

  public dispose(): void {
    this.stopBlink();
    if (this._avatar) {
      this._avatar.dispose();
      this._avatar = null;
    }
  }
}
