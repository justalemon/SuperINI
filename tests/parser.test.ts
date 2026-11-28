import { readFileSync } from "fs";
import { resolve } from "path";

import { describe, expect, test } from "@jest/globals";

import { parse } from "../superini";

const expectedOutputStandard = {
    env: {
        framework: "arduino",
        lib_deps: ["h2zero/NimBLE-Arduino", "robtillaart/UUID"],
        platform: "espressif32",
        board: "esp32-c3-devkitm-1",
        build_flags: [
            "-DESP32=1",
            "-DESP32_C3_SUPER_MINI=1",
            "-DARDUINO_USB_MODE=1",
            "-DARDUINO_USB_CDC_ON_BOOT=1",
            '-DMETADATA_SERIES=\\"Genshin\\ Impact\\"',
            '-DMETADATA_CHARACTER=\\"Venti\\"',
            '-DMETADATA_PROP=\\"Lyre\\"',
            '-DBLE_DEVICE_NAME_SHORT=\\"Lyre\\"',
            '-DBLE_DEVICE_NAME_LONG=\\"Lyre\\"',
        ],
    },
};
const expectedOutputFlattened = {
    env: {
        framework: "arduino",
        lib_deps: " h2zero/NimBLE-Arduino robtillaart/UUID",
        platform: "espressif32",
        board: "esp32-c3-devkitm-1",
        build_flags: " -DESP32=1 -DESP32_C3_SUPER_MINI=1 -DARDUINO_USB_MODE=1 -DARDUINO_USB_CDC_ON_BOOT=1 -DMETADATA_SERIES=\\\"Genshin\\ Impact\\\" -DMETADATA_CHARACTER=\\\"Venti\\\" -DMETADATA_PROP=\\\"Lyre\\\" -DBLE_DEVICE_NAME_SHORT=\\\"Lyre\\\" -DBLE_DEVICE_NAME_LONG=\\\"Lyre\\\"",
    },
};
const filePath = resolve("./tests/platformio.ini");
const contents = readFileSync(filePath, "utf-8");

describe("testing parser", () => {
    test("parse platformio.ini with no settings", () => {
        expect(parse(contents)).toMatchObject(expectedOutputStandard);
    });
    test("parse platformio.ini with flattened lists", () => {
        expect(parse(contents, { flattenLists: true })).toMatchObject(expectedOutputFlattened);
    });

    test("parse empty keys - keep", () => {
        expect(parse("[section]\nempty=")).toMatchObject({ section: { empty: null } });
    });
    test("parse empty keys - skip", () => {
        expect(parse("[section]\nempty=", { skipEmptyKeys: true })).toMatchObject({ section: { } });
    });
});
