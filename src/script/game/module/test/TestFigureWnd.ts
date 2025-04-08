// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-01-15 15:40:40
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-08-11 10:33:25
 * @Description: 
 */

import Logger from "../../../core/logger/Logger";
import ResMgr from "../../../core/res/ResMgr";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import Dictionary from "../../../core/utils/Dictionary";
import { BattleManager } from "../../battle/BattleManager";
import { BattleEffect } from "../../battle/skillsys/effect/BattleEffect";
import { EffectContainer } from "../../battle/skillsys/effect/EffectContainer";
import { TestBattleAttackTransaction } from "../../battle/test/TestBattleAttackTransaction";
import { TestBattleData_5_fyundi } from "../../battle/test/TestBattleData_5_fyundi";
import { TestCreateGameTransaction } from "../../battle/test/TestCreateGameTransaction";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import { AnimationManager } from "../../manager/AnimationManager";
import { SharedManager } from "../../manager/SharedManager";

export default class TestFigureWnd extends BaseWindow implements IEnterFrame {
    public framIdx = 0;
    public rolesDict:Dictionary = new Dictionary();

    private btnHunter_20000_20000:UIButton;
    private btnHunter_20851_20020:UIButton;
    private btnHunter_20311_20070:UIButton;
    private btnHunter_21241_20060:UIButton;

    private btnWizard_30000_30000:UIButton;

    private btnMonster_50045_40233:UIButton;
    /**
     * 角色特效容器
     */
    private _roleBackContainer:EffectContainer
    /**
     * 场景特效容器
     */
    private _effectContainer:EffectContainer;
    public get effectContainer():EffectContainer
    {
        return this._effectContainer;
    }

    public get roleBackContainer():EffectContainer
    {
        return this._roleBackContainer;
    }
        
    
    public OnInitWind() {
        super.OnInitWind();
        
        // this.testAni()
    }
    
    enterFrame() {
        this.framIdx++;

        let roles = BattleManager.Instance.battleModel.roleList;
        if(this.framIdx >= 60 * 3)
        {
            this.framIdx = 0
            // Logger.log("[LoginWnd] enterFrame", roles)
        }
        roles.forEach(roleInfo =>
        {
            // Logger.log("[LoginWnd] enterFrame update")
            roleInfo.update();
        });
    }
    
