// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: simple/MallItemMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.simple";

export interface MallItemMsg {
  id: number;
  templateId: number;
  userId: number;
  nickName: string;
  point: number;
  fixPoint: number;
  hour: number;
  itemFrom: number;
  startTime: string;
  maxAuctionId: number;
  itemInfo: string;
}

function createBaseMallItemMsg(): MallItemMsg {
  return {
    id: 0,
    templateId: 0,
    userId: 0,
    nickName: "",
    point: 0,
    fixPoint: 0,
    hour: 0,
    itemFrom: 0,
    startTime: "",
    maxAuctionId: 0,
    itemInfo: "",
  };
}

export const MallItemMsg: MessageFns<MallItemMsg> = {
  encode(message: MallItemMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== 0) {
      writer.uint32(8).int32(message.id);
    }
    if (message.templateId !== 0) {
      writer.uint32(16).int32(message.templateId);
    }
    if (message.userId !== 0) {
      writer.uint32(24).int32(message.userId);
    }
    if (message.nickName !== "") {
      writer.uint32(34).string(message.nickName);
    }
    if (message.point !== 0) {
      writer.uint32(40).int32(message.point);
    }
    if (message.fixPoint !== 0) {
      writer.uint32(48).int32(message.fixPoint);
    }
    if (message.hour !== 0) {
      writer.uint32(56).int32(message.hour);
    }
    if (message.itemFrom !== 0) {
      writer.uint32(64).int32(message.itemFrom);
    }
    if (message.startTime !== "") {
      writer.uint32(74).string(message.startTime);
    }
    if (message.maxAuctionId !== 0) {
      writer.uint32(80).int32(message.maxAuctionId);
    }
    if (message.itemInfo !== "") {
      writer.uint32(90).string(message.itemInfo);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MallItemMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMallItemMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.id = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.templateId = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.userId = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.nickName = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.point = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.fixPoint = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.hour = reader.int32();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.itemFrom = reader.int32();
          continue;
        }
        case 9: {
          if (tag !== 74) {
            break;
          }

          message.startTime = reader.string();
          continue;
        }
        case 10: {
          if (tag !== 80) {
            break;
          }

          message.maxAuctionId = reader.int32();
          continue;
        }
        case 11: {
          if (tag !== 90) {
            break;
          }

          message.itemInfo = reader.string();
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

  fromJSON(object: any): MallItemMsg {
    return {
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
      templateId: isSet(object.templateId) ? globalThis.Number(object.templateId) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      nickName: isSet(object.nickName) ? globalThis.String(object.nickName) : "",
      point: isSet(object.point) ? globalThis.Number(object.point) : 0,
      fixPoint: isSet(object.fixPoint) ? globalThis.Number(object.fixPoint) : 0,
      hour: isSet(object.hour) ? globalThis.Number(object.hour) : 0,
      itemFrom: isSet(object.itemFrom) ? globalThis.Number(object.itemFrom) : 0,
      startTime: isSet(object.startTime) ? globalThis.String(object.startTime) : "",
      maxAuctionId: isSet(object.maxAuctionId) ? globalThis.Number(object.maxAuctionId) : 0,
      itemInfo: isSet(object.itemInfo) ? globalThis.String(object.itemInfo) : "",
    };
  },

  toJSON(message: MallItemMsg): unknown {
    const obj: any = {};
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    if (message.templateId !== 0) {
      obj.templateId = Math.round(message.templateId);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.nickName !== "") {
      obj.nickName = message.nickName;
    }
    if (message.point !== 0) {
      obj.point = Math.round(message.point);
    }
    if (message.fixPoint !== 0) {
      obj.fixPoint = Math.round(message.fixPoint);
    }
    if (message.hour !== 0) {
      obj.hour = Math.round(message.hour);
    }
    if (message.itemFrom !== 0) {
      obj.itemFrom = Math.round(message.itemFrom);
    }
    if (message.startTime !== "") {
      obj.startTime = message.startTime;
    }
    if (message.maxAuctionId !== 0) {
      obj.maxAuctionId = Math.round(message.maxAuctionId);
    }
    if (message.itemInfo !== "") {
      obj.itemInfo = message.itemInfo;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MallItemMsg>, I>>(base?: I): MallItemMsg {
    return MallItemMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MallItemMsg>, I>>(object: I): MallItemMsg {
    const message = createBaseMallItemMsg();
    message.id = object.id ?? 0;
    message.templateId = object.templateId ?? 0;
    message.userId = object.userId ?? 0;
    message.nickName = object.nickName ?? "";
    message.point = object.point ?? 0;
    message.fixPoint = object.fixPoint ?? 0;
    message.hour = object.hour ?? 0;
    message.itemFrom = object.itemFrom ?? 0;
    message.startTime = object.startTime ?? "";
    message.maxAuctionId = object.maxAuctionId ?? 0;
    message.itemInfo = object.itemInfo ?? "";
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
