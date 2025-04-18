// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: lucky/LordsMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.lucky";

export interface LordsMsg {
  army: string;
  id: number;
  userId: number;
  serverName: string;
  nickName: string;
  userKeys: string;
  fightPower: number;
  readyScore: number;
  readyOrder: number;
  finalScore: number;
  finalOrder: number;
  winCounter: number;
  currentTurn: number;
  finalTurn: number;
  finalWinCount: number;
  isVip: boolean;
  teamUid: string;
  uuid: string;
  teamName: string;
}

function createBaseLordsMsg(): LordsMsg {
  return {
    army: "",
    id: 0,
    userId: 0,
    serverName: "",
    nickName: "",
    userKeys: "",
    fightPower: 0,
    readyScore: 0,
    readyOrder: 0,
    finalScore: 0,
    finalOrder: 0,
    winCounter: 0,
    currentTurn: 0,
    finalTurn: 0,
    finalWinCount: 0,
    isVip: false,
    teamUid: "",
    uuid: "",
    teamName: "",
  };
}

export const LordsMsg: MessageFns<LordsMsg> = {
  encode(message: LordsMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.army !== "") {
      writer.uint32(10).string(message.army);
    }
    if (message.id !== 0) {
      writer.uint32(16).int32(message.id);
    }
    if (message.userId !== 0) {
      writer.uint32(24).int32(message.userId);
    }
    if (message.serverName !== "") {
      writer.uint32(34).string(message.serverName);
    }
    if (message.nickName !== "") {
      writer.uint32(42).string(message.nickName);
    }
    if (message.userKeys !== "") {
      writer.uint32(50).string(message.userKeys);
    }
    if (message.fightPower !== 0) {
      writer.uint32(56).int32(message.fightPower);
    }
    if (message.readyScore !== 0) {
      writer.uint32(64).int32(message.readyScore);
    }
    if (message.readyOrder !== 0) {
      writer.uint32(72).int32(message.readyOrder);
    }
    if (message.finalScore !== 0) {
      writer.uint32(80).int32(message.finalScore);
    }
    if (message.finalOrder !== 0) {
      writer.uint32(88).int32(message.finalOrder);
    }
    if (message.winCounter !== 0) {
      writer.uint32(96).int32(message.winCounter);
    }
    if (message.currentTurn !== 0) {
      writer.uint32(104).int32(message.currentTurn);
    }
    if (message.finalTurn !== 0) {
      writer.uint32(112).int32(message.finalTurn);
    }
    if (message.finalWinCount !== 0) {
      writer.uint32(120).int32(message.finalWinCount);
    }
    if (message.isVip !== false) {
      writer.uint32(128).bool(message.isVip);
    }
    if (message.teamUid !== "") {
      writer.uint32(138).string(message.teamUid);
    }
    if (message.uuid !== "") {
      writer.uint32(146).string(message.uuid);
    }
    if (message.teamName !== "") {
      writer.uint32(154).string(message.teamName);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): LordsMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLordsMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.army = reader.string();
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

          message.serverName = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.nickName = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.userKeys = reader.string();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.fightPower = reader.int32();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.readyScore = reader.int32();
          continue;
        }
        case 9: {
          if (tag !== 72) {
            break;
          }

          message.readyOrder = reader.int32();
          continue;
        }
        case 10: {
          if (tag !== 80) {
            break;
          }

          message.finalScore = reader.int32();
          continue;
        }
        case 11: {
          if (tag !== 88) {
            break;
          }

          message.finalOrder = reader.int32();
          continue;
        }
        case 12: {
          if (tag !== 96) {
            break;
          }

          message.winCounter = reader.int32();
          continue;
        }
        case 13: {
          if (tag !== 104) {
            break;
          }

          message.currentTurn = reader.int32();
          continue;
        }
        case 14: {
          if (tag !== 112) {
            break;
          }

          message.finalTurn = reader.int32();
          continue;
        }
        case 15: {
          if (tag !== 120) {
            break;
          }

          message.finalWinCount = reader.int32();
          continue;
        }
        case 16: {
          if (tag !== 128) {
            break;
          }

          message.isVip = reader.bool();
          continue;
        }
        case 17: {
          if (tag !== 138) {
            break;
          }

          message.teamUid = reader.string();
          continue;
        }
        case 18: {
          if (tag !== 146) {
            break;
          }

          message.uuid = reader.string();
          continue;
        }
        case 19: {
          if (tag !== 154) {
            break;
          }

          message.teamName = reader.string();
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

  fromJSON(object: any): LordsMsg {
    return {
      army: isSet(object.army) ? globalThis.String(object.army) : "",
      id: isSet(object.id) ? globalThis.Number(object.id) : 0,
      userId: isSet(object.userId) ? globalThis.Number(object.userId) : 0,
      serverName: isSet(object.serverName) ? globalThis.String(object.serverName) : "",
      nickName: isSet(object.nickName) ? globalThis.String(object.nickName) : "",
      userKeys: isSet(object.userKeys) ? globalThis.String(object.userKeys) : "",
      fightPower: isSet(object.fightPower) ? globalThis.Number(object.fightPower) : 0,
      readyScore: isSet(object.readyScore) ? globalThis.Number(object.readyScore) : 0,
      readyOrder: isSet(object.readyOrder) ? globalThis.Number(object.readyOrder) : 0,
      finalScore: isSet(object.finalScore) ? globalThis.Number(object.finalScore) : 0,
      finalOrder: isSet(object.finalOrder) ? globalThis.Number(object.finalOrder) : 0,
      winCounter: isSet(object.winCounter) ? globalThis.Number(object.winCounter) : 0,
      currentTurn: isSet(object.currentTurn) ? globalThis.Number(object.currentTurn) : 0,
      finalTurn: isSet(object.finalTurn) ? globalThis.Number(object.finalTurn) : 0,
      finalWinCount: isSet(object.finalWinCount) ? globalThis.Number(object.finalWinCount) : 0,
      isVip: isSet(object.isVip) ? globalThis.Boolean(object.isVip) : false,
      teamUid: isSet(object.teamUid) ? globalThis.String(object.teamUid) : "",
      uuid: isSet(object.uuid) ? globalThis.String(object.uuid) : "",
      teamName: isSet(object.teamName) ? globalThis.String(object.teamName) : "",
    };
  },

  toJSON(message: LordsMsg): unknown {
    const obj: any = {};
    if (message.army !== "") {
      obj.army = message.army;
    }
    if (message.id !== 0) {
      obj.id = Math.round(message.id);
    }
    if (message.userId !== 0) {
      obj.userId = Math.round(message.userId);
    }
    if (message.serverName !== "") {
      obj.serverName = message.serverName;
    }
    if (message.nickName !== "") {
      obj.nickName = message.nickName;
    }
    if (message.userKeys !== "") {
      obj.userKeys = message.userKeys;
    }
    if (message.fightPower !== 0) {
      obj.fightPower = Math.round(message.fightPower);
    }
    if (message.readyScore !== 0) {
      obj.readyScore = Math.round(message.readyScore);
    }
    if (message.readyOrder !== 0) {
      obj.readyOrder = Math.round(message.readyOrder);
    }
    if (message.finalScore !== 0) {
      obj.finalScore = Math.round(message.finalScore);
    }
    if (message.finalOrder !== 0) {
      obj.finalOrder = Math.round(message.finalOrder);
    }
    if (message.winCounter !== 0) {
      obj.winCounter = Math.round(message.winCounter);
    }
    if (message.currentTurn !== 0) {
      obj.currentTurn = Math.round(message.currentTurn);
    }
    if (message.finalTurn !== 0) {
      obj.finalTurn = Math.round(message.finalTurn);
    }
    if (message.finalWinCount !== 0) {
      obj.finalWinCount = Math.round(message.finalWinCount);
    }
    if (message.isVip !== false) {
      obj.isVip = message.isVip;
    }
    if (message.teamUid !== "") {
      obj.teamUid = message.teamUid;
    }
    if (message.uuid !== "") {
      obj.uuid = message.uuid;
    }
    if (message.teamName !== "") {
      obj.teamName = message.teamName;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<LordsMsg>, I>>(base?: I): LordsMsg {
    return LordsMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LordsMsg>, I>>(object: I): LordsMsg {
    const message = createBaseLordsMsg();
    message.army = object.army ?? "";
    message.id = object.id ?? 0;
    message.userId = object.userId ?? 0;
    message.serverName = object.serverName ?? "";
    message.nickName = object.nickName ?? "";
    message.userKeys = object.userKeys ?? "";
    message.fightPower = object.fightPower ?? 0;
    message.readyScore = object.readyScore ?? 0;
    message.readyOrder = object.readyOrder ?? 0;
    message.finalScore = object.finalScore ?? 0;
    message.finalOrder = object.finalOrder ?? 0;
    message.winCounter = object.winCounter ?? 0;
    message.currentTurn = object.currentTurn ?? 0;
    message.finalTurn = object.finalTurn ?? 0;
    message.finalWinCount = object.finalWinCount ?? 0;
    message.isVip = object.isVip ?? false;
    message.teamUid = object.teamUid ?? "";
    message.uuid = object.uuid ?? "";
    message.teamName = object.teamName ?? "";
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
