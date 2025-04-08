/*
 * @Author: jeremy.xu
 * @Date: 2024-03-01 16:29:33
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-19 14:46:24
 * @Description: 
 */
import { PathManager } from "../manager/PathManager";
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_secret
*/
export default class t_s_secret {
        public mDataList: t_s_secretData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_secretData(list[i]));
                }
        }
}

export class t_s_secretData extends t_s_baseConfigData {
        // 类型，目前统一为1，后继版本开放其他类型秘境再定义
        public Type: number = 0;
        // 秘境ID
        public SecretId: number = 0;
        // 秘宝预览，半角逗号分割
        public Treasure: string = "";
        // 物品掉落预览，半角逗号分割
        public Item: string = "";
        // 所需玩家等级
        public NeedGrade: number = 0;
        // 需通关前置
        public PreSecret: number = 0;
        // 底图名字
        public ImgPath: string = "";
        // 最大层数
        public MaxLayer: number = 0;
        // 音乐路径
        public MusicPath: string = "";
        protected Name_de: string = "";
        protected Name_en: string = "";
        protected Name_es: string = "";
        protected Name_fr: string = "";
        protected Name_pt: string = "";
        protected Name_tr: string = "";
        protected Name_zhcn: string = "";
        protected Name_zhtw: string = "";
  
        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        private TemplateNameKey: string = "Name";
        public get TemplateNameLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.TemplateNameKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.TemplateNameKey);
        }
}
