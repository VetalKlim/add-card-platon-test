(function () {
    let btnCard = false;
    let btnDate = false;
    let btnPassword = false;
    const hiddenLabel = function () {
        $('#numberCard').on('blur', function (e) {
            if (e.target.value.split('_').toString().length === 0 || e.target.value.split('_').join('').toString().length <= 16) {
                $('#numberCard').addClass('error-validate');
            }
        }).on('focus', function (e) {
            if (e.target.value.split('_')[0].toString().replace('/', '').length === 19) {
                $('#numberCard').val('').addClass('error-validate');
                checkPaymentSystem(e.target.value.split('_')[0].toString().replace('/', ''));
                btnCard = false;
            }
        });
        $('#year-block').on('click', function () {
            $('#label-validity').removeClass('visual').addClass('hidden');
            $('#card_exp_year').focus().removeClass('error-validate');
        });
        $('#card_exp_year').on('focus', function (e) {
            $('#label-validity').removeClass('visual').addClass('hidden');
            $('#card_exp_year').removeClass('error-validate');
            if (e.target.value.split('_')[0].toString().replace('/', '').length === 4) {
                $('#card_exp_year').val('')
            }
        }).on('blur', function (e) {
            const date = e.target.value.split('_')[0].toString().replace('/', '');
            if (e.target.value.length === 0) {
                $('#label-validity').removeClass('hidden').addClass('visual');
            }
            if (date.length >= 1 && date.length <= 3) {
                $('#card_exp_year').addClass('error-validate')
            } else if (date.length >= 4) {
                $('#card_exp_year').removeClass('error-validate')
            }
        });
        $('#password-block').on('click', function () {
            $('#label-password').removeClass('visual').addClass('hidden');
            $('#password_cvv').focus()
        });
        $('#password_cvv').on('focus', function (e) {
            $('#label-password').removeClass('visual').addClass('hidden');
        }).on('blur', function (e) {
            if (e.target.value.length === 0) {
                $('#label-password').removeClass('hidden').addClass('visual');
            }
        });
        $('input[name="cvv2"]').keypress(function () {
            this.value = this.value.toString().replace(/[^\d]/ig, '');
            if (this.value.length >= 4) {
                return false;
            }
        });
    };

    const nextInput = function () {
        $('#numberCard').on('change', function (e) {
            checkCard(e)
        }).on('input', function (e) {
            checkCard(e)
        });
        $('#card_exp_year').on('change', function (e) {
            checkDate(e)
        }).on('input', function (e) {
            checkDate(e)
        })
    };
    const checkDate = function (e) {
        const filterNumber = e.target.value.split('_')[0].toString().replace('/', '');
        validationDateCard(filterNumber);
        if (filterNumber.length === 4) {
            $('#password_cvv').focus();
            btnDate = true;
        } else {
            btnDate = false;
        }
    };
    const checkCard = function (e) {
        const filterNumber = e.target.value.split('_')[0].toString().replace(/\s/g, '');
        checkPaymentSystem(filterNumber);
        validationNumberCard(filterNumber);
        if (filterNumber.length === 16 && validationNumberCard(filterNumber)) {
            $('#card_exp_year').focus();
            btnCard = true;
        } else {
            btnCard = false;
        }
    };

    const maskInput = function () {
        $('#numberCard').inputmask("9999 9999 9999 9999", {
            "placeholder": "_",
            showMaskOnHover: false,
            removeMaskOnSubmit: true,
            clearMaskOnLostFocus: true
        });
        $('#card_exp_year').inputmask("99/99", {showMaskOnHover: false, removeMaskOnSubmit: true});
        $('#password_cvv').inputmask({mask: '999', placeholder: ''});
    };

    function checkPaymentSystem(num) {
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

    const validationDateCard = function (numberData) {
        const mount = numberData.slice(0, 2);
        const year = Number(numberData.slice(2, 4));
        const date = new Date();
        const curr_month = ("0" + (date.getMonth() + 1)).slice(-2);
        const curr_year = date.getFullYear().toString().slice(2, 4).toString();
        const nowDate = curr_month.toString() + curr_year;
        if (mount.length === 1 && mount >= 2) {
            $('#card_exp_year').val('1')
        }
        if (mount.length === 2 && mount >= 13) {
            $('#card_exp_year').val('12')
        }
        if (mount.length === 2 && mount === '00') {
            $('#card_exp_year').val('01')
        }
        if (numberData.length === 4 && +curr_year > year) {
            $('#card_exp_year').val(nowDate)
        }
        if (numberData.length === 4 && curr_month > +mount && +curr_year === year) {
            $('#card_exp_year').val(nowDate)
        }
    };

    const validationNumberCard = function (numberCard) {
        if (numberCard.length >= 16 && !validateCardNumber(numberCard)) {
            $('#numberCard').addClass('error-validate');
            $('#err-card').removeClass('hidden').addClass('visual');
            return false;
        }
        if (numberCard.length >= 16 && validateCardNumber(numberCard)) {
            $('#numberCard').removeClass('error-validate');
            $('#err-card').removeClass('visual').addClass('hidden');
            return true
        }
    };

    const validateCardNumber = function (number) {
        const regex = new RegExp("^[0-9]{16}$");
        if (!regex.test(number)) {
            return false;
        } else {
            return luhnCheck(number);
        }
    };

    const luhnCheck = function (val) {
        let sum = 0;
        for (let i = 0; i < val.length; i++) {
            let intVal = parseInt(val.substr(i, 1));
            if (i % 2 == 0) {
                intVal *= 2;
                if (intVal > 9) {
                    intVal = 1 + (intVal % 10);
                }
            }
            sum += intVal;
        }
        return (sum % 10) == 0;
    };

    const validatorCvv = function () {
        $('#password_cvv').on('input', function (e) {
            if (e.target.value.length <= 2) {
                $('#password_cvv').addClass('error-validate');
                btnPassword = false;
            } else {
                $('#password_cvv').removeClass('error-validate');
                btnPassword = true;
            }
        })
    };
    const checkFormAddCard = function () {
        $('#click-add-card').on('click', function () {
            $("#form-add-card").submit(function (event) {
                if (btnCard && btnDate && btnPassword) {
                    return;
                }
                event.preventDefault();
            });
        })
    };

    maskInput();
    nextInput();
    hiddenLabel();
    validatorCvv();
    checkFormAddCard();
}());



