import { infoBasic, htmlEncode, htmlDecode, deletLast, returnFloatString, getLocalTime, ifArrayRepeat, randomString, clearNAndEmp, toBadge, regAcc, regAccModal }from './lib.js';
import { publicNode } from './config.js';
import './global.js';

import { JsonRpc, Api, Serialize } from 'eosjs';//eosjs20.0.0beta3
let rpc = new JsonRpc( network.fullhost() );
let eos;

window.nameTools='Any Asset Over-the-counter Trading Tool - EOSTools.io';
window.describeTools='Trade any chain asset. Decentralized over-the-counter trading tool which uses only technology to create trust and protects the property safety of both parties to the transaction.';

window.accountsWait=[];
let r='';

let fieldsAjax=null;
let contractName='';
let contractAbiName='';
let json_basic=[];
let actionsPush=[];
let getAbiCheck=0;

let base = new Base64();

function expansionInfo(name){
    return '<span id="input_expansion_'+name+'">\n' +
        '    <span href="#" style="float:right;" onclick="inputExpansion(\''+name+'\')">✚</span>\n' +
        '</span>';
}

function getContractActionsAccountShow(name){
    let stringShow='' +
        '<div class="form-group">' +
        '    <label>'+name+'</label>' +expansionInfo(name)+
        '    <textarea class="form-control" type="text" required' +
        '              onkeydown="checkEnter(event)"' +
        '              onkeyup="value=value.replace(/[^\\a-\\z\\A-\\Z0-9\\.\\,]/g,\'\')"' +
        '              onpaste="value=value.replace(/[^\\a-\\z\\A-\\Z0-9\\.\\,]/g,\'\')"' +
        '              oncontextmenu = "value=value.replace(/[^\\a-\\z\\A-\\Z0-9\\.\\,]/g,\'\')"' +
        '              placeholder="Type: name; Enter EOS account name or other name data, please separate names with English commas" class="form-control" id="'+name+'"></textarea>' +
        '</div>';
    return(stringShow);
}

function getContractActionsAssetShow(name){
    let stringShow='' +
        '<div class="form-group">' +
        '    <label>'+name+'</label>' +expansionInfo(name)+
        '    <textarea class="form-control" type="text" required' +
        '           onkeydown="checkEnter(event)"' +
        '           onkeyup="value=value.replace(/[^\\a-\\z\\A-\\Z0-9\\.\\, ]/g,\'\')"' +
        '           onpaste="value=value.replace(/[^\\a-\\z\\A-\\Z0-9\\.\\, ]/g,\'\')"' +
        '           oncontextmenu = "value=value.replace(/[^\\a-\\z\\A-\\Z0-9\\.\\, ]/g,\'\')"' +
        '           placeholder="Type: asset; Enter amount and currency symbol, the format: 1.0000 EOS , please separate assets with English commas" class="form-control" id="'+name+'"></textarea>' +
        '</div>';
    return(stringShow);
}

function getContractActionsUintShow(name,typeInfo){
    let stringShow='' +
        '<div class="form-group">' +
        '    <label>'+name+'</label>' +expansionInfo(name)+
        '    <textarea id="'+name+'" type="text" placeholder="Type: '+typeInfo+'; Enter integer, please separate the integers with commas" required' +
        '           onkeydown="checkEnter(event)"' +
        '           onkeyup="value=value.replace(/[^\\0-9\\,]/g,\'\')"' +
        '           onpaste="value=value.replace(/[^\\0-9\\,]/g,\'\')"' +
        '           oncontextmenu = "value=value.replace(/[^\\0-9\\,]/g,\'\')"' +
        '           class="form-control"></textarea>' +
        '</div>';
    return(stringShow);
}

function getContractActionsChecksum256Show(name){
    let stringShow='' +
        '<div class="form-group">' +
        '    <label>'+name+'</label>' +expansionInfo(name)+
        '    <textarea class="form-control" type="text" required' +
        '              onkeydown="checkEnter(event)"' +
        '              onkeyup="value=value.replace(/[^\\a-\\z\\A-\\Z0-9\\.\\,]/g,\'\')"' +
        '              onpaste="value=value.replace(/[^\\a-\\z\\A-\\Z0-9\\.\\,]/g,\'\')"' +
        '              oncontextmenu = "value=value.replace(/[^\\a-\\z\\A-\\Z0-9\\.\\,]/g,\'\')"' +
        '              placeholder="Type: checksum256; sha256(...), please separate parameters with commas" class="form-control" id="'+name+'"></textarea>' +
        '</div>';
    return(stringShow);
}

function getContractActionsPublickeyShow(name){
    let stringShow='' +
        '<div class="form-group">' +
        '    <label>'+name+'</label>' +expansionInfo(name)+
        '    <textarea class="form-control" type="text" required' +
        '              onkeydown="checkEnter(event)"' +
        '              onkeyup="value=value.replace(/[^\\a-\\z\\A-\\Z0-9\\.\\,]/g,\'\')"' +
        '              onpaste="value=value.replace(/[^\\a-\\z\\A-\\Z0-9\\.\\,]/g,\'\')"' +
        '              oncontextmenu = "value=value.replace(/[^\\a-\\z\\A-\\Z0-9\\.\\,]/g,\'\')"' +
        '              placeholder="Type: public_key; Enter public key, please separate the public keys with commas" class="form-control" id="'+name+'"></textarea>' +
        '</div>';
    return(stringShow);
}

function getContractActionsBoolShow(name){
    let stringShow='' +
        '<div class="form-group">' +
        '    <label>'+name+'&nbsp;&nbsp;&nbsp;</label>' +
        '    <input type="checkbox" id="'+name+'" data-plugin="switchery" data-size="small" data-color="#3bafda" data-secondary-color="#98a6ad"/>' +
        '</div>';
    return(stringShow);
}

function getContractActionsStringShow(name){
    let stringShow='' +
        '<div class="form-group">' +
        '    <label>'+name+'</label>' +expansionInfo(name)+
        '    <textarea id="'+name+'" placeholder="Type: string; This parameter do not support comma-separated batch operations by default, if you want to perform batch operations on this parameter, please turn on the batch operation switch of this input box in the Advanced below."' +
        '              class="form-control"></textarea>' +
        '</div>';
    return(stringShow);
}

function getContractActionsOtherShow(name,typeInfo){
    let stringShow='' +
        '<div class="form-group">' +
        '    <label>'+name+'</label>' +expansionInfo(name)+
        '    <textarea id="'+name+'" placeholder="Type:'+typeInfo+'; This parameter do not support comma-separated batch operations by default, if you want to perform batch operations on this parameter, please turn on the batch operation switch of this input box in the Advanced below."' +
        '              class="form-control"></textarea>' +
        '</div>';
    return(stringShow);
}

window.getProposal=async function (){
    try {
        let proposer=document.getElementById("proposer_name").value;
        if(proposer===''){
            infoBasic('Proposer cannot be empty');
        }else{
            let resp = await rpc.get_table_rows({
                json: true,
                code: 'eosio.msig',
                scope: proposer,
                table: 'proposal',
                limit: 100,
                reverse: false,
                show_payer: false,
            });
            resp.rows=resp.rows.filter(function(n){
                return (n.proposal_name.indexOf('aaot.')===0)
            });
            if(resp.rows.length===0||JSON.stringify(resp.rows)==='[]'){
                infoBasic('No proposal was found under the account');
            }else{
                let proposalOptions='';
                for(let y=0;y<(resp.rows.length);y++) {
                    proposalOptions=proposalOptions+'<option value="'+resp.rows[y].packed_transaction+','+resp.rows[y].proposal_name+','+proposer+'">'+resp.rows[y].proposal_name+'</option>'
                }
                let proposalOptionsShow='' +
                    '    <label>Select a proposal *</label>' +
                    '    <select class="form-control select2" id="proposalChoiceSelect" onChange="getPrososalDetail(this.value);">' +
                    '        <option>Proposal name</option>' +proposalOptions+
                    '    </select>';
                $("#proposalChoice").html(proposalOptionsShow);
                $("#proposalChoiceSelect").select2();
                $('#proposalChoiceMode').collapse('show');
            }
        }
    } catch (e) {
        infoBasic('Error, please try again');
        console.log(e);
    }
};

