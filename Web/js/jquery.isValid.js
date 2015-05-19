(function ($) {
    "use strict";

    $.isValid = function (element, options) {

        var defaults = {
            general: {
                minLength: 1,
                maxLength: 0,
                showLengthError: true,
                errorDetails: [
                    {
                        id: "-general-length-error",
                        type: "length",
                        message: "Must be be at least 1 character and no more than x characters."
                    }
                ]
            },
            password: {
                minLength: 6,
                maxLength: 100,
                numbers: false,
                letters: true,
                showLengthError: true,
                showInvalidError: false,
                passwordconfirm: true,
                errorDetails: [
                    {
                        id: "-password-length-error",
                        type: "length",
                        message: "Password must be at least 6 characters",
                        show: true
                    },
                    {
                        id: "-password-invalid-error",
                        type: "invalid",
                        message: "Password must contain letters and numbers.",
                        show: false
                    }
                ]
            },
            passwordconfirm: {
                showInvalidError: true,
                errorDetails: [
                    {
                        id: "-passwordconfirm-invalid-error",
                        type: "invalid",
                        message: "Passwords do not match.",
                        show: true
                    }
                ]
            },
            email: {
                domain: '',
                showInvalidError: true,
                showDomainError: false,
                emailconfirm: true,
                errorDetails: [
                    {
                        id: "-email-invalid-error",
                        type: "invalid",
                        message: "Email is an invalid email address.",
                        show: true
                    },
                    {
                        id: "-email-domain-error",
                        type: "domain",
                        message: "Email domain entered is invalid, only @xxxx.xxx is accepted.",
                        show: false
                    }
                ]
            },
            emailconfirm: {
                showInvalidError: true,
                errorDetails: [
                    {
                        id: "-emailconfirm-invalid-error",
                        type: "invalid",
                        message: "Emails do not match.",
                        show: true
                    }
                ]
            },
            letters: {
                showInvalidError: true,
                errorDetails: [
                    {
                        id: "-letters-invalid-error",
                        type: "invalid",
                        message: "Field is letters characters only.",
                        show: true
                    }
                ]
            },
            numbers: {
                showInvalidError: true,
                errorDetails: [
                    {
                        id: "-numbers-invalid-error",
                        type: "invalid",
                        message: "Field is numbers only.",
                        show: true
                    }
                ]
            },
            decimals: {
                showInvalidError: true,
                errorDetails: [
                    {
                        id: "-decimals-invalid-error",
                        type: "invalid",
                        message: "Field is decimals only",
                        show: true
                    }
                ]
            },
            date: {
                format: "DD/MM/YYYY",
                allowFutureDates: true,
                showInvalidError: false,
                showFormatError: true,
                errorDetails: [
                    {
                        id: "-date-invalid-error",
                        type: "invalid",
                        message: "Please enter a valid Date. The date specified is in the future.",
                        show: false
                    },
                    {
                        id: "-date-format-error",
                        type: "format",
                        message: "Please enter Date format as DD/MM/YYYY as specified in the placeholder.",
                        show: true
                    }
                ]
            },
            postcode: {
                showInvalidError: true,
                errorDetails: [
                    {
                        id: "-postcode-invalid-error",
                        type: "invalid",
                        message: "Not a valid Post Code.",
                        show: true
                    }
                ]
            },
            mobile: {
                showInvalidError: true,
                numberLength: 11,
                errorDetails: [
                    {
                        id: "-mobile-invalid-error",
                        type: "invalid",
                        message: "Invalid mobile number.",
                        show: true
                    }
                ]
            },
            checkbox: {
                showInvalidError: true,
                errorDetails: [
                    {
                        id: "-checkbox-invalid-error",
                        type: "invalid",
                        message: "Checkbox must be checked.",
                        show: true
                    }
                ]
            },
            select: {
                showInvalidError: true,
                errorDetails: [
                    {
                        id: "-select-invalid-error",
                        type: "invalid",
                        message: "Please choose an item from the dropdown.",
                        show: true
                    }
                ]
            },
            submitButton: null,
            turnOffErrors: false,
            onFormValidated: function () { },
            onFormInValidated: function () { }
        },
            self;

        this.init = function () {

            self = this;

            this.elem = element;
            this.$elem = $(element);
            this.isFormValid = false;
            this.isValid = false;
            this.formID = "#" + this.$elem.attr('id');
            this.formIDStr = this.$elem.attr('id');

            this.options = $.extend(true, defaults, options);

            createErrorIds();
            showErrors();

            this.formArray = $(this.formID + ' :input[type="text"],' +
                               this.formID + ' :input[type="email"],' +
                               this.formID + ' :input[type="password"],' +
                               this.formID + ' :input[type="tel"],' +
                               this.formID + ' :input[type="number"],' +
                               this.formID + ' :input[type="date"],' +
                               this.formID + ' :input[type="checkbox"],' +
                               this.formID + ' textarea,' +
                               this.formID + ' select');

            this.formArray.each(function (index, field) {
                self.createErrorMessage(field);
            });

            return this;
        };

        this.isFormValidated = function () {
            return ($(this.formID + ' .invalid').length) ? false : true;
        };

        this.resetForm = function () {
            $(this.formID + ' .invalid').removeClass('invalid');
            $(this.formID + ' .form-error').hide();
            this.isFormValid = this.isFormValidated();
        };

        this.isValidField = function (field) {

            if (field.disabled || $(field).attr('data-field-info') === "notrequired") {
                this.isValid = true;
            } else {
                var data = changeToLowercase(field);
                var valMethodName;

                switch (data) {
                    case "general":
                        valMethodName = "isGeneralValid";
                        break;

                    case "password":
                        valMethodName = "isPasswordValid";
                        break;

                    case "passwordconfirm":
                        valMethodName = "ispasswordconfirmValid";
                        break;

                    case "email":
                        valMethodName = "isEmailValid";
                        break;

                    case "emailconfirm":
                        valMethodName = "isemailconfirmValid";
                        break;

                    case "date":
                        valMethodName = "isDateValid";
                        break;

                    case "letters":
                        valMethodName = "isLetters";
                        break;

                    case "numbers":
                        valMethodName = "isNumbers";
                        break;
                    
                    case "decimals":
                        valMethodName = "isDecimals";
                        break;

                    case "postcode":
                        valMethodName = "isPostCodeValid";
                        break;

                    case "mobile":
                        valMethodName = "isMobileValid";
                        break;

                    case "checkbox":
                        valMethodName = "isCheckboxTicked";
                        break;

                    case "select":
                        valMethodName = "isSelectChosen";
                        break;

                    default:
                        valMethodName = "isNotEmpty";
                        break;
                }

                this.isValid = completeAction(this, (this[valMethodName](field)), field);
            }

            return this.isValid;
        };

        this.isNotEmpty = function (field) {
            return ($(field).val().length !== 0);
        };

        this.isLetters = function (field) {

            var letterMatcher = /^[A-Za-z ]+$/;
            var matchResult = letterMatcher.test($(field).val());
            this.options.letters.showInvalidError = !matchResult;

            return matchResult;
        };

        this.isNumbers = function (field) {

            var numberMatcher = /^[0-9 ]+$/;
            var matchResult = numberMatcher.test($(field).val());
            this.options.numbers.showInvalidError = !matchResult;

            return matchResult;
        };
        
        this.isDecimals = function (field) {

            var decimalMatcher = /^(\d+\.?\d*|\.\d+)$/;
            var matchResult = decimalMatcher.test($(field).val());
            this.options.decimals.showInvalidError = !matchResult;

            return matchResult;
        };

        this.isGeneralValid = function (field) {

            var lengthResult = false,
                showError;

            lengthResult = this.isNotEmpty(field);

            $(field).attr("data-show-error", !lengthResult);

            showError = $(field).attr("data-show-error");

            return lengthResult;
        };

        this.isPasswordValid = function (field) {

            var passwordMatcher = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
                lengthResult,
                matchResult;

            lengthResult = isBetween($(field).val().length, this.options.password.minLength, this.options.password.maxLength);

            this.options.password.showLengthError = !lengthResult;

            if (this.options.password.numbers && this.options.password.letters) {

                matchResult = (passwordMatcher.test($(field).val()));
                this.options.password.showInvalidError = !matchResult;
                this.ispasswordconfirmValid($(this.formID + " input[data-field-info='passwordconfirm']"));

                return (lengthResult) ? matchResult : false;
            }

            return lengthResult;
        };

        this.ispasswordconfirmValid = function (field) {

            if (this.options.password.passwordconfirm) {

                var matchResult = $(field).val() === $(this.formID + " input[data-field-info='password']").val();

                this.options.passwordconfirm.showInvalidError = !matchResult;

                return matchResult;
            }
        };

        this.isEmailValid = function (field) {

            var emailMatcher = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                validResult,
                domainResult;

            // Remove whitespace as some phones put a spacebar in if you use the autocomplete option on the phone
            var whiteSpace = /\s/;
            var isWhiteSpace = whiteSpace.test($(field).val());
            if (isWhiteSpace) {
                $(field).val($(field).val().replace(/\s/g, ''));
            }

            validResult = emailMatcher.test($(field).val());

            this.options.email.showInvalidError = !validResult;

            if (this.options.email.domain !== '') {
                domainResult = ($(field).val().indexOf(this.options.email.domain, $(field).val().length - this.options.email.domain.length) !== -1);
                this.options.email.showDomainError = !domainResult;

                return (validResult) ? domainResult : false;
            }

            this.isemailconfirmValid($(this.formID + " input[data-field-info='emailconfirm']"));

            return validResult;
        };

        this.isemailconfirmValid = function (field) {

            if (this.options.email.emailconfirm) {

                var matchResult = $(field).val() === $(this.formID + " input[data-field-info='email']").val();

                this.options.emailconfirm.showInvalidError = !matchResult;

                return matchResult;
            }
        };

        this.isDateValid = function (field) {

            var date = $(field).val(),
                validResult,
                formatResult;

            var momentObject = new moment(date, this.options.date.format, true);

            formatResult = momentObject.isValid();

            this.options.date.showFormatError = !formatResult;

            if (!this.options.date.allowFutureDates) {

                validResult = isBetween(Date.parse(momentObject._d), 0, Date.now());
                this.options.date.showInvalidError = !validResult;

                return formatResult ? validResult : false;
            }

            return formatResult;
        };

        this.isPostCodeValid = function (field) {

            var validResult,
                postCode = checkPostCode($(field).val());

            validResult = !postCode ? false : true;

            this.options.postcode.showInvalidError = !validResult;

            return validResult;
        },

            this.isMobileValid = function (field) {

                var isNumbers = this.isNumbers(field),
                    lengthResult = $(field).val().length === this.options.mobile.numberLength;

                this.options.mobile.showInvalidError = !(isNumbers && lengthResult);
                return isNumbers && lengthResult;
            };

        this.isCheckboxTicked = function (field) {

            var isChecked = $(field).is(":checked");

            this.options.checkbox.showInvalidError = !isChecked;

            return isChecked;
        };

        this.isSelectChosen = function (field) {

            var isChosen = ($(field).val() !== null);

            this.options.select.showInvalidError = !isChosen;

            return isChosen;
        };

        this.createErrorMessage = function (field) {

            var data = changeToLowercase(field);

            if (data !== "" && data !== "notrequired") {
                collectErrorInformation(field, self.options[data].errorDetails);
            }
        };

        this.controlErrorMessages = function (field) {

            var data = changeToLowercase(field);

            if (data !== "" && data !== "notrequired") {
                errorMessageDisplay(field, self.options[data].errorDetails);
            }
        };

        // Private Methods

        var changeToLowercase = function (field) {
            return ($(field).attr('data-field-info') !== undefined) ? $(field).attr('data-field-info').toLowerCase() : "";
        };

        var isBetween = function (val, min, max) {
            return (val >= min && val <= max);
        };

        var showErrors = function () {

            if (self.options.turnOffErrors) {

                for (var option in self.options) {

                    for (var property in self.options[option]) {

                        if (self.options[option].hasOwnProperty(property) && /show/.test(property)) {
                            self.options[option][property] = false;
                        }
                    }
                }
            }
        };

        var createErrorIds = function () {

            for (var option in self.options) {

                if (self.options[option].hasOwnProperty("errorDetails")) {

                    self.options[option].errorDetails.forEach(function (errorProperty, index) {

                        for (var property in errorProperty) {

                            if (property === "id") {
                                errorProperty[property] = self.formIDStr + errorProperty[property];
                            }
                        }
                    });
                }
            }
        };

        var completeAction = function (self, isValid, field) {
            return (isValid) ? validAction(self, field) : invalidAction(self, field);
        };

        var validAction = function (self, field) {

            $(field).removeClass('invalid');

            self.controlErrorMessages(field);

            return true;
        };

        var invalidAction = function (self, field) {

            $(field).addClass('invalid');

            self.controlErrorMessages(field);

            return false;
        };

        var collectErrorInformation = function (field, errorDetails) {

            var errorID = $(field).attr("data-error-container");

            errorDetails.forEach(function (errorProperty, index) {

                if (errorID === errorProperty.id) {
                    buildErrorContainer(errorProperty.id, field, errorProperty.message);
                }

                if (errorID === undefined && errorProperty.show) {
                    buildErrorContainer(errorProperty.id, field, errorProperty.message);
                }
            });
        };

        var buildErrorContainer = function (id, field, error) {
            $(field).after('<div id="' + id + '" class="form-error"></div>');
            $('#' + id).append(error);
        };

        var errorMessageDisplay = function (field, errorDetails, type) {

            var errorID = $(field).attr("data-error-container"),
                show = $(field).attr("data-show-error") || $(field).hasClass("invalid");

            errorDetails.forEach(function (errorProperty, index) {

                if (errorID === errorProperty.id) {
                    (show === "true") ? $("#" + errorProperty.id).show() : $("#" + errorProperty.id).hide();
                }

                if (errorID === undefined) {
                    (show) ? $("#" + errorProperty.id).show() : $("#" + errorProperty.id).hide();
                }
            });
        };
    }

    $.fn.isValid = function (options) {

        return this.each(function () {

            var newIsValid = new $.isValid(this, options);
            $(this).data('isValid', newIsValid);

            newIsValid.init();

            if (newIsValid.options.submitButton === null) {
                $(newIsValid.formID + ' :input[type="submit"]').click(function(e) {

                    newIsValid.formArray.each(function(index, field) {

                        newIsValid.isValid = newIsValid.isValidField(field);
                        newIsValid.isFormValid = newIsValid.isFormValidated();

                        if (!newIsValid.isFormValid) {
                            e.preventDefault();
                        }
                    });

                    newIsValid.isFormValid ? newIsValid.options.onFormValidated() : newIsValid.options.onFormInValidated();
                });
            } else {
                newIsValid.options.submitButton.click(function (e) {

                    newIsValid.formArray.each(function (index, field) {

                        newIsValid.isValid = newIsValid.isValidField(field);
                        newIsValid.isFormValid = newIsValid.isFormValidated();

                        if (!newIsValid.isFormValid) {
                            e.preventDefault();
                        }
                    });

                    newIsValid.isFormValid ? newIsValid.options.onFormValidated() : newIsValid.options.onFormInValidated();
                });
            }

            newIsValid.formArray.each(function (index, field) {
                $(field).blur(function () {
                    newIsValid.isValid = newIsValid.isValidField(field);
                });
            });

            newIsValid.$elem.find(':reset').click(function () {
                newIsValid.resetForm();
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
}