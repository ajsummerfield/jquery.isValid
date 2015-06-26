$(document).ready(function() {

    var simpleForm = $('#simple-form').isValid({
        fieldTypes: {
            general: {
                callbacks: {
                    onValidated: function(event) {
                        console.log(event);
                    },
                    onInvalidated: function(event) {
                        console.log(event);
                    }
                }
            },
            username: {
                activeErrorMessage: '',
                requiredErrorMessage: 'Username is required',
                customErrorMessage: 'Username should include more characters',
                callbacks: {
                    onValidated: function(event) {},
                    onInvalidated: function(event) {}
                }
            },
            idNumber: {
                activeErrorMessage: '',
                requiredErrorMessage: 'Please specify your ID Number',
                formatErrorMessage: 'ID Number is incorrect format',
                callbacks: {
                    onValidated: function(event) {},
                    onInvalidated: function(event) {}
                }
            }
        },
        errorTypes: {
            custom: 'customErrorMessage'
        },
        validators: {
            username: {
                name: 'isUsernameValid',
                method: function(self, field) {

                    var isEmpty = self.isEmpty(field),
                        validResult = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/.test(field.val());

                    if (!isEmpty) {
                        self.settings.fieldTypes.username.activeErrorMessage = validResult ? '' : self.getErrorMessage(field, 'custom');
                    } else {
                        self.settings.fieldTypes.username.activeErrorMessage = self.getErrorMessage(field, 'required');
                    }

                    return !isEmpty && validResult;
                }
            },
            idNumber: {
                name: 'isIDNumberValid',
                method: function(self, field) {

                    var isEmpty = self.isEmpty(field);
                        validResult = field.val().length === 6 && /^[0-9]+$/.test(field.val());

                    if (!isEmpty) {
                        self.settings.fieldTypes.idNumber.activeErrorMessage = validResult ? '' : self.getErrorMessage(field, 'format');
                    } else {
                        self.settings.fieldTypes.idNumber.activeErrorMessage = self.getErrorMessage(field, 'required');
                    }

                    return !isEmpty && validResult;
                }
            }
        },
        enableErrorMessages: true
    }).data('isValid');


    var formOne = $('#form-one').isValid({
        fieldTypes: {
            password: {
                numbers: true,
                passwordConfirm: true
            },
            email: {
                emailConfirm: true,
                domain: 'gmail.com'
            },
            emailConfirm: {
                invalidErrorMessage: 'Do not match'
            },
            date: {
                allowFutureDates: false,
                invalidErrorMessage: 'Invalid Date entered'
            }
        }
    });

    $('#subject').select2({
        minimumResultsForSearch: 999999
    });

    $('#role').selectize();

    $('#datepicker').datepicker({
        dateFormat: 'dd/mm/yy'
    });

});
