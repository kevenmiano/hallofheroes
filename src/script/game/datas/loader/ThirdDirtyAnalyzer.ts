import ResMgr from '../../../core/res/ResMgr';
import DataAnalyzer from '../DataAnalyzer';
import ConfigMgr from '../../../core/config/ConfigMgr';
import { ConfigType } from '../../constant/ConfigDefine';
import t_s_dirtylib from '../../config/t_s_dirtylib';
import Logger from '../../../core/logger/Logger';
import StringUtils from '../../utils/StringUtils';
/**
* @author:pzlricky
* @data: 2021-07-28 19:45
* @description 第三方屏蔽字库 
*/
export default class ThirdDirtyAnalyzer extends DataAnalyzer {

    constructor(onCompleteCall: Function) {
        super(onCompleteCall);
        this.words = [];
    }

    public words: string[][] = [];

    private keyAND = "AND";
    private keyOR = "OR";
    public analyze() {
        this.words = [];
        ConfigMgr.Instance.load(ConfigType.t_s_dirtylib, (ret) => {
            if (ret) {//解析第三方字库
                let datalist = (ret as t_s_dirtylib).mDataList;
                for (const key in datalist) {
                    if (Object.prototype.hasOwnProperty.call(datalist, key)) {
                        let element = datalist[key];
                        //Value(组合关键词（注: OR表示“或者”的意思；AND表示“而且”的意思）)
                        //解析字符(十个生命 AND 一个世纪 AND 英国剑桥大学 AND 'Timothy Cheek Klaus Mühlhahn' AND 'Hans van de Ven')
                        let value = StringUtils.trim(element.Value);
                        let andsTemp = [];
                        let allList = [];
                        let result;
                        if (value.indexOf(this.keyAND) != -1 && value.indexOf(this.keyOR) != -1) {//AND 和OR 同时存在
                            andsTemp = value.split(this.keyAND);
                            for (let index = 0; index < andsTemp.length; index++) {
                                let andElement = StringUtils.trim(andsTemp[index]);
                                andElement = andElement.replace('(', "");
                                andElement = andElement.replace(')', "");
                                let temp = [];
                                if (andElement.indexOf(this.keyOR) == -1) {
                                    temp = [andElement];
                                } else {
                                    let orsTemp = andElement.split(this.keyOR);
                                    for (const key in orsTemp) {
                                        if (Object.prototype.hasOwnProperty.call(orsTemp, key)) {
                                            let orElement = StringUtils.trim(orsTemp[key]);
                                            temp.push(orElement);
                                        }
                                    }
                                }
                                allList.push(temp);
                            }
                            result = this.doExchange(allList);
                        } else if (value.indexOf(this.keyOR) != -1 && value.indexOf(this.keyAND) == -1) {
                            let orsTemp = value.split(this.keyOR);
                            for (const key in orsTemp) {
                                if (Object.prototype.hasOwnProperty.call(orsTemp, key)) {
                                    let orElement = StringUtils.trim(orsTemp[key]);
                                    orElement = orElement.replace('(', "");
                                    orElement = orElement.replace(')', "");
                                    allList.push(orElement);
                                }
                            }
                            result = allList;
                        } else if (value.indexOf(this.keyOR) == -1 && value.indexOf(this.keyAND) != -1) {
                            let orsTemp = value.split(this.keyAND);
                            let temp = [];
                            for (const key in orsTemp) {
                                if (Object.prototype.hasOwnProperty.call(orsTemp, key)) {
                                    let orElement = StringUtils.trim(orsTemp[key]);
                                    orElement = orElement.replace('(', "");
                                    orElement = orElement.replace(')', "");
                                    temp.push(orElement);
                                }
                            }
                            allList.push(temp);
                            result = allList;
                        } else {
                            let valueSTR = StringUtils.trim(value);
                            allList.push([valueSTR]);
                            result = this.doExchange(allList);
                        }

                        // Logger.xjy('result:', result);
                        this.words.push(result);
                    }
                }
                this.onAnalyzeComplete();
            } else {
                this.onAnalyzeComplete();
            }
        })
    }

    /*返回组合的数组*/
    doExchange(array) {
        var len = array.length;
        // 当数组大于等于2个的时候
        if (len >= 2) {
            // 第一个数组的长度
            var len1 = array[0].length;
            // 第二个数组的长度
            var len2 = array[1].length;
            // 2个数组产生的组合数
            var lenBoth = len1 * len2;
            //  申明一个新数组
            var items = new Array(lenBoth);
            // 申明新数组的索引
            var index = 0;
            for (var i = 0; i < len1; i++) {
                for (var j = 0; j < len2; j++) {
                    if (array[0][i] instanceof Array) {
                        items[index] = array[0][i].concat(array[1][j]);
                    } else {
                        items[index] = [array[0][i]].concat(array[1][j]);
                    }
                    index++;
                }
            }
            var newArr = new Array(len - 1);
            for (var i = 2; i < array.length; i++) {
                newArr[i - 1] = array[i];
            }
            newArr[0] = items;
            return this.doExchange(newArr);
        } else {
            return array[0];
        }
    }

}