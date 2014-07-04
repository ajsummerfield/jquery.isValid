(function ($) {
    "use strict";

    $.isValid = function (element, options) {
    
        // To do
        // Add extra error messages in and make changes to min and max
        // Look into similar changes to error message creation and display similar to the new way of calling the valid methods
        
        var defaults = {
            username: {
                minLength: 6,
                maxLength: 12,
                showLengthError: true,
                lengthErrorMessage: "Username must be be at least 6 character long.",
                showMaxLengthError: true,
                maxLengthErrorMessage: "Username must be no more than 12 characters long."
            },
            password: {
                minLength: 6,
                maxLength: 20,
                numbers: true,
                letters: true,
                showLengthError: true,
                lengthErrorMessage: "Password must be at least 6 characters long.",
                showMaxLengthError: true,
                maxLengthErrorMessage: "Username must be no more than 20 characters long.",
                showMatchError: true,
                matchErrorMessage: "Password must contain letters and numbers."
            },
            email: {
                domain: '',
                showInvalidError: true,
                invalidErrorMessage: "Email is an invalid email address.",
                showDomainError: false,
                domainErrorMessage: "Email domain entered is invalid, only @xxxx.xxx is accepted."
            },
            letters: {
                showMatchError: true,
                matchErrorMessage: "Field is letters only."
            },
            numbers: {
                showMatchError: true,
                matchErrorMessage: "Field is numbers only."
            },
            dateofbirth: {
                showInvalidError: true,
                invalidErrorMessage: "Please enter a valid Date.",
                showFormatError: true,
                formatErrorMessage: "Please enter Date format as DD/MM/YYYY as specified in the placeholder."
            },
            postcode: {
                showInvalidError: true,
                invalidErrorMessage: "Not a valid Post Code."
            },
            onFormValidated: function () {}
        };
            
        self = this, this.options;
        
        this.init = function() {
            
            this.elem = element;
            this.$elem = $(element);
            this.isFormValid = false;
            this.isValid = false;
            this.formID = "#" + this.$elem.attr('id');
            
            this.options = $.extend(true, defaults, options);
            
            this.formArray = $(this.formID + ' :input[type="text"],' + this.formID + ' :input[type="password"],' + this.formID + ' :input[type="tel"],' + this.formID + ' textarea,' + this.formID + ' select');
            
            this.formArray.each(function (index, field) {
                self.createErrorMessage(field);
            });
            
            return this;
        },
        
        this.isFormValidated = function() {
            return ($('.invalid').length) ? false : true;
        },
  
        this.isValidField = function(field) {
            
            if (field.disabled || $(field).attr('data-field-info') === "notrequired") {
                this.isValid = true;
            } else {
                var data = changeToLowercase(field);
                var valMethodName;
                
                switch(data) {
                    case 'username':
                        valMethodName = "isUsernameValid";
                        break;
                       
                    case 'password':
                        valMethodName = "isPasswordValid";
                        break; 
                       
                    case 'email':
                        valMethodName = "isEmailValid";
                        break;
                    
                    case 'dateofbirth':
                        valMethodName = "isDateOfBirthValid";
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
                        
                    default:
                        this.isValid = completeAction((this.isEmpty(field)), field);
                }
            }
            
            this.isValid = completeAction((this[valMethodName](field)), field);
            
            return this.isValid;
        },
        
        this.isEmpty = function(field) {
            return ($(field).val().length);
        },
        
        this.isLetters = function(field) {
            var letterMatcher = /^[A-Za-z ]+$/;
            
            var matchResult = letterMatcher.test($(field).val());
            this.options.letters.showMatchError = (matchResult) ? false : true;
            
            return matchResult;
        },
        
        this.isNumbers = function(field) {
            var numberMatcher = /^[+-]?[0-9]{1,9}(?:\.[0-9]{1,2})?$/;
            
            var matchResult = numberMatcher.test($(field).val());
            this.options.numbers.showMatchError = (matchResult) ? false : true;
            
            return matchResult;
        },
        
        this.isUsernameValid = function(field) {
            var lengthResult = isBetween($(field).val().length, this.options.username.minLength, this.options.username.maxLength);
            
            this.options.username.showLengthError = (lengthResult) ? false : true;
            
            return lengthResult;
        },
        
        this.isPasswordValid = function(field) {
            var passwordMatcher = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
            
            var lengthResult, matchResult;
            
            lengthResult = isBetween($(field).val().length, this.options.password.minLength, this.options.password.maxLength);
            
            this.options.password.showLengthError = (lengthResult) ? false : true;
            
            if (this.options.password.numbers && this.options.password.letters) { 
                matchResult = (passwordMatcher.test($(field).val()));
                this.options.password.showMatchError = (matchResult) ? false : true;
                
                return matchResult;
            }

            return lengthResult;
        },
        
        this.isEmailValid = function(field) {
            var emailMatcher = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            
            var validResult, domainResult;
            
            validResult = emailMatcher.test($(field).val());
            
            this.options.email.showInvalidError = (validResult) ? false : true;
            
            if(this.options.email.domain !== '') {
                domainResult = ($(field).val().indexOf(this.options.email.domain, $(field).val().length - this.options.email.domain.length) !== -1);
                this.options.email.showDomainError = (domainResult) ? false : true;
                
                return domainResult;
            }
            
            return validResult;
        },
            
        this.isDateOfBirthValid = function(field) {
            var date = $(field).val();
            var count = date.match(/\//g);
            
            var validResult, formatResult;
            
            if(count === null || count.length < 2) {
                formatResult = false;
                this.options.dateofbirth.showFormatError = (formatResult) ? false : true;
                
                return formatResult;
            } else {
                var data = date.split('/');
                
                formatResult = true;
                this.options.dateofbirth.showFormatError = (formatResult) ? false : true;
                
                validResult = isBetween(Date.parse(data[2] + "-" + data[1] + "-" + data[0]), 0, Date.now());
                this.options.dateofbirth.showInvalidError = (validResult) ? false : true;
                
                return validResult;
            }  
        },
        
        this.isPostCodeValid = function(field) {
            var validPostcode = checkPostCode($(field).val());
            
            this.options.postcode.showInvalidError = (validPostcode) ? false : true;
            
            return validPostcode;
        },
             
        self.createErrorMessage = function(field) {
            
            var type = changeToLowercase(field);
            
            switch(type) {
            
                    case 'username':
                        if(this.options.username.showLengthError) {
                            buildErrorContainer('username-length-error', field, this.options.username.lengthErrorMessage);
                        }
                        break;
                    
                    case 'password':
                        if(this.options.password.showMatchError) {
                            buildErrorContainer('password-match-error', field, this.options.password.matchErrorMessage);
                        }
                    
                        if(this.options.password.showLengthError) {
                            buildErrorContainer('password-length-error', field, this.options.password.lengthErrorMessage);
                        }
                        break;
                    
                    case 'email':
                        if(this.options.email.showInvalidError) {
                            buildErrorContainer('email-invalid-error', field, this.options.email.invalidErrorMessage);
                        }
                    
                        if(this.options.email.showDomainError) {
                            buildErrorContainer('email-domain-error', field, this.options.email.domainErrorMessage);
                        }
                        break;
                    
                    case 'letters':
                        if(this.options.letters.showMatchError) {
                            buildErrorContainer('letters-match-error', field, this.options.letters.matchErrorMessage);
                        }
                        break;
                    
                    case 'numbers':
                        if(this.options.numbers.showMatchError) {
                            buildErrorContainer('numbers-match-error', field, this.options.numbers.matchErrorMessage);
                        }
                        break;
                    
                    case 'dateofbirth':
                        if(this.options.dateofbirth.showFormatError) {
                            buildErrorContainer('dateofbirth-format-error', field, this.options.dateofbirth.formatErrorMessage);
                            buildErrorContainer('dateofbirth-invalid-error', field, this.options.dateofbirth.invalidErrorMessage);
                        }
                        break;
                    
                    case 'postcode':
                        if(this.options.postcode.showInvalidError) {
                            buildErrorContainer('postcode-invalid-error', field, this.options.postcode.invalidErrorMessage);
                        }
                        break;
            }
        }
        
        self.controlErrorMessages = function(field) {

            var type = changeToLowercase(field);
            var errorID, showError;

            switch(type) {

                case "username":
                    errorMessageDisplay('#username-length-error', this.options.username.showLengthError);
                    break;

                case "password":
                    errorMessageDisplay('#password-length-error', this.options.password.showLengthError);
                    errorMessageDisplay('#password-match-error', this.options.password.showMatchError);
                    break;

                case 'email':
                    errorMessageDisplay('#email-invalid-error', this.options.email.showInvalidError);
                    errorMessageDisplay('#email-domain-error', this.options.email.showDomainError);
                    break;

                case 'letters':
                    errorMessageDisplay('#letters-match-error', this.options.letters.showMatchError);
                    break;

                case 'numbers':
                    errorMessageDisplay('#numbers-match-error', this.options.numbers.showMatchError);
                    break;    

                case 'dateofbirth': 
                    errorMessageDisplay('#dateofbirth-invalid-error', this.options.dateofbirth.showInvalidError);
                    errorMessageDisplay('#dateofbirth-format-error', this.options.dateofbirth.showFormatError);
                    break;

                case 'postcode':
                    errorMessageDisplay('#postcode-invalid-error', this.options.postcode.showInvalidError);
                    break;
            }

        }
        
        // Private Methods
        
        var changeToLowercase = function(field) {
            return ($(field).attr('data-field-info') !== undefined) ? $(field).attr('data-field-info').toLowerCase() : "";
        }
        
        var isBetween = function (val, min, max) {
            return (val >= min && val <= max);
        }
        
        var completeAction = function(isValid, field) {
            return (isValid) ? validAction(field) : invalidAction(field);
        }
        
        var validAction = function(field) {
            
            $(field).removeClass('invalid');
            
            self.controlErrorMessages(field);
            
            return true;
        }
        
        var invalidAction = function(field) {
        
            $(field).addClass('invalid');
            
            self.controlErrorMessages(field);
            
            return false;
        }
        
        var buildErrorContainer = function(id, field, error) {
            $(field).after('<div id="' + id + '" class="form-error"></div>');
            $('#' + id).append(error);
        }
        
        var errorMessageDisplay = function(id, errorType) {
        
            (errorType) ? $(id).show() : $(id).hide();
        }
        
        //this.init();
  
    }
        
    $.fn.isValid = function(options) {
    
        return this.each(function() {
    
            var newIsValid = new $.isValid(this, options);
            
            newIsValid.init();
            
            $(newIsValid.formID + ' :input[type="submit"]').click(function (e) {
                
                newIsValid.formArray.each(function (index, field) {
                    
                    newIsValid.isValid = newIsValid.isValidField(field);
                    newIsValid.isFormValid = newIsValid.isFormValidated();
                    
                    if (!newIsValid.isFormValid) {
                        e.preventDefault();
                    }
                });
                
                if(newIsValid.isFormValid) {
                    newIsValid.options.onFormValidated();
                }
            });
			
            newIsValid.formArray.each(function (index, field) {
                $(field).blur(function() {
                    newIsValid.isValid = newIsValid.isValidField(field);
                });
            });
            
            newIsValid.$elem.find(':reset').click(function() {
                $('.invalid').removeClass('invalid');
                $('.form-error').hide();
                newIsValid.isFormValid = newIsValid.isFormValidated();
            });
            
        });
    }
  
})(jQuery);