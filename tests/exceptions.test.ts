import { describe, expect, test } from "@jest/globals";
import { dump, parse } from "../superini";

describe("check raised exceptions of dumper", () => {
    test("number as dumper input", () => {
        expect(() => dump(1 as unknown as Record<string, Record<string, any>>)).toThrow("Unable to dump: Expected object, got number");
    });
    test("string as dumper input", () => {
        expect(() => dump("hi" as unknown as Record<string, Record<string, any>>)).toThrow("Unable to dump: Expected object, got string");
    });
    test("function as dumper input", () => {
        expect(() => dump({"a": {"f": function () {}}})).toThrow("Unable to dump: Unexpected Value type: function");
    });
    test("object as dumper input", () => {
        expect(() => dump(null as unknown as Record<string, Record<string, any>>)).toThrow("Unable to dump: Expected object, got null");
    });
    test("array as dumper input", () => {
        expect(() => dump([] as unknown as Record<string, Record<string, any>>)).toThrow("Unable to dump: Expected object, got Array");
    });

    test("null as section", () => {
        expect(() => dump({ "a": null } as unknown as Record<string, Record<string, any>>)).toThrow("Unable to dump: Expected object for section [a], got null");
    });
    test("Array as section", () => {
        expect(() => dump({ "a": [] } as unknown as Record<string, Record<string, any>>)).toThrow("Unable to dump: Expected object for section [a], got Array");
    });
    test("number as section", () => {
        expect(() => dump({ "a": 1 } as unknown as Record<string, Record<string, any>>)).toThrow("Unable to dump: Expected object for section [a], got number");
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
    test("key with no section with disallowKeyWithNoSection", () => {
        expect(() => parse("k = v", { disallowKeyWithNoSection: true })).toThrow("Unable to parse: Detected key with no section: k");
    });
    test("duplicated keys with disallowDuplicatedKeys", () => {
        expect(() => parse("[s]\nk = v\nk = v", { disallowDuplicatedKeys: true })).toThrow("Unable to parse: Detected duplicated key: k in section [s]");
    });
    test("duplicated sections with disallowDuplicatedKeys", () => {
        expect(() => parse("[s]\n[s]", { disallowDuplicatedSections: true })).toThrow("Unable to parse: Detected duplicated section: [s]");
    });
    test("duplicated empty keys", () => {
        expect(() => parse("[s]\nk=\nk=", { disallowDuplicatedKeys: true })).toThrow("Unable to parse: Detected duplicated key: k in section [s]");
    });
});

describe("check prototype pollution parser exceptions", () => {
    test("invalid section name", () => {
        expect(() => parse("[__proto__]")).toThrow("Unable to parse: Invalid Section Name: __proto__");
    });
    test("invalid key name", () => {
        expect(() => parse("[p]\n__proto__=p")).toThrow("Unable to parse: Invalid Key Name: __proto__");
    });
});
