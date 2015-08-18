describe('jQuery.isValid - FieldType: Email Confirm', function() {

    var el, testForm;

    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'base/tests';
        loadFixtures('test-forms.html');
        el = $('#isValid-Test-Form');
        testForm = el.isValid().data('isValid');
        $('#email').val('email@email.com');
    });

    it('Should invalidate field because its invalid', function() {
        var result = testForm.isEmailConfirmValid($('#emailConfirm').val('email@email.co.uk'));
        expect(result.isValid).toBe(false);
        expect(result.activeErrorType).toBe('invalid');
    });

    it('Should validate field', function() {
        var result = testForm.isEmailConfirmValid($('#emailConfirm').val('email@email.com'));
        expect(result.isValid).toBe(true);
        expect(result.activeErrorType).toBe('');
    });
});
