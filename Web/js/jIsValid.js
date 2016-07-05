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
                self.runValidation(el);
            });

            el.addEventListener('keyup', function(e) {
                self.runValidation(el);
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
            this.showError(el);
        }
    },

    isValidField: function(el) {
        var fieldType = el.attributes['data-field-type'].value;
        return this.validators.isGeneralValid(el);
    },

    isFormValid: function() {
        return this.element.querySelectorAll('.invalid').length === 0;
    },

    hideError: function(el) {
        var errorContainer = el.parentElement.querySelector('.error-message');
        el.classList.remove('invalid');

        if (errorContainer) {
            errorContainer.remove();
        }
    },

    showError: function(el) {
        var errorContainer = el.parentElement.querySelector('.error-message');

        if (errorContainer) {
            errorContainer = this._updateErrorContainer(el, errorContainer);
        } else {
            errorContainer = this._createErrorContainer(el);
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
        }
    },

    _createErrorContainer: function(el) {
        var errorContainer = document.createElement('div');
        var errorMessage = el.attributes['data-error-message'].value;
        errorContainer.setAttribute('class', 'error-message');
        errorContainer.innerHTML = errorMessage;

        return errorContainer;
    },

    _updateErrorContainer: function(el, errorContainer) {
        var errorMessage = el.attributes['data-error-message'].value;
        errorContainer.innerHTML = errorMessage;

        return errorContainer;
    }
};