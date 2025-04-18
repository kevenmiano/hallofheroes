// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: player/CollectCampaignNodeMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.player";

export interface CollectCampaignNodeMsg {
  mastType: number;
  item: number;
  campaignDataId: number;
  sonType: number;
  name: string;
}

function createBaseCollectCampaignNodeMsg(): CollectCampaignNodeMsg {
  return { mastType: 0, item: 0, campaignDataId: 0, sonType: 0, name: "" };
}

export const CollectCampaignNodeMsg: MessageFns<CollectCampaignNodeMsg> = {
  encode(message: CollectCampaignNodeMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.mastType !== 0) {
      writer.uint32(8).int32(message.mastType);
    }
    if (message.item !== 0) {
      writer.uint32(16).int32(message.item);
    }
    if (message.campaignDataId !== 0) {
      writer.uint32(24).int32(message.campaignDataId);
    }
    if (message.sonType !== 0) {
      writer.uint32(32).int32(message.sonType);
    }
    if (message.name !== "") {
      writer.uint32(42).string(message.name);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CollectCampaignNodeMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCollectCampaignNodeMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.mastType = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.item = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.campaignDataId = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.sonType = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.name = reader.string();
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

  fromJSON(object: any): CollectCampaignNodeMsg {
    return {
      mastType: isSet(object.mastType) ? globalThis.Number(object.mastType) : 0,
      item: isSet(object.item) ? globalThis.Number(object.item) : 0,
      campaignDataId: isSet(object.campaignDataId) ? globalThis.Number(object.campaignDataId) : 0,
      sonType: isSet(object.sonType) ? globalThis.Number(object.sonType) : 0,
      name: isSet(object.name) ? globalThis.String(object.name) : "",
    };
  },

  toJSON(message: CollectCampaignNodeMsg): unknown {
    const obj: any = {};
    if (message.mastType !== 0) {
      obj.mastType = Math.round(message.mastType);
    }
    if (message.item !== 0) {
      obj.item = Math.round(message.item);
    }
    if (message.campaignDataId !== 0) {
      obj.campaignDataId = Math.round(message.campaignDataId);
    }
    if (message.sonType !== 0) {
      obj.sonType = Math.round(message.sonType);
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CollectCampaignNodeMsg>, I>>(base?: I): CollectCampaignNodeMsg {
    return CollectCampaignNodeMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CollectCampaignNodeMsg>, I>>(object: I): CollectCampaignNodeMsg {
    const message = createBaseCollectCampaignNodeMsg();
    message.mastType = object.mastType ?? 0;
    message.item = object.item ?? 0;
    message.campaignDataId = object.campaignDataId ?? 0;
    message.sonType = object.sonType ?? 0;
    message.name = object.name ?? "";
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
