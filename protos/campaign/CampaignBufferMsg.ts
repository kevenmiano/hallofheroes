// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: campaign/CampaignBufferMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.campaign";

export interface CampaignBufferMsg {
  armyId: number;
  bufferInfo: number[];
  property1: number;
  property2: number;
  property3: number;
}

function createBaseCampaignBufferMsg(): CampaignBufferMsg {
  return { armyId: 0, bufferInfo: [], property1: 0, property2: 0, property3: 0 };
}

export const CampaignBufferMsg: MessageFns<CampaignBufferMsg> = {
  encode(message: CampaignBufferMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.armyId !== 0) {
      writer.uint32(8).int32(message.armyId);
    }
    writer.uint32(18).fork();
    for (const v of message.bufferInfo) {
      writer.int32(v);
    }
    writer.join();
    if (message.property1 !== 0) {
      writer.uint32(24).int32(message.property1);
    }
    if (message.property2 !== 0) {
      writer.uint32(32).int32(message.property2);
    }
    if (message.property3 !== 0) {
      writer.uint32(40).int32(message.property3);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CampaignBufferMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCampaignBufferMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.armyId = reader.int32();
          continue;
        }
        case 2: {
          if (tag === 16) {
            message.bufferInfo.push(reader.int32());

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.bufferInfo.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.property1 = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.property2 = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.property3 = reader.int32();
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

  fromJSON(object: any): CampaignBufferMsg {
    return {
      armyId: isSet(object.armyId) ? globalThis.Number(object.armyId) : 0,
      bufferInfo: globalThis.Array.isArray(object?.bufferInfo)
        ? object.bufferInfo.map((e: any) => globalThis.Number(e))
        : [],
      property1: isSet(object.property1) ? globalThis.Number(object.property1) : 0,
      property2: isSet(object.property2) ? globalThis.Number(object.property2) : 0,
      property3: isSet(object.property3) ? globalThis.Number(object.property3) : 0,
    };
  },

  toJSON(message: CampaignBufferMsg): unknown {
    const obj: any = {};
    if (message.armyId !== 0) {
      obj.armyId = Math.round(message.armyId);
    }
    if (message.bufferInfo?.length) {
      obj.bufferInfo = message.bufferInfo.map((e) => Math.round(e));
    }
    if (message.property1 !== 0) {
      obj.property1 = Math.round(message.property1);
    }
    if (message.property2 !== 0) {
      obj.property2 = Math.round(message.property2);
    }
    if (message.property3 !== 0) {
      obj.property3 = Math.round(message.property3);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CampaignBufferMsg>, I>>(base?: I): CampaignBufferMsg {
    return CampaignBufferMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CampaignBufferMsg>, I>>(object: I): CampaignBufferMsg {
    const message = createBaseCampaignBufferMsg();
    message.armyId = object.armyId ?? 0;
    message.bufferInfo = object.bufferInfo?.map((e) => e) || [];
    message.property1 = object.property1 ?? 0;
    message.property2 = object.property2 ?? 0;
    message.property3 = object.property3 ?? 0;
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
