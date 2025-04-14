import StringHelper from "../../../../core/utils/StringHelper";
import NewbieActionType from "./NewbieActionType";
import NewbieConditionType from "./NewbieConditionType";
import NewbieSubNodeInfo from "./NewbieSubNodeInfo";

/*
 * @Author: jeremy.xu
 * @Date: 2023-08-10 12:29:32
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-09-05 18:07:50
 * @Description:
 */

export class NewbieMainNodeInfo {
  // 执行优先级
  sort: number;
  // 是否由玩家操作触发
  manualTrigger: boolean = false;

  mainNodeId: number = 0;
  curSubNodeId: number = 0;
  curSubNodeIdx: number = 0;
  subNodeCfgArr: object[];
  subNodeInfoArr: NewbieSubNodeInfo[] = [];
  public get curSubNodeInfo() {
    return this.subNodeInfoArr[this.curSubNodeIdx];
  }
  public get isComplete() {
    return this.curSubNodeIdx >= this.subNodeInfoArr.length;
  }

  constructor(
    $mainNodeId: number,
    $sort: number,
    $manualTrigger: boolean,
    $nodeCfgArr: object[],
  ) {
    this.mainNodeId = $mainNodeId;
    this.sort = $sort;
    this.manualTrigger = $manualTrigger;
    this.subNodeCfgArr = $nodeCfgArr;
  }

  public parse() {
    for (let index = 0; index < this.subNodeCfgArr.length; index++) {
      const cfg = this.subNodeCfgArr[index];
      let a = this.parseSubNodeInfo(cfg);
      this.subNodeInfoArr.push(a);
    }
  }

  public startSubNode() {}

  public completeSubNode() {
    this.curSubNodeIdx++;
  }

  public parseSubNodeInfo(cfg: object) {
    let nodeInfo = new NewbieSubNodeInfo();

    let tempArr: Array<string>;
    let tempCls: any;
    let tempFunc: Function;
    let tempStr: string;

    nodeInfo.nodeId = cfg["nodeId"];
    nodeInfo.actionType = cfg["actionType"];
    let actTypeStr = NewbieActionType[nodeInfo.actionType];
    tempArr = actTypeStr.split("|");

    tempCls = Laya.ClassUtils.getClass(tempArr[0]); //功能执行调用的类
    tempFunc = tempCls[tempArr[1]] as Function; //功能执行调用的静态方法
    nodeInfo.actionFunc = tempFunc; //每个节点执行的方法
    tempStr = cfg["actionParams"];
    if (!StringHelper.isNullOrEmpty(tempStr)) {
      nodeInfo.actionParams = tempStr.split(",");
    } else {
      nodeInfo.actionParams = [];
    }

    nodeInfo.conditions = this.resolveConditions(cfg["conditions"]);
    nodeInfo.conditionParams = this.resolveConditionParams(
      cfg["conditionParams"],
    );
    nodeInfo.conditionInverted = cfg["conditionInverted"]
      ? cfg["conditionInverted"].split(",")
      : [];
    nodeInfo.conditionSymbol = Number(cfg["conditionSymbol"]);
    nodeInfo.skipConditions = this.resolveConditions(cfg["skipConditions"]);
    nodeInfo.skipConditionParams = this.resolveConditionParams(
      cfg["skipConditionParams"],
    );
    nodeInfo.skipConditionInverted = cfg["skipConditionInverted"]
      ? cfg["skipConditionInverted"].split(",")
      : [];
    nodeInfo.skipConditionSymbol = Number(cfg["skipConditionSymbol"]);
    nodeInfo.backConditions = this.resolveConditions(cfg["backConditions"]);
    nodeInfo.backConditionParams = this.resolveConditionParams(
      cfg["backConditionParams"],
    );
    nodeInfo.backConditionInverted = cfg["backConditionInverted"]
      ? cfg["backConditionInverted"].split(",")
      : [];
    nodeInfo.backConditionSymbol = Number(cfg["backConditionSymbol"]);

    nodeInfo.backId = Number(cfg["backId"]);
    nodeInfo.delayTime = Number(cfg["delayTime"]);
    nodeInfo.needWaitForComplete = cfg["needWaitForComplete"] == "1";
    nodeInfo.saveId = Number(cfg["saveId"]);
    nodeInfo.recordFinish = Number(cfg["recordFinish"]);
    // nodeInfo.nextId = Number(cfg["nextId"]);
    nodeInfo.desc = cfg["desc"];

    return nodeInfo;
  }

  private resolveConditions(value: string): Array<any> {
    let conditions: Array<Function> = [];
    if (!StringHelper.isNullOrEmpty(value)) {
      let tempArr: Array<string>;
      let tempOtherArr: Array<string>;
      let tempCls;
      let tempFunc: Function;
      let tempLen: number;
      tempArr = value.split(",");
      tempLen = tempArr.length;
      for (let i: number = 0; i < tempLen; i++) {
        let actTypeStr = NewbieConditionType[tempArr[i]];
        tempOtherArr = actTypeStr.split("|");
        tempCls = Laya.ClassUtils.getClass(tempOtherArr[0]);
        tempFunc = tempCls[tempOtherArr[1]] as Function;
        conditions[i] = tempFunc;
      }
    }
    return conditions;
  }

  private resolveConditionParams(value: string): Array<string> {
    let conditionParams = [];
    if (!StringHelper.isNullOrEmpty(value)) {
      let tempArr: Array<string>;
      let tempLen: number;
      tempArr = value.split("|");
      tempLen = tempArr.length;
      for (let i: number = 0; i < tempLen; i++) {
        conditionParams[i] = tempArr[i].split(",");
      }
    }
    return conditionParams;
  }

  public clear() {
    this.curSubNodeId = 0;
    this.curSubNodeIdx = 0;
  }
}
