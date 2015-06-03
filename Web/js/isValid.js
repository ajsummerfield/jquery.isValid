(function ($) {
    "use strict";
    
     $.isValid = function (element, options) {
     
         var self,
             defaults = {
                general: {
                    activeErrorMessage: '',
                    requiredErrorMessage: 'Field is required',
                    callbacks: {
                        onValidated: function() {},
                        onInvalidated: function() {}
                    }
                },
                letters: {
                    activeErrorMessage: '',
                    requiredErrorMessage: 'Field is required',
                    invalidErrorMessage: 'Field is letters only'
                },
                numbers: {
                    activeErrorMessage: '',
                    requiredErrorMessage: 'Field is required',
                    invalidErrorMessage: 'Field is numbers only',
                },
                decimals: {
                    activeErrorMessage: '',
                    requiredErrorMessage: 'Field is required',
                    invalidErrorMessage: 'Field is decimals only',
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
                    invalidErrorMessage: 'Password should be more than 6 characters'
                },
                passwordConfirm: {
                    activeErrorMessage: '',
                    requiredErrorMessage: 'Confirming your Password is required',
                    invalidErrorMessage: 'Passwords do not match'
                },
                email: {
                    domain: '',
                    emailConfirm: false,
                    activeErrorMessage: '',
                    requiredErrorMessage: 'Email is required',
                    domainErrorMessage: 'Email domain should be @xxxx.com',
                    invalidErrorMessage: 'Please enter a valid email address'
                },
                emailConfirm: {
                    activeErrorMessage: '',
                    requiredErrorMessage: 'Confirming your Email is required',
                    invalidErrorMessage: 'Email addresses do not match'
                },
                date: {
                    format: 'DD/MM/YYYY',
                    allowFutureDates: true,
                    activeErrorMessage: '',
                    requiredErrorMessage: 'Date is required',
                    formatErrorMessage: 'Date format doesn\'t match DD/MM/YYYY',
                    invalidErrorMessage: 'Please enter a valid Date',
                    allowedDateErrorMessage: 'Date not allowed'
                },
                postCode: {
                    activeErrorMessage: '',
                    requiredErrorMessage: 'Post Code is required',
                    invalidErrorMessage: 'Please enter a valid Post Code'
                },
                select: {
                    activeErrorMessage: '',
                    requiredErrorMessage: 'Choosing an option is required',
                },
                checkbox: {
                    activeErrorMessage: '',
                    requiredErrorMessage: 'Checkbox is required',
                },
                onFormValidated: function () { },
                onFormInvalidated: function () { }
         };
         
         this.init = function() {
             
            self = this;
             
            this.elem = element;
            this.$elem = $(element);
            this.isFieldValid = false;
            this.options = $.extend(true, {}, defaults, options);
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
         
        this.isGeneralValid = function (field) {
            
            var isEmpty = this.isEmpty(field);
            
            if(isEmpty) {
                this.options.general.activeErrorMessage = this.options.general.requiredErrorMessage;
                $(field).trigger('fieldValidated', [!isEmpty, this.options.general.activeErrorMessage]);
            } else {
                this.options.general.callbacks.onInvalidated();
            }
            
            return !isEmpty;
        };
         
        this.isLetters = function (field) {
            
            var isEmpty = this.isEmpty(field),
                validResult = /^[A-Za-z ]+$/.test($(field).val());
            
            if(!isEmpty) {
                this.options.letters.activeErrorMessage = validResult ? '' : this.options.letters.invalidErrorMessage;
                return validResult;
            } else {
                this.options.letters.activeErrorMessage = this.options.letters.requiredErrorMessage;
                return !isEmpty;
            }
        };

        this.isNumbers = function (field) {
            
            var isEmpty = this.isEmpty(field),
                validResult = /^[0-9 ]+$/.test($(field).val());
            
            if(!isEmpty) {
                this.options.numbers.activeErrorMessage = validResult ? '' : this.options.numbers.invalidErrorMessage;
                return validResult;
            }  else {
                this.options.numbers.activeErrorMessage = this.options.numbers.requiredErrorMessage;
                return !isEmpty;
            }
        };
        
        this.isDecimals = function (field) {
            
            var isEmpty = this.isEmpty(field),
                validResult = /^(\d+\.?\d*|\.\d+)$/.test($(field).val());
            
            if(!isEmpty) {
                this.options.decimals.activeErrorMessage = validResult ? '' : this.options.decimals.invalidErrorMessage;
                return validResult;
            } else {
                this.options.decimals.activeErrorMessage = this.options.decimals.requiredErrorMessage;
                return !isEmpty;
            }
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
                    this.options.password.activeErrorMessage = this.options.password.requiredErrorMessage;
                    return !isEmpty;
                }
            }
            
            this.isPasswordConfirmValid($(this.formID + " input[data-field-type='passwordConfirm']"));
            
            if(!isEmpty) {
                this.options.password.activeErrorMessage = lengthResult ? '' : this.options.password.invalidErrorMessage;
                return lengthResult;
            } else {
                this.options.password.activeErrorMessage = this.options.password.requiredErrorMessage;
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
                    this.options.passwordConfirm.activeErrorMessage = this.options.passwordConfirm.requiredErrorMessage;
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
                    this.options.email.activeErrorMessage = this.options.email.requiredErrorMessage;
                    return !isEmpty;
                }
            }
            
            this.isEmailConfirmValid($(this.formID + " input[data-field-type='emailConfirm']"));
            
            if(!isEmpty) {
                this.options.email.activeErrorMessage = validResult ? '' : this.options.email.invalidErrorMessage;
                return validResult;
            } else {
                this.options.email.activeErrorMessage = this.options.email.requiredErrorMessage;
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
                    this.options.emailConfirm.activeErrorMessage = this.options.emailConfirm.requiredErrorMessage;
                    return !isEmpty;
                }
            }
        };
         
        this.isDateValid = function (field) {

            var date = $(field).val(),
                isEmpty,
                validResult,
                allowedResult,
                formatResult;

            isEmpty = this.isEmpty(field);
            
            var momentObject = new moment(date, this.options.date.format, true); // jshint ignore:line

            validResult = momentObject.isValid();
            formatResult = (momentObject._pf.charsLeftOver === 0);

            if (!this.options.date.allowFutureDates) {

                if(validResult) {
                    allowedResult = isBetween(Date.parse(momentObject._d), 0, Date.now());
                }
            }
            
            if(!isEmpty) {
                 
                if(!validResult) {
                    
                    if(!formatResult) {
                        
                        if(momentObject._pf.unusedTokens.length === 1 || momentObject._pf.unusedTokens.length === 2 && momentObject._pf.charsLeftOver === 2) {
                            this.options.date.activeErrorMessage = this.options.date.formatErrorMessage;
                        } else {
                            this.options.date.activeErrorMessage = this.options.date.invalidErrorMessage;
                        }
                        
                    } else {
                        this.options.date.activeErrorMessage = this.options.date.invalidErrorMessage;
                    }
                } else {
                    if(!formatResult) {
                        this.options.date.activeErrorMessage = this.options.date.formatErrorMessage;
                    } else {
                        if(!allowedResult) {
                            this.options.date.activeErrorMessage = this.options.date.allowedDateErrorMessage;
                        }
                    }
                }
                
                return validResult && formatResult && allowedResult;
            } else {
                this.options.date.activeErrorMessage = this.options.date.requiredErrorMessage;
                return !isEmpty;
            }
        };
         
        this.isPostCodeValid = function (field) {
            
            var isEmpty = this.isEmpty(field),
                validResult = checkPostCode($(field).val());
            
            if(!isEmpty) {
                this.options.postCode.activeErrorMessage = validResult ? '' : this.options.postCode.invalidErrorMessage;
                return validResult;
            } else {
                this.options.postCode.activeErrorMessage = this.options.postCode.requiredErrorMessage;
                return !isEmpty;
            }
        };
         
        this.isSelectChosen = function (field) {
            
            var validResult = true;
            
            if($(field).val() === null) {
                validResult = false;
            } else if($(field).val().length === 0) {
                validResult = false;
            }
            
            this.options.select.activeErrorMessage = validResult ? '' : this.options.select.requiredErrorMessage;
            
            return validResult;
        };
         
        this.isCheckboxTicked = function (field) {
            
            var validResult = $(field).is(':checked');
            
            this.options.checkbox.activeErrorMessage = validResult ? '' : this.options.checkbox.requiredErrorMessage;
            
            return validResult;
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
                
                if(self.options[$(field).data().fieldType].activeErrorMessage.length === 0) {
                    self.options[$(field).data().fieldType].activeErrorMessage = $(field).data().errorMessage;
                }
                
                return self.options[$(field).data().fieldType].activeErrorMessage;
                
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
                        $(field).on('fieldValidated', function(event, isFieldValid, activeErrorMessage) {
                            console.log(event);
                        });
                    } else {

                        isValid.hideErrorFor(field);
                    }
                });
                
            });
        });
    };
    
})(jQuery);