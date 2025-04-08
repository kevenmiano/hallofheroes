// @ts-nocheck

export class VipInfo {
	//结束时间
	public ExpirData: Date;
	//能否领取VIP周礼包
	public IsTakeGift: boolean = false;
	//vip类型(0为普通VIP 1为黄金VIP)
	public VipType: number = 0;
	//vip经验
	public VipGp: number = 0;
	//vip等级
	public _VipGrade: number = 0;
	//下次领取时间
	public takeGiftDate: Date;
	private _IsVipAndNoExpirt: boolean = false;
	//能否领取每日礼包
	public IsDayGift: boolean = false;

	//每日礼包上次领取时间
	public dayGiftTime: Date;

	//能否领取免费礼包
	public isFreeGift = 5;
	//能否领取付费礼包
	public isPayGift = 6;
	//能否领取buff
	public isGainBuff: boolean = false;
	//上次buff领取时间
	public buffGainTime: number | Long = 0;
	//buff过期时间
	public buffEndTime: number | Long = 0;

	public giftState: VipGiftState[] = [];

	public get MaxGrade(): number {
		// return Math.floor(TempleteManager.Instance.getConfigInfoByConfigName("VIP_MAX_GRADE").ConfigValue);
		return 9;
	}

	public get VipGrade(): number {
		if (this._VipGrade) {
			return this._VipGrade;
		}
		return 0;
	}

	public set VipGrade(value: number) {
		this._VipGrade = value;
	}

	/**
	 * 是否vip
	 * @constructor
	 */
	get IsVipAndNoExpirt(): boolean {
		return this._VipGrade > 0;
	}

	set IsVipAndNoExpirt(value: boolean) {
		this._IsVipAndNoExpirt = value;
	}

}

export class VipGiftState {
	public vip_grade: number = 1;        //vip等级
	public dayGiftState: number = 0;		 //每日礼包状态 0:不可领取 1:可领取 2:当天已领取过了
	public dayGiftTime: number | Long = 0;	 //每日礼包上次领取时间
	public isFreeGift: boolean = false;	//能否领取免费礼包
	public isPayGift: boolean = false;	//能否领取付费礼包
}