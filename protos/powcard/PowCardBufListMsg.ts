// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: powcard/PowCardBufListMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.powcard";

export interface PowCardBufListMsg {
  bufInfos: number[];
}

function createBasePowCardBufListMsg(): PowCardBufListMsg {
  return { bufInfos: [] };
}

export const PowCardBufListMsg: MessageFns<PowCardBufListMsg> = {
  encode(
    message: PowCardBufListMsg,
    writer: BinaryWriter = new BinaryWriter(),
  ): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.bufInfos) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PowCardBufListMsg {
    const reader =
      input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePowCardBufListMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag === 8) {
            message.bufInfos.push(reader.int32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.bufInfos.push(reader.int32());
            }

            continue;
          }

          break;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PowCardBufListMsg {
    return {
      bufInfos: globalThis.Array.isArray(object?.bufInfos)
        ? object.bufInfos.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: PowCardBufListMsg): unknown {
    const obj: any = {};
    if (message.bufInfos?.length) {
      obj.bufInfos = message.bufInfos.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PowCardBufListMsg>, I>>(
    base?: I,
  ): PowCardBufListMsg {
    return PowCardBufListMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PowCardBufListMsg>, I>>(
    object: I,
  ): PowCardBufListMsg {
    const message = createBasePowCardBufListMsg();
    message.bufInfos = object.bufInfos?.map((e) => e) || [];
    return message;
  },
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends globalThis.Array<infer U>
    ? globalThis.Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : T extends {}
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
