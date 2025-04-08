// @ts-nocheck
import LangManager from '../../../../core/lang/LangManager';
import Utils from '../../../../core/utils/Utils';

/**区服类型 */
export enum SITE_MODE {
    BETA = "beta",
    RELEASE = "release"
}


/**
* @author:pzlricky
* @data: 2021-08-10 15:01
* @description 服务器列表数据
*/
export default class ServerListData {

    //是否为白名单用户
    public isWhiteUser: boolean = false;
    public platformId: number = 0;
    public platformName: string = "";
    public ret: number = 0;
    public msg: string = "";
    public curTime: number = 0;//登录服务器时间
    public groups: GroupSite[] = [];
    public defaultSelectServer: ServerSite = null;//默认选择服务器
    public recordLoginServers: ServerSite[] = [];//登录服务器记录列表
    public recentLoginServer: ServerSite = null;//最近登录服务器
    public recomandServers: ServerSite[] = [];//推荐登录服务器
    public recomandNewServers: ServerSite[] = [];//推荐新服务器

    public allSites: ServerSite[] = [];//所有服务器列表

    public ALL: GroupSite[] = [];

    constructor() {
        this.groups = [];
        this.defaultSelectServer = null;
        this.recordLoginServers = [];
        this.recentLoginServer = null;
        this.recomandServers = [];
        this.recomandNewServers = [];
        this.ALL = [];
    }

    parse(value: string) {
        if (!value || value == "")
            return;
        let data = JSON.parse(value);
        this.isWhiteUser = data.isWhiteUser;
        this.platformId = data.platformId;
        this.platformName = data.platformName;
        this.ret = data.ret;
        this.msg = data.msg;
        this.curTime = data.curTime;
        this.groups = [];
        for (const key in data.groups) {
            if (Object.prototype.hasOwnProperty.call(data.groups, key)) {
                let group = data.groups[key];
                let groupItem = new GroupSite(group, this);
                this.groups.push(groupItem);
            }
        }
        //排序最近登录
        this.recordLoginServers.sort((a: ServerSite, b: ServerSite) => {
            if (a.playinfo.logOutTime > b.playinfo.logOutTime) {
                return -1;
            } else if (a.playinfo.logOutTime < b.playinfo.logOutTime) {
                return 1;
            } else {
                return 0;
            }
        });
        let count = 0;
        count = this.recordLoginServers.length
        if (this.recordLoginServers.length)
            this.recentLoginServer = this.recordLoginServers[0];

        count = this.recomandNewServers.length;
        if (count > 0) {//优先推荐新区
            let randomIndex = 0;
            if (count <= 1) {
                randomIndex = 0;
            } else {
                randomIndex = Utils.getRandomNum(0, count - 1);
            }
            this.defaultSelectServer = this.recomandNewServers[randomIndex];
        } else if (this.recomandServers.length > 0) {//推荐区服
            this.defaultSelectServer = this.recomandServers[this.recomandServers.length - 1];
        } else {//所有区服
            let count = this.allSites.length;
            if (count > 0)
                this.defaultSelectServer = this.allSites[count - 1];
        }

        //已有角色
        if (this.recordLoginServers.length) {
            let playerServer = new GroupSite(null, null);
            playerServer.groupId = -2;
            playerServer.groupName = LangManager.Instance.GetTranslation("ServerListData.groupName1");
            playerServer.order = -2;
            playerServer.sites = this.recordLoginServers;
            this.ALL.push(playerServer);
        }
        //推荐区服
        if (this.recomandServers.length) {
            let recomandServer = new GroupSite(null, null);
            recomandServer.groupId = -1;
            recomandServer.groupName = LangManager.Instance.GetTranslation("ServerListData.groupName2");
            recomandServer.order = -1;
            recomandServer.sites = this.recomandServers;
            this.ALL.push(recomandServer);
        }
        //其他区服
        this.ALL = this.ALL.concat(this.groups);
        this.ALL.sort((a: GroupSite, b: GroupSite) => {
            if (a.order > b.order) {
                return 1
            } else if (a.order < b.order) {
                return -1;
            } else {
                return 0;
            }
        })
    }

    /**获取对应site的服务器 */
    getSite(site: string) {
        for (const key in this.allSites) {
            if (Object.prototype.hasOwnProperty.call(this.allSites, key)) {
                let element = this.allSites[key];
                if (element.siteName == site) {
                    return element;
                }
            }
        }
        return null;
    }

    public get hasPlayer(): boolean {
        return this.recordLoginServers.length > 0;
    }

    /**
     * 获取服务器状态
     * @param isOpen 是否开放
     * @param isRepair 是否维护
     * @returns 
     */
    public static getServerState(isOpen: boolean, isRepair: boolean): number {
        return (!isRepair && isOpen) ? 1 : 0;
    }

    /**
     * 获取服务器标识
     * @returns 
     */
    public static getServerMode(serverType: number): number {
        return serverType - 1;
    }

}

export class GroupSite {
    public groupId: number = 1;
    public groupName: string = ""
    public order: number = 1
    public sites: ServerSite[] = [];

    constructor(data, target) {
        this.sites = [];
        for (let i in data) {
            if (i == "sites") {
                for (let j in data.sites) {
                    this.sites.push(new ServerSite(data.sites[j], target));
                }
            } else {
                this[i] = data[i];
            }
        }
    }
}

/**单服数据 */
export class ServerSite {
    public siteId: number = 1;
    public showName: string = "";
    /**
     * 1、新服；2、推荐；3、普通
     */
    public type: number = 0;//
    public siteName: string = "";
    public loginUrl: string = "";
    public webUrl: string = "";
    public mainSite: string = "";//主区
    public isOpen: boolean = false;
    public isRepair: boolean = false;
    public playinfo: ServerPlayerInfo = null;
    public order: number = 0;
    public openTime: number = 0;

    public constructor(data: Object, target) {
        for (let i in data) {
            if (i == "playinfo") {
                this[i] = new ServerPlayerInfo(data[i]);
            } else {
                this[i] = data[i];
            }
        }
        //推荐区服
        if (this.type == 2 || this.type == 1) {
            target.recomandServers.push(this);
            this.sortList(target.recomandServers)
        }
        //推荐新服
        if (this.type == 1) {
            target.recomandNewServers.push(this);
            this.sortList(target.recomandNewServers)
        }
        //最近登录记录
        if (this.playinfo != null) {
            target.recordLoginServers.push(this);
        }
        target.allSites.push(this);
    }

    private sortList(list: Array<ServerSite>) {
        list.sort((a: ServerSite, b: ServerSite) => {
            if (a.order > b.order) {
                return 1
            } else if (a.order < b.order) {
                return -1;
            } else {
                return 0;
            }
        })
    }

    public hasPlayer(): boolean {
        return this.playinfo != null;
    }

}

/**站点玩家登录信息 */
export class ServerPlayerInfo {
    public grades: number = 0;//玩家等级
    public headId: number = 0;//玩家头像
    public job: number = 0;//玩家职业
    public logOutTime: number = 0;//玩家最后登出时间
    public nickName: string = "";//玩家昵称
    public userId: number = 0;//玩家ID

    public constructor(data: Object) {
        for (let i in data) {
            this[i] = data[i];
        }
    }
}