import { t_s_consortiabossData } from "../../../config/t_s_consortiaboss";
import { TempleteManager } from "../../../manager/TempleteManager";
import ConsortiaBossUserInfo from "./ConsortiaBossUserInfo";

export default class ConsortiaBossInfo {
    /**
         * 所需公会等级 
         */
    public static NEED_CONSORTIA_LEVEL: number = 6;

    public static BOSS_TYPE: number = 3;//3为公会boss, 1为小怪, 2为精英怪
    public static ELITE_TYPE: number = 2;//3为公会boss, 1为小怪, 2为精英怪
    public static NORMAL_TYPE: number = 1;//3为公会boss, 1为小怪, 2为精英怪

    private _grade: number = 0;
    /**
     * 召唤等级
     */
    public callGrade: number = 0;
    /**
     * 当前战意(公会的战意值)
     */
    public spirit: number = 0;
    /**
     * 状态: 0:可召唤   1: 准备中   2: 正在进行中   3: 已结束   -1: 无boss数据(已销毁)
     */
    public state: number = 0;
    /**
     * 结束时间 
     */
    public endTime: string ="";
    /**
     * 总血量
     */
    public totalHp: number = 0;

    /**
     *boss的buff字符串(231,6214,64)
     */
    public BufferIds: string ="";
    /**
     * 三种任务当前进度和总进度(公用) , 数组保存, 技能进度, 方便取值比较
     */
    public taskProcessArr: Array<number> = [];
    public taskMaxProcessArr: Array<number> = [];
    public taskSkillIdProcessArr: Array<number> = [];

    /**
     *	副本中个人信息数据 
     */
    private _bossUserInfoDic: Map<number, ConsortiaBossUserInfo> = new Map();

    /**
     * 公会BOSS等级
     */
    public get grade(): number {
        return this._grade;
    }

    /**
     * @private
     */
    public set grade(value: number) {
        this._grade = value;
        this.setTaskMaxProcess();
    }

    /**
     * 副本中个人信息数据
     */
    public get bossUserInfoDic(): Map<number, ConsortiaBossUserInfo> {
        return this._bossUserInfoDic;
    }
    /**
     * 添加个人数据信息
     */
    public addBossUserInfo(info: ConsortiaBossUserInfo) {
        this._bossUserInfoDic.set(info.userid, info);
    }
    public getBossUserInfoByUserId(uId: number): ConsortiaBossUserInfo {
        return this._bossUserInfoDic.get(uId) as ConsortiaBossUserInfo;
    }

    private setTaskMaxProcess() {
        let tempInfo:t_s_consortiabossData = TempleteManager.Instance.getConsortiaBossRewardByLevel(this._grade);
        if (tempInfo) this.taskMaxProcessArr = [tempInfo.ATotal, tempInfo.BTotal, tempInfo.CTotal];
    }
}