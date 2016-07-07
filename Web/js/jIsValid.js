var jIsValid = function(element, options) {
    this.element = element;
    this.options = options;
    
    this.init();
}

jIsValid.prototype = {

    init: function() {
        let self = this;
        this.element.classList.add('isValid');
        this.formId = this.element.id;
        this.formElements = document.getElementsByTagName('input');
        this.element.addEventListener('submit', function(e) {
            var isValid = self.validateForm(e);
            
            if (!isValid) {
                e.preventDefault();
                return false;
            }
        });

        for (var i = 0; i < this.formElements.length; i++) {
            var el = this.formElements[i];

            el.addEventListener('blur', function(e) {
                self.runValidation(e.target);
            });

            el.addEventListener('keyup', function(e) {
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

        if (el.disabled || el.attributes.type.value === 'hidden' || fieldType === 'not-required' || fieldType === '') {
            return {
                isValid: true
            };
        }

        var methodName = 'is' + this._capitalise(fieldType) + 'Valid';
        return this.validators[methodName](el);
    },

    isFormValid: function() {
        return this.element.querySelectorAll('.invalid').length === 0;
    },

    hideError: function(el) {
        var errorContainer = el.parentElement.querySelector('.form-error');
        el.classList.remove('invalid');

        if (errorContainer) {
            errorContainer.remove();
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
        }
    },

    _createErrorContainer: function(el, errorType) {
        var errorContainer = document.createElement('div');
        var errorMessage = el.attributes['data-' + errorType + '-error-message'].value;
        errorContainer.setAttribute('class', 'form-error');
        errorContainer.innerHTML = errorMessage;

        return errorContainer;
    },

    _updateErrorContainer: function(el, errorContainer, errorType) {
        var errorMessage = el.attributes['data-' + errorType + '-error-message'].value;
        errorContainer.innerHTML = errorMessage;

        return errorContainer;
    },

    _capitalise: function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
};