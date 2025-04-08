/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-10 21:16:56
 * @LastEditTime: 2024-03-08 11:13:54
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import LangManager from "../../../core/lang/LangManager"
import Logger from "../../../core/logger/Logger"
import ByteArray from "../../../core/net/ByteArray"
import ResMgr from "../../../core/res/ResMgr"
import { DateFormatter } from "../../../core/utils/DateFormatter"
import XmlMgr from "../../../core/xlsx/XmlMgr"
import { t_s_honorequipData } from "../../config/t_s_honorequip"
import { RankIndex } from "../../constant/RankDefine"
import { MessageTipManager } from "../../manager/MessageTipManager"
import { PathManager } from "../../manager/PathManager"
import { PlayerManager } from "../../manager/PlayerManager"
import { TempleteManager } from "../../manager/TempleteManager"
import FrameCtrlBase from "../../mvc/FrameCtrlBase"
import { RankItemData } from "./RankData"

export default class RankCtrl extends FrameCtrlBase {
    public rankIndex: RankIndex = RankIndex.RankItemR3
    public get rankItemType() {
        return Number(String(this.rankIndex).substring(0, 2))
    }

    protected initDataPreShow() {
        super.initDataPreShow()
        if (this.frameData && this.frameData.rankIndex) {
            this.rankIndex = this.frameData.rankIndex
        }
    }

    protected clearDataPreHide() {
        super.clearDataPreHide()
    }

    /**
     * 外部直接调用刷新数据
     * @param data 
     */
    public setRankData(data: any, selfInfo?: any) {
        this.data.rankDatas = data
        this.data.selfInfo = selfInfo
        this.view.refresh()
    }

    public initRankData() {
        let path: string
        switch (this.rankIndex) {
            case RankIndex.RankItemR4_001:
                MessageTipManager.Instance.show("排行榜统一改为读取json, 服务器缺少对应json文件，解析逻辑需要修改")
                // ResMgr.Instance.loadRes(PathManager.challengPath, this.__RankItemR4_001.bind(this), null, Laya.Loader.BUFFER)
                break;
            case RankIndex.RankItemR5_001:
                ResMgr.Instance.loadRes(PathManager.crossOrderPath, this.__RankItemR5_001.bind(this), null, Laya.Loader.BUFFER)
                break;
            default:
                break;
        }
    }

    /**
     * pvp英雄榜 去掉了TODO改为json
     * @param res 
     */
    private __RankItemR4_001(res: any) {
        if (res) {
            let rankData: any = XmlMgr.Instance.decode(res);
            let rankArray: any[];
            if (rankData && rankData.list && rankData.list.item) {
                rankArray = rankData.list.item;
            }
            if (!rankArray) return

            this.data.rankDatas = []
            for (let i: number = 0; i < rankArray.length; i++) {
                let itemData: any = rankArray[i];
                let orderInfo: RankItemData = new RankItemData();
                orderInfo.datalist[0] = itemData.curRank;
                orderInfo.datalist[1] = itemData.nickName;
                orderInfo.datalist[2] = itemData.grades;
                orderInfo.datalist[3] = itemData.fightingCapacity;
                this.data.rankDatas.push(orderInfo);
            }
            this.view.refresh()
        }
    }

    /**
     * pvp跨服英雄榜
     * @param res 
     */
    private __RankItemR5_001(res: any) {
        let contentStr: string = "";
        let dataObj = null;
        
        if (res) {
            try {
                let content: ByteArray = new ByteArray();
                content.writeArrayBuffer(res);
                if (content && content.length) {
                    content.position = 0;
                    content.uncompress();
                    contentStr = content.readUTFBytes(content.bytesAvailable);
                    content.clear();
                }
            } catch (error) {
                Logger.error('RankCtrl __RankItemR5_001 Error');
                return;
            }
            dataObj = JSON.parse(contentStr);
            let rankArray: any[];
            if (dataObj && dataObj.CrossScoreTotalAdds && dataObj.CrossScoreTotalAdds.CrossScoreTotalAdd) {
                rankArray = dataObj.CrossScoreTotalAdds.CrossScoreTotalAdd;
            }
            if (!rankArray) return

            let selfRank = -1;
            this.data.rankDatas = [];
            let maxCount = 20;//最多数量限制
            for (let i: number = 0; i < rankArray.length; i++) {
                let itemData: any = rankArray[i];
                if (itemData.nikcName == this.playerInfo.nickName &&
                    itemData.site == this.playerInfo.site &&
                    itemData.userid == this.playerInfo.userId.toString()) {
                    selfRank = itemData.orderId;
                }

                let orderInfo: RankItemData = new RankItemData();
                orderInfo.datalist[0] = itemData.orderId;
                orderInfo.datalist[1] = itemData.nikcName;
                orderInfo.datalist[2] = LangManager.Instance.GetTranslation("sort.serverName", String(itemData.serverId));
                orderInfo.datalist[3] = itemData.weekScore;

                let cfg: t_s_honorequipData = TempleteManager.Instance.geHonorCfgByType(1, itemData.honorEquipStage);
                let honorequipname = cfg ? cfg.HonorequipnameLang : "";

                orderInfo.datalist[4] = honorequipname;
                if (this.data.rankDatas.length < maxCount) {
                    this.data.rankDatas.push(orderInfo);
                }
            }

            if (dataObj && dataObj.CrossScoreTotalAdds && dataObj.CrossScoreTotalAdds.info) {
                this.data.createDate = DateFormatter.parse(dataObj.CrossScoreTotalAdds.info.createDate, "YYYY-MM-DD hh:mm:ss");
                this.data.createDate.setHours(3, 0, 0, 0);
                this.data.selfInfo.time = this.data.createDate ? DateFormatter.format(this.data.createDate, "MM-DD hh:mm") : "";
            }

            if (selfRank == -1) {
                this.data.selfInfo.rank = LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
            } else {
                this.data.selfInfo.rank = selfRank.toString();
            }
            this.data.selfInfo.score = String(this.playerInfo.crossScore)

            this.view.refresh()
        }
    }

    public get playerInfo() {
        return PlayerManager.Instance.currentPlayerModel.playerInfo
    }
}