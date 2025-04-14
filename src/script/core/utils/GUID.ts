/**
 *
 */
export default class GUID {
  private static counter: number = 0;

  public create(): string {
    var id1: number = new Date().getTime();
    var id2: number = Math.random() * Number.MAX_VALUE;
    // JH DotComIt 11/1/06 changed casing on system.capabilities
    //			var id3:string = System.capabilities.serverString;
    // A=t&SA=t&SV=t&EV=t&MP3=t&AE=t&VE=t&ACC=f&PR=t&SP=t&SB=f&DEB=t&V=WIN%209%2C0%2C45%2C0&M=Adobe%20Windows&R=1024x768&DP=72&COL=color&AR=1.0&OS=Windows&L=zh-CN&IME=t&PT=External&AVD=f&LFD=f&WD=f&TLS=t
    // var id3:string = Capabilities.serverString;
    var id3: string = "";
    return this.calculate(id1 + id3 + id2 + GUID.counter++);
  }

  public calculate(src: string): string {
    return this.hex_sha1(src);
  }

  /**
   * Private methods.
   */
  // JH DotComIT 11/1/06 removed static
  private hex_sha1(src: string): string {
    return this.binb2hex(this.core_sha1(this.str2binb(src), src.length * 8));
  }

  private core_sha1(x: Array<any>, len: number): Array<any> {
    x[len >> 5] |= 0x80 << (24 - (len % 32));
    x[(((len + 64) >> 9) << 4) + 15] = len;
    var w: Array<any> = new Array(80),
      a: number = 1732584193;
    var b: number = -271733879,
      c: number = -1732584194;
    var d: number = 271733878,
      e: number = -1009589776;
    for (var i: number = 0; i < x.length; i += 16) {
      var olda: number = a,
        oldb: number = b;
      var oldc: number = c,
        oldd: number = d,
        olde: number = e;
      for (var j: number = 0; j < 80; j++) {
        if (j < 16) w[j] = x[i + j];
        else w[j] = this.rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
        var t: number = this.safe_add(
          this.safe_add(this.rol(a, 5), this.sha1_ft(j, b, c, d)),
          this.safe_add(this.safe_add(e, w[j]), this.sha1_kt(j)),
        );
        e = d;
        d = c;
        c = this.rol(b, 30);
        b = a;
        a = t;
      }
      a = this.safe_add(a, olda);
      b = this.safe_add(b, oldb);
      c = this.safe_add(c, oldc);
      d = this.safe_add(d, oldd);
      e = this.safe_add(e, olde);
    }
    return [a, b, c, d, e];
  }

  // JH DotComIT 11/1/06 removed static
  private sha1_ft(t: number, b: number, c: number, d: number): number {
    if (t < 20) return (b & c) | (~b & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);
    return b ^ c ^ d;
  }

  // JH DotComIT 11/1/06 removed static
  private sha1_kt(t: number): number {
    return t < 20
      ? 1518500249
      : t < 40
        ? 1859775393
        : t < 60
          ? -1894007588
          : -899497514;
  }

  // JH DotComIT 11/1/06 removed static
  private safe_add(x: number, y: number): number {
    var lsw: number = (x & 0xffff) + (y & 0xffff);
    var msw: number = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  // JH DotComIT 11/1/06 removed static
  private rol(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  // JH DotComIT 11/1/06 removed static
  private str2binb(str: string): Array<any> {
    var bin = [];
    var mask: number = (1 << 8) - 1;
    for (var i: number = 0; i < str.length * 8; i += 8) {
      bin[i >> 5] |= (str.charCodeAt(i / 8) & mask) << (24 - (i % 32));
    }
    return bin;
  }

  // JH DotComIT 11/1/06 removed static
  private binb2hex(binarray: Array<any>): string {
    var str: string = "";
    var tab: string = "0123456789abcdef";
    for (var i: number = 0; i < binarray.length * 4; i++) {
      str +=
        tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8 + 4)) & 0xf) +
        tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 0xf);
    }
    return str;
  }
}
