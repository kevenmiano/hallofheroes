// @ts-nocheck
import Dictionary from '../../../core/utils/Dictionary';
import { FreedomTeamEvent } from '../../constant/event/NotificationEvent';
import { BaseArmy } from '../../map/space/data/BaseArmy';
import FrameDataBase from '../../mvc/FrameDataBase';
/**
* @author:pzlricky
* @data: 2021-04-29 16:49
* @description *** 
*/
export default class FreedomTeamModel extends FrameDataBase {

    public static OPEN_INVITEFRAME: String = "OPEN_INVITEFRAME";
    public static OPEN_SORTFRAME: String = "OPEN_SORTFRAME";
    public static OPEN_MANAGEFRAME: String = "OPEN_MANAGEFRAME";

    private _allMembers: Array<any>;
    private _captainId: number;
    private _teamId: number=0;
    private _memberFightPos: Array<any>;
    private _memberId: Array<number>;
    private _memberFightCapacity: Dictionary;
    private _memberState: Dictionary;
    private _transferMapping: Dictionary;

    /**被跟随者id, 为0: 没有跟随别人, 取消跟随时, 要重置为0*/
    public followId: number = 0;
    private _followFlag: boolean = false;

    constructor() {
        super();
        this._allMembers = new Array();
        this._memberFightPos = new Array();
        this._memberId = new Array();
        this._memberFightCapacity = new Dictionary();
        this._memberState = new Dictionary();

        this._transferMapping = new Dictionary();
        this._transferMapping["10000-20001"] = 5;
        this._transferMapping["10000-30000"] = 15;
        this._transferMapping["20001-20002"] = 2000102;
        this._transferMapping["20001-10000"] = 2000150;
        this._transferMapping["20002-20003"] = 2000202;
        this._transferMapping["20002-20001"] = 2000201;
        this._transferMapping["20003-20004"] = 2000341;
        this._transferMapping["20003-20002"] = 2000301;
        this._transferMapping["20004-20003"] = 2000401;
        this._transferMapping["30000-10000"] = 3000002;
    }

    public get followFlag(): boolean {
        return this._followFlag;
    }

    public set followFlag(value: boolean) {
        this._followFlag = value;
        if (!value)//取消跟随时, 被跟随者id重置
            this.followId = 0;
    }

    public get transferMapping(): Dictionary {
        return this._transferMapping;
    }

    public getMemberByUserId(userId: number): BaseArmy {
        for (var i: number = 0; i < this._allMembers.length; i++) {
            var army: BaseArmy = this._allMembers[i] as BaseArmy;
            if (army.userId == userId) {
                return army;
            }
        }
        return null;
    }

    public addMember(army: BaseArmy) {
        if (this._allMembers.indexOf(army) == -1) {
            this._allMembers.push(army);
        }
        this.dispatchEvent(FreedomTeamEvent.ADD_MEMBER, army);
    }

    public removeMemberByUserId(userId: number) {
        var army: BaseArmy = this.getMemberByUserId(userId);
        if (army) {
            var index: number;
            for (let i: number = 0; i < this._allMembers.length; i++) {
                let item = this._allMembers[i];
                if (item && item.userId == userId) {
                    this._allMembers.splice(i, 1);
                    break;
                }
            }
            index = this._memberId.indexOf(userId);
            this._memberId.splice(index, 1);
            for (let i: number = 0; i < this._memberFightPos.length; i++) {
                let item = this._memberFightPos[i];
                if (item && item.userId == userId) {
                    this._memberFightPos.splice(i, 1);
                    break;
                }
            }
            delete this._memberFightCapacity[userId];
            delete this._memberState[userId];
            this.dispatchEvent(FreedomTeamEvent.REMOVE_MEMBER, army);
        }
    }

    public get allMembers() {
        return this._allMembers;
    }

    public set memberFightPos(value) {
        if (this._memberFightPos != value) {
            this._memberFightPos = value;
        }
    }

    public get armyFightPos() {
        return this._memberFightPos;
    }

    public set captainId(value: number) {
        if (this._captainId != value) {
            this._captainId = value;
        }
    }

    public get captainId(): number {
        return this._captainId;
    }

    public set teamId(value: number) {
        if (this._teamId != value) {
            this._teamId = value;
        }
    }

    public get teamId(): number {
        return this._teamId;
    }

    public get memberId() {
        return this._memberId;
    }

    public set memberId(value) {
        if (this._memberId != value) {
            this._memberId = value;
        }
    }


    public get memberFightCapacity(): Dictionary {
        return this._memberFightCapacity;
    }

    public set memberFightCapacity(value: Dictionary) {
        if (this._memberFightCapacity != value) {
            this._memberFightCapacity = value;
        }
    }

    public get memberState(): Dictionary {
        return this._memberState;
    }

    public set memberState(value: Dictionary) {
        if (this._memberState != value) {
            this._memberState = value;
        }
    }

    public dispose() {
        this._allMembers = null;
    }

}