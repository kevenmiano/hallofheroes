// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: stackhead/StackHeadSelfMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.stackhead";

export interface StackHeadSelfMsg {
  uid: string;
  actionPoint: number;
  readyBuffCount: number;
  weekPoint: number;
}

function createBaseStackHeadSelfMsg(): StackHeadSelfMsg {
  return { uid: "", actionPoint: 0, readyBuffCount: 0, weekPoint: 0 };
}

export const StackHeadSelfMsg: MessageFns<StackHeadSelfMsg> = {
  encode(message: StackHeadSelfMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.uid !== "") {
      writer.uint32(10).string(message.uid);
    }
    if (message.actionPoint !== 0) {
      writer.uint32(16).int32(message.actionPoint);
    }
    if (message.readyBuffCount !== 0) {
      writer.uint32(24).int32(message.readyBuffCount);
    }
    if (message.weekPoint !== 0) {
      writer.uint32(32).int32(message.weekPoint);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): StackHeadSelfMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStackHeadSelfMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.uid = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.actionPoint = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.readyBuffCount = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.weekPoint = reader.int32();
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

  fromJSON(object: any): StackHeadSelfMsg {
    return {
      uid: isSet(object.uid) ? globalThis.String(object.uid) : "",
      actionPoint: isSet(object.actionPoint) ? globalThis.Number(object.actionPoint) : 0,
      readyBuffCount: isSet(object.readyBuffCount) ? globalThis.Number(object.readyBuffCount) : 0,
      weekPoint: isSet(object.weekPoint) ? globalThis.Number(object.weekPoint) : 0,
    };
  },

  toJSON(message: StackHeadSelfMsg): unknown {
    const obj: any = {};
    if (message.uid !== "") {
      obj.uid = message.uid;
    }
    if (message.actionPoint !== 0) {
      obj.actionPoint = Math.round(message.actionPoint);
    }
    if (message.readyBuffCount !== 0) {
      obj.readyBuffCount = Math.round(message.readyBuffCount);
    }
    if (message.weekPoint !== 0) {
      obj.weekPoint = Math.round(message.weekPoint);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StackHeadSelfMsg>, I>>(base?: I): StackHeadSelfMsg {
    return StackHeadSelfMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StackHeadSelfMsg>, I>>(object: I): StackHeadSelfMsg {
    const message = createBaseStackHeadSelfMsg();
    message.uid = object.uid ?? "";
    message.actionPoint = object.actionPoint ?? 0;
    message.readyBuffCount = object.readyBuffCount ?? 0;
    message.weekPoint = object.weekPoint ?? 0;
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
