// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: building/BuildingOptionReqMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.building";

export interface BuildingOptionReqMsg {
  buildingId: number;
  sonType: number;
}

function createBaseBuildingOptionReqMsg(): BuildingOptionReqMsg {
  return { buildingId: 0, sonType: 0 };
}

export const BuildingOptionReqMsg: MessageFns<BuildingOptionReqMsg> = {
  encode(message: BuildingOptionReqMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.buildingId !== 0) {
      writer.uint32(8).int32(message.buildingId);
    }
    if (message.sonType !== 0) {
      writer.uint32(16).int32(message.sonType);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): BuildingOptionReqMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBuildingOptionReqMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.buildingId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.sonType = reader.int32();
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

  fromJSON(object: any): BuildingOptionReqMsg {
    return {
      buildingId: isSet(object.buildingId) ? globalThis.Number(object.buildingId) : 0,
      sonType: isSet(object.sonType) ? globalThis.Number(object.sonType) : 0,
    };
  },

  toJSON(message: BuildingOptionReqMsg): unknown {
    const obj: any = {};
    if (message.buildingId !== 0) {
      obj.buildingId = Math.round(message.buildingId);
    }
    if (message.sonType !== 0) {
      obj.sonType = Math.round(message.sonType);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<BuildingOptionReqMsg>, I>>(base?: I): BuildingOptionReqMsg {
    return BuildingOptionReqMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<BuildingOptionReqMsg>, I>>(object: I): BuildingOptionReqMsg {
    const message = createBaseBuildingOptionReqMsg();
    message.buildingId = object.buildingId ?? 0;
    message.sonType = object.sonType ?? 0;
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
