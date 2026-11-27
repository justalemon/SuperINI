const reSection = /^\s*\[\s*([^\]]*)\s*\]\s*$/;
const reValue = /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/;
const reComment = /^\s*[#;].*$/;
const reListValue = /^\s+(.*)\s*$/

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

/**
 * The options for the parser.
 */
export interface ParserOptions {
    /**
     * Whether the lists should be flattened into a string.
     */
    flattenLists?: boolean;
}

/**
 * Parses an INI string.
 * @param ini The INI to parse as a string.
 * @param options The custom parser options.
 */
export function parse(ini: string, options?: ParserOptions) {
    if (typeof(ini) !== "string") {
        throw new ParseError(`Expected string, got ${typeof(ini)}`);
    }

    if (!options) {
        options = {};
    }

    const obj: any = {}
    let lastSection = "*";
    let lastList = null;

    for (let line of ini.split(/\r\n|\r|\n/)) {
        // Ignore comments
        if (reComment.test(line)) {
            continue;
        }

        // Parse list values
        const listMatch = line.match(reListValue);
        if (listMatch && lastList !== null) {
            if (!obj[lastSection][lastList]) {
                obj[lastSection][lastList] = options.flattenLists ? "" : [];
            }

            if (options.flattenLists) {
                obj[lastSection][lastList] += " " + listMatch[1];
            } else {
                obj[lastSection][lastList].push(listMatch[1]);
            }
            continue;
        }
        lastList = null;

        // Parse Sections
        const sectionMatch = line.match(reSection);
        if (sectionMatch) {
            lastSection = sectionMatch[1];
            continue;
        }

        // Parse Values
        const valueMatch = line.match(reValue);
        if (valueMatch) {
            if (!obj[lastSection]) {
                obj[lastSection] = {}
            }

            if (valueMatch[2] == "") {
                lastList = valueMatch[1];
                continue;
            }

            obj[lastSection][valueMatch[1]] = valueMatch[2];

            continue;
        }
    }

    return obj;
}
