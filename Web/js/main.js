$(document).ready(function() {

    var simpleForm = $('#simple-form').isValid({
        fieldTypes: {
            general: {
              requiredErrorMessage: false,
            },
            username: {
                requiredErrorMessage: 'Username is required',
                customErrorMessage: 'Username should include more characters',
            },
            idNumber: {
                requiredErrorMessage: 'Please specify your ID Number',
                formatErrorMessage: 'ID Number is incorrect format',
                callbacks: {
                    onValidated: function(event) {
                        console.log(event);
                    }
                }
            }
        },
        errorTypes: {
            custom: 'customErrorMessage'
        },
        customValidators: {
            username: {
                name: 'isUsernameValid',
                validate: function(field) {

                    var validResult = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/.test(field.val()),
                        errorType = validResult ? '' : 'custom';

                    return {
                        isValid: validResult,
                        activeErrorType: errorType
                    };
                }
            },
            idNumber: {
                name: 'isIDNumberValid',
                validate: function(field) {

                    var validResult = field.val().length === 6 && /^[0-9]+$/.test(field.val()),
                        errorType = validResult ? '' : 'format';

                    return {
                        isValid: validResult,
                        activeErrorType: errorType
                    };
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
