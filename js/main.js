$(document).ready(function() {

    $('form').submit(function(event) {
        return false;
    });

    $('#simple-form').isValid();

    $('#complex-form').isValid({
        password: {
            numbers: true,
            passwordConfirm: true
        },
        email: {
            emailConfirm: true
        },
        emailConfirm: {
            invalidErrorMessage: 'Do not match'
        },
        date: {
            allowFutureDates: false,
            invalidErrorMessage: 'Invalid Date entered'
        }
    });

    $('#validator-form').isValid({
        fieldTypes: {
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
        validators: {
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
        }
    });
});
