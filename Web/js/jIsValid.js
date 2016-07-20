var jIsValid = function(element, options) {
    this.element = element;
    
    if (options) {
        this.options = this._extend({}, this.options, options);
    }
    
    this.init();
}

jIsValid.prototype = {

    init: function() {
        var self = this;
        this.element.classList.add('isValid');
        this.formId = this.element.id;
        this.validators.settings = this.options.fieldTypes;
        var inputElements = this.element.getElementsByTagName('input');
        var selectElements = this.element.getElementsByTagName('select');
        this.formElements = [];
        for (var i = 0; i < inputElements.length; i++) {
            this.formElements.push(inputElements[i]);
        }

        for (var i = 0; i < selectElements.length; i++) {
            this.formElements.push(selectElements[i]);
        }

        this.element.addEventListener('submit', function(e) {
            var isValid = self.validateForm(e);
            
            if (!isValid) {
                e.preventDefault();
                return false;
            }
        });

        for (var i = 0; i < this.formElements.length; i++) {
            var el = this.formElements[i];

            if (this.options.validateOnBlur) {
                el.addEventListener('blur', function(e) {
                    self.runValidation(e.target);
                });
            }

            if (this.options.validateOnKeyUp) {
                el.addEventListener('keyup', function(e) {
                    self.runValidation(e.target);
                });
            }

            el.addEventListener('change', function(e) {
                self.runValidation(e.target);
            });
        }
    },

    validateForm: function(e) {
        for (var i = 0; i < this.formElements.length; i++) {
            var el = this.formElements[i];
            this.runValidation(el);
        }

        return this.isFormValid();
    },

    runValidation: function(el) {
        var result = this.isValidField(el);
        if (result.isValid) {
            this.hideError(el);
        } else {
            this.showError(el, result.errorType);
        }
    },

    isValidField: function(el) {
        var fieldType = el.attributes['data-field-type'] ? el.attributes['data-field-type'].value : '';

        if (el.disabled || fieldType === 'not-required' || fieldType === '') {
            return {
                isValid: true
            };
        }

        if (el.attributes.type !== undefined && el.attributes.type.value === 'hidden') {
            return {
                isValid: true
            };
        }

        if (this.isEmpty(el)) {
            return {
                isValid: false,
                errorType: 'required'
            };
        }

        var methodName = 'is' + this._capitalise(fieldType) + 'Valid';
        return this.validators[methodName](el);
    },

    isEmpty: function(el) {
        if (el.value === undefined || el.value === null) {
            return true;
        }

        return el.value.length === 0;
    },

    isFormValid: function() {
        return this.element.querySelectorAll('.invalid').length === 0;
    },

    hideError: function(el) {
        var errorContainer = el.parentElement.querySelector('.form-error');
        el.classList.remove('invalid');

        if (errorContainer) {
            el.parentElement.removeChild(errorContainer);
        }
    },

    showError: function(el, errorType) {
        var errorContainer = el.parentElement.querySelector('.form-error');

        if (errorContainer) {
            errorContainer = this._updateErrorContainer(el, errorContainer, errorType);
        } else {
            errorContainer = this._createErrorContainer(el, errorType);
        }

        el.parentElement.appendChild(errorContainer);
        el.classList.add('invalid');
    },

    reset: function() {
        for (var i = 0; i < this.formElements.length; i++) {
            var el = this.formElements[i],
                errorContainer = el.parentElement.querySelector('.form-error');

            el.classList.remove('invalid');
            
            if (errorContainer) {
                el.parentElement.removeChild(errorContainer);
            }
        }
    },

    validators: {
        isGeneralValid: function(el) {
            var isEmpty = el.value.length === 0,
                errorType = isEmpty ? 'required' : '';

            return {
                isValid: !isEmpty,
                errorType: errorType
            };
        },

        isLettersValid: function (el) {
            var validResult = /^[A-Za-z ]+$/.test(el.value),
                errorType = validResult ? '' : 'format';

            return {
                isValid: validResult,
                errorType: errorType
            };
        },

        isNumbersValid: function(el) {
            var validResult = /^[0-9 ]+$/.test(el.value),
                errorType = validResult ? '' : 'format';

            return {
                isValid: validResult,
                errorType: errorType
            };
        },

        isDecimalsValid: function(el) {
            var validResult = /^(\d+\.?\d*|\.\d+)$/.test(el.value),
                errorType = validResult ? '' : 'format';

            return {
                isValid: validResult,
                errorType: errorType
            };
        },

        isEmailValid: function (el) {
            var emailMatcher = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                validResult,
                errorType;

            // Remove whitespace as some mobiles/tablets put a spacebar in if you use the autocomplete option on the device
            el.value = el.value.replace(/\s/g, '');

            validResult = emailMatcher.test(el.value);

            errorType = validResult ? '' : 'format';

            return {
                isValid: validResult,
                errorType: errorType
            };
        },

        isSelectValid: function(el) {
            var validResult = true,
                errorType;

            if (el.value === null) {
                validResult = false;
            } else if (el.value.length === 0) {
                validResult = false;
            }
            
            for(var i = 0; i < el.children.length; i++) {
                if(el.children[i].attributes.selected === undefined) {
                    validResult = false;
                } else {
                    validResult = true;
                    break;
                }
            }

            return {
                isValid: validResult,
                errorType: validResult ? '' : 'required'
            };
        },

        isCheckboxValid: function(el) {
            var validResult = el.checked,
                errorType;

            return {
                isValid: validResult,
                errorType: validResult ? '' : 'required'
            };
        },

        isRadioValid: function(el) {
            var validResult = el.checked,
                errorType;

            return {
                isValid: validResult,
                errorType: validResult ? '' : 'required'
            };
        },

        isPasswordValid: function(el) {
            var passwordMatcher = '',
            validResult = true,
            errorType;

            if (this.settings.password.lowercase) {
                passwordMatcher += '(?=.*[a-z])';
            }
            
            if (this.settings.password.uppercase) {
                passwordMatcher += '(?=.*[A-Z])';
            }
            
            if (this.settings.password.numbers) {
                passwordMatcher += '(?=.*[0-9])';
            }
            
            if (this.settings.password.specialChars) {
                passwordMatcher += '(?=.*[!@#$%^&*_\\-\\+\\=\\.])';
            }
            
            passwordMatcher = new RegExp('^' + passwordMatcher + '(?=.{' + this.settings.password.minLength + ',' + this.settings.password.maxLength + '})');
            
            validResult = passwordMatcher.test(el.value);

            return {
                isValid: validResult,
                errorType: validResult ? '' : 'format'
            };
        }
    },

    _createErrorContainer: function(el, errorType) {
        var errorContainer = document.createElement('div');
        var errorMessage = this._getErrorMessage(el, errorType);
        errorContainer.setAttribute('class', 'form-error');
        errorContainer.innerHTML = errorMessage;

        return errorContainer;
    },

    _updateErrorContainer: function(el, errorContainer, errorType) {
        var errorMessage = this._getErrorMessage(el, errorType);
        errorContainer.innerHTML = errorMessage;

        return errorContainer;
    },

    _getErrorMessage: function(el, errorType) {
        var htmlAttr = el.attributes['data-' + errorType + '-error-message'];

        if (htmlAttr) {
            return htmlAttr.value;
        }

        var errorProperty = errorType + 'ErrorMessage';
        var fieldType = el.attributes['data-field-type'] ? el.attributes['data-field-type'].value : '';
        return this.options.fieldTypes[fieldType][errorProperty];
    },

    _capitalise: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    _extend: function(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];

            if (!obj) {
                continue;
            }

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object') {
                        out[key] = this._extend(out[key], obj[key]);
                    } else {
                        out[key] = obj[key];
                    }
                }
            }
        }

        return out;
    },

    options: {
        validateOnBlur: true,
        validateOnKeyUp: true,
        fieldTypes: {
            general: {
                required: true,
                requiredErrorMessage: 'Field is required'
            },
            letters: {
                required: true,
                requiredErrorMessage: 'Field is required',
                formatErrorMessage: 'Field is letters only'
            },
            numbers: {
                required: true,
                requiredErrorMessage: 'Field is required',
                formatErrorMessage: 'Field is numbers only'
            },
            decimals: {
                required: true,
                requiredErrorMessage: 'Field is required',
                formatErrorMessage: 'Field is decimals or whole numbers only'
            },
            email: {
                required: true,
                requiredErrorMessage: 'Field is required',
                formatErrorMessage: 'Field should be a valid email address'
            },
            select: {
                required: true,
                requiredErrorMessage: 'Field is required'
            },
            password: {
                required: true,
                minLength: 8,
                maxLength: 100,
                numbers: true,
                uppercase: true,
                lowercase: true,
                specialChars: false,
                requiredErrorMessage: 'Password is required',
                formatErrorMessage: 'Password should contain numbers and both upper and lowercase letters'
            }
        }
    }
};