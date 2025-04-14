import ConfigMgr from "../../core/config/ConfigMgr";
import ResMgr from "../../core/res/ResMgr";
import t_s_mapnode from "../config/t_s_mapnode";
import { ConfigType } from "../constant/ConfigDefine";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import SpaceArmy from "../map/space/data/SpaceArmy";
import { SpaceNode } from "../map/space/data/SpaceNode";
import SpaceManager from "../map/space/SpaceManager";
import { ArmyManager } from "./ArmyManager";
import { PathManager } from "./PathManager";
export class SpaceTemplateManager {
  private static _instance: SpaceTemplateManager;
  public static get Instance(): SpaceTemplateManager {
    if (!SpaceTemplateManager._instance)
      SpaceTemplateManager._instance = new SpaceTemplateManager();
    return SpaceTemplateManager._instance;
  }
  private _setupFlag: boolean = false;
  private _index: number = 0;
  private _robotInited: boolean = false;
  private _robots: Array<SpaceArmy>;
  private _nodeDic: Map<number, Array<SpaceNode>>;
  private _robotDic: Map<number, ThaneInfo>;
  private _robotArmysDic: Map<number, SpaceArmy>;
  private _robotPositions: Array<Laya.Point>;

  constructor() {
    this._robots = [];
    this._nodeDic = new Map();
    this._robotDic = new Map();
    this._robotArmysDic = new Map();
    this._robotPositions = [];
    this.initRobotPositions();
  }

  private initRobotPositions() {
    this._robotPositions.push(new Laya.Point(140, 118));
    this._robotPositions.push(new Laya.Point(141, 119));
    this._robotPositions.push(new Laya.Point(142, 120));
    this._robotPositions.push(new Laya.Point(143, 119));
    this._robotPositions.push(new Laya.Point(144, 118));
    this._robotPositions.push(new Laya.Point(145, 117));
    this._robotPositions.push(new Laya.Point(146, 116));
    this._robotPositions.push(new Laya.Point(147, 115));
    this._robotPositions.push(new Laya.Point(150, 112));
    this._robotPositions.push(new Laya.Point(106, 90));
    this._robotPositions.push(new Laya.Point(107, 91));
    this._robotPositions.push(new Laya.Point(108, 92));
    this._robotPositions.push(new Laya.Point(109, 91));
    this._robotPositions.push(new Laya.Point(110, 90));
    this._robotPositions.push(new Laya.Point(87, 102));
    this._robotPositions.push(new Laya.Point(88, 101));
    this._robotPositions.push(new Laya.Point(89, 98));
    this._robotPositions.push(new Laya.Point(89, 100));
    this._robotPositions.push(new Laya.Point(90, 99));
  }

  public setup() {
    if (this._setupFlag) {
      return;
    }
    this._setupFlag = true;
    //优化标记 ？？ 这个文件没加载吗？？为什么要异步加载？？
    ConfigMgr.Instance.getAsync(ConfigType.t_s_mapnode, (data: t_s_mapnode) => {
      var nodeList: any[];
      data.mDataList.forEach((element) => {
        nodeList = this._nodeDic.get(element.MapId);
        if (!nodeList) {
          nodeList = [];
          this._nodeDic.set(element.MapId, nodeList);
        }
        nodeList.push(SpaceManager.Instance.readSpaceNodeInfo(element));
      });

      // 机器人数据
      // var configPath: string = PathManager.orderPath + "skycastlerobot_unzip.xml";
      // ResMgr.Instance.loadRes(configPath, (res) => {
      // 	if (res) {
      // 		// xml = new XML(res);
      // 		// xList = xml..Robot;
      // 		// for each (var nXML:XML in xList)
      // 		// {
      // 		//     this.createRobot(nXML);
      // 		// }
      // 		this._robotInited = true;
      // 	}
      // });
    });
  }

  public getRobotInfo(userId: number): ThaneInfo {
    if (this._robotDic[userId]) {
      return this._robotDic[userId];
    }
    return null;
  }

  public getRobotArmyInfoByUserId(userId: number): SpaceArmy {
    if (this._robotArmysDic[userId]) {
      return this._robotArmysDic[userId];
    }
    return null;
  }

  // private createRobot(robot:XML)
  // {
  // 	var aInfo:SpaceArmy = new SpaceArmy();
  // 	var hInfo:ThaneInfo = aInfo.baseHero;
  // 	hInfo.beginChanges();

  // 	hInfo.id = number(robot.@HeroId);
  // 	hInfo.userId = number(robot.@UserId);
  // 	hInfo.IsVipAndNoExpirt = number(robot.@IsVipAndNoExpirt) == 1 ? true : false;
  // 	hInfo.grades = number(robot.@Grades);
  // 	hInfo.nickName = decodeURIComponent(string(robot.@NikcName));
  // 	hInfo.templateId = number(robot.@TemplateId);
  // 	hInfo.headId = number(robot.@HeadId);

  // 	hInfo.armsEquipAvata = string(robot.@ArmsEquipAvata);
  // 	hInfo.bodyEquipAvata = string(robot.@BodyEquipAvata);
  // 	hInfo.wingAvata = string(robot.@WingAvata);
  // 	hInfo.hairFashionAvata = string(robot.@HairFashionAvata);
  // 	hInfo.armsFashionAvata = string(robot.@ArmsFashionAvata);
  // 	hInfo.bodyFashionAvata = string(robot.@BodyFashionAvata);
  // 	hInfo.hideFashion = string(robot.@IsHideFashion) == "true" ? true : false;

  // 	hInfo.appellId = number(robot.@AppellId);
  // 	hInfo.fateSkill = string(robot.@FateSkill);
  // 	aInfo.petInfo.petTemplateId = number(robot.@PetTemplateId);
  // 	hInfo.consortiaID = number(robot.@ConsortiaID);
  // 	hInfo.consortiaName = string(robot.@ConsortiaName);
  // 	hInfo.state = StateType.ONLINE;

  // 	aInfo.id = number(robot.@HeroId);
  // 	aInfo.userId = number(robot.@UserId);
  // 	aInfo.nickName = decodeURIComponent(string(robot.@NikcName));
  // 	aInfo.mountTemplateId = number(robot.@MountTemplateId);

  // 	var index:number = number(Math.random() * this._robotPositions.length);
  // 	if(index == this._robotPositions.length)
  // 	{
  // 		index = 0;
  // 	}
  // 	aInfo.curPosX = this._robotPositions[index].x;
  // 	aInfo.curPosY = this._robotPositions[index].y;

  // 	aInfo.isRobot = true;
  // 	aInfo.isAdded = false;
  // 	hInfo.commit();

  // 	this._robotDic[hInfo.userId] = hInfo;
  // 	this._robotArmysDic[hInfo.userId] = aInfo;
  // 	this._robots.push(aInfo);
  // 	this._index++;
  // }

  public get robotInited(): boolean {
    return this._robotInited;
  }

  public get robots(): any[] {
    return this._robots;
  }

  public get nodeDic(): Map<number, Array<SpaceNode>> {
    return this._nodeDic;
  }

  private get self(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }
}
