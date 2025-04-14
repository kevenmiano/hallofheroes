/**
 * 问卷调查数据
 */
export default class QuestionData {
  public Id: number = 0;
  public Type: number = 1;
  public Subject: string = "";
  public Options: string[] = [];
  public MaxChoose: number = 0;
}

/**
 * 答题类型
 * 题目类型【1=单选, 2=不定项, 3=填写】)
 */
export enum QuestionType {
  NONE = 0, //标题
  Single = 1, //单选
  Multi = 2, //多选
  Write = 3, //多行输入
  Input = 4, //单行输入
  Max = 9, //提交按钮
}
