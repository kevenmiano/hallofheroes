// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: guildcampaign/GuildOrderInfoMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.guildcampaign";

export interface GuildOrderInfoMsg {
  order: number;
  id: number;
  name: string;
  count: number;
  power: number;
  chairmanName: string;
}

function createBaseGuildOrderInfoMsg(): GuildOrderInfoMsg {
  return { order: 0, id: 0, name: "", count: 0, power: 0, chairmanName: "" };
}

export const GuildOrderInfoMsg: MessageFns<GuildOrderInfoMsg> = {
  encode(message: GuildOrderInfoMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.order !== 0) {
      writer.uint32(8).int32(message.order);
    }
    if (message.id !== 0) {
      writer.uint32(16).int32(message.id);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    if (message.count !== 0) {
      writer.uint32(32).int32(message.count);
    }
    if (message.power !== 0) {
      writer.uint32(40).int32(message.power);
    }
    if (message.chairmanName !== "") {
      writer.uint32(50).string(message.chairmanName);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GuildOrderInfoMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGuildOrderInfoMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.order = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.id = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.name = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.count = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.power = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.chairmanName = reader.string();
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

  fromJSON(object: any): GuildOrderInfoMsg {
    return {
      order: isSet(object.order) ? globalThis.Number(object.order) : 0,
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      count: isSet(object.count) ? globalThis.Number(object.count) : 0,
      power: isSet(object.power) ? globalThis.Number(object.power) : 0,
      chairmanName: isSet(object.chairmanName) ? globalThis.String(object.chairmanName) : "",
    };
  },

  toJSON(message: GuildOrderInfoMsg): unknown {
    const obj: any = {};
    if (message.order !== 0) {
      obj.order = Math.round(message.order);
    }
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.count !== 0) {
      obj.count = Math.round(message.count);
    }
    if (message.power !== 0) {
      obj.power = Math.round(message.power);
    }
    if (message.chairmanName !== "") {
      obj.chairmanName = message.chairmanName;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GuildOrderInfoMsg>, I>>(base?: I): GuildOrderInfoMsg {
    return GuildOrderInfoMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GuildOrderInfoMsg>, I>>(object: I): GuildOrderInfoMsg {
    const message = createBaseGuildOrderInfoMsg();
    message.order = object.order ?? 0;
    message.id = object.id ?? 0;
    message.name = object.name ?? "";
    message.count = object.count ?? 0;
    message.power = object.power ?? 0;
    message.chairmanName = object.chairmanName ?? "";
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
