// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: powcard/PowCardSuiteMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.powcard";

export interface PowCardSuiteMsg {
  suiteId: number;
  bufInfos: number[];
  cardInfos: number[];
}

function createBasePowCardSuiteMsg(): PowCardSuiteMsg {
  return { suiteId: 0, bufInfos: [], cardInfos: [] };
}

export const PowCardSuiteMsg: MessageFns<PowCardSuiteMsg> = {
  encode(message: PowCardSuiteMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.suiteId !== 0) {
      writer.uint32(8).int32(message.suiteId);
    }
    writer.uint32(18).fork();
    for (const v of message.bufInfos) {
      writer.int32(v);
    }
    writer.join();
    writer.uint32(26).fork();
    for (const v of message.cardInfos) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PowCardSuiteMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePowCardSuiteMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.suiteId = reader.int32();
          continue;
        }
        case 2: {
          if (tag === 16) {
            message.bufInfos.push(reader.int32());

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.bufInfos.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 3: {
          if (tag === 24) {
            message.cardInfos.push(reader.int32());

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.cardInfos.push(reader.int32());
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

  fromJSON(object: any): PowCardSuiteMsg {
    return {
      suiteId: isSet(object.suiteId) ? globalThis.Number(object.suiteId) : 0,
      bufInfos: globalThis.Array.isArray(object?.bufInfos) ? object.bufInfos.map((e: any) => globalThis.Number(e)) : [],
      cardInfos: globalThis.Array.isArray(object?.cardInfos)
        ? object.cardInfos.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: PowCardSuiteMsg): unknown {
    const obj: any = {};
    if (message.suiteId !== 0) {
      obj.suiteId = Math.round(message.suiteId);
    }
    if (message.bufInfos?.length) {
      obj.bufInfos = message.bufInfos.map((e) => Math.round(e));
    }
    if (message.cardInfos?.length) {
      obj.cardInfos = message.cardInfos.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PowCardSuiteMsg>, I>>(base?: I): PowCardSuiteMsg {
    return PowCardSuiteMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PowCardSuiteMsg>, I>>(object: I): PowCardSuiteMsg {
    const message = createBasePowCardSuiteMsg();
    message.suiteId = object.suiteId ?? 0;
    message.bufInfos = object.bufInfos?.map((e) => e) || [];
    message.cardInfos = object.cardInfos?.map((e) => e) || [];
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
