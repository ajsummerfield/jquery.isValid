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
    
    var testFunction = function() {
    
        alert("test");
    };
    
    var formOne = $('#form-one').isValid({
        password: {
            numbers: true,
            passwordConfirm: true
        },
        email: {
            emailConfirm: true
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
    
    $('#test-one').testPlugin();
    $('#test-two').testPlugin({
        two: {
            validators: {
                stringLength: {
                    min: 5,
                    max: 10,
                    message: 'Must be > 5 but < 10'
                }
            }
        }
    });
    
});

(function ($) {
    "use strict";
    
    $.testPlugin = function(element, options) {
    
        var self;
        
        this.init = function() {
            
            this.elem = $(element);
            this.options = $.extend(true, {}, $.testPlugin.defaults, options);
            
            console.log(this.options);
        };
        
        this.addValidator = function(validator) {
        
            $.extend(this.options.validators, { testFunction: validator });
        };
    };
    
     $.fn.testPlugin = function (options) {

        return this.each(function () {
            
            var testPlugin = new $.testPlugin(this, options);
            $(this).data('testPlugin', testPlugin);

            testPlugin.init();
        });
     };
    
    $.testPlugin.defaults = {
        one: 1
    };
    
})(jQuery);