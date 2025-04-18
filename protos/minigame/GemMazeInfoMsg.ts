// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: minigame/GemMazeInfoMsg.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.minigame";

export interface GemMazeInfoMsg {
  allGems: number[];
  score: number;
  weekScore: number;
  timesLeft: number;
  buyTimesLeft: number;
  helpTimesLeft: number;
  gemLevel: number;
  curExp: number;
  maxExp: number;
  boxMark: number;
  scoreOrder: number;
  boxesId: number[];
}

function createBaseGemMazeInfoMsg(): GemMazeInfoMsg {
  return {
    allGems: [],
    score: 0,
    weekScore: 0,
    timesLeft: 0,
    buyTimesLeft: 0,
    helpTimesLeft: 0,
    gemLevel: 0,
    curExp: 0,
    maxExp: 0,
    boxMark: 0,
    scoreOrder: 0,
    boxesId: [],
  };
}

export const GemMazeInfoMsg: MessageFns<GemMazeInfoMsg> = {
  encode(message: GemMazeInfoMsg, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    writer.uint32(10).fork();
    for (const v of message.allGems) {
      writer.int32(v);
    }
    writer.join();
    if (message.score !== 0) {
      writer.uint32(16).int32(message.score);
    }
    if (message.weekScore !== 0) {
      writer.uint32(24).int32(message.weekScore);
    }
    if (message.timesLeft !== 0) {
      writer.uint32(32).int32(message.timesLeft);
    }
    if (message.buyTimesLeft !== 0) {
      writer.uint32(40).int32(message.buyTimesLeft);
    }
    if (message.helpTimesLeft !== 0) {
      writer.uint32(48).int32(message.helpTimesLeft);
    }
    if (message.gemLevel !== 0) {
      writer.uint32(56).int32(message.gemLevel);
    }
    if (message.curExp !== 0) {
      writer.uint32(64).int32(message.curExp);
    }
    if (message.maxExp !== 0) {
      writer.uint32(72).int32(message.maxExp);
    }
    if (message.boxMark !== 0) {
      writer.uint32(80).int32(message.boxMark);
    }
    if (message.scoreOrder !== 0) {
      writer.uint32(88).int32(message.scoreOrder);
    }
    writer.uint32(98).fork();
    for (const v of message.boxesId) {
      writer.int32(v);
    }
    writer.join();
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GemMazeInfoMsg {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGemMazeInfoMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag === 8) {
            message.allGems.push(reader.int32());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.allGems.push(reader.int32());
            }

            continue;
          }

          break;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.score = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.weekScore = reader.int32();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.timesLeft = reader.int32();
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.buyTimesLeft = reader.int32();
          continue;
        }
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.helpTimesLeft = reader.int32();
          continue;
        }
        case 7: {
          if (tag !== 56) {
            break;
          }

          message.gemLevel = reader.int32();
          continue;
        }
        case 8: {
          if (tag !== 64) {
            break;
          }

          message.curExp = reader.int32();
          continue;
        }
        case 9: {
          if (tag !== 72) {
            break;
          }

          message.maxExp = reader.int32();
          continue;
        }
        case 10: {
          if (tag !== 80) {
            break;
          }

          message.boxMark = reader.int32();
          continue;
        }
        case 11: {
          if (tag !== 88) {
            break;
          }

          message.scoreOrder = reader.int32();
          continue;
        }
        case 12: {
          if (tag === 96) {
            message.boxesId.push(reader.int32());

            continue;
          }

          if (tag === 98) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.boxesId.push(reader.int32());
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

  fromJSON(object: any): GemMazeInfoMsg {
    return {
      allGems: globalThis.Array.isArray(object?.allGems) ? object.allGems.map((e: any) => globalThis.Number(e)) : [],
      score: isSet(object.score) ? globalThis.Number(object.score) : 0,
      weekScore: isSet(object.weekScore) ? globalThis.Number(object.weekScore) : 0,
      timesLeft: isSet(object.timesLeft) ? globalThis.Number(object.timesLeft) : 0,
      buyTimesLeft: isSet(object.buyTimesLeft) ? globalThis.Number(object.buyTimesLeft) : 0,
      helpTimesLeft: isSet(object.helpTimesLeft) ? globalThis.Number(object.helpTimesLeft) : 0,
      gemLevel: isSet(object.gemLevel) ? globalThis.Number(object.gemLevel) : 0,
      curExp: isSet(object.curExp) ? globalThis.Number(object.curExp) : 0,
      maxExp: isSet(object.maxExp) ? globalThis.Number(object.maxExp) : 0,
      boxMark: isSet(object.boxMark) ? globalThis.Number(object.boxMark) : 0,
      scoreOrder: isSet(object.scoreOrder) ? globalThis.Number(object.scoreOrder) : 0,
      boxesId: globalThis.Array.isArray(object?.boxesId) ? object.boxesId.map((e: any) => globalThis.Number(e)) : [],
    };
  },

  toJSON(message: GemMazeInfoMsg): unknown {
    const obj: any = {};
    if (message.allGems?.length) {
      obj.allGems = message.allGems.map((e) => Math.round(e));
    }
    if (message.score !== 0) {
      obj.score = Math.round(message.score);
    }
    if (message.weekScore !== 0) {
      obj.weekScore = Math.round(message.weekScore);
    }
    if (message.timesLeft !== 0) {
      obj.timesLeft = Math.round(message.timesLeft);
    }
    if (message.buyTimesLeft !== 0) {
      obj.buyTimesLeft = Math.round(message.buyTimesLeft);
    }
    if (message.helpTimesLeft !== 0) {
      obj.helpTimesLeft = Math.round(message.helpTimesLeft);
    }
    if (message.gemLevel !== 0) {
      obj.gemLevel = Math.round(message.gemLevel);
    }
    if (message.curExp !== 0) {
      obj.curExp = Math.round(message.curExp);
    }
    if (message.maxExp !== 0) {
      obj.maxExp = Math.round(message.maxExp);
    }
    if (message.boxMark !== 0) {
      obj.boxMark = Math.round(message.boxMark);
    }
    if (message.scoreOrder !== 0) {
      obj.scoreOrder = Math.round(message.scoreOrder);
    }
    if (message.boxesId?.length) {
      obj.boxesId = message.boxesId.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GemMazeInfoMsg>, I>>(base?: I): GemMazeInfoMsg {
    return GemMazeInfoMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GemMazeInfoMsg>, I>>(object: I): GemMazeInfoMsg {
    const message = createBaseGemMazeInfoMsg();
    message.allGems = object.allGems?.map((e) => e) || [];
    message.score = object.score ?? 0;
    message.weekScore = object.weekScore ?? 0;
    message.timesLeft = object.timesLeft ?? 0;
    message.buyTimesLeft = object.buyTimesLeft ?? 0;
    message.helpTimesLeft = object.helpTimesLeft ?? 0;
    message.gemLevel = object.gemLevel ?? 0;
    message.curExp = object.curExp ?? 0;
    message.maxExp = object.maxExp ?? 0;
    message.boxMark = object.boxMark ?? 0;
    message.scoreOrder = object.scoreOrder ?? 0;
    message.boxesId = object.boxesId?.map((e) => e) || [];
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
