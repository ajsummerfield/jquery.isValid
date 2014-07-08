$(document).ready(function() {

    $('#form-one').isValid({
        username: {
            minLength: 8,
            lengthErrorMessage: "Username must be at least 8 characters long."
        },
        onFormValidated: function() {
            alert('Form valid!');
        },
        onFormInValidated: function() {
            alert('Form invalid!');
        }
    });
    
    $('#form-two').isValid({
        username: {
            minLength: 7,
            lengthErrorMessage: "Username must be at least 7 characters long."
        },
        email: {
            domain: "@gmail.com",
            showDomainError: true
        }
    });
    
});