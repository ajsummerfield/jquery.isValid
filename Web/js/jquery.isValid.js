(function ($) {
    "use strict";

    $.isValid = function (element, options) {

        var self;

        this.init = function () {

            self = this;

            this.elem = element;
            this.$elem = $(element);
            this.isFieldValid = false;
            this.options = $.extend(true, {}, $.isValid.defaults, options);
            this.formID = '#' + this.$elem.attr('id');
            this.$elem.addClass('isValid');

            this.formArray = $(this.formID + ' :input[type="text"],' +
                this.formID + ' :input[type="email"],' +
                this.formID + ' :input[type="password"],' +
                this.formID + ' :input[type="tel"],' +
                this.formID + ' :input[type="number"],' +
                this.formID + ' :input[type="date"],' +
                this.formID + ' :input[type="checkbox"],' +
                this.formID + ' textarea,' +
                this.formID + ' select');
        };

        this.isFormValidated = function () {
            return ($(this.formID + ' .invalid').length) ? false : true;
        };

        this.isValidField = function (field) {

            if (field.disabled || $(field).attr('data-field-type') === "notrequired") {
                this.isFieldValid = true;
            } else {
                var data = $(field).attr('data-field-type'),
                    valMethodName;

                switch (data) {
                case 'general':
                    valMethodName = 'isGeneralValid';
                    break;

                case 'password':
                    valMethodName = 'isPasswordValid';
                    break;

                case 'passwordConfirm':
                    valMethodName = 'isPasswordConfirmValid';
                    break;

                case 'email':
                    valMethodName = 'isEmailValid';
                    break;

                case 'emailConfirm':
                    valMethodName = 'isEmailConfirmValid';
                    break;

                case 'date':
                    valMethodName = 'isDateValid';
                    break;

                case 'letters':
                    valMethodName = 'isLetters';
                    break;

                case 'numbers':
                    valMethodName = 'isNumbers';
                    break;

                case 'age':
                    valMethodName = 'isAgeValid';
                    break;

                case 'decimals':
                    valMethodName = 'isDecimals';
                    break;

                case 'postCode':
                    valMethodName = 'isPostCodeValid';
                    break;

                case 'checkbox':
                    valMethodName = 'isCheckboxTicked';
                    break;

                case 'select':
                    valMethodName = 'isSelectChosen';
                    break;

                default:
                    valMethodName = 'isEmpty';
                    break;
                }

                this.isFieldValid = this[valMethodName](field);
            }

            return this.isFieldValid;
        };

        this.isEmpty = function (field) {
            return ($(field).val().length === 0);
        };

        this.isGeneralValid = function (field) {

            var isEmpty = this.isEmpty(field);

            if (isEmpty) {
                this.options.general.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return !isEmpty;
        };

        this.isLetters = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = /^[A-Za-z ]+$/.test($(field).val());

            if (!isEmpty) {
                this.options.letters.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'invalid');
            } else {
                this.options.letters.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return !isEmpty && validResult;
        };

        this.isNumbers = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = /^[0-9 ]+$/.test($(field).val());

            if (!isEmpty) {
                this.options.numbers.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'invalid');
            } else {
                this.options.numbers.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return !isEmpty && validResult;
        };
        
        this.isAgeValid = function(field) {
        
            var isEmpty = this.isEmpty(field),
                validResult = (/^[0-9 ]+$/.test($(field).val())) && ($(field).val() > 0) && ($(field).val() < 150);

            if (!isEmpty) {
                this.options.age.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'invalid');
            } else {
                this.options.age.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return !isEmpty && validResult;
        };

        this.isDecimals = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = /^(\d+\.?\d*|\.\d+)$/.test($(field).val());

            if (!isEmpty) {
                this.options.decimals.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'invalid');
            } else {
                this.options.decimals.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return !isEmpty && validResult;
        };

        this.isPasswordValid = function (field) {

            var passwordMatcher = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
                isEmpty,
                lengthResult,
                formatResult = true;

            isEmpty = this.isEmpty(field);

            lengthResult = isBetween($(field).val().length, this.options.password.minLength, this.options.password.maxLength);

            if (this.options.password.numbers && this.options.password.letters) {
                formatResult = (passwordMatcher.test($(field).val()));
            }

            if (this.options.password.passwordConfirm) {
                this.isPasswordConfirmValid($(this.formID + ' input[data-field-type="passwordConfirm"]'));
            }

            if (!isEmpty) {
                this.options.password.activeErrorMessage = lengthResult && !formatResult ? getErrorMessage(field, 'format') : getErrorMessage(field, 'invalid');
            } else {
                this.options.password.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return (lengthResult && !isEmpty) ? formatResult : false;
        };

        this.isPasswordConfirmValid = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = $(field).val() === $(this.formID + ' input[data-field-type="password"]').val();

            if (!isEmpty) {
                this.options.passwordConfirm.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'invalid');
            } else {
                this.options.passwordConfirm.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return !isEmpty && validResult;
        };

        this.isEmailValid = function (field) {

            var emailMatcher = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                isEmpty,
                validResult,
                domainResult = true;

            isEmpty = this.isEmpty(field);

            // Remove whitespace as some mobiles/tablets put a spacebar in if you use the autocomplete option on a the device
            var isWhiteSpace = /\s/.test($(field).val());
            if (isWhiteSpace) {
                $(field).val($(field).val().replace(/\s/g, ''));
            }

            validResult = emailMatcher.test($(field).val());

            if (this.options.email.domain !== '') {
                domainResult = ($(field).val().indexOf(this.options.email.domain, $(field).val().length - this.options.email.domain.length) !== -1);
            }
            
            if (this.options.email.emailConfirm) {
                this.isEmailConfirmValid($(this.formID + ' input[data-field-type="emailConfirm"]'));
            }

            if (!isEmpty) {
                this.options.email.activeErrorMessage = validResult && !domainResult ? getErrorMessage(field, 'domain') : getErrorMessage(field, 'invalid');
            } else {
                this.options.email.activeErrorMessage = getErrorMessage(field, 'required');
            }
            
            return (validResult && !isEmpty) ? domainResult : false;
        };

        this.isEmailConfirmValid = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = $(field).val() === $(this.formID + ' input[data-field-type="email"]').val();

            if (!isEmpty) {
                this.options.emailConfirm.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'invalid');
            } else {
                this.options.emailConfirm.activeErrorMessage = getErrorMessage(field, 'required');
            }
            
            return !isEmpty && validResult;
        };

        this.isDateValid = function (field) {

            var date = $(field).val(),
                isEmpty,
                validResult,
                allowedResult,
                formatResult;

            isEmpty = this.isEmpty(field);

            var momentObject = new moment(date, this.options.date.format, true); // jshint ignore:line

            validResult = momentObject.isValid();
            formatResult = (momentObject._pf.charsLeftOver === 0);

            if (!this.options.date.allowFutureDates) {

                if (validResult) {
                    allowedResult = isBetween(Date.parse(momentObject._d), 0, Date.now());
                }
            }

            if (!isEmpty) {

                if (!validResult) {

                    if (!formatResult) {

                        if (momentObject._pf.unusedTokens.length === 1 || momentObject._pf.unusedTokens.length === 2 && momentObject._pf.charsLeftOver === 2) {
                            this.options.date.activeErrorMessage = getErrorMessage(field, 'format');
                        } else {
                            this.options.date.activeErrorMessage = getErrorMessage(field, 'invalid');
                        }

                    } else {
                        this.options.date.activeErrorMessage = getErrorMessage(field, 'invalid');
                    }
                } else {
                    if (!formatResult) {
                        this.options.date.activeErrorMessage = getErrorMessage(field, 'format');
                    } else {
                        if (!allowedResult) {
                            this.options.date.activeErrorMessage = getErrorMessage(field, 'allowedDate');
                        }
                    }
                }
            } else {
                this.options.date.activeErrorMessage = getErrorMessage(field, 'required');
            }
            
            return !isEmpty && validResult && formatResult && allowedResult;
        };

        this.isPostCodeValid = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = checkPostCode($(field).val());

            if (!isEmpty) {
                this.options.postCode.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'invalid');
            } else {
                this.options.postCode.activeErrorMessage = getErrorMessage(field, 'required');
            }
            
            return !isEmpty && validResult;
        };

        this.isSelectChosen = function (field) {

            var validResult = true;

            if ($(field).val() === null) {
                validResult = false;
            } else if ($(field).val().length === 0) {
                validResult = false;
            }

            this.options.select.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'required');

            return validResult;
        };

        this.isCheckboxTicked = function (field) {

            var validResult = $(field).is(':checked');

            this.options.checkbox.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'required');

            return validResult;
        };

        this.showErrorFor = function (field) {

            if (this.options.showErrorMessages) {
                if ($(field).siblings('.form-error').length) {

                    updateErrorContainer(field);

                } else {
                    var errorContainer = createErrorContainer(field);
                    var errorContainerWidth = getErrorContainerWidth(field);

                    $(field).parent().append(errorContainer);

                    $(field).siblings('.form-error').css('width', errorContainerWidth + 'px');
                    $(field).siblings('.form-error').css('margin-left', $(field).position().left + 'px');
                }
            }

            $(field).addClass('invalid');
            $(field).trigger('isValid.fieldInvalidated');
        };

        this.hideErrorFor = function (field) {

            $(field).removeClass('invalid');
            $(field).siblings('.form-error').remove();

            $(field).trigger('isValid.fieldValidated');
        };

        var isBetween = function (val, min, max) {
            return (val >= min && val <= max);
        };

        var createErrorContainer = function (field) {

            var errorMessage = self.options[$(field).data().fieldType].activeErrorMessage;

            return '<div class="form-error">' + errorMessage + '</div>';
        };

        var updateErrorContainer = function (field) {

            var errorMessage = self.options[$(field).data().fieldType].activeErrorMessage;

            $(field).siblings('.form-error').text(errorMessage);
        };

        var getErrorContainerWidth = function (field) {

            if ($(field).attr('aria-hidden') === undefined && $(field).is(':visible')) {
                return $(field).outerWidth();
            } else {
                return Math.max.apply(Math, $(field).parent().children().map(function () {
                    return $(this).width();
                }).get());
            }
        };

        var getErrorMessage = function (field, errorType) {

            var fieldData = $(field).data(),
                errorMessageType;

            switch (errorType) {

            case 'required':
                errorMessageType = 'requiredErrorMessage';
                break;

            case 'invalid':
                errorMessageType = 'invalidErrorMessage';
                break;

            case 'format':
                errorMessageType = 'formatErrorMessage';
                break;

            case 'domain':
                errorMessageType = 'domainErrorMessage';
                break;

            case 'allowedDate':
                errorMessageType = 'allowedDateErrorMessage';
                break;
            }

            if (fieldData[errorMessageType] !== undefined) {
                return fieldData[errorMessageType];
            } else {
                return self.options[$(field).data().fieldType][errorMessageType];
            }
        };

    };

    $.fn.isValid = function (options) {

        return this.each(function () {

            var isValid = new $.isValid(this, options);
            $(this).data('isValid', isValid);

            isValid.init();

            var submitButton = $(isValid.formID + ' :input[type="submit"]');

            submitButton.click(function (e) {

                isValid.formArray.each(function (index, field) {

                    if (!isValid.isValidField(field)) {
                        isValid.showErrorFor(field);
                    } else {
                        isValid.hideErrorFor(field);
                    }

                    isValid.isFormValid = isValid.isFormValidated();

                    if (!isValid.isFormValid) {
                        e.preventDefault();
                    }
                });
            });

            isValid.formArray.each(function (index, field) {

                if (isValid.options.validateOnBlur) {
                    $(field).on('blur change', function () {

                        if (!isValid.isValidField(field)) {
                            isValid.showErrorFor(field);
                        } else {
                            isValid.hideErrorFor(field);
                        }
                    });
                }

                $(field).on('isValid.fieldInvalidated', function (event) {

                    var eventObject = {
                        isValid: false,
                        fieldElement: $(event.currentTarget),
                        fieldData: $(event.currentTarget).data()
                    };

                    isValid.options[$(field).data().fieldType].callbacks.onInvalidated(eventObject);
                });

                $(field).on('isValid.fieldValidated', function (event) {

                    var eventObject = {
                        isValid: true,
                        fieldElement: $(event.currentTarget),
                        fieldData: $(event.currentTarget).data()
                    };

                    isValid.options[$(field).data().fieldType].callbacks.onValidated(eventObject);
                });

            });
        });
    };

    $.isValid.defaults = {
        general: {
            activeErrorMessage: '',
            requiredErrorMessage: 'Field is required',
            callbacks: {
                onValidated: function (event) {},
                onInvalidated: function (event) {}
            }
        },
        letters: {
            activeErrorMessage: '',
            requiredErrorMessage: 'Field is required',
            invalidErrorMessage: 'Field is letters only',
            callbacks: {
                onValidated: function (event) {},
                onInvalidated: function (event) {}
            }
        },
        numbers: {
            activeErrorMessage: '',
            requiredErrorMessage: 'Field is required',
            invalidErrorMessage: 'Field is numbers only',
            callbacks: {
                onValidated: function (event) {},
                onInvalidated: function (event) {}
            }
        },
        age: {
            activeErrorMessage: '',
            requiredErrorMessage: 'Field is required',
            invalidErrorMessage: 'Age is invalid',
            callbacks: {
                onValidated: function (event) {},
                onInvalidated: function (event) {}
            }
        },
        decimals: {
            activeErrorMessage: '',
            requiredErrorMessage: 'Field is required',
            invalidErrorMessage: 'Field is decimals only',
            callbacks: {
                onValidated: function (event) {},
                onInvalidated: function (event) {}
            }
        },
        password: {
            minLength: 6,
            maxLength: 100,
            numbers: false,
            letters: true,
            passwordConfirm: false,
            activeErrorMessage: '',
            requiredErrorMessage: 'Password is required',
            formatErrorMessage: 'Password should contain numbers and letters',
            invalidErrorMessage: 'Password should be more than 6 characters',
            callbacks: {
                onValidated: function (event) {},
                onInvalidated: function (event) {}
            }
        },
        passwordConfirm: {
            activeErrorMessage: '',
            requiredErrorMessage: 'Confirming your Password is required',
            invalidErrorMessage: 'Passwords do not match',
            callbacks: {
                onValidated: function (event) {},
                onInvalidated: function (event) {}
            }
        },
        email: {
            domain: '',
            emailConfirm: false,
            activeErrorMessage: '',
            requiredErrorMessage: 'Email is required',
            domainErrorMessage: 'Email domain should be @xxxx.com',
            invalidErrorMessage: 'Please enter a valid email address',
            callbacks: {
                onValidated: function (event) {},
                onInvalidated: function (event) {}
            }
        },
        emailConfirm: {
            activeErrorMessage: '',
            requiredErrorMessage: 'Confirming your Email is required',
            invalidErrorMessage: 'Email addresses do not match',
            callbacks: {
                onValidated: function (event) {},
                onInvalidated: function (event) {}
            }
        },
        date: {
            format: 'DD/MM/YYYY',
            allowFutureDates: true,
            activeErrorMessage: '',
            requiredErrorMessage: 'Date is required',
            formatErrorMessage: 'Date format doesn\'t match DD/MM/YYYY',
            invalidErrorMessage: 'Please enter a valid Date',
            allowedDateErrorMessage: 'Date not allowed',
            callbacks: {
                onValidated: function (event) {},
                onInvalidated: function (event) {}
            }
        },
        postCode: {
            activeErrorMessage: '',
            requiredErrorMessage: 'Post Code is required',
            invalidErrorMessage: 'Please enter a valid Post Code',
            callbacks: {
                onValidated: function (event) {},
                onInvalidated: function (event) {}
            }
        },
        select: {
            activeErrorMessage: '',
            requiredErrorMessage: 'Choosing an option is required',
            callbacks: {
                onValidated: function (event) {},
                onInvalidated: function (event) {}
            }
        },
        checkbox: {
            activeErrorMessage: '',
            requiredErrorMessage: 'Checkbox is required',
            callbacks: {
                onValidated: function (event) {},
                onInvalidated: function (event) {}
            }
        },
        validateOnBlur: true,
        showErrorMessages: true,
        onFormValidated: function () {},
        onFormInvalidated: function () {},
        validators: {}
    };

})(jQuery);