    testAni()
    {
        // ConfigMgr.Instance.loadGroup([ConfigType.t_s_herotemplate, ConfigType.t_s_pawntemplate, ConfigType.t_s_pettemplate, ConfigType.t_s_skilltemplate, ConfigType.t_s_action]);

        // ResMgr.Instance.loadRes("res/animation/swf/monster020a/monster020a.json", (res) => { }, null, Laya.Loader.ATLAS);
        // ResMgr.Instance.loadRes("res/animation/swf/monster023a/monster023a.json", (res) => { }, null, Laya.Loader.ATLAS);

        // ResMgr.Instance.loadRes("res/animation/skilleffect/monster023a_skill01/monster023A.skill01.json", (res) => { }, null, Laya.Loader.ATLAS);
        // ResMgr.Instance.loadRes("res/animation/skilleffect/monster023a_skill02/monster023A.skill02.json", (res) => { }, null, Laya.Loader.ATLAS);

        // // ResMgr.Instance.loadRes("res/animation/equip/hunter_default_body/0/0.json", (res)=>{}, null, Laya.Loader.ATLAS);
        // // ResMgr.Instance.loadRes("res/animation/equip/hunter_default_hair/0/0.json", (res)=>{}, null, Laya.Loader.ATLAS);

        // ResMgr.Instance.loadRes("res/animation/skilleffect/hunter_laser001/hunter.laser001.json", (res) => { }, null, Laya.Loader.ATLAS);
        // ResMgr.Instance.loadRes("res/animation/skilleffect/hunter_skill09/hunter.skill09.json", (res) => { }, null, Laya.Loader.ATLAS);
        // ResMgr.Instance.loadRes("res/animation/skilleffect/flying_hit1/flying.hit1.json", (res) => { }, null, Laya.Loader.ATLAS);

        // ResMgr.Instance.loadRes("res/animation/skilleffect/hunter_skill02/hunter.skill02.json", (res) => { }, null, Laya.Loader.ATLAS);
        // ResMgr.Instance.loadRes("res/animation/skilleffect/hunter_skill02_cast/hunter.skill02.cast.json", (res) => { }, null, Laya.Loader.ATLAS);
        // ResMgr.Instance.loadRes("res/animation/skilleffect/hunter_skill02_flying/hunter.skill02.flying.json", (res) => { }, null, Laya.Loader.ATLAS);
        // ResMgr.Instance.loadRes("res/animation/skilleffect/hunter_skill02_hit/hunter.skill02.hit.json", (res) => { }, null, Laya.Loader.ATLAS);

        // ResMgr.Instance.loadRes("res/animation/skilleffect/hunter_skill07/hunter.skill07.json", (res) => { }, null, Laya.Loader.ATLAS);
        // ResMgr.Instance.loadRes("res/animation/skilleffect/hunter_skill07_hit/hunter.skill07.hit.json", (res) => { }, null, Laya.Loader.ATLAS);

        // ResMgr.Instance.loadRes("res/animation/skilleffect/hunter_skill06_cast/hunter.skill06.cast.json", (res) => { }, null, Laya.Loader.ATLAS);
        // ResMgr.Instance.loadRes("res/animation/skilleffect/hunter_skill06_flying/hunter.skill06.flying.json", (res) => { }, null, Laya.Loader.ATLAS);
        // ResMgr.Instance.loadRes("res/animation/skilleffect/hunter_skill06_hit/hunter.skill06.hit.json", (res) => { }, null, Laya.Loader.ATLAS);

        // ResMgr.Instance.loadRes("res/animation/skilleffect/wizard_skill00_flying/wizard.skill00.flying.json", (res) => { }, null, Laya.Loader.ATLAS);
        // ResMgr.Instance.loadRes("res/animation/skilleffect/wizard_skill00_hit/wizard.skill00.hit.json", (res) => { }, null, Laya.Loader.ATLAS);

        // ResMgr.Instance.loadRes("res/animation/skilleffect/dust_surround/dust.surround.json", (res) => { }, null, Laya.Loader.ATLAS);

        // ResMgr.Instance.loadRes("res/animation/swf/avatar/fashion_cloth_sparta/1_0/image2.png", (res) => { }, null, Laya.Loader.IMAGE);


        let battleTrans = new TestBattleAttackTransaction()
        // 测试人物动画
        Laya.timer.once(500, this, () =>
        {
            TestCreateGameTransaction.Instance.initParent(this).startBattle(TestBattleData_5_fyundi.BattlePrepareMsg)
            // EnterFrameManager.Instance.registeEnterFrame(this);
            // battleTrans.configure(TestBattleData_5_fyundi.AttackOrderMsg20851)
        });


        // //弓手普攻
        // this.btnHunter_20000_20000.onClick(this, () => {
        //     battleTrans.configure(TestBattleData_5_fyundi.AttackOrderMsg20000)
        // })
        // //弓手连射
        // this.btnHunter_20851_20020.onClick(this, () => {
        //     battleTrans.configure(TestBattleData_5_fyundi.AttackOrderMsg20851)
        // })
        // //弓手嗜血射击
        // this.btnHunter_20311_20070.onClick(this, () => {
        //     battleTrans.configure(TestBattleData_5_fyundi.AttackOrderMsg20311)
        // })
        // //弓手冰封
        // this.btnHunter_21241_20060.onClick(this, () => {
        //     battleTrans.configure(TestBattleData_5_fyundi.AttackOrderMsg21241)
        // })
        // //法师普攻
        // this.btnWizard_30000_30000.onClick(this, () => {
        //     battleTrans.configure(TestBattleData_5_fyundi.AttackOrderMsg30000)
        // })
        // //诅咒战士 monster023A 攻击1 木乃伊A普攻  btnMonster_50055_40233
        // this.btnMonster_50045_40233.onClick(this, () => {
        //     battleTrans.configure(TestBattleData_5_fyundi.AttackOrderMsg50055)
        // })

        // let classname = "wizard.skill00.flying"
        // let classname = "monster023a.skill01"
        // classname = StringHelper.replaceStr(classname, ".", "_")
        // let url =  PathManager.solveSkillResPath(classname)
        // ResMgr.Instance.loadRes(url, (res)=>{
        //     let roleAni = new MovieClip();
        //     this.addChild(roleAni);
        //     roleAni.pos(200,200)

        //     let pre_url = classname+"/"
        //     let aniName = ""
        //     AnimationManager.Instance.createAnimation(pre_url, aniName, undefined, "", AnimationManager.BattleEffectFormatLen)
        //     roleAni.play(0, true, pre_url+aniName);
        //     // roleAni.gotoAndStop(2)

        //     // Logger.log("mc.width", roleAni.getBounds().width)
        //     // let bounds = roleAni.getBounds()
        //     // bounds.width *= 0.5
        //     // roleAni.setSelfBounds(bounds)
        //     // Logger.log("mc.width2", roleAni.getBounds().width)

        //     Logger.log(Laya.Animation.framesMap)
        // }, null, Laya.Loader.ATLAS)

        // let url = "res/animation/swf/avatar/fashion_cloth_sparta/1_0/image2.png"
        // ResMgr.Instance.loadRes(url, (res)=>{
        //     Logger.log("[>>>>>>>>>] res", res)
        //     let roleAni = new MovieClip();
        //     this.addChild(roleAni);
        //     roleAni.pos(200,200)
        //     let aniName = "Walk_Down"
        //     AnimationManager.Instance.createAnimationWithTexture(url, url+aniName, 8, 1, 178, 200)
        //     roleAni.play(0, true, url+aniName);
        //     roleAni.interval = 1000/12


        //     // let darwSprite = new Laya.Sprite();
        //     // this.addChild(darwSprite);
        //     // darwSprite.graphics.fillTexture(res, 0,0, 178, 200);

        // }, null, Laya.Loader.IMAGE);
        // let arr = [
        //     {url: "res/animation/swf/monster002a/monster002a/monster002a.json", type: Laya.Loader.ATLAS},
        //     {url: "res/animation/equip/wizard_default_body_cloak/1/1.json", type: Laya.Loader.ATLAS},
        //     {url: "res/animation/equip/wizard_default_arms/1/1.json", type: Laya.Loader.ATLAS},
        //     {url: "res/animation/equip/wizard_default_hair/1/1.json", type: Laya.Loader.ATLAS},
        //     {url: "res/animation/equip/wizard_default_body/1/1.json", type: Laya.Loader.ATLAS},
        // ]
        // ResMgr.Instance.loadGroup(arr, ResourceModel.RoleFigure_GroupKey, this.onComplete.bind(this));


        // let url = "res/animation/equip/wizard_default_body/1/1.json"
        // ResMgr.Instance.loadRes("res/animation/equip/wizard_default_body/1/1.json", (res)=>{
        //     Logger.log("test", res)
        //     let roleAni = new Laya.Animation();
        //     Laya.stage.addChild(roleAni);
        //     roleAni.pos(500,500)
        //     roleAni.zOrder = 100

        //     let preUrl = "equip/wizard_default_body/1/"
        //     let aniName = "level_"+ ActionLabesType.STAND
        //     AnimationManager.Instance.createAnimation(preUrl, aniName, undefined, undefined, AnimationManager.BattleFormatLen)
        //     roleAni.play(0, true, preUrl+aniName);
        //     Logger.log(Laya.Animation.framesMap)
        // }, null, Laya.Loader.ATLAS)

        // let url = "skilleffect/buff_add_patup/buff.add.PATup"
        ResMgr.Instance.loadRes("res/animation/skilleffect/buff_add_patup/buff.add.patup.json", (res) =>
        {
            Logger.log("test", res)
            let roleAni = new Laya.Animation();
            Laya.stage.addChild(roleAni);
            roleAni.pos(500, 500)
            roleAni.zOrder = 100

            let preUrl = "skilleffect/buff_add_patup/"
            AnimationManager.Instance.createAnimation(preUrl, "", 0, "", AnimationManager.BattleEffectFormatLen)
            roleAni.play(0, true, preUrl);
            Logger.log(Laya.Animation.framesMap)
        }, null, Laya.Loader.ATLAS)

        // res/animation/swf/avatar/wizard_default_body/1/1.json
        // let url2 = "res/animation/swf/avatar/wizard_default_body/1/1.json"
        // ResMgr.Instance.loadRes(url2, (res)=>{
        //     Logger.log("test2", res)
        //     let roleAni = new Laya.Animation();
        //     Laya.stage.addChild(roleAni);
        //     roleAni.pos(300,300)
        //     roleAni.zOrder = 100

        //     // "2_asset.wizard_default_body_1.W_7_3.png" 
        //     let preUrl = "swf/avatar/wizard_default_body/1/"
        //     let actionName = AvatarActions.ACTION_STOP
        //     let frameY = 0
        //     let cacheName = preUrl+actionName+frameY
        //     AnimationManager.Instance.createAnimationAvater(preUrl, "", actionName, frameY)
        //     roleAni.interval = 1000/3
        //     roleAni.play(0, true, cacheName);
        //     Logger.log(Laya.Animation.framesMap)

        //     Logger.log(">>>1", ResMgr.Instance.getRes(url2))
        //     Logger.log(">>>2", ResMgr.Instance.getRes(res.meta.prefix+"S_3_2.png"))
        // }, null, Laya.Loader.ATLAS)
    }

