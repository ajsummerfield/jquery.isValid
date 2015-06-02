(function ($) {
    "use strict";
    
     $.isValid = function (element, options) {
     
         var self,
             defaults = {
                general: {
                    activeErrorMessage: 'Field is required'
                },
                letters: {
                    activeErrorMessage: 'Field is required'
                },
                numbers: {
                    activeErrorMessage: 'Field is required'
                },
                decimals: {
                    activeErrorMessage: 'Field is required'
                },
                password: {
                    minLength: 6,
                    maxLength: 100,
                    numbers: false,
                    letters: true,
                    passwordConfirm: false,
                    activeErrorMessage: 'Password is required',
                    formatErrorMessage: 'Password should contain numbers and letters',
                    invalidErrorMessage: 'Password should be more than 6 characters'
                },
                passwordConfirm: {
                    activeErrorMessage: 'Confirming your Password is required',
                    invalidErrorMessage: 'Passwords do not match'
                },
                email: {
                    domain: '',
                    emailConfirm: false,
                    activeErrorMessage: 'Email is required',
                    domainErrorMessage: 'Email domain should be @xxxx.com',
                    invalidErrorMessage: 'Please enter a valid email address'
                },
                emailConfirm: {
                    activeErrorMessage: 'Confirming your Email is required',
                    invalidErrorMessage: 'Email addresses do not match'
                },
                date: {
                    format: 'DD/MM/YYYY',
                    allowPastDates: true,
                    allowFutureDates: true,
                    activeErrorMessage: 'Date is required'
                },
                postCode: {
                    activeErrorMessage: 'Post Code is required'
                },
                select: {
                    activeErrorMessage: 'Choosing an item is required'
                },
                checkbox: {
                    activeErrorMessage: 'Checkbox is required'
                },
                onFormValidated: function () { },
                onFormInValidated: function () { }
             };
         
         this.init = function() {
             
            self = this;
             
            this.$elem = $(element);
            this.isFieldValid = false;
            this.options = $.extend(true, defaults, options);
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
            
            $(this.formID).submit();
            
            return ($(this.formID + ' .invalid').length) ? false : true;
        };
         
         this.isValidField = function (field) {

            if (field.disabled || $(field).attr('data-field-type') === "notrequired") {
                this.isFieldValid = true;
            } else {
                var data = $(field).attr('data-field-type'),
                    valMethodName;

                switch (data) {
                    case "general":
                        valMethodName = "isGeneralValid";
                        break;

                    case "password":
                        valMethodName = "isPasswordValid";
                        break;

                    case "passwordConfirm":
                        valMethodName = "isPasswordConfirmValid";
                        break;

                    case "email":
                        valMethodName = "isEmailValid";
                        break;

                    case "emailConfirm":
                        valMethodName = "isEmailConfirmValid";
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

                    case "postCode":
                        valMethodName = "isPostCodeValid";
                        break;

                    case "checkbox":
                        valMethodName = "isCheckboxTicked";
                        break;

                    case "select":
                        valMethodName = "isSelectChosen";
                        break;

                    default:
                        valMethodName = "isEmpty";
                        break;
                }

                this.isFieldValid = this[valMethodName](field);
            }

            return this.isFieldValid;
        };
         
        this.isEmpty = function (field) {
            return ($(field).val().length === 0);
        };
         
        this.isLetters = function (field) {
            return /^[A-Za-z ]+$/.test($(field).val());
        };

        this.isNumbers = function (field) {
            return /^[0-9 ]+$/.test($(field).val());
        };
        
        this.isDecimals = function (field) {
            return /^(\d+\.?\d*|\.\d+)$/.test($(field).val());
        };
         
        this.isGeneralValid = function (field) {
            return !this.isEmpty(field);
        };
         
        this.isPasswordValid = function (field) {

            var passwordMatcher = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
                isEmpty,
                lengthResult,
                formatResult;
            
            isEmpty = this.isEmpty(field);
            
            lengthResult = isBetween($(field).val().length, this.options.password.minLength, this.options.password.maxLength);

            if (this.options.password.numbers && this.options.password.letters) {

                formatResult = (passwordMatcher.test($(field).val()));
                
                if(!isEmpty) {
                    this.options.password.activeErrorMessage = lengthResult && !formatResult ? this.options.password.formatErrorMessage : this.options.password.invalidErrorMessage;
                    return (lengthResult) ? formatResult : false;
                } else {
                    return !isEmpty;
                }
            }
            
            this.isPasswordConfirmValid($(this.formID + " input[data-field-type='passwordConfirm']"));
            
            if(!isEmpty) {
                this.options.password.activeErrorMessage = lengthResult ? '' : this.options.password.invalidErrorMessage;
                return lengthResult;
            } else {
                return !isEmpty;
            }
        };
         
        this.isPasswordConfirmValid = function (field) {

            if (this.options.password.passwordConfirm) {
                
                var isEmpty = this.isEmpty(field),
                    validResult = $(field).val() === $(this.formID + " input[data-field-type='password']").val();
                
                if(!isEmpty) {
                    this.options.passwordConfirm.activeErrorMessage = validResult ? ''  : this.options.passwordConfirm.invalidErrorMessage;
                    return validResult;
                } else {
                    return !isEmpty;
                }
            }
        };
         
        this.isEmailValid = function (field) {

            var emailMatcher = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                isEmpty,
                validResult,
                domainResult;

            isEmpty = this.isEmpty(field);
            
            // Remove whitespace as some phones put a spacebar in if you use the autocomplete option on the phone
            var isWhiteSpace = /\s/.test($(field).val());
            if (isWhiteSpace) {
                $(field).val($(field).val().replace(/\s/g, ''));
            }

            validResult = emailMatcher.test($(field).val());

            if (this.options.email.domain !== '') {
                
                domainResult = ($(field).val().indexOf(this.options.email.domain, $(field).val().length - this.options.email.domain.length) !== -1);
                
                if(!isEmpty) {
                    this.options.email.activeErrorMessage = validResult && !domainResult ? this.options.email.domainErrorMessage : this.options.email.invalidErrorMessage;
                    return (validResult) ? domainResult : false;
                } else {
                    return !isEmpty;
                }
            }
            
            this.isEmailConfirmValid($(this.formID + " input[data-field-type='emailConfirm']"));
            
            if(!isEmpty) {
                this.options.email.activeErrorMessage = validResult ? '' : this.options.email.invalidErrorMessage;
                return validResult;
            } else {
                return !isEmpty;
            }
        };
         
        this.isEmailConfirmValid = function (field) {

            if (this.options.email.emailConfirm) {
                
                var isEmpty = this.isEmpty(field),
                    validResult = $(field).val() === $(this.formID + " input[data-field-type='email']").val();
                
                if(!isEmpty) {
                    this.options.emailConfirm.activeErrorMessage = validResult ? '' : this.options.emailConfirm.invalidErrorMessage;
                    return validResult;
                } else {
                    return !isEmpty;
                }
            }
        };
         
        this.isDateValid = function (field) {

            var date = $(field).val(),
                validResult,
                formatResult;

            var momentObject = new moment(date, this.options.date.format, true); // jshint ignore:line

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
            return !checkPostCode($(field).val()) ? false : true;
        };
         
        this.isSelectChosen = function (field) {
            
            var isValid = true;
            
            if($(field).val() === null) {
                isValid = false;
            } else if($(field).val().length === 0) {
                isValid = false;
            }
            
            return isValid;
        };
         
        this.isCheckboxTicked = function (field) {
            return $(field).is(":checked");
        };
         
        this.showErrorFor = function(field) {

            if($(field).siblings('.form-error').length) {
                
                updateErrorContainer(field);
                
            } else {
                var errorContainer = createErrorContainer(field);
                var errorContainerWidth = getErrorContainerWidth(field);
                
                $(field).parent().append(errorContainer);
                $(field).addClass('invalid');
                
                $(field).siblings('.form-error').css('width', errorContainerWidth + 'px');
                $(field).siblings('.form-error').css('margin-left', $(field).position().left + 'px');
            }
        };

        this.hideErrorFor = function(field) {
            
            $(field).removeClass('invalid');
            $(field).siblings('.form-error').remove();
        };
         
        var isBetween = function (val, min, max) {
            return (val >= min && val <= max);
        };
         
        var createErrorContainer = function(field) {
            
            var errorMessage = getErrorMessage(field);
            
            return '<div class="form-error">' + errorMessage + '</div>';
        };
         
        var updateErrorContainer = function(field) {
            
            var errorMessage = getErrorMessage(field);
            
            $(field).siblings('.form-error').text(errorMessage);
        }; 
        
        var getErrorContainerWidth = function(field) {
            
            if($(field).attr('aria-hidden') === undefined && $(field).is(':visible')) {
                return $(field).outerWidth();
            } else {
                return Math.max.apply(Math, $(field).parent().children().map(function(){ 
                    return $(this).width(); 
                }).get());
            }
        };
         
        var getErrorMessage = function(field) {
            
            if($(field).data().errorMessage !== undefined) {
                
                if($(field).data().errorMessage !== self.options[$(field).data().fieldType].activeErrorMessage) {
                    return self.options[$(field).data().fieldType].activeErrorMessage;
                } else {
                    return $(field).data().errorMessage;
                }
                
            } else {
                return self.options[$(field).data().fieldType].activeErrorMessage;
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

                    isValid.isFieldValid = isValid.isValidField(field);
                    isValid.isFormValid = isValid.isFormValidated();

                    if (!isValid.isFormValid) {
                        e.preventDefault();
                    }
                });
            });

            isValid.$elem.on('submit', function(e) {
                
                isValid.formArray.each(function (index, field) {

                    if(!isValid.isValidField(field)) {
                        
                        isValid.showErrorFor(field);
                        e.preventDefault();
                    } else {
                        
                        isValid.hideErrorFor(field);
                    }
                });
            });
            
            isValid.formArray.each(function (index, field) {
                
                $(field).on('blur change', function() {
                        
                    if(!isValid.isValidField(field)) {

                        isValid.showErrorFor(field);
                    } else {

                        isValid.hideErrorFor(field);
                    }
                });
                
            });
        });
    };
    
})(jQuery);