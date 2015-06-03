$(document).ready(function() {

    var formOne = $('#form-one').isValid({
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
        password: {
            numbers: true,
            passwordConfirm: true
        },
        email: {
            emailConfirm: true,
            domain: '@gmail.com'
        },
        emailConfirm: {
            invalidErrorMessage: 'Do not match'
        },
        date: {
            allowFutureDates: false,
            invalidErrorMessage: 'Invalid Date entered'
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