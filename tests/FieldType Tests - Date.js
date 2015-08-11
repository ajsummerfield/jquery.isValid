describe('jQuery.isValid - FieldType: Date', function() {

    var el, testForm;

    beforeEach(function(){
        jasmine.getFixtures().fixturesPath = 'base/tests';
        loadFixtures('test-forms.html');
        el = $('#isValid-Test-Form');
        testForm = el.isValid().data('isValid');
    });

    it('Should invalidate field because its invalid', function() {
        var result = testForm.isDateValid($('#datepicker').val('date'));
        expect(result.isValid).toBe(false);
        expect(result.activeErrorType).toBe('invalid');
    });

    it('Should validate field', function() {
        var result = testForm.isDateValid($('#datepicker').val('01/01/2015'));
        expect(result.isValid).toBe(true);
        expect(result.activeErrorType).toBe('');
    });
});
