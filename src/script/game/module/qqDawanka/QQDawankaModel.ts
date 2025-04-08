import LangManager from "../../../core/lang/LangManager";
import t_s_qqgrade, { t_s_qqgradeData } from "../../config/t_s_qqgrade";
import t_s_qqgradeprivilege, { t_s_qqgradeprivilegeData } from "../../config/t_s_qqgradeprivilege";
import { QQ_HALL_EVENT } from "../../constant/event/NotificationEvent";
import FrameDataBase from "../../mvc/FrameDataBase";
import FUIHelper from "../../utils/FUIHelper";
import QQDawankaItemVO from "./item/QQDawankaItemVO";

import UserQQDaWanKaMsg = com.road.yishi.proto.qq.UserQQDaWanKaMsg;
import QQGradeGiftState = com.road.yishi.proto.qq.QQGradeGiftState;

export default class QQDawankaModel extends FrameDataBase {

    public gradeMap: Map<number, number> = new Map();
    /** 玩家当前等级 */
    playerGarde: number = 0;
    /** 玩家当前等级的名称 */
    playerGardeName: string = '';
    /** 玩家当前咖值 */
    playerDawankaValue: number = 0;

    /** 当前选中等级 */
    selectGrade: number = 1;

    /**
     * 大玩咖等级数据表
     */
    QQGradeDic: t_s_qqgradeData[] = [];

    /** 上面显示3个 */
    NUM_UP: number = 3;
    NUM_DOWN: number = 4;
    /**
     * 大玩咖等级特权数据表
     */
    QQGradePrivilegeDic: t_s_qqgradeprivilegeData[][] = [];
    RenderList: QQDawankaItemVO[][] = [];
    info: UserQQDaWanKaMsg = null;
    giftState: com.road.yishi.proto.qq.IQQGradeGiftState[];
    titleRedDotArrs: boolean[] = [false, false, false, false];

    constructor() {
        super();
        this.gradeMap.set(0, 3);
        this.gradeMap.set(1, 4);
        this.gradeMap.set(2, 1);
        this.gradeMap.set(3, 2);
    }

    setInfo(info: UserQQDaWanKaMsg) {
        this.info = info;
        this.playerGarde = info.level;
        this.playerDawankaValue = info.score;
        this.selectGrade = this.playerGarde > 0 ? this.playerGarde : 1;
        this.giftState = info.giftState;
        this.titleRedDotArrs = [false, false, false, false];
        for (let i = 0; i < this.giftState.length; i++) {
            this.titleRedDotArrs[i] = this.giftState[i].isPrivilege || this.giftState[i].isWeekGift;
        }

        this.dispatchEvent(QQ_HALL_EVENT.GARDE_CHANGE);
    }

    getTitleRedDotArrs() {
        return this.titleRedDotArrs;
    }

    isRedDot() {
        for (let i = 0; i < this.titleRedDotArrs.length; i++) {
            if (this.titleRedDotArrs[i]) {
                return true;
            }
        }
        return false;
    }


    setQQGradeDic(data) {
        this.QQGradeDic = data;
    }

    setQQGradePrivilegeDic(data: t_s_qqgradeprivilegeData[][]) {
        // this.QQGradePrivilegeDic = data;
        this.QQGradePrivilegeDic = [];
        let arrs = [];
        for (const i in data) {
            if (Object.prototype.hasOwnProperty.call(data, i)) {
                arrs = [];
                for (let j = 0; j < data[i].length; j++) {
                    //无此特权的删除
                    // if (data[i][j].Privilegetype > 2 && data[i][j].Para1 == -1) {
                    if (data[i][j].Para1 != -1) {
                        arrs.push(data[i][j]);
                    }
                }
                this.QQGradePrivilegeDic.push(arrs);
            }
        }

        this.setRenderList();
    }

    setRenderList() {
        let renderList = [];
        for (let i = 0; i < this.QQGradePrivilegeDic.length; i++) {
            const element = this.QQGradePrivilegeDic[i];

            let data = this.QQGradePrivilegeDic[i][0];
            let vo1 = new QQDawankaItemVO(data.Privilegetype, data.Privilegename, data.Para1, data.Para2);

            let vo2 = new QQDawankaItemVO(8, LangManager.Instance.GetTranslation('QQ.Hall.Dawanka.level8'));
            vo2.rewards = this.getQQGradeData(i + 1).Privilegereward;
            let vo3 = new QQDawankaItemVO(9, LangManager.Instance.GetTranslation('QQ.Hall.Dawanka.level9'));
            vo3.rewards = this.getQQGradeData(i + 1).Weekgiftbag;
            let renderList = [vo1, vo2, vo3];

            for (let j = 1; j < 5; j++) {
                let data = this.QQGradePrivilegeDic[i][j];
                let vo = new QQDawankaItemVO(data.Privilegetype, data.Privilegename, data.Para1, data.Para2);
                renderList.push(vo);
            }
            this.RenderList.push(renderList);
        }
    }

