// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.21.12
// source: questionnarie/QuestionDataRspInfo.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "com.road.yishi.proto.questionnarie";

export interface QuestionDataRspInfo {
  questId: number;
  answer: string;
}

function createBaseQuestionDataRspInfo(): QuestionDataRspInfo {
  return { questId: 0, answer: "" };
}

export const QuestionDataRspInfo: MessageFns<QuestionDataRspInfo> = {
  encode(message: QuestionDataRspInfo, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.questId !== 0) {
      writer.uint32(8).int32(message.questId);
    }
    if (message.answer !== "") {
      writer.uint32(18).string(message.answer);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QuestionDataRspInfo {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQuestionDataRspInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.questId = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.answer = reader.string();
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

  fromJSON(object: any): QuestionDataRspInfo {
    return {
      questId: isSet(object.questId) ? globalThis.Number(object.questId) : 0,
      answer: isSet(object.answer) ? globalThis.String(object.answer) : "",
    };
  },

  toJSON(message: QuestionDataRspInfo): unknown {
    const obj: any = {};
    if (message.questId !== 0) {
      obj.questId = Math.round(message.questId);
    }
    if (message.answer !== "") {
      obj.answer = message.answer;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QuestionDataRspInfo>, I>>(base?: I): QuestionDataRspInfo {
    return QuestionDataRspInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QuestionDataRspInfo>, I>>(object: I): QuestionDataRspInfo {
    const message = createBaseQuestionDataRspInfo();
    message.questId = object.questId ?? 0;
    message.answer = object.answer ?? "";
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
