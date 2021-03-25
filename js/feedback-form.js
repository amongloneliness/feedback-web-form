'use strict'

// класс: поле ввода формы
class formInput {
    constructor(input, regex) {
        this.input = input;
        this.regex = regex;
        this.value = input.val();
        this.validityStatus = true;
    }

    isEmptyInput() {
        return (this.value === "");
    }

    selectInputBorderStyle(isCorrectInput) {
        if (isCorrectInput) {
            this.input.addClass('correct-form-input');
            this.input.removeClass('incorrect-form-input');
            this.validityStatus = true;
        } else {
            this.input.addClass('incorrect-form-input');
            this.input.removeClass('correct-form-input');
            this.validityStatus = false;
        }
    }

    isValidCharsInput() {
        return this.regex.test(this.value);
    }

    clearInput() {
        this.input.val("");
        this.input.removeClass('incorrect-form-input');
        this.input.removeClass('correct-form-input');
    }

    checkValidityInput() {
        this.selectInputBorderStyle(!(this.isEmptyInput()) && this.isValidCharsInput());
    }

    setInput(input) {
        this.input = input;
        this.value = input.val();
        this.checkValidityInput();
    }

    getErrors() {
        if (this.isEmptyInput()) {
            return `Поле <${this.input.attr("placeholder")}> обязательно для заполнения!\n`;
        } else if (!this.isValidCharsInput()) {
            return `Поле <${this.input.attr("placeholder")}> - неправильный ввод.\n`;
        } else {
            return "";
        }
    }
}


window.onload = function() {
    let name = new formInput($('.feedback-form__input-text[name="name"]'), /^[а-яё –-]+$/i);
    let phone = new formInput($('.feedback-form__input-text[name="phone"]'), /^[\+\d]{1}[\d\(\)\ -]{4,15}\d$/);
    let email = new formInput($('.feedback-form__input-text[name="email"]'), /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i);

    name.input.focusout(function() {
        name.setInput($('.feedback-form__input-text[name="name"]'));
    });

    phone.input.focusout(function() {
        phone.setInput($('.feedback-form__input-text[name="phone"]'));
    });

    email.input.focusout(function() {
        email.setInput($('.feedback-form__input-text[name="email"]'));
    });


    $(".feedback-form__button-request").on('click', function() {
        // таймаут работы кнопки отправления
        $(this).prop('disabled', true);
        setTimeout(function() {
            $(this).prop('disabled', false);
        }.bind(this), 1000);

        name.checkValidityInput();
        phone.checkValidityInput();
        email.checkValidityInput();

        if (name.validityStatus && phone.validityStatus && email.validityStatus) {

            $.ajax({
                url: 'https://60376bfd5435040017722533.mockapi.io/form',
                type: 'POST',
                cache: false,
                data: {
                    'name': name.value,
                    'phone': phone.value,
                    'email': email.value
                },
                statusCode: {
                    201: function() {
                        alert('Ваш запрос успешно отправлен.');

                        name.clearInput();
                        phone.clearInput();
                        email.clearInput();
                    },
                    404: function() {
                        alert('Ошибка 404. Page Not Found. \n\nПожалуйста повторите попытку позже.');
                    },
                    400: function() {;
                        alert('Ошибка 400. Bad request. \n\nПожалуйста повторите попытку позже.');
                    },
                    500: function() {
                        alert('Ошибка 500. Server Error. Ошибка сервера.');
                    }
                }
            });
        } else {
            // вывод ошибок полей ввода
            alert(name.getErrors() + phone.getErrors() + email.getErrors());
        }
    })
}