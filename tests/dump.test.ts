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
});
