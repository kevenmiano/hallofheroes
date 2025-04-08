// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-08-12 17:25:01
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-05-31 11:49:45
 * @Description: 
 */

import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { FarmEvent } from "../../../constant/event/NotificationEvent";
import { ArmyManager } from "../../../manager/ArmyManager";
import FarmLandInfo from "./FarmLandInfo";
import PetLandInfo from "./PetLandInfo";
import { TreeInfo } from "./TreeInfo";
import Logger from '../../../../core/logger/Logger';

export default class FarmInfo extends GameEventDispatcher {

    public userId: number = 0;
    public nickName: string;
    public frameId: number = 0;
    /**
     *神树信息 
     */
    public treeInfo: TreeInfo;
    /**
     *今日偷取他人次数 
     */
    public dayStealCount: number = 0;
    /**
     *农场等级 
     */
    private _grade: number = 0;
    /**
     *土地等级 
     */
    private _landGrade: number = 0;
    /**
     *农场经验 
     */
    private _gp: number = 0;
    /**
    * 当天从好友获取的经验
    */
    private _dayGpFromFriend: number = 0;
    /**
     *土地列表 
     */
    private _landList: SimpleDictionary;

    private _petLandList: Array<PetLandInfo>;

    constructor() {
        super();
        this._landList = new SimpleDictionary();
        this._petLandList = [];
    }

    /**
     * 农场等级
     */
    public get grade(): number {
        return this._grade;
    }
    public set grade(val: number) {
        if (this._grade == val) return;
        this._grade = val;
        this.dispatchEvent(FarmEvent.FARM_GRADE_CHANGE);
    }

    /**
     * 土地等级
     */
    public get landGrade(): number {
        return this._landGrade;
    }
    public set landGrade(val: number) {
        if (this._landGrade == val) return;
        this._landGrade = val;
        this.dispatchEvent(FarmEvent.LAND_GRADE_CHANGE);
    }

    /**
     * 当前等级经验
     */
    public get gp(): number {
        return this._gp;
    }
    public set gp(val: number) {
        if (this._gp == val) return;
        this._gp = val;
        this.dispatchEvent(FarmEvent.FARM_GP_CHANGE);
    }

    /**
     * 当天从好友获取的经验
     */
    public get dayGpFromFriend(): number {
        return this._dayGpFromFriend;
    }
    public set dayGpFromFriend(val: number) {
        if (this._dayGpFromFriend == val) return;
        this._dayGpFromFriend = val;
    }

    /**
     * 得到土地列表
     */
    public getLandList(): Array<FarmLandInfo> {
        return this._landList.getList();
    }

    /**
     * 通过位置得到土地信息
     */
    public getLandInfo(pos: number): FarmLandInfo {
        return this._landList[pos];
    }

    /**
     * 添加土地信息
     */
    public addLandInfo(info: FarmLandInfo) {
        if (info) {
            if (this._landList[info.pos]) return;
            this._landList.add(info.pos, info);
            this.dispatchEvent(FarmEvent.LAND_OPEN, info);
        }
    }

    /**
     * 删除土地信息
     */
    public delLandInfo(pos: number) {
        this._landList.del(pos);
    }

    public getPetLandList(): Array<PetLandInfo> {
        return this._petLandList;
    }

    public addPetLandInfo(info: PetLandInfo) {
        if (!info) return;
        Logger.xjy("[FarmInfo]addPetLandInfo", info)
        if (!this._petLandList[info.pos]) {
            this._petLandList[info.pos] = info;
            this.dispatchEvent(FarmEvent.PET_LAND_OPEN, info);
        } else {
            this.dispatchEvent(FarmEvent.PET_LAND_UPDATE, info);
        }
    }

    public getPetLandInfo(pos: number): PetLandInfo {
        return this._petLandList[pos];
    }

    private _defender: PetLandInfo;

    /** 农场守护者 */
    public get defender(): PetLandInfo {
        return this._defender;
    }

    /**
     * @private
     */
    public set defender(value: PetLandInfo) {
        this._defender = value;
        this.dispatchEvent(FarmEvent.FARM_DEFENDER_CHANGE, value);
    }


    public get isMine(): boolean {
        return this.userId == ArmyManager.Instance.thane.userId;
    }

}