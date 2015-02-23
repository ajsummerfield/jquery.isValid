$(document).ready(function() {

    var formOne = $('#form-one').isValid({
        general: {
            minLength: 8,
            maxLength: 12,
            errorDetails: [
                {
                    id: "-username-error",
                    message: "Username must be at least 8 characters and no more than 12 characters long."
                },
                {
                    id: "-other-error",
                    type: "length",
                    message: "other error"
                },
                {
                    id: "-something-error",
                    type: "length",
                    message: "Something error"
                }
            ],
        }
    }).data('isValid');
    
    $('#form-two').isValid();
});