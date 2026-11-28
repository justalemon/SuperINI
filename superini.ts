const reSection = /^\s*\[\s*([^\]]*)\s*\]\s*$/;
const reValue = /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/;
const reComment = /^\s*[#;].*$/;
const reListValue = /^\s+(.*)\s*$/

/**
 * Base Error class for all SuperINI errors.
 */
export class SuperIniError extends Error {
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
export class ParseError extends SuperIniError {
    /**
     * Creates a new parse error.
     * @param reason The reason why the parse failed.
     */
    constructor(reason: string) {
        super(`Unable to parse: ${reason}`);
    }
}

/**
 * Common error for all dump errors.
 */
export class DumpError extends SuperIniError {
    /**
     * Creates a new dump error.
     * @param reason The reason why the dump failed.
     */
    constructor(reason: string) {
        super(`Unable to dump: ${reason}`);
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
    /**
     * Whether to skip the empty keys on each section.
     */
    skipEmptyKeys?: boolean;
    /**
     * Whether to disallow keys with no sections. Keys with no sections will be grouped under a section *.
     */
    disallowKeyWithNoSection?: boolean;
    /**
     * Whetheer to disallow duplicated keys. By default, the last key wins.
     */
    disallowDuplicatedKeys?: boolean;
    /**
     * Whether to disallow duplicated sections. 
     */
    disallowDuplicatedSections?: boolean;
    /**
     * Skip sections that are empty.
     */
    skipEmptySections?: boolean;
}

/**
 * Parses an INI string.
 * @param ini The INI to parse as a string.
 * @param options The custom parser options.
 */
export function parse(ini: string, options?: ParserOptions): object {
    if (typeof(ini) !== "string") {
        throw new ParseError(`Expected string, got ${typeof(ini)}`);
    }

    if (!options) {
        options = {};
    }

    const obj: any = Object.create(null);
    let lastSection = "*";
    let lastList: string | null = null;

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
                if (obj[lastSection][lastList] === "") {
                    obj[lastSection][lastList] = listMatch[1];
                } else {
                    obj[lastSection][lastList] += " " + listMatch[1];
                }
            } else {
                obj[lastSection][lastList].push(listMatch[1]);
            }
            continue;
        }
        // Handle empty keys
        if (lastList) {
            if (!obj[lastSection][lastList] && !options.skipEmptyKeys) {
                obj[lastSection][lastList] = null;
            }
            lastList = null;
        }

        // Parse Sections
        const sectionMatch = line.match(reSection);
        if (sectionMatch && sectionMatch[1]) {
            if (["__proto__", "constructor", "prototype"].includes(sectionMatch[1])) {
                throw new ParseError(`Invalid Section Name: ${sectionMatch[1]}`);
            }

            if (lastSection !== "*" && !obj[lastSection] && !options.skipEmptySections) {
                obj[lastSection] = Object.create(null);
            }

            if (obj[sectionMatch[1]] && options.disallowDuplicatedSections) {
                throw new ParseError(`Detected duplicated section: [${sectionMatch[1]}]`)
            }

            lastSection = sectionMatch[1];
            continue;
        }

        // Parse Values
        const valueMatch = line.match(reValue);
        if (valueMatch && valueMatch[1]) {
            if (["__proto__", "constructor", "prototype"].includes(valueMatch[1])) {
                throw new ParseError(`Invalid Key Name: ${valueMatch[1]}`);
            }

            if (lastSection === "*" && options.disallowKeyWithNoSection) {
                throw new ParseError(`Detected key with no section: ${valueMatch[1]}`)
            }

            if (!obj[lastSection]) {
                obj[lastSection] = Object.create(null);
            }

            if (obj[lastSection][valueMatch[1]] && options.disallowDuplicatedKeys) {
                throw new ParseError(`Detected duplicated key: ${valueMatch[1]} in section [${lastSection}]`)
            }

            if (valueMatch[2] === "") {
                lastList = valueMatch[1];
                continue;
            }

            let value = valueMatch[2] ?? "";

            if (value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length - 1);
            }

            obj[lastSection][valueMatch[1]] = value;

            continue;
        }
    }

    // Handle last empty key
    if (lastList) {
        if (!obj[lastSection][lastList] && !options.skipEmptyKeys) {
            obj[lastSection][lastList] = null;
        }
    }

    return obj;
}

/**
 * The options for the dumper.
 */
export interface DumpOptions {
    /**
     * Skips the escape of newlines in strings.
     */
    skipNewLineEscape?: boolean;
}

/**
 * Transform an object into an INI string.
 * @param obj The object to dump.
 * @param options The options to dump.
 * @returns A stringified version of the object.
 */
export function dump(obj: Record<string, Record<string, any>>, options?: DumpOptions) {
    if (obj === null) {
        throw new DumpError(`Expected object, got null`);
    } else if (Array.isArray(obj)) {
        throw new DumpError(`Expected object, got Array`);
    } else if (typeof(obj) !== "object") {
        throw new DumpError(`Expected object, got ${typeof(obj)}`);
    }

    if (!options) {
        options = {};
    }

    let str = "";

    for (const [sectionName, sectionValues] of Object.entries(obj)) {
        if (Object.keys(sectionValues).length === 0) {
            continue;
        }

        str += `[${sectionName}]\n`;

        for (const key of Object.keys(sectionValues)) {
            const value = sectionValues[key];
            const type = typeof(value);

            if (type === "bigint" || type === "boolean" || type === "number" || (type === "string" && options.skipNewLineEscape)) {
                str += `${key} = ${value}\n`;
            } else if (type === "string") {
                str += `${key} = ${value.replaceAll("\n", "\\n")}\n`;
            } else if (Array.isArray(value)) {
                str += `${key} =\n`;

                for (const v of value) {
                    str += `    ${v}\n`;
                }
            } else {
                throw new DumpError("Unexpected Value type: " + type);
            }
        }
    }

    return str;
}