    getQQGradeData(grade: number): t_s_qqgradeData {
        if (this.QQGradeDic) {
            for (const key in this.QQGradeDic) {
                if (Object.prototype.hasOwnProperty.call(this.QQGradeDic, key)) {
                    let element = this.QQGradeDic[key];
                    if (element.Grade == grade) {
                        return this.QQGradeDic[grade]
                    }
                }
            }
        }
        return null;
    }

    /**
     * 通过等级获取特权数据
     * @param grade 等级
     * @returns 
     */
    getQQGradePrivilegeDataByGrade(grade: number) {
        return this.QQGradePrivilegeDic[grade];
    }

    setPlayerGarde(grade: number) {
        if (this.playerGarde != grade) {
            this.playerGarde = grade;
            this.dispatchEvent(QQ_HALL_EVENT.GARDE_CHANGE);
        }

    }

    getRenderList(up: boolean, index: number) {
        if (up) {
            return this.RenderList[this.selectGrade - 1][index];
        } else {
            return this.RenderList[this.selectGrade - 1][index + 3];
        }
    }

    /**
     * 通过等级获取等级名称
     * @param grade 等级
     * @returns 
     */
    getGradeNameByGrade(grade: number) {
        if (grade == 0) { //未解锁
            return LangManager.Instance.GetTranslation('QQ.Hall.Dawanka.notUnlock');
        }
        return this.getQQGradeData(grade).Name;
    }

    setPlayerDawankaValue(value: number) {
        this.playerDawankaValue = value;
        this.dispatchEvent(QQ_HALL_EVENT.GARDE_CHANGE);
    }

    setSelectGrade(grade: number) {
        if (grade != this.selectGrade) {
            this.selectGrade = grade;
            this.dispatchEvent(QQ_HALL_EVENT.TAB_CHANGE);
        }
    }

    getUnlock() {
        let playerGrade = this.getPlayerGarde();
        if(playerGrade <= 0) return false;
        let gradeIndex = this.getGradeIndex(this.selectGrade);
        let playerIndex = this.getGradeIndex(playerGrade);
        return gradeIndex <= playerIndex;
    }

    getGradeIndex(grade: number): number {
        let count = this.gradeMap.size;
        for (let index = 0; index < count; index++) {
            let element = this.gradeMap.get(index);
            if (Number(element) == grade) {
                return index;
            }
        }
        return 0;
    }

    getIndexGrade(index: number): number {
        if (this.gradeMap.has(index)) {
            return this.gradeMap.get(index);
        }
        return this.gradeMap.get(0);
    }

    /**
     * 暂未开放
     */
    getSoon(type: number, para2: number) {
        //玩咖圈子交流特权
        if (type == 6 && para2 == -1) {
            return true;
        } else {
            return false;
        }
    }

    getNUM_UP() {
        return this.NUM_UP;
    }

    getSelectGrade() {
        return this.selectGrade;
    }

    /**
     * 获取玩家当前等级
     * @returns 
     */
    getPlayerGarde() {
        return this.playerGarde;
    }

    /**
     * 获取玩家咖值
     * @returns 
     */
    getPlayerDawankaValue() {
        return this.playerDawankaValue;
    }

    // 1	充值加赠特权 1
    // 2	游券礼包特权 5
    // 3	生日特权 7
    // 4	专属客服 8
    // 5	充值共享特权 3
    // 6	玩咖交流圈子特权 6
    // 7    高阶玩咖特权 4
    // 8    绝版专享特权 5
    // 9    专属周礼特权 2
    getIconByType(type: number) {
        let arrs = [1, 5, 7, 8, 3, 6, 4, 5, 2];
        return FUIHelper.getItemURL("QQDawanka", "Iocn_0" + arrs[type - 1]);
    }

    /**
     * 是否可领取
     * @param type 类型 0:周礼包【每周可领取当前等级, 首次升级可领取等级以下】, 1:绝版专属礼包【终身只可购买一次】
     */
    getGiftState(type: number) {
        if (this.giftState) {
            for (let i = 0; i < this.giftState.length; i++) {
                let state = this.giftState[i];
                if (this.selectGrade == state.grade) {
                    return type == 0 ? state.isWeekGift : state.isPrivilege;
                }
            }
        }
        return false;
    }

    getArrs() {

    }

}