window.getPrososalDetail=async function (packed_transaction){
    try {
        let passed=false;
        let proposalName=packed_transaction.split(',')[1];
        let proposer=packed_transaction.split(',')[2];
        let txInfo=Serialize.hexToUint8Array(packed_transaction.split(',')[0]);
        let txInfoJson=eos.deserializeTransaction(txInfo);
        let expiration=txInfoJson.expiration;
        let expirationUSA=turnToLocalTime(expiration);
        let expiration1=expiration.replace(/-/g, '/').replace(/T/g, ' ');
        expiration1=expiration1.slice(0, expiration1.length - 1);
        let actionsInfo=await eos.deserializeActions(txInfoJson.actions);

        let timezone = getLocalTime(0).getTime();

        if(timezone>Date.parse(expiration1)) passed=true;

        let expirationShow=new Date(expirationUSA.getTime()).toISOString().split('.')[0].replace(/T/g, ' ')+' (American time)'+(passed===true?' <b>Timed out</b>':'');

        let resp = await rpc.get_table_rows({
            json: true,
            code: 'eosio.msig',
            scope: proposer,
            table: 'approvals2',
            limit: 100,
            reverse: false,
            show_payer: false,
        });

        let permissionRequested='';
        let permissionProvided='';

        for(let y=0;y<(resp.rows.length);y++) {
            if(resp.rows[y].proposal_name===proposalName){
                for(let x=0;x<(resp.rows[y].requested_approvals.length);x++) {
                    permissionRequested=permissionRequested+resp.rows[y].requested_approvals[x].level.actor+'@'+resp.rows[y].requested_approvals[x].level.permission+',';
                }
                for(let x=0;x<(resp.rows[y].provided_approvals.length);x++) {
                    permissionProvided=permissionProvided+resp.rows[y].provided_approvals[x].level.actor+'@'+resp.rows[y].provided_approvals[x].level.permission+',';
                }
            }
        }
        permissionRequested=deletLast(permissionRequested,',');
        permissionProvided=deletLast(permissionProvided,',');

        let permissionRequestedArray=permissionRequested!==''?permissionRequested.split(','):'';
        let permissionProvidedArray=permissionProvided!==''?permissionProvided.split(','):'';

        let permissionRequestedShow='';
        let permissionProvidedShow='';

        if(permissionRequestedArray!==''){
            for(let y=0;y<(permissionRequestedArray.length);y++) {
                if((permissionRequestedArray[y].split('@')[0]===currentAccount.name)&&(permissionRequestedArray[y].split('@')[1]===currentAccount.authority)){
                    permissionRequestedShow=permissionRequestedShow+'<b>'+permissionRequestedArray[y]+'&nbsp;&nbsp;Awaiting</b>'+'<span class="btn btn-xs btn-primary" style="float:right;" onclick="approve(\''+permissionRequestedArray[y]+'\',\''+proposalName+'\',\''+proposer+'\')">Approve</span><br><br>';
                }
            }
            for(let y=0;y<(permissionRequestedArray.length);y++) {
                if(!((permissionRequestedArray[y].split('@')[0]===currentAccount.name)&&(permissionRequestedArray[y].split('@')[1]===currentAccount.authority))){
                    permissionRequestedShow=permissionRequestedShow+'<b>'+permissionRequestedArray[y]+'&nbsp;&nbsp;Awaiting</b><br><br>';
                }
            }
        }

        if(permissionProvidedArray!==''){
            for(let y=0;y<(permissionProvidedArray.length);y++) {
                if((permissionProvidedArray[y].split('@')[0]===currentAccount.name)&&(permissionProvidedArray[y].split('@')[1]===currentAccount.authority)){
                    permissionProvidedShow=permissionProvidedShow+'<a>'+permissionProvidedArray[y]+'&nbsp;&nbsp;Approved</a>'+'<span class="btn btn-xs btn-inverse btn-trans" style="float:right;" onclick="disapprove(\''+permissionProvidedArray[y]+'\',\''+proposalName+'\',\''+proposer+'\')">Disapprove</span><br><br>'
                }
            }
            for(let y=0;y<(permissionProvidedArray.length);y++) {
                if(!((permissionProvidedArray[y].split('@')[0]===currentAccount.name)&&(permissionProvidedArray[y].split('@')[1]===currentAccount.authority))){
                    permissionProvidedShow=permissionProvidedShow+'<a>'+permissionProvidedArray[y]+'&nbsp;&nbsp;Approved</a><br><br>';
                }
            }
        }

        let status=0;
        let statusTotalPermission=0;
        let statusAllowed=0;

        if(passed===true){
            status=2;
        }else if(permissionRequested===''||permissionRequested.length===0){
            status=1;
        }

        if(status!==2){
            statusTotalPermission=permissionRequestedArray.length+permissionProvidedArray.length;
            statusAllowed=permissionProvidedArray.length;
        }

        let statusShow=status===0?'<span class="badge badge-info badge-sm">Under approval</span>&nbsp;&nbsp;&nbsp;&nbsp;Approval progress: '+statusAllowed.toString()+' '+'/'+' '+statusTotalPermission.toString()+'':'';
        statusShow=status===1?'<span class="badge badge-info badge-sm">Waiting for execution</span>&nbsp;&nbsp;&nbsp;&nbsp;Approval progress: '+statusAllowed.toString()+' '+'/'+' '+statusTotalPermission.toString()+'':statusShow;
        statusShow=status===2?'<span class="badge badge-danger badge-sm">Timed out</span>':statusShow;

        let cancelBtnInfo='<a class="btn btn-inverse btn-trans" onclick="cancelProposal(\''+proposalName+'\',\''+proposer+'\')">' +
            '    Delete proposal' +
            '</a>';
        let excuteBtnInfo='<a class="btn btn-primary" onclick="executeProposal(\''+proposalName+'\',\''+proposer+'\')">' +
            '    Execute' +
            '</a>';
        let excuteBtnInfo0='<a class="btn btn-primary" onclick="executeProposalCheck(\''+permissionProvided+'\',\''+proposalName+'\',\''+proposer+'\')">' +
            '    Cross-progress execute' +
            '</a>';

        $("#proposalExpiration").html(expirationShow);
        $("#proposalDetailShow").html(jsonShow(actionsInfo,1));
        $("#proposalDetailShowJson").html(JSON.stringify(actionsInfo));
        $("#proposalStatus").html(statusShow);
        $("#proposalPermissoinList").html(permissionRequestedShow+permissionProvidedShow);
        $("#excuteBtn").html(excuteBtnInfo);
        $("#excuteBtn0").html(excuteBtnInfo0);
        setTimeout(function (){
            if(currentAccount.name===proposer){
                $("#cancelBtn").html(cancelBtnInfo);
                $("#cancelBtn0").html(cancelBtnInfo);
                $("#cancelBtn1").html(cancelBtnInfo);
            }
            $('#proposalDetailShowMode').collapse('show');
            $('#proposalDetailShowJsonMode').collapse('hide');
            $('#proposalDetailMode').collapse('show');
            setTimeout(function (){
                if(status===1){
                    $('#proposalDealMode0').collapse('hide');
                    $('#proposalDealMode1').collapse('hide');
                    $('#proposalDealMode').collapse('show');
                }else if(status===2){
                    $('#proposalDealMode0').collapse('hide');
                    $('#proposalDealMode').collapse('hide');
                    $('#proposalDealMode1').collapse('show');
                }else{
                    $('#proposalDealMode').collapse('hide');
                    $('#proposalDealMode1').collapse('hide');
                    $('#proposalDealMode0').collapse('show');
                }
            },500);
        },500);
    } catch (e) {
        console.log(e);
    }
};

window.refreshProposal=function(){
    try{
        function refreshStop(){
            $("#refreshFont").html('<i class="fa fa-refresh" style="width: auto;"></i>');
        }
        $("#refreshFont").html('<i class="fa fa-spin fa-refresh" style="width: auto;"></i>');
        let packed_transaction=document.getElementById("proposalChoiceSelect").value;
        getPrososalDetail(packed_transaction);
        setTimeout(refreshStop,3800);
    }catch (e) {
        infoBasic('Proposal information refresh error')
    }
};

function turnToLocalTime(ISOtime) {
    let ISOtime1=ISOtime.replace(/-/g, '/').replace(/T/g, ' ');
    let len = Date.parse(ISOtime1.slice(0, ISOtime1.length - 1));
    return new Date(len + 3600000 * 3);
}

window.proposalTextChange=function(num){
    num=num||0;
    if(num===1){
        jsonShowUpdate();
        $('#proposalTextMode').collapse('hide');
        $('#proposalTextShowMode').collapse('show');
    }else{
        $('#proposalTextShowMode').collapse('hide');
        $('#proposalTextMode').collapse('show');
    }
};

window.proposalDetailTextChange=function(num){
    num=num||0;
    if(num===1){
        $('#proposalDetailShowJsonMode').collapse('hide');
        $('#proposalDetailShowMode').collapse('show');
    }else{
        $('#proposalDetailShowMode').collapse('hide');
        $('#proposalDetailShowJsonMode').collapse('show');
    }
};

window.returnRadioValue=function(radioName){
    try{
        let selector;
        function whichRadioValueChecked(selector){
            let rtn = "";
            selector.each(function(){
                if($(this).prop("checked")){
                    rtn = $(this).attr("value");
                }
            });
            return rtn;
        }

        selector = $('input[type="radio"][name="'+radioName+'"]');
        let value = whichRadioValueChecked(selector);
        return(value);
    }catch (e) {
        console.log(e);
    }
};

window.replaceEmpPub=async function() {
    let jsonStr=document.getElementById('json_info').value.toString();
    jsonStr=clearNAndEmp(jsonStr);
    document.getElementById('json_info').value=jsonStr;
};

window.writeInAccName=function(){
    let proposer_name=document.getElementById("proposer_name");
    if(!proposer_name.value||proposer_name.value.length<1){
        proposer_name.value=currentAccount.name;
    }else{
        infoBasic("There is already content in the input box");
    }
};

window.changeNode=function(){
    let hostNew=document.getElementById("nodeInfo").value;
    if(hostNew.indexOf('.')!==-1){
        if(navigator.userAgent.indexOf('TokenPocket_Android') !== -1){
            ScatterJS.plugins( new ScatterEOS() );
            window.network = ScatterJS.Network.fromJson({
                blockchain:'eos',
                chainId:publicNode.chainID,
                host:hostNew,
                port:443,
                protocol:'https'
            });
            rpc = new JsonRpc(network.fullhost());
            handleLoginInfo();
            setEosInstance();
            infoBasic('Node switch succeeded');
        }else{
            window.network = ScatterJS.Network.fromJson({
                blockchain:'eos',
                chainId:publicNode.chainID,
                host:hostNew,
                port:443,
                protocol:'https'
            });
            rpc = new JsonRpc(network.fullhost());
            setEosInstance();
            infoBasic('Node switch succeeded');
        }
    }
};

function multiManageSelectShow(type){
    try{
        let multiManageShowInfoOption='';
        let paramsInfo=fieldsAjax.split(',');
        for(let x=0;x<(paramsInfo.length);x++) {
            let type_obj=paramsInfo[x].split(' ')[1];
            let name_obj=paramsInfo[x].split(' ')[0];
            if((!if_allowed_multi(type_obj,0,type))&&(type_obj!=='bool')){
                multiManageShowInfoOption=multiManageShowInfoOption+'<option value="'+name_obj+'">'+name_obj+'</option>\n'
            }
        }
        let multiManageShowInfo='' +
            '<select name="nodeRotationGroupName" class="multi-select" multiple="" id="multiManageGroup'+type+'">' + multiManageShowInfoOption +
            '</select>';
        $("#multiManageInfo"+type).html(multiManageShowInfo);
    }catch (e) {
        console.log(e);
    }
}

function getAccountsSelectShow(type){
    try{
        let getAccountsSelectShowInfoOption='';
        for(let y=0;y<(fieldsAjax.split(',').length);y++) {
            (async function(y){
                let optionName=fieldsAjax.split(',')[y].split(' ')[0];
                getAccountsSelectShowInfoOption=getAccountsSelectShowInfoOption+'<option value="'+optionName+'">'+optionName+'</option>\n'
            })(y);
        }
        let getAccountsSelectKeyShowInfo='' +
            '<select class="form-control select2" id="formSelectKey'+type+'">' + getAccountsSelectShowInfoOption +
            '</select>';
        jQuery(function(){
            $("#getAccountsByKeyContract"+type).html(getAccountsSelectKeyShowInfo);
            !window.Select2 || $("#formSelectKey"+type).select2();
        });
    }catch (e) {
        console.log(e);
    }
}

