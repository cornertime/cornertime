import { Report, Preset } from './models';


const LINE_LENGTH = 76;
type Kind = 'PUNISHMENT REPORT' | 'CUSTOM PUNISHMENT';


// Public API of this module

export function serializeReport(report: Report): string {
    return serialize(report, 'PUNISHMENT REPORT');
}

export function serializePreset(preset: Preset): string {
    return serialize(preset, 'CUSTOM PUNISHMENT');
}


export function deserializeReport(data: string): Report {
    return deserialize(data, 'PUNISHMENT REPORT');
}

export function deserializePreset(data: string): Preset {
    return deserialize(data, 'CUSTOM PUNISHMENT');
}

// The rest are exported only for testing


function makeHeader(kind: Kind) {
    return `-----BEGIN CORNERTIME ${kind}-----`;
}

function makeFooter(kind: Kind) {
    return `-----END CORNERTIME ${kind}-----`;
}


// https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
export function encodeBase64(str: string): string {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(
        /%([0-9A-F]{2})/g,
        (match, p1) => String.fromCharCode(parseInt('0x' + p1, 16)),
    ));
}


export function decodeBase64(str: string) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(
        atob(str).split('').map(c =>  '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
}


export function wrapLines(longStr: string, lineLength: number = LINE_LENGTH): string {
    const lines: string[] = [];
    let start = 0;

    let line = '';
    while ((line = longStr.slice(start, start + lineLength))) {
        lines.push(line);
        start += lineLength;
    }

    return lines.join('\n');
}


export function serialize(obj: object, kind: Kind): string {
    const header = makeHeader(kind);
    const footer = makeFooter(kind);
    const data = wrapLines(encodeBase64(JSON.stringify(obj)));
    return `${header}\n${data}\n${footer}`;
}

export function deserialize(data: string, kind: Kind): any {
    data = data.trim();

    const expectedHeader = makeHeader(kind);
    const expectedFooter = makeFooter(kind);

    if (data.slice(0, expectedHeader.length) !== expectedHeader) {
        throw new TypeError('data to deserialize does not start with our header');
    }

    if (data.slice(data.length - expectedFooter.length) !== expectedFooter) {
        throw new TypeError('data to deserialize does not end with our footer');
    }

    // remove header and footer
    data = data.slice(expectedHeader.length, data.length - expectedFooter.length);
    data = decodeBase64(data);

    // TODO Schema validation
    return JSON.parse(data);
}


// Debug globals
if (typeof window !== 'undefined') {
    const anyWindow: any = window;
    anyWindow.cornertime = anyWindow.cornertime || {};
    Object.assign(anyWindow.cornertime, {
        serializePreset,
        serializeReport,
        deserializePreset,
        deserializeReport,
    });
}
