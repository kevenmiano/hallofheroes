import { CampaignManager } from '../../../manager/CampaignManager';
import { TaskTraceTipManager } from '../../../manager/TaskTraceTipManager';
import TaskTraceTipWnd from './TaskTraceTipWnd';
import UIManager from '../../../../core/ui/UIManager';
import { EmWindow } from '../../../constant/UIDefine';
import BuildingType from '../../../map/castle/consant/BuildingType';
import BuildingManager from '../../../map/castle/BuildingManager';
import LangManager from '../../../../core/lang/LangManager';
import { WorldBossHelper } from '../../../utils/WorldBossHelper';
import { FrameCtrlManager } from '../../../mvc/FrameCtrlManager';


export class AddPawnTipView extends TaskTraceTipWnd {

	initView() {
		super.initView();
		let content = this._data.content;
		this.setContentText(content);
		this.setBtnTitle(LangManager.Instance.GetTranslation("tasktracetip.view.AddPawnTipView.txt"));
	}

	protected __btnHandler(e: Event) {
		super.__btnHandler(e);
		if (CampaignManager.Instance.mapModel && WorldBossHelper.checkIsNoviceMap(CampaignManager.Instance.mapModel.mapId)) {//新手
			TaskTraceTipManager.Instance.cleanByType(this.data.type);
		} else {
			FrameCtrlManager.Instance.open(EmWindow.CasernWnd, BuildingManager.Instance.model.getBuildingInfoBySonType(BuildingType.CASERN));
			TaskTraceTipManager.Instance.cleanByType(this.data.type);
		}
	}

	check(): boolean {
		return false;
	}

}