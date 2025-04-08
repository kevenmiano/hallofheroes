import Logger from "../../../core/logger/Logger";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";

/**
 * 打脸图数据
 */
export default class FaceSlapInfo {
  public datas: faceSlapImgInfoMsg[] = [];

  constructor() {}

  onUpdate(data?: any[]) {
    if (!data) return;
    this.datas = [];
    for (let i in data) {
      this.datas.push(new faceSlapImgInfoMsg(data[i]));
    }
    this.datas = ArrayUtils.sortOn(this.datas, "order", ArrayConstant.NUMERIC);
    Logger.base(this.datas);
  }
}

/** */
export class faceSlapImgInfoMsg {
  public activeId: string = "";
  public activityName: string = "";
  public activeType: number = 0;
  public minLevel: number = 0;
  public maxLevel: number = 0;
  public beginTime: string = "";
  public endTime: string = "";
  public images: ImgMsg[] = [];
  public order: number = 0;
  constructor(info) {
    for (let i in info) {
      this[i] = info[i];
    }
    this.images = ArrayUtils.sortOn(this.images, "sort", ArrayConstant.NUMERIC);
  }
}

export class ImgMsg {
  public id: number = 0;
  public url: string = "";
  public sort: number = 0;
  public offsetX: number = 0;
  public offsetY: number = 0;
  public jumpUrl: string = "";

  constructor(info) {
    for (let i in info) {
      this[i] = info[i];
    }
  }
}
