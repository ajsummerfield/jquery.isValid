$(document).ready(function() {

    var formOne = $('#form-one').isValid({
        username: {
            minLength: 8,
            lengthErrorMessage: "Username must be at least 8 characters and no more than 12 characters long."
        }
    }).data('isValid');
    
    $('#form-two').isValid({
        username: {
            minLength: 7,
            maxLength: 144,
            lengthErrorMessage: "Username must be at least 7 characters and no more than 144 characters long."
        }
    });
});