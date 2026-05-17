/*--------------------------------------------------------------------------------------------------------------------*/
/* general function for handling errors */
function handleError(result) {
    if(result.err.message) {
        if(result.err.message  == 'Invalid param') {
            GeneralMsg.set_message('חסרים נתונים, אנא נסה שנית');
        } else {
            GeneralMsg.set_message(result.err.message);
        }
    } else {
        if(result.err  == 'Invalid param') {
            GeneralMsg.set_message('חסרים נתונים, אנא נסה שנית');
        } else {
            GeneralMsg.set_message(result.err);
        }
    }
    $("#js_loader").removeClass("show");
    GeneralMsg.show();
}

/*--------------------------------------------------------------------------------------------------------------------*/
/* get CG iframe url */
function drawPaymentLinkPageData(hash){
    var payload = {
        page_hash:hash
    }
    
    $.post('api/light/web/1.0/drawPaymentLinkPageData', payload, function (result) {
        if (result.err){
            $.publish('onPageDataError', result.err);
        } else {
            $.publish('onPageDataResponse', result.data);
        }
    },"json");
}



function doPaymentLinkTransaction(hash){
    var payload = {
        page_hash:hash
    }
    
    $.post('api/light/web/1.0/doPaymentLinkTransaction', payload , function (result) {
        if (result.err){
            GeneralMsg.setMessage(result.err.message);
            GeneralMsg.show();
        } else {
            $.publish('onPaymentLinkTransaction', result.data);
        }
    },"json");
}