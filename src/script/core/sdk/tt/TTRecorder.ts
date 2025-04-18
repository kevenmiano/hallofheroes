import Logger from "../../logger/Logger";
import BaseRecorder from "../base/BaseRecorder";
import { SDKState } from "../SDKConfig";

/**
 * https://microapp.bytedance.com/dev/cn/mini-game/develop/open-capacity/video-camera/request-method
 */
export default class TTRecorder extends BaseRecorder {
  protected isSave: boolean = true;
  constructor() {
    super();
    this.recorder = tt.getGameRecorderManager();
    this.recorder.onStart((res) => {
      Logger.log("录屏开始", res);
      this.changeState(SDKState.open);
      // do somethine;
    });
    this.recorder.onStop((res) => {
      // Logger.log(res.videoPath);
      // do somethine;
      Logger.log("录屏结束", res);
      this.clipVideo(res, [15, 0], (r) => {
        if (r) {
          // if (this.isSave) {
          this.videoPath = r.videoPath;
          // }
        } else {
          this.videoPath = null;
        }

        this.changeState(SDKState.close);
      });
    });

    this.recorder.onResume(() => {
      Logger.log("TTRecorder onResume");
    });
    this.recorder.onPause(() => {
      Logger.log("TTRecorder onPuase");
    });

    this.recorder.onError((res) => {
      Logger.log("TTRecorder onPuase");
      this.videoPath = null;
    });
  }

  clipVideo(res, timeRange, func: Function) {
    this.recorder.clipVideo({
      path: res.videoPath,
      timeRange: timeRange,
      success: (r) => {
        Logger.log(r.videoPath);
        func(r);
      },
      fail: () => {
        func(null);
      },
    });
  }

  recordClip(func) {
    this.recorder.recordClip({
      timeRange: [30, 0],
      success: (r) => {
        Logger.log(r.index); // 裁剪唯一索引

        func(r);
      },
    });
  }

  start() {
    if (this.isOpen()) {
      return;
    }
    // this.changeState(ItemState.GOT)
    this.recorder.start({
      duration: 300,
    });
  }

  stop(isSave: boolean = true) {
    if (this.isClose()) {
      return;
    }
    // this.changeState(ItemState.NOT_GET)
    this.isSave = isSave;
    this.recorder.stop();
  }

  pause() {
    this.recorder.pause();
  }

  resume() {
    this.recorder.resume();
  }
}
