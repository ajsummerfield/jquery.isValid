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
            self.validateForm(e);
        });
    },

    validateForm: function(e) {
        for (var i = 0; i < this.formElements.length; i++) {
            var el = this.formElements[i];
            var result = this.isValidField(el);
            if (result.isValid) {
                this.hideError(el);
            } else {
                this.showError(el);
            }
        }

        return this.isFormValid();
    },

    isValidField: function(element) {
        var fieldType = element.attributes['data-field-type'].value;
        return this.validators.isGeneralValid(element);
    },

    isFormValid: function() {
        for (var i = 0; i < this.element.children; i++) {
            var child = this.element.children[i];
            
        }
    },

    hideError: function(el) {

    },

    showError: function(el) {

    },

    validators: {
        isGeneralValid: function(el) {
            var isEmpty = el.value.length === 0,
                errorType = isEmpty ? 'required' : '';

            return {
                isValid: !isEmpty
            };
        }
    }
};