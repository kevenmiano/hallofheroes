import ByteArray from "./ByteArray.js";
// import Logger from "../logger/Logger.js";
import StringHelper from "../utils/StringHelper.js";
import ProtoUtils from "../utils/ProtoUtils.js";

export class PackageIn extends ByteArray {
  public static HEADER_SIZE: number = 20;

  private _len: number = 0;
  private _checksum: number = 0;
  private _clientId: number = 0;
  private _code: number = 0;
  private _extend1: number = 0;
  private _extend2: number = 0;

  public load(src: ByteArray, len: number) {
    for (let i: number = 0; i < len; i++) {
      this.writeByte(src.readByte());
    }
    this.pos = 0;
    this.readHeader();
  }

  public loadE(src: ByteArray, len: number, key: ByteArray) {
    let i: number = 0;
    let origion: ByteArray = new ByteArray(len);
    let result: ByteArray = new ByteArray(len);

    let readByte: number;
    for (i = 0; i < len; i++) {
      readByte = src.readByte();
      origion.writeByte(readByte);
      result.writeByte(readByte);
    }

    for (i = 0; i < len; i++) {
      if (i > 0) {
        key._byteView_[i % 8] =
          (key._byteView_[i % 8] + origion._byteView_[i - 1]) ^ i;
        result._byteView_[i] =
          (origion._byteView_[i] - origion._byteView_[i - 1]) ^
          key._byteView_[i % 8];
      } else {
        result._byteView_[i] = origion._byteView_[i] ^ key._byteView_[0];
      }
    }
    result.pos = 0;
    for (i = 0; i < len; i++) {
      //				writeByte(src.readByte() ^((key++ & (0xff << 16)) >> 16));
      this.writeByte(result.readByte());
    }
    this.pos = 0;
    this.readHeader();
  }

  public readHeader() {
    this.readShort();
    this._len = this.readShort();
    this._checksum = this.readShort();
    this._code = this.readShort();
    this._clientId = this.readInt();
    this._extend1 = this.readInt();
    this._extend2 = this.readInt();
  }

  public get checkSum(): number {
    return this._checksum;
  }

  public readBody(message: {
    decode<T>(reader: protobuf.Reader | Uint8Array);
  }): any {
    this.position = PackageIn.HEADER_SIZE;

    //remark 循环还是字节写入？
    let dataArr: Array<number> = [];
    for (let i: number = PackageIn.HEADER_SIZE; i < this.length; i++) {
      dataArr.push(this.__get(i));
    }
    let uint8: Uint8Array = new Uint8Array(dataArr);
    let data: any = message.decode(uint8);
    data = ProtoUtils.parse(data);
    let code: string = StringHelper.pad(
      this._code.toString(16),
      4,
    ).toUpperCase();
    // Logger.socket(`❤️解析协议: 0x${code}   解析数据`, data);
    console.log(`❤️解析协议: 0x${code}   解析数据`, data);
    return data;
  }

  // public readBody(message:Message<any>):Message<any>
  // {
  //     this.pos = PackageIn.HEADER_SIZE;
  //     message = message["__proto__"].constructor.decode(new Uint8Array(this.__getBuffer()));
  //     return message;
  // }

  public get code(): number {
    return this._code;
  }

  public get clientId(): number {
    return this._clientId;
  }

  public get extend1(): number {
    return this._extend1;
  }

  public get extend2(): number {
    return this._extend2;
  }

  public set updateLeftTime(value: number) {
    this._extend2 = value;
  }

  public get Len(): number {
    return this._len;
  }

  public calculateCheckSum(): number {
    let val1: number = 0x77;
    let i: number = 6;

    while (i < this.length) {
      val1 += this._byteAt_(i++);
    }
    return val1 & 0x7f7f;
  }

  public readDateString(): string {
    return (
      this.readShort() +
      "-" +
      this.readByte() +
      "-" +
      this.readByte() +
      " " +
      this.readByte() +
      ":" +
      this.readByte() +
      ":" +
      this.readByte()
    );
  }

  public readDate(): Date {
    let year: number = this.readShort();
    let month: number = this.readByte() - 1;
    let day: number = this.readByte();
    let hours: number = this.readByte();
    let minutes: number = this.readByte();
    let seconds: number = this.readByte();
    let date: Date = new Date(year, month, day, hours, minutes, seconds);
    return date;
  }

  public readByteArray(): ByteArray {
    let temp: ByteArray = new ByteArray(this._len - this.pos);
    this.readBytes(temp, 0, this._len - this.pos);
    temp.pos = 0;
    return temp;
  }

  public deCompress() {
    this.pos = PackageIn.HEADER_SIZE;
    let temp: ByteArray = new ByteArray(this._len - PackageIn.HEADER_SIZE);
    this.readBytes(temp, 0, this._len - PackageIn.HEADER_SIZE);
    temp.uncompress();
    this.pos = PackageIn.HEADER_SIZE;
    this.writeBytes(temp, 0, temp.length);
    this._len = PackageIn.HEADER_SIZE + temp.length;
    this.pos = PackageIn.HEADER_SIZE;
  }
}
