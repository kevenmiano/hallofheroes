// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: pet/PetChallengeLogMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.pet";

export interface PetChallengeLogMsg {
  userId: number;
  tarUserId: number;
  tarNickName: string;
  result: number;
  isAttack: boolean;
  logDate: string;
  score: number;
  tarPets: string;
}

function createBasePetChallengeLogMsg(): PetChallengeLogMsg {
  return { userId: 0, tarUserId: 0, tarNickName: "", result: 0, isAttack: false, logDate: "", score: 0, tarPets: "" };
}

export const PetChallengeLogMsg: MessageFns<PetChallengeLogMsg> = {
  encode(message: PetChallengeLogMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.userId !== 0) {
      writer.uint32(8).int32(message.userId);
    }
    if (message.tarUserId !== 0) {
      writer.uint32(16).int32(message.tarUserId);
    }
    if (message.tarNickName !== "") {
      writer.uint32(26).string(message.tarNickName);
    }
    if (message.result !== 0) {
      writer.uint32(32).int32(message.result);
    }
    if (message.isAttack !== false) {
      writer.uint32(40).bool(message.isAttack);
    }
    if (message.logDate !== "") {
      writer.uint32(50).string(message.logDate);
    }
    if (message.score !== 0) {
      writer.uint32(56).int32(message.score);
    }
    if (message.tarPets !== "") {
      writer.uint32(66).string(message.tarPets);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PetChallengeLogMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePetChallengeLogMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.userId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.tarUserId = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.tarNickName = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.result = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.isAttack = reader.bool();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.logDate = reader.string();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.score = reader.int32();
          continue;
        }
        case 8: {
          if (tag !== 66) {
            break;
          }

          message.tarPets = reader.string();
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

  fromJSON(object: any): PetChallengeLogMsg {
    return {
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      tarUserId: isSet(object.tarUserId) ? globalThis.Number(object.tarUserId) : 0,
      tarNickName: isSet(object.tarNickName) ? globalThis.String(object.tarNickName) : "",
      result: isSet(object.result) ? globalThis.Number(object.result) : 0,
      isAttack: isSet(object.isAttack) ? globalThis.Boolean(object.isAttack) : false,
      logDate: isSet(object.logDate) ? globalThis.String(object.logDate) : "",
      score: isSet(object.score) ? globalThis.Number(object.score) : 0,
      tarPets: isSet(object.tarPets) ? globalThis.String(object.tarPets) : "",
    };
  },

  toJSON(message: PetChallengeLogMsg): unknown {
    const obj: any = {};
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.tarUserId !== 0) {
      obj.tarUserId = Math.round(message.tarUserId);
    }
    if (message.tarNickName !== "") {
      obj.tarNickName = message.tarNickName;
    }
    if (message.result !== 0) {
      obj.result = Math.round(message.result);
    }
    if (message.isAttack !== false) {
      obj.isAttack = message.isAttack;
    }
    if (message.logDate !== "") {
      obj.logDate = message.logDate;
    }
    if (message.score !== 0) {
      obj.score = Math.round(message.score);
    }
    if (message.tarPets !== "") {
      obj.tarPets = message.tarPets;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PetChallengeLogMsg>, I>>(base?: I): PetChallengeLogMsg {
    return PetChallengeLogMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PetChallengeLogMsg>, I>>(object: I): PetChallengeLogMsg {
    const message = createBasePetChallengeLogMsg();
    message.userId = object.userId ?? 0;
    message.tarUserId = object.tarUserId ?? 0;
    message.tarNickName = object.tarNickName ?? "";
    message.result = object.result ?? 0;
    message.isAttack = object.isAttack ?? false;
    message.logDate = object.logDate ?? "";
    message.score = object.score ?? 0;
    message.tarPets = object.tarPets ?? "";
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
