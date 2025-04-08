// @ts-nocheck
import ByteArray from "../net/ByteArray";

/**
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2021-04-08 15:26
 */
export default class BitArray extends ByteArray
{

    constructor()
    {
        super();
    }

    /**
     * 设定指定位的值
     * @param position:number 位索引
     * @param value:boolean 设定值
     * @return 所设定的值
     */
    public setBit(position:number, value:boolean):boolean
    {
        let index:number = position >> 3;
        let offset:number = position & 7;
        let tempByte:number = this._byteView_[index];
        tempByte |= (1 << offset);
        this._byteView_[index] = tempByte;
        return true;
    }

    /**
     * 获取指定位的值
     * @param position:number 位索引
     * @return 指定位的值
     */
    public getBit(position:number):boolean
    {
        let index:number = position >> 3;
        let offset:number = position & 7;
        let tempByte:number = this._byteView_[index];
        let result:number = tempByte & (1 << offset);
        if(result)
        {
            return true;
        }
        return false;
    }

    public loadBinary(str:string)
    {
        for(let i:number = 0; i < str.length * 32; i++)
        {
            let flag1 = (1 >> i) > 0 ? true : false;
            this.setBit(i, str && flag1);
        }
    }

    /**
     * 以字符串可视化输出一个位的值
     * @param position:number 位索引
     * @return position所在字节所有位值的字符串
     */
    public traceBinary(position:number):string
    {
        let index:number = position >> 3;
        let offset:number = position & 7;
        let tempByte:number = this._byteView_[index];
        let tempStr:string = "";
        for(let i:number = 0; i < 8; i++)
        {
            if(i == offset)
            {
                if(tempByte & (1 << i))
                {
                    tempStr += "[1]";
                }
                else
                {
                    tempStr += "[0]";
                }
                continue
            }
            if(tempByte & (1 << i))
            {
                tempStr += " 1 ";
            }
            else
            {
                tempStr += " 0 ";
            }
        }
        return tempStr;
    }
}