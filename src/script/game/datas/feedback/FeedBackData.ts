export default class FeedBackData {
	public id: string;    //充值/消费活动ID
	public startTime: number;    //开始日期
	public endTime: number;    //结束日期
	public type: number;       //活动类型（1.充值、2.消费）
	public userPoint: number;       //用户在活动期间充值/消费钻石数目

}