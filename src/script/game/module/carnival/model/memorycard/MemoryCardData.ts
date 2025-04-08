
/**
 * 记忆翻牌数据 
 */
export default class MemoryCardData {
    /**索引 从1开始*/
    public index: number;
    /**类型*/
    public type: number;

    constructor(data: any) {
        this.index = data.index;
        this.type = data.type;
    }
}