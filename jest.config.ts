import { defineConfig } from "jest";

export default defineConfig({
    transform: {
        "\\.[jt]sx?$": "babel-jest",
    }
});
