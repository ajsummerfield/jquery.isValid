$(document).ready(function() {

    var formOne = $('#form-one').isValid({
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
    
//    $('#form-two').isValid();
//  
//        general: {
//            minLength: 8,
//            maxLength: 12,
//            errorDetails: [
//                {
//                    id: "-username-error",
//                    type: "length",
//                    message: "Username must be at least 8 characters and no more than 12 characters long.",
//                    show: false
//                },
//                {
//                    id: "-other-error",
//                    type: "length",
//                    message: "other error"
//                },
//                {
//                    id: "-something-error",
//                    type: "length",
//                    message: "Something error"
//                }
//            ],
//        },
//        password: {
//            errorDetails: [
//                {
//                    type: "invalid",
//                    show: false
//                }
//            ]
//        },
//        passwordconfirm: {
//            errorDetails: [
//                {
//                    type: "invalid",
//                    show: false
//                }
//            ]
//        }
//    }).data('isValid');
//    
//    $('#form-two').isValid();
});