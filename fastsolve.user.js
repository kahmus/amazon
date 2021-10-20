// ==UserScript==
// @name        FastSolve
// @author      jachyd@amazon.com
// @copyright   jachyd@amazon.com
// @description Enjoy my simplification
// @updateURL	https://drive-render.corp.amazon.com/view/holodows@/FC%20Research/fastsolve.user.js#bypass=true

// @include     http://barcodes.corp.amazon.com/index.html?bargenJachyd=1

// @include     http://fcresearch-eu.aka.amazon.com/*/results?*
// @include     http://fcresearch-na.aka.amazon.com/*/results?*
// @include     http://fcresearch-eu.aka.amazon.com/*/search
// @include     http://fcresearch-na.aka.amazon.com/*/search

// @include     https://pandash.amazon.com*

// @version     1.7.3
// @require     https://drive-render.corp.amazon.com/view/holodows@/FC%20Research/jquery.js
// @require     https://drive-render.corp.amazon.com/view/holodows@/FC%20Research/bcode.js
// @require     https://drive-render.corp.amazon.com/view/holodows@/FC%20Research/cookie.js
// ==/UserScript==

//Source
//JQuery:    https://code.jquery.com/jquery-3.3.1.min.js With MIT-License (Use it however you want, even for comercial use for free)
//JsBarcode: https://cdn.jsdelivr.net/npm/jsbarcode@3.8.0/dist/JsBarcode.all.min.js With MIT-License (Use it however you want, even for comercial use for free)
//Cookie:    https://raw.githubusercontent.com/carhartl/jquery-cookie/master/src/jquery.cookie.js With MIT-License (Use it however you want, even for comercial use for free)

//Special thanks for Sit0

// credits: github.com/BrockA With MIT-License (Use it however you want, even for comercial use for free)
function waitForKeyElements(e,t,a,n){var o,r;(o=void 0===n?$(e):$(n).contents().find(e))&&o.length>0?(r=!0,o.each(function(){var e=$(this);e.data("alreadyFound")||!1||(t(e)?r=!1:e.data("alreadyFound",!0))})):r=!1;var l=waitForKeyElements.controlObj||{},i=e.replace(/[^\w]/g,"_"),c=l[i];r&&a&&c?(clearInterval(c),delete l[i]):c||(c=setInterval(function(){waitForKeyElements(e,t,a,n)},300),l[i]=c),waitForKeyElements.controlObj=l};


// po zaladowaniu listy PZ sortujemy malejaco po dacie zamÃ³wienia..
waitForKeyElements('#purchase-order-placed', function() {
    $('#purchase-order-placed').click().click();
});

// po zaladowaniu wysylek sortujemy je po dacie nadejscia malejaco..
waitForKeyElements('#shipment-arrival', function() {
    $('#shipment-arrival').click().click();
});

// po zaladowaniu pozycji z PZ sortujemy malejaco po dacie zamÃ³wienia..
waitForKeyElements('#purchase-order-item-order-date', function() {
    $('#purchase-order-item-order-date').click().click();
});


//Ustawienia domyslne
const myCookies = [['cfg-design','1'],['cfg-region','eu']];
for(let i=0;i<myCookies.length;i++){
    if(document.cookie.indexOf(myCookies[i][0]) == '-1'){
        $.cookie(myCookies[i][0],myCookies[i][1]);
    }
}

//Komunikaty
const locale = ['', //0
                '', //1
                'FastSolve', //2
                'Extension created by ', //3
                '', //4
                'Barcode Generator', //5
                'Settings', //6
                'Quick Links', //7
                'Re-Design FCResearch', //8
                '(Reload needed)', //9
                'Set default', //10
                '', //11
                'Region (e.g. "eu" or "na")', //12
                '' //13
                 ];

//obrazy 0=oko,1=,2=ustawienia,3=loading
const images = ['https://drive-render.corp.amazon.com/view/jachyd@/TamperMonkey/fcrp/1.png','','https://drive-render.corp.amazon.com/view/jachyd@/TamperMonkey/fcrp/3.png','https://drive-render.corp.amazon.com/view/jachyd@/TamperMonkey/fcrp/4.gif',];


