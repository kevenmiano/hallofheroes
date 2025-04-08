import LangManager from "../../core/lang/LangManager";
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_appell
*/
export default class t_s_appell {
   public mDataList: t_s_appellData[];

   public constructor(list: Object[]) {
      this.mDataList = [];
      for (let i in list) {
         this.mDataList.push(new t_s_appellData(list[i]));
      }
   }
}

export class t_s_appellData extends t_s_baseConfigData {
   //激活展示
   public Activation: number;
   //TemplateId(ID)
   public TemplateId: number;
   //showParam(展示参数)
   public showParam: number[];
   //Job(职业)
   public Job: number;
   //IsAuto(自动领取)
   public IsAuto: number;
   //Type(类型, 1为个人成长, 2为竞技挑战, 3为副本挑战, 4为其他事件)
   public Type: number;
   //Title(称号名字)
   protected Title: string = "";
   protected Title_en: string = "";
   protected Title_es: string = "";
   protected Title_fr: string = "";
   protected Title_pt: string = "";
   protected Title_tr: string = "";
   protected Title_zhcn: string = "";
   protected Title_zhtw: string = "";
   //Descript(称号描述)
   protected Descript: string = "";
   protected Descript_en: string = "";
   protected Descript_es: string = "";
   protected Descript_fr: string = "";
   protected Descript_pt: string = "";
   protected Descript_tr: string = "";
   protected Descript_zhcn: string = "";
   protected Descript_zhtw: string = "";
   //CondtionType(条件类型)
   public CondtionType: number;
   //Para(条件类型相关参数)
   public Para: number[];
   //Perfix(聊天栏前缀: 格式: 前缀名词|字体颜色编号)
   public Perfix: string;
   //Quality(品质, 3为灰色, 4为紫色, 5为亮金色, 指在称号列表中的颜色, 和顶在头上图片完全无关)
   public Quality: number;
   //IsLong(是否时效, 0为永久, 1为时效)
   public IsLong: number;
   //Notice(是否全服公告, 0为不公告, 1为公告)
   public Notice: number;
   //Sort(排序, 数字越小越靠前)
   public Sort: number;
   //称号携带Buff
   public Buffs: number[];
   //称号是否隐藏
   public IsHide: number;
   //称号携带技能
   public Skills: number[];
   //称号时效（天数）
   public Time: string;


   private _showOptions: Array<number>;
   public isGet: boolean = false;
   public isEquiped: boolean = false;
   public progress: string = "";

   constructor(data?: Object) {
      super();
      if (data) {
         for (let i in data) {
            this[i] = data[i];
         }
      }
   }

   private PerfixKey: string = "Perfix";
   public get PerfixLang(): string {
      let value = this.getKeyValue(this.getLangKey(this.PerfixKey));
      if (value) {
         return value;
      }
      return "";//return this.getKeyValue(this.PerfixKey);
   }

   private TitleKey: string = "Title";
   public get TitleLang(): string {
      let value = this.getKeyValue(this.getLangKey(this.TitleKey));
      if (value) {
         return value;
      }
      return "";//return this.getKeyValue(this.TitleKey);
   }

   private DescriptKey: string = "Descript";
   public get DescriptLang(): string {
      let value = this.getKeyValue(this.getLangKey(this.DescriptKey));
      if (value) {
         return value;
      }
      return "";//return this.getKeyValue(this.DescriptKey);
   }

   public get showOptions(): Array<number> {
      if (!this._showOptions) {
         this._showOptions = this.showParam;
      }
      return this._showOptions;
   }

   public get ImgBgId(): number {
      var index: number = 0;
      var returnValue: number = 0;
      if (this.showOptions && this._showOptions.length > 0 && this.showOptions[index] != 0) {
         returnValue = this.showOptions[index];
      }
      return returnValue;
   }

   public get ImgWidth(): number {
      var index: number = 1;
      var returnValue: number = 15;
      if (this.showOptions && this._showOptions.length > 0 && this.showOptions[index] != 0) {
         returnValue = this.showOptions[index];
      }
      return returnValue;
   }

   public get ImgHeight(): number {
      var index: number = 2;
      var returnValue: number = 15;
      if (this.showOptions && this._showOptions.length > 0 && this.showOptions[index] != 0) {
         returnValue = this.showOptions[index];
      }
      return returnValue;
   }

   public get TextY(): number {
      var index: number = 3;
      var returnValue: number = 15;
      if (this.showOptions && this._showOptions.length > 0 && this.showOptions[index] != 0) {
         returnValue = this.showOptions[index];
      }
      return returnValue;
   }

   public get TextFontSize(): number {
      var index: number = 4;
      var returnValue: number = 15;
      if (this.showOptions && this._showOptions.length > 0 && this.showOptions[index] != 0) {
         returnValue = this.showOptions[index];
      }
      return returnValue;
   }

   public get TextColorIdx(): number {
      var index: number = 5;
      var returnValue: number = 15;
      if (this.showOptions && this._showOptions.length > 0 && this.showOptions[index] != 0) {
         returnValue = this.showOptions[index];
      }
      return returnValue;
   }

   public get ImgCount(): number {
      // var index: number = 2;
      var returnValue: number = 1;
      // if (this.showOptions && this._showOptions.length > 0 && Number(this.showOptions[index]) != 0) {
      //    returnValue = Number(this.showOptions[index]);
      // }
      return returnValue;
   }

   public get ImgFrame(): number {
      // var index: number = 3;
      var returnValue: number = 1;
      // if (this.showOptions && this._showOptions.length > 0 && Number(this.showOptions[index]) != 0) {
      //    returnValue = Number(this.showOptions[index]);
      // }
      return returnValue;
   }

   public getProgress(): string {
      if (!this.Para) return "";
      var res: Array<string> = [];
      var arr: Array<string> = this.Para.join(",").toString().split("|");
      var arr2: Array<string> = [];
      if (this.progress) {
         arr2 = this.progress.split("|");
      } else {
         arr2 = []
      }
      for (var i: number = 0; i < arr.length; i++) {
         if (!arr[i]) {
            res.push("");
            continue;
         }
         var arr3: Array<string> = arr[i].split(",");
         var arr4: Array<any> = arr2[i] ? arr2[i].split(",") : [""];
         // 盗宝王称号特殊处理
         if (this.TemplateId == 65) {
            var tempProgress: number = 0;
            var arr5: Array<string> = [];
            for (var j: number = 0; j < arr2.length; j++) {
               arr5 = arr2[j].split(",");
               if (Number(arr5[0]) >= Number(arr3[0])) {
                  tempProgress += Number(arr5[1]);
               }
            }
            arr4[arr4.length - 1] = tempProgress;
         }
         res.push(LangManager.Instance.GetTranslation("public.slash", arr4[arr4.length - 1], arr3[arr3.length - 1]));
      }
      return res.join(",");
   }
}
