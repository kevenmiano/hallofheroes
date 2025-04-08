// @ts-nocheck
/**
* @author:jeremy.xu
* @data: 2020-11-23 10:00
* @description   血量辅助类.
* 该类将收到的技能中的血量的数据进行处理.以确定实际更新的血量.
**/

import Dictionary from "../../../../core/utils/Dictionary";
import { BloodType } from "../../../constant/BattleDefine";
import { BattleManager } from "../../BattleManager";
import { BattleModel } from "../../BattleModel";
import { AttackData } from "../../data/AttackData";
import { BufferDamageData } from "../../data/BufferDamageData";
import { DamageData } from "../../data/DamageData";
import { HeroRoleInfo } from "../../data/objects/HeroRoleInfo";
import { SkillData } from "../../data/SkillData";
import { TempRoleBloodInfo } from "./TempRoleBloodInfo";
import Logger from "../../../../core/logger/Logger";
import ReliveInfo from "../../data/ReliveInfo";

export class BloodHelper {
    private static bloodDic: Dictionary = new Dictionary();


    /**
        * 世界BOSS缓存的血量.
        * 该值用于存储自己对BOSS造成的(但还没有实际作用在血条上的)伤害 
        * 当更新血条上,将会从此值中减去相应的血量.
        */
    public static worldBossBloodCached: number = 0;
    public static worldBossBloodUpdated: number

    public static attackDataList: any[] = [];

    public static setup() {
        BloodHelper.bloodDic = new Dictionary();
        BloodHelper.worldBossBloodCached = 0;
        BloodHelper.worldBossBloodUpdated = 0;
        BloodHelper._worldBossSyncTime = 0;
        BloodHelper.attackDataList = [];
    }

    /**
        * 处理血量数据.
        * 通过该方法.可以调整实际更新的血量的数据. 
        * @param skillData
        * 
        */
    public static processBlood(skillData: SkillData) {
        BloodHelper.processBufferData(skillData, BloodHelper.bloodDic);
        BloodHelper.processSkillData(skillData, BloodHelper.bloodDic);
        // printAllBlood();
    }

    private static printAllBlood() {
        Logger.battle("====================================               blood                ======================================")
        for (const id in BloodHelper.bloodDic) {
			//BaseRoleInfo
            let r: any = BattleManager.Instance.battleModel.getRoleById(Number(id));
            if (!r) continue;
            let bloodInfo: TempRoleBloodInfo = BloodHelper.getTempRoleBlood(r);
            Logger.battle(r.roleName, "RolebloodA=" + r.bloodA + ",RoletotalBloodA=" + r.totalBloodA + ", RealbloodA=" + bloodInfo.bloodA + ", RealtotalBloodA=" + bloodInfo.maxBloodA);
        }
        Logger.battle("====================================             blood end              ======================================")
    }

    private static processBufferData(skillData: SkillData, bloodDic: Dictionary) {
        if (!skillData || !skillData.buffers) return

        let buffer: BufferDamageData
        let damageData: DamageData;
        let roleInfo: any;
        let hurt: number = 0;
        let bloodInfo: TempRoleBloodInfo;

        for (let i: number = 0; i < skillData.buffers.length; i++) {
            buffer = skillData.buffers[i];
            for (let j: number = 0; j < buffer.damages.length; j++) {//遍历每一次掉血
                damageData = buffer.damages[j]
                roleInfo = BattleManager.Instance.battleModel.getRoleById(damageData.target);

                if (roleInfo) {
                    bloodInfo = BloodHelper.getTempRoleBlood(roleInfo);
                    hurt = BloodHelper.updateBlood(bloodInfo, damageData, skillData.attackMillis);
                    skillData.recordHurtData(damageData.target, hurt);
                    if (BloodHelper.bloodDic[damageData.target].bloodA <= 0) {
                        skillData.willKillSomeBody = true;
                    }
                    BloodHelper.obtainWorldBossBlood(damageData.target, damageData.damageValue);
                }
            }
        }
    }
    private static getTempRoleBlood(roleInfo: any): TempRoleBloodInfo {
        if (!BloodHelper.bloodDic[roleInfo.livingId]) {
            BloodHelper.bloodDic[roleInfo.livingId] = BloodHelper.createTempRoleBlood(roleInfo);
        }
        return BloodHelper.bloodDic[roleInfo.livingId] as TempRoleBloodInfo;
    }
    private static processSkillData(skillData: SkillData, bloodDic: Dictionary) {
        let attackData: AttackData;
        let turnData: any[];
        let hurt: number

        if (skillData.data) {
            for (let turn: number = 0; turn < skillData.data.length; turn++) {//每一回合
                turnData = skillData.data[turn]
                for (let i: number = 0; i < turnData.length; i++) {//每个对象
                    attackData = turnData[i]
                    if (attackData && attackData.roleInfo) {

                        if (!BloodHelper.bloodDic[attackData.roleId]) {
                            BloodHelper.bloodDic[attackData.roleId] = BloodHelper.createTempRoleBlood(attackData.roleInfo);
                        }
                        hurt = BloodHelper.updateBlood(BloodHelper.bloodDic[attackData.roleId], attackData, skillData.attackMillis);
                        skillData.recordHurtData(attackData.roleId, hurt);
                        if (BloodHelper.bloodDic[attackData.roleId].bloodA <= 0) {
                            skillData.willKillSomeBody = true;
                        }
                        BloodHelper.obtainWorldBossBlood(attackData.roleId, attackData.damageValue);
                    }
                }
            }
        }
        for (let i:number = 0;i<skillData.reliveList.length;i++) {
            var reliveInfo:ReliveInfo = skillData.reliveList[i] 
            if (reliveInfo.battleId != BattleManager.Instance.battleModel.battleId) continue;
            var roleInfo:any = BattleManager.Instance.battleModel.getRoleById(reliveInfo.livingId);
            if (!roleInfo) continue;
            var tempInfo:TempRoleBloodInfo = BloodHelper.getTempRoleBlood(roleInfo);
            tempInfo.bloodA = reliveInfo.hp;
            roleInfo.reliveInfo = reliveInfo;
        }
    }

