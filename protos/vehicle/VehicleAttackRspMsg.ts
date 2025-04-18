// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: vehicle/VehicleAttackRspMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.vehicle";

export interface VehicleAttackRspMsg {
  skillId: string;
  npcHurtDataList: number[];
  playerHurtDataList: number[];
  effectX: string;
  effectY: string;
  attackerId: string;
  serverName: string;
  attackTyep: string;
}

function createBaseVehicleAttackRspMsg(): VehicleAttackRspMsg {
  return {
    skillId: "",
    npcHurtDataList: [],
    playerHurtDataList: [],
    effectX: "",
    effectY: "",
    attackerId: "",
    serverName: "",
    attackTyep: "",
  };
}

export const VehicleAttackRspMsg: MessageFns<VehicleAttackRspMsg> = {
  encode(message: VehicleAttackRspMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.skillId !== "") {
      writer.uint32(10).string(message.skillId);
    }
    writer.uint32(18).fork();
    for (const v of message.npcHurtDataList) {
      writer.int32(v);
    }
    writer.join();
    writer.uint32(26).fork();
    for (const v of message.playerHurtDataList) {
      writer.int32(v);
    }
    writer.join();
    if (message.effectX !== "") {
      writer.uint32(34).string(message.effectX);
    }
    if (message.effectY !== "") {
      writer.uint32(42).string(message.effectY);
    }
    if (message.attackerId !== "") {
      writer.uint32(50).string(message.attackerId);
    }
    if (message.serverName !== "") {
      writer.uint32(58).string(message.serverName);
    }
    if (message.attackTyep !== "") {
      writer.uint32(66).string(message.attackTyep);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): VehicleAttackRspMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVehicleAttackRspMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.skillId = reader.string();
          continue;
        }
        case 2: {
          if (tag === 16) {
            message.npcHurtDataList.push(reader.int32());

            continue;
          }

          if (tag === 18) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.npcHurtDataList.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 3: {
          if (tag === 24) {
            message.playerHurtDataList.push(reader.int32());

            continue;
          }

          if (tag === 26) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.playerHurtDataList.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.effectX = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.effectY = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.attackerId = reader.string();
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }

          message.serverName = reader.string();
          continue;
        }
        case 8: {
          if (tag !== 66) {
            break;
          }

          message.attackTyep = reader.string();
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

  fromJSON(object: any): VehicleAttackRspMsg {
    return {
      skillId: isSet(object.skillId) ? globalThis.String(object.skillId) : "",
      npcHurtDataList: globalThis.Array.isArray(object?.npcHurtDataList)
        ? object.npcHurtDataList.map((e: any) => globalThis.Number(e))
        : [],
      playerHurtDataList: globalThis.Array.isArray(object?.playerHurtDataList)
        ? object.playerHurtDataList.map((e: any) => globalThis.Number(e))
        : [],
      effectX: isSet(object.effectX) ? globalThis.String(object.effectX) : "",
      effectY: isSet(object.effectY) ? globalThis.String(object.effectY) : "",
      attackerId: isSet(object.attackerId) ? globalThis.String(object.attackerId) : "",
      serverName: isSet(object.serverName) ? globalThis.String(object.serverName) : "",
      attackTyep: isSet(object.attackTyep) ? globalThis.String(object.attackTyep) : "",
    };
  },

  toJSON(message: VehicleAttackRspMsg): unknown {
    const obj: any = {};
    if (message.skillId !== "") {
      obj.skillId = message.skillId;
    }
    if (message.npcHurtDataList?.length) {
      obj.npcHurtDataList = message.npcHurtDataList.map((e) => Math.round(e));
    }
    if (message.playerHurtDataList?.length) {
      obj.playerHurtDataList = message.playerHurtDataList.map((e) => Math.round(e));
    }
    if (message.effectX !== "") {
      obj.effectX = message.effectX;
    }
    if (message.effectY !== "") {
      obj.effectY = message.effectY;
    }
    if (message.attackerId !== "") {
      obj.attackerId = message.attackerId;
    }
    if (message.serverName !== "") {
      obj.serverName = message.serverName;
    }
    if (message.attackTyep !== "") {
      obj.attackTyep = message.attackTyep;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<VehicleAttackRspMsg>, I>>(base?: I): VehicleAttackRspMsg {
    return VehicleAttackRspMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<VehicleAttackRspMsg>, I>>(object: I): VehicleAttackRspMsg {
    const message = createBaseVehicleAttackRspMsg();
    message.skillId = object.skillId ?? "";
    message.npcHurtDataList = object.npcHurtDataList?.map((e) => e) || [];
    message.playerHurtDataList = object.playerHurtDataList?.map((e) => e) || [];
    message.effectX = object.effectX ?? "";
    message.effectY = object.effectY ?? "";
    message.attackerId = object.attackerId ?? "";
    message.serverName = object.serverName ?? "";
    message.attackTyep = object.attackTyep ?? "";
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
