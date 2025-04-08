import { QQ_HALL_EVENT } from "../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { TempleteManager } from "../../manager/TempleteManager";
import FrameDataBase from "../../mvc/FrameDataBase";
import QQGiftEnum, { QQLevelEnum } from "./enum/QQGiftEnum";

import QQGiftBagState = com.road.yishi.proto.qq.QQGiftBagState;
export default class QQGiftModel extends FrameDataBase {

    cfgDaily = 'QQ_Dailygiftpackage'; //每日礼包配置
    cfgNewbie = 'QQ_Giftbagfornovices'; //新手礼包配置

    dailyGift: GoodsInfo[] = [];
    // levelGift: GoodsInfo[]; 
    newbieGift: GoodsInfo[] = [];
    levelGiftDic: any;
    qqGiftBagState: QQGiftBagState = null;
    curType: number = 1;

    constructor() {
        super();
    }


    setLevelGiftDic(data) {
        if (data) {
            this.levelGiftDic = [];
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    if(data[key].Gifttype == QQLevelEnum.QQ_HALL_LEVEL)
                        this.levelGiftDic.push(data[key]);
                }
            }
        }

        this.dailyGift = this.getRewards(this.getCfg(this.cfgDaily));
        this.newbieGift = this.getRewards(this.getCfg(this.cfgNewbie));
    }

    setInfo(info) {
        this.qqGiftBagState = info;
        this.dispatchEvent(QQ_HALL_EVENT.GIFT_CHANGE);
    }

    setCurType(type: number) {
        if (this.curType != type) {
            this.curType = type;
            this.dispatchEvent(QQ_HALL_EVENT.GIFT_TAB_CHANGE);
        }
    }

    getCurList() {
        if (this.curType == QQGiftEnum.DAILY_GIFT) {
            return this.dailyGift;
        } else if (this.curType == QQGiftEnum.NOVICES_GIFT) {
            return this.newbieGift;
        } else {
            return [];
        }
    }

    getLevelList() {
        return this.levelGiftDic;
    }

    /** 当前选中的类型 */
    getCurType() {
        return this.curType;
    }

    /**
     * 获取等级礼包的领取状态
     * @param grade 等级
     * @returns 
     */
    getLevelItemState(grade: number) {
        if (!this.qqGiftBagState) {
            return 1;
        }
        let myGrade = ArmyManager.Instance.thane.grades;
        // 领取过
        if (this.qqGiftBagState.gradeGifts.indexOf(grade) != -1) {
            return 2;
        } else {
            // 可领取
            if (myGrade >= grade) {
                return 0;
            } else {
                return 1;
            }
        }
    }


    getGiftType() {
        switch (this.curType) {
            case QQGiftEnum.DAILY_GIFT:
                return 3;
            case QQGiftEnum.NOVICES_GIFT:
                return 2;
            case QQGiftEnum.GRADES_GIFTS:
                return 4; 
            default:
                break;
        }
    }

    getCfg(cfg: string) {
        let configTemp = TempleteManager.Instance.getConfigInfoByConfigName(cfg);
        if (!configTemp) {
            return '';
        }
        return configTemp.ConfigValue;
    }

    getRewards(rewardStr: string) {
        let rewards: GoodsInfo[] = [];
        let rewardItem: string[] = rewardStr.split("|");
        let count = rewardItem.length;
        for (let i = 0; i < count; i++) {
            let tempStr = rewardItem[i];
            let infos = tempStr.split(",");
            let goods = new GoodsInfo();
            goods.templateId = Number(infos[0]);
            goods.count = Number(infos[1]);
            rewards.push(goods);
        }
        return rewards;
    }

    isRedDot() {
        let isRed = this.isRedDotByType(QQGiftEnum.DAILY_GIFT)
        || this.isRedDotByType(QQGiftEnum.NOVICES_GIFT)
        || this.isRedDotByType(QQGiftEnum.GRADES_GIFTS);
        return isRed;
    }

    isRedDotByType(type: number) {
        if (!this.qqGiftBagState) {
            return false;
        }
        switch (type) {
            case QQGiftEnum.DAILY_GIFT:
                return !this.qqGiftBagState.dailyGift;
            case QQGiftEnum.NOVICES_GIFT:
                return !this.qqGiftBagState.novicesGift;
            case QQGiftEnum.GRADES_GIFTS:
                return this.levelGiftDic.length != this.qqGiftBagState.gradeGifts.length; 
            default:
                break;
        }
        return false;
    }



}