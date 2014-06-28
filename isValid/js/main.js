$(document).ready(function() {

    $('#form-one').isValid({
        username: {
            minLength: 8,
            lengthErrorMessage: "Username must be at least 8 characters long."
        },
        onFormValidated: function() {
            alert('Form valid!');
        }
    });
    $('#form-two').isValid({
        email: {
            domain: "@gmail.com",
            showDomainError: true
        }
    });
    
});