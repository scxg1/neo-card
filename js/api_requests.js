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
    // Mocking the backend response for static hosting
    var result = {
        err: null,
        data: {
            business_name: "גרו ביזנס",
            sum: "5.00",
            type_id: 2,
            description: "תשלום עבור שירות - Payment for service",
            payment_link_background_color: "#f0f2f5",
            payment_link_btn_color: "#1a1a5e",
            payment_link_btn_text: "לתשלום",
            payment_link_direct_debit_message: "",
            environment: "sandbox"
        }
    };
    
    setTimeout(function() {
        if (result.err){
            $.publish('onPageDataError', result.err);
        } else {
            $.publish('onPageDataResponse', result.data);
        }
    }, 500);
}

function doPaymentLinkTransaction(hash){
    // Mocking the transaction response
    var result = {
        err: null,
        data: {
            authCode: "DEMO_AUTH_CODE_12345"
        }
    };
    
    setTimeout(function() {
        if (result.err){
            GeneralMsg.setMessage(result.err.message);
            GeneralMsg.show();
        } else {
            $.publish('onPaymentLinkTransaction', result.data);
        }
    }, 500);
}