const wait_info = function(text,type) {
    $("#waitInfo"+type).html(text);
    clearTimeout(r);
    if(text!==''){
        r=setTimeout(wait_info,60000,'',type);
    }
};

const if_allowed_multi = function(type,name,suffix) {
    name=name||0;
    if((name!==0)&&(Number(!!document.getElementById('multiManage'+suffix).checked)===1)){
        let result=false;
        const options = document.querySelector('#multiManageGroup'+suffix).options;
        if(options.length!==0){
            for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                    if(name===options[i].value){
                        result=true;
                    }
                }
            }
            if(!result){
                return type === 'name' || type === 'asset' || type === 'checksum256' || type === 'public_key' || (type[0] === 'u' && type[1] === 'i' && type[2] === 'n' && type[3] === 't')||(type[0] === 'i' && type[1] === 'n' && type[2] === 't');
            }else{
                return result;
            }
        }else{
            return type === 'name' || type === 'asset' || type === 'checksum256' || type === 'public_key' || (type[0] === 'u' && type[1] === 'i' && type[2] === 'n' && type[3] === 't')||(type[0] === 'i' && type[1] === 'n' && type[2] === 't');
        }
    }else{
        return type === 'name' || type === 'asset' || type === 'checksum256' || type === 'public_key' || (type[0] === 'u' && type[1] === 'i' && type[2] === 'n' && type[3] === 't')||(type[0] === 'i' && type[1] === 'n' && type[2] === 't');
    }
};

window.connect=async function(){
    connected = await ScatterJS.scatter.connect('EOSTools');
};

window.login=async function(){
    if (!connected) {
        alert('Connection error');
        return;
    }
    try {
        let result = await ScatterJS.scatter.getIdentity({accounts:[network]});
        currentAccount = result.accounts[0];
        if(currentAccount.blockchain!=='eos'){
            alert('Login failed, please log in with your EOS account.');
        }else{
            scatter_login=true;
            alert('login succeeded! ' + currentAccount.name);
        }
    } catch (e) {
        alert("login fail");
    }
};

window.handleLogin=async function() {
    await connect();
    await login();
};

async function login_info_get(){
    if (!connected) {
        infoBasic('Failed to connect to wallet, please try again or refresh the page');
        btnReset('submitBtn');
        //return;
    }
    try {
        let result = await ScatterJS.scatter.getIdentity({accounts:[network]});
        currentAccount = result.accounts[0];
    } catch (e) {
        infoBasic("Failed to connect to wallet, please try again or refresh the page");
        btnReset('submitBtn');
    }
}

async function handleLoginInfo() {
    await connect();
    await login_info_get();
}

const dimensionDeal =function(dimension_count,dimension_data,contract,contract_ABI,authorization,suffix){
    json_basic=[];
    if(if_allowed_multi(dimension_data[0].type,dimension_data[0].key,suffix)){
        for(let x=0;x<(dimension_data[0].data.split(',').length);x++) {
            json_basic[x]={};
            if(((dimension_data[0].type[0]==='u')&&(dimension_data[0].type[1]==='i')&&(dimension_data[0].type[2]==='n')&&(dimension_data[0].type[3]==='t'))||((dimension_data[0].type[0]==='i')&&(dimension_data[0].type[1]==='n')&&(dimension_data[0].type[2]==='t'))){
                json_basic[x][dimension_data[0].key]=Number(dimension_data[0].data.split(',')[x]);
            }else{
                json_basic[x][dimension_data[0].key]=dimension_data[0].data.split(',')[x];
            }
        }
    }else{
        json_basic[0]={};
        if(((dimension_data[0].type[0]==='u')&&(dimension_data[0].type[1]==='i')&&(dimension_data[0].type[2]==='n')&&(dimension_data[0].type[3]==='t'))||((dimension_data[0].type[0]==='i')&&(dimension_data[0].type[1]==='n')&&(dimension_data[0].type[2]==='t'))){
            json_basic[0][dimension_data[0].key]=Number(dimension_data[0].data);
        }else{
            json_basic[0][dimension_data[0].key]=dimension_data[0].data;
        }
    }
    if(dimension_count>1){
        for(let z=1;z<dimension_count;z++) {
            let dimension_name=dimension_data[z].key;
            let json_default=[];
            if(if_allowed_multi(dimension_data[z].type,dimension_data[z].key,suffix)){
                for(let x=0;x<(dimension_data[z].data.split(',').length);x++) {
                    for(let y=0;y<(json_basic.length);y++) {
                        if(((dimension_data[z].type[0]==='u')&&(dimension_data[z].type[1]==='i')&&(dimension_data[z].type[2]==='n')&&(dimension_data[z].type[3]==='t'))||((dimension_data[z].type[0]==='i')&&(dimension_data[z].type[1]==='n')&&(dimension_data[z].type[2]==='t'))){
                            json_basic[y][dimension_name]=Number(dimension_data[z].data.split(',')[x]);
                        }else{
                            json_basic[y][dimension_name]=dimension_data[z].data.split(',')[x];
                        }
                    }
                    json_default[x]=[];
                    for(let y=0;y<(json_basic.length);y++) {
                        json_default[x][y]={};
                        for (let key_info in json_basic[y]) {
                            if(json_basic[y].hasOwnProperty(key_info)){
                                json_default[x][y][key_info]=json_basic[y][key_info];
                            }
                        }
                    }
                }
                json_basic =[];
                for(let x=0;x<(json_default.length);x++) {
                    json_basic = json_basic.concat(json_default[x]);
                }
            }else{
                for(let y=0;y<(json_basic.length);y++) {
                    if(((dimension_data[z].type[0]==='u')&&(dimension_data[z].type[1]==='i')&&(dimension_data[z].type[2]==='n')&&(dimension_data[z].type[3]==='t'))||((dimension_data[z].type[0]==='i')&&(dimension_data[z].type[1]==='n')&&(dimension_data[z].type[2]==='t'))){
                        json_basic[y][dimension_name]=Number(dimension_data[z].data);
                    }else{
                        json_basic[y][dimension_name]=dimension_data[z].data;
                    }
                }
            }
        }
        let arrayObj = [];
        for(let x=0;x<(json_basic.length);x++) {
            arrayObj[x]={
                account:contract,
                name: contract_ABI,
                authorization: authorization,
                data: json_basic[x],
            };
        }
        return arrayObj;
    }else{
        let arrayObj = [];
        for(let x=0;x<(json_basic.length);x++) {
            arrayObj[x]={
                account:contract,
                name: contract_ABI,
                authorization: authorization,
                data: json_basic[x],
            }
        }
        return arrayObj;
    }
};

window.getContractActionsAbiShow=async function(name,contractName,data,type) {
    $('#contractAbiCheckButtonMode'+type).collapse('hide');
    $('#contractAbiInfoMode'+type).collapse('hide');
    $("#contractAbiInfo"+type).html('');
    let getAbiCheckNow=getAbiCheck+1;
    getAbiCheck=getAbiCheck+1;
    contractAbiName=name;
    data=JSON.parse(base.decode(data));
    if(data.abi){
        if(data.abi.structs&&data.abi.actions&&data.abi.tables){
            let abiStructs=data.abi.structs;
            fieldsAjax='';
            let arrayObj = [];
            for(let x=0;x<(abiStructs.length);x++) {
                if (abiStructs[x].name === contractAbiName) {
                    let abiActionsAbi=abiStructs[x].fields;
                    for(let y=0; y<(abiActionsAbi.length); y++) {
                        let name_obj=abiActionsAbi[y].name;
                        fieldsAjax=fieldsAjax+name_obj+' '+abiActionsAbi[y].type+',';
                        switch(abiActionsAbi[y].type){
                            case 'name':
                                arrayObj[y]= getContractActionsAccountShow(name_obj);
                                break;
                            case 'asset':
                                arrayObj[y]= getContractActionsAssetShow(name_obj);
                                break;
                            case 'checksum256':
                                arrayObj[y]= getContractActionsChecksum256Show(name_obj);
                                break;
                            case 'public_key':
                                arrayObj[y]= getContractActionsPublickeyShow(name_obj);
                                break;
                            case 'bool':
                                arrayObj[y]= getContractActionsBoolShow(name_obj);
                                break;
                            case 'string':
                                arrayObj[y]= getContractActionsStringShow(name_obj);
                                break;
                            default:
                                if(((abiActionsAbi[y].type[0]==='u')
                                    &&(abiActionsAbi[y].type[1]==='i')
                                    &&(abiActionsAbi[y].type[2]==='n')
                                    &&(abiActionsAbi[y].type[3]==='t'))
                                    ||((abiActionsAbi[y].type[0]==='i')
                                        &&(abiActionsAbi[y].type[1]==='n')
                                        &&(abiActionsAbi[y].type[2]==='t'))){
                                    arrayObj[y]= getContractActionsUintShow(name_obj,abiActionsAbi[y].type);
                                }else{
                                    arrayObj[y]= getContractActionsOtherShow(name_obj,abiActionsAbi[y].type);
                                }
                        }
                    }
                }
            }
            let contractActionsAbiHtml='';
            for (let x = 0; x < (arrayObj.length); x++) {
                (async function (x) {
                    contractActionsAbiHtml = contractActionsAbiHtml + arrayObj[x];
                })(x);
            }
            fieldsAjax=fieldsAjax.substr(0,fieldsAjax.length-1);
            if(getAbiCheck===getAbiCheckNow){
                getAccountsSelectShow(type);
                multiManageSelectShow(type);
                function showCollapse(){
                    $("#contractAbiInfo"+type).html(contractActionsAbiHtml);
                    $('#contractAbiInfoMode'+type).collapse('show');
                    $('#contractAbiCheckButtonMode'+type).collapse('show');
                }
                setTimeout(showCollapse,1000);
            }
        }else{
            infoBasic('Error, failed to get the contract ABI information<br><br>');
        }
    }else{
        infoBasic('Error, failed to get the contract ABI information<br><br>');
    }
};

