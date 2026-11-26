/**
 * Base Error class for all SuperINI errors.
 */
class SuperIniError extends Error {
    /**
     * Creates a new SuperIni Error.
     * @param message The message of the error.
     */
    constructor(message: string) {
        super(message);
    }
}

/**
 * Common error for all parse errors.
 */
class ParseError extends SuperIniError {
    /**
     * Creates a new parse error.
     * @param reason The reason why the parse failed.
     */
    constructor(reason: string) {
        super(`Unable to parse: ${reason}`);
    }
}
