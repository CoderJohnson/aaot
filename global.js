import ScatterJS from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs2";

import { infoBasic, htmlEncode, htmlDecode, deletLast, returnFloatString, ifArrayRepeat, ifExist, randomString, clearNAndEmp }from './lib.js';
import { publicNode } from './config.js';

window.connected = false;
window.currentAccount = null;
window.scatter_login=false;

ScatterJS.plugins( new ScatterEOS() );

window.ScatterJS = ScatterJS;

window.network = ScatterJS.Network.fromJson({
    blockchain: publicNode.chain,
    chainId: publicNode.chainId,
    host: publicNode.host,
    port: publicNode.port,
    protocol: publicNode.protocol
});

window.eos = null;

window.logout = () =>{
    ScatterJS && ScatterJS.logout().then();
    location.reload();
};

window.loginInfo=function(){
    infoBasic('Account: <div class="badge badge-info badge-sm">'+currentAccount.name+'</div><br><br>Authority: <div class="badge badge-info badge-sm">'+currentAccount.authority+'</div><br>Public key: '+currentAccount.publicKey+'<br><br>');
};

window.loginCheck=function(towards,account,authority,publicKey){
    scatter_login=true;
    infoBasic('Hi, <div class="badge badge-info badge-sm">'+account+'</div><br><br>Authority: <div class="badge badge-info badge-sm">'+authority+'</div><br>Public key: '+publicKey+'<br><br>');
};

window.Base64=function(){

    let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    };

    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    };

    let _utf8_encode = function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    };

    // private method for UTF-8 decoding
    let _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        let c1,c2,c3;
        let c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    };
};

window.isArray=function(obj){
    return (typeof obj==='object')&&obj.constructor===Array;
};

window.btnReset=function(btn){
    try{
        $('#'+btn+'').button('reset');
    }catch (e) {}
};

window.unfold=function(foldID){
    let state =$('#'+foldID+'Collapse').hasClass('in');
    jQuery(function(){
        $('#'+foldID+'Collapse').collapse('toggle');
    });
    if(!state){
        $('#'+foldID+'').html('<i class="fa fa-minus-square" style="width: auto;"></i>').attr('data-original-title','fold');
    }else{
        $('#'+foldID+'').html('<i class="fa fa-plus-square" style="width: auto;"></i>').attr('data-original-title','unfold');
    }
};

window.fold=function(foldID){
    jQuery(function(){
        $('#'+foldID+'').html('<i class="fa fa-plus-square" style="width: auto;"></i>').attr('data-original-title','unfold');
        $('#'+foldID+'Collapse').collapse('hide');
    });
};

window.writeHelpStatic=function(value,id,suffix){
    suffix = suffix || '';
    if(value==='more'){
        jQuery(function(){
            $("#"+id+"").html('<i class="fa fa-spin fa-spinner" style="width: auto;margin-right: 10px;"></i>'+langBasic.js('获取信息中 ...'));
        });
        moreTokenChoice(id);
        setTimeout(moreTokenAgain,16000,id);
    }else{
        let tokenInfo=value.split(',');
        document.getElementById('token_symbol'+suffix).value=tokenInfo[0];
        document.getElementById('token_contract'+suffix).value=tokenInfo[1];
        document.getElementById('token_precision'+suffix).value=tokenInfo[2];
    }
};

window.inputExpansion=function(textarea){
    let height=document.getElementById(textarea).rows;
    if(height===2){
        document.getElementById(textarea).rows=4;
        let expansionButton='<span href="#" style="float:right;" onclick="inputExpansionOff(\''+textarea+'\')">━</span><span href="#" style="float:right;margin-right:10px;" onclick="inputExpansion(\''+textarea+'\')">✚</span>';
        $("#input_expansion_"+textarea+"").html(expansionButton);
    }else{
        document.getElementById(textarea).rows+=1;
    }
};

window.inputExpansionOff=function(textarea){
    let height=document.getElementById(textarea).rows;
    if(height===4){
        document.getElementById(textarea).rows=2;
        let expansionButton='<span href="#" style="float:right;" onclick="inputExpansion(\''+textarea+'\')">✚</span>';
        $("#input_expansion_"+textarea+"").html(expansionButton);
    }else{
        document.getElementById(textarea).rows-=1;
    }
};

window.delFormAcc=function(accList, formID){
    let formElement = document.getElementById(formID);
    let formElementJQuery = $("#"+formID+"");
    let input_info = clearNAndEmp(formElement.value).split(',');
    let newArray = [];
    for (let i = 0; i < input_info.length; i++) {
        if (!ifExist( input_info[i], accList.split(',') )) {
            newArray .push(input_info[i]);
        }
    }
    if(formElementJQuery && formElementJQuery[0] && formElementJQuery[0].dataset && formElementJQuery[0].dataset.role && formElementJQuery[0].dataset.role === 'tagsinput'){
        for(let x=0; x<accList.split(',').length; x++) {
            formElementJQuery.tagsinput('remove',accList.split(',')[x]);
        }
    }else{
        formElement.value=deletLast(newArray.join(','),',');
    }
};
