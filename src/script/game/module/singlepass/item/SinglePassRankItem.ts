import FUI_SinglePassRankItem from "../../../../../fui/SinglePass/FUI_SinglePassRankItem";
import LangManager from '../../../../core/lang/LangManager';
import SinglePassOrderInfo from "../model/SinglePassOrderInfo";
import SinglePassModel from "../SinglePassModel";

export default class SinglePassRankItem extends FUI_SinglePassRankItem{
    private _info: SinglePassOrderInfo;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
       
    }

    public get info(): SinglePassOrderInfo {
        return this._info;
    }

    public set info(value: SinglePassOrderInfo) {
        this._info = value;
        if(this._info)
        {
            this.rankTxt.text = this._info.order.toString();
            this.nickNameTxt.text = this._info.nickName;
             let floor:number = parseInt(((this._info.index - 1) / SinglePassModel.TOLLGATE_PER_FLOOR).toString()) + 1;
			var tollgate:number = parseInt((this._info.index % SinglePassModel.TOLLGATE_PER_FLOOR).toString());
			if(tollgate == 0)
			{
				tollgate = SinglePassModel.TOLLGATE_PER_FLOOR;
			}
            this.layerDescTxt.text = LangManager.Instance.GetTranslation("singlepass.order.SinglePassOrderFrame.ItemTxt", SinglePassModel.FLOOR_STR[floor], tollgate);
        }
        else
        {
            this.rankTxt.text = "";
            this.nickNameTxt.text = "";
            this.layerDescTxt.text = "";
        }
    }

    dispose() {
        super.dispose();
    }
}