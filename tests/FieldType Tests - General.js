describe('jQuery.isValid - FieldType: General', function() {

    var el, testForm;

    beforeEach(function(){
        jasmine.getFixtures().fixturesPath = 'base/tests';
        loadFixtures('test-forms.html');
        el = $('#isValid-Test-Form');
        testForm = el.isValid().data('isValid');
    });

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
