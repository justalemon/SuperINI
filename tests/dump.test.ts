import { describe, expect, test } from "@jest/globals";

import { dump } from "../superini";

const base = {
    numbers: {
        one: 1,
        two: 2,
        three: 3,
    },
    text: {
        list: ["one", "two", "three"]
    },
};
const newLines = {
    a: {
        s: "hi\nhello",
    }
};
const expected = `[numbers]
one = 1
two = 2
three = 3
[text]
list =
    one
    two
    three
`

describe("dump of objects", () => {
    test("dump with no settings", () => {
        expect(dump(base)).toBe(expected);
    });
    test("dump with empty sections", () => {
        expect(dump({"a": {}})).toBe("");
    });
    test("dump with new lines and escaping", () => {
        expect(dump(newLines)).toBe("[a]\ns = hi\\nhello\n");
    });
    test("dump with new lines and no escaping", () => {
        expect(dump(newLines, { skipNewLineEscape: true })).toBe("[a]\ns = hi\nhello\n");
    });
});
