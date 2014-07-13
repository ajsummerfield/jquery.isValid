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
                showLengthError: true, // showMinLengthError
                lengthErrorMessage: "Username must be be at least 6 character long.", // minLengthErrorMessage
                showMaxLengthError: true,
                maxLengthErrorMessage: "Username must be no more than 12 characters long."
            },
            password: {
                minLength: 6,
                maxLength: 20,
                numbers: true,
                letters: true,
                showLengthError: true, // showMinLengthError
                lengthErrorMessage: "Password must be at least 6 characters long.", // minLengthErrorMessage
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
            onFormValidated: function () {},
            onFormInValidated: function () {}
        }, self;
            
        self = this, this.options;
        
        this.init = function() {
            
            var obj = this;
            
            this.elem = element;
            this.$elem = $(element);
            this.isFormValid = false;
            this.isValid = false;
            this.formID = "#" + this.$elem.attr('id');
            this.formIDStr = this.$elem.attr('id');
            
            this.options = $.extend(true, defaults, options);
            
            this.formArray = $(this.formID + ' :input[type="text"],' + this.formID + ' :input[type="password"],' + this.formID + ' :input[type="tel"],' + this.formID + ' textarea,' + this.formID + ' select');
            
            this.formArray.each(function (index, field) {
                self.createErrorMessage(obj, field);
            });
            
            return this;
        },
        
        this.isFormValidated = function() {
            return ($(this.formID + ' .invalid').length) ? false : true;
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
                        valMethodName = "isEmpty";
                }
            }
            
            this.isValid = completeAction(this, (this[valMethodName](field)), field);
            
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
                
                return (lengthResult) ? matchResult : false;
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
                
                return (validResult) ? domainResult : false;
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

        // Need a more effective/faster/efficient way of writing the method below
        self.createErrorMessage = function(obj, field) {
            
            var data = changeToLowercase(field);
            
            var errorID, errorMessage;
            
            switch(data) {
            
                case 'username':
                    if(obj.options.username.showLengthError) {
                        errorID = '-username-length-error';
                        errorMessage = obj.options.username.lengthErrorMessage;
                    }
                    break;

                case 'password':
                    if(obj.options.password.showMatchError) {
                        errorID = '-password-match-error';
                        errorMessage = obj.options.password.matchErrorMessage;
                        
                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }

                    if(obj.options.password.showLengthError) {
                        errorID = '-password-length-error';
                        errorMessage = obj.options.password.lengthErrorMessage;
                        
                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    break;

                case 'email':
                    if(obj.options.email.showInvalidError) {
                        errorID = '-email-invalid-error';
                        errorMessage = obj.options.email.invalidErrorMessage;
                        
                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }

                    if(obj.options.email.showDomainError) {
                        errorID = '-email-domain-error';
                        errorMessage = obj.options.email.domainErrorMessage;
                        
                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    break;

                case 'letters':
                    if(obj.options.letters.showMatchError) {
                        errorID = '-letters-match-error';
                        errorMessage = obj.options.letters.matchErrorMessage;
                    }
                    break;

                case 'numbers':
                    if(obj.options.numbers.showMatchError) {
                        errorID = '-numbers-match-error';
                        errorMessage = obj.options.numbers.matchErrorMessage;
                    }
                    break;

                case 'dateofbirth':
                    if(obj.options.dateofbirth.showFormatError) {
                        errorID = '-dateofbirth-format-error';
                        errorMessage = obj.options.dateofbirth.formatErrorMessage;
                        
                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    
                    if(obj.options.dateofbirth.showFormatError) {
                        errorID = '-dateofbirth-invalid-error';
                        errorMessage = obj.options.dateofbirth.invalidErrorMessage;
                        
                        buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
                    }
                    break;

                case 'postcode':
                    if(obj.options.postcode.showInvalidError) {
                        errorID = '-postcode-invalid-error';
                        errorMessage = obj.options.postcode.invalidErrorMessage;
                    }
                    break;
            }
            
            buildErrorContainer(obj.formIDStr + errorID, field, errorMessage);
        }
        
        // Need a more effective/faster/efficient way of writing the method below
        self.controlErrorMessages = function(obj, field) {

            var data = changeToLowercase(field);
            
            var errorID, showError;
            
            switch(data) {

                case "username":
                    errorID = '-username-length-error';
                    showError = obj.options.username.showLengthError;
                    break;

                case "password":
                    errorMessageDisplay(obj.formID + '-password-length-error', obj.options.password.showLengthError);
                    errorMessageDisplay(obj.formID + '-password-match-error', obj.options.password.showMatchError);
                    break;

                case 'email':
                    errorMessageDisplay(obj.formID + '-email-invalid-error', obj.options.email.showInvalidError);
                    errorMessageDisplay(obj.formID + '-email-domain-error', obj.options.email.showDomainError);
                    break;

                case 'letters':
                    errorID = '-letters-match-error';
                    showError = obj.options.letters.showMatchError;
                    break;

                case 'numbers':
                    errorID = '-numbers-match-error';
                    showError = obj.options.numbers.showMatchError;
                    break;    

                case 'dateofbirth': 
                    errorMessageDisplay(obj.formID + '-dateofbirth-invalid-error', obj.options.dateofbirth.showInvalidError);
                    errorMessageDisplay(obj.formID + '-dateofbirth-format-error', obj.options.dateofbirth.showFormatError);
                    break;

                case 'postcode':
                    errorID = '-postcode-invalid-error';
                    showError = obj.options.postcode.showInvalidError;
                    break;
            }
            
            errorMessageDisplay(obj.formID + errorID, showError);

        }
        
        // Private Methods
        
        var changeToLowercase = function(field) {
            return ($(field).attr('data-field-info') !== undefined) ? $(field).attr('data-field-info').toLowerCase() : "";
        }
        
        var isBetween = function (val, min, max) {
            return (val >= min && val <= max);
        }
        
        var completeAction = function(obj, isValid, field) {
            return (isValid) ? validAction(obj, field) : invalidAction(obj, field);
        }
        
        var validAction = function(obj, field) {
            
            $(field).removeClass('invalid');
            
            self.controlErrorMessages(obj, field);
            
            return true;
        }
        
        var invalidAction = function(obj, field) {
        
            $(field).addClass('invalid');
            
            self.controlErrorMessages(obj, field);
            
            return false;
        }
        
        var buildErrorContainer = function(id, field, error) {
            $(field).after('<div id="' + id + '" class="form-error"></div>');
            $('#' + id).append(error);
        }
        
        var errorMessageDisplay = function(id, errorType) {
            (errorType) ? $(id).show() : $(id).hide();
        }
  
    }
        
    $.fn.isValid = function(options) {
    
        return this.each(function() {
    
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
                
                if(newIsValid.isFormValid) {
                    newIsValid.options.onFormValidated();
                } else {
                    newIsValid.options.onFormInValidated();
                }
            });
			
            newIsValid.formArray.each(function (index, field) {
                $(field).blur(function() {
                    newIsValid.isValid = newIsValid.isValidField(field);
                });
            });
            
            newIsValid.$elem.find(':reset').click(function() {
                $(newIsValid.formID + ' .invalid').removeClass('invalid');
                $(newIsValid.formID + ' .form-error').hide();
                newIsValid.isFormValid = newIsValid.isFormValidated();
            });
            
        });
    }
  
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

