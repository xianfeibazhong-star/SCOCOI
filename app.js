/*
===========================================
SCOCOI
app.js
===========================================
*/

//==========================================
// 共有変数
//==========================================

const app = {

    moto: null,
    rekka: null,
    rekkaBlob: null,
    text: "",
    sansho: "sample.jpeg",
    moji: 500

};

function blobToDataURL(blob) {
    return new Promise(resolve => {

        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);

        reader.readAsDataURL(blob);

    });
}

//==========================================
// HTML取得
//==========================================

const rekkaImage  = document.getElementById("rekkaImage");
const textBox     = document.getElementById("textBox");
const mojiInput   = document.getElementById("mojiInput");
const sanshoLabel = document.getElementById("sanshoLabel");

const fileInput   = document.getElementById("fileInput");

const decodeButton = document.getElementById("decodeButton");
const encodeButton = document.getElementById("encodeButton");
const saveButton   = document.getElementById("saveButton");
const openButton   = document.getElementById("openButton");
const copyButton   = document.getElementById("copyButton");
const pasteButton  = document.getElementById("pasteButton");

//==========================================
// 初期化
//==========================================

window.addEventListener("load", initialize);

async function initialize() {

    app.moto = "sample.jpeg";
    app.rekka = "sample.jpeg";

    rekkaImage.src = app.rekka;

    sanshoLabel.textContent = app.sansho;

    mojiInput.value = app.moji;

    try {

        const response = await fetch("sample/snpi.txt");

        app.text = await response.text();

        textBox.value = app.text;

    }

    catch {

        app.text = "";
        textBox.value = "";

    }

}

//==========================================
// 参照
//==========================================

openButton.addEventListener("click", function () {

    fileInput.click();

});

fileInput.addEventListener("change", async function () {

    const file = fileInput.files[0];

    if (!file) return;

    await setImage(file, file.name);

});

//==========================================
// テキスト同期
//==========================================

textBox.addEventListener("input", function () {

    app.text = textBox.value;

});

//==========================================
// コピー
//==========================================

copyButton.addEventListener("click", async function () {

    try {

        await navigator.clipboard.writeText(app.text);

    }

    catch {

        alert("コピーできませんでした。");

    }

});
//==========================================
// ペースト
//==========================================

pasteButton.addEventListener("click", async function () {

    try {

        app.text = await navigator.clipboard.readText();

        textBox.value = app.text;

        

    }

    catch {

        alert("ペーストできませんでした。");

    }

});

//==========================================
// 文字化
//==========================================

encodeButton.addEventListener("click", async function () {

    await encodeImage();

});

//==========================================
// 画像化
//==========================================

decodeButton.addEventListener("click", function () {

    decodeImage();

});

//==========================================
// 保存
//==========================================

saveButton.addEventListener("click", function () {

    saveImage();

});

//==========================================
// 関数
//==========================================



async function setImage(blob, filename) {

    app.sansho = filename;

    sanshoLabel.textContent = app.sansho;

    app.rekkaBlob = blob;

    app.moto = await blobToDataURL(blob);

    app.rekka = app.moto;

    rekkaImage.src = app.rekka;

}

async function encodeImage() {

    await compressImage();

    await encode();

}

async function decodeImage() {

    app.text = document.getElementById("textBox").value;

    if (app.text.trim() === "") {

        alert("(テキストが入力されて)ないです。");
        return;

    }

    await decode();

}

function saveImage() {

    if (!app.rekka) {

        alert("(保存する画像が)ないです。");
        return;

    }

    const a = document.createElement("a");

    a.href = app.rekka;

    // 拡張子だけ元画像に合わせる
    let filename = app.sansho;

    const index = filename.lastIndexOf(".");

    if (index !== -1) {

        filename = filename.substring(0, index);

    }

    filename += "_rekka.jpg";

    a.download = filename;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

}
loadSampleImage();