function loadingDiv(txt){
   $('body').append('<div id="fcrp-el-loading" ><img src="'+images[3]+'" /> '+txt+'</div>');
    $('#fcrp-el-loading').css({
        'position':'fixed',
        'bottom':'10px',
        'min-height':'36px',
        'right':'210px',
        'padding':'10px',
        'z-index':'150',
        'border-radius':'5px',
        'background-color':'#3f5973',
        'opacity':0.9,
        'color':'white',
        'font-size':'13px'
    });
    $('#fcrp-el-loading img').css({'float':'left','padding-right':'3px'});
}
function showPicture(asin){
    $('.fcrp_prodPic').css('display','none');
    let ppid = $('.fcrp_prodPic').length;
    $('body').append('<div class="fcrp_prodPic fcrp_prodPic_'+ppid+'" />');
    $('.fcrp_prodPic_'+ppid).css({
        'display':'block',
        'position':'fixed',
        'text-align':'center',
        'background-color':'white',
        'overflow':'hidden',
        'width':150,
        'top':70,
        'right': 220,
        'opacity':0.9,
        'z-index':'300',
        'border-radius':10,
        'border':'solid 1px black'
    });
    $('.fcrp_prodPic_'+ppid).append('<img src="'+images[3]+'" />');
    $('.fcrp_prodPic_'+ppid+' img').css({
        'width':'auto',
        'top':0,
        'right': 0
    });

    $.ajax({
        method: "POST",
        headers: {'content-type':"application/x-www-form-urlencoded; charset=UTF-8"},
        url: "http://fcresearch-"+$.cookie('cfg-region')+".aka.amazon.com/"+$.cookie('fcmenu-warehouseId')+"/results/product",
        data: { s: asin},
        success: function(data){

            $('#worksheet').html(data);
            let img = $('#worksheet img').attr('src');

            $('.fcrp_prodPic_'+ppid+' img').attr('src',img)
            $('.fcrp_prodPic_'+ppid).append('<p class="fcrp-pimg-time">3</p>');
            let imgHiding = setInterval(function(){
             let pimgTime = $('.fcrp_prodPic_'+ppid+' .fcrp-pimg-time').text();
             if(pimgTime == 0){
                 $('.fcrp_prodPic_'+ppid).remove();
                 clearInterval(imgHiding);
             }
             else {
                 $('.fcrp_prodPic_'+ppid+' .fcrp-pimg-time').html($('.fcrp_prodPic_'+ppid+' .fcrp-pimg-time').text()*1-1);
             }
            },1000);
            $('.fcrp_prodPic_'+ppid+' img').css({
                'width':150,
                'top':0,
                'right': 0
            });
        }
    });

}
function generateCodes(code){
    let codes = code.replace(new RegExp("(\n){2}", 'g'), "*entyr**nextLine**entyr*" ).replace(new RegExp(", ", 'g'), "*entyr*" ).replace(new RegExp(",", 'g'), "*entyr*" ).replace( /\n/g, "*entyr*" ).split( "*entyr*" );
    $('#fcrp #codes').html("");
    if(codes.length){
        for(let cod=0;cod<codes.length;cod++){
            if(codes[cod].length){
                if(codes[cod]=='*nextLine*'){
                    $('#fcrp #codes').append('<div style="height:50px" />');
                }
                else {
                    $('#fcrp #codes').append('<svg id="svg'+cod+'" /><br />');
                    $('#svg'+cod).JsBarcode(codes[cod], {
                        format: "CODE128",
                        width:1,
                        height:30,});
                }
            }
        }
    }
}


function copy(text){
    $('body').append('<input id="fcrp-toCopy" style="display:hidden;" value="'+text+'" />');
    let copyEl =  document.getElementById('fcrp-toCopy');
    copyEl.select();
    document.execCommand('copy');
    $('#fcrp-toCopy').remove();
}

const tables = ['product','purchase-order','purchase-order-item','receive-history','inventory','inventory-history','carton-contents'],
      fastPass = [3,5];
