describe('jQuery.isValid - FieldType: Password', function() {

    var el, testForm;

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'base/tests';
        loadFixtures('test-forms.html');
        el = $('#isValid-Test-Form');
        testForm = el.isValid().data('isValid');
    });

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
