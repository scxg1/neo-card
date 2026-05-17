let Loader;
let isPaymentDisabled = false;
let isPaymentSuccessful = false;
let Elements;

$(document).ready(function () {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var page_hash = urlParams.get('l');
    var page_data = false;
    Loader        = $('.js-loader');

    const TRANSACTION_TYPES = {
        1: directDebitType,
        2: regularType,
        4: paymentsType,
    };

    // an object with elements to avoid duplicates
    Elements = {
        mainWrapper: $('.wrapper'),
        errorWrapper: $('.error-wrapper'),
        errorMessage: $('.js-error-message'),
        paymentButton: $('.js-payment-btn'),
    };

    $.subscribe('onPageDataResponse', function (evt, response) {
        page_data = response;
        configureGrowSdk(page_data.environment);
        drawDetails();
    });
    $.subscribe('onPaymentLinkTransaction', function (evt, response) {
        if (response.url) {
            window.location.replace(response.url);
        } else {
            startSdk(response.authCode);
        }
    });
    $.subscribe('onPageDataError', function (evt, response) {
        isPaymentDisabled = true;
        Elements.errorWrapper.removeClass('hidden');
        Elements.errorMessage.text(response.message);
        Loader.removeClass('open');
    });
    drawPaymentLinkPageData(page_hash);

    function drawDetails() {
        let directDebitPaymentsNum = page_data.payment_link_direct_debit_message || "";

        // THIS IS FOR NOW - REMOVE LATER
        let isUnlimitedPayments = directDebitPaymentsNum === "מוגבל ל- 180 תשלומים" ? unlimitedPaymentsText : directDebitPaymentsNum;

        $(".js-body-color").css("background", page_data.payment_link_background_color);
        Elements.paymentButton.css("background", page_data.payment_link_btn_color);
        page_data.payment_link_btn_text && $('.js-payment-sum').text(page_data.payment_link_btn_text);
        $('.js-sum').text(addPriceCommas(page_data.sum));
        $('.js-business-name').text(page_data.business_name);
        $('.js-transaction-type').text(`${TRANSACTION_TYPES[page_data.type_id]} ${isUnlimitedPayments}`.trim());
        setDescriptionIfAvailable();
        Elements.mainWrapper.removeClass('hidden');
        Loader.removeClass('open');
    }

    $('.js-paid-request-thanks').on('click', function () {
        window.close();
    });

    Elements.paymentButton.on('click', function () {
        // just in case someone plays with the CSS and removes the hidden class on the main wrapper
        if (isPaymentDisabled) {
            return;
        }

        Loader.addClass('open');
        doPaymentLinkTransaction(page_hash);
    });

    function setDescriptionIfAvailable() {
        if (page_data.description) {
            $('.js-description').text(page_data.description);
            $('.js-description-row').removeClass("hidden");
        }
    }

    function startSdk(authCode) {
        if (window.growPayment) {
            growPayment.renderPaymentOptions(authCode);
            return;
        }

        setTimeout(() => {
            startSdk(authCode);
        }, 800);
    }
});

function handleWalletErrorAndFailure(err) {
    Loader.removeClass('open');
}

function handleRequestIsPaid() {
    Elements.mainWrapper.addClass('hidden');
    $('.paid-request-wrapper').removeClass('hidden');
    isPaymentDisabled = true;
}

function configureGrowSdk(env) {
    if (env.toLowerCase() === "live") {
        env = "PRODUCTION";
    } else {
        env = env.toUpperCase();
    }

    var config = {
        environment: env,
        version: 1,
        events: {
            onSuccess: (response) => {
                isPaymentSuccessful = true;
            },
            onFailure: (response) => handleWalletErrorAndFailure(response),
            onError: (response) => handleWalletErrorAndFailure(response),
            onWalletChange: (state) => {
                switch (state) {
                    case 'open':
                        Loader.removeClass('open');
                        break;
                    default:
                        if (isPaymentSuccessful) {
                            handleRequestIsPaid();
                        }

                        Loader.removeClass('open');
                }
            },
        },
        ...(env !== "PRODUCTION" && {debugMode: true}),
    };

    initSdk(config);
}

function initSdk(config) {
    if (window.growPayment) {
        growPayment.init(config);
        return;
    }

    setTimeout(() => {
        initSdk(config);
    }, 800);
}

function addPriceCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
