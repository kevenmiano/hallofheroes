declare namespace protobuf {
  class Reader {
    constructor(buffer: Uint8Array);
    public static create(buffer: Uint8Array): Reader;
    public static create(buffer: ArrayBuffer): Reader;
    public static create(buffer: ArrayBufferView): Reader;
    public static create(buffer: string): Reader;
    public static create(buffer: number[]): Reader;
    public static create(buffer: any): Reader;
    public uint32(): number;
    public int32(): number;
    public sint32(): number;
    public fixed32(): number;
    public sfixed32(): number;
    public float(): number;
    public double(): number;
    public bool(): boolean;
  }

  class Message<T> {
    constructor(properties?: T);
    public static create<T>(properties?: T): Message<T>;
    public static encode<T>(message: Message<T>, writer?: Writer): Writer;
    public static decode<T>(reader: Reader | Uint8Array): Message<T>;
  }

  class Writer {
    constructor(buffer?: Uint8Array);
    public static create(buffer?: Uint8Array): Writer;
    public static encode<T>(message: Message<T>, writer?: Writer): Writer;
    public static encodeDelimited<T>(
      message: Message<T>,
      writer?: Writer
    ): Writer;
    public static decodeDelimited<T>(reader: Reader | Uint8Array): Message<T>;
    public fork(): Writer;
    public ldelim(): Writer;
    public finish(): Uint8Array;
  }
}
