import FUI_HeroInfoView from "../../../../../../fui/BaseCommon/FUI_HeroInfoView";


/**
 * 玩家头顶信息栏
 * @author pzlricky
 */
export default class HeroInfoView extends FUI_HeroInfoView {

     onConstruct() {
        super.onConstruct();
    }

    /**公会名称 */
    public set consortiaTxt(value: string) {
        this.consortia.text = value;
    }

    /**玩家昵称*/
    public set npcName(value: string) {
        this.userName.text = value;
    }

    /**称号 */
    public set appellID(value: number) {
        if (value == 0) {

        } else {

        }
    }

    clear() {
        this.consortia.text = "";
        this.isVip.selectedIndex = 0;
    }

    dispose() {

    }
}