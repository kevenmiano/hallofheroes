// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2024-03-01 16:30:53
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-01 16:59:52
 * @Description: 
 */
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_secretevent
*/
export default class t_s_secretevent {
        public mDataList: t_s_secreteventData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_secreteventData(list[i]));
                }
        }
}

export class t_s_secreteventData extends t_s_baseConfigData {
        // 事件ID
        public EventId: number = 0;
        // 背景ID
        public SceneId: number = 0;
        // 半身像ID
        public HeadId: number = 0;
        // 敌方展示资源路径
        public BattlePath: string = "";
        // 选项ID
        public Option1: number = 0;
        public Option2: number = 0;
        public Option3: number = 0;
        protected Description_de: string = "";
        protected Description_en: string = "";
        protected Description_es: string = "";
        protected Description_fr: string = "";
        protected Description_pt: string = "";
        protected Description_tr: string = "";
        protected Description_zhcn: string = "";
        protected Description_zhtw: string = "";
        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

	//Description(描述)
	private DescriptionKey: string = "Description";
	public get DescriptionLang(): string {
		let value = this.getKeyValue(this.getLangKey(this.DescriptionKey));
		if (value) {
			return value;
		}
		return "";//return this.getKeyValue(this.DescriptionKey);
	}
}
