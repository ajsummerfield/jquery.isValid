(function($) {

    $.isValid = function(element, options) {
    
        var defaults = {
            username: {
                minLength: 1,
                maxLength: 200,
                showLengthError: true,
                lengthErrorMessage: "Username must be be at least 1 character long."
            },
            password: {
                minLength: 1,
                maxLength: 200,
                numbers: true,
                letters: true,
                showLengthError: true,
                lengthErrorMessage: "Password must be be at least 1 character long.",
                showMatchError: true,
                matchErrorMessage: "Password must contain letters and numbers."
            },
            email: {
                domain: '',
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
                showFormatError: true,
                formatErrorMessage: "Please enter Date format as DD/MM/YYYY as specified in the placeholder."
            },
            postcode: {
                showMatchError: true,
                matchErrorMessage: "Not a valid Post Code."
            }
        };
            
        var self = this;
        self.options = {}
        
        self.init = function() {
            
            self.elem = element;
            self.$elem = $(element);
            self.isFormValid = false;
            self.isValid = false;
            self.formID = "#" + self.$elem.attr('id');
            self.$elem.find(':submit').addClass('submit-btn');
            
            self.options = $.extend(true, defaults, options);
            
            self.formArray = $(self.formID + ' :input[type="text"],' + self.formID + ' :input[type="password"],' + self.formID + ' :input[type="tel"],' + self.formID + ' textarea,' + self.formID + ' select');
            
            self.formArray.each(function (index, field) {
                self.createErrorMessage(field);
            });
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
            return (letterMatcher.test($(field).val()));
        },
        
        self.isNumbers = function(field) {
            var numberMatcher = /^[+-]?[0-9]{1,9}(?:\.[0-9]{1,2})?$/;
            return (numberMatcher.test($(field).val()));
        },
        
        self.isUsernameValid = function(field) {
            var lengthResult = (($(field).val().length >= self.options.username.minLength) && ($(field).val().length <= self.options.username.maxLength));
            
            self.options.username.showLengthError = (lengthResult) ? false : true;
            
            return lengthResult;
        },
        
        self.isPasswordValid = function(field) {
            var passwordMatcher = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
            
            var lengthResult, matchResult;
            
            lengthResult = (($(field).val().length >= self.options.password.minLength) && ($(field).val().length <= self.options.password.maxLength));
            
            self.options.password.showLengthError = (lengthResult) ? false : true;
            
            if (self.options.password.numbers && self.options.password.letters) { 
                matchResult = (passwordMatcher.test($(field).val()));
                self.options.password.showMatchError = (matchResult) ? false : true;
                
                return matchResult;
            }

            return lengthResult;
        },
        
        self.isDateOfBirthValid = function(field) {
            var date = $(field).val();
            var count = date.match(/\//g);
            
            if(count === null || count.length < 2) {
                return false;
            } else {
                var data = date.split('/');
                return (Date.parse(data[2] + "-" + data[1] + "-" + data[0]) > 0);
            }  
        },
        
        self.isEmailValid = function(field) {
            var emailMatcher = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            
            if(self.options.email.domain === '') {
                return (emailMatcher.test($(field).val()));
            } else {
                return ((emailMatcher.test($(field).val())) && (($(field).val().indexOf(self.options.email.domain, $(field).val().length - self.options.email.domain.length) !== -1)));
            }
        },
        
        self.isPostCodeValid = function(field) {
            return (checkPostCode($(field).val()));
        },
        
        self.createErrorMessage = function(field) {
            
            var type = changeToLowercase(field);
            
            switch(type) {
            
                    case 'username':
                        if(self.options.username.showLengthError) {
                            $(field).after('<div id="username-length-error" class="form-error username"></div>');
                            $('#username-length-error').append(self.options.username.lengthErrorMessage);
                        }
                        break;
                    
                    case 'password':
                        if(self.options.password.showMatchError) {
                            $(field).after('<div id="password-match-error" class="form-error password"></div>');
                            $('#password-match-error').append(self.options.password.matchErrorMessage);
                        }
                    
                        if(self.options.password.showLengthError) {
                            $(field).after('<div id="password-length-error" class="form-error password"></div>');
                            $('#password-length-error').append(self.options.password.lengthErrorMessage);
                        }
                        break;
                    
                    case 'email':
                    
                        break;
                    
                    case 'letters':
                    
                        break;
                    
                    case 'numbers':
                    
                        break;
                    
                    case 'dateofbirth':
                        if(self.options.dateofbirth.showFormatError) {
                            $(field).after('<div id="dateofbirth-format-error" class="form-error dateofbirth"></div>');
                            $('#dateofbirth-format-error').append(self.options.dateofbirth.formatErrorMessage);
                        }
                        break;
                    
                    case 'postcode':
                    
                        break;
            }
        }
        
        // Private Methods
        var changeToLowercase = function(field) {
            return ($(field).attr('data-field-info') !== undefined) ? $(field).attr('data-field-info').toLowerCase() : "";
        }
        
        var completeAction = function(isValid, field) {
            (isValid) ? validAction(field) : invalidAction(field);
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
        
        var controlErrorMessages = function(field) {
        
            var type = changeToLowercase(field);
                    
            switch(type) {
                    
                case "username":
                    if(self.options.username.showLengthError) {
                        $('#username-length-error').show();
                    } else {
                        $('#username-length-error').hide();
                    }
                    break;
                    
                case "password":
                    
                    if(self.options.password.showMatchError) {
                        $('#password-match-error').show();
                    } else {
                        $('#password-match-error').hide();
                    }
                    
                    if(self.options.password.showLengthError) {
                        $('#password-length-error').show();
                    } else {
                        $('#password-length-error').hide();
                    }
                    
                    break;
                
                case 'dateofbirth': 
                    if(self.options.dateofbirth.showFormatError) {
                        $('#dateofbirth-format-error').show();
                    } else {
                        $('#dateofbirth-format-error').hide();
                    }
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
            });
			
            newIsValid.formArray.each(function (index, field) {
                $(field).blur(function() {
                    newIsValid.isValid = newIsValid.isValidField(field);
                });
            });
        });
    }
  
})(jQuery);