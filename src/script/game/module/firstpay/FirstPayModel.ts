
export default class FirstPayModel {
    /** 可领取 */
    public static readonly CAN_GET: number = 1;
    /** 已经领取 */
    public static readonly HAS_GETED: number = 2;
    /** 不能领取 */
    public static readonly UNABLE_GET: number = 3;

    public state1: number = 3;
    public state2: number = 3;
    public state3: number = 3;
    public day: number = 0;

    constructor() {
    }
}