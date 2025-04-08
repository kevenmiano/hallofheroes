import { C2SProtocol } from "../../game/constant/protocol/C2SProtocol";
import { S2CProtocol } from "../../game/constant/protocol/S2CProtocol";
import PackageCheckController from "../check/PackageCheckController";
import WeakNetCheckController from "../check/WeakNetCheckController";
import Logger from "../logger/Logger";
import { ByteUtils } from "../utils/ByteUtils";
import StringHelper from "../utils/StringHelper";
import ByteArray from "./ByteArray";
import { PackageIn } from "./PackageIn";
import { PackageOut } from "./PackageOut";
import { SocketEvent } from "./SocketEvent";

export class GameSocket extends Laya.EventDispatcher {
    private _socketPath: string = '';
    private _debug: boolean = false;
    private _socket: Laya.Socket;
    private _ip: string = '';
    private _port: number = 0;
    private _send_fsm: FSM;
    private _receive_fsm: FSM;
    private _encrypted: boolean = false;
    private _sendCampaignPkgCount: number = 0;
    private _sendVehiclePkgCount: number = 0;
    private connectionTimeout = 3000;

    private static KEY: Array<number> = [0xae, 0xbf, 0x56, 0x78, 0xab, 0xcd, 0xef, 0xf1];
    public static NEW_KEY: Array<number> = [0xae, 0xbf, 0x56, 0x78, 0xab, 0xcd, 0xef, 0xf1];
    public static RECEIVE_KEY: ByteArray;
    public static SEND_KEY: ByteArray;

    private _check: PackageCheckController = null;
    private _checkNet: WeakNetCheckController = null;

    public constructor(encrypted: boolean = true, debug: boolean = false) {
        super();

        this._readBuffer = new ByteArray();
        this._send_fsm = new FSM(0x7abcdef7, 1501);
        this._receive_fsm = new FSM(0x7abcdef7, 1501);
        this._headerTemp = new ByteArray();
        this._encrypted = encrypted;
        this._debug = debug;
        this.setKey(GameSocket.KEY);
        this._check = new PackageCheckController(this);
    }
    //开启弱网检测
    public createWeakNet() {
        if (!this._checkNet) {
            this._checkNet = new WeakNetCheckController(this);
        }
        return this._checkNet;
    }

    public setKey(key: Array<number>) {
        GameSocket.RECEIVE_KEY = new ByteArray();
        GameSocket.SEND_KEY = new ByteArray();
        for (let i: number = 0; i < 8; i++) {
            GameSocket.RECEIVE_KEY.writeByte(key[i]);
            GameSocket.SEND_KEY.writeByte(key[i]);
        }
    }

    public resetKey() {
        this.setKey(GameSocket.KEY);
    }

    public resetKey2() {
        this.setKey(GameSocket.NEW_KEY);
    }

    public setFsm(adder: number, muliter: number) {
        this._send_fsm.setup(adder, muliter);
        this._receive_fsm.setup(adder, muliter);
    }

    public connect(ip: string, port: number, isRelease: boolean = false) {
        // if (this.connected)
        //     return;
        // if (this._socket) {
        //     this.close(false);
        // }

        if (!this._socket) {
            this._socket = new Laya.Socket();
            this.addEvent(this._socket);
            // this._socket.
        }
        this._socket.endian = Laya.Socket.BIG_ENDIAN;
        this._ip = ip;
        this._port = port;
        this._readBuffer.position = 0;
        this._readOffset = 0;
        this._writeOffset = 0;
        // this._socket.connect(ip, port);
        //正式版采用wss,https
        if (this._ip.indexOf("ws://") != -1 || this._ip.indexOf("wss://") != -1) {
            this._socketPath = this._ip;
        } else {
            this._socketPath = `ws://${ip}:${port}/ws`;
        }
        this._socket.connectByUrl(this._socketPath);
        Laya.timer.clear(this, this.handleTimeout);
        Laya.timer.once(this.connectionTimeout, this, this.handleTimeout);
    }


    private addEvent(socket: Laya.Socket) {
        if (socket) {
            socket.on(Laya.Event.OPEN, this, this.handleConnect);
            socket.on(Laya.Event.MESSAGE, this, this.handleIncoming);
            socket.on(Laya.Event.CLOSE, this, this.handleClose);
            socket.on(Laya.Event.ERROR, this, this.handleIoError);
        }
    }

    private removeEvent(socket: Laya.Socket) {
        Laya.timer.clear(this, this.handleTimeout);
        if (socket) {
            Laya.timer.clear(this, this.handleTimeout);
            socket.off(Laya.Event.OPEN, this, this.handleConnect);
            socket.off(Laya.Event.MESSAGE, this, this.handleIncoming);
            socket.off(Laya.Event.CLOSE, this, this.handleClose);
            socket.off(Laya.Event.ERROR, this, this.handleIoError);
        }
    }

