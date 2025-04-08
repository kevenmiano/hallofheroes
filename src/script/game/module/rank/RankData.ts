// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-10 21:16:47
 * @LastEditTime: 2021-05-14 17:10:29
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import LangManager from "../../../core/lang/LangManager"
import { RankIndex } from "../../constant/RankDefine"
import FrameDataBase from "../../mvc/FrameDataBase"

export class RankItemData {
    constructor(datalist?: any[], icon?: string, iconBack?: string) {
        this.datalist = datalist ? datalist : []
        this.icon = icon ? icon : ""
        this.iconBack = iconBack ? iconBack : ""
    }
    datalist: any[]
    icon: string
    iconBack: string
    ext: any
}

export default class RankData extends FrameDataBase {
    public rankDatas: RankItemData[] = []
    public selfInfo: Object = {}
    public createDate: Date
    public static RankRes = ["Icon_1st_S", "Icon_2nd_S", "Icon_3rd_S"]

    show() {
        super.show()
    }

    hide() {
        super.hide()
    }

    dispose() {
        super.dispose()
        this.selfInfo = {}
        this.createDate = null
    }

    public getTitleDataByIndex(rankIndex: RankIndex): RankItemData {
        switch (rankIndex) {
            case RankIndex.RankItemR3:
            case RankIndex.RankItemR3_001:
            case RankIndex.RankItemR3_002:
                return new RankItemData([
                    LangManager.Instance.GetTranslation("public.rank"),
                    LangManager.Instance.GetTranslation("PvpHeroFrame.PlayerName"),
                    LangManager.Instance.GetTranslation("PvpSortListView.jifen")
                ])
            case RankIndex.RankItemR4:
            case RankIndex.RankItemR4_001:
                return new RankItemData([
                    LangManager.Instance.GetTranslation("public.rank"),
                    LangManager.Instance.GetTranslation("PvpHeroFrame.PlayerName"),
                    LangManager.Instance.GetTranslation("PlayerProfileWnd.levelTxt"),
                    LangManager.Instance.GetTranslation("public.playerInfo.ap"),
                ])
            case RankIndex.RankItemR5:
            case RankIndex.RankItemR5_001:
            case RankIndex.RankItemR5_002:
                return new RankItemData([
                    LangManager.Instance.GetTranslation("public.rank"),
                    LangManager.Instance.GetTranslation("PvpHeroFrame.PlayerName"),
                    LangManager.Instance.GetTranslation("PvpSortListView.serverName"),
                    LangManager.Instance.GetTranslation("PvpHeroFrame.Kill"),
                    LangManager.Instance.GetTranslation("PvpHeroFrame.Honor")
                ])
            default:
                break;
        }
    }

    public getTitleColorByIndex(rankIndex: RankIndex): Array<string> {
        switch (rankIndex) {
            case RankIndex.RankItemR3:
            case RankIndex.RankItemR3_001:
            case RankIndex.RankItemR3_002:
            case RankIndex.RankItemR4:
            case RankIndex.RankItemR4_001:
            case RankIndex.RankItemR5:
            case RankIndex.RankItemR5_001:
            case RankIndex.RankItemR5_002:
            default:
                return ["#ffc68f"];
                break;
        }
    }
}