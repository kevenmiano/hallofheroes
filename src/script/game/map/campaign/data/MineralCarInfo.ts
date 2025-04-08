// @ts-nocheck

export class MineralCarInfo {
    public ownerId: number = -1; // 所属玩家id
    public armyId: number = -1; // 所属部队id
    public minerals: number = -1; // 当前矿车矿石数量
    public quality: number = -1; // 矿车品质(0:普通矿车,1:高级矿车)
    public get_count: number = -1; // 当天已领取矿车数量
    public hand_count: number = -1; // 当天已交矿次数
    public pick_count: number = -1; // 当前矿车采集次数
    public is_own: number = 0; // 是否有矿车（0: 无车, 1: 有车）
    public isUpdate: boolean;//当前是否更新
    public get mineralType(): string {
        if (this.minerals == 0) return "";
        if (this.minerals < 200) return "1";
        return "2";
    }
    constructor() {
    }
}