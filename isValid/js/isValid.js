/* isValid Form Validation Plugin */
/* Version 1.0 */
/* Andy Summerfield */

(function ($, window, document, undefined) {

    var self = null;
    
    var IsValid = {
        
        init: function (options, elem) {
            
            self = this;

            self.elem = elem;
            self.$elem = $(elem);
            self.isFormValid = false;
            self.isValid = false;
            self.formID = "#" + self.$elem.attr('id');
            self.$elem.find(':submit').addClass('submit-btn');
            
            self.options = $.extend(true, $.fn.isValid.options, options);
            
            self.formArray = $(self.formID + ' :input[type="text"],' + self.formID + ' :input[type="password"],' + self.formID + ' :input[type="tel"],' + self.formID + ' textarea,' + self.formID + ' select');
            
            self.formArray.each(function (index, field) {
                IsValid.createErrorMessage(field);
            });
            
            return self;
        },
        
        isFormValid: function() {
            return ($('.invalid').length) ? false : true;
        },
        
        isValidField: function (field) {
            
            if (field.disabled || $(field).hasClass('not-required')) {
                self.isValid = true;
            } else {
                if(IsValid.isEmpty(field)) {
                    IsValid.invalidAction(field);
                } else {
                    
                    var data = ($(field).attr('data-field-info') !== undefined) ? $(field).attr('data-field-info').toLowerCase() : "";
                    
                    switch(data) {
                        case 'username':
                            self.isValid = (IsValid.isUsernameValid(field)) ? IsValid.validAction(field) : IsValid.invalidAction(field);
                            break;
                           
                        case 'password':
                            self.isValid = (IsValid.isPasswordValid(field)) ? IsValid.validAction(field) : IsValid.invalidAction(field);
                            break; 
                           
                        case 'email':
                            self.isValid = (IsValid.isEmailValid(field)) ? IsValid.validAction(field) : IsValid.invalidAction(field);
                            break;
                        
                        case 'dateofbirth':
                            self.isValid = (IsValid.isDateOfBirthValid(field)) ? IsValid.validAction(field) : IsValid.invalidAction(field);
                            break;
                        
                        case 'numbers':
                            self.isValid = (IsValid.isNumbers(field)) ? IsValid.validAction(field) : IsValid.invalidAction(field);
                            break;

                        case 'letters':
                            self.isValid = (IsValid.isLetters(field)) ? IsValid.validAction(field) : IsValid.invalidAction(field);
                            break;
                            
                        case 'postcode':
                            // To do
                            self.isValid = false;
                            break;
                            
                        default:
                            IsValid.validAction(field);
                            self.isValid = true;
                    }
                }
            }
            
            return self.isValid;
        },
        
        isEmpty: function (field) {
            return ($(field).val() === "") ? true : false;
        },
        
        isLetters: function(field) {
            var letterMatcher = /^[A-Za-z ]+$/;
            return (letterMatcher.test($(field).val())) ? true : false;
        },
        
        isNumbers: function(field) {
            var numberMatcher = /^[+-]?[0-9]{1,9}(?:\.[0-9]{1,2})?$/;
            return (numberMatcher.test($(field).val())) ? true : false;
        },
        
        isUsernameValid: function (field) {
            return (($(field).val().length >= self.options.username.minLength) && ($(field).val().length <= self.options.username.maxLength)) ? true : false;
        },
        
        isPasswordValid: function (field) {
            var passwordMatcher = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/;
            
            if (self.options.password.numbers && self.options.password.letters) { 
                return ((passwordMatcher.test($(field).val())) && ($(field).val().length >= self.options.password.minLength) && ($(field).val().length <= self.options.password.maxLength)) ? true : false;
            } else {
                return (($(field).val().length >= self.options.password.minLength) && ($(field).val().length <= self.options.password.maxLength)) ? true : false;
            }
        },
        
        isDateOfBirthValid: function (field) {
            var dbMatcher = /^\d+$/;
            return (dbMatcher.test($(field).val())) ? true : false;
        },
        
        isEmailValid: function (field) {
            var emailMatcher = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            
            if(self.options.email.domain === '') {
                return (emailMatcher.test($(field).val())) ? true : false;
            } else {
                return ((emailMatcher.test($(field).val())) && (($(field).val().indexOf(self.options.email.domain, $(field).val().length - self.options.email.domain.length) !== -1))) ? true : false;
            }
        },
        
        isPostCodeValid: function(field) {
        
        },

        createErrorMessage: function (field) {
            
            var name = $(field).attr("data-field-info");
            
            if(name === "username") {
                if(self.options.username.showLengthError) {
                    $(field).after('<div id="username-length-error" class="form-error username"></div>');
                    $('#username-length-error').append(self.options.username.lengthErrorMessage);
                }
            } else if(name === "password") {
                if(self.options.password.showLengthError) {
                    $(field).after('<div id="password-length-error" class="form-error password"></div>');
                    $('#password-length-error').append(self.options.password.lengthErrorMessage);
                }
                if(self.options.password.showPasswordMatchError) {
                    $(field).after('<div id="password-match-error" class="form-error password"></div>');
                    $('#password-match-error').append(self.options.password.passwordMatchErrorMessage);
                }
            }
            
        },

        validAction: function (field) {
            
            $(field).removeClass('invalid');
            
            var data = ($(field).attr('data-field-info') !== undefined) ? $(field).attr('data-field-info').toLowerCase() : "";
                    
            switch(data) {
                case "username":
                    $('.form-error.username').hide();
                    break;
                case "password":
                    $('.form-error.password').hide();
                    break;
                default:
                    $('.form-error').hide();
                    break;
            }
            
            return true;
        },
    
        invalidAction: function (field) {
            
            $(field).addClass('invalid');
            
            var data = ($(field).attr('data-field-info') !== undefined) ? $(field).attr('data-field-info').toLowerCase() : "";
                    
            switch(data) {
                case "username":
                    $('.form-error.username').show();
                    break;
                case "password":
                    $('.form-error.password').show();
                    break;
            }
            return false;
        }
        
    };

    $.fn.isValid = function (options) {
        
        var opts = $.extend({}, $.fn.isValid.options, options);
        
        return this.each(function () {
            
            var isvalid = Object.create(IsValid);

            var self = isvalid.init(opts, this);

            $.data(this, 'isValid', isvalid);
            
            $(self.formID + ' :input[type="submit"]').click(function (e) {
                self.formArray.each(function (index, field) {
                    self.isValid = IsValid.isValidField(field);
                    self.isFormValid = IsValid.isFormValid();
                    if (!self.isFormValid) {
                        e.preventDefault();
                    }
                });
            });
			
            self.formArray.each(function (index, field) {
                $(field).blur(function() {
                    self.isValid = IsValid.isValidField(field);
                });
            });

        });
    };

    $.fn.isValid.options = {
        username: {
            minLength: 1,
            maxLength: 200,
            showLengthError: true,
            lengthErrorMessage: "Username must be be at least 1 character long."
        },
        password: {
            minLength: 1,
            maxLength: 200,
            numbers: false,
            letters: true,
            showLengthError: true,
            lengthErrorMessage: "Password must be be at least 1 character long.",
            showPasswordMatchError: false,
            passwordMatchErrorMessage: "Password must contain letters."
        },
        email: {
            domain: ''
        }
    };

})(jQuery, window, document); 

// Utility
if (typeof Object.create !== 'function') {
    Object.create = function (obj) {
        function F() { };
        F.prototype = obj;
        return new F();
    };
}