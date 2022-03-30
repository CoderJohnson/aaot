export const infoBasic = function(text) {
    $("#infoBasic").html(text);
    $('#infoModal').modal('show');
};

export const htmlEncode = function (input) {
    let converter = document.createElement("DIV");
    converter.innerText = input;
    let output = converter.innerHTML;
    converter = null;
    return output;
};

export const htmlDecode = function (input) {
    let converter = document.createElement("DIV");
    converter.innerHTML = input;
    let output = converter.innerText;
    converter = null;
    return output;
};

export const deletLast = function (text, character) {
    if (text[text.length-1] === character) text = text.substr(0,text.length-1);
    return text;
};

export const returnFloatString = function (num, precision) {
    let value = Math.round(parseFloat(num) * Math.pow(10, precision)) / Math.pow(10, precision);
    let xsd = value.toString().split(".");
    if( xsd.length === 1 ){
        value = value.toString() + (precision === 0 ? "" : ".");
        for(let x=0; x<precision; x++) value = value.toString() + "0";
        return value;
    }
    if( xsd.length > 1 ){
        if( xsd[1].length < precision ){
            for(let x=0; x<( precision - (xsd[1].length) ); x++) value = value.toString() + "0";
        }else{
            value = value.toString();
        }
        return value;
    }
};

export const randomString = function (len, plus) {
    let $chars = 'abcdefghijklmnopqrstuvwxyz12345.';
    let $chars1 = '12345';
    let $chars2 = 'abcdefghijklmnopqrstuvwxyz';
    let pwd = '';
    if(plus===0){
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * $chars.length));
        }
    }else if(plus === 1){
        for (let i = 0; i < len; i++) {
            pwd += $chars1.charAt(Math.floor(Math.random() * ($chars1.length)));
        }
    }else if(plus === 2){
        for (let i = 0; i < len; i++) {
            pwd += $chars2.charAt(Math.floor(Math.random() * ($chars2.length)));
        }
    }
    return pwd;
};

export const getLocalTime = function(i) {
    if (typeof i !== 'number') return;
    let d = new Date();
    let len = d.getTime();
    let offset = d.getTimezoneOffset() * 60000;
    let utcTime = len + offset;
    return new Date(utcTime + 3600000 * i);
};

export const ifArrayRepeat = function (ary) {
    let ifRepeat=false;
    for(let y=0; y<(ary.length); y++) {
        for(let x=0; x<(ary.length); x++) {
            if((x !== y) && (ary[x] === ary[y])){
                ifRepeat = true;
            }
        }
    }
    return ifRepeat;
};

export const ifExist = function (value, array) {
    if (array.length === 0 || JSON.stringify(array) === '[]')return false;
    let result=false;
    for(let y=0; y<(array.length); y++) {
        if(value === array[y]){
            result = true;
        }
    }
    return result;
};

export const clearNAndEmp = function (str){
    str = str.replace(/\ +/g,"");
    str = str.replace(/[ ]/g,"");
    str = str.replace(/(^\s+)|(\s+$)/g,"");
    str = str.replace(/\s/g,"");
    while (str.indexOf(" ") !== -1){
        str = str.replace(" ","");
    }
    while (str.indexOf(" ") !== -1){
        str = str.replace(" ","");
    }
    while (str.indexOf("&nbsp;") !== -1){
        str = str.replace("&nbsp;","");
    }
    while (str.indexOf("&emsp;") !== -1){
        str = str.replace("&emsp;","");
    }
    while (str.indexOf("&thinsp;") !== -1){
        str = str.replace("&thinsp;","");
    }
    while (str.indexOf("&zwnj;") !== -1){
        str = str.replace("&zwnj;","");
    }
    while (str.indexOf("&zwj;") !== -1){
        str = str.replace("&zwj;","");
    }
    while (str.indexOf("&#x0020;") !== -1){
        str = str.replace("&#x0020;","");
    }
    while (str.indexOf("&#x0009;") !== -1){
        str = str.replace("&#x0009;","");
    }
    while (str.indexOf("&#x000A;") !== -1){
        str = str.replace("&#x000A;","");
    }
    while (str.indexOf("&#x000D;") !== -1){
        str = str.replace("&#x000D;","");
    }
    while (str.indexOf("&#12288;") !== -1){
        str = str.replace("&#12288;","");
    }
    str = str.replace(/[\r\n]/g,"");
    return(str);
};

