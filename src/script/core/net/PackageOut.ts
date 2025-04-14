import ByteArray from "./ByteArray.js";

export class PackageOut extends ByteArray {
  public static HEADER: number = 0x71ab;

  private _checksum: number;
  public static clientId: number = 0;
  private _code: number;

  public constructor(
    code: number,
    toId: number = 0,
    extend1: number = 0,
    extend2: number = 0,
  ) {
    super();

    // this.endian = Laya.Socket.BIG_ENDIAN;//不设置就是默认大端
    this.writeShort(PackageOut.HEADER); //标志符
    this.writeShort(0x00); //长度
    this.writeShort(0x00); //check sum
    this.writeShort(code); //协议号
    if (toId == 0) {
      toId = PackageOut.clientId;
    }
    this.writeInt(toId);
    this.writeInt(extend1);
    this.writeInt(extend2);
    this._code = code;
    this._checksum = 0;
  }

  public pack() {
    this._checksum = this.calculateCheckSum();
    let temp: ByteArray = new ByteArray();
    temp.writeShort(this.length);
    temp.writeShort(this._checksum);

    // this._byteSet_(2, temp._byteAt_(0));
    // this._byteSet_(3, temp._byteAt_(1));
    // this._byteSet_(4, temp._byteAt_(2));
    // this._byteSet_(5, temp._byteAt_(3));

    this._byteView_[2] = temp._byteView_[0];
    this._byteView_[3] = temp._byteView_[1];
    this._byteView_[4] = temp._byteView_[2];
    this._byteView_[5] = temp._byteView_[3];
  }

  public calculateCheckSum(): number {
    let val1: number = 0x77;
    let i: number = 6;
    while (i < this.length) {
      val1 += this._byteAt_(i++);
    }

    return val1 & 0x7f7f;
  }

  public writeDate(date: Date) {
    this.writeShort(date.getFullYear());
    this.writeByte(date.getMonth() + 1);
    this.writeByte(date.getDay());
    this.writeByte(date.getHours());
    this.writeByte(date.getMinutes());
    this.writeByte(date.getSeconds());
  }

  public get code(): number {
    return this._code;
  }
}
