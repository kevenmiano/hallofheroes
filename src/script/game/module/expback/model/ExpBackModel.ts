import FrameDataBase from "../../../mvc/FrameDataBase";

export default class ExpBackModel extends FrameDataBase{
    public freeExpValue:number = 0;//免费找回经验
    public freeGoldValue:number = 0;//免费找回黄金
    public openState:number = 0//开启状态 0:关闭 1:免费找回 2:可额外找回 3:已全部找回(关闭)
    public extraExpValue:number = 0//额外找回经验
    public extraGoldValue:number = 0//额外找回黄金
    private static _instance: ExpBackModel;
    constructor() {
        super();
    }

    public static get instance(): ExpBackModel {
		if (!ExpBackModel._instance) ExpBackModel._instance = new ExpBackModel();
		return ExpBackModel._instance;
	}
}