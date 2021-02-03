(function () {
    let ccvCode = false;
    const mackCard = function () {
        let value = $('#number-card-user').html();
        $('#card_number').val(value);
        checkPaymentSystem(value)
    };
    const maskCardUser = function () {
        $('#card_number').inputmask("*{4} *{4} *{4} 9{4}", {
            removeMaskOnSubmit: true,
            definitions: {
                "*": {
                    validator: function (chrs) {
                        let isValid = new RegExp("[0-9]").test(chrs);
                        return isValid !== true || {
                            c: '*'
                        }
                    },
                    cardinality: 1
                }
            },
        });
    };

    const checkPaymentSystem = function (num) {
        if (num) {
            const numPayment = Number(num.slice(0, 1)).toString();
            if (numPayment === '5') {
                $('#master_card').removeClass('hidden').addClass('visual');
            } else {
                $('#master_card').removeClass('visual').addClass('hidden')
            }
            if (numPayment === '4') {
                $('#visa_card').removeClass('hidden').addClass('visual');
            } else {
                $('#visa_card').removeClass('visual').addClass('hidden')
            }
        } else {
            $('#visa_card').removeClass('visual').addClass('hidden');
            $('#master_card').removeClass('visual').addClass('hidden')
        }

    };
    const validatorCvv = function () {
        $('#password_cvv').on('input', function (e) {
            if (e.target.value.length === 3) {
                ccvCode = true;
                $('#err-cvv').removeClass('visual').addClass('hidden');
                $('#password_cvv').removeClass('error-validate');
            }
            if (e.target.value.length <= 2) {
                $('#err-cvv').removeClass('hidden').addClass('visual');
                $('#password_cvv').addClass('error-validate');
                ccvCode = false
            }
        })
    };
    const checkFormPayment = function () {
        $('#click-payment').on('click', function () {
            $("#form-payment").submit(function (event) {
                if (ccvCode) {
                    let value = $('#number-card-user').html();
                    $('#card_number').inputmask('remove').removeAttr("disabled").val(value);
                    this.submit();
                    return;
                }
                event.preventDefault();
            });
        })
    };
    mackCard();
    maskCardUser();
    validatorCvv();
    checkFormPayment();
})();