window.getContractActionsShow=async function(type) {
    $('#getContractBtn'+type).button('loading');
    setTimeout(btnReset,20000,'getContractBtn'+type);
    try {
        if(!scatter_login)return handleLogin();
        $("#contractAbiInfo"+type).html('');
        contractName=document.getElementById(type==="Get"?"contract_name_get":"contract_name_sent").value.toLowerCase();
        try{
            wait_info('<span><i class="fa fa-spin fa-spinner" style="width: auto;margin-right: 10px;"></i>Getting the contract info ...</span>', type);
            const data = await rpc.get_abi(contractName);
            if(data.abi){
                if(data.abi.structs&&data.abi.actions&&data.abi.tables){
                    let abiActions=data.abi.actions;
                    let abiTables=data.abi.tables;
                    let contractActionsHtml='';
                    let contractTablsHtml='';
                    try{
                        for (let x = 0; x < (abiActions.length); x++) {
                            contractActionsHtml = contractActionsHtml + '&option value=%'+abiActions[x].name+'%@'+abiActions[x].name+'&/option@'
                        }
                        for (let x = 0; x < (abiTables.length); x++) {
                            contractTablsHtml = contractTablsHtml + '&option value=%'+abiTables[x].name+'%@'+abiTables[x].name+'&/option@'
                        }
                        contractActionsHtml=contractActionsHtml.replace(/%/g, '"').replace(/&/g, '<').replace(/@/g, '>');
                        let contractActionsHtmlShow='' +
                            '    <label>Contract ABI *</label>' +
                            '    <select class="form-control select2" id="abiInfo'+type+'" onChange="getContractActionsAbiShow(this.value,\''+contractName+'\',\''+base.encode(JSON.stringify(data))+'\',\''+type+'\');">' +
                            '        <option>Select / search</option>' +
                            '        <optgroup label="Actions">' +contractActionsHtml+
                            '        </optgroup>' +
                            '    </select>';
                        wait_info('', type);
                        $("#contractInfo"+type).html(contractActionsHtmlShow);
                        try{
                            !window.Select2 || $("#abiInfo"+type).select2();
                        }catch (e) {
                            console.log(e);
                        }
                        $('#contractInfoMode'+type).collapse('show');
                    }catch(error){
                        infoBasic('Error');
                    }
                }else{
                    infoBasic('Error, failed to get the contract ABI information');
                }
            }else if(data.message){
                infoBasic(data.message);
            }else{
                infoBasic('Error, failed to get the contract ABI information');
            }
            btnReset('getContractBtn'+type);
        }catch (e) {
            infoBasic("Error, please refresh and try again");
            btnReset('getContractBtn'+type);
        }
    } catch (e) {alert(e)}
};

async function setEosInstance(){
    if(currentAccount == null){
        await handleLoginInfo();
        eos = ScatterJS.scatter.eos(network, Api, {rpc, beta3:true});
    } else {
        eos = ScatterJS.scatter.eos(network, Api, {rpc, beta3:true});
    }
}

function getTimeInfo(){
    let timeNum=Number(document.getElementById("validityPeriod").value);
    let validityPeriod='';
    switch(timeTypeNow){
        case 'minutes':
            validityPeriod=timeNum.toString()+' '+'minutes';
            break;
        case 'hours':
            validityPeriod=timeNum.toString()+' '+'hours';
            break;
        case 'days':
            validityPeriod=timeNum.toString()+' '+'days';
            break;
        default:
    }
    return validityPeriod;
}

function getPermissionInfo(inputID){
    let infoCount=0;
    let permissionInfo='';
    switch(inputID){
        case 'totalPermission':
            infoCount=permissionInputCount.total+1;
            break;
        case 'transferPermission':
            infoCount=permissionInputCount.transfer+1;
            break;
        case 'contractPermission':
            infoCount=permissionInputCount.contract+1;
            break;
        case 'transferNFTAtomicPermission':
            infoCount=permissionInputCount.nft.atomic;
            break;
        default:
            break;
    }
    for(let y=0;y<infoCount;y++) {
        permissionInfo=((document.getElementById(inputID+y.toString()).value!=='')&&(document.getElementById(inputID+y.toString()).value.length>2))?(permissionInfo+htmlEncode(document.getElementById(inputID+y.toString()).value)+','):permissionInfo;
    }
    permissionInfo=deletLast(permissionInfo,',');
    return permissionInfo;
}

window.approve=async function(permission,proposal_name,proposer){
    try {
        if(scatter_login){
            try{
                const result = await eos.transact({
                    actions: [{
                        account:'eosio.msig',
                        name: 'approve',
                        authorization: [{
                            actor: currentAccount.name,
                            permission: currentAccount.authority,
                        }],
                        data: {
                            level:{
                                actor:permission.split('@')[0],
                                permission: permission.split('@')[1]
                            },
                            proposal_name: proposal_name,
                            proposer: proposer
                        },
                    }]
                },{
                    blocksBehind: 6,
                    expireSeconds: 300,
                });
                infoBasic('Transaction submitted succeeded');
                refreshProposal();
            }catch (e) {
                infoBasic("Error, "+e.toString());
                console.log(e);
            }
        }else{
            handleLogin();
        }
    } catch (e) {
        console.log(e);
    }
};

window.disapprove=async function(permission,proposal_name,proposer){
    try {
        if(scatter_login){
            try{
                const result = await eos.transact({
                    actions: [{
                        account:'eosio.msig',
                        name: 'disapprove',
                        authorization: [{
                            actor: currentAccount.name,
                            permission: currentAccount.authority,
                        }],
                        data: {
                            level:{
                                actor:permission.split('@')[0],
                                permission: permission.split('@')[1]
                            },
                            proposal_name: proposal_name,
                            proposer: proposer
                        },
                    }]
                },{
                    blocksBehind: 6,
                    expireSeconds: 300,
                });
                infoBasic('Transaction submitted succeeded');
                refreshProposal();
            }catch (e) {
                infoBasic("Error, "+e.toString());
            }
        }else{
            handleLogin();
        }
    } catch (e) {
        console.log(e);
    }
};

window.executeProposal=async function(proposal_name,proposer,num){
    try {
        num=num||0;
        if(scatter_login){
            try{
                const result = await eos.transact({
                    actions: [{
                        account:'eosio.msig',
                        name: 'exec',
                        authorization: [{
                            actor: currentAccount.name,
                            permission: currentAccount.authority,
                        }],
                        data: {
                            executer:currentAccount.name,
                            proposal_name: proposal_name,
                            proposer: proposer
                        },
                    }]
                },{
                    blocksBehind: 6,
                    expireSeconds: 300,
                });
                infoBasic('Transaction submitted succeeded');
                refreshProposal();
                if(num===1) $('#checkInfoModal').modal('hide');
            }catch (e) {
                infoBasic("Error, "+e.toString());
            }
        }else{
            handleLogin();
        }
    } catch (e) {
        console.log(e);
    }
};

window.cancelProposal=async function(proposal_name,proposer){
    try {
        if(scatter_login){
            try{
                const result = await eos.transact({
                    actions: [{
                        account:'eosio.msig',
                        name: 'cancel',
                        authorization: [{
                            actor: currentAccount.name,
                            permission: currentAccount.authority
                        }],
                        data: {
                            canceler:currentAccount.name,
                            proposal_name: proposal_name,
                            proposer: proposer
                        },
                    }]
                },{
                    blocksBehind: 6,
                    expireSeconds: 300,
                });
                infoBasic('Transaction submitted succeeded');
            }catch (e) {
                infoBasic("Error, "+e.toString());
            }
        }else{
            handleLogin();
        }
    } catch (e) {
        console.log(e);
    }
};

window.executeProposalCheck=function(permissionProvided,proposal_name,proposer){
    try {
        if(permissionProvided===''){
            infoBasic('The current proposal does not have any valid authorization and does not meet the cross-progress execution conditions')
        }else{
            let actionsInfo=JSON.parse(document.getElementById("proposalDetailShowJson").innerText);
            let permissionProvidedArray=permissionProvided.split(',');
            let permissionLack='';
            for(let x=0;x<(actionsInfo.length);x++) {
                for(let y=0;y<(actionsInfo[x].authorization.length);y++) {
                    let permissionNeed=actionsInfo[x].authorization[y].actor+'@'+actionsInfo[x].authorization[y].permission;
                    let flag=false;
                    for(let z=0;z<(permissionProvidedArray.length);z++) {
                        flag=permissionNeed===permissionProvidedArray[z]?true:flag;
                    }
                    if(!flag) permissionLack=permissionLack+permissionNeed+',';
                }
            }
            permissionLack=deletLast(permissionLack,',');
            if(permissionLack===''){
                executeProposal(proposal_name,proposer);
            }else{
                let check_info_string='' +
                    '<div class="modal fade" style="overflow: auto" id="checkInfoModal" tabindex="-1" role="dialog" aria-hidden="true">' +
                    '    <div class="modal-dialog modal-dialog-centered" role="document">' +
                    '        <div class="modal-content" style="word-break:break-all;">' +
                    '            <div class="modal-header">' +
                    '                <h5 class="modal-title">Cross-progress execution</h5>' +
                    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                    '                    <span aria-hidden="true">&times;</span>' +
                    '                </button>\n' +
                    '            </div>\n' +
                    '            <div class="modal-body">' +
                    '                <span class="badge badge-success badge-sm">Attention</span>&nbsp;The current proposal does not have all authorizations and will attempt to execute across progress, only if all unapproved authorizations have been authorized to approved authorizations through account authorization, the operation can proceed.<br><br>' +

                    '                Unapproved authorization list: <br><br>'+toBadge(permissionLack,2)+'<br><br>' +

                    '                Please confirm that you have carefully reviewed the proposal details, once the proposal is executed, it will be irreversible' +
                    '            </div>' +
                    '            <div class="modal-footer">' +
                    '                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>' +
                    '                <button type="button" class="btn btn-primary" onclick="executeProposal(\''+proposal_name+'\',\''+proposer+'\',1)">Confirm</button>' +
                    '            </div>' +
                    '        </div>' +
                    '    </div>' +
                    '</div>';
                jQuery(function(){
                    $("#checkInfo").html(check_info_string);
                    $('#checkInfoModal').modal('show');
                });
            }
        }
    } catch (e) {
        console.log(e);
    }
};

