describe("jQuery.isValid Tests", function() {
    
        
    var formOne;
    
    document.write("<form id='test-form' action='' method='post' class='left-col-75' style='display: none;'><div class='form-row'><label>Test</label><input type='text' id='empty' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='letters' data-field-type='letters' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='numbers' data-field-type='numbers' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='email' data-field-type='email' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='username' data-field-type='general' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='password' data-field-type='password' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='dob' data-field-type='date' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='postcode' data-field-type='postcode' placeholder='Enter something' /></div><div class='form-row'><label>Test</label><input type='text' id='mobile' data-field-type='mobile' placeholder='Enter something' /></div></form>");
    
    beforeEach(function() {
        formOne = $('#test-form').isValid().data('isValid');
    });
    
    describe("isEmpty", function() {
        
        it("Returns false if input is empty", function() {
            expect(formOne.isEmpty('#empty')).toBe(true);
        });
        
        it("Returns true if input is empty", function() {
            $('#empty').val("not empty");
            expect(formOne.isEmpty('#empty')).toBe(true);
        });
    });
    
    describe("isLetters", function() {
        
        it("Returns true if field is only letters", function() {
            $('#letters').val('Test');
            expect(formOne.isLetters('#letters')).toBe(true);
        });
        
        it("Returns false if field contains other characters other than letters", function() {
            $('#letters').val('Test123');
            expect(formOne.isLetters('#letters')).toBe(false);
        });
    });
    
    describe("isNumbers", function() {
        
        it("Returns true if input is only numbers", function() {
            $('#numbers').val('12345');
            expect(formOne.isNumbers('#numbers')).toBe(true);
        });
        
        it("Returns false if input contains other characters other than number", function() {
            $('#numbers').val('12345abc');
            expect(formOne.isNumbers('#numbers')).toBe(false);
        });
    });
    
    describe("isEmailValid", function() {
        
        it("Returns true if input is a valid email address", function() {
            $('#email').val('aj.summerfield93@gmail.com');
            expect(formOne.isEmailValid('#email')).toBe(true);
        });
        
        it("Returns false if input is an invalid email address", function() {
            $('#email').val('email.com');
            expect(formOne.isEmailValid('#email')).toBe(false);
        });
        
        it("Returns true if input uses a valid domain email address", function() {
            formOne = $('#test-form').isValid({
                email: {
                    domain: "@gmail.com"
                }
            }).data('isValid');
            $('#email').val('aj.summerfield93@gmail.com');
            expect(formOne.isEmailValid('#email')).toBe(true);
        });
        
        it("Returns false if input uses an invalid domain email address", function() {
            formOne = $('#test-form').isValid({
                email: {
                    domain: "@gmail.com"
                }
            }).data('isValid');
            $('#email').val('aj.summerfield93@email.com');
            expect(formOne.isEmailValid('#email')).toBe(false);
        });
    });
    
    describe("isGeneralValid", function() {
        
        it("Returns true if input is a valid input", function() {
            $('#username').val('AjDrummer93');
            expect(formOne.isGeneralValid('#username')).toBe(true);
        });
        
        it("Returns false if input is an invalid input", function() {
            $('#username').val('');
            expect(formOne.isGeneralValid('#username')).toBe(false);
        });
    });
    
    describe("isPasswordValid", function() {
        
        it("Returns true if input is a valid password", function() {
            $('#password').val('Pa55W0rD');
            expect(formOne.isPasswordValid('#password')).toBe(true);
        });
        
        it("Returns false if input is not a long enough password", function() {
            $('#password').val('Pa55');
            expect(formOne.isPasswordValid('#password')).toBe(false);
        });
        
        it("Returns false if input is not a valid password", function() {
            formOne = $('#test-form').isValid({
                password: {
                    numbers: true,
                    errorDetails: [
                        {
                            type: "invalid",
                            show: true
                        }
                    ]
                }
            }).data('isValid');
            $('#password').val('Password');
            expect(formOne.isPasswordValid('#password')).toBe(false);
        });
    });
    
    describe("isDateValid", function() {
        
        it("Returns true if input is a valid date", function() {
            $('#dob').val('18/07/1993');
            expect(formOne.isDateValid('#dob')).toBe(true);
        });
        
        it("Returns false if input is an invalid date", function() {
            $('#dob').val('07/18/1993');
            expect(formOne.isDateValid('#dob')).toBe(false);
        });
    });
    
    describe("isPostCodeValid", function() {
        
        it("Returns true if input is a valid postcode", function() {
            $('#postcode').val('SG5 3XB');
            expect(formOne.isPostCodeValid('#postcode')).toBe(true);
        });
        
        it("Returns false if input is an invalid postcode", function() {
            $('#postcode').val('123 ABC');
            expect(formOne.isPostCodeValid('#postcode')).toBe(false);
        });
    });
    
    describe("isMobileValid", function() {
        
        it("Returns true if input is a valid mobile number (UK)", function() {
            $('#mobile').val('07123456789');
            expect(formOne.isMobileValid('#mobile')).toBe(true);
        });
        
        it("Returns false if input is an invalid mobile number (UK) ", function() {
            $('#mobile').val('0712345678');
            expect(formOne.isMobileValid('#mobile')).toBe(false);
        });
    });
    
});