// @ts-nocheck
/**
 * 公会战一个公会3轮比赛信息
 *
 */
export class GuildGroupInfo {
    public consortiaId: number = 0;
    public consortiaName: string = "";
    public group1: number = 0;
    public group2: number = 0;
    public group3: number = 0;

    public result1: number = 0;
    public result2: number = 0;
    public result3: number = 0;

    public score: number = 0;
    public order: number = 0;
    public fightPower: number = 0;

    public total1: number = 0;
    public total2: number = 0;
    public total3: number = 0;

    constructor() {
    }


    public commit(): void {
        this.total1 = this.result1 * 4;
        this.total2 = this.result1 * 4 + this.result2 * 2;
        this.total3 = this.result1 * 4 + this.result2 * 2 + this.result3 * 1;
    }
}