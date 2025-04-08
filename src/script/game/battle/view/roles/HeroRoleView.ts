// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-20 18:00
 * @description  英雄角色视图
 **/

import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { eFilterFrameText } from "../../../component/FilterFrameText";
import { MovieClip } from "../../../component/MovieClip";
import { ActionMovie } from "../../../component/tools/ActionMovie";
import { HeroMovieClip } from "../../../component/tools/HeroMovieClip";
import { ActionLabesType, BattleType, FaceType, InheritRoleType, RoleType } from "../../../constant/BattleDefine";
import { RoleEvent } from "../../../constant/event/NotificationEvent";
import { PathManager } from "../../../manager/PathManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { BattleManager } from "../../BattleManager";
import { BattleModel } from "../../BattleModel";
import { GameLoadNeedData } from "../../data/GameLoadNeedData";
import { BaseRoleInfo } from "../../data/objects/BaseRoleInfo";
import { HeroRoleInfo } from "../../data/objects/HeroRoleInfo";
import { PetRoleInfo } from "../../data/objects/PetRoleInfo";
import { Helpers } from "../../utils/Helpers";
import { RoleUnit } from "../RoleUnit";
import { HeroLoadDataFactory } from "../../utils/HeroLoadDataFactory";
import { BaseRoleView } from "./BaseRoleView";



export class HeroRoleView extends BaseRoleView {
    public inheritType: InheritRoleType = InheritRoleType.Hero

    private _heroMovie: HeroMovieClip;
    private _petMovie: MovieClip;
    private _needLoad: number = 1;
    private _loaded: number = 0;
    private _delaySetStateId: any = 0;

    public get bodyMc(): MovieClip {
        return this._heroMovie.body.content
    }

    public get rolePartUrlPath(): string {
        if ((this._info as HeroRoleInfo).type == RoleType.T_NPC_BOSS) {
            return this._rolePart && this._rolePart.data && this._rolePart.data.urlPath
        } else {
            return this._heroMovie && this._heroMovie.body.data.urlPath
        }
    }

    public constructor(info) {
        super(info);
    }

    // override 
    public load() {
        super.load()
        if ((this._info as HeroRoleInfo).type != RoleType.T_NPC_BOSS) {//type是3的为boss, 其它是英雄  正常的情况下是null  即继续执行

            let pet: PetRoleInfo = (this._info as HeroRoleInfo).petRoleInfo;
            if (pet && pet.livingId != this._info.livingId) {
                this._needLoad++;
                this._rolePart = new RoleUnit();
                this._rolePart.completeFunc = this.onPetPartComplete.bind(this);
                this._rolePart.data = HeroLoadDataFactory.create((this._info as HeroRoleInfo).heroInfo, HeroLoadDataFactory.PART_PET_BODY);
            }

            if (pet && pet.livingId == this._info.livingId) {
                this._rolePart = new RoleUnit();
                this._rolePart.completeFunc = this.onPetPartComplete2.bind(this);
                this._rolePart.data = HeroLoadDataFactory.create((this._info as HeroRoleInfo).heroInfo, HeroLoadDataFactory.PART_PET_BODY);
            } else {
                this._heroMovie = new HeroMovieClip(this.info as HeroRoleInfo);
                this._heroMovie.completeFunc = this.onHeroLoadComplete.bind(this);
                this._heroMovie.startLoad();
            }
        } else {//boss
            this._rolePart = new RoleUnit();
            this._rolePart.completeFunc = this.onBossLoadComplete.bind(this);
            this._rolePart.data = new GameLoadNeedData(PathManager.solveRolePath(this._info.resPath));
        }

        if (this._movieContainer) this._movieContainer.addChild(this._info.actionMovie);
        if (this._movieContainer) this._movieContainer.scaleX = this._info.face == FaceType.RIGHT_TEAM ? -1 : 1;
    }

    private onPetPartComplete(target: RoleUnit) {
        this._petMovie = target.content;
        this._petMovie.name = target.content.data ? target.content.data.urlPath : "";
        this.checkCanShowBody();
    }

