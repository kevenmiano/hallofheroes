import BaseChannel from "./BaseChannel";

export default class BaseScrennshot {
  protected channel: BaseChannel;

  constructor(channel: BaseChannel) {
    this.channel = channel;
  }
  capture(show: boolean = true) {
    // create the capture
    // setTimeout(() => {
    // Logger.log(' CaptureOppo capture ')
    // Logger.log(' CaptureOppo createCanvas ', canvas)
    // let img = this.createImg();
    // Logger.log(' CaptureOppo capture img ',img)
    this.saveFile(this.createImage(), show);
    // }, 1000);
  }

  getCanvas() {
    return null;
  }

  showImage(img: any) {}

  createImage() {}

  saveFile(data, show: boolean) {}
}
