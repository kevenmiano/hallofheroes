// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: vip/VipBoxDropMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.vip";

export interface VipBoxDropMsg {
  weekGiftDate: string;
}

function createBaseVipBoxDropMsg(): VipBoxDropMsg {
  return { weekGiftDate: "" };
}

export const VipBoxDropMsg: MessageFns<VipBoxDropMsg> = {
  encode(message: VipBoxDropMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.weekGiftDate !== "") {
      writer.uint32(10).string(message.weekGiftDate);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): VipBoxDropMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVipBoxDropMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.weekGiftDate = reader.string();
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

  fromJSON(object: any): VipBoxDropMsg {
    return { weekGiftDate: isSet(object.weekGiftDate) ? globalThis.String(object.weekGiftDate) : "" };
  },

  toJSON(message: VipBoxDropMsg): unknown {
    const obj: any = {};
    if (message.weekGiftDate !== "") {
      obj.weekGiftDate = message.weekGiftDate;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VipBoxDropMsg>, I>>(base?: I): VipBoxDropMsg {
    return VipBoxDropMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VipBoxDropMsg>, I>>(object: I): VipBoxDropMsg {
    const message = createBaseVipBoxDropMsg();
    message.weekGiftDate = object.weekGiftDate ?? "";
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
