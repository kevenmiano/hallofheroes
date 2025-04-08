// @ts-nocheck
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import Dictionary from "../../core/utils/Dictionary";
import { SHARE_EVENT } from "../constant/event/NotificationEvent";

export class SharedManager extends GameEventDispatcher {

    public _localKey: string = "";

    public LOCAL_FILE: string = "";

    private _userId: number = 0;
    /**
     * 付费方式选择
     */
    public payChooseType: number = 0;
    /**
     * 体力是否提示
     */
    public thewCheck: boolean = false;
    /**
     * 体力提示修改时间
     */
    public thewCheckDate: Date = new Date();

    /**
     * 体力提示修改时间
     */
    public chestCheckDate: Date = new Date();
    /**
     * 体力是否提示
     */
    public chestCheck: boolean = false;

    /**
   * 体力提示修改时间
   */
    public inviteCheckDate: Date = new Date();
    /**
     * 体力是否提示
     */
    public inviteCheck: boolean = false;

    /**
   * 体力提示修改时间
   */
    public roomCheckDate: Date = new Date();
    /**
     * 体力是否提示
     */
    public roomCheck: boolean = false;

    public tailaCheck: boolean = false;
    public tailaCheckDate: Date = new Date();

    public kingTowerCheck: boolean = false;
    public kingTowerCheckDate: Date = new Date();

    /**试炼之塔收益提示 */
    public trailTowerCheck: boolean = false;
    public trailTowerCheckDate: Date = new Date();

    /**
     * 攻击城堡提示保护状态消失
     */
    public attackCastleCheck: boolean = false;
    public attackCastleCheckDate: Date = new Date();
    /**
     * QTE是否提示
     */
    public qteUpgrade: boolean = false;
    public qteUpgradeCheckDate: Date = new Date();
    /**
     * 挑战失败是否提示
     */
    public multiFailded: boolean = false;
    public multiFaildedCheckDate: Date = new Date();
    /**
     * 符石背包购买格子新增“今日不再提示”
     */
    public buyRuneGemBagNotAlert: boolean = false;
    public buyRuneGemBagNotAlertCheckDate: Date = new Date();
    /**
     *公会秘境购买Buff是否提示
     */
    public secretGetBuffTip: boolean = false;
    public secretGetBuffTipCheckDate: Date = new Date();
    public deleteFriendCheckDate: Date = new Date();
    public deleteFriendTip: boolean = false;
    /**
     *公会魔神祭坛购买Buff是否提示
     */
    public demonGetBuffTip: boolean = false;
    public demonGetBuffTipCheckDate: Date = new Date();
    /**
     *VIP币刷新是否提示
     */
    public vipBoxRefreshTip: boolean = false;
    public vipBoxRefreshTipCheckDate: Date = new Date();
    /**
     * 合成绑定是否提示
     */
    public storeCompose: boolean = false;
    public storeComposeCheckDate: Date = new Date();
    /**
     *分解已强化装备是否提示
     */
    public resolveStrengthen: boolean = false;
    public resolveStrengthenCheckDate: Date = new Date();
    /**
     * 转换绑定是否提示
     */
    public storeSwitch: boolean = false;
    public storeSwitchCheckDate: Date = new Date();
    /**
     * 房间快速邀请是否提示
     */
    public quickInvite: boolean = true;
    public quickInviteCheckDate: Date = new Date();
    /**
     * 洗练石不足自动购买是否提示
     */
    public storeRefreshBuy: boolean = false;
    public storeRefreshBuyCheckDate: Date = new Date();
    /**
     * 绑定洗练石不足时, 使用非绑定洗练石是否提示
     */
    public storeRefreshBinding: boolean = false;
    public storeRefreshBindingCheckDate: Date = new Date();
    /**
     * 洗练锁不足自动购买是否提示
     */
    public storeLockBuy: boolean = false;
    public storeLockBuyCheckDate: Date = new Date();
    public storeLockBuyUseBind: boolean = false;
    public storeLockBuyUseBindCheckDate: Date = new Date();
    /**
     * 每次消耗光晶2000是否提示
     */
    public expendCrystal: boolean = false;
    public expendCrystalCheckDate: Date = new Date();
    /**
     * 神秘商店刷新是否提示
     */
    public mysteryShopRefresh: boolean = false;
    public mysteryShopRefreshCheckDate: Date = new Date();

    /** 神秘商店刷新使用的货币 */
    public mysteryShopRefreshUseBind: boolean = false;
    public mysteryShopRefreshUseBindDate: Date = new Date();
    /**
     * 悬赏刷新是否提示
     */
    public offerRewardRefresh: boolean = false;
    public offerRewardRefreshCheckDate: Date = new Date();

    /** 训练使用绑定钻石 */
    public advDomesticateUseBind: boolean = false;
    public advDomesticateUseBindDate: Date;

    /** 批次训练使用绑定钻石 */
    public advDomesticateUseBind2: boolean = false;

    /**
    * 市场求购
    */
    public marketRefresh: boolean = false;
    public marketRefreshCheckDate: Date = new Date();

    /** 秘境前往下一层提示*/
    public secretNextLevelCheckDate: Date;

    /**
     *占星
     */
    public starQuickSellType: number = 1;  //一键卖出类型
    /**
     * 占星一键卖出提示
     */
    public starQuickSell: boolean = false;
    public starQuickSellCheckDate: Date = new Date();

    /**
     *经验找回
     */
    public expBackIsSelected: boolean = false;
    /**
     /**
     *魔神祭坛立即复活是否提示
     */
    public demonReviveTipCheckDate: Date;

    /**
     * 邮件一键领取提示
     */
    public emailReceive: boolean = false;

    /**
     * 邮件一键删除提示
     */
    public emailDelete: boolean = false;

    /**
     * 邮件战报一键读取提示
     */
    public emailBattleRead: boolean = false;
    /**
     * 邮件一键领取提示
     */
    public emailReceiveTipCheckDate: Date;

    /**
     * 邮件一键删除提示
     */
    public emailDeleteTipCheckDate: Date;
    public emailBattleReadTipCheckDate: Date;
    /**
     * 天空之城/宠物岛隐藏其他玩家
     * 没有存入缓存中
     */
    public hideOthers: boolean = false;
    /**
     * 背景音乐
     */
    public allowMusic: boolean = true;
    public musicVolumn: number = 50;
    /**
     * 游戏音效
     */
    public allowSound: boolean = true;
    public soundVolumn: number = 50;

    public isSwitchRole: boolean = false;
    /**
     *场景特效
     */
    public allowSceneEffect: boolean = true;
    /**
     * 攻击特效
     */
    public allowAttactedEffect: boolean = true;
    /**
     *显示建筑名字
     */
    public buildingName: boolean = true;
    /**
     *显示残影特效
     */
    public shadowEffect: boolean = true;
    /**
     *高帧率模式 游戏默认关闭高帧率模式, 开启为60FPS, 关闭为30FPS
     */
    private _openHighFrame: boolean = true;
    /**
     *屏蔽玩家名字
     */
    // public hidePlayerName: boolean = false;
    /**
     *隐藏其他玩家
     */
    public hideOtherPlayer: boolean = false;
    /**
     * 兽魂的特殊栏是否曾经闪烁
     */
    public specialBtnHadShine: boolean = false;
    /**
     * 天赋按钮是否曾经闪烁, 50级后没打开过就闪烁
     */
    public talentBtnNeedShine: boolean = false;
    /**
     * 深渊迷宫按钮是否曾经闪烁
     */
    public difficultMazeBtnShine: boolean = false;
    /**
     *公会群聊闪动
     */
    public consortiaGroupChatShineSwitch: boolean = true;
    //是否有新的私聊消息
    public privacyMsgCount: number = 0;
    //是否有新的组队消息
    public teamMsgCount: number = 0;
    //是否有新的公会消息
    public consortiaMsgCount: number = 0;
    /**
     * 是否第一次进入试练之塔
     */
    public isTrailFirst: boolean = false;
    /**
     *背包排序
     */
    public lastBagSortType: number = 0;

    /**
     * 开启魔罐是否提示
     */
    public openBottle: boolean = false;
    public openBottleCheckDate: Date = new Date();
    /** 少于4人组队领取藏宝图 */
    public claimMapNotAlert: boolean = false;
    /** 刷新藏宝图奖励 */
    public refreshRewardNotAlert: boolean = false;
    public refreshRewardUseBind: boolean = true;
    /** 一键刷新藏宝图奖励 */
    public quicklyRefreshRewardNotAlert: boolean = false;
    public quicklyRefreshRewardUseBind: boolean = true;

    private _headIconClickDic: Dictionary;

    
    /**
     * 当前使用的藏宝图ID
     */
    public currentTreasureMapId: number = 0;

    /**
     * 是否使用过藏宝图
     */
    public isUsedTreaSureMap: boolean = false;
    /**
     * 天穹之径许愿墙翻盘是否使用绑定钻石
     */
    public singlePassBugleOpenCardUseBind: boolean = false;
    public singlePassBugleOpenCardUseBindDate: Date;

    /**
     * 拉霸是否使用绑定钻石
     */
    public addSlotUseBind: boolean = false;
    public addSlotUseBindDate: Date;

    private _skillSoundTransform: Laya.SoundChannel = new Laya.SoundChannel();

