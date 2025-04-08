import GameEventDispatcher from '../../core/event/GameEventDispatcher';
import { ServerDataManager } from '../../core/net/ServerDataManager';
import { S2CProtocol } from '../constant/protocol/S2CProtocol';
import { PackageIn } from '../../core/net/PackageIn';

import BoxMsg = com.road.yishi.proto.box.BoxMsg;
import Dictionary from '../../core/utils/Dictionary';
import { TempleteManager } from './TempleteManager';
import { ThaneInfo } from '../datas/playerinfo/ThaneInfo';
import { ArmyManager } from './ArmyManager';
import { PlayerInfo } from '../datas/playerinfo/PlayerInfo';
import { PlayerManager } from './PlayerManager';
import { TimeBoxEvent } from '../constant/event/NotificationEvent';
import { ArrayUtils, ArrayConstant } from '../../core/utils/ArrayUtils';
/**
* @author:pzlricky
* @data: 2021-07-26 14:34
* @description *** 
*/
export default class BoxManager extends GameEventDispatcher {

    private static _instance: BoxManager;
    public static get Instance(): BoxManager {
        if (this._instance == null) this._instance = new BoxManager();
        return this._instance;
    }

    private _timeBoxList: Array<any> = []; //时间宝箱的时长数组
    private _gradeBoxList: Array<any> = []; //等级宝箱的等级

    public get gradeBoxList(): Array<any> {
        return this._gradeBoxList;
    }

    public setup() {
        this.initTemplate();
        this.initEvent();
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_PLAYER_TIME, this, this.__getHaveTimeBox);
    }

    private __getHaveTimeBox(pkg: PackageIn) {
        var msg: BoxMsg = pkg.readBody(BoxMsg) as BoxMsg;
        this.playerInfo.timeProgress = msg.time;
        this.playerInfo.timeGet = msg.operate;
        this.playerInfo.timeRun = msg.timerun;
        this.dispatchEvent(TimeBoxEvent.UPDATE_TIME_BOX);
    }

    private initTemplate() {
        // var noviceTemplateList: Dictionary = TempleteManager.Instance.noviceboxTemplateCate.getTemplates();
        // for (const key in noviceTemplateList) {
        //     if (Object.prototype.hasOwnProperty.call(noviceTemplateList, key)) {
        //         let element = noviceTemplateList[key];
        //         this._gradeBoxList.push(parseInt(key));
        //     }
        // }
        // this._gradeBoxList = ArrayUtils.sortOn(this._gradeBoxList,[],[ArrayConstant.NUMERIC]);

        // var timeTemplateList: Dictionary = TempleteManager.Instance.timeBoxTemplateCate.getTemplates();
        // for (const key in timeTemplateList) {
        //     if (Object.prototype.hasOwnProperty.call(timeTemplateList, key)) {
        //         let element = timeTemplateList[key];
        //         this._timeBoxList.push(parseInt(key));
        //     }
        // }
        // this._timeBoxList = ArrayUtils.sortOn(this._timeBoxList,[],[ArrayConstant.NUMERIC]);
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    /**
     * 判断该等级是否已经领取 
     * @param grade
     * @return 
     * 
     */
    public isRecviedByGrade(grade: number): boolean {
        var progress: number = PlayerManager.Instance.currentPlayerModel.playerInfo.gradeProcess;
        if ((progress >> grade & 1) == 1) return true;
        return false;
    }

    public isCanRecviByGrade(grade: number): boolean {
        return grade <= this.thane.grades;
    }

    public getGradeTempByGrade(grade: number):any {
        // return TempleteManager.Instance.noviceboxTemplateCate.getTemplatesByGrade(grade)[0] as BoxTemplateInfo;
    }

    public getGradeBoxGoodsByGrade(grade: number): Array<any> {
        // var list: Array<BoxTemplateInfo> = [];
        // var arr: Array<BoxTemplateInfo> = TempleteManager.Instance.noviceboxTemplateCate.getTemplatesByGrade(grade);
        // for (const key in arr) {
        //     if (Object.prototype.hasOwnProperty.call(arr, key)) {
        //         var temp: BoxTemplateInfo = arr[key];
        //         if (temp.Job == this.thane.templateInfo.Job) {
        //             list.push(temp);
        //         }
        //     }
        // }
        return [];
        // return list;
    }


    ////////////////
    private _remainTime: number;
    public get remainTime(): number {
        return this._remainTime;
    }
    public set remainTime(value: number) {
        this._remainTime = value;
        if (this._remainTime == 0)
            this.dispatchEvent(TimeBoxEvent.TIME_COMPLETE);
    }

    /**
     * 获取当前计时的时间按段 
     * @return 
     * 
     */
    public getCurrentTimePeriod(): number {
        if (this.playerInfo.timeProgress == 0) return Number(this._timeBoxList[0]);
        for (var i: number = 0; i < this._timeBoxList.length; i++) {
            var time: number = Number(this._timeBoxList[i]);
            if (time == this.playerInfo.timeProgress) {
                if (this.playerInfo.timeGet)
                    return Number(this._timeBoxList[i + 1]);
                else
                    return time;
            }
        }
        return Number(this._timeBoxList[0]);
    }
    /**
     * 是否存在时间宝箱 
     * @return 
     * 
     */
    public get needCountTime(): boolean {
        //			var isAASOpen:boolean=ConfigManager.info.AAS;
        //			if(isAASOpen)return false;
        if (!this.playerInfo.timeGet)
            return this.playerInfo.timeProgress <= Number(this._timeBoxList[this._timeBoxList.length - 1]);
        else
            return this.playerInfo.timeProgress < Number(this._timeBoxList[this._timeBoxList.length - 1]);
    }

    public get timeBoxList(): Array<any> {
        return this._timeBoxList;
    }
    public get nextTimePeriod(): number {
        var len: number = this._timeBoxList.length;
        var currentIndex: number;
        for (var i: number = 0; i < len; i++) {
            if (this.playerInfo.timeProgress == Number(this._timeBoxList[i])) {
                if (i + 1 < len)
                    return this._timeBoxList[i + 1];
                return -1;
            }
        }
        return -1;
    }

}