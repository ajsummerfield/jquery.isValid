$(document).ready(function() {

    $('#form-one').isValid({
        invalidClass: 'blurr',
        username: {
            minLength: 8,
            lengthErrorMessage: "Username must be at least 8 characters and no more than 12 characters long."
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
            maxLength: 144,
            lengthErrorMessage: "Username must be at least 7 characters and no more than 144 characters long."
        },
        email: {
            domain: "@gmail.com",
            showDomainError: true
        }
    });
    
});