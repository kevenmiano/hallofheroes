// @ts-nocheck
import FUI_GemMazeRankItem from "../../../../../../fui/GemMaze/FUI_GemMazeRankItem";
import { t_s_appellData } from "../../../../config/t_s_appell";
import { EmPackName, EmWindow } from "../../../../constant/UIDefine";
import { TempleteManager } from "../../../../manager/TempleteManager";
import FUIHelper from "../../../../utils/FUIHelper";
import GemMazeOrderInfo from "../../model/GemMazeOrderInfo";

/**
 * 夺宝奇兵积分宝箱组件
 */
 export default class GemMazeRankItem extends FUI_GemMazeRankItem{
    

    protected onConstruct() {
        super.onConstruct();
    }

    setData(data:GemMazeOrderInfo){
        this.setRankValue(data.order);
        this.txt_name.text = data.nickName;
        this.txt_lv.text = data.gemMazeGrades+'';
        this.txt_point.text = data.score+'';
    }

    /**设置排行值 */
    setRankValue(rank: number = 0) {
        if (rank > 0 && rank <= 3) {
            this.txt_rank.text = "";
            let iconUrl = this.getIconName(rank);
            this.rankIcon.url = FUIHelper.getItemURL(EmPackName.Base, iconUrl);

            let id = 102 + rank;
            let appellData:t_s_appellData = TempleteManager.Instance.getAppellInfoTemplateByID(id);
            if(appellData){
                this.txt_reward.text = appellData.TitleLang;
            }
            this.rankIcon.visible = true;
        } else {
            this.txt_rank.text = rank.toString();
            this.txt_reward.text = '';
            this.rankIcon.visible = false;
        }
    }

    getIconName(rank: number): string {
        let value = "";
        switch (rank) {
            case 1:
                value = "Icon_1st_S";
                break;
            case 2:
                value = "Icon_2nd_S";
                break;
            case 3:
                value = "Icon_3rd_S";
                break;

            default:
                break;
        }
        return value;
    }

}