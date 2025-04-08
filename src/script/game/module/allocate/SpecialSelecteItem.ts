import LangManager from '../../../core/lang/LangManager';
import { IconFactory } from '../../../core/utils/IconFactory';
import Utils from '../../../core/utils/Utils';
import { t_s_specialtemplateData } from '../../config/t_s_specialtemplate';
import { NotificationEvent } from '../../constant/event/NotificationEvent';
import { ArmyPawn } from '../../datas/ArmyPawn';
import { NotificationManager } from '../../manager/NotificationManager';
import { TempleteManager } from '../../manager/TempleteManager';

export default class SpecialSelectedItem extends fgui.GComponent
{
    private playerCom: fgui.GLoader;//兵种头像
    private NameTxt1: fgui.GLabel;
    private NameTxt2: fgui.GLabel;
    private NameTxt3: fgui.GLabel;
    private Btn_select:fgui.GButton;
    private _vData:ArmyPawn;
    protected onConstruct() {
        this.playerCom = this.getChild('playerCom').asLoader;
        this.NameTxt1 = this.getChild('NameTxt1').asLabel;
        this.NameTxt2 = this.getChild('NameTxt2').asLabel;
        this.NameTxt3 = this.getChild('NameTxt3').asLabel;
        this.Btn_select = this.getChild('Btn_select').asButton;
        Utils.setDrawCallOptimize(this);
    }

    public set vData(value:ArmyPawn)
    {
        this._vData = value;
        this.refreshView();
        this.addEvent();
    }

    public set selected(flag:boolean)
    {
        this.Btn_select.selected = flag;
    }

    public getSelectBtn():fgui.GButton
    {
        return this.Btn_select;
    }

    public get vData():ArmyPawn
    {
        return this._vData;
    }

    private refreshView()
    {
        this.playerCom.url = IconFactory.getSoldierIconByIcon(this._vData.templateInfo.Icon);
        var tempInfo: t_s_specialtemplateData = TempleteManager.Instance.getPawnSpecialTemplateByID(parseInt(this._vData.specialAbility));
        if(tempInfo)
        {
            this.NameTxt1.text = tempInfo.TemplateNameLang;
            this.NameTxt2.text = LangManager.Instance.GetTranslation("public.level2", tempInfo.Grades);
        }
        this.NameTxt3.text = this._vData.templateInfo.PawnNameLang;
    }

    private addEvent()
    {
        this.Btn_select.onClick(this, this.onBtnSelectClick.bind(this));
    }

    private removeEvent()
    {
        this.Btn_select.offClick(this, this.onBtnSelectClick.bind(this));
    }

    private  onBtnSelectClick()
    {
        NotificationManager.Instance.dispatchEvent(NotificationEvent.UPDATE_SPECIALSELECTITEM,this.vData,this.Btn_select.selected);
    }

    public dispose() {
        this.removeEvent();
        super.dispose();
       
    }
    
}