    private onPetPartComplete2(target: RoleUnit) {
        if (this._disposed) return;
        if (!this._info) return;
        this._loadingState = HeroRoleView.LOAD_COMPLETE_STATE;
        this._info.isLoadComplete = true;
        this.removeLoadingView();
        this._delaySetStateId = setTimeout(this.delayInitState.bind(this), 200);

        this._petMovie = target.content;
        if (this._petMovie) {
            this._petMovie.gotoAndStop(1);
            this._info.actionMovieClip = this._petMovie;
        }
        if (this._movieContainer.numChildren > 0) this._movieContainer.removeChildAt(0);
        if (this._info.actionMovieClip) {
            this._movieContainer.addChild(this._info.actionMovieClip);

            this.layoutEffect();

            Helpers.getPos(this._info.pos_head_hero, this._info.actionMovieClip, "pos_body");
            Helpers.getPos(this._info.pos_body_hero, this._info.actionMovieClip, "pos_head");
            Helpers.getPos(this._info.pos_leg_hero, this._info.actionMovieClip, "pos_leg");
        }
        this.onLoadComplete();
    }

    private onHeroLoadComplete() {
        if (this._disposed) {
            return;
        }
        this._heroMovie.name = "HERO"
        // Logger.battle("[HeroRoleView]onHeroLoadComplete", this._info.roleName)
        this._loadingState = HeroRoleView.LOAD_COMPLETE_STATE;
        this._info.isLoadComplete = true;
        this.removeLoadingView();
        //王者之塔boss加tint
        if (this._info.face == FaceType.RIGHT_TEAM && BattleManager.Instance.battleModel.isKingTower()) {
            // let color:Color = new Color(); 
            // color.tintMultiplier = 0.5;
            // if(this._info.actionMovieClip)
            // {
            //     this._info.actionMovieClip.transform.colorTransform = color; 
            // }
        }
        this._delaySetStateId = setTimeout(this.delayInitState.bind(this), 200);
        this.checkCanShowBody();
    }

    private checkCanShowBody() {
        this._loaded++;
        if (this._loaded == this._needLoad) {
            this.changeBody();
            this.onLoadComplete();
        }
    }

    private onBossLoadComplete() {
        if (this._info) {
            if (this._disposed) {
                return;
            }
            let mc = this._rolePart.content
            this._info.actionMovieClip = mc;
            // Logger.battle("[HeroRoleView]onBattleUILoaded2", (this._info as HeroRoleInfo).heroInfo.nickName + "战斗形象:" + this._info.actionMovieClip);

            this._info.isLoadComplete = true;
            this.removeLoadingView();

            let mcWidth = mc.getBounds().width;
            this.initShadeScale(mcWidth);
            this.changeBody();
        }
        this._loadingState = HeroRoleView.LOAD_COMPLETE_STATE;
        this.onLoadComplete();
    }

    private delayInitState() {
        if (this._disposed) {
            return;
        }
        if (!this._info.isLiving || this._info.bloodA <= 0) {

            // if (this._info instanceof HeroRoleInfo) {
            if (this._info.inheritType == InheritRoleType.Hero) {
                let hero: HeroRoleInfo = this._info as HeroRoleInfo;
                hero.isPetState = false;
                if (hero.petRoleInfo) {
                    hero.petRoleInfo.visible = false;
                }
            }

            this._info.action(ActionLabesType.FAILED, ActionMovie.STOP);
            if (this._info == BattleManager.Instance.battleModel.selfHero) {
                this._info.cleanBuffers();
            }
        }
    }

