$(document).ready(function() {

    $('#form-one').isValid({
        username: {
            minLength: 8,
            lengthErrorMessage: "Username must be at least 8 characters."
        },
        password: {
            minLength: 6,
            lengthErrorMessage: "Password must be at least 6 characters."
        }
    });
    $('#form-two').isValid();
    
});