import { XMLType, XmlURL } from '../../game/constant/XmlDefine';
import ComponentSetting from "../../game/utils/ComponentSetting";
import GameEventDispatcher from "../event/GameEventDispatcher";
import IManager from "../Interface/IManager";
import ResMgr from '../res/ResMgr';
import { IParserConfiguration } from "./interfaces";
import { XmlParser } from "./xmlParser";

/**
* @author:pzlricky
* @data: 2020-11-26 15:04
* @description *** 
*/
export default class XmlMgr extends GameEventDispatcher implements IManager {

    private xmlMaps: Map<XMLType, any>;

    private static ins: XmlMgr;

    static get Instance(): XmlMgr {
        if (!XmlMgr.ins) {
            XmlMgr.ins = new XmlMgr();
        }
        return XmlMgr.ins;
    }


    constructor() {
        super();
    }

    /**
     * 初始化
     * @param t 
     */
    preSetup(t?: any) {
        
    }

    setup(t?: any) {
        this.xmlMaps = new Map();
    }

    /**
     * 加载XML配置
     * @param type XML类型 XMLType
     * @param callFunc 加载XML回调
     */
    onLoadXML(type: XMLType, callFunc: Function) {
        let url = ComponentSetting.XML_PREFIX + XmlURL[type].url;
        ResMgr.Instance.loadRes(url, (res: any) => {
            let jsonData = this.decode(res);
            this.xmlMaps.set(type, jsonData);
            callFunc(jsonData);
        })
    }

    /**
     * 获取XML
     * @param xmlType XML类型 XMLType
     */
    getXML(xmlType: XMLType): Object {
        return this.xmlMaps.get(xmlType);
    }

    /**
     * 解析XML
     * @param xml xml字符串
     */
    decode(xml: any) {
        if (!xml)
            return null;
        let config = <IParserConfiguration>{};
        config.removeLineBreaks = true;
        config.removeComments = true;
        config.transformTextOnly = true;

        let parser = new XmlParser();
        let json = parser.toJson(xml.toString(), config);
        return json;
    }


}