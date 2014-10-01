describe("jQuery.isValid Tests", function() {
    
    describe("isEmpty", function() {
        it("Returns true if input is empty", function() {
            var formOne = $('#test-form').isValid().data('isValid');
            expect(formOne.isEmpty('#empty')).toBe(true);
        });
    });
    
    describe("isLetters", function() {
        it("Returns true if field is only letters", function() {
            var formOne = $('#test-form').isValid().data('isValid');
            $('#letters').val('Test');
            expect(formOne.isLetters('#letters')).toBe(true);
        });
    });
    
    describe("isNumbers", function() {
        it("Returns true if input is only numbers", function() {
            var formOne = $('#test-form').isValid().data('isValid');
            $('#numbers').val('12345');
            expect(formOne.isNumbers('#numbers')).toBe(true);
        });
    });
    
    describe("isEmailValid", function() {
        it("Returns true if input is a valid email address", function() {
            var formOne = $('#test-form').isValid().data('isValid');
            $('#email').val('aj.summerfield93@gmail.com');
            expect(formOne.isEmailValid('#email')).toBe(true);
        });
    });
    
    describe("isUsernameValid", function() {
        it("Returns true if input is a valid username", function() {
            var formOne = $('#test-form').isValid().data('isValid');
            $('#username').val('AjDrummer93');
            expect(formOne.isUsernameValid('#username')).toBe(true);
        });
    });
    
    describe("isPasswordValid", function() {
        it("Returns true if input is a valid username", function() {
            var formOne = $('#test-form').isValid().data('isValid');
            $('#password').val('Pa55W0rD');
            expect(formOne.isPasswordValid('#password')).toBe(true);
        });
    });
    
    describe("isDateOfBirthValid", function() {
        it("Returns true if input is a valid date", function() {
            var formOne = $('#test-form').isValid().data('isValid');
            $('#dob').val('18/07/1993');
            expect(formOne.isDateOfBirthValid('#dob')).toBe(true);
        });
    });
    
    describe("isPostCodeValid", function() {
        it("Returns true if input is a valid postcode", function() {
            var formOne = $('#test-form').isValid().data('isValid');
            $('#postcode').val('SG5 3XB');
            expect(formOne.isPostCodeValid('#postcode')).toBe(true);
        });
    });
    
    describe("isMobileValid", function() {
        it("Returns true if input is a valid username ", function() {
            var formOne = $('#test-form').isValid().data('isValid');
            $('#mobile').val('07123456789');
            expect(formOne.isMobileValid('#mobile')).toBe(true);
        });
    });
    
});