window.proposal=async function(proposalName){
    $('#submitBtn').button('loading');
    setTimeout(btnReset,40000,'submitBtn');
    try {
        if(scatter_login){
            let arrayObjAuth=[];
            let o=0;
            for(let x=0;x<(permissionInputCount.total+1);x++) {
                let totalPermissionInfo=document.getElementById('totalPermission'+x.toString()+'').value;
                if(totalPermissionInfo!==''&&totalPermissionInfo.length>2&&totalPermissionInfo.split('@')[0]&&totalPermissionInfo.split('@')[1]){
                    arrayObjAuth[o]={
                        actor: totalPermissionInfo.split('@')[0],
                        permission: totalPermissionInfo.split('@')[1],
                    };
                    o=o+1;
                }
            }
            let timeNum=Number(document.getElementById("validityPeriod").value);
            switch(timeTypeNow){
                case 'minutes':
                    timeNum=parseInt((timeNum*60).toString());
                    break;
                case 'hours':
                    timeNum=parseInt((timeNum*3600).toString());
                    break;
                case 'days':
                    timeNum=parseInt((timeNum*86400).toString());
                    break;
                default:
            }
            try{

                let sAction=await eos.serializeActions(actionsPush);

                let expireSeconds = Number(timeNum);
                let timezone = new Date().getTime();
                let expired = new Date(timezone + expireSeconds * 1000);
                let expiration = expired.toISOString().split('.')[0];

                try {
                    const result = await eos.transact({
                        actions: [{
                            account:'eosio.msig',
                            name:'propose',
                            authorization: [{
                                actor: currentAccount.name,
                                permission: currentAccount.authority,
                            }],
                            data:{
                                proposal_name:proposalName,
                                proposer:currentAccount.name,
                                requested:arrayObjAuth,
                                trx:{
                                    actions:sAction,
                                    context_free_actions:[],
                                    delay_sec:0,
                                    expiration: expiration,
                                    max_net_usage_words: 0,
                                    max_cpu_usage_ms: 0,
                                    ref_block_num:0,
                                    ref_block_prefix: 0,
                                    transaction_extensions: []
                                }
                            }
                        },{
                            account:'eosio.msig',
                            name: 'approve',
                            authorization: [{
                                actor: currentAccount.name,
                                permission: currentAccount.authority,
                            }],
                            data: {
                                level:{
                                    actor: currentAccount.name,
                                    permission: currentAccount.authority
                                },
                                proposal_name: proposalName,
                                proposer: currentAccount.name
                            },
                        }]
                    },{
                        blocksBehind: 6,
                        expireSeconds: 300,
                    });
                    $('#checkInfoModal').modal('hide');
                    infoBasic('Transaction submitted succeeded');
                    btnReset('submitBtn');
                } catch (e) {
                    errorDeal(e);
                    btnReset('submitBtn');
                }
            }catch (e) {
                alert(e);
                btnReset('submitBtn');
            }
        }else{
            handleLogin();
            btnReset('submitBtn');
        }
    } catch (e) {
        alert(e);
        btnReset('submitBtn');
    }
};

window.makeContractCheck=async function(type){
    $('#collapseInfoBasicContract'+type).collapse('hide');
    try {
        if(scatter_login){
            await setEosInstance();
            let arrayObjAuth=[];
            let authShow='';
            let o=0;
            let flag=false;
            let flag0=false;
            if(type==='Sent'){
                authShow=currentAccount.name +'@'+ currentAccount.authority;
                flag0=true;
            }else{
                for(let x=0;x<(permissionInputCount.contract+1);x++) {
                    let contractPermissionInfo=clearNAndEmp(document.getElementById('contractPermission'+type+x.toString()+'').value);
                    flag0=contractPermissionInfo?true:flag0;
                    flag=(contractPermissionInfo&&contractPermissionInfo.indexOf('@')===-1)?true:flag;
                    if(contractPermissionInfo!==''&&contractPermissionInfo.length>2&&contractPermissionInfo.split('@')[0]&&contractPermissionInfo.split('@')[1]){
                        authShow=authShow+htmlEncode(contractPermissionInfo)+',';
                        arrayObjAuth[o]={
                            actor: contractPermissionInfo.split('@')[0],
                            permission: contractPermissionInfo.split('@')[1],
                        };
                        o=o+1;
                    }
                }
            }
            if(flag){
                infoBasic('Permission must contain the authority, that is, it must be in the format of account@authority<br><br>')
            }else if(!flag0){
                infoBasic('Permission cannot be empty')
            }else{
                authShow=deletLast(authShow,',');
                let actionsCount=1;
                let arrayObj = [];
                let paramsInfo=fieldsAjax.split(',');
                for(let y=0;y<(paramsInfo.length);y++) {
                    let type_obj=paramsInfo[y].split(' ')[1];
                    let name_obj=paramsInfo[y].split(' ')[0];
                    let data_info=document.getElementById(name_obj).type==='checkbox'?(Number(!!document.getElementById(name_obj).checked)===1):document.getElementById(name_obj).value;
                    if(if_allowed_multi(type_obj,name_obj,type)){
                        actionsCount=actionsCount*(data_info.split('@').length);
                    }
                    arrayObj[y]={
                        key:name_obj,
                        data: data_info,
                        type:type_obj
                    };
                }
                let actionsPush=dimensionDeal(paramsInfo.length,arrayObj,contractName,contractAbiName,arrayObjAuth,type);
                let contractAbiInfo='';
                for(let x=0;x<(actionsPush.length);x++) {
                    if((actionsPush[x].account)&&(actionsPush[x].name)){
                        let contractAbiInfoAdd=actionsPush[x].account+':: '+actionsPush[x].name;
                        if(contractAbiInfo===''){
                            contractAbiInfo=contractAbiInfoAdd;
                        }else if(contractAbiInfo.indexOf(contractAbiInfoAdd)===-1){
                            contractAbiInfo=contractAbiInfo+','+contractAbiInfoAdd;
                        }
                    }
                }
                let contractAbiShow='Contract ABI:  ' +toBadge(contractAbiInfo,4)+
                    '<br>';
                let ifRepeat=ifArrayRepeat(actionsPush)?'<span class="badge badge-danger badge-sm">Warning!</span>&nbsp;There are the same actions in your actions, if this is not your intentional action, please cancel and review<br><br>':'';
                let operatTooMuch=actionsCount>199?'<span class="badge badge-success badge-sm">Attention</span>&nbsp;You have added too many actions at one time. It\'s recommended no more than 100 actions in a single transaction.<br><br>':'';
                let check_info_string='' +
                    '<div class="alert alert-info fade in m-b-0">\n' +
                    '    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>\n' +
                    '    <h4>Transaction</h4>\n' +  ifRepeat+operatTooMuch+
                    '        Number of actions:  <span class="badge badge-info badge-sm">'+actionsCount.toString()+'</span><br>\n' +contractAbiShow+
                    '        <br>Permission: <br><br>'+toBadge(deletLast(authShow,','),4)+''+
                    '    <p class="m-t-10">\n' +
                    '        <button type="button" class="btn btn-info waves-effect waves-light" onclick="makeContractJson(\''+type+'\')">Confirm</button>\n' +
                    '        <button type="button" class="btn btn-default waves-effect" class="close" data-dismiss="alert" aria-hidden="true">Cancel</button>\n' +
                    '    </p>\n' +
                    '</div>';
                jQuery(function(){
                    $("#checkInfoContract"+type).html(check_info_string);
                    $('#collapseCheckInfoContract'+type).collapse('show');
                });
            }
        }else{
            handleLogin();
        }
    } catch (e) {alert(e)}
};

