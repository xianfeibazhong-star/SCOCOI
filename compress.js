const JPEG_QUALITY = 0.8;
const MAX_ITERATION = 15;
const TARGET_MARGIN = 16;
const MIN_SCALE = 0.01;
const MAX_SCALE = 1.0;

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function canvasToBlob(canvas, quality) {
    return new Promise(resolve => {
        canvas.toBlob(blob => resolve(blob), "image/jpeg", quality);
    });
}

async function resizeToBlob(image, scale) {
    const canvas = document.createElement("canvas");

    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));

    const ctx = canvas.getContext("2d");

    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const blob = await canvasToBlob(canvas, JPEG_QUALITY);

    return {
        blob: blob,
        canvas: canvas
    };
}



async function searchScale(image, targetBytes) {

    let low = MIN_SCALE;
    let high = MAX_SCALE;

    let bestBlob = null;
    let bestCanvas = null;
    let bestDiff = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < MAX_ITERATION; i++) {

        const scale = (low + high) / 2;

        const result = await resizeToBlob(
            image,
            scale
        );

        const size = result.blob.size;

        const diff = Math.abs(size - targetBytes);

        if (diff < bestDiff) {

            bestDiff = diff;
            bestBlob = result.blob;
            bestCanvas = result.canvas;

        }

        if (diff <= TARGET_MARGIN) {

            break;

        }

        if (size > targetBytes) {

            high = scale;

        }
        else {

            low = scale;

        }

    }

    return {
        blob: bestBlob,
        canvas: bestCanvas
    };

}
async function compressImage() {
    app.moji = Number(mojiInput.value);

    const targetBytes = app.moji * 2;

    const image = await loadImage(app.moto);

    const result = await searchScale(
        image,
        targetBytes
    );

    app.rekka = await blobToDataURL(result.blob);

    const rekkaImage = document.getElementById("rekkaImage");

    if (rekkaImage) {

        rekkaImage.src = app.rekka;

    }

}
