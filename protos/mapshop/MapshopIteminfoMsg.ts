// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: mapshop/MapshopIteminfoMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.mapshop";

export interface MapshopIteminfoMsg {
  mapshopitemid: number;
  mapshopcostid: number;
  isbuy: boolean;
  index: number;
  count: number;
}

function createBaseMapshopIteminfoMsg(): MapshopIteminfoMsg {
  return { mapshopitemid: 0, mapshopcostid: 0, isbuy: false, index: 0, count: 0 };
}

export const MapshopIteminfoMsg: MessageFns<MapshopIteminfoMsg> = {
  encode(message: MapshopIteminfoMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.mapshopitemid !== 0) {
      writer.uint32(8).int32(message.mapshopitemid);
    }
    if (message.mapshopcostid !== 0) {
      writer.uint32(16).int32(message.mapshopcostid);
    }
    if (message.isbuy !== false) {
      writer.uint32(24).bool(message.isbuy);
    }
    if (message.index !== 0) {
      writer.uint32(32).int32(message.index);
    }
    if (message.count !== 0) {
      writer.uint32(40).int32(message.count);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MapshopIteminfoMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMapshopIteminfoMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.mapshopitemid = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.mapshopcostid = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.isbuy = reader.bool();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.index = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.count = reader.int32();
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

  fromJSON(object: any): MapshopIteminfoMsg {
    return {
      mapshopitemid: isSet(object.mapshopitemid) ? globalThis.Number(object.mapshopitemid) : 0,
      mapshopcostid: isSet(object.mapshopcostid) ? globalThis.Number(object.mapshopcostid) : 0,
      isbuy: isSet(object.isbuy) ? globalThis.Boolean(object.isbuy) : false,
      index: isSet(object.index) ? globalThis.Number(object.index) : 0,
      count: isSet(object.count) ? globalThis.Number(object.count) : 0,
    };
  },

  toJSON(message: MapshopIteminfoMsg): unknown {
    const obj: any = {};
    if (message.mapshopitemid !== 0) {
      obj.mapshopitemid = Math.round(message.mapshopitemid);
    }
    if (message.mapshopcostid !== 0) {
      obj.mapshopcostid = Math.round(message.mapshopcostid);
    }
    if (message.isbuy !== false) {
      obj.isbuy = message.isbuy;
    }
    if (message.index !== 0) {
      obj.index = Math.round(message.index);
    }
    if (message.count !== 0) {
      obj.count = Math.round(message.count);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MapshopIteminfoMsg>, I>>(base?: I): MapshopIteminfoMsg {
    return MapshopIteminfoMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MapshopIteminfoMsg>, I>>(object: I): MapshopIteminfoMsg {
    const message = createBaseMapshopIteminfoMsg();
    message.mapshopitemid = object.mapshopitemid ?? 0;
    message.mapshopcostid = object.mapshopcostid ?? 0;
    message.isbuy = object.isbuy ?? false;
    message.index = object.index ?? 0;
    message.count = object.count ?? 0;
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