export const toBadge = function(text, num, info){
    text = deletLast(text,',');
    num = num||4;
    info = info||'inverse';
    let textArray=text.split(',');
    text='';
    for(let y=0; y<(textArray.length); y++) {
        if((y !== 0) && (y % num === 0)){
            textArray[y] = '#' + textArray[y];
        }
        if(text === ''){
            text = textArray[y];
        }else{
            text = text + ',' + textArray[y];
        }
    }
    text = '<div class="badge badge-' + info + '">' + text.replace(/,#/g, '</div><br><div class="badge badge-' + info + '">').replace(/,/g, '</div>&nbsp;<div class="badge badge-' + info + '">') +
        '</div>';
    return text;
};

export const modalStatic = function(title, body, confirmBtn, modalID, confirmFunc, closeFunc, btnID, newBtnInfo){
    modalID = modalID || 'checkInfoModal';
    confirmFunc = confirmFunc || '';
    closeFunc = closeFunc || '';
    btnID=btnID || 'id="submitBtn"';
    newBtnInfo = newBtnInfo || '';
    return '' +
        '<div class="modal fade" style="overflow: auto" id="'+modalID+'" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">' +
        '    <div class="modal-dialog modal-dialog-centered" role="document">' +
        '        <div class="modal-content" style="word-break:break-all;">' +
        '            <div class="modal-header">' +
        '                <h5 class="modal-title">'+title+'</h5>' +
        '                <button type="button" class="close" data-dismiss="modal" onclick="'+closeFunc+'" >' +
        '                    <span aria-hidden="true">&times;</span>' +
        '                </button>' +
        '            </div>' +
        '            <div class="modal-body">' +
        '                ' +body+
        '            </div>' +
        '            <div class="modal-footer">' +newBtnInfo+
        '                <button type="button" class="btn btn-primary" '+btnID+'  data-dismiss="modal" data-loading-text="Loading ..." onclick="'+confirmFunc+'">'+confirmBtn+'</button>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '</div>';
};

export const regAcc = function (accList) {
    let regExp0 = /[a-zA-Z1-5.]/g;
    let regExp = /^[a-zA-Z1-5.]+$/;
    accList = clearNAndEmp(deletLast(accList,','));
    let failAcc = '';
    let accListArr = accList.split(',');
    for(let x=0; x<accListArr.length; x++) {
        if(accListArr[x] !== '0' && accListArr[x] !== '1'){
            if(accListArr[x].match(regExp0).length>12 || !regExp.test(accListArr[x])){
                failAcc += accListArr[x]+',';
            }
        }else if(accListArr[x] === '0'){
            failAcc += accListArr[x]+',';
        }
    }
    failAcc=deletLast(failAcc,',');
    if(failAcc!==''){
        return failAcc;
    }else{
        return false;
    }
};

export const regAccModal = function(accList, accType, formID){
    let errorInfo = accType+
        'account input error, does not meet EOSIO account name standards (account exceeds 12 digits or contains illegal characters):'+
        '<br><br>' + toBadge(accList);
    $("#checkInfoRegExp").html(modalStatic('Account list error',errorInfo,'Confirm','regExpErrInfoModal','','','', '<button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="delFormAcc(\''+accList+'\',\''+formID+'\')">'+'Delete the corresponding account')+'</button>');
    $('#regExpErrInfoModal').modal('show');
};
