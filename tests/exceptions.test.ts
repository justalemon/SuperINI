import { describe, expect, test } from "@jest/globals";
import { dump, parse } from "../superini";

describe("check raised exceptions of dumper", () => {
    test("number as dumper input", () => {
        expect(() => dump(1 as unknown as Record<string, Record<string, any>>)).toThrow("Unable to dump: Expected object, got number");
    });
    test("string as dumper input", () => {
        expect(() => dump("hi" as unknown as Record<string, Record<string, any>>)).toThrow("Unable to dump: Expected object, got string");
    });
});

describe("check raised exceptions of parser", () => {
    test("number as parser input", () => {
        expect(() => parse(1 as unknown as string)).toThrow("Unable to parse: Expected string, got number");
    });
    test("array as parser input", () => {
        expect(() => parse([] as unknown as string)).toThrow("Unable to parse: Expected string, got object");
    });
    test("object as parser input", () => {
        expect(() => parse({} as unknown as string)).toThrow("Unable to parse: Expected string, got object");
    });
});