let checkTables = [];
for(let i=0;i<tables.length;i++){checkTables.push(0);}

function addMenu(el,elint){
    const elm = "div[data-section-type='"+el+"']";

    //czekam na wiecej
    let tryCount = 0,tBufor;
    let tries = setInterval(function(){
        let neededData = ($('#table-'+el+'_info').text()).split(' ');
        let showingRows = neededData[3]*1, maxRows = neededData[5]*1;
        if(fastPass.indexOf(elint) != "-1"){
            console.log(el+' fast pass ('+maxRows+' rows to check)');
            maxRows = (maxRows > 300)?300:maxRows;
        }
        if(showingRows < maxRows){

            //console.log(el + ': '+showingRows+' < '+maxRows);
            $(elm+' .dataTables_scrollBody').scrollTop($('#table-'+el).height());
        }else{

            $(elm+' .dataTables_scrollBody').scrollTop(0);
            console.log('['+el+'] wszystkie elementy zaladowane');

            //Asin Menu
            $(elm+' td').filter(function() {
                //Filtrowanie komorek ([0-9]{1}([A-Z0-9]){7})
                return ($(this).text().match(/(B0)([A-Z0-9]){8}/) || $(this).text().match(/(X0)([A-Z0-9]{8})/)) && $(this).text().length == 10;
            }).each(function( index ) {
                let itemAsin = $.trim($(this).text());
                $(this).html('<img class="fcrp_img_'+el+'_'+index+'" data-asin="'+itemAsin+'" src="'+images[0]+'">'+$(this).html());
                $('.fcrp_img_'+el+'_'+index).click(function(){
                    showPicture($(this).attr('data-asin'));
                });

                let unique = new Date().getTime();
                $(this).attr('style','cursor:copy').children().attr('style','cursor:copy!important');

                $(this).contextmenu(function(e){
                    let posX = e.clientX;
                    let posY = $(document).scrollTop() + e.clientY;

                    $('body').append('<div id="fcrp-tooltip-'+unique+'" class="fcrp-tooltip"/>');
                    $('#fcrp-tooltip-'+unique).css({'top':posY,'left':posX});


                    $('.fcrp-tooltip').append('<span class="fcrp-ti fcrp-copyA-'+index+'" data-asin="'+itemAsin+'" >Copy</span>');
                    $('.fcrp-tooltip').append('<a class="fcrp-ti" target="_blank" href="http://fcresearch-eu.aka.amazon.com/WRO5/results?s='+itemAsin+'" >Open in New Tab</a>');
                    $('.fcrp-tooltip').append('<hr/>');
                    $('.fcrp-tooltip').append('<a class="fcrp-ti " target="_blank" href="https://fba-fnsku-commingling-console-eu.aka.amazon.com/tool/fnsku-mappings-tool?getMappingsType=ASIN_MAPPINGS&FNSku=&FNSkus=&merchantId=&MSku=&ASIN='+itemAsin+'&includeInactive=true&submit=get&paginationToken=">GetMappings</a>');
                    $('.fcrp-tooltip').append('<a class="fcrp-ti " target="_blank" href="https://prepmanager-dub.amazon.com/view/'+itemAsin+'?region=EU">Prep Manager</a>');
                    $('.fcrp-tooltip').append('<a class="fcrp-ti " target="_blank" href="https://procurementportal-eu.corp.amazon.com/bp/asin?asin='+itemAsin+'&dateRange=lastSixMonths&conditions=Submitted%2CPartiallyConfirmed%2CCompletelyConfirmed%2CReserved%2CComplete">Procurement</a>');
                    $('.fcrp-tooltip').append('<a class="fcrp-ti " target="_blank" href="https://pandash.amazon.com#'+itemAsin+'">PanDash</a>');
                    $('.fcrp-tooltip').append('<a class="fcrp-ti " target="_blank" href="https://csi.amazon.com/view?view=simple_product_data_view&item_id='+itemAsin+'&marketplace_id=4&customer_id=&merchant_id=&sku=&fn_sku=&gcid=&fulfillment_channel_code=&listing_type=purchasable&submission_id=&order_id=&external_id=&search_string=&realm=USAmazon&stage=prod&domain_id=&keyword=&submit=Show">CSI</a>');
                    $('.fcrp-tooltip').append('<a class="fcrp-ti " target="_blank" href="https://amazon.de/dp/'+itemAsin+'">Amazon.de</a>');


                    $('.fcrp-copyA-'+index).click(function(){
                        copy(itemAsin);
                    });


                    $(document).click(function(){
                        if($('#fcrp-tooltip-'+unique).length){
                                $('#fcrp-tooltip-'+unique).remove();
                        }
                    });
                    return false;
                });
            });

            //Po Menu
            $(elm+' td').filter(function() {
                //Filtrowanie komorek
                return $(this).text().match(/([0-9]{1}([A-Z0-9]){7})/) && $(this).text().length == 8;
            }).each(function( index ) {
                let unique = new Date().getTime();

                $(this).attr('style','cursor:copy').children().attr('style','cursor:copy!important');

                $(this).contextmenu(function(e){
                    let itemPo = $.trim($(this).text());

                    let posX = e.clientX;
                    let posY = $(document).scrollTop() + e.clientY;

                    $('body').append('<div id="fcrp-tooltip-'+unique+'" class="fcrp-tooltip"/>');
                    $('#fcrp-tooltip-'+unique).css({'top':posY,'left':posX});

                    $('.fcrp-tooltip').append('<span class="fcrp-ti fcrp-copyP-'+index+'" data-po="'+itemPo+'" >Copy</span>');
                    $('.fcrp-tooltip').append('<a class="fcrp-ti" target="_blank" href="http://fcresearch-eu.aka.amazon.com/WRO5/results?s='+itemPo+'" >Open in New Tab</a>');
                    $('.fcrp-tooltip').append('<hr/>');
                    $('.fcrp-tooltip').append('<a class="fcrp-ti " target="_blank" href="https://unified-portal-eu.inbound-shipment-signals.scot.a2z.com/#/asnsearch?pageType=search">ASN Lookup</a>');

                    $('.fcrp-copyP-'+index).click(function(){
                        copy(itemPo);
                    });

                    $('.fcrp-po-'+index+'-ppo').click(function(){printLabel($(this).attr('data-po'));});




                    $(document).click(function(){
                        if($('#fcrp-tooltip-'+unique).length){
                            $('#fcrp-tooltip-'+unique).remove();
                        }
                    });
                    return false;
                });
            });

            console.log('['+el+'] 100%');
            clearInterval(tries);

            checkTables[elint] = 2;

            if(checkTables.every( (val, i, arr) => val == 2 )){
                $('#fcrp-el-loading').remove();
            }
        }
    },300);
}

