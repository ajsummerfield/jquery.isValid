$(document).ready(function() {

    var formOne = $('#form-one').isValid({
        general: {
            minLength: 8,
            maxLength: 12,
            errorDetails: [
                {
                    message: "Username must be at least 8 characters and no more than 12 characters long."
                }
            ],
        }
    }).data('isValid');
    
    $('#form-two').isValid();
});