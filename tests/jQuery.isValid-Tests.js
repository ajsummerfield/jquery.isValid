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

		describe('jQuery.isValid - Empty Fields', function() {

				it('Should show the requiredErrorMessage for the fieldType General', function() {
						
				});
		});

});
