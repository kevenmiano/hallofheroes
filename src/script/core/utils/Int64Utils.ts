// @ts-nocheck
export class Int64Utils
{
    constructor()
    {
    }

    public static int64ToNumber(value:Long):number
    {
        var n:number = value.high;
        n = n * (1 << 8);
        n = n * (1 << 8);
        n = n * (1 << 8);
        n = n * (1 << 8);
        n = n + value.low;
        return n;
    }
}
