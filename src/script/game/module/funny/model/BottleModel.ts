import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { BottleEvent } from "../../../constant/event/NotificationEvent";
import StringHelper from "../../../../core/utils/StringHelper";
import { BottleUserInfo } from "./BottleUserInfo";
import BottleItemInfoMsg = com.road.yishi.proto.item.BottleItemInfoMsg;
import BottlePackage = com.road.yishi.proto.item.BottlePackage;

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/3/22 15:29
 * @ver 1.0
 */
export class BottleModel extends GameEventDispatcher {
    public id: string = "";
    public startTime: number = 0;
    public endTime: number = 0;
    /**
     * 获得物品信息
     */
    private _bottleRewardsInfo: any[];
    /**
     * 幸运传递信息
     */
    private _bottleLuckShowInfo: any[];
    private _bottleLayerShowInfo: any[];
    /**
     * 魔罐物品展示信息
     */
    private _bottleShowItemInfo: BottleItemInfoMsg[];
    /**
     * 拒绝房间邀请
     */
    private _bottleRefuseInvite: boolean = false;
    /**
     * 拒绝组队邀请
     */
    private _bottleRefuseTeamInvite: boolean = false;
    /**
     * 拒绝切磋邀请
     */
    private _bottleRefuseInvitation: boolean = false;
    /**
     * 宝箱领取状态, "1,1,1,0,0"
     */
    private _boxMarkStr: string = "";
    /**
     * 开启次数
     */
    public openCount: number = 0;

    private _nowLayer: number = 0;//踩楼活动当前层数

    private _userArray: BottleUserInfo[] = [];//用户信息数组

    private _isOpenFrame: boolean = false;

    /**
     * 当前点击领取奖励的宝箱Id
     */
    public clickBoxIndex: number = 0;

    /**
     * 普通物品
     */
    public nomalGoodsArr: BottleItemInfoMsg[] = [];
    /**
     * 精品物品
     */
    public boutiqueGoodsArr: BottleItemInfoMsg[] = [];
    /**
     * 次数奖励数组
     */
    public countRewardArr: BottlePackage[] = [];//param : 次数   BottleItemInfoMsg 物品

    /**
     * 楼层奖励数组
     */
    public floorRewardArr: BottlePackage[] = [];//param : 楼层   BottleItemInfoMsg 物品

    /**
     * 窗口是否打开
     */
    public hasOpenFrame: boolean = false;

    constructor() {
        super();
    }

    public set bottleRewardsInfo($value: any[]) {
        this._bottleRewardsInfo = $value;
        this.dispatchEvent(BottleEvent.UPDATE_REWARDS_INFO);
    }

    public get bottleRewardsInfo(): any[] {
        return this._bottleRewardsInfo;
    }

    public getHeightArray(): number[] {
        let heightArray: number[] = [0, 0, 0, 0, 0];
        if (!this.floorRewardArr) {
            return heightArray;
        }
        for (let i: number = 0; i < this.floorRewardArr.length; i++) {
            heightArray[i] = this.floorRewardArr[i].param;
        }
        return heightArray;
    }

    public getMaxHeight() {
        let heightNum = 0;
        if (!this.floorRewardArr) {
            return 0;
        }
        for (let i: number = 0; i < this.floorRewardArr.length; i++) {
            let cfgValue = this.floorRewardArr[i].param;
            if (cfgValue >= heightNum) {
                heightNum = cfgValue
            }
        }
        return heightNum;
    }

    public getCountArray(): any[] {
        let countArray: any[] = [0, 0, 0, 0, 0];
        if (!this.countRewardArr) {
            return countArray;
        }
        for (let i: number = 0; i < this.countRewardArr.length; i++) {
            countArray[i] = this.countRewardArr[i].param;
        }
        return countArray;
    }

    public set bottleLuckShowInfo($value: any[]) {
        this._bottleLuckShowInfo = $value;
        this.dispatchEvent(BottleEvent.UPDATE_LUCK_SHOW_INFO);
    }

    public get bottleLuckShowInfo(): any[] {
        return this._bottleLuckShowInfo;
    }

    public get bottleRefuseInvite(): boolean {
        return this._bottleRefuseInvite;
    }

    public set bottleRefuseInvite($value: boolean) {
        this._bottleRefuseInvite = $value;
    }

    public get bottleRefuseInvitation(): boolean {
        return this._bottleRefuseInvitation;
    }

    public set bottleRefuseInvitation($value: boolean) {
        this._bottleRefuseInvitation = $value;
    }

    public get bottleRefuseTeamInvite(): boolean {
        return this._bottleRefuseTeamInvite;
    }

    public set bottleRefuseTeamInvite($value: boolean) {
        this._bottleRefuseTeamInvite = $value;
    }

    public set bottleShowItemInfo($value: BottleItemInfoMsg[]) {
        this._bottleShowItemInfo = $value;
        this.boutiqueGoodsArr = [];
        this.nomalGoodsArr = [];
        //设置精品物品
        for (let i: number = 0; i < this._bottleShowItemInfo.length; i++) {
            if (this._bottleShowItemInfo[i].isShow) {
                this.boutiqueGoodsArr.push(this._bottleShowItemInfo[i]);
            } else {
                this.nomalGoodsArr.push(this._bottleShowItemInfo[i]);
            }
        }
    }

    public get bottleShowItemInfo(): BottleItemInfoMsg[] {
        return this._bottleShowItemInfo;
    }

    /**
     * 宝箱领取状态, "1,1,1,0,0"
     */
    public get boxMarkArr(): any[] {
        if (StringHelper.isNullOrEmpty(this._boxMarkStr)) {
            this._boxMarkStr = "0,0,0,0,0";
        }
        return this._boxMarkStr.split(",");
    }

    public set boxMarkStr(value: string) {
        if (this._boxMarkStr == value) {
            return;
        }
        this._boxMarkStr = value;
    }

    public get nowLayer(): number {
        let maxLayer = this.getMaxHeight();
        if (this._nowLayer >= maxLayer) {
            return maxLayer;
        }
        return this._nowLayer;
    }

    public set nowLayer(value: number) {
        this._nowLayer = value;
    }

    public get userArray(): BottleUserInfo[] {
        return this._userArray;
    }

    public set userArray(value: BottleUserInfo[]) {
        this._userArray = value;
    }

    /**
     *踩楼传递信息
     */
    public get bottleLayerShowInfo(): any[] {
        return this._bottleLayerShowInfo;
    }

    /**
     * @private
     */
    public set bottleLayerShowInfo(value: any[]) {
        this._bottleLayerShowInfo = value;
        this.dispatchEvent(BottleEvent.UPDATE_LAYER_SHOW_INFO);
    }

    public get isOpenFrame(): boolean {
        return this._isOpenFrame;
    }

    public set isOpenFrame(value: boolean) {
        this._isOpenFrame = value;
        if (!this._isOpenFrame) {
            return;
        }
        // FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.BOTTLE);
    }

}