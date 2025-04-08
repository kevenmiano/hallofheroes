// @ts-nocheck
import t_s_baseConfigData from "./t_s_baseConfigData";

/*
* t_s_gameconfig
*/
export default class t_s_gameconfig {
        public mDataList: t_s_gameconfigData[];

        public constructor(list: Object[]) {
                this.mDataList = [];
                for (let i in list) {
                        this.mDataList.push(new t_s_gameconfigData(list[i]));
                }
        }
}

export class t_s_gameconfigData extends t_s_baseConfigData {
        //语言版本
        public LANGUAGE: string;
        //多语言配置
        public LANGUAGE_DEF: Object[];
        //资源请求地址
        public REQUEST_PATH: string;
        //服务器地址
        public SocktPath: string;
        //服务器端口
        public SocketPort: number;
        //资源地址
        public ResourcePath: string;
        //客服图片上传地址
        public UPLOAD_PATH: string;
        //表情数量
        public FACE_NUM: number;
        //版本号
        public VERSION: string;
        //开关1
        public LOADINGSUSLIKS: number;
        //开关2
        public BATTLE_LOG: number;
        //开关3
        public LOGIN_CHECK_NICK: number;
        //开关4
        public OPNE_LOADINGSUSLIKS: number;
        //开关5
        public PAWNSPECIAL: number;
        //开关6
        public SOULMAKE_BTN: number;
        //开关7
        public GVG: number;
        //开关8
        public PVP_CAMPAIGN: number;
        //开关9
        public AUTO_MAZE: number;
        //开关10
        public DOUBLE_SKILL: number;
        //开关11
        public COUNT_LOGIN: number;
        //开关12
        public MAZE_SWTICH: number;
        //开关13
        public WORLDBOSS_BUFF: number;
        //开关14
        public SECURITY_CODE: number;
        //开关15
        public SNS_PORT: number;
        //开关16
        public WORLDBOSS_TISHEN: number;
        //开关17
        public FILTER_TRIM: number;

        constructor(data?: Object) {
                super();
                if (data) {
                        for (let i in data) {
                                this[i] = data[i];
                        }
                }
        }

}
