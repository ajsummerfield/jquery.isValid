(function ($) {
    "use strict";

    $.isValid = function (element, options) {

        var self;

        this.init = function () {

            self = this;

            this.elem = element;
            this.$elem = $(element);
            this.isFieldValid = false;
            this.settings = $.extend(true, {}, $.isValid.defaults, options);
            this.formID = '#' + this.$elem.attr('id');
            this.$elem.addClass('isValid');
            this.FIELD_VALIDATED = 'isValid.fieldValidated';
            this.FIELD_INVALIDATED = 'isValid.fieldInvalidated';

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
        };

        this.isFormValidated = function () {
            return ($(' .invalid', this.formID).length) ? false : true;
        };

        this.isValidField = function (field) {

            if (field.disabled || field.attr('data-field-type') === "notrequired") {
                this.isFieldValid = true;
            } else {
                var data = field.attr('data-field-type'),
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
            return (field.val().length === 0);
        };

        this.isGeneralValid = function (field) {

            var isEmpty = this.isEmpty(field);

            if (isEmpty) {
                this.settings.fieldTypes.general.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return !isEmpty;
        };

        this.isLetters = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = /^[A-Za-z ]+$/.test(field.val());

            if (!isEmpty) {
                this.settings.fieldTypes.letters.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'invalid');
            } else {
                this.settings.fieldTypes.letters.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return !isEmpty && validResult;
        };

        this.isNumbers = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = /^[0-9 ]+$/.test(field.val());

            if (!isEmpty) {
                this.settings.fieldTypes.numbers.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'invalid');
            } else {
                this.settings.fieldTypes.numbers.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return !isEmpty && validResult;
        };

        this.isAgeValid = function(field) {

            var isEmpty = this.isEmpty(field),
                validResult = (/^[0-9 ]+$/.test(field.val())) && (field.val() > 0) && (field.val() < 150);

            if (!isEmpty) {
                this.settings.fieldTypes.age.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'invalid');
            } else {
                this.settings.fieldTypes.age.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return !isEmpty && validResult;
        };

        this.isDecimals = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = /^(\d+\.?\d*|\.\d+)$/.test(field.val());

            if (!isEmpty) {
                this.settings.fieldTypes.decimals.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'invalid');
            } else {
                this.settings.fieldTypes.decimals.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return !isEmpty && validResult;
        };

        this.isPasswordValid = function (field) {

            var passwordMatcher = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
                isEmpty,
                lengthResult,
                formatResult = true;

            isEmpty = this.isEmpty(field);

            lengthResult = isBetween(field.val().length, this.settings.fieldTypes.password.minLength, this.settings.fieldTypes.password.maxLength);

            if (this.settings.fieldTypes.password.numbers && this.settings.fieldTypes.password.letters) {
                formatResult = (passwordMatcher.test(field.val()));
            }

            if (this.settings.fieldTypes.password.passwordConfirm) {
                this.isPasswordConfirmValid($(' input[data-field-type="passwordConfirm"]', this.formID));
            }

            if (!isEmpty) {
                this.settings.fieldTypes.password.activeErrorMessage = lengthResult && !formatResult ? getErrorMessage(field, 'format') : getErrorMessage(field, 'invalid');
            } else {
                this.settings.fieldTypes.password.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return (lengthResult && !isEmpty) ? formatResult : false;
        };

        this.isPasswordConfirmValid = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = field.val() === $(' input[data-field-type="password"]', this.formID).val();

            if (!isEmpty) {
                this.settings.fieldTypes.passwordConfirm.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'invalid');
            } else {
                this.settings.fieldTypes.passwordConfirm.activeErrorMessage = getErrorMessage(field, 'required');
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
                this.settings.fieldTypes.email.activeErrorMessage = validResult && !domainResult ? getErrorMessage(field, 'domain') : getErrorMessage(field, 'invalid');
            } else {
                this.settings.fieldTypes.email.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return (validResult && !isEmpty) ? domainResult : false;
        };

        this.isEmailConfirmValid = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = field.val() === $(' input[data-field-type="email"]', this.formID).val();

            if (!isEmpty) {
                this.settings.fieldTypes.emailConfirm.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'invalid');
            } else {
                this.settings.fieldTypes.emailConfirm.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return !isEmpty && validResult;
        };

        this.isDateValid = function (field) {

            var date = field.val(),
                isEmpty,
                validResult,
                allowedResult,
                formatResult;

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
                            this.settings.fieldTypes.date.activeErrorMessage = getErrorMessage(field, 'format');
                        } else {
                            this.settings.fieldTypes.date.activeErrorMessage = getErrorMessage(field, 'invalid');
                        }

                    } else {
                        this.settings.fieldTypes.date.activeErrorMessage = getErrorMessage(field, 'invalid');
                    }
                } else {
                    if (!formatResult) {
                        this.settings.fieldTypes.date.activeErrorMessage = getErrorMessage(field, 'format');
                    } else {
                        if (!allowedResult) {
                            this.settings.fieldTypes.date.activeErrorMessage = getErrorMessage(field, 'allowedDate');
                        }
                    }
                }
            } else {
                this.settings.fieldTypes.date.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return !isEmpty && validResult && formatResult && allowedResult;
        };

        this.isPostCodeValid = function (field) {

            var isEmpty = this.isEmpty(field),
                validResult = checkPostCode(field.val());

            if (!isEmpty) {
                this.settings.fieldTypes.postCode.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'invalid');
            } else {
                this.settings.fieldTypes.postCode.activeErrorMessage = getErrorMessage(field, 'required');
            }

            return !isEmpty && validResult;
        };

        this.isSelectChosen = function (field) {

            var validResult = true;

            if ($(field).val() === null) {
                validResult = false;
            } else if (field.val().length === 0) {
                validResult = false;
            }

            this.settings.fieldTypes.select.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'required');

            return validResult;
        };

        this.isCheckboxTicked = function (field) {

            var validResult = field.is(':checked');

            this.settings.fieldTypes.checkbox.activeErrorMessage = validResult ? '' : getErrorMessage(field, 'required');

            return validResult;
        };

        this.showErrorFor = function (field) {

            if (this.settings.showErrorMessages) {
                if (field.siblings('.form-error').length) {
                    updateErrorContainer(field);
                } else {
                    var errorContainer = createErrorContainer(field);
                    var errorContainerWidth = getErrorContainerWidth(field);
                    positionErrorContainer(errorContainer, errorContainerWidth, field);
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

        var createErrorContainer = function (field) {

            var errorMessage = self.settings.fieldTypes[field.data().fieldType].activeErrorMessage;

            return '<div class="form-error">' + errorMessage + '</div>';
        };

        var positionErrorContainer = function(errorContainer, errorContainerWidth, field) {

            field.parent().append(errorContainer);
            field.siblings('.form-error').css('width', errorContainerWidth + 'px').css('margin-left', field.position().left + 'px');
        };

        var updateErrorContainer = function (field) {

            var errorMessage = self.settings.fieldTypes[field.data().fieldType].activeErrorMessage;

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

        var getErrorMessage = function (field, errorType) {

            var fieldData = field.data(),
                errorMessageType = ErrorType[errorType];

            if (fieldData[errorMessageType] !== undefined) {
                return fieldData[errorMessageType];
            } else {
                return self.settings.fieldTypes[field.data().fieldType][errorMessageType];
            }
        };

        var ErrorType = {
            'required': 'requiredErrorMessage',
            'invalid': 'invalidErrorMessage',
            'format': 'formatErrorMessage',
            'domain': 'domainErrorMessage',
            'allowedDate': 'allowedDateErrorMessage',
        };

    };

    $.fn.isValid = function (options) {

        return this.each(function () {

            var isValid = new $.isValid(this, options);
            $(this).data('isValid', isValid);

            isValid.init();

            var submitButton = $(' :input[type="submit"]', isValid.formID);

            submitButton.click(function (e) {

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
          }
        },
        validateOnBlur: true,
        showErrorMessages: true,
        onFormValidated: function () {},
        onFormInvalidated: function () {},
        validators: {}
    };

})(jQuery);
