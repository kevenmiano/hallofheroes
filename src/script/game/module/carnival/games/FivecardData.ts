// @ts-nocheck
export class FivecardData {

    /**位序*/
    public index: number;
    /**花色*/
    public color: number;
    /**数字*/
    public number: number;

    public constructor(msg) {
        this.index = msg.index;
        this.color = msg.color;
        this.number = msg.number;
    }

}