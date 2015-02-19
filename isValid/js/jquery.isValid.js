(function ($) {
    "use strict";

    $.isValid = function (element, options) {

        // To do
        // Look into similar changes to error message creation and display similar to the new way of calling the valid methods

        var defaults = {
                username: {
                    minLength: 6,
                    maxLength: 12,
                    showLengthError: true,
                    lengthErrorMessage: "Username must be be at least 6 characters and no more than 12 characters.",
                },
                password: {
                    minLength: 6,
                    maxLength: 20,
                    numbers: true,
                    letters: true,
                    showLengthError: true,
                    lengthErrorMessage: "Password must be at least 6 characters and no more than 20 characters.",
                    showInvalidError: true,
                    invalidErrorMessage: "Password must contain letters and numbers.",
                    passwordConfirm: true
                },
                passwordConfirm: {
                    showInvalidError: true,
                    invalidErrorMessage: "Passwords do not match."
                },
                email: {
                    domain: '',
                    showInvalidError: true,
                    invalidErrorMessage: "Email is an invalid email address.",
                    showDomainError: false,
                    domainErrorMessage: "Email domain entered is invalid, only @xxxx.xxx is accepted.",
                    emailConfirm: true
                },
                emailConfirm: {
                    showInvalidError: true,
                    invalidErrorMessage: "Emails do not match."
                },
                letters: {
                    showInvalidError: true,
                    invalidErrorMessage: "Field is letters only."
                },
                numbers: {
                    showInvalidError: true,
                    invalidErrorMessage: "Field is numbers only."
                },
                date: {
                    showInvalidError: true,
                    invalidErrorMessage: "Please enter a valid Date.",
                    showFormatError: true,
                    formatErrorMessage: "Please enter Date format as DD/MM/YYYY as specified in the placeholder."
                },
                postcode: {
                    showInvalidError: true,
                    invalidErrorMessage: "Not a valid Post Code."
                },
                mobile: {
                    showInvalidError: true,
                    numberLength: 11,
                    invalidErrorMessage: "Invalid mobile number."
                },
                checkbox: {
                    showInvalidError: true,
                    invalidErrorMessage: "Checkbox must be checked."
                },
                select: {
                    showInvalidError: true,
                    invalidErrorMessage: "Please choose an item from the dropdown."
                },
                turnOffErrors: false,
                onFormValidated: function () {},
                onFormInValidated: function () {}
            },
            self;

        self = this, this.options;

        this.init = function () {

            var obj = this;

            this.elem = element;
            this.$elem = $(element);
            this.isFormValid = false;
            this.isValid = false;
            this.formID = "#" + this.$elem.attr('id');
            this.formIDStr = this.$elem.attr('id');

            this.options = $.extend(true, defaults, options);

            showErrors(this.options.turnOffErrors);

            this.formArray = $(this.formID + ' :input[type="text"],' + this.formID + ' :input[type="email"],' + this.formID + ' :input[type="password"],' + this.formID + ' :input[type="tel"],' + this.formID + ' :input[type="number"],' + this.formID + ' :input[type="date"],' + this.formID + ' :input[type="checkbox"],' + this.formID + ' textarea,' + this.formID + ' select');

            this.formArray.each(function (index, field) {
                self.createErrorMessage(obj, field);
            });

            return this;
        };

        this.isFormValidated = function () {
            return ($(this.formID + ' .invalid').length) ? false : true;
        };

        this.isValidField = function (field) {

            if (field.disabled || $(field).attr('data-field-info') === "notrequired") {
                this.isValid = true;
            } else {
                var data = changeToLowercase(field);
                var valMethodName;

                switch (data) {
                    case 'username':
                        valMethodName = "isUsernameValid";
                        break;

                    case 'password':
                        valMethodName = "isPasswordValid";
                        break;

                    case 'passwordconfirm':
                        valMethodName = "isPasswordConfirmValid";
                        break;

                    case 'email':
                        valMethodName = "isEmailValid";
                        break;

                    case 'emailconfirm':
                        valMethodName = "isEmailConfirmValid";
                        break;

                    case 'date':
                        valMethodName = "isDateValid";
                        break;

                    case 'letters':
                        valMethodName = "isLetters";
                        break;

                    case 'numbers':
                        valMethodName = "isNumbers";
                        break;

                    case 'postcode':
                        valMethodName = "isPostCodeValid";
                        break;

                    case 'mobile':
                        valMethodName = "isMobileValid";
                        break;

                    case 'checkbox':
                        valMethodName = "isCheckboxTicked"
                        break;

                    case 'select':
                        valMethodName = "isSelectChosen"
                        break;

                    default:
                        valMethodName = "isEmpty";
                }

                this.isValid = completeAction(this, (this[valMethodName](field)), field);
            }

            return this.isValid;
        };

        this.isEmpty = function (field) {
            return ($(field).val().length);
        };

        this.isLetters = function (field) {
            var letterMatcher = /^[A-Za-z ]+$/;

            var matchResult = letterMatcher.test($(field).val());
            this.options.letters.showInvalidError = (matchResult) ? false : true;

            return matchResult;
        };

        this.isNumbers = function (field) {
            var numberMatcher = /^\d+$/;

            var matchResult = numberMatcher.test($(field).val());
            this.options.numbers.showInvalidError = (matchResult) ? false : true;

            return matchResult;
        };

        this.isUsernameValid = function (field) {
            var lengthResult = isBetween($(field).val().length, this.options.username.minLength, this.options.username.maxLength);

            this.options.username.showLengthError = (lengthResult) ? false : true;

            return lengthResult;
        };

        this.isPasswordValid = function (field) {
            var passwordMatcher = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;

            var lengthResult, matchResult;

            lengthResult = isBetween($(field).val().length, this.options.password.minLength, this.options.password.maxLength);

            this.options.password.showLengthError = (lengthResult) ? false : true;

            if (this.options.password.numbers && this.options.password.letters) {

                matchResult = (passwordMatcher.test($(field).val()));
                this.options.password.showInvalidError = (matchResult) ? false : true;
                this.isPasswordConfirmValid($("input[data-field-info='passwordconfirm']"));

                return (lengthResult) ? matchResult : false;
            }

            return lengthResult;
        };

        this.isPasswordConfirmValid = function (field) {

            if (this.options.password.passwordConfirm) {
                if ($(field).val() !== $("input[data-field-info='password']").val()) {
                    this.options.passwordConfirm.showInvalidError = true;
                    return false;
                }
                this.options.passwordConfirm.showInvalidError = false;
                return true;
            }
        };

        this.isEmailValid = function (field) {
            var emailMatcher = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

            var validResult, domainResult;

            // Remove whitespace as some phones put a spacebar in if you use the autocomplete option on the phone
            var whiteSpace = /\s/;
            var isWhiteSpace = whiteSpace.test($(field).val());
            if (isWhiteSpace) {
                $(field).val($(field).val().replace(/\s/g, ''));
            }

            validResult = emailMatcher.test($(field).val());

            this.options.email.showInvalidError = (validResult) ? false : true;

            if (this.options.email.domain !== '') {
                domainResult = ($(field).val().indexOf(this.options.email.domain, $(field).val().length - this.options.email.domain.length) !== -1);
                this.options.email.showDomainError = (domainResult) ? false : true;

                return (validResult) ? domainResult : false;
            }

            this.isEmailConfirmValid($("input[data-field-info='emailconfirm']"));

            return validResult;
        };

        this.isEmailConfirmValid = function (field) {

            if (this.options.email.emailConfirm) {
                if ($(field).val() !== $("input[data-field-info='email']").val()) {
                    this.options.emailConfirm.showInvalidError = true;
                    return false;
                }
                this.options.emailConfirm.showInvalidError = false;
                return true;
            }
        };

        this.isDateValid = function (field) {
            var date = $(field).val();
            var count = date.match(/\//g);

            var validResult, formatResult;

            if (count === null || count.length < 2) {
                formatResult = false;
                this.options.date.showFormatError = (formatResult) ? false : true;

                return formatResult;
            } else {
                var data = date.split('/');

                formatResult = true;
                this.options.date.showFormatError = (formatResult) ? false : true;

                validResult = isBetween(Date.parse(data[2] + "-" + data[1] + "-" + data[0]), 0, Date.now());
                this.options.date.showInvalidError = (validResult) ? false : true;

                return validResult;
            }
        };

        this.isPostCodeValid = function (field) {
            var isValidPostCode, postCode = checkPostCode($(field).val());

            isValidPostCode = (!postCode) ? false : true;

            this.options.postcode.showInvalidError = (isValidPostCode) ? false : true;

            return isValidPostCode;
        },

        this.isMobileValid = function (field) {
            var isNumbers = this.isNumbers(field);

            var lengthResult = $(field).val().length === this.options.mobile.numberLength;
            this.options.mobile.showInvalidError = (isNumbers && lengthResult) ? false : true;
            return isNumbers && lengthResult ? true : false;
        };

        this.isCheckboxTicked = function (field) {

            var isChecked = $(field).is(":checked");

            this.options.checkbox.showInvalidError = isChecked ? false : true;

            return isChecked;
        };
        
        this.isSelectChosen = function (field) {
        
            var isChosen = ($(field).val() !== null);  
            
            this.options.select.showInvalidError = isChosen ? false : true;
            
            return isChosen;
        };

        // Need a more effective/faster/efficient way of writing the method below
        this.createErrorMessage = function (obj, field) {

            var data = changeToLowercase(field);

            var errorID, errorMessage;

            switch (data) {

                case 'username':
                    if (obj.options.username.showLengthError) {
                        errorID = '-username-length-error';
                        errorMessage = obj.options.username.lengthErrorMessage;

                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    break;

                case 'password':
                    if (obj.options.password.showInvalidError) {
                        errorID = '-password-match-error';
                        errorMessage = obj.options.password.invalidErrorMessage;

                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }

                    if (obj.options.password.showLengthError) {
                        errorID = '-password-length-error';
                        errorMessage = obj.options.password.lengthErrorMessage;

                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    break;

                case 'passwordconfirm':
                    if (obj.options.passwordConfirm.showInvalidError) {
                        errorID = '-passwordconfirm-invalid-error';
                        errorMessage = obj.options.passwordConfirm.invalidErrorMessage;

                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    break;

                case 'email':
                    if (obj.options.email.showInvalidError) {
                        errorID = '-email-invalid-error';
                        errorMessage = obj.options.email.invalidErrorMessage;

                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }

                    if (obj.options.email.showDomainError) {
                        errorID = '-email-domain-error';
                        errorMessage = obj.options.email.domainErrorMessage;

                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    break;

                case 'emailconfirm':
                    if (obj.options.emailConfirm.showInvalidError) {
                        errorID = '-emailconfirm-invalid-error';
                        errorMessage = obj.options.emailConfirm.invalidErrorMessage;

                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    break;

                case 'letters':
                    if (obj.options.letters.showInvalidError) {
                        errorID = '-letters-match-error';
                        errorMessage = obj.options.letters.invalidErrorMessage;

                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    break;

                case 'numbers':
                    if (obj.options.numbers.showInvalidError) {
                        errorID = '-numbers-match-error';
                        errorMessage = obj.options.numbers.invalidErrorMessage;

                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    break;

                case 'date':
                    if (obj.options.date.showFormatError) {
                        errorID = '-date-format-error';
                        errorMessage = obj.options.date.formatErrorMessage;

                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }

                    if (obj.options.date.showFormatError) {
                        errorID = '-date-invalid-error';
                        errorMessage = obj.options.date.invalidErrorMessage;

                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    break;

                case 'postcode':
                    if (obj.options.postcode.showInvalidError) {
                        errorID = '-postcode-invalid-error';
                        errorMessage = obj.options.postcode.invalidErrorMessage;

                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    break;

                case 'mobile':
                    if (obj.options.mobile.showInvalidError) {
                        errorID = '-mobile-invalid-error';
                        errorMessage = obj.options.mobile.invalidErrorMessage;

                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    break;

                case 'checkbox':
                    if (obj.options.checkbox.showInvalidError) {
                        errorID = '-checkbox-invalid-error';
                        errorMessage = obj.options.checkbox.invalidErrorMessage;

                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    break;
                    
                case 'select':
                    if (obj.options.select.showInvalidError) {
                        errorID = '-select-invalid-error';
                        errorMessage = obj.options.select.invalidErrorMessage;

                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    break;
            }

            //buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
        };

        // Need a more effective/faster/efficient way of writing the method below
        this.controlErrorMessages = function (obj, field) {

            var data = changeToLowercase(field);

            var errorID, showError;

            switch (data) {

                case "username":
                    errorID = '-username-length-error';
                    showError = obj.options.username.showLengthError;
                    break;

                case "password":
                    errorMessageDisplay(obj.formID + '-password-length-error', obj.options.password.showLengthError);
                    errorMessageDisplay(obj.formID + '-password-match-error', obj.options.password.showInvalidError);

                    if (obj.options.password.passwordConfirm) {
                        errorMessageDisplay(obj.formID + '-passwordconfirm-invalid-error', obj.options.passwordConfirm.showInvalidError);
                        if (obj.options.passwordConfirm.showInvalidError) {
                            invalidAction(obj, $("input[data-field-info='passwordconfirm']"));
                        } else {
                            validAction(obj, $("input[data-field-info='passwordconfirm']"));
                        }
                    }

                    break;

                case "passwordconfirm":
                    errorMessageDisplay(obj.formID + '-passwordconfirm-invalid-error', obj.options.passwordConfirm.showInvalidError);
                    break;

                case 'email':
                    errorMessageDisplay(obj.formID + '-email-invalid-error', obj.options.email.showInvalidError);
                    errorMessageDisplay(obj.formID + '-email-domain-error', obj.options.email.showDomainError);

                    if (obj.options.email.emailConfirm) {
                        errorMessageDisplay(obj.formID + '-emailconfirm-invalid-error', obj.options.emailConfirm.showInvalidError);
                        if (obj.options.emailConfirm.showInvalidError) {
                            invalidAction(obj, $("input[data-field-info='emailconfirm']"));
                        } else {
                            validAction(obj, $("input[data-field-info='emailconfirm']"));
                        }
                    }
                    break;

                case "emailconfirm":
                    errorMessageDisplay(obj.formID + '-emailconfirm-invalid-error', obj.options.emailConfirm.showInvalidError);
                    break;

                case 'letters':
                    errorID = '-letters-match-error';
                    showError = obj.options.letters.showInvalidError;
                    break;

                case 'numbers':
                    errorID = '-numbers-match-error';
                    showError = obj.options.numbers.showInvalidError;
                    break;

                case 'date':
                    errorMessageDisplay(obj.formID + '-date-invalid-error', obj.options.date.showInvalidError);
                    errorMessageDisplay(obj.formID + '-date-format-error', obj.options.date.showFormatError);
                    break;

                case 'postcode':
                    errorID = '-postcode-invalid-error';
                    showError = obj.options.postcode.showInvalidError;
                    break;

                case 'mobile':
                    errorID = '-mobile-invalid-error';
                    showError = obj.options.mobile.showInvalidError;
                    break;

                case 'checkbox':
                    errorID = '-checkbox-invalid-error';
                    showError = obj.options.checkbox.showInvalidError;
                    break;
                    
                case 'select':
                    errorID = '-select-invalid-error';
                    showError = obj.options.select.showInvalidError;
                    break;
            }

            errorMessageDisplay(obj.formID + errorID, showError);

        };

        // Private Methods

        var changeToLowercase = function (field) {
            return ($(field).attr('data-field-info') !== undefined) ? $(field).attr('data-field-info').toLowerCase() : "";
        };

        var isBetween = function (val, min, max) {
            return (val >= min && val <= max);
        };

        var showErrors = function (show) {

            if (show) {
                this.options.username.showLengthError = false;
                this.options.password.showLengthError = false;
                this.options.password.showInvalidError = false;
                this.options.passwordConfirm.showInvalidError = false;
                this.options.email.showInvalidError = false;
                this.options.email.showDomainError = false;
                this.options.emailConfirm.showInvalidError = false;
                this.options.letters.showInvalidError = false;
                this.options.numbers.showInvalidError = false;
                this.options.date.showInvalidError = false;
                this.options.date.showFormatError = false;
                this.options.postcode.showInvalidError = false;
                this.options.mobile.showInvalidError = false;
                this.options.checkbox.showInvalidError = false;
                this.options.select.showInvalidError = false;
            }
        };

        var completeAction = function (obj, isValid, field) {
            return (isValid) ? validAction(obj, field) : invalidAction(obj, field);
        };

        var validAction = function (obj, field) {

            $(field).removeClass('invalid');

            self.controlErrorMessages(obj, field);

            return true;
        };

        var invalidAction = function (obj, field) {

            $(field).addClass('invalid');

            self.controlErrorMessages(obj, field);

            return false;
        };

        var buildErrorContainer = function (id, field, error) {
            $(field).after('<div id="' + id + '" class="form-error"></div>');
            $('#' + id).append(error);
        };

        var errorMessageDisplay = function (id, errorType) {
            (errorType) ? $(id).show() : $(id).hide();
        };

    }

    $.fn.isValid = function (options) {

        return this.each(function () {

            var newIsValid = new $.isValid(this, options);
            $(this).data('isValid', newIsValid);

            newIsValid.init();

            $(newIsValid.formID + ' :input[type="submit"]').click(function (e) {

                newIsValid.formArray.each(function (index, field) {

                    newIsValid.isValid = newIsValid.isValidField(field);
                    newIsValid.isFormValid = newIsValid.isFormValidated();

                    if (!newIsValid.isFormValid) {
                        e.preventDefault();
                    }
                });

                newIsValid.isFormValid ? newIsValid.options.onFormValidated() : newIsValid.options.onFormInValidated();
            });

            newIsValid.formArray.each(function (index, field) {
                $(field).blur(function () {
                    newIsValid.isValid = newIsValid.isValidField(field);
                });
            });

            newIsValid.$elem.find(':reset').click(function () {
                $(newIsValid.formID + ' .invalid').removeClass('invalid');
                $(newIsValid.formID + ' .form-error').hide();
                newIsValid.isFormValid = newIsValid.isFormValidated();
            });

        });
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

function checkPostCode(toCheck) {

    // Permitted letters depend upon their position in the postcode.
    var alpha1 = "[abcdefghijklmnoprstuwyz]"; // Character 1
    var alpha2 = "[abcdefghklmnopqrstuvwxy]"; // Character 2
    var alpha3 = "[abcdefghjkpmnrstuvwxy]"; // Character 3
    var alpha4 = "[abehmnprvwxy]"; // Character 4
    var alpha5 = "[abdefghjlnpqrstuwxyz]"; // Character 5
    var BFPOa5 = "[abdefghjlnpqrst]"; // BFPO alpha5
    var BFPOa6 = "[abdefghjlnpqrstuwzyz]"; // BFPO alpha6

    // Array holds the regular expressions for the valid postcodes
    var pcexp = new Array();

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
                postCode = 'AI-2640'
            };

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
}