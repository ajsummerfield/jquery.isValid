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
                invalidErrorMessage: 'Username should include more characters',
                callbacks: {
                    onValidated: function(event) {
                        console.log(event);
                    },
                    onInvalidated: function(event) {
                        console.log(event);
                    }
                }
            }
        },
        validators: {
            username: {
                name: 'isUsernameValid',
                method: function(self, field) {
                    var isEmpty = self.isEmpty(field),
                        validResult = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/.test(field.val());

                    if (!isEmpty) {
                        self.settings.fieldTypes.username.activeErrorMessage = validResult ? '' : self.getErrorMessage(field, 'invalid');
                    } else {
                        self.settings.fieldTypes.username.activeErrorMessage = self.getErrorMessage(field, 'required');
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