function checkPostCode (toCheck) {

  // Permitted letters depend upon their position in the postcode.
  var alpha1 = "[abcdefghijklmnoprstuwyz]";                       // Character 1
  var alpha2 = "[abcdefghklmnopqrstuvwxy]";                       // Character 2
  var alpha3 = "[abcdefghjkpmnrstuvwxy]";                         // Character 3
  var alpha4 = "[abehmnprvwxy]";                                  // Character 4
  var alpha5 = "[abdefghjlnpqrstuwxyz]";                          // Character 5
  var BFPOa5 = "[abdefghjlnpqrst]";                               // BFPO alpha5
  var BFPOa6 = "[abdefghjlnpqrstuwzyz]";                          // BFPO alpha6
  
  // Array holds the regular expressions for the valid postcodes
  var pcexp = new Array ();
  
  // BFPO postcodes
  pcexp.push (new RegExp ("^(bf1)(\\s*)([0-6]{1}" + BFPOa5 + "{1}" + BFPOa6 + "{1})$","i"));

  // Expression for postcodes: AN NAA, ANN NAA, AAN NAA, and AANN NAA
  pcexp.push (new RegExp ("^(" + alpha1 + "{1}" + alpha2 + "?[0-9]{1,2})(\\s*)([0-9]{1}" + alpha5 + "{2})$","i"));
  
  // Expression for postcodes: ANA NAA
  pcexp.push (new RegExp ("^(" + alpha1 + "{1}[0-9]{1}" + alpha3 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$","i"));

  // Expression for postcodes: AANA  NAA
  pcexp.push (new RegExp ("^(" + alpha1 + "{1}" + alpha2 + "{1}" + "?[0-9]{1}" + alpha4 +"{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$","i"));
  
  // Exception for the special postcode GIR 0AA
  pcexp.push (/^(GIR)(\s*)(0AA)$/i);
  
  // Standard BFPO numbers
  pcexp.push (/^(bfpo)(\s*)([0-9]{1,4})$/i);
  
  // c/o BFPO numbers
  pcexp.push (/^(bfpo)(\s*)(c\/o\s*[0-9]{1,3})$/i);
  
  // Overseas Territories
  pcexp.push (/^([A-Z]{4})(\s*)(1ZZ)$/i);  
  
  // Anguilla
  pcexp.push (/^(ai-2640)$/i);

  // Load up the string to check
  var postCode = toCheck;

  // Assume we're not going to find a valid postcode
  var valid = false;
  
  // Check the string against the types of post codes
  for ( var i=0; i<pcexp.length; i++) {
  
    if (pcexp[i].test(postCode)) {
    
      // The post code is valid - split the post code into component parts
      pcexp[i].exec(postCode);
      
      // Copy it back into the original string, converting it to uppercase and inserting a space 
      // between the inward and outward codes
      postCode = RegExp.$1.toUpperCase() + " " + RegExp.$3.toUpperCase();
      
      // If it is a BFPO c/o type postcode, tidy up the "c/o" part
      postCode = postCode.replace (/C\/O\s*/,"c/o ");
      
      // If it is the Anguilla overseas territory postcode, we need to treat it specially
      if (toCheck.toUpperCase() == 'AI-2640') {postCode = 'AI-2640'};
      
      // Load new postcode back into the form element
      valid = true;
      
      // Remember that we have found that the code is valid and break from loop
      break;
    }
  }
  
  // Return with either the reformatted valid postcode or the original invalid postcode
  if (valid) {return postCode;} else return false;
}