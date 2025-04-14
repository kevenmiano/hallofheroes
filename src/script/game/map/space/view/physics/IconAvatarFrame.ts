//@ts-expect-error: External dependencies
import FUI_IconAvatarFrame from "../../../../../../fui/BaseCommon/FUI_IconAvatarFrame";
import ResMgr from "../../../../../core/res/ResMgr";
import { UIFilter } from "../../../../../core/ui/UIFilter";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { MovieClip } from "../../../../component/MovieClip";
import { IconType } from "../../../../constant/IconType";
import { AnimationManager } from "../../../../manager/AnimationManager";

export default class IconAvatarFrame extends FUI_IconAvatarFrame {
  private _movie: MovieClip;
  private _cacheName: string = "";
  private _isGray: boolean = false;

  protected onConstruct(): void {
    super.onConstruct();
    this._movie = new MovieClip(this._cacheName);
  }
  /**头像ID */
  public set headId(value: number) {
    if (value == 0) {
      this.head.url = "";
      return;
    }
    this.head.url = IconFactory.getHeadIcon(value, IconType.HEAD_ICON);
  }

  /**头像边框 */
  public set headFrame(value: string) {
    if (value == "") {
      this.frame.url = "";
      return;
    }
    this.frame.url = IconFactory.getHeadFrame(value);
  }

  public set isGray(value: boolean) {
    this._isGray = value;
  }

  /**头像边框特效 */
  public set headEffect(value: string) {
    if (value == "") {
      if (this._movie) {
        this._movie.stop();
        this._movie.removeSelf();
        AnimationManager.Instance.clearAnimationByName(this._cacheName);
      }
      return;
    }

    this.displayObject.addChild(this._movie);
    // return;
    // }
    let realPath = IconFactory.getHeadFrameEffect(value);

    ResMgr.Instance.loadRes(
      realPath,
      (res) => {
        if (res) {
          let _preUrl = res.meta.prefix;
          let offset = res.offset;
          if (!offset) {
            offset = { x: 0, y: 0 };
          }
          let frames = res.frames;
          let sourceSize = new Laya.Rectangle();
          for (let key in frames) {
            if (Object.prototype.hasOwnProperty.call(frames, key)) {
              let sourceItem = frames[key].sourceSize;
              sourceSize.width = sourceItem.w;
              sourceSize.height = sourceItem.h;
              break;
            }
          }

          let aniName = "";
          this._cacheName = _preUrl;
          AnimationManager.Instance.createAnimation(
            _preUrl,
            aniName,
            undefined,
            "",
            AnimationManager.MapPhysicsFormatLen,
          );

          this._movie.pivot(sourceSize.width >> 1, sourceSize.height >> 1);
          this._movie.step = 96;
          this._movie.gotoAndPlay(0, true, this._cacheName);

          this.setMovieGray(this._isGray);
          this._movie.pos(this.width >> 1, this.height >> 1);
        }
      },
      null,
      Laya.Loader.ATLAS,
    );
  }

  public setMovieGray(flag: boolean) {
    if (this._movie) {
      if (flag) {
        this._movie.filters = [UIFilter.grayFilter];
      } else {
        this._movie.filters = [UIFilter.normalFilter];
      }
    }
  }
}
