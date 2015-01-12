describe("jQuery.isValid Tests", function() {
    
    var formOne;
    
    document.write("<form id='test-form' action='' method='post' class='left-col-75' style='display: none;'><div class='form-row'><label>Test</label><input type='text' id='empty' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='letters' data-field-info='letters' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='numbers' data-field-info='numbers' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='email' data-field-info='email' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='username' data-field-info='username' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='password' data-field-info='password' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='dob' data-field-info='dateofbirth' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='postcode' data-field-info='postcode' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='mobile' data-field-info='mobile' placeholder='Enter something' /></div></form>");
    
    beforeEach(function() {
        formOne = $('#test-form').isValid().data('isValid');
    });
    
    describe("isEmpty", function() {
        it("Returns true if input is empty", function() {
            expect(formOne.isEmpty('#empty')).toBe(true);
        });
    });
    
    describe("isLetters", function() {
        it("Returns true if field is only letters", function() {
            $('#letters').val('Test');
            expect(formOne.isLetters('#letters')).toBe(true);
        });
    });
    
    describe("isNumbers", function() {
        it("Returns true if input is only numbers", function() {
            $('#numbers').val('12345');
            expect(formOne.isNumbers('#numbers')).toBe(true);
        });
    });
    
    describe("isEmailValid", function() {
        it("Returns true if input is a valid email address", function() {
            $('#email').val('aj.summerfield93@gmail.com');
            expect(formOne.isEmailValid('#email')).toBe(true);
        });
    });
    
    describe("isUsernameValid", function() {
        it("Returns true if input is a valid username", function() {
            $('#username').val('AjDrummer93');
            expect(formOne.isUsernameValid('#username')).toBe(true);
        });
    });
    
    describe("isPasswordValid", function() {
        it("Returns true if input is a valid username", function() {
            $('#password').val('Pa55W0rD');
            expect(formOne.isPasswordValid('#password')).toBe(true);
        });
    });
    
    describe("isDateValid", function() {
        it("Returns true if input is a valid date", function() {
            $('#dob').val('18/07/1993');
            expect(formOne.isDateValid('#dob')).toBe(true);
        });
    });
    
    describe("isPostCodeValid", function() {
        it("Returns true if input is a valid postcode", function() {
            $('#postcode').val('SG5 3XB');
            expect(formOne.isPostCodeValid('#postcode')).toBe(true);
        });
    });
    
    describe("isMobileValid", function() {
        it("Returns true if input is a valid username ", function() {
            $('#mobile').val('07123456789');
            expect(formOne.isMobileValid('#mobile')).toBe(true);
        });
    });
    
});