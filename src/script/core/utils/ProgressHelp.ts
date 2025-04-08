export default class ProgressHelp {
    static getCurrentValue(currentValue:number,maxValue:number,valueArray:Array<number>):number {
        let returnValue:number = 0;
        if(!valueArray || valueArray.length == 0)return 0;
        let len:number = valueArray.length;
        let constValue:number = 1/len;
        if(currentValue >= maxValue){
            returnValue = maxValue;
        }
        else if(currentValue>0 && currentValue < maxValue){
            for(let i = 0;i<len;i++)
            {
                if(currentValue<=valueArray[0]){//第一段区域
                    returnValue = constValue*(maxValue/(valueArray[0] -0))*currentValue;
                    break;
                }
                else if(currentValue>= valueArray[len-2]){//最后一段
                    returnValue = maxValue*(len-1)/len + constValue*(maxValue/(maxValue - valueArray[len-2])*(currentValue - valueArray[len-2]));
                    break;
                }
                else if(valueArray[i]<=currentValue && currentValue<=valueArray[i+1]){//中间区域
                    returnValue = maxValue*((i+1)/len) + constValue*(maxValue/(valueArray[i+1] - valueArray[i])*(currentValue - valueArray[i]))
                    break;
                }
            }
        }
        return returnValue;
    }
}