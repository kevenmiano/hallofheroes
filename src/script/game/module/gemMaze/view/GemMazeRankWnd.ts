import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../core/ui/UIManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import Utils from "../../../../core/utils/Utils";
import { EmWindow } from "../../../constant/UIDefine";
import { GemMazeManager } from "../../../manager/GemMazeManager";
import GemMazeOrderInfo from "../model/GemMazeOrderInfo";
import GemMazeRankItem from "./item/GemMazeRankItem";

/**
* @author:zhihua.zhou
* @data: 2022-05-18 18:40
* @description 夺宝奇兵排行榜
*/
export default class GemMazeRankWnd extends BaseWindow {
    private rankList: fgui.GList;
    private rankDatas:Array<GemMazeOrderInfo> = [];
    txt_week_pt:fairygui.GTextField;
    txt_rank:fairygui.GTextField;
    txt_time:fairygui.GTextField;
    txt1:fairygui.GTextField;
    txt2:fairygui.GTextField;
    txt3:fairygui.GTextField;
    RankTxt:fairygui.GTextField;
    txt_point:fairygui.GTextField;
    UserNameTxt:fairygui.GTextField;
    txt_lv:fairygui.GTextField;
    txt_reward:fairygui.GTextField;
    frame:fairygui.GComponent;

    /**初始化 */
    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();

        this.frame.getChild('helpBtn').visible = false;
        this.initLanguage();
    }

    initLanguage(){
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation('gemMaze.GemMazeSortFrame.title');
        this.txt1.text = LangManager.Instance.GetTranslation('MazeFrameWnd.MyOrderTxt');
        this.txt2.text = LangManager.Instance.GetTranslation('ConsortiaRankWnd.n16Txt');
        this.txt3.text = LangManager.Instance.GetTranslation('fish.FishFrame.scoreText')+': ';
        this.RankTxt.text = LangManager.Instance.GetTranslation('fish.FishSort.Titls');
        this.UserNameTxt.text = LangManager.Instance.GetTranslation('fish.FishSort.Name');
        this.txt_lv.text = LangManager.Instance.GetTranslation('gemMaze.GemMazeSort.Level');
        this.txt_point.text = LangManager.Instance.GetTranslation('gemMaze.GemMazeSort.Score');
        this.txt_reward.text = LangManager.Instance.GetTranslation('gemMaze.GemMazeSort.Appell');
    }

    OnShowWind() {
        super.OnShowWind();
        this.rankList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.rankList.setVirtual()
        let model = GemMazeManager.Instance.model;
        this.rankDatas = model.orderList;

        this.txt_week_pt.text = model.gemMazeInfo.weekScore.toString();
        if(model.gemMazeInfo.sort <1){
            this.txt_rank.text = LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
        }else
        {
            this.txt_rank.text = model.gemMazeInfo.sort.toString();
        }
       
        this.txt_time.text = DateFormatter.format(model.createDate, "MM-DD hh:mm");
        this.rankList.numItems = this.rankDatas.length;

    }

    private renderListItem(index: number, item: GemMazeRankItem) {
        if (!item) return;
        let itemData = this.rankDatas[index]
        item.setData(itemData);
    }

    /**关闭 */
    OnHideWind() {
        // this.rankList.itemRenderer.recover();
        Utils.clearGListHandle(this.rankList);
        this.rankDatas = null;
        super.OnHideWind();
    }
}