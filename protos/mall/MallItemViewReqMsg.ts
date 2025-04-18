// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: mall/MallItemViewReqMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.mall";

export interface MallItemViewReqMsg {
  page: number;
  count: number;
  from: number;
  orderBy: number;
  orderType: number;
}

function createBaseMallItemViewReqMsg(): MallItemViewReqMsg {
  return { page: 0, count: 0, from: 0, orderBy: 0, orderType: 0 };
}

export const MallItemViewReqMsg: MessageFns<MallItemViewReqMsg> = {
  encode(message: MallItemViewReqMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.page !== 0) {
      writer.uint32(8).int32(message.page);
    }
    if (message.count !== 0) {
      writer.uint32(16).int32(message.count);
    }
    if (message.from !== 0) {
      writer.uint32(24).int32(message.from);
    }
    if (message.orderBy !== 0) {
      writer.uint32(32).int32(message.orderBy);
    }
    if (message.orderType !== 0) {
      writer.uint32(40).int32(message.orderType);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MallItemViewReqMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMallItemViewReqMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.page = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.count = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.from = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.orderBy = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.orderType = reader.int32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MallItemViewReqMsg {
    return {
      page: isSet(object.page) ? globalThis.Number(object.page) : 0,
      count: isSet(object.count) ? globalThis.Number(object.count) : 0,
      from: isSet(object.from) ? globalThis.Number(object.from) : 0,
      orderBy: isSet(object.orderBy) ? globalThis.Number(object.orderBy) : 0,
      orderType: isSet(object.orderType) ? globalThis.Number(object.orderType) : 0,
    };
  },

  toJSON(message: MallItemViewReqMsg): unknown {
    const obj: any = {};
    if (message.page !== 0) {
      obj.page = Math.round(message.page);
    }
    if (message.count !== 0) {
      obj.count = Math.round(message.count);
    }
    if (message.from !== 0) {
      obj.from = Math.round(message.from);
    }
    if (message.orderBy !== 0) {
      obj.orderBy = Math.round(message.orderBy);
    }
    if (message.orderType !== 0) {
      obj.orderType = Math.round(message.orderType);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MallItemViewReqMsg>, I>>(base?: I): MallItemViewReqMsg {
    return MallItemViewReqMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MallItemViewReqMsg>, I>>(object: I): MallItemViewReqMsg {
    const message = createBaseMallItemViewReqMsg();
    message.page = object.page ?? 0;
    message.count = object.count ?? 0;
    message.from = object.from ?? 0;
    message.orderBy = object.orderBy ?? 0;
    message.orderType = object.orderType ?? 0;
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
