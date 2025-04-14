import FUI_RemotePetChapterFold from "../../../../../fui/RemotePet/FUI_RemotePetChapterFold";

export class RemotePetChapterFold extends FUI_RemotePetChapterFold {
  protected onConstruct(): void {
    super.onConstruct();
  }

  public set info(v: string) {
    if (!v) return;
    this.title = v;
  }
}