    public funnyExhchangeNotAlert: boolean = false;
    public newbieAddBlood: boolean = true;
    public newbieAddStamina: boolean = false;
    public newbieAutoFight: boolean = false;
    public newbieOpenWelfare: boolean = false;
    //本次登录不再提示
    public notAlertThisLogin: boolean = false;
    public outercityshopFreshAlertDate: Date;

    public _faceSlappingDate: any = new Object();

    public _downLoadAppClick: boolean = false;

    public defaultLanguage: number = 1;
    //缓存当前新功能开放类型, 已开放状态被点击后记录下来
    public newFunOpenType: number = 0;
    public newFunOpenOrder: number = 0;
    public newFunOpenGrade: number = 0;

    /**
    * 是否充值过
    */
    public isFirstPay: boolean = false;
    /**
     * 龙纹洗炼、升级提示
     */
    public tattooBaptizeCheckDate: Date;
    public tattooUpdateCheckDate: Date;

    //拍卖行本次登录不再提示
    public marketNotAlertThisLogin: boolean = false;

    public set localKey(value: string) {
        this._localKey = "7Road_" + value;
        this.LOCAL_FILE = "7Road_" + value;
    }

    /**
     * 获得游戏(技能)声音调节对象.
     * @return
     *
     */
    public getSkillSoundTransform(): Laya.SoundChannel {
        if (this.allowSound) {
            this._skillSoundTransform = new Laya.SoundChannel();
            this._skillSoundTransform.volume = this.soundVolumn / 100;
        }
        else {
            this._skillSoundTransform = new Laya.SoundChannel();
            this._skillSoundTransform.volume = 0;
        }
        return this._skillSoundTransform;
    }

   
    /**
     *最近联系人
     */
    // public recentList: any[];

    private _autoReplyList: Dictionary;
    /**
     *自动回复内容列表
     */
    public get autoReplyList(): Dictionary {
        if (!this._autoReplyList) {
            this._autoReplyList = new Dictionary();
        }
        return this._autoReplyList;
    }

    // private _imHistoryDic: Dictionary;
    /**
     *IM历史记录
     */
    // public get imHistoryDic(): Dictionary {
    //     if (!this._imHistoryDic) {
    //         this._imHistoryDic = new Dictionary();
    //     }
    //     return this._imHistoryDic;
    // }

    /**
     * 活动领取记录
     * **/
    private _activeDic: Dictionary;

    /**
     *全屏按钮闪烁
     */
    public todayFullScreenBtnShine: number = 0;

    /** 兵种转换 */
    public pownConveruseBind: boolean = false;

    public offerRewardRefreshUseBind: boolean = false;

    public worldBossRiverUseBind: boolean = false;

    public worldBossBuyBuffUseBind: boolean = false;

    /**强化成功率过低, 是否提示 */
    public static IS_STRENGTHEN: string = "IS_STRENGTHEN";
    /**强化成功率过低, 提示的时间期限*/
    public static STRENGTHEN_CHECK_DATE: string = "STRENGTHEN_CHECK_DATE";

    private SharedObject = Laya.LocalStorage;
    private windowObject = window.localStorage;

    /**
     * 丰收号角点击操作记录
     */
    public foisonHornClick: boolean = false;

    /**
    * 
    */
    public outercityShopRefresh: boolean = false;
    public outercityShopRefreshCheckDate: Date = new Date();
    public outercityAttackTotalNeedTips: boolean = true;//金矿攻占总数量达到上限是否弹窗
    public outercityAttackCurrentNeedTips: boolean = true;//金矿当前节点攻占数量达到上限是否弹窗
    public _privacyState: boolean = false;//隐私协议

    // public betterEquipFlag: boolean = false;//更好的装备
    public newbieFinishNodeStr: string = "";//
    public get activeDic(): Dictionary {
        if (!this._activeDic) {
            this._activeDic = new Dictionary();
        }
        return this._activeDic;
    }

    /**
     * 查看过的精彩活动
     */
    public get funnyOldDic(): Dictionary {
        if (!this._funnyOldDic) {
            this._funnyOldDic = new Dictionary();
        }
        return this._funnyOldDic;
    }

    public get headIconClickDic(): Dictionary {
        if (!this._headIconClickDic) {
            this._headIconClickDic = new Dictionary();
        }
        return this._headIconClickDic;
    }

    /** 保存隐私授权状态数据 */
    private _authorizDic: Dictionary;
    /**
     * 隐私授权状态数据
     */
    public get authorizDic(): Dictionary {
        if (!this._authorizDic) {
            this._authorizDic = new Dictionary();
        }
        return this._authorizDic;
    }

    public setup(userId: number) {
        this._userId = userId;
        this.loadLocal();
        this.claimMapNotAlert = false;

        Laya.stage.frameRate = SharedManager.Instance.openHighFrame ? Laya.Stage.FRAME_FAST : Laya.Stage.FRAME_SLOW;
    }

    /**
     * 在本地存储里添加一项属性值
     */
    public setProperty(name1: string, value1: any, name2?: string, value2?: any) {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            if (!localItem) {
                localItem = '{}';
            }
            let so = JSON.parse(localItem);
            if (!so.data) {
                so.data = {};
            }
            so.data[name1 + this._userId] = value1;
            if (name2) {
                so.data[name2 + this._userId] = value2;
            }
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (error) {

        }
    }

