// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: castle/CastleYieldMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.castle";

export interface CastleYieldMsg {
  goldYield: number;
  goldWildLandYield: number;
  goldTechnology: number;
  goldWonder: number;
  goldDower: number;
  goldTotalCount: number;
  goldMax: number;
  curPopulation: number;
  maxPopulation: number;
  wildYield: number[];
  crystalsCount: number;
  treasureMineYield: number[];
}

function createBaseCastleYieldMsg(): CastleYieldMsg {
  return {
    goldYield: 0,
    goldWildLandYield: 0,
    goldTechnology: 0,
    goldWonder: 0,
    goldDower: 0,
    goldTotalCount: 0,
    goldMax: 0,
    curPopulation: 0,
    maxPopulation: 0,
    wildYield: [],
    crystalsCount: 0,
    treasureMineYield: [],
  };
}

export const CastleYieldMsg: MessageFns<CastleYieldMsg> = {
  encode(message: CastleYieldMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.goldYield !== 0) {
      writer.uint32(8).int32(message.goldYield);
    }
    if (message.goldWildLandYield !== 0) {
      writer.uint32(16).int32(message.goldWildLandYield);
    }
    if (message.goldTechnology !== 0) {
      writer.uint32(24).int32(message.goldTechnology);
    }
    if (message.goldWonder !== 0) {
      writer.uint32(32).int32(message.goldWonder);
    }
    if (message.goldDower !== 0) {
      writer.uint32(40).int32(message.goldDower);
    }
    if (message.goldTotalCount !== 0) {
      writer.uint32(48).int32(message.goldTotalCount);
    }
    if (message.goldMax !== 0) {
      writer.uint32(56).int32(message.goldMax);
    }
    if (message.curPopulation !== 0) {
      writer.uint32(64).int32(message.curPopulation);
    }
    if (message.maxPopulation !== 0) {
      writer.uint32(72).int32(message.maxPopulation);
    }
    writer.uint32(82).fork();
    for (const v of message.wildYield) {
      writer.int32(v);
    }
    writer.join();
    if (message.crystalsCount !== 0) {
      writer.uint32(88).int32(message.crystalsCount);
    }
    writer.uint32(98).fork();
    for (const v of message.treasureMineYield) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CastleYieldMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCastleYieldMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.goldYield = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.goldWildLandYield = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.goldTechnology = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.goldWonder = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.goldDower = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.goldTotalCount = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.goldMax = reader.int32();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.curPopulation = reader.int32();
          continue;
        }
        case 9: {
          if (tag !== 72) {
            break;
          }

          message.maxPopulation = reader.int32();
          continue;
        }
        case 10: {
          if (tag === 80) {
            message.wildYield.push(reader.int32());

            continue;
          }

          if (tag === 82) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.wildYield.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 11: {
          if (tag !== 88) {
            break;
          }

          message.crystalsCount = reader.int32();
          continue;
        }
        case 12: {
          if (tag === 96) {
            message.treasureMineYield.push(reader.int32());

            continue;
          }

          if (tag === 98) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.treasureMineYield.push(reader.int32());
            }

            continue;
          }

          break;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CastleYieldMsg {
    return {
      goldYield: isSet(object.goldYield) ? globalThis.Number(object.goldYield) : 0,
      goldWildLandYield: isSet(object.goldWildLandYield) ? globalThis.Number(object.goldWildLandYield) : 0,
      goldTechnology: isSet(object.goldTechnology) ? globalThis.Number(object.goldTechnology) : 0,
      goldWonder: isSet(object.goldWonder) ? globalThis.Number(object.goldWonder) : 0,
      goldDower: isSet(object.goldDower) ? globalThis.Number(object.goldDower) : 0,
      goldTotalCount: isSet(object.goldTotalCount) ? globalThis.Number(object.goldTotalCount) : 0,
      goldMax: isSet(object.goldMax) ? globalThis.Number(object.goldMax) : 0,
      curPopulation: isSet(object.curPopulation) ? globalThis.Number(object.curPopulation) : 0,
      maxPopulation: isSet(object.maxPopulation) ? globalThis.Number(object.maxPopulation) : 0,
      wildYield: globalThis.Array.isArray(object?.wildYield)
        ? object.wildYield.map((e: any) => globalThis.Number(e))
        : [],
      crystalsCount: isSet(object.crystalsCount) ? globalThis.Number(object.crystalsCount) : 0,
      treasureMineYield: globalThis.Array.isArray(object?.treasureMineYield)
        ? object.treasureMineYield.map((e: any) => globalThis.Number(e))
        : [],
    };
  },

  toJSON(message: CastleYieldMsg): unknown {
    const obj: any = {};
    if (message.goldYield !== 0) {
      obj.goldYield = Math.round(message.goldYield);
    }
    if (message.goldWildLandYield !== 0) {
      obj.goldWildLandYield = Math.round(message.goldWildLandYield);
    }
    if (message.goldTechnology !== 0) {
      obj.goldTechnology = Math.round(message.goldTechnology);
    }
    if (message.goldWonder !== 0) {
      obj.goldWonder = Math.round(message.goldWonder);
    }
    if (message.goldDower !== 0) {
      obj.goldDower = Math.round(message.goldDower);
    }
    if (message.goldTotalCount !== 0) {
      obj.goldTotalCount = Math.round(message.goldTotalCount);
    }
    if (message.goldMax !== 0) {
      obj.goldMax = Math.round(message.goldMax);
    }
    if (message.curPopulation !== 0) {
      obj.curPopulation = Math.round(message.curPopulation);
    }
    if (message.maxPopulation !== 0) {
      obj.maxPopulation = Math.round(message.maxPopulation);
    }
    if (message.wildYield?.length) {
      obj.wildYield = message.wildYield.map((e) => Math.round(e));
    }
    if (message.crystalsCount !== 0) {
      obj.crystalsCount = Math.round(message.crystalsCount);
    }
    if (message.treasureMineYield?.length) {
      obj.treasureMineYield = message.treasureMineYield.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CastleYieldMsg>, I>>(base?: I): CastleYieldMsg {
    return CastleYieldMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CastleYieldMsg>, I>>(object: I): CastleYieldMsg {
    const message = createBaseCastleYieldMsg();
    message.goldYield = object.goldYield ?? 0;
    message.goldWildLandYield = object.goldWildLandYield ?? 0;
    message.goldTechnology = object.goldTechnology ?? 0;
    message.goldWonder = object.goldWonder ?? 0;
    message.goldDower = object.goldDower ?? 0;
    message.goldTotalCount = object.goldTotalCount ?? 0;
    message.goldMax = object.goldMax ?? 0;
    message.curPopulation = object.curPopulation ?? 0;
    message.maxPopulation = object.maxPopulation ?? 0;
    message.wildYield = object.wildYield?.map((e) => e) || [];
    message.crystalsCount = object.crystalsCount ?? 0;
    message.treasureMineYield = object.treasureMineYield?.map((e) => e) || [];
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