    private _awakenShineMc: MovieClip;//觉醒闪烁动画
    private _awakenMc: MovieClip;  //觉醒进度条
    // override 
    protected delayInitView() {
        if (this._disposed) {
            return;
        }
        super.delayInitView();
        if (!this.roleInfoView) {
            return;
        }

        let heroInfo: HeroRoleInfo = this._info as HeroRoleInfo;
        if (heroInfo && heroInfo.petLivingId != 0) {
            // this._awakenShineMc = FUIHelper.createFUIInstance("","battle.BottomAwakenMc");
            // this._awakenMc = this._awakenShineMc["progressMc"] as MovieClip;
            // this._awakenShineMc.gotoAndStop(1);
            // let frame:number = Math.floor(heroInfo.awaken * 100 / BattleModel.AWAKEN_FULL_VALUE);
            // this._awakenMc.gotoAndStop(frame);
            // if (this._stripView) {
            //     (this._stripView.getView() as fgui.GComponent).addChild(this._awakenShineMc.displayObject);
            // }
        }

        let name: string = PlayerManager.Instance.currentPlayerModel.playerInfo.nickName;
        let userID: number = PlayerManager.Instance.currentPlayerModel.userInfo.userId;
        if (name == userID + "$" || name == LangManager.Instance.GetTranslation("public.nickName")) {
            if (this._info == BattleManager.Instance.battleModel.selfHero) {
                this.setHeroNameTxtValue(LangManager.Instance.GetTranslation("public.nickName"));
                return;
            }
        }
        let nickName = (this._info as HeroRoleInfo).heroInfo.nickName;
        if (nickName == "" || nickName == undefined) {
            nickName = (this._info as HeroRoleInfo).heroInfo.templateInfo.TemplateNameLang;
        }
        this.setHeroNameTxtValue(nickName);

        if (BattleManager.Instance.battleModel.battleType == BattleType.PET_PK) {
            this.heroNameTxt.setFrame((this._info as HeroRoleInfo).petRoleInfo.quality, eFilterFrameText.PetQuality);
        }
    }
    // override
    public updateShadowPos() {
        if (this._disposed) {
            return;
        }
        if (!this._info || !this._info.actionMovie.movie || !this._shadow) {
            return;
        }
        // let posMc: MovieClip
        // if ((this._info as HeroRoleInfo).type != 3) {
        //     posMc = this._info.actionMovie.movie.pos_leg;
        // } else {
        //     posMc = this._info.actionMovie.movie.pos_leg;
        // }
        // if (posMc) {
        //     this._shadow.x = posMc.x;
        //     this._shadow.y = posMc.y;
        // } else {
        //     this._shadow.x = 0;
        //     this._shadow.y = 0;
        // }
    }

    // override 
    protected addEvent() {
        super.addEvent();
        this._info.addEventListener(RoleEvent.SP, this.onHeroSpChanged, this);
        this._info.addEventListener(RoleEvent.AWAKEN, this.__onHeroAwakenChanged, this);
    }

    // override 
    protected removeEvent() {
        super.removeEvent();
        if (this._info) {
            this._info.removeEventListener(RoleEvent.SP, this.onHeroSpChanged, this);
            this._info.removeEventListener(RoleEvent.AWAKEN, this.__onHeroAwakenChanged, this);
        }
    }

    private onHeroSpChanged(data) {
        let heroRole: HeroRoleInfo = this._info as HeroRoleInfo;
        if (heroRole && data.buffCause) {
            if (this._readySkillTemp) {
                if (heroRole.sp < this._readySkillTemp.Cost) {
                    this.cancelReadyState();
                }
            }
        }
    }

    private _awakenTween: TweenLite;
    private __onHeroAwakenChanged(e: RoleEvent) {
        this.killAwakenTween();
        let heroRole: HeroRoleInfo = this._info as HeroRoleInfo;
        let targetFrame: number = Math.floor(heroRole.awaken * 100 / BattleModel.AWAKEN_FULL_VALUE);
        if (this._awakenMc) {
            // this._awakenTween = TweenLite.to(this._awakenMc, 0.5, {frame:targetFrame, onComplete:this._awakenTweenComplete});
        }
    }

    private killAwakenTween() {
        if (this._awakenTween) {
            // this._awakenTween.kill();
            // this._awakenTween = null;
        }
    }