    /**
     * 从本地存储中获得指定属性的值, 使用时提取
     */
    public getProperty(name: string): any {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            if (!localItem) {
                return null;
            }
            let so = JSON.parse(localItem);
            return so.data[name + this._userId];
        }
        catch (error) {
            return null;
        }
    }

    public checkIsExpired(lastSaveDate: Date): boolean {
        let isExpire: boolean = true;
        if (lastSaveDate) {
            lastSaveDate = new Date(lastSaveDate);
            let today: Date = new Date();
            if (today.getFullYear() == lastSaveDate.getFullYear() &&
                today.getMonth() == lastSaveDate.getMonth() &&
                today.getDate() == lastSaveDate.getDate()) {
                isExpire = false;
            }
        }
        return isExpire;
    }

    private loadLocal() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            if (!localItem) {
                localItem = '{}';
            }
            let so = JSON.parse(localItem);
            if (so && so.data) {
                if (so.data["allowMusic" + this._userId] != undefined) {
                    this.allowMusic = so.data["allowMusic" + this._userId];
                }
                if (so.data["isSwitchRole" + this._userId] != undefined) {
                    this.isSwitchRole = so.data["isSwitchRole" + this._userId];
                }
                if (so.data["allowSound" + this._userId] != undefined) {
                    this.allowSound = so.data["allowSound" + this._userId];
                }
                if (so.data["musicVolumn" + this._userId] != undefined) {
                    this.musicVolumn = so.data["musicVolumn" + this._userId];
                }
                if (so.data["soundVolumn" + this._userId] != undefined) {
                    this.soundVolumn = so.data["soundVolumn" + this._userId];
                }
                if (so.data["allowSceneEffect" + this._userId] != undefined) {
                    this.allowSceneEffect = so.data["allowSceneEffect" + this._userId];
                }
                if (so.data["allowAttactedEffect" + this._userId] != undefined) {
                    this.allowAttactedEffect = so.data["allowAttactedEffect" + this._userId];
                }
                if (so.data["buildingName" + this._userId] != undefined) {
                    this.buildingName = so.data["buildingName" + this._userId];
                }
                // if (so.data["hidePlayerName" + this._userId] != undefined) {
                //     this.hidePlayerName = so.data["hidePlayerName" + this._userId];
                // }
                if (so.data["hideOtherPlayer" + this._userId] != undefined) {
                    this.hideOtherPlayer = so.data["hideOtherPlayer" + this._userId];
                }
                if (so.data["openHighFrame" + this._userId] != undefined) {
                    this._openHighFrame = so.data["openHighFrame" + this._userId];
                }
                if (so.data["consortiaGroupChatShineSwitch" + this._userId] != undefined) {
                    this.consortiaGroupChatShineSwitch = so.data["consortiaGroupChatShineSwitch" + this._userId];
                }
                if (so.data["recent" + this._userId] != undefined) {
                    // this.recentList = so.data["recent" + this._userId];
                }
                if (so.data["autoReplyList" + this._userId] != undefined) {
                    this._autoReplyList = so.data["autoReplyList" + this._userId] as Dictionary;
                }
                if (so.data["activeDic" + this._userId] != undefined) {
                    this._activeDic = so.data["activeDic" + this._userId] as Dictionary;
                }
                if (so.data["funnyOldDic" + this._userId] != undefined) {
                    this._funnyOldDic = so.data["funnyOldDic" + this._userId] as Dictionary;
                }
                if (so.data["headIconClickDic" + this._userId] != undefined) {
                    this._headIconClickDic = so.data["headIconClickDic" + this._userId] as Dictionary;
                }
                if (so.data["authorizDic" + this._userId] != undefined) {
                    this._authorizDic = so.data["authorizDic" + this._userId] as Dictionary;
                }
                if (so.data["faceSlappingDate" + this._userId] != undefined) {
                    this._faceSlappingDate = so.data["faceSlappingDate" + this._userId];
                }

                // if (so.data["imHistoryDic" + this._userId] != undefined) {
                //     let dic: Dictionary = so.data["imHistoryDic" + this._userId] as Dictionary;
                //     for (let key in dic) {
                //         let items: Object = dic[key];
                //         let arr: BaseIMInfo[] = [];
                //         for (let itemKey in items) {
                //             if (items.hasOwnProperty(itemKey)) {
                //                 let obj = items[itemKey];
                //                 let msg: BaseIMInfo = new BaseIMInfo();
                //                 msg.userId = obj.userId;
                //                 msg.nickName = obj.nickName;
                //                 msg.toId = obj.toId;
                //                 msg.msg = obj.msg;
                //                 msg.date = obj.date;
                //                 msg.sendResult = obj.sendResult;
                //                 msg.headId = obj.headId;
                //                 msg.userLevel = obj.userLevel;
                //                 msg.job = obj.job;
                //                 msg.sendTime = obj.sendTime;
                //                 arr.push(msg);
                //             }
                //         }
                //         this.imHistoryDic[key] = arr;
                //     }
                // }
                if (so.data['payChooseType' + this._userId] != undefined) {
                    this.payChooseType = so.data['payChooseType' + this._userId];
                }
                if (so.data['thewCheck' + this._userId] != undefined) {
                    this.thewCheck = so.data['thewCheck' + this._userId];
                }
                if (so.data['qteUpgrade' + this._userId] != undefined) {
                    this.qteUpgrade = so.data['qteUpgrade' + this._userId];
                }
                if (so.data['secretGetBuffTip' + this._userId] != undefined) {
                    this.secretGetBuffTip = so.data['secretGetBuffTip' + this._userId];
                }
                if (so.data['demonGetBuffTip' + this._userId] != undefined) {
                    this.demonGetBuffTip = so.data['demonGetBuffTip' + this._userId];
                }
                if (so.data['vipBoxRefreshTip' + this._userId] != undefined) {
                    this.vipBoxRefreshTip = so.data['vipBoxRefreshTip' + this._userId];
                }
                if (so.data['storeCompose' + this._userId] != undefined) {
                    this.storeCompose = so.data['storeCompose' + this._userId];
                }
                if (so.data['resolveStrengthen' + this._userId] != undefined) {
                    this.resolveStrengthen = so.data['resolveStrengthen' + this._userId];
                }
                if (so.data['storeSwitch' + this._userId] != undefined) {
                    this.storeSwitch = so.data['storeSwitch' + this._userId];
                }
                if (so.data['quickInvite' + this._userId] != undefined) {
                    this.quickInvite = so.data['quickInvite' + this._userId];
                }
                if (so.data['storeRefreshBuy' + this._userId] != undefined) {
                    this.storeRefreshBuy = so.data['storeRefreshBuy' + this._userId];
                }
                if (so.data['storeRefreshBinding' + this._userId] != undefined) {
                    this.storeRefreshBinding = so.data['storeRefreshBinding' + this._userId];
                }
                if (so.data['storeLockBuy' + this._userId] != undefined) {
                    this.storeLockBuy = so.data['storeLockBuy' + this._userId];
                }
                if (so.data['storeLockBuyUseBind' + this._userId] != undefined) {
                    this.storeLockBuyUseBind = so.data['storeLockBuyUseBind' + this._userId];
                }
                if (so.data['mysteryShopRefresh' + this._userId] != undefined) {
                    this.mysteryShopRefresh = so.data['mysteryShopRefresh' + this._userId];
                }
                if (so.data['mysteryShopRefreshUseBind' + this._userId] != undefined) {
                    this.mysteryShopRefreshUseBind = so.data['mysteryShopRefreshUseBind' + this._userId];
                }
                if (so.data['offerRewardRefresh' + this._userId] != undefined) {
                    this.offerRewardRefresh = so.data['offerRewardRefresh' + this._userId];
                }
                if (so.data['starQuickSellType' + this._userId] != undefined) {
                    this.starQuickSellType = so.data['starQuickSellType' + this._userId];
                }
                if (so.data['multiFailded' + this._userId] != undefined) {
                    this.multiFailded = so.data['multiFailded' + this._userId];
                }
                if (so.data['thewCheckDate' + this._userId] != undefined) {
                    this.thewCheckDate = so.data['thewCheckDate' + this._userId] as Date;
                }
                if (so.data['chestCheckDate' + this._userId] != undefined) {
                    this.chestCheckDate = so.data["chestCheckDate" + this._userId] as Date;;
                }
                if (so.data['inviteCheckDate' + this._userId] != undefined) {
                    this.inviteCheckDate = so.data['inviteCheckDate' + this._userId] as Date;
                }
                if (so.data['roomCheckDate' + this._userId] != undefined) {
                    this.roomCheckDate = so.data['roomCheckDate' + this._userId] as Date;
                }
                if (so.data['qteUpgradeCheckDate' + this._userId] != undefined) {
                    this.qteUpgradeCheckDate = so.data['qteUpgradeCheckDate' + this._userId] as Date;
                }
                if (so.data['secretGetBuffTipCheckDate' + this._userId] != undefined) {
                    this.secretGetBuffTipCheckDate = so.data['secretGetBuffTipCheckDate' + this._userId] as Date;
                }
                if (so.data['demonGetBuffTipCheckDate' + this._userId] != undefined) {
                    this.demonGetBuffTipCheckDate = so.data['demonGetBuffTipCheckDate' + this._userId] as Date;
                }
                if (so.data['vipBoxRefreshTipCheckDate' + this._userId] != undefined) {
                    this.vipBoxRefreshTipCheckDate = so.data['vipBoxRefreshTipCheckDate' + this._userId] as Date;
                }
                if (so.data['demonReviveTipCheckDate' + this._userId] != undefined) {
                    this.demonReviveTipCheckDate = so.data['demonReviveTipCheckDate' + this._userId] as Date;
                }
                if (so.data['storeComposeCheckDate' + this._userId] != undefined) {
                    this.storeComposeCheckDate = so.data['storeComposeCheckDate' + this._userId] as Date;
                }
                if (so.data['resolveStrengthenCheckDate' + this._userId] != undefined) {
                    this.resolveStrengthenCheckDate = so.data['resolveStrengthenCheckDate' + this._userId] as Date;
                }
                if (so.data['storeSwitchCheckDate' + this._userId] != undefined) {
                    this.storeSwitchCheckDate = so.data['storeSwitchCheckDate' + this._userId] as Date;
                }
                if (so.data['quickInviteCheckDate' + this._userId] != undefined) {
                    this.quickInviteCheckDate = so.data['quickInviteCheckDate' + this._userId] as Date;
                }
                if (so.data['storeRefreshBuyCheckDate' + this._userId] != undefined) {
                    this.storeRefreshBuyCheckDate = so.data['storeRefreshBuyCheckDate' + this._userId] as Date;
                }
                if (so.data['storeRefreshBindingCheckDate' + this._userId] != undefined) {
                    this.storeRefreshBindingCheckDate = so.data['storeRefreshBindingCheckDate' + this._userId] as Date;
                }
                if (so.data['storeLockBuyCheckDate' + this._userId] != undefined) {
                    this.storeLockBuyCheckDate = so.data['storeLockBuyCheckDate' + this._userId] as Date;
                }
                if (so.data['starQuickSellType' + this._userId] != undefined) {
                    this.expBackIsSelected = so.data['expBackIsSelected' + this._userId];  //经验找回
                }
                if (so.data['mysteryShopRefreshCheckDate' + this._userId] != undefined) {
                    this.mysteryShopRefreshCheckDate = so.data['mysteryShopRefreshCheckDate' + this._userId] as Date;
                }
                if (so.data['mysteryShopRefreshUseBindDate' + this._userId] != undefined) {
                    this.mysteryShopRefreshUseBindDate = so.data['mysteryShopRefreshUseBindDate' + this._userId];
                }
                if (so.data['multiFaildedCheckDate' + this._userId] != undefined) {
                    this.multiFaildedCheckDate = so.data['multiFaildedCheckDate' + this._userId] as Date;
                }
                if (so.data['buyRuneGemBagNotAlertCheckDate' + this._userId] != undefined) {
                    this.buyRuneGemBagNotAlertCheckDate = so.data['buyRuneGemBagNotAlertCheckDate' + this._userId] as Date;
                }
                if (so.data["attackCastleCheck" + this._userId] != undefined) {
                    this.attackCastleCheck = so.data['attackCastleCheck' + this._userId];
                }
                if (so.data['thewCheckDate' + this._userId] != undefined) {
                    this.attackCastleCheckDate = so.data['attackCastleCheckDate' + this._userId] as Date;
                }
                if (so.data['worldBossRiverTodayNeedAlertDate' + this._userId] != undefined) {
                    this.worldBossRiverTodayNeedAlertCheckDate = so.data['worldBossRiverTodayNeedAlertDate' + this._userId] as Date;
                }
                if (so.data['worldBossPointTodayNeedAlertCheckDate' + this._userId] != undefined) {
                    this.worldBossPointTodayNeedAlertCheckDate = so.data['worldBossPointTodayNeedAlertCheckDate' + this._userId] as Date;
                }
                if (so.data['worldBossGifttokenTodayNeedAlertCheckDate' + this._userId] != undefined) {
                    this.worldBossGifttokenTodayNeedAlertCheckDate = so.data['worldBossGifttokenTodayNeedAlertCheckDate' + this._userId] as Date;
                }
                if (so.data['refuseInvitation' + this._userId] != undefined) {
                    this.refuseInvitation = Boolean(so.data['refuseInvitation' + this._userId]);
                }
                if (so.data['advDomesticateAlertDate' + this._userId] != undefined) {
                    this.advDomesticateAlertDate = so.data['advDomesticateAlertDate' + this._userId] as Date;
                }
                if (so.data['advDomesticateUseBind'] + this._userId != undefined) {
                    this.advDomesticateUseBind = so.data['advDomesticateUseBind' + this._userId];
                }
                if (so.data["advDomesticateUseBind2" + this._userId] != undefined) {
                    this.advDomesticateUseBind2 = so.data["advDomesticateUseBind2" + this._userId];
                }
                if (so.data['advDomesticateUseBindDate'] + this._userId != undefined) {
                    this.advDomesticateUseBindDate = so.data['advDomesticateUseBindDate' + this._userId];
                }
                if (so.data['advDomesticateAlertDate2' + this._userId] != undefined) {
                    this.advDomesticateAlertDate2 = so.data['advDomesticateAlertDate2' + this._userId] as Date;
                }
                if (so.data['pownConverAlertDate' + this._userId] != undefined) {
                    this.pownConverAlertDate = so.data['pownConverAlertDate' + this._userId] as Date;
                }
                if (so.data['domesticateAlertDate' + this._userId] != undefined) {
                    this.domesticateAlertDate = so.data['domesticateAlertDate' + this._userId] as Date;
                }
                if (so.data["completeRingTaskDate" + this._userId] != undefined) {
                    this.completeRingTaskDate = so.data['completeRingTaskDate' + this._userId] as Date;
                }
                if (so.data["completeRingTaskUseBind" + this._userId] != undefined) {
                    this.completeRingTaskUseBind = so.data['completeRingTaskUseBind' + this._userId];
                }
                if (so.data['petAdvanceAlertDate' + this._userId] != undefined) {
                    this.petAdvanceAlertDate = so.data['petAdvanceAlertDate' + this._userId] as Date;
                }
                if (so.data['domesticateAlertDate2' + this._userId] != undefined) {
                    this.domesticateAlertDate2 = so.data['domesticateAlertDate2' + this._userId] as Date;
                }
                if (so.data['worldBossRiverTodayNeedAlertCheckDate_enterBattle' + this._userId] != undefined) {
                    this.worldBossRiverTodayNeedAlertCheckDate_enterBattle = so.data['worldBossRiverTodayNeedAlertCheckDate_enterBattle' + this._userId] as Date;
                }
                if (so.data["specialBtnHadShine" + this._userId] != undefined) {
                    this.specialBtnHadShine = so.data["specialBtnHadShine" + this._userId];
                }
                if (so.data["talentBtnNeedShine" + this._userId] != undefined) {
                    this.talentBtnNeedShine = so.data["talentBtnNeedShine" + this._userId];
                }
                if (so.data['isTrailFirst' + this._userId] != undefined) {
                    this.isTrailFirst = so.data['isTrailFirst' + this._userId];
                }
                if (so.data["lastBagSortType" + this._userId] != undefined) {
                    this.lastBagSortType = so.data["lastBagSortType" + this._userId];
                }
                // if (so.data["privacyMsgCount" + this._userId] != undefined) {
                //     this.privacyMsgCount = so.data["privacyMsgCount" + this._userId];
                // }
                // if (so.data["teamMsgCount" + this._userId] != undefined) {
                //     this.teamMsgCount = so.data["teamMsgCount" + this._userId];
                // }
                // if (so.data["consortiaMsgCount" + this._userId] != undefined) {
                //     this.consortiaMsgCount = so.data["consortiaMsgCount" + this._userId];
                // }
                if (so.data["difficultMazeBtnShine" + this._userId] != undefined) {
                    this.difficultMazeBtnShine = so.data["difficultMazeBtnShine" + this._userId];
                }
                if (so.data["fashionComposeBindsAlertDate" + this._userId] != undefined) {
                    this.fashionComposeBindsAlertDate = so.data["fashionComposeBindsAlertDate" + this._userId] as Date;
                }
                if (so.data["fashionComposeBindsSoulAlertDate" + this._userId] != undefined) {
                    this.fashionComposeBindsSoulAlertDate = so.data["fashionComposeBindsSoulAlertDate" + this._userId] as Date;
                }
                if (so.data["openKingContractAlertDate" + this._userId] != undefined) {
                    this.openKingContractAlertDate = so.data["openKingContractAlertDate" + this._userId] as Date;
                }
                if (so.data["fashionSwitchBindsAlertDate" + this._userId] != undefined) {
                    this.fashionSwitchBindsAlertDate = so.data["fashionSwitchBindsAlertDate" + this._userId] as Date;
                }
                if (so.data["petNormalAdvancedAlertDate" + this._userId] != undefined) {
                    this.petNormalAdvancedAlertDate = so.data["petNormalAdvancedAlertDate" + this._userId] as Date;
                }
                if (so.data["petSeniorAdvancedAlertDate" + this._userId] != undefined) {
                    this.petSeniorAdvancedAlertDate = so.data["petSeniorAdvancedAlertDate" + this._userId] as Date;
                }
                if (so.data["memoryCardBuyAlertDate" + this._userId] != undefined) {
                    this.memoryCardBuyAlertDate = so.data["memoryCardBuyAlertDate" + this._userId] as Date;
                }
                if (so.data["turntableBuyAlertDate1001" + this._userId] != undefined) {
                    this.turntableBuyAlertDate1001 = so.data["turntableBuyAlertDate1001" + this._userId] as Date;
                }
                if (so.data["turntableBuyAlertDate1002" + this._userId] != undefined) {
                    this.turntableBuyAlertDate1002 = so.data["turntableBuyAlertDate1002" + this._userId] as Date;
                }
                if (so.data["turntableBuyAlertDate1003" + this._userId] != undefined) {
                    this.turntableBuyAlertDate1003 = so.data["turntableBuyAlertDate1003" + this._userId] as Date;
                }
                if (so.data["pownConveruseBind"] + this._userId != undefined) {
                    this.pownConveruseBind = so.data["pownConveruseBind" + this._userId];
                }

                if (so.data["offerRewardRefreshUseBind" + this._userId] != undefined) {
                    this.offerRewardRefreshUseBind = so.data["offerRewardRefreshUseBind" + this._userId];
                }

                if (so.data["worldBossRiverUseBind" + this._userId] != undefined) {
                    this.worldBossRiverUseBind = so.data["worldBossRiverUseBind" + this._userId];
                }
                if (so.data["worldBossBuyBuffUseBind" + this._userId] != undefined) {
                    this.worldBossBuyBuffUseBind = so.data["worldBossBuyBuffUseBind" + this._userId];
                }
                if (so.data["petNormalAdvanceCanUsePetStrong" + this._userId] != undefined) {
                    this.petNormalAdvanceCanUsePetStrong = so.data["petNormalAdvanceCanUsePetStrong" + this._userId];
                }
                if (so.data["petSeniorAdvanceCanUsePetStrong" + this._userId] != undefined) {
                    this.petSeniorAdvanceCanUsePetStrong = so.data["petSeniorAdvanceCanUsePetStrong" + this._userId];
                }
                if (so.data["petNormalAdvanceUseBind" + this._userId] != undefined) {
                    this.petNormalAdvanceUseBind = so.data["petNormalAdvanceUseBind" + this._userId];
                }
                if (so.data["petSeniorAdvancedUseBind;" + this._userId] != undefined) {
                    this.petSeniorAdvancedUseBind = so.data["petSeniorAdvancedUseBind;" + this._userId];
                }
                if (so.data["petadvanceWillbeBindCheck1" + this._userId] != undefined) {
                    this.petadvanceWillbeBindCheck1 = so.data["petadvanceWillbeBindCheck1" + this._userId];
                }
                if (so.data["petadvanceWillbeBindCheck2" + this._userId] != undefined) {
                    this.petadvanceWillbeBindCheck2 = so.data["petadvanceWillbeBindCheck2" + this._userId];
                }
                if (so.data["petadvanceWillbeBindCheck3" + this._userId] != undefined) {
                    this.petadvanceWillbeBindCheck3 = so.data["petadvanceWillbeBindCheck3" + this._userId];
                }
                if (so.data["petadvanceWillbeBindCheck4" + this._userId] != undefined) {
                    this.petadvanceWillbeBindCheck4 = so.data["petadvanceWillbeBindCheck4" + this._userId];
                }
                if (so.data["petadvanceWillbeBindCheck5" + this._userId] != undefined) {
                    this.petadvanceWillbeBindCheck5 = so.data["petadvanceWillbeBindCheck5" + this._userId];
                }
                if (so.data["petadvanceWillbeBindCheck6" + this._userId] != undefined) {
                    this.petadvanceWillbeBindCheck6 = so.data["petadvanceWillbeBindCheck6" + this._userId];
                }

                if (so.data["petadvanceWillbeBindCheckDate1" + this._userId] != undefined) {
                    this.petadvanceWillbeBindCheckDate1 = so.data["petadvanceWillbeBindCheckDate1" + this._userId];
                }
                if (so.data["petadvanceWillbeBindCheckDate2" + this._userId] != undefined) {
                    this.petadvanceWillbeBindCheckDate2 = so.data["petadvanceWillbeBindCheckDate2" + this._userId];
                }
                if (so.data["petadvanceWillbeBindCheckDate3" + this._userId] != undefined) {
                    this.petadvanceWillbeBindCheckDate3 = so.data["petadvanceWillbeBindCheckDate3" + this._userId];
                }
                if (so.data["petadvanceWillbeBindCheckDate4" + this._userId] != undefined) {
                    this.petadvanceWillbeBindCheckDate4 = so.data["petadvanceWillbeBindCheckDate4" + this._userId];
                }
                if (so.data["petadvanceWillbeBindCheckDate5" + this._userId] != undefined) {
                    this.petadvanceWillbeBindCheckDate5 = so.data["petadvanceWillbeBindCheckDate5" + this._userId];
                }
                if (so.data["petadvanceWillbeBindCheckDate6" + this._userId] != undefined) {
                    this.petadvanceWillbeBindCheckDate6 = so.data["petadvanceWillbeBindCheckDate6" + this._userId];
                }
                if (so.data["buyPetChallengeCountDate" + this._userId] != undefined) {
                    this.buyPetChallengeCountDate = so.data["buyPetChallengeCountDate" + this._userId] as Date;
                }
                if (so.data["buyPetChallengeCountDate2" + this._userId] != undefined) {
                    this.buyPetChallengeCountDate2 = so.data["buyPetChallengeCountDate2" + this._userId] as Date;
                }
                if (so.data["expendCrystal" + this._userId] != undefined) {
                    this.expendCrystal = so.data["expendCrystal" + this._userId];
                }
                if (so.data["expendCrystalAlertDate" + this._userId] != undefined) {
                    this.expendCrystalCheckDate = so.data["expendCrystalAlertDate" + this._userId] as Date;
                }
                if (so.data["todayFullScreenBtnShine" + this._userId] != undefined) {
                    this.todayFullScreenBtnShine = so.data["todayFullScreenBtnShine" + this._userId];
                }
                if (so.data["currentTreasureMapId" + this._userId] != undefined) {
                    this.currentTreasureMapId = so.data["currentTreasureMapId" + this._userId];
                }
                if (so.data["newFunOpenType" + this._userId] != undefined) {
                    this.newFunOpenType = so.data["newFunOpenType" + this._userId];
                }
                if (so.data["newFunOpenOrder" + this._userId] != undefined) {
                    this.newFunOpenOrder = so.data["newFunOpenOrder" + this._userId];
                }
                if (so.data["newFunOpenGrade" + this._userId] != undefined) {
                    this.newFunOpenGrade = so.data["newFunOpenGrade" + this._userId];
                }
                if (so.data["isUsedTreaSureMap" + this._userId] != undefined) {
                    this.isUsedTreaSureMap = so.data["isUsedTreaSureMap" + this._userId];
                }
                if (so.data["sharePetComposeBtn" + this._userId] != undefined) {
                    this.sharePetComposeBtn = so.data["sharePetComposeBtn" + this._userId] as boolean;
                }
                if (so.data['singlePassBugleOpenCardUseBind'] + this._userId != undefined) {
                    this.singlePassBugleOpenCardUseBind = so.data['singlePassBugleOpenCardUseBind' + this._userId];
                }
                if (so.data['singlePassBugleOpenCardUseBindDate'] + this._userId != undefined) {
                    this.singlePassBugleOpenCardUseBindDate = so.data['singlePassBugleOpenCardUseBindDate' + this._userId];
                }
                if (so.data['addSlotUseBind'] + this._userId != undefined) {
                    this.addSlotUseBind = so.data['addSlotUseBind' + this._userId];
                }
                if (so.data['addSlotUseBindDate'] + this._userId != undefined) {
                    this.addSlotUseBindDate = so.data['addSlotUseBindDate' + this._userId] as Date;
                }
                if (so.data['starQuickSell' + this._userId] != undefined) {
                    this.starQuickSell = so.data['starQuickSell' + this._userId];
                }
                if (so.data['starQuickSellCheckDate' + this._userId] != undefined) {
                    this.starQuickSellCheckDate = so.data['starQuickSellCheckDate' + this._userId] as Date;
                }
                if (so.data['secretNextLevelCheckDate' + this._userId] != undefined) {
                    this.secretNextLevelCheckDate = so.data['secretNextLevelCheckDate' + this._userId] as Date;
                }
                if (so.data['emailReceive' + this._userId] != undefined) {
                    this.emailReceive = so.data['emailReceive' + this._userId];
                }
                if (so.data['emailReceiveTipCheckDate' + this._userId] != undefined) {
                    this.emailReceiveTipCheckDate = so.data['emailReceiveTipCheckDate' + this._userId] as Date;
                }
                if (so.data['emailDelete' + this._userId] != undefined) {
                    this.emailDelete = so.data['emailDelete' + this._userId];
                }
                if (so.data['emailDeleteTipCheckDate' + this._userId] != undefined) {
                    this.emailDeleteTipCheckDate = so.data['emailDeleteTipCheckDate' + this._userId] as Date;
                }
                if (so.data['emailBattleRead' + this._userId] != undefined) {
                    this.emailBattleRead = so.data['emailBattleRead' + this._userId];
                }
                if (so.data['emailBattleReadTipCheckDate' + this._userId] != undefined) {
                    this.emailBattleReadTipCheckDate = so.data['emailBattleReadTipCheckDate' + this._userId] as Date;
                }
                if (so.data['worldBossBuyStunmanFoCheckDate' + this._userId] != undefined) {
                    this.worldBossBuyStunmanFoCheckDate = so.data['worldBossBuyStunmanFoCheckDate' + this._userId] as Date;
                }
                if (so.data['refreshRewardNotAlert' + this._userId] != undefined) {
                    this.refreshRewardNotAlert = so.data['refreshRewardNotAlert' + this._userId];
                }
                if (so.data['refreshRewardUseBind' + this._userId] != undefined) {
                    this.refreshRewardUseBind = so.data['refreshRewardUseBind' + this._userId];
                }
                if (so.data['quicklyRefreshRewardNotAlert' + this._userId] != undefined) {
                    this.quicklyRefreshRewardNotAlert = so.data['quicklyRefreshRewardNotAlert' + this._userId];
                }
                if (so.data['quicklyRefreshRewardUseBind' + this._userId] != undefined) {
                    this.quicklyRefreshRewardUseBind = so.data['quicklyRefreshRewardUseBind' + this._userId];
                }
                if (so.data['claimMapNotAlert' + this._userId] != undefined) {
                    this.claimMapNotAlert = so.data['claimMapNotAlert' + this._userId];
                }
                this.funnyExhchangeNotAlert = false;
                so.data['funnyExchangeNotAlert' + this._userId] = false;
                if (so.data['newbieAddBlood' + this._userId] != undefined) {
                    this.newbieAddBlood = so.data['newbieAddBlood' + this._userId];
                }
                if (so.data['newbieAddStamina' + this._userId] != undefined) {
                    this.newbieAddStamina = so.data['newbieAddStamina' + this._userId];
                }
                if (so.data['newbieAutoFight' + this._userId] != undefined) {
                    this.newbieAutoFight = so.data['newbieAutoFight' + this._userId];
                }
                if (so.data['newbieOpenWelfare' + this._userId] != undefined) {
                    this.newbieOpenWelfare = so.data['newbieOpenWelfare' + this._userId];
                }
                if (so.data["outercityshopFreshAlertDate" + this._userId] != undefined) {
                    this.outercityshopFreshAlertDate = so.data["outercityshopFreshAlertDate" + this._userId] as Date;
                }
                if (so.data["outercityshopFreshUseBind" + this._userId] != undefined) {
                    this.outercityshopFreshUseBind = so.data["outercityshopFreshUseBind" + this._userId] as boolean;
                }
                if (so.data["foisonHornClick" + this._userId] != undefined) {
                    this.foisonHornClick = so.data["foisonHornClick" + this._userId] as boolean;
                }
                // if (so.data["betterEquipFlag" + this._userId] != undefined) {
                //     this.betterEquipFlag = so.data["betterEquipFlag" + this._userId] as boolean;
                // }
                if (so.data["newbieFinishNodeStr" + this._userId] != undefined) {
                    this.newbieFinishNodeStr = so.data["newbieFinishNodeStr" + this._userId] as string;
                }
                if (so.data['isFirstPay' + this._userId] != undefined) {
                    this.isFirstPay = so.data['isFirstPay' + this._userId];
                }
                if (so.data['tattooBaptizeCheckDate' + this._userId] != undefined) {
                    this.tattooBaptizeCheckDate = so.data['tattooBaptizeCheckDate' + this._userId] as Date;
                }
                if (so.data['tattooUpdateCheckDate' + this._userId] != undefined) {
                    this.tattooUpdateCheckDate = so.data['tattooUpdateCheckDate' + this._userId] as Date;
                }
            }
        } catch (e) {
            //				Logger.log(e.toString());
        } finally {
            try {
                // TODO 打开解决循环引用
                // BaseManager.isMusicOn = this.allowMusic;
                // BaseManager.isSoundOn = this.allowSound;
                this.changed();
            }
            catch (err) {
                //Logger.log(e.toString());
            }
        }
    }

    /**精彩活动是否提示 */
    public saveFunnyExchangeTodayNeedAlert() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["funnyExchangeNotAlert" + this._userId] = this.funnyExhchangeNotAlert;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public worldBossPointTodayNeedAlertCheckDate: Date;

    public saveWorldBossPointTodayNeedAlert() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["worldBossPointTodayNeedAlertCheckDate" + this._userId] = this.worldBossPointTodayNeedAlertCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public worldBossGifttokenTodayNeedAlertCheckDate: Date;

    public saveWorldBossGifttokenTodayNeedAlert() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["worldBossGifttokenTodayNeedAlertCheckDate" + this._userId] = this.worldBossGifttokenTodayNeedAlertCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public worldBossRiverTodayNeedAlertCheckDate: Date;

    public saveWorldBossRiverTodayNeedAlert() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["worldBossRiverTodayNeedAlertDate" + this._userId] = this.worldBossRiverTodayNeedAlertCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public worldBossBuyStunmanFoCheckDate: Date;
    /**
     * 世界BOSS使用替身今日不再提示
     */
    public worldBossBuyStunmanFoDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["worldBossBuyStunmanFoCheckDate" + this._userId] = this.worldBossBuyStunmanFoCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public worldBossRiverTodayNeedAlertCheckDate_enterBattle: Date = null;

    public saveWorldBossRiverTodayNeedAlertCheckDate_enterBattle() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["worldBossRiverTodayNeedAlertCheckDate_enterBattle" + this._userId] = this.worldBossRiverTodayNeedAlertCheckDate_enterBattle;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveDemonReviveTipCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["demonReviveTipCheckDate" + this._userId] = this.demonReviveTipCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveAttackCastleCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["attackCastleCheck" + this._userId] = this.attackCastleCheck;
            so.data["attackCastleCheckDate" + this._userId] = this.attackCastleCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveAutoReplyList() {
        try {
            // if (LoaderSavingManager.cacheAble) {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["autoReplyList" + this._userId] = this._autoReplyList;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
            // }
            // else {
            //     //LoaderSavingManager.openSO();
            // }
        }
        catch (error) {
        }
    }

    public saveActiveDic() {
        try {
            // if (LoaderSavingManager.cacheAble) {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["activeDic" + this._userId] = this._activeDic;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
            // }
            // else {
            //     //LoaderSavingManager.openSO();
            // }
        }
        catch (error) {
        }
    }

    public saveAuthorizeDic() {
        try {
            // if (LoaderSavingManager.cacheAble) {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["authorizDic" + this._userId] = this._authorizDic;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
            // }
            // else {
            //     //LoaderSavingManager.openSO();
            // }
        }
        catch (error) {
        }
    }
    public savefunnyOldDic() {
        try {
            // if (LoaderSavingManager.cacheAble) {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["funnyOldDic" + this._userId] = this._funnyOldDic;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
            // }
            // else {
            //     //LoaderSavingManager.openSO();
            // }
        }
        catch (error) {
        }
    }

    // public saveIMHistory() {
    //     try {
    //         // if (LoaderSavingManager.cacheAble) {
    //         let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
    //         let so = JSON.parse(localItem);
    //         so.data["imHistoryDic" + this._userId] = this._imHistoryDic;
    //         let str = JSON.stringify(so);
    //         this.SharedObject.setItem(this.LOCAL_FILE, str);
    //         // }
    //         // else {
    //         //     //LoaderSavingManager.openSO();
    //         // }
    //     }
    //     catch (error) {
    //     }
    // }

    public saveThewCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["thewCheck" + this._userId] = this.thewCheck;
            so.data["thewCheckDate" + this._userId] = this.thewCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveChestCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["chestCheck" + this._userId] = this.chestCheck;
            so.data["chestCheckDate" + this._userId] = this.chestCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveInviteCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["inviteCheck" + this._userId] = this.inviteCheck;
            so.data["inviteCheckDate" + this._userId] = this.inviteCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveRoomCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["roomCheck" + this._userId] = this.roomCheck;
            so.data["roomCheckDate" + this._userId] = this.roomCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveQteUpgradeCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["qteUpgrade" + this._userId] = this.qteUpgrade;
            so.data["qteUpgradeCheckDate" + this._userId] = this.qteUpgradeCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveSecretGetBuffTipCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["secretGetBuffTip" + this._userId] = this.secretGetBuffTip;
            so.data["secretGetBuffTipCheckDate" + this._userId] = this.secretGetBuffTipCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveDeleteFriendTipCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["deleteFriendTip" + this._userId] = this.deleteFriendTip;
            so.data["deleteFriendCheckDate" + this._userId] = this.deleteFriendCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveVipBoxRefreshTipCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["vipBoxRefreshTip" + this._userId] = this.vipBoxRefreshTip;
            so.data["vipBoxRefreshTipCheckDate" + this._userId] = this.vipBoxRefreshTipCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveDemonGetBuffTipCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["demonGetBuffTip" + this._userId] = this.demonGetBuffTip;
            so.data["demonGetBuffTipCheckDate" + this._userId] = this.demonGetBuffTipCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveComposeTipCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["storeCompose" + this._userId] = this.storeCompose;
            so.data["storeComposeCheckDate" + this._userId] = this.storeComposeCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveResolveStrengthenTipCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["resolveStrengthen" + this._userId] = this.resolveStrengthen;
            so.data["resolveStrengthenCheckDate" + this._userId] = this.resolveStrengthenCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveSwitchTipCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["storeSwitch" + this._userId] = this.storeSwitch;
            so.data["storeSwitchCheckDate" + this._userId] = this.storeSwitchCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveStarQuickSellCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["starQuickSell" + this._userId] = this.starQuickSell;
            so.data["starQuickSellCheckDate" + this._userId] = this.starQuickSellCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }
    public saveSecretNextLevelCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["secretNextLevelCheckDate" + this._userId] = this.secretNextLevelCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveEmailReceiveCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["emailReceive" + this._userId] = this.emailReceive;
            so.data["emailReceiveTipCheckDate" + this._userId] = this.emailReceiveTipCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveEmailDeleteCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["emailDelete" + this._userId] = this.emailDelete;
            so.data["emailDeleteTipCheckDate" + this._userId] = this.emailDeleteTipCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveEmailBattleReadCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["emailBattleRead" + this._userId] = this.emailBattleRead;
            so.data["emailBattleReadTipCheckDate" + this._userId] = this.emailBattleReadTipCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public savequickInviteTipCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["quickInvite" + this._userId] = this.quickInvite;
            so.data["quickInviteCheckDate" + this._userId] = this.quickInviteCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveStoreRefreshBuyCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["storeRefreshBuy" + this._userId] = this.storeRefreshBuy;
            so.data["storeRefreshBuyCheckDate" + this._userId] = this.storeRefreshBuyCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }
    public saveStoreLockBuyCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["storeLockBuy" + this._userId] = this.storeLockBuy;
            so.data["storeLockBuyCheckDate" + this._userId] = this.storeLockBuyCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }
    public saveStoreLockBuyUseBind() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["storeLockBuyUseBind" + this._userId] = this.storeLockBuyUseBind;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveStoreRefreshBindingCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["storeRefreshBinding" + this._userId] = this.storeRefreshBinding;
            so.data["storeRefreshBindingCheckDate" + this._userId] = this.storeRefreshBindingCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveExpendCrystalCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["expendCrystal" + this._userId] = this.expendCrystal;
            so.data["expendCrystalAlertDate" + this._userId] = this.expendCrystalCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveMysteryShopRefreshCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            //				so.data["mysteryShopRefresh" + _userId] = mysteryShopRefresh;
            //				so.data["mysteryShopRefreshCheckDate" + _userId] = mysteryShopRefreshCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveMysteryShopRefreshUseBind() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["mysteryShopRefreshUseBind" + this._userId] = this.mysteryShopRefreshUseBind;
            so.data["mysteryShopRefreshUseBindDate" + this._userId] = this.mysteryShopRefreshUseBindDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveOfferRewardRefreshCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["offerRewardRefresh" + this._userId] = this.offerRewardRefresh;
            //				so.data["offerRewardRefreshCheckDate" + _userId] = offerRewardRefreshCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveMultiFailedCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["multiFailded" + this._userId] = this.multiFailded;
            so.data["multiFaildedCheckDate" + this._userId] = this.multiFaildedCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveNotalertCheck() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["buyRuneGemBagNotAlert" + this._userId] = this.buyRuneGemBagNotAlert;
            so.data["buyRuneGemBagNotAlertCheckDate" + this._userId] = this.buyRuneGemBagNotAlertCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveTattooBaptizeCheckDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["tattooBaptizeCheckDate" + this._userId] = this.tattooBaptizeCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveTattooUpdateCheckDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["tattooUpdateCheckDate" + this._userId] = this.tattooUpdateCheckDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    /** 拒绝切磋邀请 */
    public refuseInvitation: boolean = false;

    public save() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["payChooseType" + this._userId] = this.payChooseType;
            so.data["allowMusic" + this._userId] = this.allowMusic;
            so.data["allowSound" + this._userId] = this.allowSound;
            so.data["musicVolumn" + this._userId] = this.musicVolumn;
            so.data["soundVolumn" + this._userId] = this.soundVolumn;
            so.data["allowAttactedEffect" + this._userId] = this.allowAttactedEffect;
            so.data["buildingName" + this._userId] = this.buildingName;
            // so.data["hidePlayerName" + this._userId] = this.hidePlayerName;
            so.data["hideOtherPlayer" + this._userId] = this.hideOtherPlayer;
            so.data["allowSceneEffect" + this._userId] = this.allowSceneEffect;
            so.data["refuseInvitation" + this._userId] = this.refuseInvitation;
            so.data["consortiaGroupChatShineSwitch" + this._userId] = this.consortiaGroupChatShineSwitch;
            so.data["starQuickSellType" + this._userId] = this.starQuickSellType;
            so.data["expBackIsSelected" + this._userId] = this.expBackIsSelected;
            so.data["isSwitchRole" + this._userId] = this.isSwitchRole;
            so.data["openHighFrame" + this._userId] = this._openHighFrame;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
            this.changed();
        }
        catch (e) {
        }
    }

    public updateRecent(list: any[]) {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data['recent' + this._userId] = list;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public changed() {
        // AudioManager.Instance.setConfig(this.allowSound, this.allowMusic, this.musicVolumn, this.soundVolumn);
        // if (ExternalInterface.available) {
        //     if (!this.allowMusic && !this.allowSound)
        //         ExternalInterface.call("SetSoundBtnOff");
        //     else
        //         ExternalInterface.call("SetSoundBtnOn");
        // }
        // TODO 打开解决循环引用
        // BuildingManager.Instance.isShowBuildingName = this.buildingName;
        this.dispatchEvent(Laya.Event.CHANGE);
    }

    public advDomesticateAlertDate: Date;

    public saveAdvDomesticateAlert() {
        try {
            //				let so:SharedObject = SharedObject.getLocal(LOCAL_FILE);
            //				so.data["advDomesticateAlertDate" + _userId] = advDomesticateAlertDate;
            //				this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveAdvDomesticateUseBind() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["advDomesticateUseBind" + this._userId] = this.advDomesticateUseBind;
            so.data["advDomesticateUseBindDate" + this._userId] = this.advDomesticateUseBindDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveAdvDomesticateUseBind2() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["advDomesticateUseBind2" + this._userId] = this.advDomesticateUseBind;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }


    public advDomesticateAlertDate2: Date;

    public saveAdvDomesticateAlert2() {
        try {
            //				let so:SharedObject = SharedObject.getLocal(LOCAL_FILE);
            //				so.data["advDomesticateAlertDate2" + _userId] = advDomesticateAlertDate2;
            //				this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public petAdvanceAlertDate: Date;

    public savePetAdvanceAlert() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["petAdvanceAlertDate" + this._userId] = this.petAdvanceAlertDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public handInMineralDate: Date;

    public saveHandInMineralAlert() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["handInMineralDate" + this._userId] = this.handInMineralDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public completeRingTaskDate: Date;
    public completeRingTaskFlag: boolean = false;

    public saveCompleteRingTaskDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["completeRingTaskDate" + this._userId] = this.completeRingTaskDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public completeRingTaskUseBind: boolean = true;

    public saveCompleteRingTaskUseBind() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["completeRingTaskUseBind" + this._userId] = this.completeRingTaskUseBind;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public domesticateAlertDate: Date;
    public wishPoolAlertDate: Date;
    public saveDomesticateAlert() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["domesticateAlertDate" + this._userId] = this.domesticateAlertDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveWishPoolAlert() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["wishPoolAlertDate" + this._userId] = this.wishPoolAlertDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public domesticateAlertDate2: Date;

    public saveDomesticate2Alert() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["domesticateAlertDate2" + this._userId] = this.domesticateAlertDate2;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public pownConverAlertDate: Date;

    public savePownConverAlert() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["pownConverAlertDate" + this._userId] = this.pownConverAlertDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveSpecialBtnHadShine() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["specialBtnHadShine" + this._userId] = this.specialBtnHadShine;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveTalentBtnNeedShine() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["talentBtnNeedShine" + this._userId] = this.talentBtnNeedShine;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveFistTrail() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["isTrailFirst" + this._userId] = this.isTrailFirst;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveLastBagSortType() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["lastBagSortType" + this._userId] = this.lastBagSortType;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    // public saveNewMsg() {
    //     try {
    //         let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
    //         let so = JSON.parse(localItem);
    //         so.data["privacyMsgCount" + this._userId] = this.privacyMsgCount;
    //         // so.data["teamMsgCount" + this._userId] = this.teamMsgCount;
    //         // so.data["consortiaMsgCount" + this._userId] = this.consortiaMsgCount;
    //         this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
    //     }
    //     catch (e) {
    //     }
    // }

    public saveDifficultMazeBtnShine() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["difficultMazeBtnShine" + this._userId] = this.difficultMazeBtnShine;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public fashionComposeBindsAlertDate: Date;
    public fashionComposeBindsSoulAlertDate: Date;

    public savefashionComposeBindsAlertDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["fashionComposeBindsAlertDate" + this._userId] = this.fashionComposeBindsAlertDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public savefashionComposeBindsSoulAlertDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["fashionComposeBindsSoulAlertDate" + this._userId] = this.fashionComposeBindsSoulAlertDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public fashionSwitchBindsAlertDate: Date;

    public savefashionSwitchBindsAlertDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["fashionSwitchBindsAlertDate" + this._userId] = this.fashionSwitchBindsAlertDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public openKingContractAlertDate: Date;

    public saveOpenKingContractAlertDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["openKingContractAlertDate" + this._userId] = this.openKingContractAlertDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    /**
     *夺宝奇兵购买次数今日不再提示
     */
    public buyGemMazeTimesAlertDate: Date;

    public saveBuyGemMazeTimesAlertDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["buyGemMazeTimesAlertDate" + this._userId] = this.openKingContractAlertDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    /**
     *夺宝奇兵使用绑钻
     */
    public bugGemMazeTimesUseBind: boolean = false;

    public saveBuyGemMazeTimesUseBind() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["bugGemMazeTimesUseBind" + this._userId] = this.bugGemMazeTimesUseBind;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }


    // 英灵钻石强化开关变化
    public petNormalAdvanceCanUsePetStrong: boolean = false;

    public savePetNormalAdvanceCanUsePetStrong() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["petNormalAdvanceCanUsePetStrong" + this._userId] = this.petNormalAdvanceCanUsePetStrong;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }
    public petSeniorAdvanceCanUsePetStrong: boolean = false;

    public savePetSeniorAdvanceCanUsePetStrong() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["petSeniorAdvanceCanUsePetStrong" + this._userId] = this.petSeniorAdvanceCanUsePetStrong;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public petNormalAdvanceUseBind: boolean = false;

    public savePetNormalAdvanceUseBind() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["petNormalAdvanceUseBind" + this._userId] = this.petNormalAdvanceUseBind;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public petNormalAdvancedAlertDate: Date;

    public savePetNormalAdvancedAlertDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["petNormalAdvancedAlertDate" + this._userId] = this.petNormalAdvancedAlertDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public petSeniorAdvancedUseBind: boolean = false;

    public savePetSeniorAdvancedUseBind() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["petSeniorAdvancedUseBind;" + this._userId] = this.petSeniorAdvancedUseBind;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public petSeniorAdvancedAlertDate: Date;

    public savePetSeniorAdvancedAlertDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["petSeniorAdvancedAlertDate" + this._userId] = this.petSeniorAdvancedAlertDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public memoryCardBuyAlertDate: Date;

    public saveMemoryCardBuyAlertDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["memoryCardBuyAlertDate" + this._userId] = this.memoryCardBuyAlertDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public turntableBuyAlertDate1001: Date;
    public turntableBuyAlertDate1002: Date;
    public turntableBuyAlertDate1003: Date;
    public saveTurntableBuyAlertDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["turntableBuyAlertDate1001" + this._userId] = this.turntableBuyAlertDate1001;
            so.data["turntableBuyAlertDate1002" + this._userId] = this.turntableBuyAlertDate1002;
            so.data["turntableBuyAlertDate1003" + this._userId] = this.turntableBuyAlertDate1003;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public savePownConveruseBind() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["pownConveruseBind" + this._userId] = this.pownConveruseBind;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveOfferRewardRefreshUseBind() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["offerRewardRefreshUseBind" + this._userId] = this.offerRewardRefreshUseBind;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveWorldBossRiverUseBind() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["worldBossRiverUseBind" + this._userId] = this.worldBossRiverUseBind;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }


    public saveWorldBossBuyBuffUseBind() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["worldBossBuyBuffUseBind" + this._userId] = this.worldBossBuyBuffUseBind;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public petadvanceWillbeBindCheck1: number = 0;
    public petadvanceWillbeBindCheckDate1: Date;

    public savePetadvanceWillbeBindCheck1() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["petadvanceWillbeBindCheck1" + this._userId] = this.petadvanceWillbeBindCheck1;
            so.data["petadvanceWillbeBindCheckDate1" + this._userId] = this.petadvanceWillbeBindCheckDate1;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public petadvanceWillbeBindCheck2: number = 0;
    public petadvanceWillbeBindCheckDate2: Date;

    public savePetadvanceWillbeBindCheck2() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["petadvanceWillbeBindCheck2" + this._userId] = this.petadvanceWillbeBindCheck2;
            so.data["petadvanceWillbeBindCheckDate2" + this._userId] = this.petadvanceWillbeBindCheckDate2;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public petadvanceWillbeBindCheck3: number = 0;
    public petadvanceWillbeBindCheckDate3: Date;

    public savePetadvanceWillbeBindCheck3() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["petadvanceWillbeBindCheck3" + this._userId] = this.petadvanceWillbeBindCheck3;
            so.data["petadvanceWillbeBindCheckDate3" + this._userId] = this.petadvanceWillbeBindCheckDate3;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public petadvanceWillbeBindCheck4: number = 0;
    public petadvanceWillbeBindCheckDate4: Date;

    public savePetadvanceWillbeBindCheck4() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["petadvanceWillbeBindCheck4" + this._userId] = this.petadvanceWillbeBindCheck4;
            so.data["petadvanceWillbeBindCheckDate4" + this._userId] = this.petadvanceWillbeBindCheckDate4;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public petadvanceWillbeBindCheck5: boolean = false;
    public petadvanceWillbeBindCheckDate5: Date;

    public savePetadvanceWillbeBindCheck5() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["petadvanceWillbeBindCheck5" + this._userId] = this.petadvanceWillbeBindCheck5;
            so.data["petadvanceWillbeBindCheckDate5" + this._userId] = this.petadvanceWillbeBindCheckDate5;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public petadvanceWillbeBindCheck6: boolean = false;
    public petadvanceWillbeBindCheckDate6: Date;

    public savePetadvanceWillbeBindCheck6() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["petadvanceWillbeBindCheck6" + this._userId] = this.petadvanceWillbeBindCheck6;
            so.data["petadvanceWillbeBindCheckDate6" + this._userId] = this.petadvanceWillbeBindCheckDate6;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public buyPetChallengeCountDate: Date;

    public saveBuyPetChallengeCountDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["buyPetChallengeCountDate" + this._userId] = this.buyPetChallengeCountDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public buyPetChallengeCountDate2: Date;

    public saveBuyPetChallengeCountDate2() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["buyPetChallengeCountDate2" + this._userId] = this.buyPetChallengeCountDate2;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public quickMouseWorkDate: Date;

    public saveQuickMouseWorkDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["quickMouseWorkDate" + this._userId] = this.quickMouseWorkDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public quickActiveMouseWorkDate: Date;

    public saveQuickActiveMouseWorkDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["quickActiveMouseWorkDate" + this._userId] = this.quickActiveMouseWorkDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    /**
     * 保存全屏按钮不再闪烁
     *
     */
    public saveTodayFullScreenBtnShine() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["todayFullScreenBtnShine" + this._userId] = this.todayFullScreenBtnShine;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    /**
     * 保存当前已查看新开放功能的状态
     *
     */
    public saveFunOpenType(type: number, order: number, grade: number) {
        this.newFunOpenType = type;
        this.newFunOpenOrder = order;
        this.newFunOpenGrade = grade;
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["newFunOpenType" + this._userId] = this.newFunOpenType;
            so.data["newFunOpenOrder" + this._userId] = this.newFunOpenOrder;
            so.data["newFunOpenGrade" + this._userId] = this.newFunOpenGrade;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    /**
     * 保存当前使用的藏宝图ID
     *
     */
    public saveCurrentTreasureMapId() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["currentTreasureMapId" + this._userId] = this.currentTreasureMapId;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveHeadIconClickDic() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["headIconClickDic" + this._userId] = this._headIconClickDic;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    /**
     * 判断是否使用过藏宝图
     *
     */
    public saveIsUsedTreasureMap() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["isUsedTreaSureMap" + this._userId] = this.isUsedTreaSureMap;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public saveSinglePassBugleOpenCardUseBind() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["singlePassBugleOpenCardUseBind" + this._userId] = this.singlePassBugleOpenCardUseBind;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveSinglePassBugleOpenCardUseBindDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["singlePassBugleOpenCardUseBindDate" + this._userId] = this.singlePassBugleOpenCardUseBindDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
            //				Logger.log("Load shared object error:",e);
        }
    }

    public saveAddSlotUseBind() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data['addSlotUseBind' + this._userId] = this.addSlotUseBind;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {

        }
    }

    public saveAddSlotUseBindDate() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data['addSlotUseBindDate' + this._userId] = this.addSlotUseBindDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {

        }
    }
    /**
     * 藏宝图刷新下次不再提示
     */
    public saveTreasureMapNotAlertNextTime() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data['refreshRewardNotAlert' + this._userId] = this.refreshRewardNotAlert;
            so.data['refreshRewardUseBind' + this._userId] = this.refreshRewardUseBind;
            so.data['quicklyRefreshRewardNotAlert' + this._userId] = this.quicklyRefreshRewardNotAlert;
            so.data['quicklyRefreshRewardUseBind' + this._userId] = this.quicklyRefreshRewardUseBind;
            so.data['claimMapNotAlert' + this._userId] = this.claimMapNotAlert;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {

        }
    }


    private _funnyOldDic: Dictionary;
    public petswallowNotShow: boolean = false;
    public petswallowNotShowResult: boolean = false;

    public sharePetComposeBtn: boolean = true;

    public saveSharePetComposeBtn() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["sharePetComposeBtn" + this._userId] = false;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    private _fashionIdentityProgress: number = 0;

    /**
     * 时装图鉴鉴定按钮是否闪烁过
     */
    public get fashionIdentityProgress(): number {
        return this._fashionIdentityProgress;
    }

    /**
     * @private
     */
    public set fashionIdentityProgress(value: number) {
        this._fashionIdentityProgress = value;
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["fashionIdentityProgress" + this._userId] = this._fashionIdentityProgress;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    /**新手是否提示加血 */
    public saveNewbieAddBlood() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["newbieAddBlood" + this._userId] = this.newbieAddBlood;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }
    /**新手是否提示加血 */
    public saveNewbieAddStamina() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["newbieAddStamina" + this._userId] = this.newbieAddStamina;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }
    /**新手提示自动战斗 */
    public saveNewbieAutoFight() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["newbieAutoFight" + this._userId] = this.newbieAutoFight;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }
    /**新手提示自动战斗 */
    public saveNewbieOpenWelfare() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["newbieOpenWelfare" + this._userId] = this.newbieOpenWelfare;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public outercityshopFreshUseBind: boolean;
    public saveOutercityshopUseBind() {
        try {
            var localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["outercityshopFreshUseBind" + this._userId] = this.newbieAutoFight;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        } catch (e) {

        }
    }

    public saveOutercityshopFreshAlert() {
        try {
            var localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["outercityshopFreshAlertDate" + this._userId] = this.newbieAutoFight;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        } catch (e) {

        }
    }

    public saveFoisonHornClick() {
        try {
            var localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["foisonHornClick" + this._userId] = this.foisonHornClick;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        } catch (e) {

        }
    }

    // public saveBetterEquipFlag() {
    //     try {
    //         var localItem = this.SharedObject.getItem(this.LOCAL_FILE);
    //         let so = JSON.parse(localItem);
    //         so.data["betterEquipFlag" + this._userId] = this.betterEquipFlag;
    //         this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
    //     } catch (e) {

    //     }
    // }
    public saveNewbieFinishNodeStr() {
        try {
            var localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            so.data["newbieFinishNodeStr" + this._userId] = this.newbieFinishNodeStr;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        } catch (e) {

        }
    }

    public get faceSlappingDate() {
        return this._faceSlappingDate;
    }

    public saveFaceSlaping(faceSlapAtyId: string = "") {
        try {
            var localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            let dateObj: any = new Object();
            dateObj[faceSlapAtyId] = new Date();
            this._faceSlappingDate = dateObj;
            so.data["faceSlappingDate" + this._userId] = this._faceSlappingDate;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        } catch (e) {

        }
    }

    public get downLoadAppClick(): boolean {
        let value = this.getWindowItem("downLoadAppClick");
        if (value == "true") {
            return true;
        }
        return false;
    }

    public set downLoadAppClick(value: boolean) {
        this._downLoadAppClick = value;
        this.setWindowItem("downLoadAppClick", String(value));
    }

    public get downLoadAppDate(): Date {
        let value = this.getWindowItem("downLoadAppDate");
        return new Date(value);
    }

    public set downLoadAppDate(date: Date) {
        this.setWindowItem("downLoadAppDate", date.toDateString());
    }

    public setWindowItem(key: string, value: string) {
        if (!this.windowObject) {
            this.windowObject = window.localStorage;
        }
        this.windowObject.setItem(this._localKey + "-" + key, value);
    }

    public getWindowItem(key: string): string {
        if (!this.windowObject) {
            this.windowObject = window.localStorage;
        }
        return this.windowObject.getItem(this._localKey + "-" + key);
    }

    public get openHighFrame(): boolean {
        return this._openHighFrame;
    }

    public set openHighFrame(value: boolean) {
        this._openHighFrame = value;
        this.dispatchEvent(SHARE_EVENT.HIGH_FRAME_CHANGE);
    }

    public get privacyState(): string {
        return this.getWindowItem("privacyState");
    }

    public set privacyState(value: string) {
        this.setWindowItem("privacyState", value);
    }

    public setAutoStarSetting(cost: number, sell: number, compose: number) {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            let jsonData = {
                autoCost: cost, autoSell: sell, autoCompose: compose
            }
            so.data["autoStar" + this._userId] = JSON.stringify(jsonData);
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public getAutoStarSetting(): any {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            if (!localItem) {
                return null;
            }
            let so = JSON.parse(localItem);
            let value = so.data["autoStar" + this._userId];
            return JSON.parse(value);
        } catch (error) {
            return null;
        }
    }

    public saveFirstPay() {
        try {
            let localItem = this.SharedObject.getItem(this.LOCAL_FILE);
            let so = JSON.parse(localItem);
            this.isFirstPay = true;
            so.data["isFirstPay" + this._userId] = this.isFirstPay;
            this.SharedObject.setItem(this.LOCAL_FILE, JSON.stringify(so));
        }
        catch (e) {
        }
    }

    public get FrameValue(): number {
        if (this._openHighFrame) {
            return 60;
        } else {
            return 30;
        }
    }

    private static _instance: SharedManager;

    public static get Instance(): SharedManager {
        if (!this._instance) {
            this._instance = new SharedManager();
        }
        return this._instance;
    }
}