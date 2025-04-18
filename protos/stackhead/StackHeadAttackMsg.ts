// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: stackhead/StackHeadAttackMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.stackhead";

export interface StackHeadAttackMsg {
  fromPos: number;
  toPos: number;
  totalCount: number;
  changeCount: number;
}

function createBaseStackHeadAttackMsg(): StackHeadAttackMsg {
  return { fromPos: 0, toPos: 0, totalCount: 0, changeCount: 0 };
}

export const StackHeadAttackMsg: MessageFns<StackHeadAttackMsg> = {
  encode(message: StackHeadAttackMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.fromPos !== 0) {
      writer.uint32(8).int32(message.fromPos);
    }
    if (message.toPos !== 0) {
      writer.uint32(16).int32(message.toPos);
    }
    if (message.totalCount !== 0) {
      writer.uint32(24).int32(message.totalCount);
    }
    if (message.changeCount !== 0) {
      writer.uint32(32).int32(message.changeCount);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): StackHeadAttackMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStackHeadAttackMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.fromPos = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.toPos = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.totalCount = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.changeCount = reader.int32();
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

  fromJSON(object: any): StackHeadAttackMsg {
    return {
      fromPos: isSet(object.fromPos) ? globalThis.Number(object.fromPos) : 0,
      toPos: isSet(object.toPos) ? globalThis.Number(object.toPos) : 0,
      totalCount: isSet(object.totalCount) ? globalThis.Number(object.totalCount) : 0,
      changeCount: isSet(object.changeCount) ? globalThis.Number(object.changeCount) : 0,
    };
  },

  toJSON(message: StackHeadAttackMsg): unknown {
    const obj: any = {};
    if (message.fromPos !== 0) {
      obj.fromPos = Math.round(message.fromPos);
    }
    if (message.toPos !== 0) {
      obj.toPos = Math.round(message.toPos);
    }
    if (message.totalCount !== 0) {
      obj.totalCount = Math.round(message.totalCount);
    }
    if (message.changeCount !== 0) {
      obj.changeCount = Math.round(message.changeCount);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StackHeadAttackMsg>, I>>(base?: I): StackHeadAttackMsg {
    return StackHeadAttackMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StackHeadAttackMsg>, I>>(object: I): StackHeadAttackMsg {
    const message = createBaseStackHeadAttackMsg();
    message.fromPos = object.fromPos ?? 0;
    message.toPos = object.toPos ?? 0;
    message.totalCount = object.totalCount ?? 0;
    message.changeCount = object.changeCount ?? 0;
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