    private _awakenTweenComplete() {
        this.killAwakenTween();
        if (!this._info) return;
        if (!this.isSelf) return;
        if (!this._awakenShineMc) return;
        let heroRole: HeroRoleInfo = this._info as HeroRoleInfo;
        if (heroRole && heroRole.awaken >= BattleModel.AWAKEN_FULL_VALUE) {
            this._awakenShineMc.gotoAndPlay(1);
        } else {
            this._awakenShineMc.gotoAndStop(1);
        }
    }

    public changeBody() {
        if (!this._info) return;
        if ((this._info as HeroRoleInfo).isPetState) {
            if (this._petMovie) {
                this._info.actionMovieClip = this._petMovie;
                this.isPetBody = true;
            }
        } else {
            if (this._heroMovie && this._heroMovie.getBodyMC()) {
                this._info.actionMovieClip = this._heroMovie;
                this.isPetBody = false;
            }
        }

        // 动画测试
        // this._info.action(ActionLabesType.Attack01, ActionMovie.REPEAT)

        Logger.battle("变身完成isPetBody:", this.isPetBody, (this._info as HeroRoleInfo).isPetState);

        if (this._movieContainer.numChildren > 0) this._movieContainer.removeChildAt(0);
        if (this._info.actionMovieClip) {
            //把ActonMovie 下的 MovieClip  改变到 _movieContainer节点
            this._movieContainer.addChild(this._info.actionMovieClip);
            this.layoutEffect();
            Helpers.getPos((this._info as HeroRoleInfo).pos_head_hero, this._info.actionMovieClip, "pos_body");
            Helpers.getPos((this._info as HeroRoleInfo).pos_body_hero, this._info.actionMovieClip, "pos_head");
            Helpers.getPos((this._info as HeroRoleInfo).pos_leg_hero, this._info.actionMovieClip, "pos_leg");
        }
    }

    /**
     * 变身后身体高度有变化 
     * 
     */
    private layoutEffect() {
        if (!this._petMovie) return;
        if (!this._heroMovie) return;

        let hero: HeroRoleInfo = this._info as HeroRoleInfo;
        for (let i: number = 0; i < this.effectContainer.numChildren; i++) {
            let child: any = this.effectContainer.getChildAt(i);

            if (child.mountPt) {
                let mountPt = hero.getSpecialPos(child.mountPt);
                let basePt = hero.getSpecialPos(BaseRoleInfo.POS_LEG);
                let dstPtX = mountPt.x - basePt.x;
                let dstPtY = mountPt.y - basePt.y;

                if (child.mountPt == BaseRoleInfo.POS_HEAD) {
                    dstPtY += BaseRoleView.BUFFER_OFFSET_Y;
                }

                child.x = dstPtX;
                child.y = dstPtY;
            }
        }
    }

    /**
     * BOSS死亡被消融了 复活重新设置可见
     * heroMovie(组合的movieclip), 游戏中没有暂时没有对此做消融处理  应该会有问题
     * @param value 
     */
    public setRoleViewVisible(value: boolean) {
        super.setRoleViewVisible(value)
        if (this._petMovie) {
            this._petMovie.visible = value;
            this._petMovie.active = value;
        }
        // if (this._heroMovie) {
        //     this._heroMovie.visible = value;
        // }
        if (this._rolePart && this._rolePart.content) {
            this._rolePart.content.visible = value;
            this._rolePart.content.active = value;
        }
    }

    public dispose() {
        super.dispose()
        // this.killAwakenTween();
        ObjectUtils.disposeObject(this._petMovie); this._petMovie = null;
        ObjectUtils.disposeObject(this._heroMovie); this._heroMovie = null;
        ObjectUtils.disposeObject(this._rolePart); this._rolePart = null;
        ObjectUtils.disposeObject(this._awakenShineMc); this._awakenShineMc = null;
        ObjectUtils.disposeObject(this._awakenMc); this._awakenMc = null;
        if (this._delaySetStateId > 0) {
            clearTimeout(this._delaySetStateId);
        }
    }

}