    public get connected(): boolean {
        return this._socket && this._socket.connected;
    }

    public isSame(ip: string, port: number): boolean {
        return this._ip == ip && port == this._port;
    }

    public send(code: number, message?: protobuf.Message<any>, extendId?: number) {
        if (!this.connected) {
            return;
        }

        let msgCode: string = StringHelper.pad(code.toString(16), 4).toUpperCase();
        Logger.socket(`💙发送协议: 0x${msgCode}   发送数据`, message);

        switch (code) {
            case C2SProtocol.L_GET_PLAYER_LIST:
            case C2SProtocol.L_PREPARE_LOGIN:
            case C2SProtocol.L_REGISTER_ROLE:
            case C2SProtocol.G_LOGIN_GATEWAY:
            case C2SProtocol.L_CREATE_LOGIN:
            case S2CProtocol.L_SYNC_TIME:
                this.resetKey();
                break;
            default:
                // SocketManager.Instance.socket.resetKey2();
                break;
        }

        //fixme 发送的时候new了太多PackageOut
        let pkg: PackageOut;
        if (extendId > 0) {
            pkg = new PackageOut(code, 0, extendId);
        }
        else {
            pkg = new PackageOut(code);
        }

        if (message) {
            let body = message["__proto__"].constructor.encode(message).finish();
            pkg.writeArrayBuffer(body);
        }
        pkg.pack();
        if (this._encrypted) {
            //开始加密
            for (let i: number = 0; i < pkg.length; i++) {
                if (i > 0) {
                    GameSocket.SEND_KEY._byteView_[i % 8] = (GameSocket.SEND_KEY._byteView_[i % 8] + pkg._byteView_[i - 1]) ^ i;
                    pkg._byteView_[i] = (pkg._byteView_[i] ^ GameSocket.SEND_KEY._byteView_[i % 8]) + pkg._byteView_[i - 1];
                } else {
                    pkg._byteView_[0] = pkg._byteView_[0] ^ GameSocket.SEND_KEY._byteView_[0];
                }
            }
        }
        (this._socket.output as Laya.Byte).writeArrayBuffer(pkg.__getBuffer(), 0, pkg.length);
        this._socket.flush();

        if (this._check) {
            this._check.addPackage(pkg);
        }
        if (this._checkNet) {
            this._checkNet.addPackage(pkg);
        }
    }

    public sendString(data: string) {
        if (this._socket && this._socket.connected) {
            (this._socket.output as ByteArray).writeUTF(data);
            this._socket.flush();
        }
    }

    public close(isEvt: boolean = true) {
        this.removeEvent(this._socket);
        if (this._socket) {
            this._socket.close();
            this._socket = null;
        }
        if (isEvt) {
            this.event(Laya.Event.CLOSE);
        }
    }

    private handleConnect(event: any = null) {
        this._send_fsm.reset();
        this._receive_fsm.reset();
        this._send_fsm.setup(0x7abcdef7, 1501);
        this._receive_fsm.setup(0x7abcdef7, 1501);
        this.event(SocketEvent.SERVER_SUCCESS);
    }

    private handleClose(event: any = null) {
        this.removeEvent(this._socket);
        this.event(SocketEvent.SERVER_CLOSE);
    }

    private handleIoError() {
        this.event(SocketEvent.SERVER_ERROR);
    }

    private handleTimeout() {
        
        if (this._socket && this._socket.connected) return;

        this.removeEvent(this._socket);

        this.handleIoError();
    }

    private handleIncoming(message: ArrayBuffer) {
        let input: Laya.Byte = this._socket.input as Laya.Byte;
        if (input.bytesAvailable > 0) {
            let len: number = input.bytesAvailable;
            // input.readBytes(this._readBuffer, this._writeOffset, input.bytesAvailable);
            let arraybuffer = input.readArrayBuffer(input.bytesAvailable);
            this._readBuffer.writeArrayBuffer(arraybuffer, 0, arraybuffer.byteLength);
            this._writeOffset += len;
            if (this._writeOffset > 1) {
                this._readBuffer.position = 0;
                this._readOffset = 0;
                if (this._readBuffer.bytesAvailable >= PackageIn.HEADER_SIZE) {
                    this.readPackage();
                }
            }
        }
    }

    private _readBuffer: ByteArray;
    private _readOffset: number;
    private _writeOffset: number;
    private _headerTemp: ByteArray;

