import GameEventDispatcher from '../../../../core/event/GameEventDispatcher';
import { t_s_leedtemplateData } from '../../../config/t_s_leedtemplate';
import { DayGuideEvent } from '../../../constant/event/NotificationEvent';
import { TempleteManager } from '../../../manager/TempleteManager';

/**
 * 每日引导数据
 * */
export default class LeedInfo extends GameEventDispatcher {
	public templateId: number = 0;
	public userId: number = 0;
	public beginDate: Date;
	public isComplete: boolean = false;
	private _currentCount: number = 0;

	public get finished(): number {
		if (this.isComplete) {
			return 1;
		}
		return -1;
	}

	public get templateInfo(): t_s_leedtemplateData {
		return TempleteManager.Instance.getLeedTemplateByID(this.templateId);
	}

	public get currentCount(): number {
		return this._currentCount;
	}
	public set currentCount(value: number) {
		if (this.templateInfo) {
			this._currentCount = value > this.templateInfo.PassCount ? this.templateInfo.PassCount : value;
			this.dispatchEvent(DayGuideEvent.LEEDINFO_CHANGE);
		} else {
			this._currentCount = 0;
		}
	}

	public get sort(): number {
		var temp: t_s_leedtemplateData = this.templateInfo;
		return temp ? temp.sort : 0;
	}

}