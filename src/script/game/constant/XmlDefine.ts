// @ts-nocheck

export interface xmlCfg {
    url: string,   //文件路径
    name: string,  //类名称
    class?: any,    //实例化类
}

export enum XMLType {
    Config = "Config",
}

export const XmlURL: { [key: string]: xmlCfg } = {
    [XMLType.Config]: {url:"Config.json", name:"Config"},
}