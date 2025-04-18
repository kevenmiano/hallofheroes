// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: farm/FarmOperReqMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.farm";

export interface FarmOperReqMsg {
  userId: number;
  friendId: number;
  opType: number;
  pos: number;
  templateId: number;
  payType: number;
  bagPos: number;
}

function createBaseFarmOperReqMsg(): FarmOperReqMsg {
  return { userId: 0, friendId: 0, opType: 0, pos: 0, templateId: 0, payType: 0, bagPos: 0 };
}

export const FarmOperReqMsg: MessageFns<FarmOperReqMsg> = {
  encode(message: FarmOperReqMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.userId !== 0) {
      writer.uint32(8).int32(message.userId);
    }
    if (message.friendId !== 0) {
      writer.uint32(16).int32(message.friendId);
    }
    if (message.opType !== 0) {
      writer.uint32(24).int32(message.opType);
    }
    if (message.pos !== 0) {
      writer.uint32(32).int32(message.pos);
    }
    if (message.templateId !== 0) {
      writer.uint32(40).int32(message.templateId);
    }
    if (message.payType !== 0) {
      writer.uint32(48).int32(message.payType);
    }
    if (message.bagPos !== 0) {
      writer.uint32(56).int32(message.bagPos);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): FarmOperReqMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFarmOperReqMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.userId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.friendId = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.opType = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.pos = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.templateId = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.payType = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.bagPos = reader.int32();
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

  fromJSON(object: any): FarmOperReqMsg {
    return {
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      friendId: isSet(object.friendId) ? globalThis.Number(object.friendId) : 0,
      opType: isSet(object.opType) ? globalThis.Number(object.opType) : 0,
      pos: isSet(object.pos) ? globalThis.Number(object.pos) : 0,
      templateId: isSet(object.templateId) ? globalThis.Number(object.templateId) : 0,
      payType: isSet(object.payType) ? globalThis.Number(object.payType) : 0,
      bagPos: isSet(object.bagPos) ? globalThis.Number(object.bagPos) : 0,
    };
  },

  toJSON(message: FarmOperReqMsg): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.friendId !== 0) {
      obj.friendId = Math.round(message.friendId);
    }
    if (message.opType !== 0) {
      obj.opType = Math.round(message.opType);
    }
    if (message.pos !== 0) {
      obj.pos = Math.round(message.pos);
    }
    if (message.templateId !== 0) {
      obj.templateId = Math.round(message.templateId);
    }
    if (message.payType !== 0) {
      obj.payType = Math.round(message.payType);
    }
    if (message.bagPos !== 0) {
      obj.bagPos = Math.round(message.bagPos);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FarmOperReqMsg>, I>>(base?: I): FarmOperReqMsg {
    return FarmOperReqMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FarmOperReqMsg>, I>>(object: I): FarmOperReqMsg {
    const message = createBaseFarmOperReqMsg();
    message.userId = object.userId ?? 0;
    message.friendId = object.friendId ?? 0;
    message.opType = object.opType ?? 0;
    message.pos = object.pos ?? 0;
    message.templateId = object.templateId ?? 0;
    message.payType = object.payType ?? 0;
    message.bagPos = object.bagPos ?? 0;
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
