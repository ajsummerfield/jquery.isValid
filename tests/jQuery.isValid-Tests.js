describe('jQuery.isValid Initialisation', function() {

		var el, testForm;

		beforeEach(function(){
				jasmine.getFixtures().fixturesPath = 'base/tests';
				loadFixtures('test-forms.html');
				el = $('#isValid-Test-Form');
				testForm = el.isValid().data('isValid');
	  });

	  it('Should add the class "isValid" to the element', function() {
				expect(el.hasClass('isValid')).toBe(true);
	  });

		describe('jQuery.isValid - FieldType: General', function() {

				it('Should invalidate field because its empty', function() {
						var result = testForm.isGeneralValid($('#general'));
						expect(result.isValid).toBe(false);
						expect(result.activeErrorType).toBe('required');
				});

				it('Should validate field', function() {
						var result = testForm.isGeneralValid($('#general').val('abc'));
						expect(result.isValid).toBe(true);
						expect(result.activeErrorType).toBe('');
				});
		});

		describe('jQuery.isValid - FieldType: Letters', function() {

				it('Should invalidate field because its invalid', function() {
						var result = testForm.isLetters($('#letters').val('123'));
						expect(result.isValid).toBe(false);
						expect(result.activeErrorType).toBe('invalid');
				});

				it('Should validate field', function() {
						var result = testForm.isLetters($('#letters').val('abc'));
						expect(result.isValid).toBe(true);
						expect(result.activeErrorType).toBe('');
				});
		});

		describe('jQuery.isValid - FieldType: Numbers', function() {

				it('Should invalidate field because its invalid', function() {
						var result = testForm.isNumbers($('#numbers').val('abc'));
						expect(result.isValid).toBe(false);
						expect(result.activeErrorType).toBe('invalid');
				});

				it('Should validate field', function() {
						var result = testForm.isNumbers($('#numbers').val('123'));
						expect(result.isValid).toBe(true);
						expect(result.activeErrorType).toBe('');
				});
		});

		describe('jQuery.isValid - FieldType: Decimals', function() {

				it('Should invalidate field because its invalid', function() {
						var result = testForm.isDecimals($('#decimals').val('abc'));
						expect(result.isValid).toBe(false);
						expect(result.activeErrorType).toBe('invalid');
				});

				it('Should validate field', function() {
						var result = testForm.isDecimals($('#decimals').val('1.23'));
						expect(result.isValid).toBe(true);
						expect(result.activeErrorType).toBe('');
				});
		});

		describe('jQuery.isValid - FieldType: Age', function() {

				it('Should invalidate field because its invalid', function() {
						var result = testForm.isAgeValid($('#age').val('abc'));
						expect(result.isValid).toBe(false);
						expect(result.activeErrorType).toBe('invalid');
				});

				it('Should validate field', function() {
						var result = testForm.isAgeValid($('#age').val('75'));
						expect(result.isValid).toBe(true);
						expect(result.activeErrorType).toBe('');
				});
		});

		describe('jQuery.isValid - FieldType: Password', function() {

				it('Should invalidate field because its invalid', function() {
						var result = testForm.isPasswordValid($('#password').val('abc'));
						expect(result.isValid).toBe(false);
						expect(result.activeErrorType).toBe('invalid');
				});

				it('Should validate field', function() {
						var result = testForm.isPasswordValid($('#password').val('password'));
						expect(result.isValid).toBe(true);
						expect(result.activeErrorType).toBe('');
				});
		});

});