function waitMenu(){
    loadingDiv('Loading quick links');
    let waitmn = setInterval(function(){
        if(checkTables.every( (val, i, arr) => val > 0 )){
            clearInterval(waitmn);
        }
        else {

            for(let i=0;i<tables.length;i++){
                if(checkTables[i]){
                    continue;
                }
                else {
                    console.log('['+tables[i]+'] Sprawdzanie...');
                    if(!$("#"+tables[i]+"-status").hasClass('loading')){
                        console.log('['+tables[i]+'] Potwierdzono status - zaladowana');

                        if($("#"+tables[i]+"-status a").length){

                            checkTables[i] = 1;
                            console.log('['+tables[i]+'] Istnieje');
                            addMenu(tables[i],i);
                        }
                        else {
                            console.log('['+tables[i]+'] nie istnieje - pomijam');
                            checkTables[i] = 2;
                        }
                    }
                    console.log('---');
                }
            }
        }
    },1000);
}
function groupSize(){
    console.log('groupping');
    let sizesCount = [['Sort',0],['Mezz',0],['Corner',0],['HighRack',0],['TeamLift',0],['HaevyBulky',0],['MechLift',0],['Cubiscan',0]],
        ready = 0, containingHrv = 0, totalCount = 0,
        summaryTable = "<span id='fcrp-stb'><table id='sizeSummary' class='a-bordered' style='margin:10px 0px 10px 0px;border:2px solid red;'><thead><tr><th>Size group</th><th>Asins</th></tr></thead><tbody>";
    $('#fcrp-groupSize').remove();
    let mainPart = 'div [data-section-type="inventory"]';
    $('#inventory-container div').html('Size Group');

    $(mainPart+' tbody:eq(1) tr').each(function(index){
        let opEl = $(mainPart+' tbody:eq(1) tr:eq('+index+') td:eq(0)');
        let asin = $(mainPart+' tbody:eq(1) tr:eq('+index+') td:eq(1)').text();
        //getSize
        $.ajax({
            method: "POST",
            headers: {'content-type':"application/x-www-form-urlencoded; charset=UTF-8"},
            url: "http://fcresearch-eu.aka.amazon.com/"+$.cookie('fcmenu-warehouseId')+"/results/product",
            data: { s: asin},
            success: function(data){
                $('#worksheet').html(data);
                let weight = $('#worksheet tr:eq(5) td').text();
                let size = $('#worksheet tr:eq(6) td').text();
                let sort = $('#worksheet tr:eq(10) td').text();
                let hrv = $('#worksheet tr:eq(12) td').text();

                let group = '';
                if(hrv == 'true'){
                    containingHrv ++;
                    group = '[HRV] ';
                }

                if(size.length < 1 || weight.length < 1){group+='Cubi';sizesCount[7][1]++;}else{
                    let temp = size.split(' ');

                    let sizes =[(temp[0]*1),(temp[2]*1),(temp[4]*1)];
                    sizes.sort(function(a, b){return a-b});

                    let maxSize = sizes[2]*1, secSize=sizes[1]*1;
                    weight = weight.split(' ')[0];

                    console.log(asin+':'+size+' | '+maxSize+', '+secSize);

                    if(sort == 'true'){group+='Sort';sizesCount[0][1]++;}
                    else if(maxSize <= 70 && secSize <= 50 && weight < 12){group+='Mezz';sizesCount[1][1]++;}
                    else if(maxSize <= 105 && secSize <= 70 && weight < 15){group+='Corner';sizesCount[2][1]++;}
                    else if(maxSize <= 170 && weight < 15){group+='HR';sizesCount[3][1]++;}
                    else if(maxSize <= 170 && weight <= 30){group+='TL';sizesCount[4][1]++;}
                    else if(maxSize <= 240 && weight < 45){group+='HB';sizesCount[5][1]++;}
                    else if(maxSize >= 240 || weight >= 45){group+='Mechlift';sizesCount[6][1]++;}
                    else {group+='ERROR';}
                }
                opEl.html(group);
                ready++;
                $('#worksheet').html('');
            }
        });
    });

    let isCategorizationReady = setInterval(function(){
        console.log(ready+" / "+$(mainPart+' tbody:eq(1) tr').length);
        if(ready==$(mainPart+' tbody:eq(1) tr').length){
            sizesCount.sort(function(a,b){return b[1] - a[1];});
            for(let i=0;i<sizesCount.length;i++){
                totalCount += sizesCount[i][1];
                if(sizesCount[i][1]>0){
                    summaryTable += "<tr><td>"+sizesCount[i][0]+"</td><td>"+sizesCount[i][1]+"</td></tr>";
                }
                else{
                    break;
                }
            }
            let hrvStyle = (containingHrv)?" style='color:red;font-weight:bold;font-size:20px;'":" style='display:none;'";
            summaryTable += "</tbody></table><p class='dataTables_info' "+hrvStyle+">Container contains HRV asins: "+containingHrv+" / "+totalCount+"</p><br /></span>";
            $(mainPart+' .a-last .a-box-inner').prepend(summaryTable);

            $('div [data-section-type="inventory"] .section-title').append('<span id="fcrp-gsUndo" class="fcrp-gsb">[Undo]</span>');
            $('#fcrp-gsUndo').click(function(){

                $('div [data-section-type="inventory"]').find('span[id="fcrp-stb"]').remove();
                $('#fcrp-gsUndo').remove();
                $('#inventory-container div').html('Container');

                $(mainPart+' tbody:eq(1) tr').each(function(index){
                    let toteId = $('#search').attr('placeholder');
                    $(mainPart+' tbody:eq(1) tr:eq('+index+') td:eq(0)').html('<a href="http://fcresearch-eu.aka.amazon.com/'+$.cookie('fcmenu-warehouseId')+'/results?s='+toteId+'">'+toteId+'</a>');
                });

                $('div [data-section-type="inventory"] .section-title').append('<span id="fcrp-groupSize" class="fcrp-gsb">[Categorize by size]</span>');
                $('#fcrp-groupSize').click(function(){groupSize()});
            });

            clearInterval(isCategorizationReady);
        }
    },100);
}

