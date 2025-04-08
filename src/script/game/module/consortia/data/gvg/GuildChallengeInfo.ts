/**
 * 公会战对战信息
 * @author yuanzhan.yu
 *
 */
export class GuildChallengeInfo
{
    public isExist:boolean = false;
    public startTime:string;
    public endTime:string;
    public attackGuildId:number = 0;
    public defencGuildId:number = 0;
    public attackName:string;
    public defencName:string;

    constructor()
    {
    }
}