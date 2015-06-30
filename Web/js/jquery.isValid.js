(function ($) {
    "use strict";

    $.isValid = function (element, options) {

        var self;

        this.init = function () {

            self = this;

            this.elem = element;
            this.$elem = $(element);
            this.settings = $.extend(true, {}, $.isValid.defaults, options);
            this.formID = '#' + this.$elem.attr('id');
            this.$elem.addClass('isValid');
            this.FIELD_VALIDATED = 'isValid.fieldValidated';
            this.FIELD_INVALIDATED = 'isValid.fieldInvalidated';
            this.settings.submitButton = this.settings.submitButton !== null ? this.setting.submitButton : $(' :input[type="submit"]', this.formID);
            this.formArray =
                $(' :input[type="text"],' +
                ' :input[type="email"],' +
                ' :input[type="password"],' +
                ' :input[type="tel"],' +
                ' :input[type="number"],' +
                ' :input[type="date"],' +
                ' :input[type="checkbox"],' +
                ' textarea,' +
                ' select', this.formID);

            addCallbacks(this.settings);
        };

        this.isFormValidated = function () {
            return ($(' .invalid', this.formID).length) ? false : true;
        };

        this.isValidField = function (field) {

            var fieldType = field.attr('data-field-type');

            if (field.prop('disabled') || field.attr('type') == 'hidden' || fieldType === "notrequired") {
                return true;
            } else {
                var valMethodName = 'isEmpty',
                    currentField;

                if(this.settings.validators[fieldType].name) {
                    valMethodName = this.settings.validators[fieldType].name;
                }

                if(this[valMethodName] !== undefined) {
                    currentField = this[valMethodName](field);
                } else {
                    currentField = this.settings.validators[fieldType].method(this, field);
                }

                this.setActiveErrorMessageFor(field, fieldType, currentField.activeErrorType);

                return currentField.isValid;
            }
        };

        this.isEmpty = function (field) {
            return (field.val().length === 0);
        };

        this.isGeneralValid = function (field) {

            var isEmpty = this.isEmpty(field),
                errorType;

            if (isEmpty) {
                errorType = 'required';
            }

            return {
                isValid: !isEmpty,
                activeErrorType: errorType
            };
        };

        this.isLetters = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = /^[A-Za-z ]+$/.test(field.val()),
                errorType;

            if (!isEmpty) {
                errorType = validResult ? '' : 'invalid';
            } else {
                errorType = 'required';
            }

            return {
                isValid: !isEmpty && validResult,
                activeErrorType: errorType
            };
        };

        this.isNumbers = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = /^[0-9 ]+$/.test(field.val()),
                errorType;

            if (!isEmpty) {
                errorType = validResult ? '' : 'invalid';
            } else {
                errorType = 'required';
            }

            return {
                isValid: !isEmpty && validResult,
                activeErrorType: errorType
            };
        };

        this.isAgeValid = function(field) {

            var isEmpty = this.isEmpty(field),
                validResult = (/^[0-9 ]+$/.test(field.val())) && (field.val() > 0) && (field.val() < 150),
                errorType;

            if (!isEmpty) {
                errorType = validResult ? '' : 'invalid';
            } else {
                errorType = 'required';
            }

            return {
                isValid: !isEmpty && validResult,
                activeErrorType: errorType
            };
        };

        this.isDecimals = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = /^(\d+\.?\d*|\.\d+)$/.test(field.val()),
                errorType;

            if (!isEmpty) {
                errorType = validResult ? '' : 'invalid';
            } else {
                errorType = 'required';
            }

            return {
                isValid: !isEmpty && validResult,
                activeErrorType: errorType
            };
        };

        this.isPasswordValid = function (field) {

            var passwordMatcher = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
                isEmpty,
                lengthResult,
                formatResult = true,
                errorType;

            isEmpty = this.isEmpty(field);

            lengthResult = isBetween(field.val().length, this.settings.fieldTypes.password.minLength, this.settings.fieldTypes.password.maxLength);

            if (this.settings.fieldTypes.password.numbers && this.settings.fieldTypes.password.letters) {
                formatResult = passwordMatcher.test(field.val());
            }

            if (this.settings.fieldTypes.password.passwordConfirm) {
                this.isPasswordConfirmValid($(' input[data-field-type="passwordConfirm"]', this.formID));
            }

            if (!isEmpty) {
                errorType = lengthResult && !formatResult ? 'format' : 'invalid';
            } else {
                errorType = 'required';
            }

            return {
                isValid: (lengthResult && !isEmpty) ? formatResult : false,
                activeErrorType: errorType
            };
        };

        this.isPasswordConfirmValid = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = field.val() === $(' input[data-field-type="password"]', this.formID).val(),
                errorType;

            if (!isEmpty) {
                errorType = validResult ? '' : 'invalid';
            } else {
                errorType = 'required';
            }

            return {
                isValid: !isEmpty && validResult,
                activeErrorType: errorType
            };
        };

        this.isEmailValid = function (field) {

            var emailMatcher = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                isEmpty,
                validResult,
                domainResult = true,
                errorType;

            isEmpty = this.isEmpty(field);

            // Remove whitespace as some mobiles/tablets put a spacebar in if you use the autocomplete option on a the device
            var isWhiteSpace = /\s/.test(field.val());
            if (isWhiteSpace) {
                field.val(field.val().replace(/\s/g, ''));
            }

            validResult = emailMatcher.test(field.val());

            if (this.settings.fieldTypes.email.domain !== '') {
                var regExp = new RegExp('@' + this.settings.fieldTypes.email.domain + '$', 'g');
                domainResult = regExp.test(field.val());
            }

            if (this.settings.fieldTypes.email.emailConfirm) {
                this.isEmailConfirmValid($(' input[data-field-type="emailConfirm"]', this.formID));
            }

            if (!isEmpty) {
                errorType = validResult && !domainResult ? 'domain' : 'invalid';
            } else {
                errorType = 'required';
            }

            return {
                isValid: (validResult && !isEmpty) ? domainResult : false,
                activeErrorType: errorType
            };
        };

        this.isEmailConfirmValid = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = field.val() === $(' input[data-field-type="email"]', this.formID).val(),
                errorType;

            if (!isEmpty) {
                errorType = validResult ? '' : 'invalid';
            } else {
                errorType = 'required';
            }

            return {
                isValid: !isEmpty && validResult,
                activeErrorType: errorType
            };
        };

        this.isDateValid = function (field) {

            var date = field.val(),
                isEmpty,
                validResult,
                allowedResult,
                formatResult,
                errorType;

            isEmpty = this.isEmpty(field);

            var momentObject = new moment(date, this.settings.fieldTypes.date.format, true); // jshint ignore:line

            validResult = momentObject.isValid();
            formatResult = (momentObject._pf.charsLeftOver === 0);

            if (!this.settings.fieldTypes.date.allowFutureDates) {

                if (validResult) {
                    allowedResult = isBetween(Date.parse(momentObject._d), 0, Date.now());
                }
            }

            if (!isEmpty) {
                if (!validResult) {
                    if (!formatResult) {
                        if (momentObject._pf.unusedTokens.length === 1 || momentObject._pf.unusedTokens.length === 2 && momentObject._pf.charsLeftOver === 2) {
                            errorType = 'format';
                        } else {
                            errorType = 'invalid';
                        }
                    } else {
                        errorType = 'invalid';
                    }
                } else {
                    if (!formatResult) {
                        errorType = 'format';
                    } else {
                        if (!allowedResult) {
                            errorType = 'allowedDate';
                        }
                    }
                }
            } else {
                errorType = 'required';
            }

            return {
                isValid: !isEmpty && validResult && formatResult && allowedResult,
                activeErrorType: errorType
            };
        };

        this.isPostCodeValid = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = checkPostCode(field.val()),
                errorType;

            if (!isEmpty) {
                errorType = validResult ? '' : 'invalid';
            } else {
                errorType = 'required';
            }

            return {
                isValid: !isEmpty && validResult,
                activeErrorType: errorType
            };
        };

        this.isSelectChosen = function (field) {

            var validResult = true,
                errorType;

            if ($(field).val() === null) {
                validResult = false;
            } else if (field.val().length === 0) {
                validResult = false;
            }

            return {
                isValid: validResult,
                activeErrorType: validResult ? '' : 'required'
            };
        };

        this.isCheckboxTicked = function (field) {

            var validResult = field.is(':checked'),
                errorType;

            return {
                isValid: validResult,
                activeErrorType: validResult ? '' : 'required'
            };
        };

        this.getErrorMessage = function (field, errorType) {

            var fieldData = field.data(),
                errorMessageType = this.settings.errorTypes[errorType];

            if (fieldData[errorMessageType] !== undefined) {
                return fieldData[errorMessageType];
            } else {
                return this.settings.fieldTypes[field.data().fieldType][errorMessageType];
            }
        };

        this.setActiveErrorMessageFor = function(field, fieldType, errorType) {
            this.settings.fieldTypes[fieldType].activeErrorMessage = this.getErrorMessage(field, errorType);
        };

        this.showErrorFor = function (field) {

            if (this.settings.enableErrorMessages) {

                var errorMessage = this.settings.fieldTypes[field.data().fieldType].activeErrorMessage;

                if(errorMessage) {

                    if (field.siblings('.form-error').length) {
                        updateErrorContainer(field, errorMessage);
                    } else {
                        var errorContainer = createErrorContainer(field, errorMessage);
                        var errorContainerWidth = getErrorContainerWidth(field);
                        positionErrorContainer(errorContainer, errorContainerWidth, field);
                    }
                } else {
                    this.hideErrorFor(field);
                }
            }

            field.addClass('invalid');
            field.trigger(self.FIELD_INVALIDATED);
        };

        this.hideErrorFor = function (field) {
            field.removeClass('invalid');
            field.siblings('.form-error').remove();

            field.trigger(self.FIELD_VALIDATED);
        };

        var isBetween = function (val, min, max) {
            return (val >= min && val <= max);
        };

        var createErrorContainer = function (field, errorMessage) {
            return '<div class="form-error">' + errorMessage + '</div>';
        };

        var positionErrorContainer = function(errorContainer, errorContainerWidth, field) {
            field.parent().append(errorContainer);
            field.siblings('.form-error').css('width', errorContainerWidth + 'px').css('margin-left', field.position().left + 'px');
        };

        var updateErrorContainer = function (field, errorMessage) {
            field.siblings('.form-error').text(errorMessage);
        };

        var getErrorContainerWidth = function (field) {

            if (field.attr('aria-hidden') === undefined && field.is(':visible')) {
                return field.outerWidth();
            } else {
                return Math.max.apply(Math, field.parent().children().map(function () {
                    return $(this).width();
                }).get());
            }
        };

        var addCallbacks= function(settings) {

            var fieldTypes = settings.fieldTypes;

            $.map(fieldTypes, function(field, fieldType) {
                if(fieldTypes[fieldType].callbacks === undefined) {
                    fieldTypes[fieldType].callbacks = {
                        onValidated: function (event) {},
                        onInvalidated: function (event) {}
                    };
                } else {
                    if(fieldTypes[fieldType].callbacks.onValidated === undefined) {
                        fieldTypes[fieldType].callbacks.onValidated = function (event) {};
                    } else if(fieldTypes[fieldType].callbacks.onInvalidated === undefined) {
                        fieldTypes[fieldType].callbacks.onInvalidated = function (event) {};
                    }
                }
            });
        };
    };

    $.fn.isValid = function (options) {

        return this.each(function () {

            var isValid = new $.isValid(this, options);
            $(this).data('isValid', isValid);

            isValid.init();

            isValid.settings.submitButton.click(function (e) {

                isValid.formArray.each(function (index, field) {

                    if (!isValid.isValidField($(field))) {
                        isValid.showErrorFor($(field));
                    } else {
                        isValid.hideErrorFor($(field));
                    }

                    isValid.isFormValid = isValid.isFormValidated();

                    if (!isValid.isFormValid) {
                        e.preventDefault();
                    }
                });
            });

            isValid.formArray.each(function (index, field) {

                if (isValid.settings.validateOnBlur) {
                    $(field).on('blur change', function () {

                        if (!isValid.isValidField($(field))) {
                            isValid.showErrorFor($(field));
                        } else {
                            isValid.hideErrorFor($(field));
                        }
                    });
                }

                $(field).on(isValid.FIELD_INVALIDATED, function (event) {

                    var eventObject = {
                        isValid: false,
                        fieldElement: $(event.currentTarget),
                        fieldData: $(event.currentTarget).data()
                    };

                    isValid.settings.fieldTypes[$(field).data().fieldType].callbacks.onInvalidated(eventObject);
                });

                $(field).on(isValid.FIELD_VALIDATED, function (event) {

                    var eventObject = {
                        isValid: true,
                        fieldElement: $(event.currentTarget),
                        fieldData: $(event.currentTarget).data()
                    };

                    isValid.settings.fieldTypes[$(field).data().fieldType].callbacks.onValidated(eventObject);
                });

            });
        });
    };

    $.isValid.defaults = {
        fieldTypes: {
            general: {
                requiredErrorMessage: 'Field is required',
                callbacks: {
                    onValidated: function (event) {},
                    onInvalidated: function (event) {}
                }
            },
            letters: {
                requiredErrorMessage: 'Field is required',
                invalidErrorMessage: 'Field is letters only',
                callbacks: {
                    onValidated: function (event) {},
                    onInvalidated: function (event) {}
                }
            },
            numbers: {
                requiredErrorMessage: 'Field is required',
                invalidErrorMessage: 'Field is numbers only',
                callbacks: {
                    onValidated: function (event) {},
                    onInvalidated: function (event) {}
                }
            },
            age: {
                requiredErrorMessage: 'Field is required',
                invalidErrorMessage: 'Age is invalid',
                callbacks: {
                    onValidated: function (event) {},
                    onInvalidated: function (event) {}
                }
            },
            decimals: {
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
                requiredErrorMessage: 'Password is required',
                formatErrorMessage: 'Password should contain numbers and letters',
                invalidErrorMessage: 'Password should be more than 6 characters',
                callbacks: {
                    onValidated: function (event) {},
                    onInvalidated: function (event) {}
                }
            },
            passwordConfirm: {
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
                requiredErrorMessage: 'Email is required',
                domainErrorMessage: 'Email domain should be @xxxx.com',
                invalidErrorMessage: 'Please enter a valid email address',
                callbacks: {
                    onValidated: function (event) {},
                    onInvalidated: function (event) {}
                }
            },
            emailConfirm: {
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
                requiredErrorMessage: 'Post Code is required',
                invalidErrorMessage: 'Please enter a valid Post Code',
                callbacks: {
                    onValidated: function (event) {},
                    onInvalidated: function (event) {}
                }
            },
            select: {
                requiredErrorMessage: 'Choosing an option is required',
                callbacks: {
                    onValidated: function (event) {},
                    onInvalidated: function (event) {}
                }
            },
            checkbox: {
                requiredErrorMessage: 'Checkbox is required',
                callbacks: {
                    onValidated: function (event) {},
                    onInvalidated: function (event) {}
                }
            }
        },
        validateOnBlur: true,
        enableErrorMessages: true,
        submitButton: null,
        errorTypes: {
            required: 'requiredErrorMessage',
            invalid: 'invalidErrorMessage',
            format: 'formatErrorMessage',
            domain: 'domainErrorMessage',
            allowedDate: 'allowedDateErrorMessage',
        },
        validators: {
            general: {
                name: 'isGeneralValid',
                method: $.isValid.isGeneralValid
            },
            password: {
                name: 'isPasswordValid',
                method: function() {}
            },
            passwordConfirm: {
                name: 'isPasswordConfirmValid',
                method: function() {}
            },
            email: {
                name: 'isEmailValid',
                method: function () {}
            },
            emailConfirm: {
                name: 'isEmailConfirmValid',
                method: function() {}
            },
            date: {
                name: 'isDateValid',
                method: function() {}
            },
            letters: {
                name: 'isLetters',
                method: function() {}
            },
            numbers: {
                name: 'isNumbers',
                method: function () {}
            },
            age: {
                name: 'isAgeValid',
                method: function() {}
            },
            decimals: {
                name: 'isDecimals',
                method: function() {}
            },
            postCode: {
                name: 'isPostCodeValid',
                method: function() {}
            },
            checkbox: {
                name: 'isCheckboxTicked',
                method: function() {}
            },
            select: {
                name: 'isSelectChosen',
                method: function() {}
            }
        },
        onFormValidated: function () {},
        onFormInvalidated: function () {},
    };

})(jQuery);
