
import FUI_SAppellCellItem from "../../../../../fui/SBag/FUI_SAppellCellItem";
import { t_s_appellData } from "../../../config/t_s_appell";
import AppellManager from "../../../manager/AppellManager";
import AppellSocketOutManager from "../../../manager/AppellSocketOutManager";

/**
 * 称号渲染单元格
 */
export default class SAppellCellItem extends FUI_SAppellCellItem {

    private _cellData: t_s_appellData = null;
    private _index: number;
    // public isShowDetail: boolean = false;

    onConstruct() {
        super.onConstruct();
        this.Btn_Equipon.onClick(this, this.onEquipTitle);
        this.Btn_Equipoff.onClick(this, this.offEquipTitle);
    }

    public set index(index: number) {
        this._index = index;
    }

    
    public get cellData() : t_s_appellData {
        return this._cellData
    }
    
    public set itemData(value: t_s_appellData) {
        this._cellData = value;
        this.bg.getChild('appellTitle').text = value.TitleLang;
        this.bg.getChild('appellDes').text = value.DescriptLang;
        if (!value.isGet) {
            this.bg.grayed = true;
            // this.enabled = !this.grayed;
            if (AppellManager.Instance.model.needShowProgress(value.CondtionType)) {
                this.bg.getChild('progress').text = value.getProgress();// "(" + _data.progress + " / " + _data.Para + ")";
                this.bg.getChild('appellDes').width=300;
                this.bg.getChild('progress').text = value.getProgress();// "(" + _data.progress + " / " + _data.Para + ")";      
            } else {
                this.bg.getChild('appellDes').width=380;
                this.bg.getChild('progress').text = ""
            }
            this.c1.selectedIndex = 0;
        } else {
            this.bg.grayed = false;
            // this.enabled = !this.grayed;
            this.bg.getChild('appellDes').width=380;
            this.bg.getChild('progress').text = "";
            this.c1.selectedIndex = this._cellData.isEquiped ? 2 : 1;
        }
        // ToolTipsManager.Instance.register(this.Btn_Preview);
        // this.Btn_Preview.startPoint = new Laya.Point(0, 0);
        // this.Btn_Preview.tipData = value;
        // this.Btn_Preview.visible = value.Perfix != "";
    }

    updateState(){
        if (!this._cellData.isGet) {
            this.c1.selectedIndex = 0;
        }else{
            this.c1.selectedIndex = this._cellData.isEquiped ? 2 : 1;
        }
    }
        
    /**
     * 装备称号
     */
    private onEquipTitle(evt) {
        if (!this._cellData) return;
        AppellSocketOutManager.exchangeAppell(this._cellData.TemplateId);
        evt.stopPropagation();
    }

        /**
     * 卸下称号
     * @param evt 
     * @returns 
     */
    private offEquipTitle(evt) {
        if (!this._cellData) return;
        AppellSocketOutManager.exchangeAppell(0);
        evt.stopPropagation();
    }

    dispose() {
        this.Btn_Equipon.offClick(this, this.onEquipTitle);
        this.Btn_Equipoff.offClick(this, this.offEquipTitle);
        super.dispose();
    }

}