window.makeTransferCheck=function(num, type){
    num=num||0;
    try {
        if(scatter_login){
            $('#collapseInfoBasicTransfer'+type).collapse('hide');
            let from_accounts='';
            let to_accounts='';
            let transfer_num=clearNAndEmp(htmlEncode(document.getElementById((type==='Sent'?"transfer_num_sent":"transfer_num_get")).value));
            if(type==='Get')from_accounts=clearNAndEmp(htmlEncode(deletLast(document.getElementById("from_accounts").value,',')));
            if(type==='Sent')to_accounts=clearNAndEmp(htmlEncode(deletLast(document.getElementById("to_accounts").value,',')));
            if(type==='Get')to_accounts=currentAccount.name;
            if(type==='Sent')from_accounts=currentAccount.name;
            let token_contract=clearNAndEmp(htmlEncode(document.getElementById(type==='Sent'?"token_contract_sent":"token_contract_get").value));
            let duplicate_to_accounts=ifArrayRepeat(to_accounts.split(","));
            let duplicate_from_accounts=ifArrayRepeat(from_accounts.split(","));
            if((num===0)&&(duplicate_to_accounts||duplicate_from_accounts)){
                let check_info_string='' +
                    '<div class="modal fade" style="overflow: auto" id="checkInfoAnoModal" tabindex="-1" role="dialog" aria-hidden="true">\n' +
                    '    <div class="modal-dialog modal-dialog-centered">\n' +
                    '        <div class="modal-content">\n' +
                    '            There are duplicate accounts in the '+(duplicate_to_accounts?'receiving accounts':'from-accounts')+' you entered. Do you want to delete the duplicate accounts? (this may rearrange the sort order of your input ids)<br><br>' +
                    '            <div class="form-group text-right m-b-0">\n' +
                    '                <a class="btn btn-default btn-trans" data-dismiss="modal" onclick="makeTransferCheck(1, \''+type+'\')">\n' +
                    '                    Ignore\n' +
                    '                </a>\n' +
                    '                <a class="btn btn-primary" data-dismiss="modal" onclick="delDuplicateAcc(\''+(duplicate_to_accounts?'to_accounts':'from_accounts')+'\')">\n' +
                    '                    Yes, delete the duplicate accounts\n' +
                    '                </a>\n' +
                    '            </div>\n' +
                    '        </div>\n' +
                    '    </div>\n' +
                    '</div>';
                jQuery(function(){
                    $("#checkInfoAno").html(check_info_string);
                    $('#checkInfoAnoModal').modal('show');
                });
            }else if(Number(transfer_num)===0){
                infoBasic('Transfer amount cannot be empty or zero')
            }else if(from_accounts===''||from_accounts===null||from_accounts.length===0){
                infoBasic('From-accounts cannot be empty')
            }else if(to_accounts===''||to_accounts===null||to_accounts.length===0){
                infoBasic('Receiving account cannot be empty')
            }else if(token_contract===''||token_contract===null||token_contract.length===0){
                infoBasic('Token contract account cannot be empty')
            }else if(regAcc(to_accounts)){
                regAccModal(regAcc(to_accounts),'Receiving ',(type==='Sent'?'to_accounts_sent':'to_accounts_get'));
            }else if(regAcc(from_accounts)){
                regAccModal(regAcc(from_accounts),'From-',(type==='Sent'?'from_accounts_sent':'from_accounts_get'));
            }else if(regAcc(token_contract)){
                infoBasic('The contract account is wrong and does not meet the EOS account name standard (the account exceeds 12 characters or contains illegal characters)<br><br>')
            }else{
                let authShow='';
                let o=0;
                let flag=false;
                let flag0=false;
                if(type==='Sent'){
                    authShow=currentAccount.name +'@'+ currentAccount.authority;
                    flag0=true;
                }else{
                    for(let x=0;x<(permissionInputCount.transfer+1);x++) {
                        let transferPermissionInfo=clearNAndEmp(document.getElementById('transferPermission'+x.toString()+'').value);
                        flag0=transferPermissionInfo?true:flag0;
                        flag=(transferPermissionInfo&&transferPermissionInfo.indexOf('@')===-1)?true:flag;
                        if(transferPermissionInfo!==''&&transferPermissionInfo.length>2&&transferPermissionInfo.split('@')[0]&&transferPermissionInfo.split('@')[1]){
                            authShow=authShow+htmlEncode(transferPermissionInfo)+',';
                            o=o+1;
                        }
                    }
                }
                if(flag){
                    infoBasic('The permission must contain the authority, that is, it must be in the format of account@authority<br><br>')
                }else if(!flag0){
                    infoBasic('Permission cannot be empty')
                }else{
                    authShow=deletLast(authShow,',');
                    let token_symbol=htmlEncode(document.getElementById(type==='Sent'?"token_symbol_sent":"token_symbol_get").value);
                    let token_precision=Number(document.getElementById(type==='Sent'?"token_precision_sent":"token_precision_get").value);
                    let from_accounts_count=from_accounts.split(',').length;
                    let to_accounts_count=to_accounts.split(',').length;
                    let transfer_amount=returnFloatString((Number(transfer_num)*Number(to_accounts_count)*Number(from_accounts_count)),token_precision);
                    let transfer_amount_show=transfer_amount.toString()+' '+token_symbol;
                    let memoInfo=htmlEncode(document.getElementById(type==='Sent'?"memo_info_sent":"memo_info_get").value);
                    let memoInfoShow=memoInfo?'Memo: <hr>'+memoInfo+'<hr>':'';
                    let operatTooMuch=(from_accounts_count*to_accounts_count)>199?'<span class="badge badge-success badge-sm">Attention</span>&nbsp;You have added too many actions at one time. It\'s recommended no more than 100 actions in a single transaction.<br><br>':'';
                    let check_info_string='' +
                        '<div class="alert alert-info fade in m-b-0">' +
                        '    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
                        '    <h4>Transaction</h4>\n' +  operatTooMuch +

                        '    Number of actions:  <div class="badge badge-info badge-sm">'+(from_accounts_count*to_accounts_count).toString()+'</div><br><br>' +

                        '    Number of from-accounts:  <div class="badge badge-info badge-sm">'+from_accounts_count.toString()+'</div><br><br>' +

                        '    Number of receiving accounts： <div class="badge badge-info badge-sm">'+to_accounts_count.toString()+'</div><br><br>' +

                        '    Transaction amount:  <div class="badge badge-info badge-sm">'+transfer_amount_show+'</div><br><br>' +

                        '    Transfer amount per account:  <div class="badge badge-info badge-sm">'+returnFloatString(transfer_num, token_precision).toString()+' '+token_symbol+ '</div>'+'<br><br>' +

                        '    From-accounts list: <br><br>'+toBadge(from_accounts,5)+'<br><br>' +
                        
                        '    Receiving accounts list: <br><br>'+toBadge(to_accounts,5)+'<br><br>' +memoInfoShow+

                        '    Permission: <br><br>'+toBadge(authShow,2)+'<br>' +
                        '    <p class="m-t-10">\n' +
                        '        <button type="button" class="btn btn-info waves-effect waves-light" onclick="makeTransferJson(\''+type+'\')">Confirm</button>' +
                        '        <button type="button" class="btn btn-default waves-effect" class="close" data-dismiss="alert" aria-hidden="true">Cancel</button>' +
                        '    </p>\n' +
                        '</div>';
                    jQuery(function(){
                        $("#checkInfoTransfer"+type).html(check_info_string);
                        $('#collapseCheckInfoTransfer'+type).collapse('show');
                    });
                }
            }
        }else{
            handleLogin();
        }
    } catch (e) {console.log(e)}
};

window.makeTransferNFTAtomicCheck=function(num, type){
    num=num||0;
    try {
        if(scatter_login){
            $('#collapseInfoBasicTransferNFTAtomic'+type).collapse('hide');
            let from_account='';
            let to_account='';
            let asset_ids=document.getElementById((type==='Sent'?"asset_ids_sent":"asset_ids_get")).value;
            if(type==='Get')from_account=clearNAndEmp(htmlEncode(document.getElementById("from_account").value));
            if(type==='Sent')to_account=clearNAndEmp(htmlEncode(document.getElementById("to_account").value));
            if(type==='Get')to_account=currentAccount.name;
            if(type==='Sent')from_account=currentAccount.name;
            let duplicate_asset_ids=ifArrayRepeat(asset_ids.split(","));
            if(num===0&&duplicate_asset_ids){
                let check_info_string='' +
                    '<div class="modal fade" style="overflow: auto" id="checkInfoAnoModal" tabindex="-1" role="dialog" aria-hidden="true">\n' +
                    '    <div class="modal-dialog modal-dialog-centered">\n' +
                    '        <div class="modal-content">\n' +
                    '            There are duplicate ids in the Asset ids you entered. Do you want to delete the duplicate ids? (this may rearrange the sort order of your input ids)<br><br>' +
                    '            <div class="form-group text-right m-b-0">\n' +
                    '                <a class="btn btn-default btn-trans" data-dismiss="modal" onclick="makeTransferNFTAtomicCheck(1, \''+type+'\')">\n' +
                    '                    Ignore\n' +
                    '                </a>\n' +
                    '                <a class="btn btn-primary" data-dismiss="modal" onclick="delDuplicateAcc(\''+(type==='Sent'?'asset_ids_sent':'asset_ids_get')+'\')">\n' +
                    '                    Yes, delete the duplicate ids\n' +
                    '                </a>\n' +
                    '            </div>\n' +
                    '        </div>\n' +
                    '    </div>\n' +
                    '</div>';
                jQuery(function(){
                    $("#checkInfoAno").html(check_info_string);
                    $('#checkInfoAnoModal').modal('show');
                });
            }else if(from_accounts===''||from_accounts===null||from_accounts.length===0){
                infoBasic('From-accounts cannot be empty')
            }else if(to_accounts===''||to_accounts===null||to_accounts.length===0){
                infoBasic('Receiving account cannot be empty')
            }else if(asset_ids===''||asset_ids===null||asset_ids.length===0){
                infoBasic('Asset ids cannot be empty')
            }else if(regAcc(to_account)){
                regAccModal(regAcc(to_account),'Receiving ','to_account');
            }else if(regAcc(from_account)){
                regAccModal(regAcc(from_account),'From-','from_account');
            }else{
                let authShow='';
                let o=0;
                let flag=false;
                let flag0=false;
                if(type==='Sent'){
                    authShow=currentAccount.name +'@'+ currentAccount.authority;
                    flag0=true;
                }else{
                    for(let x=0;x<(permissionInputCount.nft.atomic+1);x++) {
                        let transferPermissionInfo=clearNAndEmp(document.getElementById('transferNFTAtomicPermission'+x.toString()+'').value);
                        flag0=transferPermissionInfo?true:flag0;
                        flag=(transferPermissionInfo&&transferPermissionInfo.indexOf('@')===-1)?true:flag;
                        if(transferPermissionInfo!==''&&transferPermissionInfo.length>2&&transferPermissionInfo.split('@')[0]&&transferPermissionInfo.split('@')[1]){
                            authShow=authShow+htmlEncode(transferPermissionInfo)+',';
                            o=o+1;
                        }
                    }
                }
                if(flag){
                    infoBasic('The permission must contain the authority, that is, it must be in the format of account@authority<br><br>')
                }else if(!flag0){
                    infoBasic('Permission cannot be empty')
                }else{
                    authShow=deletLast(authShow,',');
                    let asset_ids_count=asset_ids.split(',').length;
                    let memoInfo=htmlEncode(document.getElementById(type==='Sent'?"memo_info_nft_sent":"memo_info_nft_get").value);
                    let memoInfoShow=memoInfo?'Memo: <hr>'+memoInfo+'<hr>':'';
                    let operatTooMuch=asset_ids_count>199?'<span class="badge badge-success badge-sm">Attention</span>&nbsp;You transfer too many NFTs at one time<br><br>':'';
                    let check_info_string='' +
                        '<div class="alert alert-info fade in m-b-0">' +
                        '    <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
                        '    <h4>Transaction</h4>\n' +  operatTooMuch +

                        '    From-account:  <div class="badge badge-info badge-sm">'+from_account+'</div><br><br>' +

                        '    Receiving account:  <div class="badge badge-info badge-sm">'+to_account+'</div><br><br>' +

                        '    NFT ids list: <br><br>'+toBadge(htmlEncode(asset_ids),5)+'<br><br>' + memoInfoShow +

                        '    Permission: <br><br>'+toBadge(authShow,2)+'<br>' +
                        '    <p class="m-t-10">\n' +
                        '        <button type="button" class="btn btn-info waves-effect waves-light" onclick="makeTransferNFTAtomicJson(\''+type+'\')">Confirm</button>' +
                        '        <button type="button" class="btn btn-default waves-effect" class="close" data-dismiss="alert" aria-hidden="true">Cancel</button>' +
                        '    </p>\n' +
                        '</div>';
                    jQuery(function(){
                        $("#checkInfoTransferNFTAtomic"+type).html(check_info_string);
                        $('#collapseCheckInfoTransferNFTAtomic'+type).collapse('show');
                    });
                }
            }
        }else{
            handleLogin();
        }
    } catch (e) {console.log(e)}
};


