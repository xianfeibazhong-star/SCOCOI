//第１部　文字の判定
const ERROR_INVALID_CHARACTER = "INVALID_CHARACTER";
const ERROR_INVALID_DATA = "INVALID_DATA";
const ERROR_INVALID_IMAGE = "INVALID_IMAGE";

function charactersToBytes(text) {

    const bytes = [];

    for (const character of text) {

        let value;

        try {

            value = characterToValue(character);

        }
        catch {

            throw new Error(ERROR_INVALID_CHARACTER);

        }

        bytes.push((value >> 8) & 0xff);
        bytes.push(value & 0xff);

    }

    return new Uint8Array(bytes);

}

function bytesToUint32(bytes) {

    if (bytes.length < 4) {

        throw new Error(ERROR_INVALID_DATA);

    }

    return (
        (bytes[0] << 24) |
        (bytes[1] << 16) |
        (bytes[2] << 8) |
        bytes[3]
    ) >>> 0;

}

function extractImageBytes(bytes) {

    const size = bytesToUint32(bytes);

    const start = 4;
    const end = start + size;

    if (end > bytes.length) {

        throw new Error(ERROR_INVALID_DATA);

    }

    return bytes.slice(start, end);

}
function blobToDataURL(blob) {

    return new Promise(function (resolve, reject) {

        const reader = new FileReader();

        reader.onload = function () {

            resolve(reader.result);

        };

        reader.onerror = function () {

            reject(new Error(ERROR_INVALID_DATA));

        };

        reader.readAsDataURL(blob);

    });

}

function verifyImage(dataUrl) {

    return new Promise(function (resolve, reject) {

        const image = new Image();

        image.onload = function () {

            resolve();

        };

        image.onerror = function () {

            reject(new Error(ERROR_INVALID_IMAGE));

        };

        image.src = dataUrl;

    });

}

async function decodeBytes(text) {

    const bytes = charactersToBytes(text);

    const imageBytes = extractImageBytes(bytes);

    const blob = new Blob(
        [imageBytes],
        { type: "image/jpeg" }
    );

    const dataUrl = await blobToDataURL(blob);

    await verifyImage(dataUrl);

    return {

        blob: blob,

        dataUrl: dataUrl

    };

}
async function decode() {

    try {

        const result = await decodeBytes(app.text);

        app.rekkaBlob = result.blob;

        app.rekka = result.dataUrl;

        const rekkaImage = document.getElementById("rekkaImage");

        if (rekkaImage) {

            rekkaImage.src = app.rekka;

        }

    }
    catch (error) {

        switch (error.message) {

            case ERROR_INVALID_CHARACTER:

                alert("使用できない文字が含まれています。");
                break;

            case ERROR_INVALID_DATA:

                alert("画像データが破損しています。");
                break;

            case ERROR_INVALID_IMAGE:

                alert("画像を表示できませんでした。");
                break;

            default:

                alert("画像を復元できませんでした。");
                break;

        }

    }

}