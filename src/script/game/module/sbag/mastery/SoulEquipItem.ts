import FUI_SoulEquipItem from "../../../../../fui/Base/FUI_SoulEquipItem";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import { t_s_extrajobequipData } from "../../../config/t_s_extrajobequip";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { CommonConstant } from "../../../constant/CommonConstant";
import { ConfigType } from "../../../constant/ConfigDefine";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../tips/ITipedDisplay";
import { ExtraJobEquipItemInfo } from "../../bag/model/ExtraJobEquipItemInfo ";
import ExtraJobModel from "../../bag/model/ExtraJobModel";
/**
 * 魂器
 */
export class SoulEquipItem extends FUI_SoulEquipItem implements ITipedDisplay {
    
    extData: any;
    tipData: any;
    tipType: EmWindow;
    canOperate: boolean = false;
    showType: TipsShowType = TipsShowType.onClick;
    startPoint: Laya.Point = new Laya.Point(0, 0);
    
    public constructor() {
        super();
    }

    setData(data:ExtraJobEquipItemInfo,isLookOther:boolean=false){
        if(data.equipLevel> 0){
            this.txt_stage.text = LangManager.Instance.GetTranslation('mounts.command01',data.equipLevel);
            this.c1.selectedIndex = 1;
            this.reddot.visible = false;
            this.initInlay(data);
        }else{
            this.c1.selectedIndex = 0;
            if(!isLookOther){
                //是否可激活
                let cfg = TempleteManager.Instance.getExtrajobEquipCfg(data.equipType,1) as t_s_extrajobequipData;
                if(cfg){
                    //是否可以解锁
                    if(ExtraJobModel.instance.totalLevel >= cfg.NeedTotalJobLevel){
                        this.reddot.visible = true;
                    }
                }
            }
        }
        if(data.strengthenLevel > 0){
            this.txt_stren.text = '+'+data.strengthenLevel;
        }
        let url = "Icon_Mastery_Horcrux_"+data.equipType;
        this.iconLoader.url = fgui.UIPackage.getItemURL(EmPackName.Base, url);
        ToolTipsManager.Instance.register(this);
        this.tipType = EmWindow.SoulEquipTip;
        if(isLookOther){//查看资料不可以操作
            this.tipData = [data,false];
        }else{
            this.tipData = data;
        }
    }

    private initInlay(info: ExtraJobEquipItemInfo) {
        let index: number = 1;
        let key: string;
        this.clearInlayItem();
        // if (info.id == 0) {
        //     for (index = 1; index <= 4; index++) {
        //         key = "inlayItem" + index;
        //         if (this.hasOwnProperty(key) && this[key] != null) {
        //             (this[key] as fgui.GLoader).url = fgui.UIPackage.getItemURL("Base", CommonConstant.GEM_ITEMS_RES[10]);
        //             (this[key] as fgui.GLoader).visible = true;
        //         }
        //     }
        // }
        // else {
            for (index = 1; index <= 4; index++) {
                key = "inlayItem" + index;
                if (this.hasOwnProperty(key) && this[key] != null) {
                    let value = info["join" + index];
                    let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, value);
                    (this[key] as fgui.GLoader).url = fgui.UIPackage.getItemURL("Base", CommonConstant.GEM_ITEMS_RES[value == -1 ? 9 : value == 0 ? 10 : temp.Property1]);
                    if (info["join" + index] != -1) {
                        (this[key] as fgui.GLoader).visible = true;
                    }
                }
            }
        // }
    }

    private clearInlayItem() {
        let key: string;
        for (let index = 1; index <= 4; index++) {
            key = "inlayItem" + index;
            (this[key] as fgui.GLoader).url = "";
            (this[key] as fgui.GLoader).visible = false;
        }
    }
}