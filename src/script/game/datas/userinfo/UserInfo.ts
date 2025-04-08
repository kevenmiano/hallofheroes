// @ts-nocheck
import MD5Utils from '../../../core/utils/MD5Utils';

export class UserInfo {
    private _user: string = "";
    //		public RSAkey:RSAKey;
    public area: number = 0;//当前大区  (0国内）
    public mainSite: string = "";
    public site: string = "";
    public siteId: number = 0;//玩家ServerId
    public _tempPassword: string = "";

    public isWhiteUser: boolean = false;//是否为白名单用户
    public platformId: number = 0;
    public platformName: string = "";
    private _todayFirstLogin: boolean = false;
    public get todayFirstLogin(): boolean {
        return this._todayFirstLogin;
    }

    public set todayFirstLogin(value: boolean) {
        this._todayFirstLogin = value;
    }

    public get user(): string {
        return this._user;
    }

    public set user(value: string) {
        this._user = value;
    }

    private _userId: number = 0;
    public get userId(): number {
        return this._userId;
    }

    public set userId(value: number) {
        this._userId = value;
    }

    private _loginKey: string;
    public get loginKey(): string {
        return this._loginKey;
    }

    public set loginKey(value: string) {
        this._loginKey = value;
        this._key = MD5Utils.md5(this._loginKey);
    }

    private _password: string;
    public get password(): string {
        return this._password;
    }

    public set password(value: string) {
        this._password = value;
    }

    public get tempPassword(): string {
        return this._tempPassword;
    }

    public set tempPassword(value: string) {
        this._tempPassword = value;
    }

    private _isActive: boolean;  //是否在服务器注册过, 未登陆过游戏的号一登陆就会向服务器注册
    public get isActive(): boolean {
        return this._isActive;
    }

    public set isActive(value: boolean) {
        this._isActive = value;
    }

    private _noviceProcess: number = 0;
    public get noviceProcess(): number {
        return this._noviceProcess;
    }

    public set noviceProcess(value: number) {
        this._noviceProcess = value;
    }

    private _key: string;
    public get key(): string {
        return this._key;
    }


}