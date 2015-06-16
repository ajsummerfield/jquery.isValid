$(document).ready(function() {

    $('form').submit(function(event) {
        return false;
    });
    
    $('#simple-form').isValid();
});