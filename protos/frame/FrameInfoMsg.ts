// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: frame/FrameInfoMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.frame";

export interface FrameInfoMsg {
  frameId: number;
  isUse: number;
}

function createBaseFrameInfoMsg(): FrameInfoMsg {
  return { frameId: 0, isUse: 0 };
}

export const FrameInfoMsg: MessageFns<FrameInfoMsg> = {
  encode(message: FrameInfoMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.frameId !== 0) {
      writer.uint32(8).int32(message.frameId);
    }
    if (message.isUse !== 0) {
      writer.uint32(16).int32(message.isUse);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): FrameInfoMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFrameInfoMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.frameId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.isUse = reader.int32();
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

  fromJSON(object: any): FrameInfoMsg {
    return {
      frameId: isSet(object.frameId) ? globalThis.Number(object.frameId) : 0,
      isUse: isSet(object.isUse) ? globalThis.Number(object.isUse) : 0,
    };
  },

  toJSON(message: FrameInfoMsg): unknown {
    const obj: any = {};
    if (message.frameId !== 0) {
      obj.frameId = Math.round(message.frameId);
    }
    if (message.isUse !== 0) {
      obj.isUse = Math.round(message.isUse);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FrameInfoMsg>, I>>(base?: I): FrameInfoMsg {
    return FrameInfoMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FrameInfoMsg>, I>>(object: I): FrameInfoMsg {
    const message = createBaseFrameInfoMsg();
    message.frameId = object.frameId ?? 0;
    message.isUse = object.isUse ?? 0;
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
