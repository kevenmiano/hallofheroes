import { SocketManager } from '../../../core/net/SocketManager';
import { t_s_vipprerogativetemplateData } from '../../config/t_s_vipprerogativetemplate';
import { C2SProtocol } from '../../constant/protocol/C2SProtocol';
import { TempleteManager } from '../../manager/TempleteManager';
import FrameCtrlBase from '../../mvc/FrameCtrlBase';
import StringUtils from '../../utils/StringUtils';
import PrivilegeItemData from './PrivilegeItemData';

import OpenGiftReq = com.road.yishi.proto.vip.OpenGiftReq;

/**
 * Vip特权
 */
export default class VipPrivilegeCtrl extends FrameCtrlBase {

    private listData: PrivilegeItemData[] = null;    
    public getListData() {
        if (this.listData) return this.listData;
        this.listData = [];
        let cfglist = TempleteManager.Instance.getPrivilegeTempletes();
        let templist: Map<number, t_s_vipprerogativetemplateData[]> = new Map();
        let count = cfglist.length;
        for (let index = 0; index < count; index++) {
            let element = cfglist[index];
            let grade = element.grade;
            if (element.para1 != 0) {
                if (!templist.get(grade)) {
                    templist.set(grade, []);
                }
                let list = templist.get(grade);
                list.push(element);
                templist.set(grade, list);
            }
        }

        let list = this.listData;
        templist.forEach(item => {
            let vo = new PrivilegeItemData();
            item.sort((item1, item2) => {
                if (item1.para2 > item2.para2) {
                    return 1;
                } else if (item1.para2 < item2.para2) {
                    return -1
                } else {
                    return 0;
                }
            })
            for (let index = 0; index < item.length; index++) {
                let element = item[index];
                vo.grade = element.grade;
                let namedes = StringUtils.stringFormat2(element.nameLang, { key: "para2", value: element.para2 }, { key: "para1", value: element.para1 })
                vo.des += `[color=${this.getItemColor(element.para3)}]` + namedes + "[/color]<br>";
                vo.count += 1;
            }
            list.push(vo);
        });
        list.sort((item1: PrivilegeItemData, item2: PrivilegeItemData) => {
            if (item1.grade > item2.grade) {
                return 1;
            } else if (item1.grade < item2.grade) {
                return -1
            } else {
                return 0;
            }
        })

        return this.listData;
    }

    /**
     * 获取VIP礼包
     * @param type   请求类型 -1为每日免费礼包, 0时为免费礼包【终身只可领取一次】, 1为付费礼包【终身只可购买一次】 2:每天专属BUFF
     * @param grade  领取等级 礼包时有效
     */
    public openGiftReq(type: number = -1, grade: number = 1) {
        let msg: OpenGiftReq = new OpenGiftReq();
        msg.type = type;
        msg.grade = grade;
        SocketManager.Instance.send(C2SProtocol.C_VIP_OPEN_GIFT, msg);
    }

    private getItemColor(value: string) {
        switch (parseInt(value)) {
            case 0:
                return "#FFC68F"
            case 1:
                return "#00F0FF";
            default:
                return "#FFC68F"
        }
    }

}