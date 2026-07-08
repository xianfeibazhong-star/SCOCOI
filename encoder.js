const UNICODE_AREAS = [

    { start: 0x3400, end: 0x4DBF },
    { start: 0x4E00, end: 0x9FFF },
    { start: 0x20000, end: 0x2A6DF },
    { start: 0x2A700, end: 0x2B73F },
    { start: 0x2B740, end: 0x2B81F },
    { start: 0x2B820, end: 0x2CEAF },
    { start: 0x2CEB0, end: 0x2EBEF },
    { start: 0x30000, end: 0x3134F },
    { start: 0x31350, end: 0x323AF }

];

function indexToCodePoint(index) {

    let offset = index;

    for (const area of UNICODE_AREAS) {

        const count = area.end - area.start + 1;

        if (offset < count) {

            return area.start + offset;

        }

        offset -= count;

    }

    throw new Error("Unicode領域不足");

}

function codePointToIndex(codePoint) {

    let index = 0;

    for (const area of UNICODE_AREAS) {

        if (
            codePoint >= area.start &&
            codePoint <= area.end
        ) {

            return index + (codePoint - area.start);

        }

        index += area.end - area.start + 1;

    }

    throw new Error("辞書外文字");

}

function valueToCharacter(value) {

    return String.fromCodePoint(
        indexToCodePoint(value)
    );

}

function characterToValue(character) {

    return codePointToIndex(
        character.codePointAt(0)
    );

}

function uint32ToBytes(value) {

    return [

        (value >>> 24) & 0xff,
        (value >>> 16) & 0xff,
        (value >>> 8) & 0xff,
        value & 0xff

    ];

}

async function blobToBytes(dataUrl) {

    const response = await fetch(dataUrl);

    const blob = await response.blob();

    const buffer = await blob.arrayBuffer();

    return new Uint8Array(buffer);

}
function bytesToCharacters(bytes) {

    const output = [];

    for (let i = 0; i < bytes.length; i += 2) {

        const high = bytes[i];

        const low = (i + 1 < bytes.length)
            ? bytes[i + 1]
            : 0;

        const value = (high << 8) | low;

        output.push(
            valueToCharacter(value)
        );

    }

    return output.join("");

}

function buildEncodeBytes(bytes) {

    const header = uint32ToBytes(
        bytes.length
    );

    const output = new Uint8Array(
        header.length + bytes.length
    );

    output.set(header, 0);

    output.set(bytes, header.length);

    return output;

}

async function encodeBytes() {

    console.log("①");

    const bytes = await blobToBytes(
        app.rekka
    );

    console.log("②", bytes.length);

    const encodeBytes = buildEncodeBytes(
        bytes
    );

    console.log("③", encodeBytes.length);

    const text = bytesToCharacters(
        encodeBytes
    );

    console.log("④", text.length);

    return text;

}
async function encode() {
    console.log("encode開始");

    const text = await encodeBytes();

    app.text = text;

    const textBox = document.getElementById("textBox");

    if (textBox) {

        textBox.value = app.text;

    }

}