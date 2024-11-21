/**
 * Monaca Education Utility Library
 *
 * @version 1.4
 * @author  Asial Corporation
 */
/**
 * 行番号を表示するための仕込み
 */
let createError = function() {
    try {
        throw new Error()
    } catch (error) {
        return error
    }
}

// デバッグアシスタントのHTML
let debugArea = document.createElement("section");
let titleArea = document.createElement("h1");
let logArea = document.createElement("ul");
let errorArea = document.createElement("p");
debugArea.classList.add("debug");
logArea.classList.add("log");
errorArea.classList.add("error");
titleArea.innerHTML = "デバッグアシスタント";
debugArea.appendChild(titleArea);
debugArea.appendChild(logArea);
debugArea.appendChild(errorArea);
document.body.appendChild(debugArea);

// デバッグアシスタントのCSS
let educationStyle = document.createElement('style');
educationStyle.innerText = `
section.debug {
    border:solid 2px blue;
    padding:5px;
    display:none;
    margin-top:50px;
}
.debug h1 {
    text-align:center;
    font-size:medium;
}
.debug li {
   list-style-type: circle;
}
.debug .error {
}
.debug li.error {
   list-style-type: square;
}
.debug li.log::before {
}
`;
document.querySelector("head").appendChild(educationStyle);

// エラー発生時の振る舞いを変更
onerror = function(message, file, line, col, error)  {
    debugArea.style.display = "block";
    debugArea.style.borderColor = "red";

    let filename = file.match(/[^/]+$/);
    let messageJ = message;
    // Syntax
    messageJ     = messageJ.replace("Uncaught SyntaxError:", "文法に間違いがあるようです <br> ");
    // Reference
    messageJ     = messageJ.replace("Uncaught ReferenceError:", "未定義の変数や関数を呼び出している可能性があります <br> ");
    // Type
    messageJ     = messageJ.replace("Uncaught TypeError:", "関数ではないものを関数として呼んだ？ <br> ");
    // Unexpected
    messageJ     = messageJ.replace("Unexpected token", "恐らく記号にミスがあります <br> ");
    messageJ     = messageJ.replace("Unexpected end of input", "恐らく閉じ括弧が抜けています <br> ");
    // その他
    messageJ     = messageJ.replace(" is not defined", "は未定義です<br> ");
    messageJ     = messageJ.replace(" is not a function", "は関数ではありません<br> ");
    messageJ     = messageJ.replace(" Invalid or unexpected token", "不正もしくは予期しない記号が混ざり込んでいるようです");
    messageJ     = messageJ.replace(" Invalid regular expression", "不正な式が混ざり込んでいるようです");
    messageJ     = messageJ.replace("missing", "原因は恐らく");

    // エラー原因のファイル名が分かる場合はそれを表示
    if (filename) {
        messageJ     += " <br> " + filename + " ファイルの " + line + "行目付近を確認して下さい";
    } else {
        messageJ     += " <br> 原因箇所は不明です。各種デバッガーを使えば詳細が分かるかもしれません。";
    }
    errorArea.innerHTML += messageJ + "<br>";
}

/**
 * console.log()をラップしつつdomにも書き出すlog()関数を定義
 */
let log = function() { 
    const caller = createError().stack.split('\n').pop();
    const point =  caller.match(/[^/]+$/).join('').split(':');
   
    // ログ表示エリアを展開
    debugArea.style.display = "block";
    let ul1 = document.createElement("ul");

    for (let key0 in arguments) {
        let value1 = arguments[key0];
        if (isObject(value1)) {
            let li = document.createElement("li");
            let text = "配列です";
            li.textContent = text + " (" + point[0] + ":" + point[1] + "行目)";
            logArea.appendChild(li)

            for (let key1 in value1) {
                let value2 = value1[key1];
                let ul2 = document.createElement("ul");
                console.log(value2);

                if (isObject(value2)) {
                    let li = document.createElement("li");
                    li.textContent = key1;
                    ul1.appendChild(li);
                    for (let key2 in value2) {
                        let value3 = value2[key2];

                        let li = document.createElement("li");
                        li.textContent = key2 + ":" + value3;
                        ul2.appendChild(li);
                    }
                    ul1.appendChild(ul2);
                } else {
                    let li = document.createElement("li");
                    li.textContent = key1 + ":" + value2;
                    ul1.appendChild(li);
                }
            }
            logArea.appendChild(ul1);
        } else {
            let li = document.createElement("li");
            li.textContent = value1 + " (" + point[0] + ":" + point[1] + "行目)";
            logArea.appendChild(li)
        }
    }
    // 念のためコンソールログにも書き出す
    console.log.apply(console, arguments);
};
/**
 * document.writeの代替となるwrite()関数を定義
 */
let write = function(){
    for (var i in arguments) {
        let p = document.createElement("p");
        p.textContent = arguments[i];
        document.body.appendChild(p);
    }    
}
/**
 * write()関数の同名関数を定義
 */
let print = write;
/**
 * scriptタグで非同期読み込みするとdocument.writeは使えなくなるのでついでに置き換える
 */
document.write = write;
/**
 * dom取得関数を定義
 */
let getDom = function (foo) {
    return document.querySelector("#" + foo);
}
/**
 * オブジェクトや配列かどうかをチェックする関数を定義
 */
let isObject = function (value) {
    let dataType  = Object.prototype.toString.call(value);
    if (dataType === "[object Object]") {
        return true;
    } else if (dataType === "[object Array]") {
        return true;
    }
    return false;
}
let promptInt = function(label = "整数を入力してください") {
    let val = prompt(label);
    if (val === "") {
        return null;
    }
    val = val.replace(/[０-９]/g, zen2han);
    function zen2han(c) {
        return String.fromCharCode(c.charCodeAt(0) - 65248);
    }
    val = parseInt(val);
    return val;
}