//@ts-expect-error: External dependencies
import FrameDataBase from "../../mvc/FrameDataBase";
import { SkillEditData } from "./SkillEditData";
/**
 * 战斗编辑数据模型处理
 */
export class SkillEditModel extends FrameDataBase {
  public static STATE_NORMAL: number = 0;
  public static STATE_GRAY: number = 1;
  public static STATE_DARK: number = 2;
  public static STATE_LOCK: number = 4;

  private _sortJob1Arr: Array<number> = [0, 0, 0, 0];
  private _sortJob1SpecialArr: Array<number> = [0, 0, 0, 0];
  private _sortJob2Arr: Array<number> = [0, 0, 0, 0];
  private _sortJob2SpecialArr: Array<number> = [0, 0, 0, 0];
  private _sortJob3Arr: Array<number> = [0, 0, 0, 0];
  private _sortJob3SpecialArr: Array<number> = [0, 0, 0, 0];

  public isOpen: boolean = false;
  /** 当前职业选择的符文数量 */
  private _curRuneNum: number = 0;

  private static _instance: SkillEditModel;

  private _skillEditDatas: Array<SkillEditData> = [];

  public static get instance(): SkillEditModel {
    if (!SkillEditModel._instance)
      SkillEditModel._instance = new SkillEditModel();
    return SkillEditModel._instance;
  }

  public get curRuneNum(): number {
    return this._curRuneNum;
  }

  public set curRuneNum(v: number) {
    this._curRuneNum = v;
  }

  reset() {
    this._sortJob1Arr = [0, 0, 0, 0];
    this._sortJob1SpecialArr = [0, 0, 0, 0];
    this._sortJob2Arr = [0, 0, 0, 0];
    this._sortJob2SpecialArr = [0, 0, 0, 0];
    this._sortJob3Arr = [0, 0, 0, 0];
    this._sortJob3SpecialArr = [0, 0, 0, 0];
    this._curRuneNum = 0;
  }

  /**
   *
   * @param data
   */
  updateData(data: SkillEditData) {
    this._skillEditDatas.push(data);
  }

  /**
   *
   * @param job
   * @param index
   * @param skillId
   */
  setNormalPos(job: number, index: number, skillId: number) {
    switch (job) {
      case 1:
        this._sortJob1Arr[index] = skillId;
        break;
      case 2:
        this._sortJob2Arr[index] = skillId;
        break;
      case 3:
        this._sortJob3Arr[index] = skillId;
        break;

      default:
        break;
    }
  }

  /**
   *
   * @param job
   * @param index
   * @param skillId
   */
  setSpeciallPos(job: number, index: number, skillId: number) {
    switch (job) {
      case 1:
        this._sortJob1SpecialArr[index] = skillId;
        break;
      case 2:
        this._sortJob2SpecialArr[index] = skillId;
        break;
      case 3:
        this._sortJob3SpecialArr[index] = skillId;
        break;

      default:
        break;
    }
  }

  getNormalSortIndex(job: number, skillId: number): number {
    let result = -1;
    switch (job) {
      case 1:
        result = this._sortJob1Arr.indexOf(skillId);
        break;
      case 2:
        result = this._sortJob2Arr.indexOf(skillId);
        break;
      case 3:
        result = this._sortJob3Arr.indexOf(skillId);
        break;

      default:
        break;
    }
    return result;
  }

  getSpecialSortIndex(job: number, skillId: number): number {
    let result = -1;
    switch (job) {
      case 1:
        result = this._sortJob1SpecialArr.indexOf(skillId);
        break;
      case 2:
        result = this._sortJob2SpecialArr.indexOf(skillId);
        break;
      case 3:
        result = this._sortJob3SpecialArr.indexOf(skillId);
        break;

      default:
        break;
    }
    return result;
  }

  public get skillEditDatas(): Array<SkillEditData> {
    return this._skillEditDatas;
  }

  /**
   *
   * @param job
   */
  getSkillEditData(job: number): SkillEditData {
    let array = this._skillEditDatas;
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (element.job == job) {
        return element;
      }
    }
    return null;
  }

  /**
   *
   * @param job
   */
  getNormalSkill(job: number): string {
    let result: string = "";
    let array = this._skillEditDatas;
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (element.job == job) {
        result = element.normalSkill;
        break;
      }
    }
    return result;
  }

  /**
   *
   * @param job
   */
  getSpecialSkill(job: number): string {
    let result: string = "";
    let array = this._skillEditDatas;
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      if (element.job == job) {
        result = element.specialSkill;
        break;
      }
    }
    return result;
  }
}
