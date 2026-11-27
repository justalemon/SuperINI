import { parse } from "../superini";
import { readFileSync } from "fs";
import { resolve } from "path";

const expectedOutput = {
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

describe("testing platformio.ini parsing", () => {
    test("parse platformio.ini", () => {
        const filePath = resolve("./tests/platformio.ini");
        const contents = readFileSync(filePath, "utf-8");
        expect(parse(contents)).toMatchObject(expectedOutput);
    });
});