    private static updateBlood(tempBloodInfo: TempRoleBloodInfo, data: Object, time: number): number {
        let hasSync: boolean;
        let hurt: number = 0;
        if (data instanceof AttackData) {
            let attackData: AttackData = <AttackData>data;
            hasSync = BloodHelper.checkIsSyncForWorldBoss(attackData.roleId, time);
            if (attackData.bloodType == BloodType.BLOOD_TYPE_SELF ||
                attackData.bloodType == BloodType.BLOOD_MAXHP) {
                tempBloodInfo.maxBloodA -= attackData.hpMaxAdd;
                attackData.damageValue = BloodHelper.updateDamageValue(tempBloodInfo.bloodA, attackData.displayBlood, tempBloodInfo.maxBloodA, hasSync);
                hurt = attackData.damageValue;
                tempBloodInfo.bloodA -= attackData.damageValue
            }
            else if (attackData.bloodType == BloodType.BLOOD_TYPE_ARMY) {
                attackData.damageValue = BloodHelper.updateDamageValue(tempBloodInfo.bloodB, attackData.displayBlood, tempBloodInfo.maxBloodB, hasSync);
                tempBloodInfo.bloodB -= attackData.damageValue
            }
            else if (attackData.bloodType == BloodType.REVIVE) {
                hurt = attackData.damageValue;
                tempBloodInfo.bloodA -= attackData.damageValue
            }
        }
        else if (data instanceof DamageData) {
            let damageData: DamageData = <DamageData>data
            hasSync = BloodHelper.checkIsSyncForWorldBoss(damageData.target, time);
            if (damageData.bloodType == BloodType.BLOOD_TYPE_SELF ||
                damageData.bloodType == BloodType.BLOOD_MAXHP) {
                tempBloodInfo.maxBloodA -= damageData.hpMaxAdd;
                damageData.damageValue = BloodHelper.updateDamageValue(tempBloodInfo.bloodA, damageData.displayBlood, tempBloodInfo.maxBloodA, hasSync);
                hurt = damageData.damageValue;
                tempBloodInfo.bloodA -= damageData.damageValue
            }
            else if (damageData.bloodType == BloodType.BLOOD_TYPE_ARMY) {
                damageData.damageValue = BloodHelper.updateDamageValue(tempBloodInfo.bloodB, damageData.displayBlood, tempBloodInfo.maxBloodB, hasSync);
                tempBloodInfo.bloodB -= damageData.damageValue
            }
        }
        return hurt;
    }
    private static updateDamageValue(currentBlood: number, displayBlood: number, maxBlood: number, hasSync: boolean = false): number {
        if (hasSync) {
            return 0
        }
        if (currentBlood - displayBlood > maxBlood) {
            return (currentBlood - maxBlood);
        } else if (currentBlood - displayBlood < 0) {
            return currentBlood;
        }
        return displayBlood;
    }
    private static createTempRoleBlood(roleInfo: any): TempRoleBloodInfo {
        let roleBloodInfo: TempRoleBloodInfo = new TempRoleBloodInfo();

        roleBloodInfo.maxBloodA = roleInfo.totalBloodA;
        roleBloodInfo.maxBloodB = roleInfo.totalBloodB;

        roleBloodInfo.bloodA = roleInfo.bloodA;
        roleBloodInfo.bloodB = roleInfo.bloodB;

        return roleBloodInfo;
    }
    private static checkIsSyncForWorldBoss(target: number, time: number): boolean {
        let boss: HeroRoleInfo = BloodHelper.battleModel.getWorldBoss();
        if (boss) {
            if (boss.livingId == target) {
                if (BloodHelper._worldBossSyncTime > time) {
                    return true;
                }
            }
        }
        return false;
    }
    private static obtainWorldBossBlood(target: number, hp: number) {
        let boss: HeroRoleInfo = BloodHelper.battleModel.getWorldBoss();
        if (boss) {
            if (boss.livingId == target) {
                BloodHelper.worldBossBloodCached += hp
                BloodHelper.worldBossBloodUpdated += hp;
            }
        }
    }

    public static getRoleLeftBlood(roleInfo: any): number {
        if (BloodHelper.bloodDic) {
            if (BloodHelper.bloodDic[roleInfo.livingId]) {
                return BloodHelper.bloodDic[roleInfo.livingId].bloodA
            }
        }
        return roleInfo.bloodA
    }

    private static _worldBossSyncTime: number

    /**
        * 处理世界BOSS同步血量.
        * 当收到世界BOSS的同步血量数据时,将记录下最新的同步时间.
        * 以便当收到技能时,判定技能上的对BOSS的伤害是否已经在同步血量时处理过了. 
        * @param time
        * 
        */
    public static processWorldBossSyncBlood(time: number) {
        BloodHelper._worldBossSyncTime = time;
    }
    private static get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }
}