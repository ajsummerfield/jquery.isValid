describe('jQuery.isValid - FieldType: Select', function() {

    var el, testForm;

    beforeEach(function(){
        jasmine.getFixtures().fixturesPath = 'base/tests';
        loadFixtures('test-forms.html');
        el = $('#isValid-Test-Form');
        testForm = el.isValid().data('isValid');
    });

    it('Should invalidate field because its required', function() {
        var result = testForm.isSelectChosen($('#subject'));
        expect(result.isValid).toBe(false);
        expect(result.activeErrorType).toBe('required');
    });

    it('Should validate field', function() {
        var result = testForm.isSelectChosen($('#subject').val('Question'));
        expect(result.isValid).toBe(true);
        expect(result.activeErrorType).toBe('');
    });
});