    private readPackage() {
        let dataLeft: number = this._writeOffset - this._readOffset;
        do {
            let len: number = 0;
            while (this._readOffset + 4 < this._writeOffset) {
                this._headerTemp.position = 0;
                this._headerTemp.writeByte(this._readBuffer._byteAt_(this._readOffset + 0));
                this._headerTemp.writeByte(this._readBuffer._byteAt_(this._readOffset + 1));
                this._headerTemp.writeByte(this._readBuffer._byteAt_(this._readOffset + 2));
                this._headerTemp.writeByte(this._readBuffer._byteAt_(this._readOffset + 3));

                if (this._encrypted) {
                    this._headerTemp = this.decrptBytes(this._headerTemp, 4, this.copyByteArray(GameSocket.RECEIVE_KEY));
                }
                this._headerTemp.position = 0;
                //note 貌似不能断点查看
                if (this._headerTemp.readShort() == PackageOut.HEADER) {
                    len = this._headerTemp.readUnsignedShort();
                    // Logger.log("29099!!!!!");
                    break;
                } else {
                    this._readOffset++;
                }
            }

            dataLeft = this._writeOffset - this._readOffset;
            if (dataLeft >= len && len != 0) {
                this._readBuffer.position = this._readOffset;
                let buff: PackageIn = new PackageIn(len);
                if (this._encrypted) {
                    buff.loadE(this._readBuffer, len, GameSocket.RECEIVE_KEY);
                } else {
                    buff.load(this._readBuffer, len);
                }
                let code: string = StringHelper.pad(buff.code.toString(16), 4).toUpperCase();
                Logger.socket(`💛收到协议: 0x${code}   请解析数据！`);
                this._readOffset += len;
                dataLeft = this._writeOffset - this._readOffset;
                this.handlePackage(buff);
            } else {
                break;
            }
        }
        while (dataLeft >= PackageIn.HEADER_SIZE);

        this._readBuffer.position = 0;
        if (dataLeft > 0) {
            this._readBuffer.writeBytes(this._readBuffer, this._readOffset, dataLeft);
        }
        this._readOffset = 0;
        this._writeOffset = dataLeft;
    }

    private copyByteArray(src: ByteArray): ByteArray {
        let result: ByteArray = new ByteArray();
        for (let i: number = 0; i < src.length; i++) {
            result.writeByte(src._byteAt_(i));
        }
        return result;
    }

    public decrptBytes(src: ByteArray, len: number, key: ByteArray): ByteArray {
        //开始解密
        let i: number = 0;
        let result: ByteArray = new ByteArray();
        for (i = 0; i < len; i++) {
            result.writeByte(src._byteAt_(i));
        }
        for (i = 0; i < len; i++) {
            if (i > 0) {
                key._byteView_[i % 8] = (key._byteView_[i % 8] + src._byteView_[i - 1]) ^ i;
                result._byteView_[i] = (src._byteView_[i] - src._byteView_[i - 1]) ^ key._byteView_[i % 8];
            } else {
                result._byteView_[0] = src._byteView_[0] ^ key._byteView_[0];
            }
        }
        return result;
    }

    private tracePkg(src: ByteArray, des: string, len: number = -1) {
        let str: string = des;
        let l: number = len < 0 ? src.length : len;
        for (let i: number = 0; i < l; i++) {
            str += String(src._byteAt_(i)) + ", ";
        }
    }

    private traceArr(arr: ByteArray) {
        let str: String = "[";
        for (let i: number = 0; i < arr.length; i++) {
            str += (arr._byteAt_(i) + " ");
        }
        str += "]";
    }

    private pkgNumber: number = 0;

    private handlePackage(pkg: PackageIn) {
        if (pkg.checkSum == pkg.calculateCheckSum()) {
            pkg.position = PackageIn.HEADER_SIZE;
            this.event(SocketEvent.SERVER_DATA, pkg);
            if (this._checkNet) {
                this._checkNet.revPackage(pkg);
            }
        } else {
            Logger.error("pkg checksum error:", ByteUtils.ToHexDump("Bytes Left:", pkg, 0, pkg.length));
        }
    }

    public dispose() {
        if (this._socket) {
            this._socket.close();
        }
        this._socket = null;
    }
}


class FSM {
    private _state: number;
    private _adder: number;
    private _multiper: number;

    public getState(): number {
        return this._state;
    }

    public constructor(adder: number, multiper: number) {
        this.setup(adder, multiper);
    }

    public reset() {
        this._state = 0;
    }

    public setup(adder: number, multiper: number) {
        this._adder = adder;
        this._multiper = multiper;
        this.updateState();
    }

    public updateState(): number {
        this._state = ((~this._state) + this._adder) * this._multiper;
        this._state = this._state ^ (this._state >> 16);
        return this._state;
    }
}