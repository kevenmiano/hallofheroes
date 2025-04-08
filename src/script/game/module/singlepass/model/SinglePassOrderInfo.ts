// @ts-nocheck

export default class SinglePassOrderInfo {
	public userId: number = 0;
	public job: number = 0;
	public nickName: string = "";
	public consortiaName: string = "";
	public grades: number = 0;
	public order: number = 0;
	public index: number = 0;
	public fightingCapacity: number = 0;
	public isVip: boolean = false;
	public vipType: number = 0;

	public selected: boolean = false;


	public getCellHeight(): number {
		return 38;
	}
}