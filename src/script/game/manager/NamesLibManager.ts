import { isCNLanguage } from "../../core/lang/LanguageDefine";
import ResMgr from "../../core/res/ResMgr";
import Utils from "../../core/utils/Utils";

export class NamesLibManager {
  private static numbers: number[] = [0, 1, 2, 3, 5, 6, 7, 8, 9];
  private static words: string[] = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  private static familyName: string[] = [];
  private static givenNameG: string[] = [];
  private static givenNameB: string[] = [];
  private static givenNameENG: string[] = [];
  private static givenNameENB: string[] = [];

  private static _hasSetup: boolean = false;

  private static _Instance: NamesLibManager;

  public static get Instance(): NamesLibManager {
    if (!this._Instance) this._Instance = new NamesLibManager();
    return this._Instance;
  }

  public static get hasSetup(): boolean {
    return this._hasSetup;
  }

  public async setup(dataPath: string) {
    if (dataPath) {
      await ResMgr.Instance.loadRes(
        dataPath,
        (ret) => {
          if (ret) {
            if (!ret) return;
            var arr: any[] = (<string>ret).toLocaleLowerCase().split("\n"); //"\n" 回车换行
            if (arr.length >= 1) {
              NamesLibManager.familyName = arr[0].split("|");
            }
            if (arr.length >= 2) {
              NamesLibManager.givenNameB = arr[1].split("|");
            }
            if (arr.length >= 3) {
              NamesLibManager.givenNameG = arr[2].split("|");
            }
            if (arr.length >= 4) {
              //EN B
              NamesLibManager.givenNameENB = arr[3].split("|");
            }
            if (arr.length >= 5) {
              //EN G
              NamesLibManager.givenNameENG = arr[3].split("|");
            }
            NamesLibManager._hasSetup = true;
          }
        },
        null,
        Laya.Loader.TEXT,
      );
    }
  }

  public static newName(sexs: number): string {
    var name: string = "";
    if (isCNLanguage()) {
      var familyIndex: number = Utils.randomInt(0, this.familyName.length - 1);
      var givenIndexG: number = Utils.randomInt(0, this.givenNameG.length - 1);
      var givenIndexB: number = Utils.randomInt(0, this.givenNameB.length - 1);
      var givenIndexNumber: number = Utils.randomInt(
        0,
        this.numbers.length - 1,
      );
      name += this.familyName[familyIndex] ? this.familyName[familyIndex] : "";
      let extra: string = this.numbers[givenIndexNumber] + "";
      if (sexs == 0) {
        name += this.givenNameG[givenIndexG]
          ? this.givenNameG[givenIndexG] + extra
          : "";
      } else {
        name += this.givenNameB[givenIndexB]
          ? this.givenNameB[givenIndexB] + extra
          : "";
      }
    } else {
      //规则: 名字中间插入0-9数字, 结尾加a-z字母~
      var givenIndexG: number = Utils.randomInt(
        0,
        this.givenNameENG.length - 1,
      );
      var givenIndexB: number = Utils.randomInt(
        0,
        this.givenNameENB.length - 1,
      );
      var givenIndexNumber: number = Utils.randomInt(
        0,
        this.numbers.length - 1,
      );
      var givenIndexWord: number = Utils.randomInt(0, this.words.length - 1);
      let extra: string =
        this.numbers[givenIndexNumber] + this.words[givenIndexWord];
      if (sexs == 0) {
        name += this.givenNameENG[givenIndexG]
          ? this.givenNameENG[givenIndexG] + extra
          : "";
      } else {
        name += this.givenNameENB[givenIndexB]
          ? this.givenNameENB[givenIndexB] + extra
          : "";
      }
    }
    return name;
  }
}
