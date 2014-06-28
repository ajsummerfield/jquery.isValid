(function($) {

    $.isValid = function(element, options) {
    
        var defaults = {
            username: {
                minLength: 6,
                maxLength: 12,
                showLengthError: true,
                lengthErrorMessage: "Username must be be at least 6 character long."
            },
            password: {
                minLength: 6,
                maxLength: 20,
                numbers: true,
                letters: true,
                showLengthError: true,
                lengthErrorMessage: "Password must be at least 6 characters long.",
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
            onFormValidated: function() {},
        };
            
        var self = this;
        self.options = {}
        
        self.init = function() {
            
            self.elem = element;
            self.$elem = $(element);
            self.isFormValid = false;
            self.isValid = false;
            self.formID = "#" + self.$elem.attr('id');
            
            self.options = $.extend(true, defaults, options);
            
            self.formArray = $(self.formID + ' :input[type="text"],' + self.formID + ' :input[type="password"],' + self.formID + ' :input[type="tel"],' + self.formID + ' textarea,' + self.formID + ' select');
            
            self.formArray.each(function (index, field) {
                self.createErrorMessage(field);
            });
            
            return self;
        },
        
        self.isFormValidated = function() {
            return ($('.invalid').length) ? false : true;
        },
  
        self.isValidField = function(field) {
            
            if (field.disabled || $(field).attr('data-field-info') === "notrequired") {
                self.isValid = true;
            } else {
                var data = changeToLowercase(field);
                    
                switch(data) {
                    case 'username':
                        self.isValid = completeAction((self.isUsernameValid(field)), field);
                        break;
                       
                    case 'password':
                        self.isValid = completeAction((self.isPasswordValid(field)), field);
                        break; 
                       
                    case 'email':
                        self.isValid = completeAction((self.isEmailValid(field)), field);
                        break;
                    
                    case 'dateofbirth':
                        self.isValid = completeAction((self.isDateOfBirthValid(field)), field);
                        break;
                    
                    case 'letters':
                        self.isValid = completeAction((self.isLetters(field)), field);
                        break;
                        
                    case 'numbers':
                        self.isValid = completeAction((self.isNumbers(field)), field);
                        break;
                        
                    case 'postcode':
                        self.isValid = completeAction((self.isPostCodeValid(field)), field);
                        break;
                        
                    default:
                        self.isValid = completeAction((self.isEmpty(field)), field);
                }
            }
            
            return self.isValid;
        },
        
        self.isEmpty = function(field) {
            return ($(field).val() === "");
        },
        
        self.isLetters = function(field) {
            var letterMatcher = /^[A-Za-z ]+$/;
            
            var matchResult = letterMatcher.test($(field).val());
            self.options.letters.showMatchError = (matchResult) ? false : true;
            
            return matchResult;
        },
        
        self.isNumbers = function(field) {
            var numberMatcher = /^[+-]?[0-9]{1,9}(?:\.[0-9]{1,2})?$/;
            
            var matchResult = numberMatcher.test($(field).val());
            self.options.numbers.showMatchError = (matchResult) ? false : true;
            
            return matchResult;
        },
        
        self.isUsernameValid = function(field) {
            var lengthResult = isBetween($(field).val().length, self.options.username.minLength, self.options.username.maxLength);
            
            self.options.username.showLengthError = (lengthResult) ? false : true;
            
            return lengthResult;
        },
        
        self.isPasswordValid = function(field) {
            var passwordMatcher = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
            
            var lengthResult, matchResult;
            
            lengthResult = isBetween($(field).val().length, self.options.password.minLength, self.options.password.maxLength);
            
            self.options.password.showLengthError = (lengthResult) ? false : true;
            
            if (self.options.password.numbers && self.options.password.letters) { 
                matchResult = (passwordMatcher.test($(field).val()));
                self.options.password.showMatchError = (matchResult) ? false : true;
                
                return matchResult;
            }

            return lengthResult;
        },
        
        self.isEmailValid = function(field) {
            var emailMatcher = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            
            var validResult, domainResult;
            
            validResult = emailMatcher.test($(field).val());
            
            self.options.email.showInvalidError = (validResult) ? false : true;
            
            if(self.options.email.domain !== '') {
                domainResult = ($(field).val().indexOf(self.options.email.domain, $(field).val().length - self.options.email.domain.length) !== -1);
                self.options.email.showDomainError = (domainResult) ? false : true;
                
                return domainResult;
            }
            
            return validResult;
        },
            
        self.isDateOfBirthValid = function(field) {
            var date = $(field).val();
            var count = date.match(/\//g);
            
            var validResult, formatResult;
            
            if(count === null || count.length < 2) {
                formatResult = false;
                self.options.dateofbirth.showFormatError = (formatResult) ? false : true;
                
                return formatResult;
            } else {
                var data = date.split('/');
                
                formatResult = true;
                self.options.dateofbirth.showFormatError = (formatResult) ? false : true;
                
                validResult = isBetween(Date.parse(data[2] + "-" + data[1] + "-" + data[0]), 0, Date.now());
                self.options.dateofbirth.showInvalidError = (validResult) ? false : true;
                
                return validResult;
            }  
        },
        
        self.isPostCodeValid = function(field) {
            var validPostcode = checkPostCode($(field).val());
            
            self.options.postcode.showInvalidError = (validPostcode) ? false : true;
            
            return validPostcode;
        },
             
        self.createErrorMessage = function(field) {
            
            var type = changeToLowercase(field);
            
            switch(type) {
            
                    case 'username':
                        if(self.options.username.showLengthError) {
                            buildErrorContainer('username-length-error', field, self.options.username.lengthErrorMessage);
                        }
                        break;
                    
                    case 'password':
                        if(self.options.password.showMatchError) {
                            buildErrorContainer('password-match-error', field, self.options.password.matchErrorMessage);
                        }
                    
                        if(self.options.password.showLengthError) {
                            buildErrorContainer('password-length-error', field, self.options.password.lengthErrorMessage);
                        }
                        break;
                    
                    case 'email':
                        if(self.options.email.showInvalidError) {
                            buildErrorContainer('email-invalid-error', field, self.options.email.invalidErrorMessage);
                        }
                    
                        if(self.options.email.showDomainError) {
                            buildErrorContainer('email-domain-error', field, self.options.email.domainErrorMessage);
                        }
                        break;
                    
                    case 'letters':
                        if(self.options.letters.showMatchError) {
                            buildErrorContainer('letters-match-error', field, self.options.letters.matchErrorMessage);
                        }
                        break;
                    
                    case 'numbers':
                        if(self.options.numbers.showMatchError) {
                            buildErrorContainer('numbers-match-error', field, self.options.numbers.matchErrorMessage);
                        }
                        break;
                    
                    case 'dateofbirth':
                        if(self.options.dateofbirth.showFormatError) {
                            buildErrorContainer('dateofbirth-format-error', field, self.options.dateofbirth.formatErrorMessage);
                            buildErrorContainer('dateofbirth-invalid-error', field, self.options.dateofbirth.invalidErrorMessage);
                        }
                        break;
                    
                    case 'postcode':
                        if(self.options.postcode.showInvalidError) {
                            buildErrorContainer('postcode-invalid-error', field, self.options.postcode.invalidErrorMessage);
                        }
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
            
            controlErrorMessages(field);
            
            return true;
        }
        
        var invalidAction = function(field) {
        
            $(field).addClass('invalid');
            
            controlErrorMessages(field);
            
            return false;
        }
        
        var buildErrorContainer = function(id, field, error) {
            $(field).after('<div id="' + id + '" class="form-error"></div>');
            $('#' + id).append(error);
        }
        
        var errorMessageDisplay = function(id, errorType) {
        
            if(errorType) {
                $(id).show();
            } else {
                $(id).hide();
            }
        }
        
        var controlErrorMessages = function(field) {
        
            var type = changeToLowercase(field);
                    
            switch(type) {
                    
                case "username":
                    errorMessageDisplay('#username-length-error', self.options.username.showLengthError);
                    break;
                    
                case "password":
                    errorMessageDisplay('#password-length-error', self.options.password.showLengthError);
                    errorMessageDisplay('#password-match-error', self.options.password.showMatchError);
                    break;
                
                case 'email':
                    errorMessageDisplay('#email-invalid-error', self.options.email.showInvalidError);
                    errorMessageDisplay('#email-domain-error', self.options.email.showDomainError);
                    break;
                    
                case 'letters':
                    errorMessageDisplay('#letters-match-error', self.options.letters.showMatchError);
                    break;
                
                case 'numbers':
                    errorMessageDisplay('#numbers-match-error', self.options.numbers.showMatchError);
                    break;    
                
                case 'dateofbirth': 
                    errorMessageDisplay('#dateofbirth-invalid-error', self.options.dateofbirth.showInvalidError);
                    errorMessageDisplay('#dateofbirth-format-error', self.options.dateofbirth.showFormatError);
                    break;
                    
                case 'postcode':
                    errorMessageDisplay('#postcode-invalid-error', self.options.postcode.showInvalidError);
                    break;
            }
        }
        
        self.init();
  
    }
        
    $.fn.isValid = function(options) {
    
        return this.each(function() {
    
            var newIsValid = new $.isValid(this, options);
            $(this).data('isValid', newIsValid);
            
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
                // To do
            });
            
        });
    }
  
})(jQuery);