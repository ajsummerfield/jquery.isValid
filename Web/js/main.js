$(document).ready(function() {

    var simpleForm = $('#simple-form').isValid({
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
        showErrorMessages: false
    }).data('isValid');
    
    
    var formOne = $('#form-one').isValid({
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
    });
    
    $('#subject').select2({
        minimumResultsForSearch: 999999
    });
    
    $('#role').selectize();
    
    $('#datepicker').datepicker({
        dateFormat: 'dd/mm/yy'
    });
    
});