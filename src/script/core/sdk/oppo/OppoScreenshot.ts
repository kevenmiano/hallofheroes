import Logger from "../../logger/Logger";
import BaseScrennshot from "../base/BaseScreenshot";

export default class OppoScreenshot extends BaseScrennshot {
  showImage(_tempFilePath) {
    this.channel.previewImage(_tempFilePath);
  }

  createImage() {
    Logger.log(" createImage ");
  }

  saveFile(data, show: boolean) {
    if (qg.saveImageTempSync) {
      // https://cdofs.oppomobile.com/cdo-activity/static/201810/26/quickgame/documentation/media/image.html?h=saveImageToPhotosAlbum
      let _tempFilePath = qg.saveImageTempSync(data) as string;
      Logger.log("_tempFilePath ", _tempFilePath);
      qg.saveImageToPhotosAlbum({
        filePath: _tempFilePath,
        success: () => {
          Logger.log("save success" + _tempFilePath);
          if (show) {
            this.showImage(_tempFilePath);
          }
        },
        fail: function () {
          return Logger.log("handling fail");
        },
        complete: function () {
          Logger.log("handling complete");
        },
      });
    }
  }
}
