(function ($) {
    "use strict";

    $.isValid = function (element, options) {

        var self;

        this.init = function () {

            self = this;

            this.elem = element;
            this.$elem = $(element);
            this.settings = $.extend(true, {}, $.isValid.defaults, options);
            this.formID = this.$elem.attr('id') !== '' ? '#' + this.$elem.attr('id') : '';
            this.$elem.addClass('isValid');
            this.FIELD_VALIDATED = 'isValid.fieldValidated';
            this.FIELD_INVALIDATED = 'isValid.fieldInvalidated';
            this.settings.submitButton = this.settings.submitButton !== null ? this.settings.submitButton : $(' :input[type="submit"]', this.$elem);
            this.validators = this.settings.validators;
            this.formArray =
                $(' :input[type="text"],' +
                ' :input[type="email"],' +
                ' :input[type="password"],' +
                ' :input[type="tel"],' +
                ' :input[type="number"],' +
                ' :input[type="date"],' +
                ' :input[type="checkbox"],' +
                ' textarea,' +
                ' select', this.$elem);

            addCallbacks(this.settings);
            addValidators(this.validators);
        };

        this.isFormValidated = function () {
            return ($(' .invalid', this.$elem).length) ? false : true;
        };

        this.isValidField = function (field) {

            var fieldType = field.attr('data-field-type');

            if (field.prop('disabled') || field.attr('type') === 'hidden' || fieldType === 'notrequired') {
                return true;
            } else {
                var valMethodName = 'isEmpty',
                    currentField,
                    isEmpty;

                isEmpty = this[valMethodName](field);

                if (!isEmpty) {

                    if(this.validators[fieldType].name) {
                        valMethodName = this.validators[fieldType].name;
                    }

                    if(this[valMethodName] !== undefined) {
                        currentField = this[valMethodName](field);
                    } else {
                        currentField = this.validators[fieldType].validate(field);
                    }

                    this.setActiveErrorMessageFor(field, fieldType, currentField.activeErrorType);

                    return currentField.isValid;
                }

                this.setActiveErrorMessageFor(field, fieldType, 'required');

                return !isEmpty;
            }
        };

        this.isEmpty = function (field) {

            if(field.val() === undefined) {
                return true;
            }

            if(field.val() === null) {
                return true;
            }

            return (field.val().length === 0);
        };

        this.isGeneralValid = function (field) {

            var isEmpty = self.isEmpty(field),
                errorType = isEmpty ? 'required' : '';

            return {
                isValid: !isEmpty,
                activeErrorType: errorType
            };
        };

        this.isLetters = function (field) {

            var validResult = /^[A-Za-z ]+$/.test(field.val()),
                errorType = validResult ? '' : 'invalid';

            return {
                isValid: validResult,
                activeErrorType: errorType
            };
        };

        this.isNumbers = function (field) {

            var validResult = /^[0-9 ]+$/.test(field.val()),
                errorType = validResult ? '' : 'invalid';

            return {
                isValid: validResult,
                activeErrorType: errorType
            };
        };

        this.isAgeValid = function(field) {

            var validResult = (/^[0-9 ]+$/.test(field.val())) && (field.val() > 0) && (field.val() < 150),
                errorType = validResult ? '' : 'invalid';

            return {
                isValid: validResult,
                activeErrorType: errorType
            };
        };

        this.isDecimals = function (field) {

            var validResult = /^(\d+\.?\d*|\.\d+)$/.test(field.val()),
                errorType = validResult ? '' : 'invalid';

            return {
                isValid: validResult,
                activeErrorType: errorType
            };
        };

        this.isPasswordValid = function (field) {

            var passwordMatcher = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
                lengthResult,
                formatResult = true,
                errorType;

            lengthResult = isBetween(field.val().length, this.settings.fieldTypes.password.minLength, this.settings.fieldTypes.password.maxLength);

            if (this.settings.fieldTypes.password.numbers && this.settings.fieldTypes.password.letters) {
                formatResult = passwordMatcher.test(field.val());
            }

            errorType = lengthResult && !formatResult ? 'format' : 'invalid';

            return {
                isValid: lengthResult ? formatResult : false,
                activeErrorType: errorType
            };
        };

        this.isPasswordConfirmValid = function (field) {

            var validResult = field.val() === $(' input[data-field-type="password"]', this.$elem).val(),
                errorType = validResult ? '' : 'invalid';

            return {
                isValid: validResult,
                activeErrorType: errorType
            };
        };

        this.isEmailValid = function (field) {

            var emailMatcher = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                validResult,
                domainResult = true,
                errorType;

            // Remove whitespace as some mobiles/tablets put a spacebar in if you use the autocomplete option on the device
            field.val(field.val().replace(/\s/g, ''));

            validResult = emailMatcher.test(field.val());

            if (this.settings.fieldTypes.email.domain !== '') {
                var regExp = new RegExp('@' + this.settings.fieldTypes.email.domain + '$', 'g');
                domainResult = regExp.test(field.val());
            }

            errorType = validResult && !domainResult ? 'domain' : 'invalid';

            return {
                isValid: validResult ? domainResult : false,
                activeErrorType: errorType
            };
        };

        this.isEmailConfirmValid = function (field) {

            var validResult = field.val() === $(' input[data-field-type="email"]', this.$elem).val(),
                errorType = validResult ? '' : 'invalid';

            return {
                isValid: validResult,
                activeErrorType: errorType
            };
        };

        this.isDateValid = function (field) {

            var date = field.val(),
                validResult,
                allowedResult,
                formatResult,
                errorType;

            var momentObject = new moment(date, this.settings.fieldTypes.date.format, true); // jshint ignore:line

            validResult = momentObject.isValid();
            formatResult = (momentObject._pf.charsLeftOver === 0);

            if (!this.settings.fieldTypes.date.allowFutureDates) {

                if (validResult) {
                    allowedResult = isBetween(Date.parse(momentObject._d), 0, Date.now());
                }
            }

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

            return {
                isValid: validResult && formatResult && allowedResult,
                activeErrorType: errorType
            };
        };

        this.isPostCodeValid = function (field) {

            var validResult = checkPostCode(field.val()),
                errorType = validResult ? '' : 'invalid';

            return {
                isValid: validResult,
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
            
            for(var i = 0; i < field.children().length; i++) {
                if($(field.children()[i]).attr('selected') === undefined) {
                    validResult = false;
                } else {
                    validResult = true;
                    break;
                }
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

        var addCallbacks = function(settings) {

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

        var addValidators = function(validators) {

          $.map(validators, function(validator, fieldType) {
              var methodName = validators[fieldType].name;
              if(validators[fieldType].validate === undefined) {
                  validators[fieldType].validate = self[methodName];
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
                    
                    var fieldType = $(field).data().fieldType;
                    
                    if (fieldType !== "notrequired") {
                        isValid.settings.fieldTypes[$(field).data().fieldType].callbacks.onInvalidated(eventObject);
                    }
                });

                $(field).on(isValid.FIELD_VALIDATED, function (event) {

                    var eventObject = {
                        isValid: true,
                        fieldElement: $(event.currentTarget),
                        fieldData: $(event.currentTarget).data()
                    };

                    var fieldType = $(field).data().fieldType;

                    if (fieldType !== "notrequired") {
                        isValid.settings.fieldTypes[$(field).data().fieldType].callbacks.onValidated(eventObject);
                    }
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
                name: 'isGeneralValid'
            },
            password: {
                name: 'isPasswordValid'
            },
            passwordConfirm: {
                name: 'isPasswordConfirmValid'
            },
            email: {
                name: 'isEmailValid'
            },
            emailConfirm: {
                name: 'isEmailConfirmValid'
            },
            date: {
                name: 'isDateValid'
            },
            letters: {
                name: 'isLetters'
            },
            numbers: {
                name: 'isNumbers'
            },
            age: {
                name: 'isAgeValid'
            },
            decimals: {
                name: 'isDecimals'
            },
            postCode: {
                name: 'isPostCodeValid'
            },
            select: {
                name: 'isSelectChosen'
            },
            checkbox: {
                name: 'isCheckboxTicked'
            }
        },
        onFormValidated: function () {},
        onFormInvalidated: function () {},
    };

})(jQuery);

/*==================================================================================================

Application:   Utility Function
Author:        John Gardner

Version:       V1.0
Date:          18th November 2003
Description:   Used to check the validity of a UK postcode

Version:       V2.0
Date:          8th March 2005
Description:   BFPO postcodes implemented.
               The rules concerning which alphabetic characters are allowed in which part of the 
               postcode were more stringently implementd.

Version:       V3.0
Date:          8th August 2005
Description:   Support for Overseas Territories added                 

Version:       V3.1
Date:          23rd March 2008
Description:   Problem corrected whereby valid postcode not returned, and 'BD23 DX' was invalidly 
               treated as 'BD2 3DX' (thanks Peter Graves)        

Version:       V4.0
Date:          7th October 2009
Description:   Character 3 extended to allow 'pmnrvxy' (thanks to Jaco de Groot)  

Version:       V4.1
               8th September 2011
               Support for Anguilla overseas territory added    

Version:       V5.0
Date:          8th November 2012
               Specific support added for new BFPO postcodes           

Parameters:    toCheck - postcodeto be checked. 

This function checks the value of the parameter for a valid postcode format. The space between the 
inward part and the outward part is optional, although is inserted if not there as it is part of the 
official postcode.

If the postcode is found to be in a valid format, the function returns the postcode properly 
formatted (in capitals with the outward code and the inward code separated by a space. If the 
postcode is deemed to be incorrect a value of false is returned.

Example call:

  if (checkPostCode (myPostCode)) {
    alert ("Postcode has a valid format")
  } 
  else {alert ("Postcode has invalid format")};

--------------------------------------------------------------------------------------------------*/

var checkPostCode = function(toCheck) {

    // Permitted letters depend upon their position in the postcode.
    var alpha1 = "[abcdefghijklmnoprstuwyz]"; // Character 1
    var alpha2 = "[abcdefghklmnopqrstuvwxy]"; // Character 2
    var alpha3 = "[abcdefghjkpmnrstuvwxy]"; // Character 3
    var alpha4 = "[abehmnprvwxy]"; // Character 4
    var alpha5 = "[abdefghjlnpqrstuwxyz]"; // Character 5
    var BFPOa5 = "[abdefghjlnpqrst]"; // BFPO alpha5
    var BFPOa6 = "[abdefghjlnpqrstuwzyz]"; // BFPO alpha6

    // Array holds the regular expressions for the valid postcodes
    var pcexp = [];

    // BFPO postcodes
    pcexp.push(new RegExp("^(bf1)(\\s*)([0-6]{1}" + BFPOa5 + "{1}" + BFPOa6 + "{1})$", "i"));

    // Expression for postcodes: AN NAA, ANN NAA, AAN NAA, and AANN NAA
    pcexp.push(new RegExp("^(" + alpha1 + "{1}" + alpha2 + "?[0-9]{1,2})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));

    // Expression for postcodes: ANA NAA
    pcexp.push(new RegExp("^(" + alpha1 + "{1}[0-9]{1}" + alpha3 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));

    // Expression for postcodes: AANA  NAA
    pcexp.push(new RegExp("^(" + alpha1 + "{1}" + alpha2 + "{1}" + "?[0-9]{1}" + alpha4 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));

    // Exception for the special postcode GIR 0AA
    pcexp.push(/^(GIR)(\s*)(0AA)$/i);

    // Standard BFPO numbers
    pcexp.push(/^(bfpo)(\s*)([0-9]{1,4})$/i);

    // c/o BFPO numbers
    pcexp.push(/^(bfpo)(\s*)(c\/o\s*[0-9]{1,3})$/i);

    // Overseas Territories
    pcexp.push(/^([A-Z]{4})(\s*)(1ZZ)$/i);

    // Anguilla
    pcexp.push(/^(ai-2640)$/i);

    // Load up the string to check
    var postCode = toCheck;

    // Assume we're not going to find a valid postcode
    var valid = false;

    // Check the string against the types of post codes
    for (var i = 0; i < pcexp.length; i++) {

        if (pcexp[i].test(postCode)) {

            // The post code is valid - split the post code into component parts
            pcexp[i].exec(postCode);

            // Copy it back into the original string, converting it to uppercase and inserting a space 
            // between the inward and outward codes
            postCode = RegExp.$1.toUpperCase() + " " + RegExp.$3.toUpperCase();

            // If it is a BFPO c/o type postcode, tidy up the "c/o" part
            postCode = postCode.replace(/C\/O\s*/, "c/o ");

            // If it is the Anguilla overseas territory postcode, we need to treat it specially
            if (toCheck.toUpperCase() == 'AI-2640') {
                postCode = 'AI-2640';
            }

            // Load new postcode back into the form element
            valid = true;

            // Remember that we have found that the code is valid and break from loop
            break;
        }
    }

    // Return with either the reformatted valid postcode or the original invalid postcode
    if (valid) {
        return postCode;
    } else return false;
};