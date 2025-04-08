declare namespace Zlib {
  class Inflate {
    constructor(options?: any);
    public push(data: Uint8Array, mode?: number): any;
    public decompress(): any;
  }

  class Gzip {
    constructor(options?: any);
    public push(data: Uint8Array, mode?: number): any;
  }

  class Deflate {
    constructor(options?: any);
    public push(data: Uint8Array, mode?: number): any;
    public compress(): any;
  }

  class GzipHeader {
    public static FEXTRA: number;
    public static FNAME: number;
    public static FCOMMENT: number;
    public static FHCRC: number;
  }

  class ZStream {
    public static Z_OK: number;
    public static Z_STREAM_END: number;
    public static Z_STREAM_ERROR: number;
    public static Z_DATA_ERROR: number;
    public static Z_MEM_ERROR: number;
    public static Z_BUF_ERROR: number;
    public static Z_NO_FLUSH: number;
    public static Z_PARTIAL_FLUSH: number;
    public static Z_SYNC_FLUSH: number;
    public static Z_FULL_FLUSH: number;
    public static Z_FINISH: number;
  }
}
