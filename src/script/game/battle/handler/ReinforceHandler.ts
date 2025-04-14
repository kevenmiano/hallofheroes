import { MovePointAction } from "../actions/MovePointAction";
import { FaceType, RoleType } from "../../constant/BattleDefine";
import { BattleUtils } from "../utils/BattleUtils";
import { BattleManager } from "../BattleManager";
import { SkillResourceLoader } from "../skillsys/loader/SkillResourceLoader";
import {
  BattleEvent,
  BattleNotic,
} from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import { PackageIn } from "../../../core/net/PackageIn";
import { BattleModel } from "../BattleModel";
import { HeroRoleInfo } from "../data/objects/HeroRoleInfo";
import { PetRoleInfo } from "../data/objects/PetRoleInfo";
import { SkillData } from "../data/SkillData";
import { SocketGameReader } from "../../manager/SocketGameReader";

interface IPackageHandler {
  handle(packageIn: PackageIn): void;
}

//@ts-expect-error: External dependencies
import HeroMsg = com.road.yishi.proto.battle.HeroMsg;

//@ts-expect-error: External dependencies
import ReinforceMsg = com.road.yishi.proto.battle.ReinforceMsg;

//@ts-expect-error: External dependencies
import SoldierMsg = com.road.yishi.proto.battle.SoldierMsg;
import Point = Laya.Point;
import Logger from "../../../core/logger/Logger";

/**
 * 普通的增援的处理类
 * @author yuanzhan.yu
 */
export class ReinforceHandler implements IPackageHandler {
  private _pkg: PackageIn;

  constructor() {}

  public handle(packageIn: PackageIn) {
    var battleModel: BattleModel = BattleManager.Instance.battleModel;
    if (!battleModel) return;

    this._pkg = packageIn;
    var msg: ReinforceMsg = this._pkg.readBody(ReinforceMsg) as ReinforceMsg;

    var role: any; //BaseRoleInfo
    var roles: any[] = [];

    var side: number = msg.side; //_pkg.readShort();
    var size: number = msg.soldiers.length; //_pkg.readInt();

    var soldier: SoldierMsg;
    var i: number;
    var isPlayer: boolean;
    var heroRole: HeroRoleInfo;
    var petRole: PetRoleInfo;
    battleModel.trialLayer = msg.reinforceWave;
    var morphSkills: any[] = [
      SkillData.PET_MORPH_SKILL,
      SkillData.PET_UNMORPH_SKILL,
    ];
    var skillIds: any[] = [];
    var skillId: number;
    for (i = 0; i < size; i++) {
      soldier = msg.soldiers[i] as SoldierMsg;
      role = SocketGameReader.readPawnRoleInfo(soldier);
      ReinforceHandler.addRole(role);
    }
    var heroLen: number = msg.hero.length;
    var heroMsg: HeroMsg;
    var petMsg: HeroMsg;
    var bossArr: any[] = [];
    let herosReinforce: HeroRoleInfo[] = [];
    for (i = 0; i < heroLen; i++) {
      heroMsg = msg.hero[i] as HeroMsg;
      petMsg = this.findPetMsgForHero(msg.pets, heroMsg.livingId);

      heroRole = SocketGameReader.readHeroRoleInfo(heroMsg, petMsg);
      ReinforceHandler.addRole(heroRole);
      herosReinforce.push(heroRole);
      if (heroRole.petRoleInfo) {
        ReinforceHandler.addRole(heroRole.petRoleInfo);
        for (var k: number = 0; k < morphSkills.length; k++) {
          skillId = morphSkills[k];
          if (skillIds.indexOf(skillId) == -1) {
            skillIds.push(skillId);
          }
        }
      }
      if (heroRole.type == RoleType.T_NPC_BOSS) {
        Logger.battle(
          "boss增援:" + heroRole.heroInfo.templateInfo.TemplateNameLang,
        );
        bossArr.push(heroRole);
      } else {
        isPlayer = true;
      }
    }

    if (bossArr.length > 0 && BattleManager.Instance.battleUIView) {
      if (
        BattleManager.Instance.battleUIView &&
        BattleManager.Instance.battleUIView.getRoleShowViewII()
      )
        BattleManager.Instance.battleUIView
          .getRoleShowViewII()
          .bossReinforce(bossArr);
    }

    BattleManager.Instance.battleModel.isOver = false;

    if (BattleManager.Instance.battleUIView && !isPlayer) {
      //让技能重新可用.
      NotificationManager.Instance.sendNotification(
        BattleNotic.SKILL_ENABLE,
        true,
      );
    }
    NotificationManager.Instance.dispatchEvent(
      BattleEvent.REINFORCE,
      herosReinforce,
    );
    if (skillIds.length > 0) {
      SkillResourceLoader.add(skillIds);
    }
  }

  private findPetMsgForHero(petMsgList: any[], heroLivingId: number): HeroMsg {
    for (let index = 0; index < petMsgList.length; index++) {
      const petMsg = petMsgList[index];
      if (petMsg.livingId2 == heroLivingId) {
        return petMsg;
      }
    }
    return null;
  }

  public static addRole(role) {
    role.face =
      role.side == BattleManager.Instance.battleModel.selfSide
        ? FaceType.LEFT_TEAM
        : FaceType.RIGHT_TEAM;
    role.load();
    BattleManager.Instance.battleModel.addRole(role);
    Logger.battle("增援", role.objName, role);
    var temp: Point = BattleUtils.rolePointByPos(role.pos, role.face);
    if (role.face == FaceType.RIGHT_TEAM) {
      role.point = new Point(temp.x + 700, temp.y);
      new MovePointAction(
        role.livingId,
        temp,
        25,
        0,
        false,
        false,
        true,
        false,
      );
    } else {
      role.point = new Point(temp.x - 700, temp.y);
      new MovePointAction(
        role.livingId,
        temp,
        25,
        0,
        false,
        false,
        true,
        false,
      );
    }
  }
}