    onComplete(res)
    {
        // Logger.log("[]getRes0", ResMgr.Instance.getRes("res/animation/swf/monster002a/monster002a/monster002a.json"))
        // Logger.log("[]getRes1", ResMgr.Instance.getRes("res/animation/equip/wizard_default_body_cloak/1/1.json"))
        // Logger.log("[]getRes2", ResMgr.Instance.getRes("res/animation/equip/wizard_default_arms/1/1.json"))
        // Logger.log("[]getRes3", ResMgr.Instance.getRes("res/animation/equip/wizard_default_hair/1/1.json"))
        // Logger.log("[]getRes4", ResMgr.Instance.getRes("res/animation/equip/wizard_default_body/1/1.json"))


        // Logger.xjy("[]groupMap", Laya.Loader.groupMap)
        // Logger.xjy("[]atlasMap", Laya.Loader.atlasMap)
        // Logger.xjy("[]loadedMap", Laya.Loader.loadedMap)
        // Logger.xjy("[]textureMap", Laya.Loader.textureMap)

        // let url = "res/animation/equip/wizard_default_body/1/1.json"
        // ResMgr.Instance.loadRes("res/animation/equip/wizard_default_body/1/1.json", (res)=>{
        // Logger.log("test", res)
        // let roleAni = new Laya.Animation();
        // Laya.stage.addChild(roleAni);
        // roleAni.pos(500,500)
        // roleAni.zOrder = 100

        // let preUrl = "equip/wizard_default_body/1/"
        // let aniName = "level_"+ ActionLabesType.STAND
        // AnimationManager.Instance.createAnimation(preUrl, aniName, undefined, undefined, AnimationManager.BattleFormatLen)
        // roleAni.play(0, true, preUrl+aniName);
        // Logger.log(Laya.Animation.framesMap)
        // }, null, Laya.Loader.ATLAS)
    }

    public addEffect(effect:BattleEffect, repeat:number = 1, arrange:number = 1)
    {
        if(!SharedManager.Instance.allowAttactedEffect)
        {
            return;
        }
        if(arrange == 1)
        {
            this._effectContainer.addEffect(effect, repeat);
        }
        else
        {
            this._roleBackContainer.addEffect(effect, repeat);
        }
    }
}