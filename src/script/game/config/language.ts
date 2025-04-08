// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";


/*
* language
*/
export default class language {
        public mDataList: Object

        constructor(list: Object) {
                this.mDataList = list;
                // for (let i in list) {
                //         let value = new languageData(list[i]);
                //         this.mDataList.set(i, value);
                // }
        }
}
