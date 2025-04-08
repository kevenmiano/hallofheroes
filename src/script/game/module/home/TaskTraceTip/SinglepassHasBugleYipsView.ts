import LangManager from "../../../../core/lang/LangManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import SpaceNodeType from "../../../map/space/constant/SpaceNodeType";
import { SwitchPageHelp } from "../../../utils/SwitchPageHelp";
import TaskTraceTipWnd from "./TaskTraceTipWnd";


export class SinglepassHasBugleYipsView extends TaskTraceTipWnd {

	constructor() {
		super();
	}

	initView() {
		super.initView();
		this.setContentText(this.data.content);
		let iconURL = this.data.goods.templateInfo.iconPath;
		this.setContentIcon(iconURL);
		this.setBtnTitle(LangManager.Instance.GetTranslation("taskTrace.SinglepassHasBugleYipsView.intoSinglePass"));
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		if (SceneManager.Instance.currentType == SceneType.CASTLE_SCENE || SceneManager.Instance.currentType == SceneType.SPACE_SCENE || SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE) {
			SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_SINGLE_PASS);
		} else {
			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("taskTrace.SinglepassHasBugleYipsView.TipInfo"));
		}
		TaskTraceTipManager.Instance.cleanByType(this.data.type);
	}
}