window.proposalCheck=function(){
    try {
        if(scatter_login){
            actionsPush=document.getElementById('json_info').value;
            actionsPush=JSON.parse(actionsPush);
            let contractAbiInfo='';
            for(let x=0;x<(actionsPush.length);x++) {
                if((actionsPush[x].account)&&(actionsPush[x].name)){
                    let contractAbiInfoAdd=actionsPush[x].account+':: '+actionsPush[x].name;
                    if(contractAbiInfo===''){
                        contractAbiInfo=contractAbiInfoAdd;
                    }else if(contractAbiInfo.indexOf(contractAbiInfoAdd)===-1){
                        contractAbiInfo=contractAbiInfo+','+contractAbiInfoAdd;
                    }
                }
            }
            let contractAbiShow='Contract ABI: ' +toBadge(contractAbiInfo,4)+ '<br>';
            let proposalName='aaot.'+randomString(7,0);
            let ifRepeat=ifArrayRepeat(actionsPush)?'<span class="badge badge-danger badge-sm">Warning!</span>&nbsp;There are the same actions in your actions, if this is not your intentional action, please cancel and review<br>\n':'';
            let operatTooMuch=actionsPush.length>199?'<span class="badge badge-success badge-sm">Attention</span>&nbsp;You have added too many actions at one time. It\'s recommended no more than 100 actions in a single transaction.<br><br>':'';
            if(isArray(actionsPush)){
                let check_info_string='' +
                    '<div class="modal fade" style="overflow: auto" id="checkInfoModal" tabindex="-1" role="dialog" aria-hidden="true">\n' +
                    '    <div class="modal-dialog modal-dialog-centered" role="document">\n' +
                    '        <div class="modal-content" style="word-break:break-all;">' +
                    '            <div class="modal-header">' +
                    '                <h5 class="modal-title">Transaction</h5>' +
                    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                    '                    <span aria-hidden="true">&times;</span>' +
                    '                </button>\n' +
                    '            </div>\n' +
                    '            <div class="modal-body">\n' +operatTooMuch+
                    '                Number of actions:  <span class="badge badge-info badge-sm">'+actionsPush.length.toString()+'</span><br>\n' +contractAbiShow+

                    '                <br>Proposal name:  <span class="badge badge-info badge-sm">'+proposalName+'</span><br>' +
                    '                Period of validity:  <span class="badge badge-info badge-sm">'+getTimeInfo()+'</span><br><br>' +

                    '                Permission: <br><br>'+toBadge(getPermissionInfo('totalPermission'),2)+'<br><br>\n' +

                    '                Please carefully confirm your transaction details on the following confirmation page. Once the transaction is successfully executed, it will be irreversible.' +ifRepeat+
                    '            </div>\n' +
                    '            <div class="modal-footer">\n' +
                    '                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>\n' +
                    '                <button type="button" class="btn btn-primary" id="submitBtn" data-loading-text="Loading ..." onclick="proposal(\''+proposalName+'\')">Confirm</button>\n' +
                    '            </div>\n' +
                    '        </div>\n' +
                    '    </div>\n' +
                    '</div>';
                jQuery(function(){
                    $("#checkInfo").html(check_info_string);
                    $('#checkInfoModal').modal('show');
                });
            }else{
                infoBasic('Data is not in array format');
            }
        }else{
            handleLogin();
        }
    } catch (e) {alert(e)}
};

function authAddCheck(auth){
    let flag=false;
    for(let x=0;x<(permissionInputCount.total+1);x++) {
        if(document.getElementById('totalPermission'+x.toString()+'')){
            if(auth===clearNAndEmp(document.getElementById('totalPermission'+x.toString()+'').value).toLowerCase()){
                flag=true;
            }
        }
    }
    if(!flag){
        let authBlank=document.getElementById('totalPermission'+permissionInputCount.total.toString()+'');
        if(authBlank&&authBlank.value===''){
            authBlank.value=auth;
        }else{
            let countNum=permissionInputCount.total+1;
            addPermission("totalPermission",function(){
                let authBlack0=document.getElementById('totalPermission'+countNum.toString()+'');
                if(authBlack0&&authBlack0.value===''){
                    authBlack0.value=auth;
                }else{
                    authAddCheck(auth);
                }
            });
        }
    }
}

function authAddTransferCheck(auth,nft){
    let flag=false;
    let count=nft==='NFTAtomic'?permissionInputCount.nft.atomic:permissionInputCount.transfer;
    let permissionTarget='transfer'+nft+'Permission';
    for(let x=0;x<(count+1);x++) {
        if(document.getElementById(permissionTarget+x.toString()+'')){
            if(auth===clearNAndEmp(document.getElementById(permissionTarget+x.toString()+'').value).toLowerCase()){
                flag=true;
            }
        }
    }
    if(!flag){
        let authBlank=document.getElementById(permissionTarget+count.toString()+'');
        if(authBlank&&authBlank.value===''){
            authBlank.value=auth;
        }else{
            let countNum=count+1;
            addPermission(permissionTarget,function(){
                let authBlack0=document.getElementById(permissionTarget+countNum.toString()+'');
                if(authBlack0&&authBlack0.value===''){
                    authBlack0.value=auth;
                }else{
                    authAddTransferCheck(auth)
                }
            });
        }
    }
}

window.transferAuthQuickWrite=function(form,nft){
    nft=nft||'';
    let fromList=deletLast(clearNAndEmp(document.getElementById(form).value),',').split(',');
    for(let x=0;x<fromList.length;x++) {
        authAddTransferCheck(fromList[x]+'@active',nft);
    }
};

function jsonShow(actionsPushInfo,num){
    num = num || 0;
    let actionsPushInfoShow='';
    for(let x=0;x<(actionsPushInfo.length);x++) {
        actionsPushInfoShow=actionsPushInfoShow+'' +
            'ABI: '+htmlEncode(actionsPushInfo[x].account)+'::'+htmlEncode(actionsPushInfo[x].name)+'<br>' +
            'Permission: ';
        for(let y=0;y<(actionsPushInfo[x].authorization.length);y++) {
            if(num===0) setTimeout(authAddCheck,3000,(htmlEncode(actionsPushInfo[x].authorization[y].actor)+'@'+htmlEncode(actionsPushInfo[x].authorization[y].permission)));
            actionsPushInfoShow=actionsPushInfoShow+'' +
                ''+htmlEncode(actionsPushInfo[x].authorization[y].actor)+'@'+htmlEncode(actionsPushInfo[x].authorization[y].permission)+'<br>'
        }
        actionsPushInfoShow=actionsPushInfoShow+'' +
            'Data: '+htmlEncode(JSON.stringify(actionsPushInfo[x].data))+'<br><br>'
    }
    actionsPushInfoShow=actionsPushInfoShow.substr(0,actionsPushInfoShow.length-8);
    return actionsPushInfoShow;
}

function jsonShowUpdate(){
    if(document.getElementById('json_info').value===''){
        infoBasic('The content can not be empty<br><br>')
    }else{
        let actionsPushInfo=JSON.parse(htmlDecode(document.getElementById('json_info').value));
        $("#json_info_show").html(jsonShow(actionsPushInfo));
    }
}

window.makeContractJson=async function(type){
    try {
        if(scatter_login){
            await setEosInstance();
            let arrayObjAuth=[];
            let o=0;
            if(type === 'Sent'){
                arrayObjAuth[0]={
                    actor: currentAccount.name,
                    permission: currentAccount.authority,
                };
            }else{
                for(let x=0;x<(permissionInputCount.contract+1);x++) {
                    let contractPermissionInfo=clearNAndEmp(document.getElementById('contractPermission'+type+x.toString()+'').value);
                    if(contractPermissionInfo!==''&&contractPermissionInfo.length>2&&contractPermissionInfo.split('@')[0]&&contractPermissionInfo.split('@')[1]){
                        arrayObjAuth[o]={
                            actor: contractPermissionInfo.split('@')[0].toLowerCase(),
                            permission: contractPermissionInfo.split('@')[1].toLowerCase(),
                        };
                        o=o+1;
                    }
                }
            }
            let arrayObj = [];
            let paramsInfo=fieldsAjax.split(',');
            for(let y=0;y<(paramsInfo.length);y++) {
                let type_obj=paramsInfo[y].split(' ')[1];
                let name_obj=paramsInfo[y].split(' ')[0];
                let data_info=document.getElementById(name_obj).type==='checkbox'?(Number(!!document.getElementById(name_obj).checked)===1):document.getElementById(name_obj).value;
                arrayObj[y]={
                    key:name_obj,
                    data: data_info,
                    type:type_obj
                };
            }
            let jsonInfoByTime=document.getElementById('json_info').value;
            let jsonGot=JSON.stringify(dimensionDeal(paramsInfo.length,arrayObj,contractName,contractAbiName,arrayObjAuth,type));
            jsonGot=jsonGot.substr(1,jsonGot.length-2);
            if((jsonInfoByTime==null)||jsonInfoByTime.length<=3){
                document.getElementById('json_info').value=htmlEncode(JSON.stringify(dimensionDeal(paramsInfo.length,arrayObj,contractName,contractAbiName,arrayObjAuth,type)));
            }else{
                if(jsonInfoByTime[jsonInfoByTime.length-1]===']'){
                    if(jsonInfoByTime[jsonInfoByTime.length-2]===','){
                        jsonInfoByTime=jsonInfoByTime.substr(0,jsonInfoByTime.length-1);
                        document.getElementById('json_info').value=htmlEncode(jsonInfoByTime+jsonGot+']');
                    }else{
                        jsonInfoByTime=jsonInfoByTime.substr(0,jsonInfoByTime.length-1);
                        document.getElementById('json_info').value=htmlEncode(jsonInfoByTime+','+jsonGot+']');
                    }
                }else if((jsonInfoByTime[jsonInfoByTime.length-1]===',')&&(jsonInfoByTime[jsonInfoByTime.length-2]===']')){
                    if(jsonInfoByTime[jsonInfoByTime.length-3]===','){
                        jsonInfoByTime=jsonInfoByTime.substr(0,jsonInfoByTime.length-2);
                        document.getElementById('json_info').value=htmlEncode(jsonInfoByTime+jsonGot+']');
                    }else{
                        jsonInfoByTime=jsonInfoByTime.substr(0,jsonInfoByTime.length-2);
                        document.getElementById('json_info').value=htmlEncode(jsonInfoByTime+','+jsonGot+']');
                    }
                }else if((jsonInfoByTime[jsonInfoByTime.length-1]===',')&&(jsonInfoByTime[jsonInfoByTime.length-2]!==']')){
                    document.getElementById('json_info').value=htmlEncode(jsonInfoByTime+jsonGot+']');
                }
            }
            jsonShowUpdate();
            $('#collapseCheckInfoContract'+type).collapse('hide');
            $('#proposalTextMode').collapse('hide');
            $('#proposalTextShowMode').collapse('show');
            infoBasic('Add succeeded');
        }else{
            handleLogin();
        }
    } catch (e) {
        alert(e)
    }
};

