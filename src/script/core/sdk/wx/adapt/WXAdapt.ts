import ComponentSetting from "../../../../game/utils/ComponentSetting";
import Resolution from "../../../comps/Resolution";
import Logger from "../../../logger/Logger";
import UIButton from "../../../ui/UIButton";

export default class WXAdapt {
  private static instance: WXAdapt;
  menuRect: { x: number; y: number; width: number; height: number } = null;

  // 小游戏的刘海高度
  statusBarHeight: number;
  rightSafe: number;

  public static get Instance(): WXAdapt {
    return this.instance ? this.instance : (this.instance = new WXAdapt());
  }

  init() {
    this.initStatusBar();
  }

  getMenuRect() {
    return this.menuRect;
  }

  getStatusBarHeight() {
    return this.statusBarHeight;
  }

  initMenuSize() {
    if (window.wx) {
      wx.getSystemInfo({
        success: (res: any) => {
          let wr = Laya.stage.width / res.windowWidth;
          let hr = Laya.stage.height / res.windowHeight;

          let menuRect = wx.getMenuButtonBoundingClientRect();
          this.rightSafe =
            (res.windowWidth - menuRect.left - 0.25 * menuRect.height) * wr;
          let left = menuRect.left * wr;
          let top = menuRect.top * hr;
          let w = menuRect.width * wr;
          let h = menuRect.height * hr;
          this.menuRect = {
            x: left,
            y: top,
            width: w,
            height: h,
          };
          Logger.log(
            "XXXX",
            Laya.stage.width,
            Laya.stage.height,
            res.windowWidth,
            res.windowHeight,
            res.safeArea,
          );
          // console.log(window.menuRect);
          // throw new Error("Function not implemented.");
          if (res.platform == "windows") {
            ComponentSetting.IOS_VERSION = false;
          }
          // 全面屏，大小不一致，说明有安全区域。
          if (res.safeArea.width != res.windowWidth) {
            //刘海左 home键右
            if (res.safeArea.left > 0) {
              this.statusBarHeight = res.safeArea.left * wr;
              //右边不用胶囊体宽度，跟左边安全区域大小一样，保持画面居中
              Resolution.onMiniGameStatusBar(
                this.statusBarHeight,
                this.statusBarHeight,
                1,
              );
            } else {
              //刘海右 home键左
              this.statusBarHeight =
                (res.windowWidth - res.safeArea.width) * wr;
              Resolution.onMiniGameStatusBar(0, this.rightSafe, 3);
            }
          }

          // this.statusBarHeight = res.safeArea.left * wr;
          // Resolution.onMiniGameStatusBar(this.statusBarHeight, 0, 1);
        },
        fail: function (): void {
          // throw new Error("Function not implemented.");
        },
        complete: function (): void {
          // throw new Error("Function not implemented.");
        },
      });
    }
  }

  initStatusBar() {
    if (window.wx) {
      (wx as any).onDeviceOrientationChange((res: { value: string }) => {
        Logger.log("XXXX", res);
        // let rotate = res.value == 'landscape' ? 1 : 3;
        if (res.value == "landscape") {
          Resolution.onMiniGameStatusBar(
            this.statusBarHeight,
            this.rightSafe,
            1,
          );
        } else {
          Resolution.onMiniGameStatusBar(0, this.rightSafe, 3);
        }

        //     success: (res: any)=> {
        //         console.log('XXXX', res);
        //         let rotate = res.value == 'landscape' ? 1 : 3;
        //         Resolution.onMiniGameStatusBar(this.statusBarHeight, this.statusBarHeight, rotate);
        //     },
        //     fail: function (): void {
        //         // throw new Error("Function not implemented.");
        //     },
        //     complete: function (): void {
        //         // throw new Error("Function not implemented.");
        //     }
        // });
      });
    }
  }

  wxMenuAdapt(uiBtn: UIButton, delay: number = 1) {
    if (!this.menuRect) {
      this.initMenuSize();
    }

    Laya.timer.once(delay, this, () => {
      // console.log(this.displayObject.x + '');
      let point = new Laya.Point(0, 0);
      // console.log(point);
      let outPoint = uiBtn.view.displayObject.localToGlobal(point);
      let a = {
        x: outPoint.x,
        y: outPoint.y,
        width: uiBtn.view.width,
        height: uiBtn.view.height,
      };
      // console.log(a);

      let a_min_x = a.x;
      let a_min_y = a.y;
      let a_max_x = a.x + a.width;
      let a_max_y = a.y + a.height;

      let b = this.menuRect;
      let b_min_x = b.x;
      let b_min_y = b.y;
      let b_max_x = b.x + b.width;
      let b_max_y = b.y + b.height;

      if (
        a_min_x <= b_max_x &&
        a_max_x >= b_min_x &&
        a_min_y <= b_max_y &&
        a_max_y >= b_min_y
      ) {
        // window.WXPUSH();
        // 左移
        let offsetX = a_max_x - b_min_x + 5;
        // console.log('覆盖', uiBtn.view.displayObject.name, offsetX);
        uiBtn.view.x = uiBtn.view.x - offsetX;
      }
    });
  }
}
function getMenuButtonBoundingClientRect(): {
  left: number;
  top: number;
  width: number;
  height: number;
} {
  // Mock implementation for environments without wx
  return {
    left: 10,
    top: 10,
    width: 80,
    height: 32,
  };
}
