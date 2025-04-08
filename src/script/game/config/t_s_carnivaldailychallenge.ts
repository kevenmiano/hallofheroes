// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_carnivaldailychallenge
*/
export default class t_s_carnivaldailychallenge {
        public mDataList: t_s_carnivaldailychallengeData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_carnivaldailychallengeData(list[i]));
                }
        }
}

export class t_s_carnivaldailychallengeData extends t_s_baseConfigData {
        public Id: number = 100101;
        public TaskType: number = 1;
        public Para1: number = 1;
        public Para2: number = 0;
        public Para3: number = 0;
        public Para4: string = "0";
        public Points: number = 0;
        private Title_zhcn: string = "每日登陆";
        private Title_zhtw: string = "";
        private Title_en: string = "";
        private Title_es: string = "";
        private Title_pt: string = "";
        private Title_tr: string = "";
        private Title_fr: string = "";
        private Title_de: string = "";
        private Description_zhcn: string = "每日登陆1次游戏";
        private Description_zhtw: string = "";
        private Description_en: string = "";
        private Description_es: string = "";
        private Description_pt: string = "";
        private Description_tr: string = "";
        private Description_fr: string = "";
        private Description_de: string = "";

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

        private TitleKey: string = "Title";
        public get TitleLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.TitleKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.TitleKey);
        }

        private DescriptionKey: string = "Description";
        public get DescriptionLang(): string {
                let value = this.getKeyValue(this.getLangKey(this.DescriptionKey));
                if (value) {
                        return value;
                }
                return "";//return this.getKeyValue(this.DescriptionKey);
        }
}