const arrayDeal =function(from_accounts,toaccount,quantity_trans,code,memo_info,arrayObjAuth){
    let arrayObj = [];
    let count=0;
    for(let x=0;x<(toaccount.split(',').length);x++) {
        for(let y=0;y<(from_accounts.split(',').length);y++) {
            arrayObj[count]={
                account:code,
                name: 'transfer',
                authorization: arrayObjAuth,
                data: {
                    from: from_accounts.split(',')[y],
                    to: toaccount.split(',')[x],
                    quantity: quantity_trans,
                    memo: memo_info
                },
            };
            count=count+1;
        }
    }
    return arrayObj;
};

window.makeTransferJson=async function(type){
    try {
        if(scatter_login){
            await setEosInstance();
            let arrayObjAuth=[];
            if(type === 'Sent'){
                arrayObjAuth[0]={
                    actor: currentAccount.name,
                    permission: currentAccount.authority,
                };
            }else{
                let o=0;
                for(let x=0;x<(permissionInputCount.transfer+1);x++) {
                    let transferPermissionInfo=clearNAndEmp(document.getElementById('transferPermission'+x.toString()+'').value);
                    if(transferPermissionInfo!==''&&transferPermissionInfo.length>2&&transferPermissionInfo.split('@')[0]&&transferPermissionInfo.split('@')[1]){
                        arrayObjAuth[o]={
                            actor: transferPermissionInfo.split('@')[0].toLowerCase(),
                            permission: transferPermissionInfo.split('@')[1].toLowerCase(),
                        };
                        o=o+1;
                    }
                }
            }

            let from_accounts='';
            let to_accounts='';
            let transfer_num=clearNAndEmp(document.getElementById((type==='Sent'?"transfer_num_sent":"transfer_num_get")).value);
            if(type==='Get')from_accounts=clearNAndEmp(deletLast(document.getElementById("from_accounts").value),',').toLowerCase();
            if(type==='Sent')to_accounts=clearNAndEmp(deletLast(document.getElementById("to_accounts").value),',').toLowerCase();
            if(type==='Get')to_accounts=currentAccount.name;
            if(type==='Sent')from_accounts=currentAccount.name;
            let token_contract=clearNAndEmp(document.getElementById((type==='Sent'?"token_contract_sent":"token_contract_get")).value);
            let token_symbol=clearNAndEmp(document.getElementById((type==='Sent'?"token_symbol_sent":"token_symbol_get")).value.toUpperCase());
            let token_precision=Number(document.getElementById((type==='Sent'?"token_precision_sent":"token_precision_get")).value);
            let memo_info=document.getElementById((type==='Sent'?"memo_info_sent":"memo_info_get").value);
            let quantity_trans=returnFloatString(transfer_num,token_precision).toString()+' '+token_symbol;
            let jsonInfoByTime=document.getElementById('json_info').value;
            let jsonGot=JSON.stringify(arrayDeal(from_accounts,to_accounts,quantity_trans,token_contract,memo_info,arrayObjAuth));
            jsonGot=jsonGot.substr(1,jsonGot.length-2);
            if((jsonInfoByTime==null)||jsonInfoByTime.length<=3){
                document.getElementById('json_info').value=htmlEncode(JSON.stringify(arrayDeal(from_accounts,to_accounts,quantity_trans,token_contract,memo_info,arrayObjAuth)));
            }else{
                if(jsonInfoByTime[jsonInfoByTime.length-1]===']'){
                    if(jsonInfoByTime[jsonInfoByTime.length-2]===','){
                        jsonInfoByTime=jsonInfoByTime.substr(0,jsonInfoByTime.length-1);
                        document.getElementById('json_info').value=htmlEncode(jsonInfoByTime+jsonGot+']');
                    }else{
                        jsonInfoByTime=jsonInfoByTime.substr(0,jsonInfoByTime.length-1);
                        document.getElementById('json_info').value=htmlEncode(jsonInfoByTime+','+jsonGot+']');
                    }
                }else if((jsonInfoByTime[jsonInfoByTime.length-1]===',')&&(jsonInfoByTime[jsonInfoByTime.length-2]===']')){
                    if(jsonInfoByTime[jsonInfoByTime.length-3]===','){
                        jsonInfoByTime=jsonInfoByTime.substr(0,jsonInfoByTime.length-2);
                        document.getElementById('json_info').value=htmlEncode(jsonInfoByTime+jsonGot+']');
                    }else{
                        jsonInfoByTime=jsonInfoByTime.substr(0,jsonInfoByTime.length-2);
                        document.getElementById('json_info').value=htmlEncode(jsonInfoByTime+','+jsonGot+']');
                    }
                }else if((jsonInfoByTime[jsonInfoByTime.length-1]===',')&&(jsonInfoByTime[jsonInfoByTime.length-2]!==']')){
                    document.getElementById('json_info').value=htmlEncode(jsonInfoByTime+jsonGot+']');
                }
            }
            jsonShowUpdate();
            $('#collapseCheckInfoTransfer'+type).collapse('hide');
            $('#proposalTextMode').collapse('hide');
            $('#proposalTextShowMode').collapse('show');
            infoBasic('Add succeeded');
        }else{
            handleLogin();
        }
    } catch (e) {
        alert(e)
    }
};

const arrayDealNFTAtomic =function(asset_ids,from_account,to_account,memo_info,arrayObjAuth){
    let assetIdsArr=[];
    for(let x=0;x<asset_ids.split(',').length;x++) {
        assetIdsArr.push(Number(asset_ids.split(',')[x]))
    }
    return [{
        account:'atomicassets',
        name: 'transfer',
        authorization: arrayObjAuth,
        data: {
            from: from_account,
            to: to_account,
            asset_ids: assetIdsArr,
            memo: memo_info
        },
    }];
};

window.makeTransferNFTAtomicJson=async function(type){
    try {
        if(scatter_login){
            await setEosInstance();
            let arrayObjAuth=[];
            if(type === 'Sent'){
                arrayObjAuth[0]={
                    actor: currentAccount.name,
                    permission: currentAccount.authority,
                };
            }else{
                let o=0;
                for(let x=0;x<(permissionInputCount.nft.atomic+1);x++) {
                    let transferPermissionInfo=clearNAndEmp(document.getElementById('transferNFTAtomicPermission'+x.toString()+'').value);
                    if(transferPermissionInfo!==''&&transferPermissionInfo.length>2&&transferPermissionInfo.split('@')[0]&&transferPermissionInfo.split('@')[1]){
                        arrayObjAuth[o]={
                            actor: stransferPermissionInfo.split('@')[0].toLowerCase(),
                            permission: transferPermissionInfo.split('@')[1].toLowerCase(),
                        };
                        o=o+1;
                    }
                }
            }

            let from_account='';
            let to_account='';
            let asset_ids=document.getElementById((type==='Sent'?"asset_ids_sent":"asset_ids_get")).value;
            if(type==='Get')from_account=clearNAndEmp(document.getElementById("from_account").value);
            if(type==='Sent')to_account=clearNAndEmp(document.getElementById("to_account").value);
            if(type==='Get')to_account=currentAccount.name;
            if(type==='Sent')from_account=currentAccount.name;
            let memo_info=document.getElementById((type==='Sent'?"memo_info_nft_sent":"memo_info_nft_get")).value;
            let jsonInfoByTime=document.getElementById('json_info').value;
            let jsonGot=JSON.stringify(arrayDealNFTAtomic(asset_ids,from_account,to_account,memo_info,arrayObjAuth));
            jsonGot=jsonGot.substr(1,jsonGot.length-2);
            if((jsonInfoByTime==null)||jsonInfoByTime.length<=3){
                document.getElementById('json_info').value=htmlEncode(JSON.stringify(arrayDealNFTAtomic(asset_ids,from_account,to_account,memo_info,arrayObjAuth)));
            }else{
                if(jsonInfoByTime[jsonInfoByTime.length-1]===']'){
                    if(jsonInfoByTime[jsonInfoByTime.length-2]===','){
                        jsonInfoByTime=jsonInfoByTime.substr(0,jsonInfoByTime.length-1);
                        document.getElementById('json_info').value=htmlEncode(jsonInfoByTime+jsonGot+']');
                    }else{
                        jsonInfoByTime=jsonInfoByTime.substr(0,jsonInfoByTime.length-1);
                        document.getElementById('json_info').value=htmlEncode(jsonInfoByTime+','+jsonGot+']');
                    }
                }else if((jsonInfoByTime[jsonInfoByTime.length-1]===',')&&(jsonInfoByTime[jsonInfoByTime.length-2]===']')){
                    if(jsonInfoByTime[jsonInfoByTime.length-3]===','){
                        jsonInfoByTime=jsonInfoByTime.substr(0,jsonInfoByTime.length-2);
                        document.getElementById('json_info').value=htmlEncode(jsonInfoByTime+jsonGot+']');
                    }else{
                        jsonInfoByTime=jsonInfoByTime.substr(0,jsonInfoByTime.length-2);
                        document.getElementById('json_info').value=htmlEncode(jsonInfoByTime+','+jsonGot+']');
                    }
                }else if((jsonInfoByTime[jsonInfoByTime.length-1]===',')&&(jsonInfoByTime[jsonInfoByTime.length-2]!==']')){
                    document.getElementById('json_info').value=htmlEncode(jsonInfoByTime+jsonGot+']');
                }
            }
            jsonShowUpdate();
            $('#collapseCheckInfoTransferNFTAtomic'+type).collapse('hide');
            $('#proposalTextMode').collapse('hide');
            $('#proposalTextShowMode').collapse('show');
            infoBasic('Add succeeded');
        }else{
            handleLogin();
        }
    } catch (e) {
        alert(e)
    }
};

async function loginCheckNative(){
    await handleLoginInfo();
    await setEosInstance();
    if(currentAccount!==null && currentAccount.name && currentAccount.authority){
        await loginCheck('/aaot/index',currentAccount.name,currentAccount.authority,currentAccount.publicKey);
    }else{
        window.location.href='/login?next=/aaot/index';
    }
}

$(document).ready(function(){
    setTimeout(loginCheckNative,500);
});
