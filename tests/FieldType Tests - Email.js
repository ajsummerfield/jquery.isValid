describe('jQuery.isValid - FieldType: Email', function() {

    var el, testForm;

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'base/tests';
        loadFixtures('test-forms.html');
        el = $('#isValid-Test-Form');
        testForm = el.isValid().data('isValid');
    });

    it('Should invalidate field because its invalid', function() {
        var result = testForm.isEmailValid($('#email').val('abc'));
        expect(result.isValid).toBe(false);
        expect(result.activeErrorType).toBe('invalid');
    });

    it('Should validate field', function() {
        var result = testForm.isEmailValid($('#email').val('email@email.com'));
        expect(result.isValid).toBe(true);
        expect(result.activeErrorType).toBe('');
    });
});
