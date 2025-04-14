import { MemToolItemInfo } from "@/script/game/module/memTool/MemToolItemInfo";
import FUI_MemToolItem from "../../../../fui/MemTool/FUI_MemToolItem";
// import MemToolItemInfo from "./MemToolItemInfo";
import MemToolModel from "./MemToolModel";

export default class MemToolItem extends FUI_MemToolItem {
  private _vdata: MemToolItemInfo;
  private _type: number;
  tex: any;
  public set vdata(value: MemToolItemInfo) {
    // Logger.log('MemItem', value);
    if (!value || this._vdata == value) return;
    this._vdata = value;
    this.txt2.text = value.url;
    if (value.url && value.gpuMemory > 0) {
      let tex = Laya.Loader.getRes(value.url);
      // this.img.icon = value.url;

      if (tex) {
        (this.img as any)._onExternalLoadSuccess(tex); // Use a type assertion to bypass access restrictions
      } else {
        // 合图
        let url = value.url.replace(".jpg", ".json").replace(".png", ".json");
        let atlas = Laya.Loader.getAtlas(url);
        if (atlas) {
          // Logger.log(atlas[0]);
          tex = Laya.Loader.getRes(atlas[0]).bitmap;
          if (tex) {
            tex = new Laya.Texture(tex);

            (this.img as any)._onExternalLoadSuccess(tex); // Use a type assertion to bypass access restrictions
          }
        }
      }
      this.tex = tex;

      // tex && this.img.content.onExternalLoadSuccess(tex);
    }
    if (value.width) {
      this.txt3.text = `${value.width}x${value.height} \n${(value.gpuMemory / 1024 / 1024).toFixed(2)}m`;
    }
    this.txt4.text = value.constructor.name;
    this.txt5.text = value.referenceCount + "";
    this.onClick(this, this.onPreview);
    this.btnRelease.onClick(this, this.onRelease);
  }

  onRelease(e: Laya.Event) {
    // Logger.log(this._vdata);
    e.stopPropagation();
    if (this._vdata) {
      let res = Laya.Resource.getResourceByID(this._vdata.id);
      if (res) {
        res.destroy();
        MemToolModel.instance.dispatchEvent("ResfreshMemTool");
      }
    }
  }

  onPreview() {
    MemToolModel.instance.dispatchEvent("MemPreview", this.tex);
  }

  public set type(type: number) {
    this._type = type;
  }
}
