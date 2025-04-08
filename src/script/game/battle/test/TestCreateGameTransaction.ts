// @ts-nocheck
/**
 * @author jeremy.xu
 * @data: 2020-11-23 21:00
 * @description 测试人物, 技能, buffer等等动画
 */

import ConfigMgr from "../../../core/config/ConfigMgr";
import Logger from "../../../core/logger/Logger";
import { t_s_herotemplateData } from "../../config/t_s_herotemplate";
import { BattleType, FaceType, InheritRoleType, RoleType } from "../../constant/BattleDefine";
import { ConfigType } from "../../constant/ConfigDefine";
import { BattleEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import { SocketGameReader } from "../../manager/SocketGameReader";
import TestFigureWnd from "../../module/test/TestFigureWnd";
import { BattleManager } from "../BattleManager";
import { BattleModel } from "../BattleModel";
import { HeroRoleInfo } from "../data/objects/HeroRoleInfo";
import { PawnRoleInfo } from "../data/objects/PawnRoleInfo";
import { ResourceModel } from "../data/ResourceModel";
import { SkillData } from "../data/SkillData";
import { SkillResLoaderVO } from "../skillsys/loader/SkillResLoaderVO";
import { SkillResourceLoader } from "../skillsys/loader/SkillResourceLoader";
import { TransactionBase } from "../transaction/TransactionBase";
import { BattleUtils } from "../utils/BattleUtils";
import { BaseRoleView } from "../view/roles/BaseRoleView";

// TestCreateGameTransaction.Instance.startBattle()
export class TestCreateGameTransaction extends TransactionBase {
    private static ins: TestCreateGameTransaction;
    static get Instance(): TestCreateGameTransaction {
        if (!TestCreateGameTransaction.ins) {
            TestCreateGameTransaction.ins = new TestCreateGameTransaction();
        }
        return TestCreateGameTransaction.ins;
    }
    _view: Laya.Sprite
    initParent(view: Laya.Sprite) {
        this._view = view
        return this
    }

    //开始战斗:  准备数据+初始化管理+loading
    startBattle(msg: any) {
        Logger.battle("[TestCreateGameTransaction]startBattle")

        NotificationManager.Instance.addEventListener(BattleEvent.ENTER_BATTLE_SCENE, this.__enterBattleSceneHandler, this);
        // SkillData.resetIndexId();
        BattleModel.battleUILoaded = true;
        //1.获取数据
        this.initBattleInfo(msg);
        this.initBattleManager(); //

        //2.加载好资源   ENTER_BATTLE_SCENE 事件
        this.initResLoad()

        //3.添加所有战斗所需角色至舞台  BattleView中添加
        this.initRoles()
    }

    /**
     * 先用BattleDataTest数据做测试  
     */
    private initBattleInfo(msg: any) {
        Logger.battle("[TestCreateGameTransaction]initBattleInfo")
        let gameInfo: BattleModel = new BattleModel();
        BattleManager.Instance.model = gameInfo;

        let resource: ResourceModel = new ResourceModel();
        BattleManager.Instance.resourceModel = resource;

        // 战斗socket信息写入model
        gameInfo = this.createPawnRoleInfo(gameInfo, msg);
        gameInfo = this.createHeroRoleInfo(gameInfo, msg); //同时创建英雄和英灵  
        // gameInfo = this.createPetRoleInfo(gameInfo, msg);
        Logger.battle("[TestCreateGameTransaction]initBattleInfo gameInfo", gameInfo)

        this.checkFace(gameInfo);
    }

    private checkFace(gameInfo: BattleModel) {
        gameInfo.armyInfoLeft.site = gameInfo.selfSide;
        gameInfo.armyInfoLeft.face = FaceType.LEFT_TEAM;
        gameInfo.armyInfoRight.face = FaceType.RIGHT_TEAM;
        gameInfo.armyInfoRight.site = 3 - gameInfo.selfSide;
    }

    private initBattleManager() {
        // BattleTransactionManager.Instance.setup();
        BattleManager.Instance.initSkillSystem();
        BattleManager.Instance.started = true;
        BattleManager.Instance.setup();
        // KeyBoardRegister.Instance.battleFlag = true;
        // LayerManager.Instance.clearnGameDynamic();
        // BattleManager.Instance.resourceModel.startLoad();  //开始加载资源  不等加载完成就进入场景  后面资源加载好后异步显示场景obj
        // EnterBattleController.Instance.handler(null);
    }
    /**
     * 加载战斗资源
     * 
     */
    private initResLoad() {

        this.loadRoleView();
        this.loadBattleEffectByJob();
        this.loadBattleSkill();
    }

    /**
     * 初始化战斗角色视图（BaseRoleView）
     * @param gameInfo
     * @param resource
     * 
     */
    private loadRoleView() {
        Logger.battle("[TestCreateGameTransaction]loadRoleView")

        let gameInfo: BattleModel = BattleManager.Instance.battleModel;
        for (const roleInfo of gameInfo.roleList.values()) {
            //初始化战斗角色的加载视图（RoleUnit）
            if (roleInfo.load)
                roleInfo.load();
        }
    }
    /**
     * 根据职业加载施法动作特效 
     * 
     */
    private loadBattleEffectByJob() {
        // var path:String = "";
        // switch(ThaneInfoHelper.getJob(thane.job))
        // {
        //     case 1:
        //         path = ComponentSetting.getUISourcePath(UIModuleTypes.BATTLEEFFECT1);
        //         break;
        //     case 2:
        //         path = ComponentSetting.getUISourcePath(UIModuleTypes.BATTLEEFFECT2);
        //         break;
        //     case 3:
        //         path = ComponentSetting.getUISourcePath(UIModuleTypes.BATTLEEFFECT3);
        //         break;
        // }
        // LoaderManagerII.Instance.load(path,LoaderInfo.MODULE_LOADER,LoaderPriority.Priority_7,null);
    }
    /**
     * 初始化并加载战斗需要的技能
     * 包括
     * 1.己方英雄技能
     * 2.己方士兵技能
     * 3.对方英雄技能（对方为玩家, 则为玩家英雄技能；对方为boss则为boss的ai技能）
     * 4.对方士兵技能（进入战斗时的士兵技能；可能包含ai召唤的士兵的技能） 
     * ai技能包含多种技能
     * 
     * 自己的英雄技能需要显示技能名字
     */
    private loadBattleSkill() {
        let skillIds: any = [];
        SkillResourceLoader.clear();
        // this.initPawnSkill(skillIds);
        this.initHeroSkill(skillIds);
        // this.initPetSkill(skillIds);
        BattleManager.Instance.battleModel.skillIds = skillIds;
    }
    /**
     * 初始化兵加载士兵技能资源 
     * @param skillIds
     */
    private initPawnSkill(skillIds: any[]) {
        // var pawnSkillIds:any[] = [];
        // var model	:BattleModel = BattleManager.Instance.battleModel;
        // var pId:number;
        // var pawnTemp : PawnTemplate;
        // if(model.soldierTemplates)//召唤怪的id列表
        // {
        //     for each(pId in model.soldierTemplates)
        //     {
        //         pawnTemp		= TempleteManager.Instance.pawnTemplateCate.getTemplateByID(pId);
        //         pawnSkillIds	= pawnSkillIds.concat(getAwakenSkillByAi(pawnTemp.AI));//召唤怪的ai技能
        //     }
        // }
        // for each(var role:RoleInfo in model.roleList)
        // {
        //     if(role is PawnRoleInfo)//服务器发过来的士兵列表
        //     {
        //         var len:number = role.skillIds.length;//服务器发过来的士兵列表里面已经包含士兵的ai技能, 需要加入士兵默认技能
        //         for(var k:number = 0; k < len; k++)
        //         {
        //             if(pawnSkillIds.indexOf(role.skillIds[k]) == -1)
        //             {
        //                 pawnSkillIds.push(role.skillIds[k]);
        //             }
        //         }
        //     }
        // }

        // for each(pId in pawnSkillIds)
        // {//将兵的技能放入技能数组.
        //     if(pId != 0 && skillIds.indexOf(pId) == -1)
        //     {
        //         skillIds.push(pId);
        //         SkillResourceLoader.addSkillVOs([new SkillResLoaderVO(pId, 2)]);
        //     }
        // }
    }
    /**
     * 初始化兵加载英雄技能资源 
     * @param skillIds
     */
    private initHeroSkill(skillIds: any[]) {
        var selfSideSkillIds: any[] = [];
        var selfSkillIds: any[] = [];
        var heroSkillIds: any[] = [];
        var hero: HeroRoleInfo;
        // var resource:ResourceModel 	= BattleManager.Instance.resourceModel;
        var model: BattleModel = BattleManager.Instance.battleModel;
        Logger.battle("[TestCreateGameTransaction]initHeroSkill", model)
        var morphSkills: any[] = [SkillData.PET_MORPH_SKILL, SkillData.PET_UNMORPH_SKILL];

        var skillId: number;
        model.roleList.forEach((role) => {
            // if(role instanceof HeroRoleInfo)
            if (role.inheritType == InheritRoleType.Hero) {
                hero = role;
                // hero.props.forEach((prop : BattlePropItem) => {//道具技能（符文）
                //     if(prop.skillTempId != 0 && skillIds.indexOf(prop.skillTempId) == -1)
                //     {
                //         skillIds.push(prop.skillTempId);
                //         SkillResourceLoader.addSkillVOs([new SkillResLoaderVO(prop.skillTempId, 2)]);
                //     }
                // });

                var defaultSkill: number = 0;
                var heroTempInfo: t_s_herotemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_herotemplate, String(hero.templateId));
                if (heroTempInfo) {
                    defaultSkill = heroTempInfo.DefaultSkill;
                }
                if (skillIds.indexOf(defaultSkill) == -1)//默认技能 普攻   （战功法 10000 20000 30000）
                {
                    skillIds.push(defaultSkill);
                    heroSkillIds.push(defaultSkill);
                    if (hero == model.selfHero) {
                        selfSkillIds.push(defaultSkill);
                    }
                }

                // if (hero.petRoleInfo && hero.petRoleInfo.template) {
                //     // var idArr:any[] = hero.petRoleInfo.template.DefaultSkills.split(",");
                //     // idArr.forEach(id => {
                //     //     defaultSkill = parseInt(id);
                //     //     if (skillIds.indexOf(defaultSkill) == -1) {
                //     //         skillIds.push(defaultSkill);
                //     //         SkillResourceLoader.addSkillVOs([new SkillResLoaderVO(defaultSkill, 2)]);
                //     //     }
                //     // });
                //     defaultSkill = hero.petRoleInfo.template.DefaultSkills
                //     if (skillIds.indexOf(defaultSkill) == -1) {
                //         skillIds.push(defaultSkill);
                //         SkillResourceLoader.addSkillVOs([new SkillResLoaderVO(defaultSkill, 2)]);
                //     }
                // }

                for (var k: number = 0; k < hero.skillIds.length; k++)//英雄技能
                {
                    if (skillIds.indexOf(hero.skillIds[k]) == -1) {
                        skillIds.push(hero.skillIds[k]);
                        heroSkillIds.push(hero.skillIds[k]);
                    }
                    if (hero == model.selfHero) {
                        selfSkillIds.push(hero.skillIds[k]);
                    }
                    if (hero.side == model.selfSide && selfSideSkillIds.indexOf(hero.skillIds[k]) == -1) {
                        selfSideSkillIds.push(hero.skillIds[k]);
                    }
                }
                // for(var j:number = 0; j < hero.trialProps.length; j++)//试练技能
                // {
                //     // var trailProp:TrailPropInfo = hero.trialProps[j];
                //     var trailProp = hero.trialProps[j];
                //     if(skillIds.indexOf(trailProp.id) == -1)
                //     {
                //         skillIds.push(trailProp.id);
                //         heroSkillIds.push(trailProp.id);
                //     }
                //     if(hero == model.selfHero)
                //     {
                //         selfSkillIds.push(trailProp.id);
                //     }
                // }

                // for (k = 0; k < hero.petSkillIds.length; k++) {//变身后技能
                //     skillId = hero.petSkillIds[k];
                //     if(skillIds.indexOf(skillId) == -1)
                //     {
                //         skillIds.push(skillId);
                //         heroSkillIds.push(skillId);
                //     }
                //     if(hero == model.selfHero)
                //     {
                //         selfSkillIds.push(skillId);
                //     }
                // }


                // if (hero.petRoleInfo) {
                //     //觉醒技能
                //     for (k = 0; k < morphSkills.length; k++) {
                //         skillId = morphSkills[k];
                //         if(skillIds.indexOf(skillId) == -1)
                //         {
                //             skillIds.push(skillId);
                //             heroSkillIds.push(skillId);
                //         }
                //         if(hero == model.selfHero)
                //         {
                //             selfSkillIds.push(skillId);
                //         }
                //     }
                // }

                heroSkillIds = SkillResourceLoader.getHeroFullSkillIds(heroSkillIds);//获取qte技能

                var sex: number = 0;
                if (hero.type == RoleType.T_NPC_BOSS) {
                    sex = 2;
                } else {
                    sex = hero.heroInfo.sexs;
                }
                //加载所有的英雄资源
                heroSkillIds.forEach(heroSkillId => {
                    SkillResourceLoader.addSkillVOs([new SkillResLoaderVO(heroSkillId, sex)]);
                });
                // hero.petSkillIds.forEach(skillId => {
                //     SkillResourceLoader.addSkillVOs([new SkillResLoaderVO(skillId, 2)]);
                // });
            }
        });
        selfSkillIds = selfSkillIds.concat(SkillResourceLoader.getHeroFullSkillIds(selfSkillIds));
        var skillNameIds: any[] = selfSkillIds;
        if (model.battleType == BattleType.PET_PK) {
            skillNameIds = selfSideSkillIds.concat(SkillResourceLoader.getHeroFullSkillIds(selfSideSkillIds));
        }
        // skillNameIds = SkillNameLoader.getSkillNameIds(skillNameIds);
        // resource.addSkillNameIds(skillNameIds);
    }

    private initPetSkill(skillids: any[]) {
        // var resource:ResourceModel 	= BattleManager.Instance.resourceModel;
        // var model	:BattleModel 	= BattleManager.Instance.battleModel;

        // var petRoleInfo:PetRoleInfo;
        // for each(var role:RoleInfo in model.roleList) {
        //     if (role is PetRoleInfo) {
        //         petRoleInfo = <PetRoleInfo> role;
        //         for each (var skillId:number in petRoleInfo.skillIds) {
        //             if (skillids.indexOf(skillId) == -1) {
        //                 skillids.push(skillId);
        //                 SkillResourceLoader.addSkillVOs([new SkillResLoaderVO(skillId, 2)]);
        //             }
        //         }
        //         var idArr:any[] = petRoleInfo.template.DefaultSkills.split(",");
        //         for each (var id:string in idArr) {
        //             skillId = parseInt(id);
        //             if (skillids.indexOf(skillId) == -1) {
        //                 skillids.push(skillId);
        //                 SkillResourceLoader.addSkillVOs([new SkillResLoaderVO(skillId, 2)]);
        //             }
        //         }
        //     }
        // }
    }


    /**
     * 创建部队信息
     * @param gameInfo	战斗模型
     * @param msg 战斗准备数据
     * @return 
     * 
     */
    private createPawnRoleInfo(gameInfo: BattleModel, msg: any): BattleModel {
        let leng = msg.soldiers.length;
        let role: PawnRoleInfo;
        let soldier: any
        for (let i = 0; i < leng; i++) {
            soldier = msg.soldiers[i];
            role = SocketGameReader.readPawnRoleInfo(soldier)
            gameInfo.addRole(role);

            Logger.battle("[TestCreateGameTransaction]收到战斗士兵列表 roleName:" + role.roleName);
            role.totalBlood = role.bloodA;
            role.initBloodA = role.bloodA;
        }
        return gameInfo;
    }

    /**
     * 创建战斗中的英雄信息 
     * @param gameInfo
     * @param msg
     * @return 
     * 
     */
    private createHeroRoleInfo(gameInfo: BattleModel, msg: any): BattleModel {
        if (gameInfo.battleType == BattleType.PET_PK) return gameInfo;
        let leng = msg.heros.length;
        let heroMsg: any;
        let petMsg: any;
        for (let i = 0; i < leng; i++) {
            heroMsg = msg.heros[i];
            // petMsg = this.findPetMsgForHero(msg.pets, heroMsg.livingId); //TODO 添加宠物

            let role = SocketGameReader.readHeroRoleInfo(heroMsg, petMsg);   //这里已经创建出role initview了

            Logger.battle("[TestCreateGameTransaction]收到战斗英雄列表 nickName=" + role.heroInfo.nickName);
            gameInfo.addRole(role);
            if (role.petRoleInfo) {
                gameInfo.addRole(role.petRoleInfo);
            }

            //测试
            if (role instanceof HeroRoleInfo)
                BattleManager.Instance.battleModel.selfHero = role;
        }
        return gameInfo;
    }

    /**
     * 只有在英灵竞技调用
     * @param gameInfo
     * @param msg
     * @return 
     * 
     */
    // private createPetRoleInfo(gameInfo : BattleModel, msg : any):BattleModel {
    // if (gameInfo.battleType != BattleType.PET_PK) return gameInfo;
    // let leng : int = msg.pets.length;
    // let role : HeroRoleInfo;
    // let heroMsg : HeroMsg;
    // for(let i:int=0;i<leng;i++)
    // {
    //     heroMsg = msg.pets[i];
    //     role = SocketGameReader.readHeroRoleInfo(heroMsg, null);     //把英灵当做hero
    //     role.petRoleInfo = SocketGameReader.readPetRoleInfo(heroMsg);//记录英灵信息
    //     role.heroInfo.petTemplateId = heroMsg.tempId;
    //     role.heroInfo.sexs = 2;
    //     role.isPetState = true;
    //     Logger.battle("收到战斗宠物列表: : : " + role.roleName);
    //     gameInfo.addRole(role);
    //     heroMsg = null;
    // }
    // return gameInfo;
    // }

    // private findPetMsgForHero(petMsgList:Array, heroLivingId:int):HeroMsg {
    //     for each (let petMsg:HeroMsg in petMsgList) {
    //         if (petMsg.livingId2 == heroLivingId) {
    //             return petMsg;
    //         }
    //     }
    //     return null;
    // }

    //进入战斗场景界面
    private __enterBattleSceneHandler(e: BattleEvent) {
        NotificationManager.Instance.removeEventListener(BattleEvent.ENTER_BATTLE_SCENE, this.__enterBattleSceneHandler, this);
        this.initResLoad();
    }

    initRoles() {
        let gameInfo: BattleModel = BattleManager.Instance.battleModel;

        gameInfo.roleList.forEach((roleInfo, key) => {
            /**
             * 角色的视图（RoleUnit）已经在startBattle -> createHeroRoleInfo/createPawnRoleInfo 创建出来了
             * 在这里把加入进舞台
             */
            let role: BaseRoleView = roleInfo.getRoleView();
            this._view.addChild(role)
            role.info.map = this._view; //this._view充当map
            (this._view as TestFigureWnd).rolesDict.set(roleInfo.livingId, role)
            BattleManager.Instance.battleMap = this._view

            var temp = BattleUtils.rolePointByPos(roleInfo.pos, roleInfo.face);
            roleInfo.initPos(temp);

            Logger.battle("[TestCreateGameTransaction]initRoles ", key, role)
            Logger.battle("[TestCreateGameTransaction]initRoles roleInfo.pos:", roleInfo.pos, "roleInfo.face:", roleInfo.face, temp)
        })
    }
}