$(document).ready(function(){
    if(window.location.href == 'http://barcodes.corp.amazon.com/index.html?bargenJachyd=1#auto'){

        document.title = locale[5]+" by jachyd"
        $('body').html("").append("<div id='fcrp'><div id='fcrp_logo'>"+locale[5]+" <small>by jachyd</small></div><div id='fcrp_bargen' ><textarea></textarea><br /><div id='codes'></div></div></div>").css({'border':0,'margin':0,'padding':0});
        $('#fcrp').css({'padding':5,'width':290,'margin':'auto'});
        $('#fcrp_logo').css('text-align','center');
        $('#fcrp_bargen textarea').css('width',290).on('change keyup paste', function() {
            generateCodes($(this).val());
        });
    }
    else if(window.location.hostname == 'pandash.amazon.com'){
        if(window.location.hash){
            setTimeout(function(){
                let boAsin = window.location.hash;
                boAsin = boAsin.replace('#','');
                $('#asinsFilter').val(boAsin);

                $('#de').addClass('ui-selected');

                $('#sourceFilter').val('FC');
                $('#FCinput').css('display','inline');
                $('#FCinput').val($.cookie('fcmenu-warehouseId'));
                $('#FCinput').trigger('change');
                validateFC();

                $('#languageFilter').val('EN');
                let waitForValidateFc = setInterval(function(){
                    if($('.statusOk').length){
                        $('#btOk').click();
                        clearInterval(waitForValidateFc);
                    }
                },100);
            },500)
        }
    }else {

        let design = ".a-popover-inner{color:white!important;}.a-alert-container {box-shadow: 0 0 0 4px aqua inset !important;background-color:#2e4053!important;color:aqua;}.fcrp_box button{margin-bottom:10px !important;}#fcrp_cfg{background-color:#283747;color:white;border-radius-left-bottom:5px}.a-cal-labels,body,.a-popover-inner,#side-bar{background-color: #17202a;}.a-box,.a-cal-na{background-color: #212f3d ;border:1px #2c3e50 solid;color:white}table.a-keyvalue th{background-color: #283747;color:white;}table.a-keyvalue td, table.a-keyvalue th { border-top: 1px solid #2c3e50;}table.a-keyvalue {border-bottom:1px solid #2c3e50;}.a-box-title .a-box-inner, .a-popover-header {color:white;background: #273746;box-shadow: 0 1px 0 rgba(211, 84, 0,0.5) inset;background: linear-gradient(to bottom, #273746 ,#34495e);}.a-box {border-top-color: #2c3e50!important;}body a{color:#3471EB!important;}.a-search input{color:white;background-color:#34495e!important;border:1px solid  #1c2833 ;box-shadow: 0 1px 0 rgba(211, 84, 0,0.5),0 1px 0 rgba(0,0,0,.07) inset;}.p-icon{border:0px;box-shadow:none;}.p-icon:hover{cursor:pointer;border:none;}table.a-bordered tr:nth-child(2n) {background-color:  #2e4053 ;}table.a-bordered td, table.a-bordered th { border-bottom: 1px solid #283747;}table.a-bordered { border: 1px solid #283747;}table.a-bordered tr:last-child td{border-color:#283747;}table.a-bordered tr:first-child th{background: #283747;color:white;border-color: #283747;border-bottom: 1px solid #283747;box-shadow:none;}.a-nostyle, .a-nostyle span{color:white!important;}.logo-fc ,.logo-research{color:white;}.aui-nav-row {background: linear-gradient(to bottom, #273746 ,#34495e); border-bottom: 1px solid #283747;}a.a-link-section-expander{background-color:#283747;}.a-icon, .p-icon{filter:invert(100%);}a.a-link-section-expander:hover,a.a-link-section-expander:focus{background-color: #2e4053 ;}.a-expander-content{background-color: #2e4053 ;}.a-section-expander-inner,.sidebar-expander-header {border-top: 1px solid  #34495e;}.separator{border-right:1px solid rgba(211, 84, 0,0.5)!important;}";
        let importantD = ".fcrp-gsb {padding:3px;font-weight:normal;background-color:gray; border-radius:2px;font-size:10pt;cursor:pointer;color:white;margin-left:10px}#fcrp_cfg{background-color:rgba(0,0,0,0.2);}.fcrp-tooltip hr{margin:0px 5px 0px 27px;border-top:1px solid #ccc;}.fcrp-tooltip{z-index:999;position:absolute;width:200px;padding:3px;background-color:#eee;border:solid 1px #ccc;box-shadow:1px 1px 3px rgba(0,0,0,0.8)}.fcrp-ti{display:block;cursor:pointer;width:100%;font-size:9pt;line-height:24px;text-decoration:none!important;color:black!important;box-sizing:border-box;padding:0px 30px;margin:0px 0px 2px 0px}.fcrp-ti:hover{background-color:#c4e8ee}#fcrp_amznsoft a:not(:last-child):after { content: ', ';}";


        let stylesToAdd = ($.cookie("cfg-design") == 1)?design+importantD:importantD;
        $("<style>").text(stylesToAdd).appendTo($("body"));

        $('.a-thumbnail-right').css('border-radius','3px');
        $('.aui-nav-row .aok-float-right').css('color','white');

        let fc = ((window.location.href).split("/"))[3]

        if(window.location.href == "http://fcresearch-eu.aka.amazon.com/"+fc+"/search"){
            $('body').append('<div class="a-row"><div class="a-column a-span12 a-text-center" style="color:#0000FF;">FCResearch extended by jachyd!<br>modified by holodows</div></div>')
        }
        else {

            //tworzenie miejsca pracy
            if(!$('#worksheet').length){
                $('body').append('<div id="worksheet" style="display:none" />');
            }
            //Size Groupping
            waitForKeyElements('#table-inventory tbody', function() {
                const ContainerSample = $('#search').attr('placeholder').substr(0,2);
                if(ContainerSample == 'ts' || ContainerSample == 'cs'){
                    $('div [data-section-type="inventory"] .section-title').html($('div [data-section-type="inventory"] .section-title').html()+'<span id="fcrp-groupSize" class="fcrp-gsb">[Categorize by size]</span>');
                    $('#fcrp-groupSize').click(function(){groupSize();});
                }
            });
            //Wstawianie buttonow przy PO i Asinach
            waitMenu();

            let cln = $('.a-expander-container:eq(0)').clone();
            $('.a-expander-container:eq(0)').remove();
            $('#side-bar').prepend("<div class='a-expander-container'><a href='javascript:void(0)' data-action='a-expander-toggle' class='a-declarative a-link-section-expander' data-a-expander-toggle='{\"expand_prompt\":\"\", \"collapse_prompt\":\"\"}'><i class='a-icon a-icon-section-collapse'></i><span class='a-expander-prompt'><h6>"+locale[2]+"</h6></span></a><div  class='a-expander-content fcrp_box'><button id='fcrp_bargen'>"+locale[5]+"</button><br /><button id='fcrpSettings'  style='margin-bottom:0px!important;'><img src='"+images[2]+"'/> "+locale[6]+"</button><div id='fcrp_cfg' style='display:none'><h5>"+locale[12]+"</h5><input type='text' id='fcrp_cfgRegion' value='"+$.cookie("cfg-region")+"' /><br /><br /><input type='checkbox' id='fcrp_redesign' class='fcrp_cfgchx' data-cfg='cfg-design'>"+locale[8]+"</span><br />"+locale[9]+"<br /><br /><span id='cfg-res'>"+locale[10]+"</span><br /><br/>"+locale[3]+" <a href='mailto:jachyd@amazon.com'>jachyd</a></div><div id='fcrp_amznsoft' style='margin-top:10px;'><h5>"+locale[7]+"</h5><a href='http://aft-qt-eu.aka.amazon.com/app/ioprint?experience=Desktop'>IO Print</a><a href='http://localhost:5965/barcodegenerator'>PrintMoon</a><a href='https://unified-portal-eu.inbound-shipment-signals.scot.a2z.com/#/asnsearch?pageType=search'>ASN Lookup</a><a href='http://aft-qt-eu.aka.amazon.com/app/edititems?experience=Desktop'>EditItems</a><a href='https://dr-sku-dub.amazon.com//'>Dr.Sku</a><a href='https://fc-inbound-dock-hub-eu.aka.amazon.com/en_US/#/dockmaster/dayschedule/"+$.cookie('fcmenu-warehouseId')+"'>DockMaster</a><a href='https://aft-carton-preditor-app-dub.dub.proxy.amazon.com/wf'>Carton PrEditor</a><a href='http://aft-atlisapp-dub.aka.amazon.com/wf'>AtLis</a></div></div>").append(cln);

            $('.fcrp_box').css({'padding':'15px 15px 10px 10px','text-align':'center'});
            $('#fcrp_amznsoft').css({'width':180});$('#fcrp_amznsoft h5').css({'color':'white'});$('#fcrp_amznsoft a').attr('target','_blank');
            $('#fcrp_qty, #printLabel').css('margin-top','5px');
            $('.fcrp_box button').css({'width':175,'height':30,'border-radius':3});
            $('#printLabel').css('width',142);



            waitForKeyElements('div [data-section-type="product"] .a-keyvalue',function(){
                let sortable = $('.a-keyvalue th:contains("Sortable"), .a-keyvalue th:contains("Sortowalna")'), hrv = $('.a-keyvalue th:contains("Very High Value"), .a-keyvalue th:contains("Bardzo wartoÅ›ciowa")');
                sortable.css({'background-color':'#3f5973','color':'white'}).parent().css('background-color',(sortable.parent().find('td').text()=='false')?'#a73225':'#359933');
                hrv.css({'background-color':'#3f5973','color':'white'}).parent().css('background-color',(hrv.parent().find('td').text()=='false')?'#a73225':'#359933');
            });
            if($.cookie('cfg-design')=='1')
                $('.fcrp_cfgchx[data-cfg="cfg-design"]').prop('checked',true);

            $('.fcrp_cfgchx').change(function(){
                let temp = 0;
                if($(this).prop("checked") == true){
                    temp = 1;
                }
                $.cookie($(this).attr('data-cfg'),temp);
            });

            $('#fcrp_bargen').css('cursor','pointer').click(function(){
                if(typeof barGen == 'undefined'){
                    let height = (screen.height), left = screen.availWidth-310;
                    const barGen = window.open("http://barcodes.corp.amazon.com/?bargenJachyd=1", "", "toolbar=no,location=no,scrollbars=yes,resizable=yes,width=30,height="+height+";");
                    barGen.resizeTo(320,screen.height-35);
                    barGen.moveTo(screen.availWidth-310,0);
                }

            });
            $('#fcrp_cfgRegion').bind('input', function(){
                $.cookie('cfg-region',$('#fcrp_cfgRegion').val());
            });

            $('#cfg-res').css({'text-decoration':'underline','color':'red'}).click(function(){
                $('.fcrp_cfgchx').prop('checked',true);
                for(let i=0;i<myCookies.length;i++){
                    $.cookie(myCookies[i][0],myCookies[i][1]);
                }
            });


            $('#fcrpSettings').click(function(){
                if($('#fcrp_cfg').css('display') == 'none'){
                    $('#fcrp_cfg').css('display','block');
                }
                else {
                    $('#fcrp_cfg').css('display','none');
                }
            });
        }
    }
})
